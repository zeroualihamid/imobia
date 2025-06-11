
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Euro, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Biens = () => {
  const biens = [
    {
      id: 1,
      titre: 'Appartement 3 pièces - Bastille',
      type: 'Appartement',
      surface: '75 m²',
      prix: '650 000',
      adresse: 'Paris 11e',
      statut: 'Disponible',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      titre: 'Maison 5 pièces avec jardin',
      type: 'Maison',
      surface: '120 m²',
      prix: '890 000',
      adresse: 'Neuilly-sur-Seine',
      statut: 'Sous compromis',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      titre: 'Studio rénové - Marais',
      type: 'Studio',
      surface: '25 m²',
      prix: '350 000',
      adresse: 'Paris 4e',
      statut: 'Disponible',
      image: '/placeholder.svg'
    }
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Sous compromis':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tous les biens
          </h1>
          <p className="text-muted-foreground">
            Gérez votre portefeuille immobilier
          </p>
        </div>
        <Link to="/biens/ajouter">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un bien
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {biens.map((bien) => (
          <Card key={bien.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
              <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{bien.titre}</CardTitle>
                  <Badge className={getStatusColor(bien.statut)}>
                    {bien.statut}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {bien.type} • {bien.surface}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {bien.adresse}
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    <span className="font-semibold text-lg text-foreground">
                      {bien.prix} €
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Biens;
