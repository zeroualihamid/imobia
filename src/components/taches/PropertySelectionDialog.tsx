
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Home } from 'lucide-react';

interface Property {
  id: string;
  metadata: any;
  created_at: string;
}

interface PropertySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertySelect: (property: Property) => void;
  selectedPropertyId?: string;
}

const PropertySelectionDialog = ({ 
  open, 
  onOpenChange, 
  onPropertySelect, 
  selectedPropertyId 
}: PropertySelectionDialogProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProperties();
    }
  }, [open]);

  useEffect(() => {
    const filtered = properties.filter(property => {
      const title = property.metadata?.title || '';
      const address = property.metadata?.address || '';
      const searchLower = searchTerm.toLowerCase();
      return title.toLowerCase().includes(searchLower) || 
             address.toLowerCase().includes(searchLower);
    });
    setFilteredProperties(filtered);
  }, [properties, searchTerm]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, metadata, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des biens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    onPropertySelect(property);
    onOpenChange(false);
  };

  const getPropertyThumbnail = (property: Property) => {
    const images = property.metadata?.images || [];
    return images.length > 0 ? images[0] : null;
  };

  const getPropertyTitle = (property: Property) => {
    return property.metadata?.title || 'Bien sans titre';
  };

  const getPropertyAddress = (property: Property) => {
    return property.metadata?.address || 'Adresse non spécifiée';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] !bg-white !border-slate-200">
        <DialogHeader className="!bg-white">
          <DialogTitle className="text-slate-900">Sélectionner un bien</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 !bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par titre ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !bg-white !border-slate-300 text-slate-900"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-slate-500">Chargement des biens...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                {searchTerm ? 'Aucun bien trouvé pour cette recherche' : 'Aucun bien disponible'}
              </div>
            ) : (
              filteredProperties.map((property) => {
                const thumbnail = getPropertyThumbnail(property);
                const isSelected = selectedPropertyId === property.id;
                
                return (
                  <div
                    key={property.id}
                    onClick={() => handlePropertySelect(property)}
                    className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt="Aperçu du bien"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center">
                          <Home className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {getPropertyTitle(property)}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {getPropertyAddress(property)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Créé le {new Date(property.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="!bg-white !border-slate-300 text-slate-700 hover:!bg-slate-50"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertySelectionDialog;
