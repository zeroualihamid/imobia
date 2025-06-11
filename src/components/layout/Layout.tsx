
import React from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Gestion Immobilière
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
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
        <div className="p-6 bg-slate-50 min-h-full">
          {children}
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default Layout;
