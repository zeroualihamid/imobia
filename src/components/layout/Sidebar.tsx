import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Plus, Users, MessageSquare, Calendar, FileText, Send, Home, UserPlus, List, ChevronDown, ChevronRight, Mic, ClipboardList, Settings, Shield, User, UsersIcon, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PermissionGuard from '@/components/rbac/PermissionGuard';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({
  isOpen = true,
  onToggle
}: SidebarProps) => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const [biensOpen, setBiensOpen] = useState(false);
  const [conseillesOpen, setConseillesOpen] = useState(false);
  const [proprietaireOpen, setProprietaireOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [messagerieOpen, setMessagerieOpen] = useState(false);
  const [demandesOpen, setDemandesOpen] = useState(false);

  const menuItems = [{
    title: t('nav.dashboard'),
    icon: BarChart3,
    href: '/',
    color: 'text-emerald-600'
  }, {
    title: t('nav.properties'),
    icon: Building2,
    color: 'text-blue-600',
    isCollapsible: true,
    isOpen: biensOpen,
    setIsOpen: setBiensOpen,
    subItems: [{
      title: t('nav.addProperty'),
      href: '/biens/ajouter',
      icon: Plus
    }, {
      title: t('nav.allProperties'),
      href: '/biens',
      icon: List
    }, {
      title: t('nav.voiceCreation'),
      href: '/biens/creation-vocale',
      icon: Mic
    }, {
      title: t('nav.scraperMubawab'),
      icon: Search,
      href: '/mubawab-scraper'
    }]
  }, {
    title: t('nav.advisors'),
    icon: Users,
    color: 'text-purple-600',
    isCollapsible: true,
    isOpen: conseillesOpen,
    setIsOpen: setConseillesOpen,
    subItems: [{
      title: t('nav.advisorsList'),
      href: '/conseillers',
      icon: List
    }, {
      title: t('nav.addAdvisor'),
      href: '/conseillers/ajouter',
      icon: UserPlus
    }, {
      title: t('nav.advisorPiloting'),
      href: '/conseillers/pilotage',
      icon: Settings
    }]
  }, {
    title: t('nav.owner'),
    icon: User,
    color: 'text-orange-600',
    isCollapsible: true,
    isOpen: proprietaireOpen,
    setIsOpen: setProprietaireOpen,
    subItems: [{
      title: t('nav.addOwner'),
      href: '/proprietaire/ajouter',
      icon: Plus
    }, {
      title: t('nav.allOwners'),
      href: '/proprietaire',
      icon: List
    }]
  }, {
    title: t('nav.clients'),
    icon: UsersIcon,
    color: 'text-red-600',
    isCollapsible: true,
    isOpen: clientsOpen,
    setIsOpen: setClientsOpen,
    subItems: [{
      title: t('nav.addClient'),
      href: '/clients/ajouter',
      icon: Plus
    }, {
      title: t('nav.allClients'),
      href: '/clients',
      icon: List
    }]
  }, {
    title: t('nav.requests'),
    icon: ClipboardList,
    color: 'text-indigo-600',
    isCollapsible: true,
    isOpen: demandesOpen,
    setIsOpen: setDemandesOpen,
    subItems: [{
      title: t('nav.allRequests'),
      href: '/demandes',
      icon: List
    }, {
      title: t('nav.addRequest'),
      href: '/demandes/ajouter',
      icon: Plus
    }, {
      title: t('nav.searchRequest'),
      href: '/demandes/recherche',
      icon: Search
    }, {
      title: t('nav.matchingRequest'),
      href: '/demandes/matching',
      icon: Home
    }]
  }, {
    title: t('nav.mandates'),
    icon: FileText,
    href: '/mandats/ajouter',
    color: 'text-rose-600'
  }, {
    title: t('nav.planning'),
    icon: Calendar,
    href: '/planning',
    color: 'text-cyan-600'
  }, {
    title: t('nav.messaging'),
    icon: MessageSquare,
    color: 'text-green-600',
    isCollapsible: true,
    isOpen: messagerieOpen,
    setIsOpen: setMessagerieOpen,
    subItems: [{
      title: t('nav.whatsapp'),
      href: '/messagerie/whatsapp',
      icon: Send
    }]
  }, {
    title: t('nav.matching'),
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
    <div className={cn(
      "fixed lg:static inset-y-0 z-50 w-64 bg-white border-slate-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0",
      isRTL ? "right-0 border-l lg:translate-x-0" : "left-0 border-r",
      isOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")
    )}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:hidden bg-white">
        <h2 className="text-lg font-semibold text-slate-900">{t('nav.menu')}</h2>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <X className="h-4 w-4" />
          <span className="sr-only">{t('common.close')}</span>
        </Button>
      </div>

      {/* Logo Section */}
      <div className="border-b border-slate-200 p-6 bg-white">
        <div className="flex flex-col items-center space-y-3">
          <img src="/logo_imobia.PNG" alt="IMOBIA Logo" className="h-20 w-20 object-contain" />
        </div>
      </div>
    
      <nav className="flex-1 space-y-1 p-4 bg-white overflow-y-auto">
        {menuItems.map((item, index) => <div key={index}>
          {item.isCollapsible ? (
            <Collapsible open={item.isOpen} onOpenChange={item.setIsOpen}>
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-white",
                  isRTL && "flex-row-reverse text-right"
                )}>
                  <item.icon className={cn("h-4 w-4 shrink-0", item.color)} />
                  <span className={cn("flex-1", isRTL ? "text-right" : "text-left", "text-slate-900")}>{item.title}</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-slate-500 transition-transform duration-300 ease-out",
                    item.isOpen ? "rotate-0" : (isRTL ? "rotate-90" : "-rotate-90")
                  )} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className={cn(
                "mt-1 space-y-1 bg-white overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
                isRTL ? "mr-6" : "ml-6"
              )}>
                {item.subItems?.map((subItem, subIndex) => (
                  <Link 
                    key={subIndex} 
                    to={subItem.href} 
                    onClick={handleLinkClick} 
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-white",
                      isRTL && "flex-row-reverse text-right",
                      location.pathname === subItem.href ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600"
                    )}
                  >
                    <subItem.icon className="h-4 w-4 shrink-0" />
                    <span>{subItem.title}</span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link 
              to={item.href!} 
              onClick={handleLinkClick} 
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-white",
                isRTL && "flex-row-reverse text-right",
                location.pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-700"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", item.color)} />
              <span>{item.title}</span>
            </Link>
          )}
        </div>)}

        {/* Admin Section */}
        <PermissionGuard role="Admin">
          <div className="mt-4 border-t border-slate-200 pt-4">
            <Link 
              to="/admin/roles" 
              onClick={handleLinkClick} 
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isRTL && "flex-row-reverse text-right",
                location.pathname === "/admin/roles" ? "bg-blue-50 text-blue-700" : "text-red-600"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>{t('nav.roleManagement')}</span>
            </Link>
          </div>
        </PermissionGuard>
      </nav>
    </div>
  </>;
};

export default Sidebar;
