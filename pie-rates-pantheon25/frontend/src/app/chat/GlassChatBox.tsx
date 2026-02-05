"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "../../components/MessageBubble";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../app/utils/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  animate?: boolean;
}

// --- External Components ---

interface QuickPromptsProps {
  handleSubmit: (e?: React.FormEvent, promptText?: string) => void;
}

const QuickPrompts: React.FC<QuickPromptsProps> = ({ handleSubmit }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl mx-auto">
    {[
      { icon: "", text: "How much did I spend last month?" },
      { icon: "", text: "What category did I spend the most?" },
      { icon: "", text: "Show my recent transactions" }
    ].map((prompt, i) => (
      <motion.button
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSubmit(undefined, prompt.text)}
        className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all"
      >
        <span>{prompt.icon}</span>
        <span>{prompt.text}</span>
      </motion.button>
    ))}
  </div>
);

interface InputCardProps {
  isCompact?: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSubmit: (e?: React.FormEvent, promptText?: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  speechSupported: boolean;
  isRecording: boolean;
  startListening: () => void;
  stopListening: () => void;
  startRecording: () => void;
}

const InputCard: React.FC<InputCardProps> = ({
  isCompact = false,
  inputValue,
  setInputValue,
  handleSubmit,
  fileInputRef,
  handleFileUpload,
  speechSupported,
  isRecording,
  startListening,
  stopListening,
  startRecording
}) => (
  <div className={`${isCompact ? "w-full" : "w-full max-w-3xl mx-auto"} relative`}>
    <div className={`
          relative bg-white dark:bg-gray-900 
          ${isCompact ? "rounded-2xl border-t border-gray-100 dark:border-gray-800" : "rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800"} 
          overflow-hidden transition-all duration-300
      `}>
      {/* Header (Only in full view) */}
      {!isCompact && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="font-semibold text-sm">Chat</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`${isCompact ? "p-3" : "p-6"}`}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="How can AI help you today?"
          className={`
                      w-full bg-transparent border-none focus:ring-0 resize-none outline-none 
                      text-gray-800 dark:text-gray-200 placeholder-gray-400
                      ${isCompact ? "h-12 py-3" : "h-12 text-lg"}
                  `}
        />

        {/* Actions Bar */}
        <div className={`flex items-center justify-between ${isCompact ? "" : "mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"}`}>
          <div className="flex gap-2">
            {/* Attach Button */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </motion.button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

            {/* Voice Button */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={speechSupported ? (isRecording ? stopListening : startListening) : startRecording}
              className={`p-2 rounded-xl transition-colors ${isRecording ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </motion.button>
          </div>

          {/* Send Button */}
          <div className="flex items-center gap-3">
            <motion.button
              layout
              disabled={!inputValue.trim()}
              onClick={() => handleSubmit()}
              className={`p-2.5 rounded-xl shadow-lg transition-all ${inputValue.trim()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-800 dark:text-gray-600"
                }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const GlassChatBox: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const api = useApi();

  // Detect browser speech recognition support
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (SR) {
      setSpeechSupported(true);
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN";
    }

    return () => {
      try {
        if (recognitionRef.current) recognitionRef.current.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice & Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstart = () => setIsRecording(true);
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        simulateTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    let finalTranscript = "";
    recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0]?.transcript + " ";
      }
    };
    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (finalTranscript.trim()) setInputValue(finalTranscript.trim());
    };
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const simulateTranscription = (audioBlob: Blob) => {
    setIsLoading(true);
    setTimeout(() => {
      setInputValue("Simulated voice input text");
      setIsLoading(false);
    }, 1000);
  };

  // File Upload Logic
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 10 * 1024 * 1024) return alert('File too large (max 10MB)');

    setIsFileUploading(true);
    // Add optimistic user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `📷 Uploading: ${file.name}`,
      sender: "user",
      timestamp: new Date()
    }]);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: loadingId,
      text: "🔍 Processing receipt...",
      sender: "bot",
      timestamp: new Date(),
      animate: true
    }]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.postFormData<any>("/api/ocr/process-receipt", formData); // eslint-disable-line @typescript-eslint/no-explicit-any

      if (response.success && response.data) {
        const { expense } = response.data;
        const successText = `✅ Processed!\nAmount: ₹${expense.amount}\nCategory: ${expense.category}\nDate: ${new Date(expense.date).toLocaleDateString()}`;
        setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: successText } : m));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: "❌ Failed to process receipt." } : m));
    } finally {
      setIsFileUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  // Chat Submission
  const handleSubmit = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();
    const textToSend = promptText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    }]);

    setInputValue("");
    setIsLoading(true);

    // Bot Loading State
    const botMsgId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: botMsgId,
      text: "typing...",
      sender: "bot",
      timestamp: new Date(),
      animate: true
    }]);

    try {
      const response = await api.post<any>("/api/messages", { content: textToSend }); // eslint-disable-line @typescript-eslint/no-explicit-any
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: response.message } : m));
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: "Sorry, I encountered an error." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInputValue("");
  };

  const isEmptyState = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-black overflow-hidden relative">
      {/* Top Header */}
      <header className="h-16 px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: "Inter, sans-serif" }}>
          {isEmptyState ? "New Chat" : "Chat"}
        </h1>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isEmptyState ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full"
            >
              <div className="text-center mb-10 space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Hello {user?.name?.split(" ")[0] || "!!"} <span className="animate-wave inline-block"></span>
                </h2>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                  Ask or Tell Anything about your Personal Finance
                </p>
              </div>

              <InputCard
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSubmit={handleSubmit}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                speechSupported={speechSupported}
                isRecording={isRecording}
                startListening={startListening}
                stopListening={stopListening}
                startRecording={startRecording}
              />

              <div className="mt-10 w-full text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">quick prompts</p>
                <QuickPrompts handleSubmit={handleSubmit} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.text}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    animateTypewriter={msg.animate}
                    userProfilePicture={user?.profilePicture}
                    userName={user?.name}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
                <InputCard
                  isCompact
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleSubmit={handleSubmit}
                  fileInputRef={fileInputRef}
                  handleFileUpload={handleFileUpload}
                  speechSupported={speechSupported}
                  isRecording={isRecording}
                  startListening={startListening}
                  stopListening={stopListening}
                  startRecording={startRecording}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlassChatBox;
