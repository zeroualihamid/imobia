
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

  const mapboxToken = 'pk.eyJ1IjoiYXhtLWFpIiwiYSI6ImNtYzJjMzZ1azA2ODMyanNpMXFtNG1lcjEifQ.XDg92ItHbxEXd79BbdEIQg';

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (fullAddress: string) => {
    if (!mapboxToken) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}&country=MA&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const newCoordinates: [number, number] = [lng, lat];
        setCoordinates(newCoordinates);
        
        if (map.current) {
          map.current.flyTo({
            center: newCoordinates,
            zoom: 15,
            duration: 2000
          });
          
          // Mettre à jour le marqueur
          if (marker.current) {
            marker.current.setLngLat(newCoordinates);
          }
        }
        
        onLocationUpdate?.(newCoordinates);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    }
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

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
      geocodeAddress(fullAddress);
    }
  }, [address, city, region, mapboxToken]);

  const handleSearchLocation = () => {
    if (address && city) {
      const fullAddress = `${address}, ${city}, ${region || 'Maroc'}`;
      geocodeAddress(fullAddress);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSearchLocation}
          disabled={!address || !city}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Search className="h-4 w-4 mr-2" />
          Localiser l'adresse
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
      </div>
      
      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
        Coordonnées: {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
      </div>
    </div>
  );
};

export default PropertyMap;
