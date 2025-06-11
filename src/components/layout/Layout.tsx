
import React from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 border-b border-border flex justify-end">
          <LanguageSelector />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default Layout;
