
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Question } from './questions';

interface AgentStatusProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question | undefined;
  isSpeaking: boolean;
  isActive: boolean;
}

const AgentStatus: React.FC<AgentStatusProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentQuestion,
  isSpeaking,
  isActive
}) => {
  if (!isActive || !currentQuestion) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="default" className="bg-blue-100 text-blue-700">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </Badge>
        {isSpeaking && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            🎤 En train de parler...
          </Badge>
        )}
      </div>
      <p className="text-sm text-blue-800">{currentQuestion.text}</p>
      
      {currentQuestion.options && (
        <div className="mt-2 flex flex-wrap gap-1">
          {currentQuestion.options.map((option) => (
            <Badge 
              key={option} 
              variant="outline" 
              className="text-xs border-blue-300 text-blue-600"
            >
              {option}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentStatus;
