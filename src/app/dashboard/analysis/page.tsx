
"use client"

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { BrainCircuit, Send } from "lucide-react"

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const salesData = [
  { product: "Laptop", region: "North", sales: 50, profit: 15 },
  { product: "Laptop", region: "South", sales: 70, profit: 20 },
  { product: "Phone", region: "North", sales: 120, profit: 40 },
  { product: "Phone", region: "South", sales: 150, profit: 55 },
  { product: "Tablet", region: "North", sales: 80, profit: 25 },
  { product: "Tablet", region: "South", sales: 90, profit: 30 },
  { product: "Monitor", region: "East", sales: 60, profit: 18 },
  { product: "Monitor", region: "West", sales: 75, profit: 22 },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

const initialMessages: Message[] = [
    {
      role: 'assistant',
      content: "Hello! I can help you analyze this data. What would you like to see? For example, you could ask me to 'show sales by region'.",
    },
];

export default function AnalysisPage() {
  // Mock state for chat, will be moved to zustand later
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);


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
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex items-center">
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
            <Tabs defaultValue="visualize">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="visualize">Visualize</TabsTrigger>
                        <TabsTrigger value="raw_data">Raw Data</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-4">
                        <Select defaultValue="product">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Group by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="region">Region</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="sales">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="profit">Profit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <TabsContent value="visualize" className="mt-6">
                <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                    <BarChart data={salesData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="product"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
                    </BarChart>
                </ChartContainer>
                </TabsContent>
                <TabsContent value="raw_data" className="mt-6">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">Sales ($)</TableHead>
                        <TableHead className="text-right">Profit ($)</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {salesData.map((row, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{row.product}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell className="text-right">{row.sales * 1000}</TableCell>
                        <TableCell className="text-right">{row.profit * 1000}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
         <Card className="flex flex-col h-[calc(100vh-8rem)] mt-[44px]">
            <CardHeader className="flex flex-row items-center gap-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <div>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>
                        Use natural language to analyze your data.
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
        </Card>
      </div>
    </div>
  );
}
