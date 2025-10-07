
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ChatAgent: React.FC = () => {
  const { chatMessages, sendChatMessage, isLoading } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleSend = () => {
    if (input.trim()) {
      sendChatMessage(input);
      setInput('');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} className="rounded-full !p-4 shadow-lg">
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-full max-w-sm animate-slide-in-up">
          <Card className="flex flex-col h-[60vh]">
            <h2 className="text-lg font-bold text-secondary border-b pb-2">FitBot Assistant</h2>
            <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-neutral text-secondary'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
               {isLoading && chatMessages[chatMessages.length - 1]?.role === 'user' && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-neutral text-secondary">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 border-t pt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your plan..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading && chatMessages[chatMessages.length - 1]?.role === 'user'}
              />
              <Button onClick={handleSend} disabled={isLoading && chatMessages[chatMessages.length - 1]?.role === 'user'} className="!p-3">
                <SendIcon />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

export default ChatAgent;
