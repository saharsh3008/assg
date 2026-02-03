"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Link as LinkIcon } from "lucide-react";
import axios from 'axios';
import { cn } from "@/lib/utils";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: string[]; // Simplified sources for now
}

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/query`, {
                question: input
            });

            // Extract answer and sources
            const answer = response.data.answer;
            const sources = response.data.sources ? response.data.sources.split(",") : [];

            const botMsg: Message = {
                role: 'assistant',
                content: answer,
                sources: sources
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error retrieving that information." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[600px] w-full shadow-lg">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Medical Assistant
                </CardTitle>
            </CardHeader>
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                        <Bot className="w-12 h-12 mb-2" />
                        <p>Ask a question about the uploaded documents...</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={cn(
                            "max-w-[80%] rounded-lg p-3 text-sm",
                            msg.role === 'user'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}>
                            <p>{msg.content}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-primary-foreground/20 flex flex-wrap gap-2">
                                    {msg.sources.map((src, idx) => (
                                        <span key={idx} className="flex items-center text-xs bg-black/10 px-2 py-1 rounded-full">
                                            <LinkIcon className="w-3 h-3 mr-1" />
                                            {src.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-3 text-sm animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={loading} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
