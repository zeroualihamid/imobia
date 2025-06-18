
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([-7.5898, 33.5731]); // Casablanca par défaut
  const [isGeocoding, setIsGeocoding] = useState(false);

  const mapboxToken = 'pk.eyJ1IjoiYXhtLWFpIiwiYSI6ImNtYzJjMzZ1azA2ODMyanNpMXFtNG1lcjEifQ.XDg92ItHbxEXd79BbdEIQg';

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (fullAddress: string) => {
    if (!mapboxToken || !fullAddress.trim()) return;
    
    setIsGeocoding(true);
    console.log('Géocodage de l\'adresse:', fullAddress);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}&country=MA&limit=1`
      );
      const data = await response.json();
      
      console.log('Réponse du géocodage:', data);
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const newCoordinates: [number, number] = [lng, lat];
        
        console.log('Nouvelles coordonnées:', newCoordinates);
        
        setCoordinates(newCoordinates);
        
        if (map.current && marker.current) {
          // Animer la carte vers la nouvelle position
          map.current.flyTo({
            center: newCoordinates,
            zoom: 16,
            duration: 2000
          });
          
          // Mettre à jour la position du marqueur
          marker.current.setLngLat(newCoordinates);
        }
        
        onLocationUpdate?.(newCoordinates);
      } else {
        console.log('Aucun résultat trouvé pour l\'adresse:', fullAddress);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    console.log('Initialisation de la carte avec les coordonnées:', coordinates);

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 12
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Ajouter un marqueur
    marker.current = new mapboxgl.Marker({
      color: '#3B82F6',
      draggable: true
    })
      .setLngLat(coordinates)
      .addTo(map.current);

    // Écouter les déplacements du marqueur
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        const newCoordinates: [number, number] = [lngLat.lng, lngLat.lat];
        console.log('Marqueur déplacé vers:', newCoordinates);
        setCoordinates(newCoordinates);
        onLocationUpdate?.(newCoordinates);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Géocoder l'adresse quand elle change
  useEffect(() => {
    if (address && city && mapboxToken) {
      const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
      console.log('Adresse changée, géocodage automatique:', fullAddress);
      geocodeAddress(fullAddress);
    }
  }, [address, city, region, mapboxToken]);

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
