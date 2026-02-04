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

const GlassChatBox: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const { isAuthenticated } = useAuth();
  const api = useApi();

  // Fetch messages from API on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    } else {
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
        data?: {
          messages?: Array<{
            id: number;
            content: string;
            sender: "user" | "bot";
            createdAt: string;
          }>;
        };
      }>("/api/messages");

      if (response.data?.messages && response.data.messages.length > 0) {
        // Transform messages from API to match our interface
        const formattedMessages: Message[] = response.data.messages.map(
          (msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.createdAt),
          })
        );
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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

  // Handle file upload with OCR processing
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Please select an image smaller than 10MB.');
      return;
    }

    setIsFileUploading(true);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: messages.length,
      text: `📷 Uploading receipt: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message for OCR processing
    const loadingMessage: Message = {
      id: messages.length + 1,
      text: "🔍 Processing receipt with OCR",
      sender: "bot",
      timestamp: new Date(),
      animate: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        formDataEntries: Array.from(formData.entries()),
        formDataKeys: Array.from(formData.keys()),
        formDataValues: Array.from(formData.values())
      });

      // Call OCR API
      const response = await api.postFormData<{
        success: boolean;
        message: string;
        data?: {
          ocrData: any;
          expense: any;
          message: any;
        };
      }>("/api/ocr/process-receipt", formData);

      if (response.success && response.data) {
        const { ocrData, expense, message } = response.data;

        // Replace loading message with OCR results
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? {
                ...msg,
                text: `✅ Receipt processed successfully!

💰 Amount: ₹${expense.amount}
📂 Category: ${expense.category}
📅 Date: ${new Date(expense.date).toLocaleDateString()}
💳 Payment Method: ${expense.paymentMethod}
${expense.description ? `📝 Description: ${expense.description}` : ''}
${expense.companions.length > 0 ? `👥 Companions: ${expense.companions.join(', ')}` : ''}

