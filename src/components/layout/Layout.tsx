import React from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
            <LanguageSelector />
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
