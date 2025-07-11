
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, User, Building, FileText, MessageSquare, 
  Phone, Mail, MapPin, Calendar, Hash, Plus, Edit,
  Home, Euro, Clock, Shield, Users
} from 'lucide-react';
import { useProprietaires, useBiens, useConditions, useMandats, useInteractions } from '@/hooks/useProprietaires';
import { useAuth } from '@/contexts/AuthContext';
import AjouterBienForm from '@/components/AjouterBienForm';
import type { Proprietaire } from '@/types/proprietaire';

const DetailProprietaire = () => {
  const { id } = useParams<{ id: string }>();
  const [proprietaire, setProprietaire] = useState<Proprietaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddBienDialog, setShowAddBienDialog] = useState(false);
  const { user } = useAuth();
  
  const { getProprietaireById } = useProprietaires();
  const { biens, refetch: refetchBiens } = useBiens(id);
  const { conditions } = useConditions(id);
  const { mandats } = useMandats(id);
  const { interactions, addInteraction } = useInteractions(id);

  useEffect(() => {
    if (id) {
      loadProprietaire();
    }
  }, [id]);

  const loadProprietaire = async () => {
    if (!id) return;
    
    setLoading(true);
    const data = await getProprietaireById(id);
    setProprietaire(data);
    setLoading(false);
  };

  const handleBienAdded = () => {
    setShowAddBienDialog(false);
    refetchBiens();
  };

  const getDisplayName = (proprietaire: Proprietaire) => {
    if (proprietaire.type === 'PARTICULIER') {
      return `${proprietaire.prenom || ''} ${proprietaire.nom}`.trim();
    } else {
      return proprietaire.raison_sociale || proprietaire.nom;
    }
  };

  const maskPhoneNumber = (phone: string, createdBy: string) => {
    if (user?.id === createdBy) {
      return phone;
    }
    return phone.replace(/(.{2})(.*)(.{2})/, '$1****$3');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PARTICULIER': return 'Particulier';
      case 'PROMOTEUR': return 'Promoteur';
      case 'FONCIERE': return 'Foncière';
      default: return type;
    }
  };

  const getBienTypeLabel = (type: string) => {
    switch (type) {
      case 'VENTE': return 'Vente';
      case 'LOCATION': return 'Location';
      case 'VENTE_LOCATION': return 'Vente/Location';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return 'Disponible';
      case 'RESERVE': return 'Réservé';
      case 'VENDU': return 'Vendu';
      case 'LOUE': return 'Loué';
      case 'RETIRE': return 'Retiré';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE': return 'bg-green-100 text-green-800';
      case 'RESERVE': return 'bg-slate-100 text-slate-800';
      case 'VENDU': return 'bg-blue-100 text-blue-800';
      case 'LOUE': return 'bg-purple-100 text-purple-800';
      case 'RETIRE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!proprietaire) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Propriétaire non trouvé</h3>
        <Link to="/proprietaire">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/proprietaire">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{getDisplayName(proprietaire)}</h1>
          <p className="text-slate-600 mt-1">{getTypeLabel(proprietaire.type)}</p>
        </div>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{getTypeLabel(proprietaire.type)}</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{maskPhoneNumber(proprietaire.telephone, proprietaire.created_by)}</span>
              </div>
              
              {proprietaire.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{proprietaire.email}</span>
                </div>
              )}
              
              {proprietaire.adresse && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{proprietaire.adresse}</span>
                </div>
              )}
              
              {proprietaire.date_naissance && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(proprietaire.date_naissance).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              
              {proprietaire.cin && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span>CIN: {proprietaire.cin}</span>
                </div>
              )}
              
              {proprietaire.ice && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span>ICE: {proprietaire.ice}</span>
                </div>
              )}
            </div>
            
            {proprietaire.notes && (
              <div className="pt-3 border-t">
                <p className="text-sm text-slate-600">{proprietaire.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{biens.length}</div>
                <div className="text-sm text-slate-600">Biens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mandats.length}</div>
                <div className="text-sm text-slate-600">Mandats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{conditions.length}</div>
                <div className="text-sm text-slate-600">Conditions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{interactions.length}</div>
                <div className="text-sm text-slate-600">Interactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Dialog open={showAddBienDialog} onOpenChange={setShowAddBienDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Ajouter un bien
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un bien</DialogTitle>
                </DialogHeader>
                <AjouterBienForm
                  proprietaireId={proprietaire.id}
                  onSuccess={handleBienAdded}
                  onCancel={() => setShowAddBienDialog(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Créer un mandat
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ajouter une interaction
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Onglets détaillés */}
      <Tabs defaultValue="biens" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="biens">Biens ({biens.length})</TabsTrigger>
          <TabsTrigger value="conditions">Conditions ({conditions.length})</TabsTrigger>
          <TabsTrigger value="mandats">Mandats ({mandats.length})</TabsTrigger>
          <TabsTrigger value="interactions">Activité ({interactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="biens" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Biens immobiliers</h3>
            <Dialog open={showAddBienDialog} onOpenChange={setShowAddBienDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un bien
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          {biens.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Home className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Aucun bien enregistré</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {biens.map((bien) => (
                <Link key={bien.id} to={`/biens/${bien.id}`}>
                  <Card className="cursor-pointer transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bien.titre}</CardTitle>
                        <Badge className={getStatusColor(bien.status)}>
                          {getStatusLabel(bien.status)}
                        </Badge>
                      </div>
                      <Badge variant="outline">{getBienTypeLabel(bien.type)}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{bien.adresse}, {bien.ville}</span>
                        </div>
                        {bien.surface_habitable && (
                          <div>Surface: {bien.surface_habitable} m²</div>
                        )}
                        {bien.prix_vente && (
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-slate-400" />
                            <span>Vente: {bien.prix_vente.toLocaleString()} MAD</span>
                          </div>
                        )}
                        {bien.prix_location && (
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-slate-400" />
                            <span>Location: {bien.prix_location.toLocaleString()} MAD/mois</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Conditions du propriétaire</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des conditions
            </Button>
          </div>
          
          {conditions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Aucune condition définie</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {conditions.map((condition) => (
                <Card key={condition.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {condition.prix_minimum && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">Prix minimum</label>
                          <p>{condition.prix_minimum.toLocaleString()} MAD</p>
                        </div>
                      )}
                      {condition.prix_maximum && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">Prix maximum</label>
                          <p>{condition.prix_maximum.toLocaleString()} MAD</p>
                        </div>
                      )}
                      {condition.delai_vente && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">Délai de vente</label>
                          <p>{condition.delai_vente} jours</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-slate-600">Options</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {condition.commission_negociable && <Badge variant="outline">Commission négociable</Badge>}
                          {condition.exclusivite_requise && <Badge variant="outline">Exclusivité requise</Badge>}
                          {condition.visite_accompagnee && <Badge variant="outline">Visite accompagnée</Badge>}
                        </div>
                      </div>
                    </div>
                    {condition.conditions_speciales && (
                      <div className="mt-4 pt-4 border-t">
                        <label className="text-sm font-medium text-slate-600">Conditions spéciales</label>
                        <p className="text-sm mt-1">{condition.conditions_speciales}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mandats" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Mandats de gestion</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un mandat
            </Button>
          </div>
          
          {mandats.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Aucun mandat signé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mandats.map((mandat) => (
                <Card key={mandat.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Mandat {mandat.type}</CardTitle>
                      <Badge className={mandat.status === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {mandat.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Période</label>
                        <p>{new Date(mandat.date_debut).toLocaleDateString('fr-FR')} - {new Date(mandat.date_fin).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Commission</label>
                        <p>{mandat.commission_pourcentage}%</p>
                      </div>
                      {mandat.prix_mandat && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">Prix du mandat</label>
                          <p>{mandat.prix_mandat.toLocaleString()} MAD</p>
                        </div>
                      )}
                    </div>
                    {mandat.conditions_particulieres && (
                      <div className="mt-4 pt-4 border-t">
                        <label className="text-sm font-medium text-slate-600">Conditions particulières</label>
                        <p className="text-sm mt-1">{mandat.conditions_particulieres}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historique des interactions</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une interaction
            </Button>
          </div>
          
          {interactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">Aucune interaction enregistrée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{interaction.type_interaction}</Badge>
                      <span className="text-sm text-slate-500">
                        {new Date(interaction.date_interaction).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm">{interaction.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailProprietaire;
