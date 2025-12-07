import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Plus, Users, MessageSquare, Calendar, FileText, Send, Home, UserPlus, List, ChevronDown, ChevronRight, Mic, ClipboardList, Settings, Shield, User, UsersIcon, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PermissionGuard from '@/components/rbac/PermissionGuard';
interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}
const Sidebar = ({
  isOpen = true,
  onToggle
}: SidebarProps) => {
  const location = useLocation();
  const [biensOpen, setBiensOpen] = useState(false);
  const [conseillesOpen, setConseillesOpen] = useState(false);
  const [proprietaireOpen, setProprietaireOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [messagerieOpen, setMessagerieOpen] = useState(false);
  const menuItems = [{
    title: 'Tableau de bord',
    icon: BarChart3,
    href: '/',
    color: 'text-emerald-600'
  }, {
    title: 'Biens',
    icon: Building2,
    color: 'text-blue-600',
    isCollapsible: true,
    isOpen: biensOpen,
    setIsOpen: setBiensOpen,
    subItems: [{
      title: 'Ajouter bien',
      href: '/biens/ajouter',
      icon: Plus
    }, {
      title: 'Tous les biens',
      href: '/biens',
      icon: List
    }, {
      title: 'Création vocale',
      href: '/biens/creation-vocale',
      icon: Mic
    }, {
      title: 'Scraper Mubawab',
      icon: Search,
      href: '/mubawab-scraper'
    }]
  }, {
    title: 'Conseillers',
    icon: Users,
    color: 'text-purple-600',
    isCollapsible: true,
    isOpen: conseillesOpen,
    setIsOpen: setConseillesOpen,
    subItems: [{
      title: 'Liste des conseillers',
      href: '/conseillers',
      icon: List
    }, {
      title: 'Ajouter un conseiller',
      href: '/conseillers/ajouter',
      icon: UserPlus
    }, {
      title: 'Pilotage des conseillers',
      href: '/conseillers/pilotage',
      icon: Settings
    }]
  }, {
    title: 'Propriétaire',
    icon: User,
    color: 'text-orange-600',
    isCollapsible: true,
    isOpen: proprietaireOpen,
    setIsOpen: setProprietaireOpen,
    subItems: [{
      title: 'Ajouter',
      href: '/proprietaire/ajouter',
      icon: Plus
    }, {
      title: 'Tous',
      href: '/proprietaire',
      icon: List
    }]
  }, {
    title: 'Clients',
    icon: UsersIcon,
    color: 'text-red-600',
    isCollapsible: true,
    isOpen: clientsOpen,
    setIsOpen: setClientsOpen,
    subItems: [{
      title: 'Ajouter',
      href: '/clients/ajouter',
      icon: Plus
    }, {
      title: 'Tous',
      href: '/clients',
      icon: List
    }]
  }, {
    title: 'Mandats',
    icon: FileText,
    href: '/mandats/ajouter',
    color: 'text-rose-600'
  }, {
    title: 'Planning',
    icon: Calendar,
    href: '/planning',
    color: 'text-cyan-600'
  }, {
    title: 'Messagerie',
    icon: MessageSquare,
    color: 'text-green-600',
    isCollapsible: true,
    isOpen: messagerieOpen,
    setIsOpen: setMessagerieOpen,
    subItems: [{
      title: 'Envoi par WhatsApp',
      href: '/messagerie/whatsapp',
      icon: Send
    }]
  }, {
    title: 'Matching bien et besoin',
    icon: Home,
    href: '/matching',
    color: 'text-teal-600'
  }];
  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onToggle && window.innerWidth < 1024) {
      onToggle();
    }
  };
  return <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div className={cn("fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-slate-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Logo Section */}
        <div className="border-b border-slate-200 p-6 bg-white">
          <div className="flex flex-col items-center space-y-3">
            <img src="/logo_imobia.PNG" alt="IMOBIA Logo" className="h-20 w-20 object-contain" />
          </div>
        </div>
      
      <nav className="flex-1 space-y-1 p-4 bg-slate-200 text-black border-0 shadow-md">
        {menuItems.map((item, index) => <div key={index}>
            {item.isCollapsible ? <Collapsible open={item.isOpen} onOpenChange={item.setIsOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 text-slate-700", item.color)}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left text-slate-900">{item.title}</span>
                    {item.isOpen ? <ChevronDown className="h-4 w-4 transition-transform duration-200 text-slate-500" /> : <ChevronRight className="h-4 w-4 transition-transform duration-200 text-slate-500" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                  {item.subItems?.map((subItem, subIndex) => <Link key={subIndex} to={subItem.href} onClick={handleLinkClick} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100", location.pathname === subItem.href ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:text-slate-900")}>
                      <subItem.icon className="h-4 w-4 shrink-0" />
                      <span>{subItem.title}</span>
                    </Link>)}
                </CollapsibleContent>
              </Collapsible> : <Link to={item.href} onClick={handleLinkClick} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100", location.pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:text-slate-900")}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>}
          </div>)}

        {/* Admin Section */}
        <PermissionGuard role="Admin">
          <div className="mt-4 border-t border-slate-200 pt-4">
            <Link to="/admin/roles" onClick={handleLinkClick} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100", location.pathname === "/admin/roles" ? "bg-blue-50 text-blue-700" : "text-red-600 hover:text-red-700")}>
              <Shield className="h-4 w-4 shrink-0" />
              <span>Gestion des rôles</span>
            </Link>
          </div>
        </PermissionGuard>
      </nav>
      </div>
    </>;
};
export default Sidebar;