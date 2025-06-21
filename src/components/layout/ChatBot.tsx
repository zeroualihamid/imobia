import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre assistant IMOBIA. Comment puis-je vous aider avec la gestion de vos biens immobiliers ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Je traite votre demande... Cette fonctionnalité sera bientôt disponible avec l\'intégration d\'un vrai chatbot IA.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
            <img 
              src="/logo_imobia.PNG" 
              alt="IMOBIA" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Assistant IMOBIA</h3>
            <p className="text-xs text-slate-500">Assistant IA immobilier</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-white">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-1 flex-shrink-0 border border-slate-200">
                  <img 
                    src="/logo_imobia.PNG" 
                    alt="IMOBIA Bot" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
              {message.sender === 'user' && (
                <div className="p-1.5 bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-500"
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
