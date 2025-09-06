"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../app/utils/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  source: "web" | "telegram";
  createdAt: string;
  expenseId?: string | null;
  expense?: {
    id: string;
    amount: number;
    category: string;
    companions: string[];
    description: string;
  } | null;
  animate?: boolean; // whether to animate typewriter on mount (bot only)
}

const initialMessage: Message = {
  id: "initial",
  content: "👋 Hi there! I'm your expense assistant. You can tell me about expenses like 'I spent ₹200 on dinner yesterday' or ask me questions like 'How much did I spend on food this month?'",
  sender: "ai",
  source: "web",
  createdAt: new Date().toISOString(),
};

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIndicatorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // SpeechRecognition instance (if available)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const { isAuthenticated } = useAuth();
  const api = useApi();

  // Fetch messages from API on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    } else {
      // If not authenticated, just show the initial message
      setMessages([initialMessage]);
      setIsFetchingMessages(false);
    }
  }, [isAuthenticated]);

  // Detect browser speech recognition support and init
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN"; // adjust as needed
    }

    return () => {
      try {
        if (recognitionRef.current) recognitionRef.current.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  // Fetch chat history
  const fetchMessages = async () => {
    try {
      setIsFetchingMessages(true);
      const response = await api.get<{
        success: boolean;
        data: {
          messages: Array<{
            id: string;
            content: string;
            sender: "user" | "ai";
            source: "web" | "telegram";
            createdAt: string;
            expenseId?: string | null;
            expense?: {
              id: string;
              amount: number;
              category: string;
              companions: string[];
              description: string;
            } | null;
          }>;
          pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
          };
        };
      }>("/api/messages");

      if (response.success && response.data?.messages && response.data.messages.length > 0) {
        // Use messages directly from API response
        setMessages(response.data.messages);
      } else {
        // If no messages in history, show the initial greeting
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // If there's an error, at least show the initial message
      setMessages([initialMessage]);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        // Here you would send the audio to a speech-to-text service
        // For now, we'll simulate the transcription
        simulateTranscription(audioBlob);

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Start browser speech recognition (preferred when supported)
  const startListening = () => {
    if (!recognitionRef.current) return;
    let finalTranscript = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalTranscript += transcript + " ";
        }
      }
    };
    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (finalTranscript.trim()) setInputValue(finalTranscript.trim());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onerror = (e: any) => {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
      alert("Speech recognition error. Please try again or use typing.");
    };
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
    } catch (e) {
      console.error("Failed to stop recognition:", e);
    }
  };

  // Simulate transcription (in a real app, you would send to a speech-to-text API)
  const simulateTranscription = (audioBlob: Blob) => {
    // Simulating processing time
    setIsLoading(true);

    // In a real app, you would send the audio to a service like Google Speech-to-Text
    setTimeout(() => {
      // Simulated transcription result
      const transcription = "I spent $45 on groceries yesterday";
      setInputValue(transcription);
      setIsLoading(false);
    }, 1500);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match("image/*")) {
      alert("Please upload an image file (receipt or screenshot)");
      return;
    }

    setIsFileUploading(true);

    // In a real app, you would upload the file to your server or analyze it directly
    // For now, we'll simulate processing the image
    setTimeout(() => {
      // Simulating an extracted text from receipt
      const extractedText = "Receipt from Grocery Store: Total $58.75";
      setInputValue(extractedText);
      setIsFileUploading(false);
    }, 2000);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: {
          messageId: string;
          expenseId?: string;
          queryData?: unknown;
          requiresPaymentMethod?: boolean;
        };
      }>("/api/messages", {
        content: userInput,
      });

      if (response.success) {
        // Refresh messages to get the complete conversation from backend
        await fetchMessages();
      } else {
        // Add error message if backend returned error
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: response.message || "Sorry, I couldn't process that. Please try again with a different message.",
          sender: "ai",
          source: "web",
          createdAt: new Date().toISOString(),
          animate: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error processing message:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I couldn't process that. Please try again with a different message.",
        sender: "ai",
        source: "web",
        createdAt: new Date().toISOString(),
        animate: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Animated input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col h-full bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-none border border-trackaro-border dark:border-trackaro-border overflow-hidden"
    >
      {/* Chat header */}
      <motion.div
        className="chat-header bg-white dark:bg-black border-b border-trackaro-border dark:border-trackaro-border p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        <div>
          <h2 className="text-lg font-semibold text-trackaro-text dark:text-trackaro-text">
            TracKARO AI Assistant
          </h2>
          <p className="text-sm text-trackaro-text/70 dark:text-trackaro-text/70">
            Ask me about your expenses or upload receipts
          </p>
        </div>

        {isAuthenticated && messages.length > 1 && (
          <motion.button
            onClick={async () => {
              if (
                confirm("Are you sure you want to clear your chat history?")
              ) {
                try {
                  await api.delete("/api/messages/state");
                  setMessages([initialMessage]);
                } catch (error) {
                  console.error("Error clearing chat history:", error);
                }
              }
            }}
            className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Clear Chat
          </motion.button>
        )}
      </motion.div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isFetchingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trackaro-accent"></div>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <MessageBubble
                    message={message.content}
                    sender={message.sender}
                    timestamp={new Date(message.createdAt)}
                    animateTypewriter={
                      message.animate && message.sender === "ai"
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center space-x-2 p-3 max-w-[80%] rounded-lg bg-secondary dark:bg-secondary text-trackaro-text dark:text-trackaro-text rounded-bl-none"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-trackaro-accent block"
                    animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <motion.form
        onSubmit={handleSubmit}
        className="border-t border-trackaro-border dark:border-trackaro-border p-4 input-area"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex space-x-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* File upload button */}
          <motion.button
            type="button"
            onClick={triggerFileUpload}
            disabled={isLoading || isRecording || isFileUploading}
            className=" border 
            p-3  text-trackaro-text dark:text-trackaro-text 
            hover:cursor-poiter hover:bg-trackaro-accent/10 rounded-full focus:outline-none"
            aria-label="Upload receipt or screenshot"
            whileTap={{ scale: 0.75 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </motion.button>

          {/* Text input */}
            <motion.div 
            className="flex border rounded-full w-full"
            whileTap={{ borderWidth: "2px" }}
            >
            <motion.input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
              isRecording
                ? speechSupported
                ? "Listening... tap mic to stop"
                : "Recording... release to stop"
                : isFileUploading
                ? "Processing file..."
                : speechSupported
                ? "Tap mic to speak, or type..."
                : "Hold mic to record, or type..."
              }
              className="flex-1 px-3 sm:px-4 py-2 border-none border-trackaro-border dark:border-trackaro-border rounded-full focus:outline-none dark:focus:ring-trackaro-accent bg-white dark:bg-secondary text-trackaro-text dark:text-trackaro-text text-sm sm:text-base min-w-0"
              spellCheck="false"
              autoComplete="off"
              disabled={isLoading || isRecording || isFileUploading}
            />

            {/* Voice recording button */}
            <motion.button
              type="button"
              onClick={
                speechSupported
                  ? () => (isRecording ? stopListening() : startListening())
                  : undefined
              }
              onMouseDown={speechSupported ? undefined : startRecording}
              onMouseUp={speechSupported ? undefined : stopRecording}
              onTouchStart={speechSupported ? undefined : startRecording}
              onTouchEnd={speechSupported ? undefined : stopRecording}
              disabled={isLoading || isFileUploading}
              className={`p-3 rounded-full focus:outline-none flex-shrink-0 ${
                isRecording
                  ? "text-red-500 bg-red-100 dark:bg-red-900/20"
                  : "text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10"
              }`}
              aria-label={
                isRecording
                  ? speechSupported
                    ? "Listening... tap to stop"
                    : "Recording... release to stop"
                  : speechSupported
                  ? "Tap to start voice input"
                  : "Hold to record voice"
              }
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Send button */}
          <motion.button
            type="submit"
            className="send-button bg-blue-600 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isLoading || !inputValue.trim() || isRecording || isFileUploading
            }
            aria-label="Send message"
            whileTap={{ scale: 0.75 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4 20-7Z" />
              <path d="M22 2 11 13" />
            </svg>
          </motion.button>
        </div>

        {/* Recording/uploading indicators */}
        {(isRecording || isFileUploading) && (
          <div className="mt-2 text-xs text-trackaro-accent animate-pulse">
            {isRecording
              ? "Recording voice... Release to stop"
              : "Processing file..."}
          </div>
        )}
      </motion.form>
    </motion.div>
  );
};

export default ChatBox;
