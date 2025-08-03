
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-white">
      {/* Main Layout Container */}
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="flex h-14 items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="lg:hidden hover:bg-slate-100"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
                <h1 className="text-lg font-semibold text-slate-900">Gestion Immobilière</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <LanguageSelector />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChatBot}
                  className="lg:hidden hover:bg-slate-100"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Toggle chat</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </header>
          
          {/* Content Container */}
          <div className="flex flex-1 overflow-hidden bg-white">
            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                {children}
              </div>
            </main>
            
            {/* Desktop ChatBot */}
            <aside className="hidden lg:flex w-80 border-l border-slate-200">
              <ChatBot isOpen={true} />
            </aside>
          </div>
        </div>
      </div>
      
      {/* Mobile ChatBot */}
      <ChatBot isOpen={isChatBotOpen} onToggle={toggleChatBot} />
    </div>
  );
};

export default Layout;
