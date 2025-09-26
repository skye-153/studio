"use client"

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const salesData = [
  { product: "Laptop", region: "North", sales: 50000, profit: 15000, month: "January" },
  { product: "Laptop", region: "South", sales: 70000, profit: 20000, month: "January" },
  { product: "Phone", region: "North", sales: 120000, profit: 40000, month: "February" },
  { product: "Phone", region: "South", sales: 150000, profit: 55000, month: "February" },
  { product: "Tablet", region: "North", sales: 80000, profit: 25000, month: "March" },
  { product: "Tablet", region: "South", sales: 90000, profit: 30000, month: "March" },
  { product: "Monitor", region: "East", sales: 60000, profit: 18000, month: "April" },
  { product: "Monitor", region: "West", sales: 75000, profit: 22000, month: "April" },
  { product: "Laptop", region: "East", sales: 55000, profit: 16000, month: "May" },
  { product: "Phone", region: "West", sales: 130000, profit: 45000, month: "May" },
];

const dimensions = [
    { value: "product", label: "Product" },
    { value: "region", label: "Region" },
    { value: "month", label: "Month" },
]

const metrics = [
    { value: "sales", label: "Sales" },
    { value: "profit", label: "Profit" },
]

const chartTypes = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
]

export default function Dashboard() {
    const [dimension, setDimension] = useState("product");
    const [selectedMetrics, setSelectedMetrics] = useState(["sales"]);
    const [chartType, setChartType] = useState("bar");

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        selectedMetrics.forEach((metric, index) => {
            config[metric] = {
                label: metrics.find(m => m.value === metric)?.label,
                color: `hsl(var(--chart-${index + 1}))`,
            }
        });
        return config;
    }, [selectedMetrics]);
    
    const aggregatedData = useMemo(() => {
        const dataMap = new Map();
        salesData.forEach(item => {
            const key = item[dimension as keyof typeof item];
            if (!dataMap.has(key)) {
                dataMap.set(key, { ...item, sales: 0, profit: 0 });
            }
            const existing = dataMap.get(key);
            existing.sales += item.sales;
            existing.profit += item.profit;
        });

        return Array.from(dataMap.values());
    }, [dimension]);

    const handleMetricChange = (metricValue: string) => {
        setSelectedMetrics(prev => 
            prev.includes(metricValue) 
                ? prev.filter(m => m !== metricValue)
                : [...prev, metricValue]
        );
    }
    
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Tableau-Style Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        <Label>Dimension</Label>
                        <Select value={dimension} onValueChange={setDimension}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Dimension" />
                            </SelectTrigger>
                            <SelectContent>
                                {dimensions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>Metrics</Label>
                        <div className="grid gap-2 mt-2">
                        {metrics.map(m => (
                            <div key={m.value} className="flex items-center gap-2">
                                <Checkbox 
                                    id={m.value} 
                                    checked={selectedMetrics.includes(m.value)}
                                    onCheckedChange={() => handleMetricChange(m.value)}
                                />
                                <Label htmlFor={m.value}>{m.label}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div>
                        <Label>Chart Type</Label>
                        <Select value={chartType} onValueChange={setChartType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Chart Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {chartTypes.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3">
             <Card className="h-full">
                <CardHeader>
                  <CardTitle>Analysis</CardTitle>
                  <CardDescription>
                    Customizable chart based on your selections.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="visualize">
                    <TabsList>
                        <TabsTrigger value="visualize">Visualize</TabsTrigger>
                        <TabsTrigger value="raw_data">Raw Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="visualize" className="mt-6">
                      <ChartContainer config={chartConfig} className="min-h-[450px] w-full">
                          {chartType === 'bar' && (
                             <BarChart data={aggregatedData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey={dimension} tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                {selectedMetrics.map((metric) => (
                                    <Bar key={metric} dataKey={metric} fill={`var(--color-${metric})`} radius={4} />
                                ))}
                            </BarChart>
                          )}
                           {chartType === 'line' && (
                             <LineChart data={aggregatedData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey={dimension} tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                 {selectedMetrics.map((metric) => (
                                    <Line key={metric} dataKey={metric} type="monotone" stroke={`var(--color-${metric})`} strokeWidth={2} dot={true} />
                                ))}
                            </LineChart>
                          )}
                      </ChartContainer>
                    </TabsContent>
                    <TabsContent value="raw_data" className="mt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="capitalize">{dimension}</TableHead>
                            {selectedMetrics.map(m => <TableHead key={m} className="text-right capitalize">{m}</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aggregatedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{row[dimension as keyof typeof row]}</TableCell>
                                    {selectedMetrics.map(m => (
                                         <TableCell key={m} className="text-right">
                                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row[m as keyof typeof row] as number)}
                                         </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
        </div>
      </div>
    </>
  );
}
