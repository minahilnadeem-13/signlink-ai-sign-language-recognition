import base64
import os
import math
import time
from collections import Counter, defaultdict, deque

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn.functional as F
from app.models.cnn_model import SignCNN


class GestureService:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.75,
            min_tracking_confidence=0.7,
            model_complexity=1,
        )

        self.history = deque(maxlen=12)
        self.motion_history = deque(maxlen=8)
        self.gesture_counts = defaultdict(int)
        self.last_counted_prediction = None
        self.last_counted_time = 0.0
        self.count_cooldown = 1.2
        self.min_count_confidence = 0.78

        # CNN Model Initialization
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.cnn_model = SignCNN().to(self.device)
        self.model_loaded = False
        try:
            model_path = os.path.join(os.path.dirname(__file__), "..", "..", "models", "sign_mnist_cnn.pth")
            if os.path.exists(model_path):
                self.cnn_model.load_state_dict(torch.load(model_path, map_location=self.device))
                self.cnn_model.eval()
                self.model_loaded = True
                print("Sign MNIST CNN loaded successfully.")
        except Exception as e:
            print(f"Error loading CNN model: {e}")

        self.mnist_mapping = {
            0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F", 6: "G", 7: "H", 8: "I",
            10: "K", 11: "L", 12: "M", 13: "N", 14: "O", 15: "P", 16: "Q", 17: "R",
            18: "S", 19: "T", 20: "U", 21: "V", 22: "W", 23: "X", 24: "Y"
        }

        self.dictionary = {
            "Hello": "سلام",
            "Hi": "ہیلو",
            "Yes": "ہاں",
            "No": "نہیں",
            "Thank You": "شکریہ",
            "Help": "مدد",
            "Stop": "رکیں",
            "OK": "ٹھیک ہے",
            "I Love You": "میں تم سے محبت کرتا ہوں",
            "A": "اے", "B": "بی", "C": "سی", "D": "ڈی", "E": "ای", "F": "ایف",
            "G": "جی", "H": "ایچ", "I": "آئی", "K": "کے", "L": "ایل", "M": "ایم",
            "N": "این", "O": "او", "P": "پی", "Q": "کیو", "R": "آر", "S": "ایس",
            "T": "ٹی", "U": "یو", "V": "وی", "W": "ڈبلیو", "X": "ایکس", "Y": "وائی",
            "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵",
        }
        self.predefined_gestures = [
            "Hello",
            "Hi",
            "Yes",
            "No",
            "Help",
            "Stop",
            "OK",
            "Thank You",
            "I Love You",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"
        ]

    def decode_image(self, base64_string):
        try:
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]
            img_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(img_data, np.uint8)
            return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception:
            return None

    def get_landmarks(self, image):
        if image is None:
            return []

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb)
        all_hands = []

        if results.multi_hand_landmarks:
            handedness = results.multi_handedness or []
            for index, hand_landmarks in enumerate(results.multi_hand_landmarks):
                lm_list = [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark]
                label = "Unknown"
                if index < len(handedness):
                    label = handedness[index].classification[0].label
                all_hands.append({"landmarks": lm_list, "handedness": label})

        return all_hands

    def _distance(self, a, b):
        return math.hypot(a["x"] - b["x"], a["y"] - b["y"])

    def _finger_is_open(self, lm, tip, pip, mcp):
        return self._distance(lm[tip], lm[mcp]) > self._distance(lm[pip], lm[mcp]) * 1.12

    def _thumb_is_open(self, lm):
        return (
            self._distance(lm[4], lm[2]) > self._distance(lm[3], lm[2]) * 1.1
            and self._distance(lm[4], lm[5]) > self._distance(lm[3], lm[5]) * 1.05
        )

    def _get_features(self, lm):
        palm_size = max(self._distance(lm[0], lm[9]), 0.001)
        thumb = self._thumb_is_open(lm)
        index = self._finger_is_open(lm, 8, 6, 5)
        middle = self._finger_is_open(lm, 12, 10, 9)
        ring = self._finger_is_open(lm, 16, 14, 13)
        pinky = self._finger_is_open(lm, 20, 18, 17)
        fingers = [thumb, index, middle, ring, pinky]

        index_middle_gap = self._distance(lm[8], lm[12]) / palm_size
        middle_ring_gap = self._distance(lm[12], lm[16]) / palm_size
        pinch_gap = self._distance(lm[4], lm[8]) / palm_size
        thumb_index_base_gap = self._distance(lm[4], lm[5]) / palm_size
        wrist_to_index = self._distance(lm[0], lm[8]) / palm_size
        wrist_to_middle = self._distance(lm[0], lm[12]) / palm_size
        palm_width = self._distance(lm[5], lm[17]) / palm_size
        fingertips_above_wrist = sum(1 for tip in (8, 12, 16, 20) if lm[tip]["y"] < lm[0]["y"])

        return {
            "fingers": fingers,
            "palm_size": palm_size,
            "index_middle_gap": index_middle_gap,
            "middle_ring_gap": middle_ring_gap,
            "pinch_gap": pinch_gap,
            "thumb_index_base_gap": thumb_index_base_gap,
            "wrist_to_index": wrist_to_index,
            "wrist_to_middle": wrist_to_middle,
            "palm_width": palm_width,
            "fingertips_above_wrist": fingertips_above_wrist,
            "wrist_x": lm[0]["x"],
            "wrist_y": lm[0]["y"],
            "index_tip_y": lm[8]["y"],
            "middle_tip_y": lm[12]["y"],
            "thumb_tip_x": lm[4]["x"],
            "index_tip_x": lm[8]["x"],
        }

    def _predict_cnn(self, hand_data, image):
        if not self.model_loaded or image is None:
            return []

        try:
            h, w, _ = image.shape
            lm = hand_data["landmarks"] if isinstance(hand_data, dict) else hand_data
            
            # Get bounding box from landmarks
            xs = [p["x"] for p in lm]
            ys = [p["y"] for p in lm]
            x1, y1 = int(min(xs) * w), int(min(ys) * h)
            x2, y2 = int(max(xs) * w), int(max(ys) * h)
            
            # Add padding
            padding = 20
            x1, y1 = max(0, x1 - padding), max(0, y1 - padding)
            x2, y2 = min(w, x2 + padding), min(h, y2 + padding)
            
            if x2 <= x1 or y2 <= y1:
                return []

            # Crop and preprocess
            hand_crop = image[y1:y2, x1:x2]
            gray = cv2.cvtColor(hand_crop, cv2.COLOR_BGR2GRAY)
            resized = cv2.resize(gray, (28, 28))
            normalized = resized / 255.0
            tensor = torch.tensor(normalized, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                output = self.cnn_model(tensor)
                probs = F.softmax(output, dim=1)
                conf, pred = torch.max(probs, 1)
                conf = conf.item()
                label_id = pred.item()
                
            if label_id in self.mnist_mapping and conf > 0.45:
                label = self.mnist_mapping[label_id]
                return [self._score_candidate(label, "alphabet", conf * 0.95)] # Slight penalty vs rules
            
            return []
        except Exception as e:
            print(f"CNN Prediction error: {e}")
            return []

    def _score_candidate(self, prediction, gtype, score):
        return {
            "prediction": prediction,
            "type": gtype,
            "confidence": max(0.0, min(score, 0.99)),
            "translatedText": self.dictionary.get(prediction, ""),
            "predefined": prediction in self.predefined_gestures,
        }

    def _append_motion(self, prediction, features):
        self.motion_history.append(
            {
                "prediction": prediction,
                "wrist_x": features["wrist_x"],
                "wrist_y": features["wrist_y"],
                "timestamp": time.time(),
            }
        )

    def _wave_score(self):
        hello_frames = [f for f in self.motion_history if f["prediction"] in {"Hello", "Hi"}]
        if len(hello_frames) < 4:
            return 0.0

        xs = [f["wrist_x"] for f in hello_frames]
        horizontal_span = max(xs) - min(xs)
        direction_changes = 0
        last_direction = 0
        for i in range(1, len(xs)):
            diff = xs[i] - xs[i - 1]
            direction = 1 if diff > 0.01 else -1 if diff < -0.01 else 0
            if direction and last_direction and direction != last_direction:
                direction_changes += 1
            if direction:
                last_direction = direction

        return min(0.99, 0.6 + horizontal_span * 1.8 + direction_changes * 0.08)

    def recognize_with_candidates(self, hand_data, image=None):
        if not hand_data:
            return []

        lm = hand_data["landmarks"] if isinstance(hand_data, dict) else hand_data
        features = self._get_features(lm)
        fingers = features["fingers"]
        thumb, index, middle, ring, pinky = fingers
        candidates = []

        # 1. Rule-based recognition
        open_count = sum(fingers)
        self._append_motion("Hello" if open_count >= 4 else "Unknown", features)

        if open_count == 0:
            candidates.append(self._score_candidate("0", "digit", 0.93))
        if index and not middle and not ring and not pinky and not thumb:
            candidates.append(self._score_candidate("1", "digit", 0.93))
            candidates.append(self._score_candidate("No", "word", 0.88))
        if index and middle and not ring and not pinky:
            score = 0.88 if not thumb else 0.82
            candidates.append(self._score_candidate("2", "digit", score))
        if thumb and index and middle and not ring and not pinky:
            candidates.append(self._score_candidate("3", "digit", 0.9))
            candidates.append(self._score_candidate("Help", "word", 0.87))
        if index and middle and ring and pinky and not thumb:
            candidates.append(self._score_candidate("4", "digit", 0.9))
            candidates.append(self._score_candidate("B", "alphabet", 0.86))
        if all(fingers):
            wave_bonus = self._wave_score()
            hello_score = max(0.86, wave_bonus)
            candidates.append(self._score_candidate("5", "digit", 0.89))
            candidates.append(self._score_candidate("Stop", "word", 0.91))
            candidates.append(self._score_candidate("Hello", "word", hello_score))
            if wave_bonus >= 0.72:
                candidates.append(self._score_candidate("Hi", "word", min(0.97, wave_bonus + 0.03)))

        if thumb and not index and not middle and not ring and not pinky:
            candidates.append(self._score_candidate("A", "alphabet", 0.82))
            candidates.append(self._score_candidate("Yes", "word", 0.8))
            candidates.append(self._score_candidate("OK", "word", 0.78))

        if thumb and index and not middle and not ring and not pinky and features["thumb_index_base_gap"] > 0.7:
            candidates.append(self._score_candidate("L", "alphabet", 0.94))

        if thumb and not index and not middle and not ring and pinky:
            candidates.append(self._score_candidate("Y", "alphabet", 0.87))

        if thumb and index and middle and not ring and pinky:
            candidates.append(self._score_candidate("I Love You", "word", 0.96))

        if features["pinch_gap"] < 0.45 and middle and ring and pinky:
            candidates.append(self._score_candidate("OK", "word", 0.95))

        if open_count >= 4 and features["wrist_to_middle"] > 1.45 and features["fingertips_above_wrist"] >= 3:
            candidates.append(self._score_candidate("Thank You", "word", 0.83))

        # 2. CNN-based alphabet recognition
        cnn_results = self._predict_cnn(hand_data, image)
        candidates.extend(cnn_results)

        if not candidates:
            return []

        deduped = {}
        for candidate in candidates:
            key = (candidate["prediction"], candidate["type"])
            best = deduped.get(key)
            if best is None or candidate["confidence"] > best["confidence"]:
                deduped[key] = candidate

        return sorted(deduped.values(), key=lambda item: item["confidence"], reverse=True)

    def get_smooth_prediction(self, candidates):
        if not candidates:
            return None

        top = candidates[0]
        self.history.append((top["prediction"], top["type"], top["confidence"]))
        counts = Counter((prediction, pred_type) for prediction, pred_type, _ in self.history)
        best_prediction, best_type = counts.most_common(1)[0][0]
        frequency = counts[(best_prediction, best_type)] / len(self.history)

        matching_confidences = [
            confidence
            for prediction, pred_type, confidence in self.history
            if prediction == best_prediction and pred_type == best_type
        ]
        averaged_confidence = sum(matching_confidences) / len(matching_confidences)
        smoothed_confidence = min(0.99, averaged_confidence * 0.7 + frequency * 0.3)

        match = next(
            (candidate for candidate in candidates if candidate["prediction"] == best_prediction and candidate["type"] == best_type),
            dict(top),
        )
        stable_match = dict(match)
        stable_match["confidence"] = smoothed_confidence
        stable_match["stability"] = frequency
        return stable_match

    def update_gesture_count(self, prediction, confidence):
        if not prediction or prediction in {"Unknown", "No hand detected"}:
            return False

        now = time.time()
        if confidence < self.min_count_confidence:
            return False

        if (
            prediction == self.last_counted_prediction
            and (now - self.last_counted_time) < self.count_cooldown
        ):
            return False

        self.gesture_counts[prediction] += 1
        self.last_counted_prediction = prediction
        self.last_counted_time = now
        return True

    def get_gesture_counts(self):
        return dict(sorted(self.gesture_counts.items(), key=lambda item: (-item[1], item[0])))

    def reset_tracking(self):
        self.history.clear()
        self.motion_history.clear()
        self.last_counted_prediction = None
        self.last_counted_time = 0.0

    def reset_all(self):
        self.reset_tracking()
        self.gesture_counts.clear()


gesture_service = GestureService()
