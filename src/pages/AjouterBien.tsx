
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Save } from 'lucide-react';

const AjouterBien = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-emerald-600" />
          Ajouter un bien
        </h1>
        <p className="text-muted-foreground">
          Créez une nouvelle fiche bien immobilier
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Renseignez les détails du bien immobilier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre du bien</Label>
              <Input id="titre" placeholder="Ex: Appartement 3 pièces - Bastille" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de bien</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="local">Local commercial</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input id="surface" type="number" placeholder="75" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pieces">Nombre de pièces</Label>
              <Input id="pieces" type="number" placeholder="3" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input id="prix" type="number" placeholder="650000" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse complète</Label>
            <Input id="adresse" placeholder="123 rue de la République, 75011 Paris" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Décrivez le bien immobilier..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="sous-compromis">Sous compromis</SelectItem>
                  <SelectItem value="vendu">Vendu</SelectItem>
                  <SelectItem value="retire">Retiré du marché</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conseiller">Conseiller attribué</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un conseiller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dupont">Marie Dupont</SelectItem>
                  <SelectItem value="martin">Jean Martin</SelectItem>
                  <SelectItem value="bernard">Sophie Bernard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer le bien
            </Button>
            <Button variant="outline">
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterBien;
