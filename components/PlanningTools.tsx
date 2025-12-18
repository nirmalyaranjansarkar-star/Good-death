import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { CheckCircle2, Circle, FileText, Shield, Heart, HardDrive, Feather } from 'lucide-react';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', title: 'Last Will & Testament', description: 'Legal document for asset distribution.', completed: false, category: 'legal' },
  { id: '2', title: 'Advance Medical Directive', description: 'Living Will: Outline your medical treatment wishes.', completed: false, category: 'health' },
  { id: '3', title: 'Power of Attorney', description: 'Appoint a trusted person for financial/health decisions.', completed: false, category: 'legal' },
  { id: '4', title: 'Organ Donation Registration', description: 'Register as a donor and inform your family.', completed: false, category: 'health' },
  { id: '5', title: 'Funeral & Ritual Wishes', description: 'Cremation/Burial preferences and ceremonial details.', completed: false, category: 'funeral' },
  { id: '6', title: 'Digital Legacy Plan', description: 'Passwords and instructions for social media/email.', completed: false, category: 'digital' },
  { id: '7', title: 'Emotional Will', description: 'Letters or videos for loved ones to be opened later.', completed: false, category: 'funeral' },
  { id: '8', title: 'Financial Audit', description: 'List of bank accounts, insurance, and liabilities.', completed: false, category: 'legal' },
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
      case 'funeral': return <Feather className="w-5 h-5 text-purple-500" />;
      case 'digital': return <HardDrive className="w-5 h-5 text-slate-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const progress = Math.round((items.filter(i => i.completed).length / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-sage-900">Good Death Planning Checklist</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          A good death is a planned death. By organizing your affairs, you offer a profound gift of peace to your loved ones.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-sage-800">Your Journey</span>
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