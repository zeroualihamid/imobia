
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

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
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  address, 
  city, 
  region, 
  onLocationUpdate 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([-7.5898, 33.5731]); // Casablanca par défaut
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Fonction pour géocoder une adresse avec Nominatim
  const geocodeAddress = async (fullAddress: string) => {
    if (!fullAddress.trim()) return;
    
    setIsGeocoding(true);
    console.log('Géocodage de l\'adresse avec Nominatim:', fullAddress);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=ma&addressdetails=1`
      );
      const data = await response.json();
      
      console.log('Réponse du géocodage Nominatim:', data);
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const newCoordinates: [number, number] = [lng, lat];
        
        console.log('Nouvelles coordonnées:', newCoordinates);
        
        setCoordinates(newCoordinates);
        
        if (map.current && marker.current) {
          // Animer la carte vers la nouvelle position
          map.current.setView([lat, lng], 16);
          
          // Mettre à jour la position du marqueur
          marker.current.setLatLng([lat, lng]);
        }
        
        onLocationUpdate?.(newCoordinates);
      } else {
        console.log('Aucun résultat trouvé pour l\'adresse:', fullAddress);
      }
    } catch (error) {
      console.error('Erreur de géocodage Nominatim:', error);
    } finally {
      setIsGeocoding(false);
    }
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

    // Écouter les déplacements du marqueur
    marker.current.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      const newCoordinates: [number, number] = [latlng.lng, latlng.lat];
      console.log('Marqueur déplacé vers:', newCoordinates);
      setCoordinates(newCoordinates);
      onLocationUpdate?.(newCoordinates);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Géocoder l'adresse quand elle change
  useEffect(() => {
    if (address && city) {
      const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
      console.log('Adresse changée, géocodage automatique:', fullAddress);
      geocodeAddress(fullAddress);
    }
  }, [address, city, region]);

  const handleSearchLocation = () => {
    if (address && city) {
      const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
      console.log('Recherche manuelle de l\'adresse:', fullAddress);
      geocodeAddress(fullAddress);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSearchLocation}
          disabled={!address || !city || isGeocoding}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          <Search className="h-4 w-4 mr-2" />
          {isGeocoding ? 'Localisation...' : 'Localiser l\'adresse'}
        </Button>
        <span className="text-sm text-slate-600">
          <MapPin className="h-4 w-4 inline mr-1" />
          Vous pouvez déplacer le marqueur sur la carte
        </span>
      </div>
      
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-80 rounded-lg border border-slate-200 shadow-sm"
        />
        {isGeocoding && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Localisation en cours...
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
        Coordonnées: {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
      </div>
    </div>
  );
};

export default PropertyMap;
