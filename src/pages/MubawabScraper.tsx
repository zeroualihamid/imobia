import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Image, 
  Info, 
  Link, 
  Loader, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  X,
  Home,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ScrapedProperty {
  id: number;
  title: string;
  price: string;
  thumbnail: string;
  url_link: string;
  description: string;
  show_elements: string;
  created_at: string;
}

const MubawabScraper = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<ScrapedProperty | null>(null);
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    toast({
      title: "Récupération des données",
      description: "Chargement des annonces depuis la base de données...",
    });

    try {
      const { data: properties, error: dbError } = await supabase
        .from('mubawab_scrapping')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const formattedData = properties.map(property => ({
        id: property.id,
        title: property.title || 'Titre non disponible',
        price: property.price || 'Prix non disponible',
        thumbnail: property.thumbnail || '',
        url_link: property.url_link || '#',
        description: property.description || 'Aucune description disponible',
        show_elements: property.show_elements || '',
        created_at: property.created_at || '',
      }));

      setScrapedData(formattedData);

      toast({
        title: "Données récupérées",
        description: `${formattedData.length} annonces chargées avec succès.`,
        action: <CheckCircle className="text-green-500" />,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
      setError(errorMessage);
      toast({
        title: "Erreur de récupération",
        description: errorMessage,
        variant: "destructive",
        action: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyClick = (property: ScrapedProperty) => {
    setSelectedProperty(property);
    setIsIframeOpen(true);
  };

  const handleAddToProperties = () => {
    if (selectedProperty) {
      toast({
        title: "Ajouté aux biens",
        description: `${selectedProperty.title} a été ajouté à vos biens.`,
        action: <CheckCircle className="text-green-500" />,
      });
    }
  };

  const handleDeleteFromScraping = () => {
    if (selectedProperty) {
      toast({
        title: "Supprimé du scraping",
        description: `${selectedProperty.title} a été supprimé de la liste de scraping.`,
        action: <CheckCircle className="text-green-500" />,
      });
    }
  };

  const handleQuit = () => {
    setIsIframeOpen(false);
    setSelectedProperty(null);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container mx-auto p-6 bg-slate-50 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Annonces Scrappées de Mubawab</h1>
              <p className="text-slate-600 mt-1">Liste des biens immobiliers récupérés depuis la base de données.</p>
            </div>
            <Button onClick={fetchData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Actualiser les données"
              )}
            </Button>
          </div>

          {error && (
            <div className="my-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p>{`Erreur: ${error}`}</p>
            </div>
          )}
          
          {isLoading && scrapedData.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <Loader className="mx-auto h-12 w-12 text-slate-400 animate-spin" />
              <h3 className="mt-4 text-lg font-medium text-slate-700">Chargement des annonces...</h3>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {scrapedData.length > 0 ? (
              scrapedData.map((property) => (
                <Card key={property.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-slate-200">
                  <CardHeader className="p-0">
                    <img 
                      src={property.thumbnail} 
                      alt={property.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <CardTitle className="text-lg font-semibold text-slate-800 mb-2 truncate">{property.title}</CardTitle>
                    <p className="text-sm text-slate-600 mb-2">{property.show_elements}</p>
                    <p className="text-xl font-bold text-blue-600 mb-2">{property.price}</p>
                    {property.description && (
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{property.description}</p>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePropertyClick(property)}
                    >
                      Voir l'annonce
                      <Link className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              !isLoading && !error && (
                <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <Info className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-medium text-slate-700">Aucune donnée trouvée</h3>
                  <p className="mt-1 text-sm text-slate-500">La table 'mubawab_scrapping' est peut-être vide.</p>
                </div>
              )
            )}
          </div>
          )}
        </div>
      </div>

      {/* Iframe Modal */}
      <Dialog open={isIframeOpen} onOpenChange={setIsIframeOpen}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Mobile Header - Only visible on mobile */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">imobia</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleQuit}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={handleAddToProperties}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={handleDeleteFromScraping}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>

              {/* Mobile Property Info */}
              {selectedProperty && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-sm mb-1">{selectedProperty.title}</h3>
                  <p className="text-sm font-semibold text-blue-600">{selectedProperty.price}</p>
                </div>
              )}
            </div>

            {/* Desktop Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
              {/* Logo Section */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">imobia</span>
                </div>
                <p className="text-xs text-slate-600">ARTIFICIAL INTELLIGENCE FOR REAL ESTATE</p>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3"
                  onClick={handleAddToProperties}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter au Biens
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3"
                  onClick={handleDeleteFromScraping}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer du scrapping
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3"
                  onClick={handleQuit}
                >
                  <X className="h-4 w-4" />
                  Quitter
                </Button>
              </div>

              {/* Property Info */}
              {selectedProperty && (
                <div className="p-4 border-t border-slate-200">
                  <h3 className="font-semibold text-sm mb-2">Propriété sélectionnée:</h3>
                  <p className="text-xs text-slate-600 mb-1">{selectedProperty.title}</p>
                  <p className="text-xs font-semibold text-blue-600">{selectedProperty.price}</p>
                </div>
              )}
            </div>

            {/* Iframe Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Desktop Header - Hidden on mobile */}
              <DialogHeader className="hidden lg:block p-4 border-b border-slate-200">
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedProperty?.title || 'Annonce Mubawab'}
                </DialogTitle>
              </DialogHeader>
              
              {/* Iframe Container */}
              <div className="flex-1 min-h-0">
                {selectedProperty && (
                  <iframe
                    src={selectedProperty.show_elements}
                    className="w-full h-full border-0"
                    title={selectedProperty.title}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MubawabScraper; 