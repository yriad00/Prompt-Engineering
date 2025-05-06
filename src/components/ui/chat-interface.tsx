'use client';

import { useState, useRef, useEffect } from 'react';
import { RobotBackground } from './robot-background';
import { AnimatedTitle } from './animated-title';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  date: Date;
}

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Auto close sidebar on mobile after sending message
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    
    try {
      // Call optimization API
      const response = await fetch('back-endprompt-production.up.railway.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Display optimized response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `${data.optimized}\n\n${Array.isArray(data.features) && data.features.length > 0 ? `Features: ${data.features.join(', ')}` : ''}`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      // Handle error and display error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    // Update history with new chat
    if (messages.length === 0) {
      const newHistory: ChatHistory = {
        id: Date.now().toString(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        date: new Date()
      };
      
      setChatHistories(prev => [newHistory, ...prev]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      {/* Robot background */}
      <RobotBackground />
      
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static top-0 bottom-0 left-0 z-20
        w-64 border-r border-white/10 flex flex-col h-full 
        bg-black transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-white/10">
          <button 
            onClick={clearChat}
            className="w-full py-2 px-4 rounded border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {chatHistories.map(chat => (
            <div 
              key={chat.id}
              className="p-3 rounded hover:bg-white/5 cursor-pointer mb-1 text-sm transition"
            >
              <div className="truncate">{chat.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(chat.date)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/10 p-4 flex items-center justify-between">
          <button 
            className="md:hidden p-2 hover:bg-white/5 rounded-md"
            onClick={toggleSidebar}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex justify-center">
            <AnimatedTitle 
              text="Prompt Engineering" 
              className="text-xl md:text-2xl font-medium"
            />
          </div>
          
          <div className="w-8 md:hidden"></div> {/* Empty space for balance */}
        </header>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p className="text-center max-w-md">
                Start a conversation by typing a message below.
                <br /><br />
                Your chat history will appear in the sidebar.
              </p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3xl p-4 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-white/10 rounded-tr-none' 
                      : 'bg-white/5 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </div>
                    {message.sender === 'assistant' && !message.content.startsWith('Sorry, an error occurred') && (
                      <button
                        onClick={() => {
                          // Ne copier que le texte principal (avant Features:)
                          let contentToCopy = message.content;
                          if (contentToCopy.includes('Features:')) {
                            contentToCopy = contentToCopy.split('Features:')[0].trim();
                          }
                          navigator.clipboard.writeText(contentToCopy)
                            
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        Copy prompt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pr-12 max-h-[200px] min-h-[50px] resize-none focus:outline-none focus:ring-1 focus:ring-white/30"
                rows={1}
              />
              <button 
                type="submit" 
                className="absolute bottom-3 right-3 p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Icons
function PlusIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function SendIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function MenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
} 
