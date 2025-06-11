import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

const Biens = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const properties = [
    {
      id: 1,
      title: 'Appartement 3 pièces - Paris 15e',
      type: 'Appartement',
      price: '450 000 €',
      location: 'Paris 15e',
      surface: '75 m²',
      bedrooms: 2,
      bathrooms: 1,
      status: 'available',
      image: '/placeholder-property.jpg'
    },
    {
      id: 2,
      title: 'Maison avec jardin - Neuilly',
      type: 'Maison',
      price: '850 000 €',
      location: 'Neuilly-sur-Seine',
      surface: '120 m²',
      bedrooms: 4,
      bathrooms: 2,
      status: 'pending',
      image: '/placeholder-property.jpg'
    },
    {
      id: 3,
      title: 'Studio moderne - Paris 11e',
      type: 'Studio',
      price: '280 000 €',
      location: 'Paris 11e',
      surface: '35 m²',
      bedrooms: 1,
      bathrooms: 1,
      status: 'sold',
      image: '/placeholder-property.jpg'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Vendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Gestion des Biens
          </h1>
          <p className="text-slate-600">
            Gérez votre portefeuille immobilier
          </p>
        </div>
        <Link to="/biens/ajouter">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un bien
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par titre ou localisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="bg-white hover:shadow-lg transition-all duration-200 border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                  {property.title}
                </CardTitle>
                {getStatusBadge(property.status)}
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">
                  {property.price}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.surface}
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Aucun bien trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Aucun bien ne correspond à votre recherche.
          </p>
          <Link to="/biens/ajouter">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre premier bien
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Biens;
