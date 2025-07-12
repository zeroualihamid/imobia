import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Building2, 
  Plus, 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Send,
  Home,
  UserPlus,
  List,
  ChevronDown,
  ChevronRight,
  Mic,
  ClipboardList,
  Settings,
  Shield,
  User,
  UsersIcon
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PermissionGuard from '@/components/rbac/PermissionGuard';

const Sidebar = () => {
  const location = useLocation();
  const [biensOpen, setBiensOpen] = useState(false);
  const [conseillesOpen, setConseillesOpen] = useState(false);
  const [proprietaireOpen, setProprietaireOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [messagerieOpen, setMessagerieOpen] = useState(false);

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: BarChart3,
      href: '/',
      color: 'text-emerald-600'
    },
    {
      title: 'Biens',
      icon: Building2,
      color: 'text-blue-600',
      isCollapsible: true,
      isOpen: biensOpen,
      setIsOpen: setBiensOpen,
      subItems: [       
        { title: 'Ajouter bien', href: '/biens/ajouter', icon: Plus },
        { title: 'Tous les biens', href: '/biens', icon: List },
        { title: 'Création vocale', href: '/biens/creation-vocale', icon: Mic }
      ]
    },
    {
      title: 'Conseillers',
      icon: Users,
      color: 'text-purple-600',
      isCollapsible: true,
      isOpen: conseillesOpen,
      setIsOpen: setConseillesOpen,
      subItems: [
        { title: 'Liste des conseillers', href: '/conseillers', icon: List },
        { title: 'Ajouter un conseiller', href: '/conseillers/ajouter', icon: UserPlus },
        { title: 'Pilotage des conseillers', href: '/conseillers/pilotage', icon: Settings }
      ]
    },
    {
      title: 'Propriétaire',
      icon: User,
      color: 'text-orange-600',
      isCollapsible: true,
      isOpen: proprietaireOpen,
      setIsOpen: setProprietaireOpen,
      subItems: [
        { title: 'Ajouter', href: '/proprietaire/ajouter', icon: Plus },
        { title: 'Tous', href: '/proprietaire', icon: List }
      ]
    },
    {
      title: 'Clients',
      icon: UsersIcon,
      color: 'text-red-600',
      isCollapsible: true,
      isOpen: clientsOpen,
      setIsOpen: setClientsOpen,
      subItems: [
        { title: 'Ajouter', href: '/clients/ajouter', icon: Plus },
        { title: 'Tous', href: '/clients', icon: List }
      ]
    },
    {
      title: 'Mandats',
      icon: FileText,
      href: '/mandats/ajouter',
      color: 'text-rose-600'
    },
    {
      title: 'Planning',
      icon: Calendar,
      href: '/planning',
      color: 'text-cyan-600'
    },
    {
      title: 'Messagerie',
      icon: MessageSquare,
      color: 'text-green-600',
      isCollapsible: true,
      isOpen: messagerieOpen,
      setIsOpen: setMessagerieOpen,
      subItems: [
        { title: 'Envoi par WhatsApp', href: '/messagerie/whatsapp', icon: Send }
      ]
    },
    {
      title: 'Matching bien et besoin',
      icon: Home,
      href: '/matching',
      color: 'text-teal-600'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex flex-col items-center space-y-3">
          <img 
            src="/logo_imobia.PNG" 
            alt="IMOBIA Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 bg-white">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.isCollapsible ? (
              <Collapsible open={item.isOpen} onOpenChange={item.setIsOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full group bg-white",
                    item.color
                  )}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left text-slate-900">{item.title}</span>
                    {item.isOpen ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 text-slate-700" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 text-slate-700" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8 mt-1 space-y-1 bg-white">
                  {item.subItems?.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 bg-white",
                        location.pathname === subItem.href
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-700"
                      )}
                    >
                      <subItem.icon className="h-4 w-4 flex-shrink-0 text-slate-600" />
                      <span className="text-slate-900">{subItem.title}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-white",
                  location.pathname === item.href
                    ? "bg-slate-100 text-slate-900"
                    : item.color
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-slate-900">{item.title}</span>
              </Link>
            )}
          </div>
        ))}

        {/* Admin Section - Only visible to Admin users */}
        <PermissionGuard role="Admin">
          <div className="pt-4 border-t border-slate-200 mt-4 bg-white">
            <Link
              to="/admin/roles"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-white",
                location.pathname === "/admin/roles"
                  ? "bg-slate-100 text-slate-900"
                  : "text-red-600"
              )}
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              <span className="text-slate-900">Gestion des rôles</span>
            </Link>
          </div>
        </PermissionGuard>
      </nav>
    </div>
  );
};

export default Sidebar;
