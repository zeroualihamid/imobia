import React, { useState, useCallback, useEffect } from 'react';
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
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const {
    signOut
  } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [chatBotWidth, setChatBotWidth] = useState(() => {
    // Load saved width from localStorage or use default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatbot-width');
      return saved ? parseInt(saved, 10) : 320;
    }
    return 320;
  });
  const [isResizing, setIsResizing] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Save width to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-width', chatBotWidth.toString());
      console.log('💾 Saved ChatBot width to localStorage:', chatBotWidth);
    }
  }, [chatBotWidth]);

  // Handle resize functionality for ChatBot region
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    console.log('🖱️ ChatBot region resize started');
  }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 280; // Minimum width
    const maxWidth = window.innerWidth * 0.6; // Maximum 60% of screen width

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setChatBotWidth(newWidth);
      console.log('🔄 Resizing ChatBot region to:', newWidth);
    }
  }, [isResizing]);
  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      console.log('🖱️ ChatBot region resize ended');
    }
  }, [isResizing]);
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Change global cursor during resize
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // Reset global cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);
  return <div className="min-h-screen bg-white">
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
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden hover:bg-slate-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
                <h1 className="text-lg font-semibold text-slate-900">Gestion Immobilière</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <LanguageSelector />
                
                <Button variant="ghost" size="icon" onClick={toggleChatBot} className="lg:hidden hover:bg-slate-100">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Toggle chat</span>
                </Button>
                
                <Button variant="outline" size="sm" onClick={signOut} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </header>
          
          {/* Content Container */}
          <div className="flex flex-1 overflow-hidden bg-white relative">
            {/* Main Content */}
            <main style={{
            marginRight: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${chatBotWidth}px` : 0
          }} className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                {children}
              </div>
            </main>
            
            {/* Desktop ChatBot with Resize Handle */}
            <aside className="hidden lg:flex border-l border-slate-200 absolute right-0 top-0 bottom-0 bg-white" style={{
            width: `${chatBotWidth}px`,
            minWidth: '280px',
            maxWidth: '60vw'
          }}>
              {/* Resize Handle */}
              <div className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-50 transition-colors z-20 select-none group" onMouseDown={handleMouseDown} style={{
              userSelect: 'none',
              cursor: isResizing ? 'ew-resize' : 'col-resize'
            }}>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-300 rounded-r opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-0.5 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* ChatBot Component */}
              <div className="flex-1 ml-2">
                <ChatBot isOpen={true} disableResize={true} />
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      {/* Mobile ChatBot */}
      <ChatBot isOpen={isChatBotOpen} onToggle={toggleChatBot} />
    </div>;
};
export default Layout;