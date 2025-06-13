
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Camera, Save, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConversation } from '@11labs/react';
import FileUpload, { UploadedFile } from '@/components/ui/FileUpload';
import { PropertyMetadata } from '@/types/property';

interface VoicePropertyCreatorProps {
  onPropertyCreated?: (property: PropertyMetadata) => void;
}

const VoicePropertyCreator: React.FC<VoicePropertyCreatorProps> = ({ onPropertyCreated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [propertyData, setPropertyData] = useState<Partial<PropertyMetadata>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<string>('Prêt à écouter');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognition = useRef<SpeechRecognition | null>(null);
  
  // Configuration ElevenLabs
  const conversation = useConversation({
    onConnect: () => console.log('Connecté à ElevenLabs'),
    onDisconnect: () => console.log('Déconnecté de ElevenLabs'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Erreur ElevenLabs:', error)
  });

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'fr-FR';

      recognition.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        setStatus('Erreur de reconnaissance vocale');
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    const newData = { ...propertyData };

    // Extraction du titre/type
    if (lowerCommand.includes('appartement')) {
      newData.propertyType = 'Appartement';
      newData.title = command.includes('appartement') ? 
        command.substring(0, command.indexOf('appartement') + 11) : 'Appartement';
    } else if (lowerCommand.includes('maison')) {
      newData.propertyType = 'Maison';
      newData.title = command.includes('maison') ? 
        command.substring(0, command.indexOf('maison') + 6) : 'Maison';
    } else if (lowerCommand.includes('local') || lowerCommand.includes('magasin')) {
      newData.propertyType = 'Local commercial';
      newData.title = 'Local commercial';
    }

    // Extraction du prix
    const priceMatch = command.match(/(\d+(?:\.\d+)?)\s*(millions?|mille|k|€|dh|dirhams?)/i);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1]);
      const unit = priceMatch[2].toLowerCase();
      if (unit.includes('million')) price *= 1000000;
      else if (unit.includes('k') || unit.includes('mille')) price *= 1000;
      newData.price = price;
    }

    // Extraction de la surface
    const surfaceMatch = command.match(/(\d+)\s*m[²2]/i);
    if (surfaceMatch) {
      newData.surface = parseInt(surfaceMatch[1]);
    }

    // Extraction du nombre de chambres
    const bedroomMatch = command.match(/(\d+)\s*(chambres?|pièces?)/i);
    if (bedroomMatch) {
      newData.bedrooms = parseInt(bedroomMatch[1]);
    }

    // Extraction de la localisation
    const locationKeywords = ['à', 'au', 'dans', 'quartier', 'maârif', 'casablanca', 'rabat'];
    for (const keyword of locationKeywords) {
      const index = lowerCommand.indexOf(keyword);
      if (index !== -1) {
        const location = command.substring(index + keyword.length).trim();
        if (location) {
          newData.location = location;
          break;
        }
      }
    }

    setPropertyData(newData);
    setStatus('Propriétés mises à jour depuis la commande vocale');
  };

  const startListening = async () => {
    if (recognition.current) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.current.start();
        setIsListening(true);
        setStatus('Écoute en cours... Parlez maintenant');
      } catch (error) {
        console.error('Erreur accès microphone:', error);
        setStatus('Erreur: Accès au microphone refusé');
      }
    } else {
      setStatus('Reconnaissance vocale non supportée');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
      setStatus('Écoute arrêtée');
    }
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      // Ici nous utiliserons ElevenLabs pour la synthèse vocale
      // Pour l'instant, utilisons l'API Web Speech comme fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Erreur synthèse vocale:', error);
      setIsSpeaking(false);
    }
  };

  const handleSaveProperty = () => {
    if (propertyData.title && propertyData.location) {
      const property: PropertyMetadata = {
        title: propertyData.title,
        location: propertyData.location,
        price: propertyData.price,
        surface: propertyData.surface,
        bedrooms: propertyData.bedrooms,
        propertyType: propertyData.propertyType,
        status: 'available',
        description: transcript || 'Créé via interface vocale'
      };
      
      if (onPropertyCreated) {
        onPropertyCreated(property);
      }
      
      speakText('Propriété sauvegardée avec succès');
      setStatus('Propriété sauvegardée');
    } else {
      speakText('Veuillez fournir au minimum un titre et une localisation');
      setStatus('Données incomplètes');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-emerald-600" />
            Interface Vocale - Création de Bien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Arrêter' : 'Commencer l\'écoute'}
            </Button>
            
            <Button
              onClick={() => speakText('Bonjour, je suis votre assistant vocal IMOBIA. Décrivez le bien immobilier que vous souhaitez enregistrer.')}
              variant="outline"
              disabled={isSpeaking}
              className="flex items-center gap-2"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              Assistant vocal
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              <Badge variant={isListening ? "default" : "secondary"}>
                {status}
              </Badge>
            </AlertDescription>
          </Alert>

          {transcript && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Transcription:</h4>
              <p className="text-sm text-slate-600">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Photos du Bien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFilesChange={setUploadedFiles}
            maxFiles={10}
            acceptedTypes={['image/*']}
          />
        </CardContent>
      </Card>

      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle>Données Extraites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {propertyData.title && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Titre:</Badge>
              <span className="text-sm">{propertyData.title}</span>
            </div>
          )}
          {propertyData.propertyType && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Type:</Badge>
              <span className="text-sm">{propertyData.propertyType}</span>
            </div>
          )}
          {propertyData.location && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Localisation:</Badge>
              <span className="text-sm">{propertyData.location}</span>
            </div>
          )}
          {propertyData.price && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Prix:</Badge>
              <span className="text-sm">{propertyData.price.toLocaleString()} DH</span>
            </div>
          )}
          {propertyData.surface && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Surface:</Badge>
              <span className="text-sm">{propertyData.surface} m²</span>
            </div>
          )}
          {propertyData.bedrooms && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Chambres:</Badge>
              <span className="text-sm">{propertyData.bedrooms}</span>
            </div>
          )}

          <Button
            onClick={handleSaveProperty}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
            disabled={!propertyData.title || !propertyData.location}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder le Bien
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoicePropertyCreator;
