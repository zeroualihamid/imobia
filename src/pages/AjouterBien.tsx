
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AjouterBienForm from '@/components/AjouterBienForm';

const AjouterBien = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proprietaireId = searchParams.get('proprietaire');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/biens')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Ajouter un bien</h1>
      </div>

      <AjouterBienForm
        proprietaireId={proprietaireId || undefined}
        onSuccess={() => navigate('/biens')}
        onCancel={() => navigate('/biens')}
      />
    </div>
  );
};

export default AjouterBien;
