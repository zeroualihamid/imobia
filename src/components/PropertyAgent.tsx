
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PropertyMetadata } from '@/types/property';

interface PropertyAgentProps {
  onDataUpdate: (data: Partial<PropertyMetadata>) => void;
  currentData: Partial<PropertyMetadata>;
}

interface Question {
  id: string;
  text: string;
  field: string;
  options?: string[];
  type: 'select' | 'text' | 'number';
  followUp?: string;
}

const PropertyAgent: React.FC<PropertyAgentProps> = ({ onDataUpdate, currentData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const questions: Question[] = [
    {
      id: 'category',
      text: 'Bonjour ! Je vais vous aider à créer votre bien immobilier. Commençons par la catégorie de bien. Dites-moi : Vente, Location ou Location de vacances ?',
      field: 'category',
      options: ['Vente', 'Location', 'Location de vacances'],
      type: 'select'
    },
    {
      id: 'propertyType',
      text: 'Parfait ! Maintenant, quel est le type de bien ? Vous pouvez choisir parmi : Appartement, Villa et maison de luxe, Locaux commerciaux, Terrain, Maison, Riad, Bureau, ou Ferme.',
      field: 'propertyType',
      options: ['Appartement', 'Villa et maison de luxe', 'Locaux commerciaux', 'Terrain', 'Maison', 'Riad', 'Bureau', 'Ferme'],
      type: 'select'
    },
    {
      id: 'address',
      text: 'Très bien ! Maintenant, pouvez-vous me donner l\'adresse complète du bien ?',
      field: 'address',
      type: 'text'
    },
    {
      id: 'region',
      text: 'Merci ! Dans quelle région se trouve ce bien ?',
      field: 'region',
      type: 'text'
    },
    {
      id: 'city',
      text: 'Parfait ! Et dans quelle ville exactement ?',
      field: 'city',
      type: 'text'
    },
    {
      id: 'district',
      text: 'Très bien ! Quel est l\'arrondissement ?',
      field: 'district',
      type: 'text'
    },
    {
      id: 'neighborhood',
      text: 'Excellent ! Et le quartier ?',
      field: 'neighborhood',
      type: 'text'
    },
    {
      id: 'builtArea',
      text: 'Maintenant parlons des surfaces. Quelle est la surface construite en mètres carrés ?',
      field: 'builtArea',
      type: 'number'
    },
    {
      id: 'livingArea',
      text: 'Merci ! Et la surface habitable en mètres carrés ?',
      field: 'livingArea',
      type: 'number'
    },
    {
      id: 'outdoorArea',
      text: 'Parfait ! Y a-t-il une surface extérieure ? Si oui, combien de mètres carrés ?',
      field: 'outdoorArea',
      type: 'number'
    },
    {
      id: 'bedrooms',
      text: 'Excellent ! Combien de chambres compte ce bien ?',
      field: 'bedrooms',
      type: 'number'
    },
    {
      id: 'rooms',
      text: 'Très bien ! Et combien de pièces au total ?',
      field: 'rooms',
      type: 'number'
    },
    {
      id: 'bathrooms',
      text: 'Parfait ! Combien de salles de bain ?',
      field: 'bathrooms',
      type: 'number'
    },
    {
      id: 'price',
      text: 'Excellent ! Pour finir, quel est le prix demandé en dirhams ?',
      field: 'price',
      type: 'number'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Erreur synthèse vocale:', error);
      setIsSpeaking(false);
    }
  };

  const processResponse = (response: string) => {
    if (!currentQuestion) return;

    let processedValue: any = response.trim();

    if (currentQuestion.type === 'number') {
      const numberMatch = response.match(/(\d+)/);
      if (numberMatch) {
        processedValue = parseInt(numberMatch[1]);
      }
    } else if (currentQuestion.type === 'select' && currentQuestion.options) {
      const lowerResponse = response.toLowerCase();
      const foundOption = currentQuestion.options.find(option => 
        lowerResponse.includes(option.toLowerCase()) ||
        option.toLowerCase().includes(lowerResponse)
      );
      if (foundOption) {
        processedValue = foundOption;
      }
    }

    const newResponses = { ...responses, [currentQuestion.field]: processedValue };
    setResponses(newResponses);

    // Update the property data based on the field
    const updatedData: Partial<PropertyMetadata> = { ...currentData };
    
    if (currentQuestion.field === 'address' || currentQuestion.field === 'region' || 
        currentQuestion.field === 'city' || currentQuestion.field === 'district' || 
        currentQuestion.field === 'neighborhood') {
      
      const location = typeof updatedData.location === 'object' ? updatedData.location : {};
      updatedData.location = {
        ...location,
        [currentQuestion.field]: processedValue
      };
    } else if (currentQuestion.field === 'builtArea' || currentQuestion.field === 'livingArea' || 
               currentQuestion.field === 'outdoorArea') {
      
      const surface = typeof updatedData.surface === 'object' ? updatedData.surface : {};
      updatedData.surface = {
        ...surface,
        [currentQuestion.field]: processedValue
      };
    } else {
      // Safe type assignment using explicit field mapping
      switch (currentQuestion.field) {
        case 'category':
          updatedData.category = processedValue;
          break;
        case 'propertyType':
          updatedData.propertyType = processedValue;
          break;
        case 'bedrooms':
          updatedData.bedrooms = processedValue;
          break;
        case 'rooms':
          updatedData.rooms = processedValue;
          break;
        case 'bathrooms':
          updatedData.bathrooms = processedValue;
          break;
        case 'price':
          updatedData.price = processedValue;
          break;
        default:
          break;
      }
    }

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
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
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

        {isActive && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-blue-100 text-blue-700">
                Question {currentQuestionIndex + 1}/{questions.length}
              </Badge>
              {isSpeaking && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🎤 En train de parler...
                </Badge>
              )}
            </div>
            <p className="text-sm text-blue-800">{currentQuestion?.text}</p>
            
            {currentQuestion?.options && (
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
        )}

        {Object.keys(responses).length > 0 && (
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
        )}

        <div className="text-xs text-slate-500">
          💡 L'agent vous posera des questions une par une. Répondez à voix haute et il interprétera vos réponses automatiquement.
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAgent;
