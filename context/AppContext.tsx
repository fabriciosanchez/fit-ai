
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import type { User, AssessmentData, FitnessPlan, ChatMessage } from '../types';
import { generatePlan, startChat, sendMessageToChat } from '../services/geminiService';
import type { Chat } from '@google/genai';

interface AppContextType {
  user: User | null;
  assessmentData: AssessmentData | null;
  assessmentCompleted: boolean;
  plan: FitnessPlan | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  submitAssessment: (data: AssessmentData) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAssessmentData(null);
    setAssessmentCompleted(false);
    setPlan(null);
    setChatMessages([]);
    setChat(null);
  };

  const submitAssessment = useCallback(async (data: AssessmentData) => {
    setIsLoading(true);
    setError(null);
    try {
      setAssessmentData(data);
      const generatedPlan = await generatePlan(data);
      setPlan(generatedPlan);
      setAssessmentCompleted(true);
      
      const chatInstance = startChat(generatedPlan);
      setChat(chatInstance);
      setChatMessages([{ role: 'model', text: `Hi ${user?.name}! I'm FitBot. Ask me anything about your new plan.` }]);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.name]);

  const sendChatMessage = async (message: string) => {
    if (!chat) return;
    
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setIsLoading(true);
    
    try {
        const responseText = await sendMessageToChat(message);
        setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch(e) {
        const errorText = e instanceof Error ? e.message : "Sorry, I encountered an error.";
        setChatMessages(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      assessmentData,
      assessmentCompleted,
      plan,
      chatMessages,
      isLoading,
      error,
      login,
      logout,
      submitAssessment,
      sendChatMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};