Expense has been automatically added to your records!`,
              }
              : msg
          )
        );
      } else {
        throw new Error(response.message || 'Failed to process receipt');
      }
    } catch (error) {
      console.error('Error processing receipt:', error);

      // Replace loading message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
              ...msg,
              text: `❌ Failed to process receipt: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again with a clearer image.`,
            }
            : msg
        )
      );
    } finally {
      setIsFileUploading(false);
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: messages.length,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add loading message immediately
    const loadingMessage: Message = {
      id: messages.length + 1,
      text: "🤖 Generating response",
      sender: "bot",
      timestamp: new Date(),
      animate: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Send message to the backend using the correct endpoint
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: {
          messageId: number;
          expenseId?: number;
          queryData?: any;
          requiresPaymentMethod?: boolean;
        };
      }>("/api/messages", {
        content: inputValue,
      });

      // Replace loading message with actual bot response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
              ...msg,
              text: response.message,
            }
            : msg
        )
      );
    } catch (error) {
      console.error("Error processing message:", error);

      // Replace loading message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
              ...msg,
              text: "Sorry, I couldn't process that. Please try again with a different message.",
            }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Animated input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  // Renders the input form content
  const renderInputForm = () => (
    <>
      <div className="flex space-x-2 justify-center">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp"
          className="hidden"
        />

        {/* File upload button */}
        <motion.button
          type="button"
          onClick={triggerFileUpload}
          disabled={isLoading || isRecording || isFileUploading}
          className="border border-trackaro-border/30 p-3 text-trackaro-text hover:bg-trackaro-accent/10 rounded-full focus:outline-none backdrop-blur-sm bg-gradient-to-br from-white/70 to-neutral-200/60"
          aria-label="Upload receipt image for OCR processing"
          whileTap={{ scale: 0.75 }}
        >
          {isFileUploading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </motion.button>

        {/* Text input */}
        <motion.div
          className="flex border border-trackaro-border/30 rounded-full w-full backdrop-blur-sm bg-gradient-to-r from-white/70 to-gray-200/60"
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
                  ? "Processing receipt image..."
                  : speechSupported
                    ? "Tap mic to speak, upload receipt, or type..."
                    : "Hold mic to record, upload receipt, or type..."
            }
            className="flex-1 px-4 py-2 border-none rounded-full focus:outline-none bg-transparent text-trackaro-text text-base min-w-0"
            spellCheck="false"
            autoComplete="off"
            disabled={isLoading || isRecording || isFileUploading}
          />

          {/* Voice recording button / Send button based on input */}
          {inputValue.trim() ? (
            <motion.button
              type="submit"
              className="p-3 rounded-full focus:outline-none flex-shrink-0 text-trackaro-text hover:bg-trackaro-accent/10"
              disabled={isLoading || isRecording || isFileUploading}
              aria-label="Send message"
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
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
          ) : (
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
              className={`p-3 rounded-full focus:outline-none flex-shrink-0 ${isRecording
                  ? "text-red-500 bg-red-100/30"
                  : "text-trackaro-text hover:bg-trackaro-accent/10"
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
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
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Recording/uploading indicators */}
      {(isRecording || isFileUploading) && (
        <div className="mt-2 text-xs text-trackaro-accent animate-pulse text-center">
          {isRecording
            ? "Recording voice... Release to stop"
            : "Processing receipt image with OCR..."}
        </div>
      )}
    </>
  );

  const isEmptyState = messages.length === 0 && !isFetchingMessages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col h-full backdrop-blur-xl bg-gradient-to-br from-slate-200/80 via-gray-100/70 to-zinc-200/75 dark:from-slate-700/60 dark:via-gray-700/50 dark:to-zinc-700/55 rounded-xl border border-trackaro-border/30 overflow-hidden"
      style={{
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {isEmptyState ? (
        // Empty State Layout
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4A90E2] to-[#8E2DE2] dark:from-[#5C9CE6] dark:to-[#A359EA] pb-1">
              Welcome, {user?.name?.split(" ")[0] || "Friend"}! 👋
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-500 dark:text-gray-400">
              How can I help you today?
            </h2>
          </div>

          <div className="w-full max-w-2xl">
            <motion.form
              onSubmit={handleSubmit}
              className="p-4 rounded-full bg-white/50 dark:bg-black/20 shadow-lg backdrop-blur-lg border border-white/20 dark:border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              {renderInputForm()}
            </motion.form>
          </div>
        </div>
      ) : (
        // Standard Chat Layout
        <>
          {/* Chat header */}
          <motion.div
            className="chat-header backdrop-blur-md bg-gradient-to-r from-gray-300/85 to-neutral-300/80 dark:from-gray-600/70 dark:to-neutral-700/60 border-b border-trackaro-border/30 p-4 flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-trackaro-accent/10 flex items-center justify-center overflow-hidden border border-trackaro-border/30">
                {authLoading ? (
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ) : user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-6 w-6 text-trackaro-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-trackaro-text">
                  Trackaro- Simplying Expense Tracking
                </h2>
                <p className="text-sm text-trackaro-text/70">
                  Your AI-powered expense tracker that feels like chatting with a friend.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-stone-200/60 via-gray-100/50 to-slate-200/55 dark:from-stone-700/50 dark:via-gray-700/40 dark:to-slate-700/45">
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
                        message={message.text}
                        sender={message.sender}
                        timestamp={message.timestamp}
                        animateTypewriter={
                          message.animate && message.sender === "bot"
                        }
                        userProfilePicture={user?.profilePicture}
                        userName={user?.name}
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
                  className="flex items-center space-x-2 p-3 max-w-[80%] rounded-lg bg-secondary text-trackaro-text rounded-bl-none"
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
            className="border-t border-trackaro-border/30 p-4 input-area bg-gradient-to-r from-neutral-200/70 via-gray-100/60 to-zinc-200/65 dark:from-neutral-700/55 dark:via-gray-700/45 dark:to-zinc-700/50 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          >
            {renderInputForm()}
          </motion.form>
        </>
      )}
    </motion.div>
  );
};

export default GlassChatBox;
