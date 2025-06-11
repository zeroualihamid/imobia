
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
  ChevronRight
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Sidebar = () => {
  const location = useLocation();
  const [biensOpen, setBiensOpen] = useState(false);
  const [conseillesOpen, setConseillesOpen] = useState(false);
  const [demandesOpen, setDemandesOpen] = useState(false);
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
        { title: 'Tous les biens', href: '/biens', icon: List }
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
        { title: 'Ajouter un conseiller', href: '/conseillers/ajouter', icon: UserPlus }
      ]
    },
    {
      title: 'Demandes',
      icon: FileText,
      color: 'text-orange-600',
      isCollapsible: true,
      isOpen: demandesOpen,
      setIsOpen: setDemandesOpen,
      subItems: [
        { title: 'Demande client', href: '/demandes/client', icon: Users },
        { title: 'Demande agent', href: '/demandes/agent', icon: Users }
      ]
    },
    {
      title: 'Mandats',
      icon: FileText,
      href: '/mandats/ajouter',
      color: 'text-red-600'
    },
    {
      title: 'Planning',
      icon: Calendar,
      href: '/planning',
      color: 'text-indigo-600'
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
    <div className="w-64 bg-white border-r border-border h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Building2 className="h-8 w-8 text-emerald-600" />
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            IMOBIA
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion Immobilière</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.isCollapsible ? (
              <Collapsible open={item.isOpen} onOpenChange={item.setIsOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent w-full",
                    item.color
                  )}>
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                  {item.subItems?.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent",
                        location.pathname === subItem.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.title}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                  location.pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : item.color
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
