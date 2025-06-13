
import React from 'react';
import VoicePropertyCreator from '@/components/VoicePropertyCreator';
import { PropertyMetadata } from '@/types/property';
import { toast } from 'sonner';

const CreationVocale = () => {
  const handlePropertyCreated = (property: PropertyMetadata) => {
    console.log('Nouveau bien créé:', property);
    toast.success(`Bien "${property.title}" créé avec succès !`);
    
    // Ici nous pourrions sauvegarder dans Supabase
    // Pour l'instant, on affiche juste une notification
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Création Vocale de Biens
        </h1>
        <p className="text-slate-600">
          Utilisez votre voix pour créer rapidement des fiches de biens immobiliers
        </p>
      </div>

      <VoicePropertyCreator onPropertyCreated={handlePropertyCreated} />
    </div>
  );
};

export default CreationVocale;
