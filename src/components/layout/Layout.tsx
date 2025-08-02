
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="flex-1 overflow-auto bg-white">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 bg-white">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-slate-900">
                Gestion Immobilière
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {/* Mobile ChatBot Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChatBot}
                className="lg:hidden"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>
        <div className="p-6 bg-white min-h-full">
          {children}
        </div>
      </main>
      
      {/* ChatBot - Hidden on mobile by default, always visible on desktop */}
      <div className="hidden lg:block">
        <ChatBot isOpen={true} />
      </div>
      
      {/* Mobile ChatBot - Only shows when toggled */}
      <div className="lg:hidden">
        <ChatBot isOpen={isChatBotOpen} onToggle={toggleChatBot} />
      </div>
    </div>
  );
};

export default Layout;
