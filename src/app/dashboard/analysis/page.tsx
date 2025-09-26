'use client'

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Send, ChevronUp, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useDashboardStore } from "../store";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialMessages: Message[] = [
    {
      role: 'assistant',
      content: "Hello! I can help you analyze this data. What would you like to see? For example, you could ask me to 'show sales by region'.",
    },
];

export default function AnalysisPage() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const { dataSources, sourceData, selectedDataSource, setSelectedDataSource, fetchInitialDataSources } = useDashboardStore();

  React.useEffect(() => {
    if (dataSources.length === 0) {
      fetchInitialDataSources();
    }
  }, [dataSources.length, fetchInitialDataSources]);



  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock response
    setTimeout(() => {
        const assistantMessage: Message = {
            role: 'assistant',
            content: `I've updated the chart to show: ${input}.`,
          };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="relative h-[calc(100vh-10rem)]">
        <div className="flex items-center mb-4">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Data Analysis</h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Sales Performance Analysis</CardTitle>
            <CardDescription>
                An interactive tool to analyze sales and profit data.
            </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                                <Select value={selectedDataSource || ''} onValueChange={setSelectedDataSource}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source.name} value={source.name}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6">
                {selectedDataSource && sourceData.has(selectedDataSource) ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {dataSources.find(ds => ds.name === selectedDataSource)?.schema.map((col) => (
                          <TableHead key={col.id}>{col.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(sourceData.get(selectedDataSource) || []).slice(0, dataSources.find(ds => ds.name === selectedDataSource)?.rowLimit).map((row, index) => (
                        <TableRow key={index}>
                          {dataSources.find(ds => ds.name === selectedDataSource)?.schema.map((col) => (
                            <TableCell key={col.id}>{row[col.id]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>Select a data source to see the data.</p>
                )}
              </div>
            </CardContent>
        </Card>
      
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetTrigger asChild>
          <Card className="fixed bottom-6 right-6 md:right-12 cursor-pointer hover:bg-muted transition-colors z-50">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <BrainCircuit className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription className="text-sm">Ask me anything about your data</CardDescription>
              </div>
              {isChatOpen ? <ChevronDown className="w-5 h-5 ml-4" /> : <ChevronUp className="w-5 h-5 ml-4" />} 
            </CardHeader>
          </Card>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] flex flex-col p-0">
           <SheetHeader className="p-6 pb-2">
            <SheetTitle className="flex items-center gap-4">
               <BrainCircuit className="w-8 h-8 text-primary" /> AI Assistant
            </SheetTitle>
          </SheetHeader>
          <CardContent className="flex-1 overflow-hidden p-6 pt-2">
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
          <CardFooter className="p-6 pt-0 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
              id="message"
              placeholder="E.g. 'Show profit by region'"
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
        </SheetContent>
      </Sheet>
    </div>
  );
}