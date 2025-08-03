import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Bot, User, X, Minimize2, Loader, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { sendMessage, handleChatStream } from '@/lib/chat';
import { useToast } from '@/hooks/use-toast';
import { flushSync } from 'react-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  state?: Record<string, unknown>;
}

interface ChatBotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatBot = ({ isOpen = true, onToggle }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre assistant IMOBIA. Comment puis-je vous aider avec la gestion de vos biens immobiliers ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [chatWidth, setChatWidth] = useState(320); // Default width in pixels
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Custom markdown formatter for bot messages
  const formatMessage = (content: string) => {
    if (!content) return content;
    
    // Convert markdown to HTML with proper formatting
    return content
      // Bold text: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks: ```code``` -> <code>code</code>
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto"><code>$1</code></pre>')
      // Inline code: `code` -> <code>code</code>
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>')
      // Headers: # Header -> <h3>Header</h3>
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-2 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-3 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
      // Lists: - item -> <li>item</li>
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Numbered lists: 1. item -> <li>item</li>
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks: \n -> <br>
      .replace(/\n/g, '<br>')
      // Wrap lists in ul/ol
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-4 mb-2">$1</ul>')
      // Clean up multiple list wrappers
      .replace(/<\/ul>\s*<ul[^>]*>/g, '');
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    console.log('🚀 ChatBot: Starting message send process');

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const messageText = inputValue;
    console.log('📤 ChatBot: Sending message:', messageText);
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create initial bot message for streaming
      const botMessageId = (Date.now() + 1).toString();
      console.log('🤖 ChatBot: Created bot message ID:', botMessageId);
      
      const initialBotMessage: Message = {
        id: botMessageId,
        content: '',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, initialBotMessage]);
      console.log('💬 ChatBot: Added initial bot message to state');

             // Send message to API
       console.log('📡 ChatBot: Calling sendMessage API...');
       const response = await sendMessage(messageText, { type: 'bearer' });
       console.log('✅ ChatBot: API response received, starting stream handling');

       // Handle streaming response immediately
       let chunkCount = 0;
       console.log('🔄 ChatBot: Starting stream processing...');
       await handleChatStream(
        response,
                 (content: string, state: Record<string, unknown>) => {
           chunkCount++;
           const timestamp = new Date().toISOString();
           console.log(`🔥 ChatBot: Received chunk #${chunkCount} at ${timestamp}:`, {
             content: content,
             contentLength: content.length,
             state: state,
             botMessageId: botMessageId
           });

                       // Force immediate DOM update for streaming effect
            console.log(`⚡ ChatBot: Updating DOM for chunk #${chunkCount}...`);
            
            // Use flushSync to ensure immediate DOM update
            flushSync(() => {
              setMessages(prev => {
                const updatedMessages = prev.map(msg => {
                  if (msg.id === botMessageId) {
                    const newContent = msg.content + content;
                    console.log(`📝 ChatBot: Updating message content (FLUSHED):`, {
                      previousContent: msg.content,
                      newChunk: content,
                      finalContent: newContent,
                      finalLength: newContent.length
                    });
                    return { 
                      ...msg, 
                      content: newContent, // Append new content
                      state: state,
                      isStreaming: true
                    };
                  }
                  return msg;
                });
                console.log(`🔄 ChatBot: Messages state updated (FLUSHED), total messages: ${updatedMessages.length}`);
                return updatedMessages;
              });
            });
            
                         // Force scroll to bottom after each chunk (immediate)
             if (scrollAreaRef.current) {
               const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
               if (scrollContainer) {
                 scrollContainer.scrollTop = scrollContainer.scrollHeight;
               }
             }
        },
        () => {
          console.log(`🏁 ChatBot: Stream completed! Total chunks processed: ${chunkCount}`);
          
          // Mark streaming as complete
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { 
                    ...msg, 
                    isStreaming: false,
                    // Log final content
                    content: (() => {
                      console.log(`✅ ChatBot: Final message content: "${msg.content}" (${msg.content.length} chars)`);
                      return msg.content;
                    })()
                  }
                : msg
            )
          );
          setIsLoading(false);
          console.log('🎯 ChatBot: Streaming session completed');
        }
      );
    } catch (error) {
      console.error('❌ ChatBot: Error occurred:', error);
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `Désolé, une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => {
        // Remove the streaming message and add error message
        const filteredMessages = prev.filter(msg => !msg.isStreaming);
        console.log('🧹 ChatBot: Cleaned up streaming messages, adding error message');
        return [...filteredMessages, errorMessage];
      });

      toast({
        title: "Erreur de chat",
        description: "Impossible de contacter l'assistant IA. Veuillez réessayer.",
        variant: "destructive"
      });

      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 280; // Minimum width
    const maxWidth = window.innerWidth * 0.8; // Maximum 80% of screen width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setChatWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Change global cursor during resize
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection during resize
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // Reset global cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Mobile floating chat button
  if (!isOpen && onToggle) {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg lg:hidden"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Open chat</span>
      </Button>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onToggle && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* ChatBot Panel */}
      <div 
        className={cn(
          "flex h-full flex-col bg-white",
          // Desktop: Always visible
          "lg:relative lg:w-full",
          // Mobile: Fixed overlay
          onToggle && "lg:hidden fixed inset-0 z-50 transition-transform duration-300",
          onToggle && (isOpen ? "translate-x-0" : "translate-x-full")
        )}
        style={{ 
          width: !onToggle && typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${chatWidth}px` : undefined,
          cursor: isResizing ? 'ew-resize' : 'default'
        }}
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200">
                <img 
                  src="/logo_imobia.PNG" 
                  alt="IMOBIA" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Assistant IMOBIA</h3>
                <p className="text-xs text-slate-500">Assistant IA immobilier</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!onToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 hover:bg-slate-100"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Minimize</span>
                </Button>
              )}
               
              {onToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="h-8 w-8 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resize handle - Desktop only */}
        {!onToggle && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-200 transition-colors hidden lg:block"
            onMouseDown={handleMouseDown}
            style={{ zIndex: 10 }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="h-8 w-1 text-blue-600" />
            </div>
          </div>
        )}

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <ScrollArea className="flex-1 p-4 bg-white" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                        {message.isStreaming ? (
                          <Loader className="h-4 w-4 animate-spin text-blue-600" />
                        ) : (
                          <img 
                            src="/logo_imobia.PNG" 
                            alt="Bot" 
                            className="h-4 w-4 object-contain"
                          />
                        )}
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      )}
                    >
                      {message.sender === 'bot' ? (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: formatMessage(message.content || (message.isStreaming ? 'En train de réfléchir...' : ''))
                          }}
                          className="prose prose-sm max-w-none [&_*]:text-inherit"
                        />
                      ) : (
                        <span>{message.content}</span>
                      )}
                      
                      {message.isStreaming && (
                        <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-slate-400">|</span>
                      )}
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
