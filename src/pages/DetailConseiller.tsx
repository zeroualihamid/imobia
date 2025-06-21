
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Languages,
  DollarSign,
  Briefcase,
  CreditCard
} from 'lucide-react';

interface Conseiller {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string | null;
  ville: string | null;
  nationalite: string | null;
  numero_cin: string | null;
  date_naissance: string | null;
  formation: string | null;
  specialisations: string[] | null;
  langues: string[] | null;
  salaire: number | null;
  commission: number | null;
  date_embauche: string | null;
  created_at: string;
}

const DetailConseiller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conseiller, setConseiller] = useState<Conseiller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchConseiller();
    }
  }, [id]);

  const fetchConseiller = async () => {
    try {
      const { data, error } = await supabase
        .from('conseillers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setConseiller(data);
    } catch (error) {
      console.error('Erreur lors du chargement du conseiller:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du conseiller.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateAge = (dateNaissance: string | null) => {
    if (!dateNaissance) return 'Non défini';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!conseiller) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Conseiller non trouvé.</p>
        <Button onClick={() => navigate('/conseillers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/conseillers')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {conseiller.prenom} {conseiller.nom}
              </h1>
              <p className="text-slate-600">
                Ajouté le {formatDate(conseiller.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Prénom</label>
                <p className="text-slate-900">{conseiller.prenom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Nom</label>
                <p className="text-slate-900">{conseiller.nom}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Date de naissance</label>
              <p className="text-slate-900">{calculateAge(conseiller.date_naissance)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Nationalité</label>
              <p className="text-slate-900">{conseiller.nationalite || 'Non définie'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">N° CIN</label>
              <p className="text-slate-900">{conseiller.numero_cin || 'Non défini'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{conseiller.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{conseiller.telephone}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{conseiller.adresse || 'Non définie'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{conseiller.ville || 'Non définie'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formation et compétences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Formation et compétences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Formation</label>
              {conseiller.formation ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1">
                  {conseiller.formation}
                </Badge>
              ) : (
                <p className="text-slate-400">Non définie</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Spécialisations</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {conseiller.specialisations && conseiller.specialisations.length > 0 ? (
                  conseiller.specialisations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400">Aucune</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Langues</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {conseiller.langues && conseiller.langues.length > 0 ? (
                  conseiller.langues.map((langue, index) => (
                    <Badge key={index} variant="outline">
                      <Languages className="h-3 w-3 mr-1" />
                      {langue}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400">Aucune</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Informations professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <label className="text-sm font-medium text-slate-600">Date d'embauche</label>
                <p className="text-slate-900">{formatDate(conseiller.date_embauche)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <div>
                <label className="text-sm font-medium text-slate-600">Salaire</label>
                <p className="text-slate-900">
                  {conseiller.salaire ? `${conseiller.salaire.toLocaleString('fr-FR')} €` : 'Non défini'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <div>
                <label className="text-sm font-medium text-slate-600">Commission</label>
                <p className="text-slate-900">
                  {conseiller.commission ? `${conseiller.commission}%` : 'Non définie'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailConseiller;
