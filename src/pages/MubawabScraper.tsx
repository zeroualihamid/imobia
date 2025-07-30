import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Image, Info, Link, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ScrapedProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  link: string;
}

const MubawabScraper = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        .from('scraping')
        .select('*')
        .eq('origin', 'mubawab'); // Filter by origin

      if (dbError) throw dbError;

      const formattedData = properties.map(property => {
        // Safely access metadata
        const metadata = (property.metadata || {}) as { 
          title?: string;
          price?: string;
          location?: string;
          image_path?: string;
          link?: string;
        };
        
        const { data: imageData } = supabase
          .storage
          .from('scraping-images')
          .getPublicUrl(metadata.image_path || '');

        return {
          id: property.id,
          title: metadata.title || 'Titre non disponible',
          price: metadata.price || 'Prix non disponible',
          location: metadata.location || 'Lieu non disponible',
          link: metadata.link || '#',
          imageUrl: imageData.publicUrl,
        };
      });

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
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
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
                  <img src={property.imageUrl} alt={property.title} className="w-full h-48 object-cover" />
                </CardHeader>
                <CardContent className="p-4 bg-white">
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2 truncate">{property.title}</CardTitle>
                  <p className="text-sm text-slate-600 mb-2">{property.location}</p>
                  <p className="text-xl font-bold text-blue-600 mb-4">{property.price}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={property.link} target="_blank" rel="noopener noreferrer">
                      Voir l'annonce
                      <Link className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            !isLoading && !error && (
              <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <Info className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium text-slate-700">Aucune donnée trouvée</h3>
                <p className="mt-1 text-sm text-slate-500">La table 'scrapping' est peut-être vide.</p>
              </div>
            )
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default MubawabScraper; 