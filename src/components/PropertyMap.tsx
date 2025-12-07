
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Navigation, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PropertyMapProps {
  address: string;
  city: string;
  region: string;
  onLocationUpdate?: (coordinates: [number, number]) => void;
  initialCoordinates?: [number, number];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  address, 
  city, 
  region, 
  onLocationUpdate,
  initialCoordinates 
}) => {
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>(
    initialCoordinates || [-7.5898, 33.5731]
  ); // Casablanca par défaut
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Fonction pour géocoder une adresse avec Nominatim
  const geocodeAddress = async (fullAddress: string) => {
    if (!fullAddress.trim()) return;
    
    setIsGeocoding(true);
    console.log('Géocodage de l\'adresse avec Nominatim:', fullAddress);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=ma&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      const data = await response.json();
      
      console.log('Réponse du géocodage Nominatim:', data);
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const newCoordinates: [number, number] = [lng, lat];
        
        console.log('Nouvelles coordonnées:', newCoordinates);
        
        updateMapPosition(lat, lng);
        toast({
          title: "Adresse localisée",
          description: `Position trouvée: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      } else {
        console.log('Aucun résultat trouvé pour l\'adresse:', fullAddress);
        toast({
          title: "Adresse non trouvée",
          description: "Essayez de modifier l'adresse ou placez le marqueur manuellement",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur de géocodage Nominatim:', error);
      toast({
        title: "Erreur",
        description: "Impossible de localiser l'adresse",
        variant: "destructive"
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const updateMapPosition = (lat: number, lng: number) => {
    const newCoordinates: [number, number] = [lng, lat];
    setCoordinates(newCoordinates);
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
    
    if (map.current && marker.current) {
      map.current.setView([lat, lng], 16);
      marker.current.setLatLng([lat, lng]);
    }
    
    onLocationUpdate?.(newCoordinates);
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('Initialisation de la carte Leaflet avec les coordonnées:', coordinates);

    // Créer la carte
    map.current = L.map(mapContainer.current).setView([coordinates[1], coordinates[0]], 12);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Créer une icône personnalisée bleue
    const blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Ajouter le marqueur
    marker.current = L.marker([coordinates[1], coordinates[0]], {
      icon: blueIcon,
      draggable: true
    }).addTo(map.current);

    // Ajouter un popup au marqueur
    marker.current.bindPopup('Position du bien').openPopup();

    // Écouter les déplacements du marqueur
    marker.current.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      const newCoordinates: [number, number] = [latlng.lng, latlng.lat];
      console.log('Marqueur déplacé vers:', newCoordinates);
      setCoordinates(newCoordinates);
      setManualLat(latlng.lat.toFixed(6));
      setManualLng(latlng.lng.toFixed(6));
      onLocationUpdate?.(newCoordinates);
    });

    // Permettre de cliquer sur la carte pour placer le marqueur
    map.current.on('click', (e) => {
      const { lat, lng } = e.latlng;
      updateMapPosition(lat, lng);
    });

    // Set initial manual inputs
    setManualLat(coordinates[1].toFixed(6));
    setManualLng(coordinates[0].toFixed(6));

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Géocoder l'adresse quand elle change (avec debounce)
  useEffect(() => {
    if (address && city) {
      const timer = setTimeout(() => {
        const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
        console.log('Adresse changée, géocodage automatique:', fullAddress);
        geocodeAddress(fullAddress);
      }, 1000); // Debounce de 1 seconde
      
      return () => clearTimeout(timer);
    }
  }, [address, city, region]);

  const handleSearchLocation = () => {
    if (address && city) {
      const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
      console.log('Recherche manuelle de l\'adresse:', fullAddress);
      geocodeAddress(fullAddress);
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer des coordonnées valides",
        variant: "destructive"
      });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Erreur",
        description: "Coordonnées hors limites (Lat: -90 à 90, Lng: -180 à 180)",
        variant: "destructive"
      });
      return;
    }

    updateMapPosition(lat, lng);
    toast({
      title: "Position mise à jour",
      description: `Marqueur placé à ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    });
  };

  const copyCoordinates = () => {
    const coordString = `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
    navigator.clipboard.writeText(coordString);
    toast({
      title: "Copié",
      description: "Coordonnées copiées dans le presse-papier"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={handleSearchLocation}
          disabled={!address || !city || isGeocoding}
          size="sm"
          className="bg-primary text-primary-foreground"
        >
          <Search className="h-4 w-4 mr-2" />
          {isGeocoding ? 'Localisation...' : 'Localiser l\'adresse'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowManualInput(!showManualInput)}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {showManualInput ? 'Masquer GPS' : 'Entrer GPS'}
        </Button>
        <span className="text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 inline mr-1" />
          Cliquez sur la carte ou déplacez le marqueur
        </span>
      </div>

      {/* Manual GPS input */}
      {showManualInput && (
        <div className="flex flex-wrap items-end gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="lat" className="text-xs">Latitude</Label>
            <Input
              id="lat"
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="33.5731"
              className="h-8 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="lng" className="text-xs">Longitude</Label>
            <Input
              id="lng"
              type="text"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="-7.5898"
              className="h-8 text-sm"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleManualCoordinates}
            className="h-8"
          >
            Appliquer
          </Button>
        </div>
      )}
      
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-80 rounded-lg border border-border shadow-sm"
        />
        {isGeocoding && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Localisation en cours...
            </div>
          </div>
        )}
      </div>
      
      {/* Coordinates display */}
      <div className="flex items-center justify-between gap-2 text-sm bg-muted/50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">Coordonnées GPS:</span>
          <span className="font-mono text-muted-foreground">
            {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copyCoordinates}
          className="h-7 px-2"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copier
        </Button>
      </div>
    </div>
  );
};

export default PropertyMap;
