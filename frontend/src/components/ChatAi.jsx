import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            parts: [{ text: "Hello! I'm your coding assistant. Ask me anything about this problem:" }],
            timestamp: new Date()
        },
        { 
            role: 'model', 
            parts: [{ text: `**${problem.title}**` }],
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSubmit = async (data) => {
        if (isLoading) return;
        
        const userMessage = { 
            role: 'user', 
            parts: [{ text: data.message }],
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: messages.map(m => ({
                    role: m.role,
                    parts: m.parts
                })),
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: response.data.message }],
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setError("Sorry, I encountered an error. Please try again.");
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: "Sorry, I'm having trouble responding right now. Please try again later." }],
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="font-semibold flex items-center gap-2">
                    <Bot className="text-yellow-500" size={18} />
                    Coding Assistant
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ask questions about: {problem.title}
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" 
                            ? "bg-yellow-500 text-white rounded-br-none" 
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {msg.role === "user" ? (
                                    <User size={16} className="text-yellow-200" />
                                ) : (
                                    <Bot size={16} className="text-yellow-500" />
                                )}
                                <span className="text-xs opacity-70">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap">
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="text-red-500 text-sm p-2 text-center">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form 
                    ref={formRef}
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex items-center gap-2"
                >
                    <input 
                        placeholder="Ask me anything about this problem..." 
                        className="input input-bordered flex-1 bg-gray-50 dark:bg-gray-700" 
                        {...register("message", { 
                            required: "Message is required",
                            minLength: {
                                value: 2,
                                message: "Message must be at least 2 characters"
                            }
                        })}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
                        disabled={isLoading || errors.message}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </form>
                {errors.message && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.message.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ChatAi;