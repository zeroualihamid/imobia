
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
    <div className="w-80 bg-white border-l border-border h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Bot className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistant IMOBIA</h3>
            <p className="text-xs text-muted-foreground">Assistant IA immobilier</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="p-1 bg-emerald-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-emerald-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>
              {message.sender === 'user' && (
                <div className="p-1 bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
