
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar,
  FileText,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useProprietaires } from '@/hooks/useProprietaires';
import { useRBAC } from '@/hooks/useRBAC';
import { Proprietaire, Bien, Mandat, InteractionProprietaire, ProprietaireType } from '@/types/proprietaire';
import { toast } from 'sonner';

const DetailProprietaire = () => {
  const { id } = useParams<{ id: string }>();
  const { proprietaires, fetchBiensByProprietaire, fetchMandatsByProprietaire, addInteraction } = useProprietaires();
  const { hasPermission, isAdmin } = useRBAC();
  
  const [proprietaire, setProprietaire] = useState<Proprietaire | null>(null);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [interactions, setInteractions] = useState<InteractionProprietaire[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les dialogues
  const [showInteractionDialog, setShowInteractionDialog] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type_interaction: 'APPEL' as const,
    description: ''
  });

  useEffect(() => {
    if (id) {
      loadProprietaireData();
    }
  }, [id, proprietaires]);

  const loadProprietaireData = async () => {
    if (!id) return;

    const foundProprietaire = proprietaires.find(p => p.id === id);
    if (foundProprietaire) {
      setProprietaire(foundProprietaire);
      
      // Charger les biens et mandats
      const [biensData, mandatsData] = await Promise.all([
        fetchBiensByProprietaire(id),
        fetchMandatsByProprietaire(id)
      ]);
      
      setBiens(biensData);
      setMandats(mandatsData);
    }
    setLoading(false);
  };

  const handleAddInteraction = async () => {
    if (!proprietaire || !newInteraction.description.trim()) return;

    const result = await addInteraction({
      proprietaire_id: proprietaire.id,
      type_interaction: newInteraction.type_interaction,
      description: newInteraction.description,
      date_interaction: new Date().toISOString()
    });

    if (result) {
      setInteractions(prev => [result, ...prev]);
      setNewInteraction({ type_interaction: 'APPEL', description: '' });
      setShowInteractionDialog(false);
    }
  };

  const getTypeColor = (type: ProprietaireType) => {
    switch (type) {
      case 'PARTICULIER':
        return 'bg-blue-100 text-blue-800';
      case 'PROMOTEUR':
        return 'bg-green-100 text-green-800';
      case 'FONCIERE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMandatStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EXPIRE':
        return 'bg-red-100 text-red-800';
      case 'RESILIE':
        return 'bg-gray-100 text-gray-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!proprietaire) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Propriétaire non trouvé</h3>
        <Link to="/proprietaires">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/proprietaires">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {proprietaire.prenom} {proprietaire.nom}
            </h1>
            <Badge className={getTypeColor(proprietaire.type)}>
              {proprietaire.type}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showInteractionDialog} onOpenChange={setShowInteractionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Nouvelle interaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une interaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select 
                  value={newInteraction.type_interaction} 
                  onValueChange={(value: any) => setNewInteraction(prev => ({ ...prev, type_interaction: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPEL">Appel téléphonique</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="VISITE">Visite</SelectItem>
                    <SelectItem value="SIGNATURE">Signature</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Description de l'interaction..."
                  value={newInteraction.description}
                  onChange={(e) => setNewInteraction(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowInteractionDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddInteraction}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {hasPermission('EDIT_CONSEILLER') && (
            <Link to={`/proprietaire/${proprietaire.id}/modifier`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">Téléphone:</span>
                <span className="ml-2">{proprietaire.telephone}</span>
              </div>
              {proprietaire.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{proprietaire.email}</span>
                </div>
              )}
              {proprietaire.ville && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">Ville:</span>
                  <span className="ml-2">{proprietaire.ville}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {proprietaire.numero_cin && (
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">CIN:</span>
                  <span className="ml-2">{proprietaire.numero_cin}</span>
                </div>
              )}
              {proprietaire.numero_rc && (
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="font-medium">RC:</span>
                  <span className="ml-2">{proprietaire.numero_rc}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">Créé le:</span>
                <span className="ml-2">
                  {new Date(proprietaire.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          {proprietaire.notes && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-slate-600">{proprietaire.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="biens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="biens">Biens ({biens.length})</TabsTrigger>
          <TabsTrigger value="mandats">Mandats ({mandats.length})</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="biens" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Biens du propriétaire</h3>
            <Link to={`/bien/ajouter?proprietaire=${proprietaire.id}`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un bien
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {biens.map((bien) => (
              <Card key={bien.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{bien.titre}</CardTitle>
                    <Badge variant="outline">{bien.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prix:</span>
                      <span className="font-medium">{bien.prix_demande.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ville:</span>
                      <span>{bien.ville}</span>
                    </div>
                    {bien.superficie && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Superficie:</span>
                        <span>{bien.superficie} m²</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link to={`/bien/${bien.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mandats" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Mandats</h3>
            <Link to={`/mandat/ajouter?proprietaire=${proprietaire.id}`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau mandat
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {mandats.map((mandat) => (
              <Card key={mandat.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{mandat.numero_mandat}</h4>
                      <p className="text-sm text-slate-600">{mandat.type}</p>
                    </div>
                    <Badge className={getMandatStatusColor(mandat.status)}>
                      {mandat.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Prix:</span>
                      <p className="font-medium">{mandat.prix_mandat.toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Commission:</span>
                      <p className="font-medium">{mandat.commission_taux}%</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Validité:</span>
                      <p className="font-medium">
                        {new Date(mandat.date_debut).toLocaleDateString('fr-FR')} - {new Date(mandat.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <h3 className="text-lg font-medium">Historique des interactions</h3>
          <div className="space-y-3">
            {interactions.map((interaction) => (
              <Card key={interaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {interaction.type_interaction === 'APPEL' && <Phone className="h-4 w-4 text-blue-600" />}
                        {interaction.type_interaction === 'EMAIL' && <Mail className="h-4 w-4 text-green-600" />}
                        {interaction.type_interaction === 'VISITE' && <Eye className="h-4 w-4 text-purple-600" />}
                        {interaction.type_interaction === 'SIGNATURE' && <FileText className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{interaction.type_interaction}</h4>
                        <p className="text-sm text-slate-600 mt-1">{interaction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(interaction.date_interaction).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailProprietaire;
