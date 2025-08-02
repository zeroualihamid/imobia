import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  User, 
  Menu,
  Home,
  CheckSquare,
  Mic,
  Send,
  Settings,
  BarChart3,
  Users,
  User as UserIcon,
  FileText,
  Calendar,
  MessageSquare,
  Target,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCombinedProperties } from '@/hooks/useCombinedProperties';
import { PropertyMetadata } from '@/types/property';

const Biens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [biensOpen, setBiensOpen] = useState(true);
  const navigate = useNavigate();
  const { properties, isLoading, error } = useCombinedProperties();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'sold':
        return <Badge className="bg-slate-100 text-slate-800">Vendu</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>;
    }
  };

  const formatLocation = (location: PropertyMetadata['location']): string => {
    if (!location) return 'Localisation non définie';
    
    if (typeof location === 'string') {
      return location;
    }
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Localisation non définie';
  };

  const getPropertyImage = (property: { id: string; property_media?: Array<{ file_path: string }> }) => {
    // Pour les propriétés avec media
    if (property.property_media && property.property_media.length > 0) {
      return `https://erbjiehcvwqhxqdvmges.supabase.co/storage/v1/object/public/property-media/${property.property_media[0].file_path}`;
    }
    
    // Images placeholder par défaut
    const placeholderImages = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    ];
    
    // Utiliser l'ID pour sélectionner une image de manière déterministe
    const index = property.id.charCodeAt(0) % placeholderImages.length;
    return placeholderImages[index];
  };

  const filteredProperties = properties.filter(property => {
    const metadata = property.metadata as PropertyMetadata;
    const title = metadata?.title || '';
    const locationStr = formatLocation(metadata?.location);
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           locationStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  const menuItems = [
    { title: 'Tableau de bord', icon: BarChart3, href: '/dashboard' },
    {
      title: 'Biens',
      icon: Building2,
      isCollapsible: true,
      isOpen: biensOpen,
      setIsOpen: setBiensOpen,
      subItems: [
        { title: 'Ajouter bien', href: '/biens/ajouter', icon: Plus },
        { title: 'Tous les biens', href: '/biens', icon: Square },
        { title: 'Création vocale', href: '/biens/creation-vocale', icon: Mic },
        { title: 'Scraper Mubawab', href: '/mubawab-scraper', icon: Search }
      ]
    },
    { title: 'Conseillers', icon: Users, href: '/conseillers' },
    { title: 'Propriétaire', icon: UserIcon, href: '/proprietaires' },
    { title: 'Clients', icon: Users, href: '/clients' },
    { title: 'Mandats', icon: FileText, href: '/mandats' },
    { title: 'Planning', icon: Calendar, href: '/planning' },
    { title: 'Messagerie', icon: MessageSquare, href: '/messagerie' },
    { title: 'Matching bien et besoin', icon: Target, href: '/matching' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">imobia</span>
            </div>
            <p className="text-xs text-slate-600">ARTIFICIAL INTELLIGENCE FOR REAL ESTATE</p>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.isCollapsible ? (
                  <div>
                    <button
                      onClick={() => item.setIsOpen?.(!item.isOpen)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {item.isOpen && item.subItems && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.href}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">Biens</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">imobia</span>
              </div>
            </div>
          </header>

          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des biens...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">imobia</span>
            </div>
            <p className="text-xs text-slate-600">ARTIFICIAL INTELLIGENCE FOR REAL ESTATE</p>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.isCollapsible ? (
                  <div>
                    <button
                      onClick={() => item.setIsOpen?.(!item.isOpen)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {item.isOpen && item.subItems && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.href}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">Biens</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">imobia</span>
              </div>
            </div>
          </header>

          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
              <p className="text-red-600">
                Impossible de charger les biens. Veuillez réessayer.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">imobia</span>
          </div>
          <p className="text-xs text-slate-600">ARTIFICIAL INTELLIGENCE FOR REAL ESTATE</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.isCollapsible ? (
                <div>
                  <button
                    onClick={() => item.setIsOpen?.(!item.isOpen)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {item.isOpen && item.subItems && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.href}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-lg">Biens</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">imobia</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Property Cards */}
          <div className="space-y-4">
            {filteredProperties.map((property) => {
              const metadata = property.metadata as PropertyMetadata;
              const locationStr = formatLocation(metadata?.location);
              
              return (
                <Card 
                  key={property.id} 
                  className="bg-white border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    navigate(`/biens/${property.id}`);
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Property Image */}
                    <div className="w-full sm:w-48 h-32 flex-shrink-0">
                      <img 
                        src={getPropertyImage(property)}
                        alt={metadata?.title || 'Bien immobilier'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {metadata?.title || 'Sans titre'}
                        </h3>
                        {getStatusBadge(metadata?.status || 'available')}
                      </div>
                      
                      <div className="flex items-center text-slate-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {locationStr}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          {metadata?.surface ? 
                            (typeof metadata.surface === 'number' ? `${metadata.surface} m²` : 
                             metadata.surface.builtArea ? `${metadata.surface.builtArea} m²` : '-') 
                            : '-'}
                        </div>
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {metadata?.bedrooms || '-'}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {metadata?.bathrooms || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredProperties.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun bien trouvé</h3>
              <p className="text-slate-600 mb-4">
                {properties.length === 0 
                  ? "Vous n'avez pas encore ajouté de bien." 
                  : "Aucun bien ne correspond à votre recherche."
                }
              </p>
              <Link to="/biens/ajouter">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {properties.length === 0 ? "Ajouter votre premier bien" : "Ajouter un bien"}
                </Button>
              </Link>
            </div>
          )}
        </main>

        {/* Chat Input Section - Fixed at bottom */}
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="relative">
            <Input
              placeholder="Tapez votre message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-16"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biens;
