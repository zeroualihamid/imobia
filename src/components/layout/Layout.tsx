import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';
import LanguageSelector from '../LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [chatBotWidth, setChatBotWidth] = useState(() => {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-width', chatBotWidth.toString());
    }
  }, [chatBotWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const newWidth = isRTL ? e.clientX : window.innerWidth - e.clientX;
    const minWidth = 280;
    const maxWidth = window.innerWidth * 0.6;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setChatBotWidth(newWidth);
    }
  }, [isResizing, isRTL]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-white">
      <div className={cn("flex h-screen bg-white", isRTL && "flex-row-reverse")}>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className={cn(
              "flex h-14 items-center justify-between px-4 lg:px-6",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t('header.toggleSidebar')}</span>
                </Button>
                <h1 className="text-lg font-semibold text-slate-900">{t('header.title')}</h1>
              </div>
              
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <LanguageSelector />
                
                <Button variant="ghost" size="icon" onClick={toggleChatBot} className="lg:hidden">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">{t('header.toggleChat')}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut} 
                  className={cn(
                    "border-slate-300 text-slate-700",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {t('header.logout')}
                </Button>
              </div>
            </div>
          </header>
          
          {/* Content Container */}
          <div className="flex flex-1 overflow-hidden bg-white relative">
            {/* Main Content */}
            <main 
              style={{
                [isRTL ? 'marginLeft' : 'marginRight']: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${chatBotWidth}px` : 0
              }} 
              className="flex-1 overflow-auto bg-white"
            >
              <div className="p-6">
                {children}
              </div>
            </main>
            
            {/* Desktop ChatBot with Resize Handle */}
            <aside 
              className={cn(
                "hidden lg:flex border-slate-200 absolute top-0 bottom-0 bg-white",
                isRTL ? "left-0 border-r" : "right-0 border-l"
              )} 
              style={{
                width: `${chatBotWidth}px`,
                minWidth: '280px',
                maxWidth: '60vw'
              }}
            >
              {/* Resize Handle */}
              <div 
                className={cn(
                  "absolute top-0 bottom-0 w-2 cursor-col-resize bg-transparent transition-colors z-20 select-none group",
                  isRTL ? "right-0" : "left-0"
                )}
                onMouseDown={handleMouseDown} 
                style={{
                  userSelect: 'none',
                  cursor: isResizing ? 'ew-resize' : 'col-resize'
                }}
              >
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-300 rounded opacity-50 group-hover:opacity-100 transition-opacity",
                  isRTL ? "right-0 rounded-l" : "left-0 rounded-r"
                )}>
                  <div className="flex items-center justify-center h-full">
                    <div className="w-0.5 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* ChatBot Component */}
              <div className={cn("flex-1", isRTL ? "mr-2" : "ml-2")}>
                <ChatBot isOpen={true} disableResize={true} />
              </div>
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
