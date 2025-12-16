import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { CheckCircle2, Circle, FileText, Shield, Heart, HardDrive } from 'lucide-react';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', title: 'Last Will & Testament', description: 'Draft a legal document outlining asset distribution.', completed: false, category: 'legal' },
  { id: '2', title: 'Advance Healthcare Directive', description: 'Specify your wishes for medical treatment.', completed: false, category: 'health' },
  { id: '3', title: 'Power of Attorney', description: 'Appoint someone to make decisions if you cannot.', completed: false, category: 'legal' },
  { id: '4', title: 'Funeral Preferences', description: 'Decide between burial, cremation, or aquamation.', completed: false, category: 'funeral' },
  { id: '5', title: 'Digital Legacy', description: 'Plan for social media accounts and digital assets.', completed: false, category: 'digital' },
  { id: '6', title: 'Life Insurance', description: 'Review beneficiaries and policy details.', completed: false, category: 'legal' },
  { id: '7', title: 'Obituary Draft', description: 'Write down key life milestones and message.', completed: false, category: 'funeral' },
];

export const PlanningTools: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'legal': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'health': return <Heart className="w-5 h-5 text-red-500" />;
      case 'funeral': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'digital': return <HardDrive className="w-5 h-5 text-slate-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const progress = Math.round((items.filter(i => i.completed).length / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-sage-900">Your Peace of Mind Checklist</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Preparing these documents is an act of love for those you leave behind. Take it one step at a time.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-sage-800">Progress</span>
          <span className="text-2xl font-bold text-sage-600">{progress}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-3">
          <div 
            className="bg-sage-500 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 ${
              item.completed 
                ? 'bg-sage-50 border-sage-200' 
                : 'bg-white border-stone-200 hover:border-sage-300 hover:shadow-md'
            }`}
          >
            <div className={`mt-1 flex-shrink-0 ${item.completed ? 'text-sage-600' : 'text-stone-300'}`}>
              {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${item.completed ? 'text-sage-800 line-through' : 'text-stone-800'}`}>
                  {item.title}
                </h3>
                {getIcon(item.category)}
              </div>
              <p className={`text-sm ${item.completed ? 'text-sage-600' : 'text-stone-500'}`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};