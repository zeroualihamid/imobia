
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Volume2, VolumeX } from 'lucide-react';
import { PropertyMetadata } from '@/types/property';
import { questions } from './property-agent/questions';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { processVoiceResponse } from '@/utils/voiceResponseProcessor';
import AgentStatus from './property-agent/AgentStatus';
import ResponsesDisplay from './property-agent/ResponsesDisplay';

interface PropertyAgentProps {
  onDataUpdate: (data: Partial<PropertyMetadata>) => void;
  currentData: Partial<PropertyMetadata>;
}

const PropertyAgent: React.FC<PropertyAgentProps> = ({ onDataUpdate, currentData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  
  const { isSpeaking, speakText, stopSpeaking } = useSpeechSynthesis();
  const currentQuestion = questions[currentQuestionIndex];

  const processResponse = (response: string) => {
    if (!currentQuestion) return;

    const updatedData = processVoiceResponse(response, currentQuestion, currentData);
    const newResponses = { ...responses, [currentQuestion.field]: response.trim() };
    
    setResponses(newResponses);
    onDataUpdate(updatedData);

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1000);
    } else {
      speakText('Parfait ! J\'ai collecté toutes les informations nécessaires. Vous pouvez maintenant sauvegarder votre bien.');
      setIsActive(false);
    }
  };

  const startAgent = () => {
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setResponses({});
    speakText(questions[0].text);
  };

  const stopAgent = () => {
    setIsActive(false);
    stopSpeaking();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      speakText(questions[currentQuestionIndex + 1].text);
    }
  };

  const repeatQuestion = () => {
    if (currentQuestion) {
      speakText(currentQuestion.text);
    }
  };

  // Auto-speak new questions
  useEffect(() => {
    if (isActive && currentQuestion && currentQuestionIndex > 0) {
      setTimeout(() => {
        speakText(currentQuestion.text);
      }, 500);
    }
  }, [currentQuestionIndex, isActive]);

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Agent Immobilier Vocal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={isActive ? stopAgent : startAgent}
            variant={isActive ? "destructive" : "default"}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Bot className="h-4 w-4" />
            {isActive ? 'Arrêter l\'agent' : 'Démarrer l\'agent'}
          </Button>
          
          {isActive && (
            <>
              <Button
                onClick={repeatQuestion}
                variant="outline"
                disabled={isSpeaking}
                className="flex items-center gap-2"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                Répéter
              </Button>
              
              <Button
                onClick={nextQuestion}
                variant="outline"
                disabled={currentQuestionIndex >= questions.length - 1}
                className="flex items-center gap-2"
              >
                Passer
              </Button>
            </>
          )}
        </div>

        <AgentStatus
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          isSpeaking={isSpeaking}
          isActive={isActive}
        />

        <ResponsesDisplay responses={responses} />

        <div className="text-xs text-slate-500">
          💡 L'agent vous posera des questions une par une. Répondez à voix haute et il interprétera vos réponses automatiquement.
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAgent;
