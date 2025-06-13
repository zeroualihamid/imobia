
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { questions } from './questions';

interface ResponsesDisplayProps {
  responses: Record<string, any>;
}

const ResponsesDisplay: React.FC<ResponsesDisplayProps> = ({ responses }) => {
  if (Object.keys(responses).length === 0) return null;

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <h4 className="font-medium text-slate-900 mb-2">Réponses collectées:</h4>
      <div className="space-y-1">
        {Object.entries(responses).map(([field, value]) => (
          <div key={field} className="flex items-center gap-2">
            <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs">
              {questions.find(q => q.field === field)?.text.split('?')[0].slice(-20) || field}:
            </Badge>
            <span className="text-sm text-slate-600">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsesDisplay;
