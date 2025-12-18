import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Info } from 'lucide-react';
import { Message, LocationCoords } from '../types';
import { geminiService } from '../services/geminiService';
import { GroundingDisplay } from './GroundingDisplay';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  initialPrompt?: string;
  contextMode?: 'general' | 'services';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialPrompt, contextMode = 'general' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: contextMode === 'services' 
        ? "I can help you find local services like hospices, palliative care centers, or support groups. Where are you located?"
        : "Namaste. I am the Good Death AI assistant. I can help you with end-of-life planning, legal queries, or emotional support. How can I help you today?",
      timestamp: Date.now(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationCoords | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get location on mount for better map results
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Location permission denied or error:", error);
        }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial prompt if passed (e.g. from a quick action button)
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Format history for the API
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await geminiService.generateResponse(text, history, location);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please check your internet or try again in a moment.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="bg-sage-600 px-6 py-4 flex justify-between items-center text-white">
        <div>
          <h2 className="text-lg font-serif font-medium">
            {contextMode === 'services' ? 'Service Finder' : 'Good Death Companion'}
          </h2>
          <p className="text-sage-100 text-xs">
            {contextMode === 'services' ? 'Locating trusted help nearby' : 'Private & Secure Conversation'}
          </p>
        </div>
        <div className="bg-sage-500/50 p-2 rounded-full">
           <Info className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-stone-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-sage-600 text-white rounded-br-sm'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-800' : ''}`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-stone max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>

            {/* Render Grounding Data (Maps/Search) for model messages */}
            {msg.role === 'model' && msg.groundingMetadata && (msg.groundingMetadata.groundingChunks?.length ?? 0) > 0 && (
              <div className="max-w-[85%] md:max-w-[75%] mt-2 w-full">
                <GroundingDisplay chunks={msg.groundingMetadata.groundingChunks!} />
              </div>
            )}
            
            <span className="text-[10px] text-stone-400 mt-1 px-1">
              {msg.role === 'model' ? 'Good Death AI' : 'You'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sage-600 pl-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={contextMode === 'services' ? "E.g., Find palliative care in Mumbai..." : "Ask about wills, rituals, or grief..."}
            className="w-full pl-5 pr-12 py-4 bg-stone-50 border-stone-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500 transition-all shadow-inner text-stone-700 placeholder-stone-400"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:hover:bg-sage-600 transition-colors shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-stone-400 mt-2">
          AI can make mistakes. Please verify important legal and medical information.
        </p>
      </div>
    </div>
  );
};