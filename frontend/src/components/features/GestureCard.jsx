import React from 'react';
import { Play, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const GestureCard = ({ id, name, samples, date, onDelete }) => {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-slate-300">
          <Play size={40} className="opacity-20" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-900">{name}</h4>
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {samples} samples
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Added on {new Date(date).toLocaleDateString()}</p>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100" onClick={() => onDelete(id)}>
            <Trash2 size={14} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GestureCard;
