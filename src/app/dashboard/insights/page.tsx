'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiDataInsights } from '@/ai/flows/ai-data-insights';
import { Icons } from '@/components/icons';
import { BrainCircuit, Send } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const sampleDataContext = `
[
  {"id": 1, "product": "Laptop", "sales": 50, "stock": 15},
  {"id": 2, "product": "Phone", "sales": 120, "stock": 5},
  {"id": 3, "product": "Laptop", "sales": 70, "stock": 10},
  {"id": 4, "product": "Tablet", "sales": 80, "stock": -5},
  {"id": 5, "product": "Monitor", "sales": 60, "stock": 25}
]
`;

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I can help you find inconsistencies or efficiency issues in your data. What would you like to analyze? For example, you could ask me to 'check stock levels'.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await aiDataInsights({
        userInput: input,
        dataContext: sampleDataContext,
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.insights,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">AI-Driven Data Insights</h1>
      </div>
      <Card className="flex flex-col h-[calc(100vh-10rem)]">
        <CardHeader className="flex flex-row items-center gap-4">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <div>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>
            Chat with our AI to uncover hidden insights in your data.
          </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 text-sm ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback><Icons.logo className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                 <div className="flex gap-3 text-sm">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback><Icons.logo className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full bg-foreground/50 animate-pulse" />
                      <div className="w-2 h-2 mr-2 rounded-full bg-foreground/50 animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse delay-150" />
                    </div>
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
