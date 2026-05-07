import json
import logging
import os
from collections import Counter, defaultdict

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


class RecognitionService:
    def __init__(self):
        self.model = None
        self.model_path = settings.GESTURE_MODEL_PATH
        self.dataset_path = settings.GESTURE_DATASET_PATH
        self._ensure_dirs()
        self.load_model()

    def _ensure_dirs(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        os.makedirs(os.path.dirname(self.dataset_path), exist_ok=True)

    def normalize_landmarks(self, hand_data):
        if not hand_data:
            return []

        landmarks = hand_data["landmarks"] if isinstance(hand_data, dict) else hand_data
        handedness = hand_data.get("handedness", "Unknown") if isinstance(hand_data, dict) else "Unknown"

        wrist = landmarks[0]
        centered = []
        for point in landmarks:
            centered.append([
                point["x"] - wrist["x"],
                point["y"] - wrist["y"],
                point["z"] - wrist["z"],
            ])

        arr = np.array(centered, dtype=np.float32)
        scale = np.max(np.linalg.norm(arr[:, :2], axis=1))
        if scale < 1e-6:
            return []

        arr = arr / scale

        # Mirror right hands so the model sees a more consistent orientation.
        if handedness.lower() == "right":
            arr[:, 0] = -arr[:, 0]

        root_to_middle = np.linalg.norm(arr[12, :2])
        root_to_index = np.linalg.norm(arr[8, :2])
        palm_width = np.linalg.norm(arr[17, :2] - arr[5, :2])
        finger_spread = np.linalg.norm(arr[8, :2] - arr[20, :2])

        extras = np.array(
            [root_to_middle, root_to_index, palm_width, finger_spread],
            dtype=np.float32,
        )
        return np.concatenate([arr.flatten(), extras]).tolist()

    def append_sample(self, label, hand_data):
        vector = self.normalize_landmarks(hand_data)
        if not vector:
            raise ValueError("Unable to extract landmarks from current frame")

        entry = {"label": label, "vector": vector}
        with open(self.dataset_path, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry) + "\n")
        return len(vector)

    def load_dataset(self):
        if not os.path.exists(self.dataset_path):
            return []

        samples = []
        with open(self.dataset_path, "r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    item = json.loads(line)
                    if item.get("label") and item.get("vector"):
                        samples.append(item)
                except json.JSONDecodeError:
                    continue
        return samples

    def train_model(self, min_samples_per_label=8, neighbors=5):
        samples = self.load_dataset()
        grouped = defaultdict(list)
        for sample in samples:
            grouped[sample["label"]].append(sample["vector"])

        filtered = {label: vectors for label, vectors in grouped.items() if len(vectors) >= min_samples_per_label}
        if len(filtered) < 2:
            raise ValueError("Need at least 2 gesture classes with enough samples to train a model")

        model = {
            "type": "knn_landmark_classifier",
            "neighbors": neighbors,
            "min_samples_per_label": min_samples_per_label,
            "labels": sorted(filtered.keys()),
            "samples": [],
            "centroids": {},
            "counts": {},
        }

        for label, vectors in filtered.items():
            arr = np.array(vectors, dtype=np.float32)
            centroid = np.mean(arr, axis=0).tolist()
            model["centroids"][label] = centroid
            model["counts"][label] = len(vectors)
            for vector in vectors:
                model["samples"].append({"label": label, "vector": vector})

        with open(self.model_path, "w", encoding="utf-8") as handle:
            json.dump(model, handle)

        self.model = model
        return {
            "labels": model["labels"],
            "sample_counts": model["counts"],
            "total_samples": len(model["samples"]),
            "neighbors": neighbors,
        }

    def load_model(self):
        if not os.path.exists(self.model_path):
            self.model = None
            return

        try:
            with open(self.model_path, "r", encoding="utf-8") as handle:
                self.model = json.load(handle)
        except Exception as exc:
            logger.error("Failed to load gesture model: %s", exc)
            self.model = None

    def get_model_status(self):
        dataset = self.load_dataset()
        dataset_counts = Counter(sample["label"] for sample in dataset)
        return {
            "model_loaded": self.model is not None,
            "model_path": self.model_path,
            "dataset_path": self.dataset_path,
            "dataset_counts": dict(sorted(dataset_counts.items())),
            "trained_labels": self.model.get("labels", []) if self.model else [],
        }

    def predict(self, hand_data, top_k=3):
        if self.model is None:
            return []

        vector = self.normalize_landmarks(hand_data)
        if not vector:
            return []

        sample_vectors = self.model.get("samples", [])
        if not sample_vectors:
            return []

        target = np.array(vector, dtype=np.float32)
        distances = []
        for sample in sample_vectors:
            sample_vector = np.array(sample["vector"], dtype=np.float32)
            distance = float(np.linalg.norm(target - sample_vector))
            distances.append({"label": sample["label"], "distance": distance})

        distances.sort(key=lambda item: item["distance"])
        neighbors = distances[: max(1, min(top_k, self.model.get("neighbors", 5)))]
        if not neighbors:
            return []

        weights = defaultdict(float)
        closest_by_label = {}
        for neighbor in neighbors:
            weight = 1.0 / max(neighbor["distance"], 1e-6)
            weights[neighbor["label"]] += weight
            closest_by_label[neighbor["label"]] = min(
                closest_by_label.get(neighbor["label"], float("inf")),
                neighbor["distance"],
            )

        total_weight = sum(weights.values()) or 1.0
        ranked = []
        for label, weight in sorted(weights.items(), key=lambda item: item[1], reverse=True):
            normalized_vote = weight / total_weight
            closeness_bonus = 1.0 / (1.0 + closest_by_label[label] * 4.0)
            confidence = min(0.99, normalized_vote * 0.75 + closeness_bonus * 0.25)
            ranked.append(
                {
                    "prediction": label,
                    "type": self._infer_type(label),
                    "confidence": float(confidence),
                    "distance": float(closest_by_label[label]),
                }
            )

        return ranked[:top_k]

    def _infer_type(self, label):
        if label.isdigit():
            return "digit"
        if len(label) == 1 and label.isalpha():
            return "alphabet"
        return "word"


recognition_service = RecognitionService()
