
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from './store';

const salesData = [
    // 2023 Data
    { product: "Laptop", region: "North", sales: 50000, profit: 15000, month: "January", year: 2023, customerId: 101, country: "USA" },
    { product: "Phone", region: "North", sales: 120000, profit: 40000, month: "January", year: 2023, customerId: 102, country: "USA" },
    { product: "Tablet", region: "South", sales: 80000, profit: 25000, month: "February", year: 2023, customerId: 103, country: "Canada" },
    { product: "Monitor", region: "South", sales: 60000, profit: 18000, month: "February", year: 2023, customerId: 104, country: "Canada" },
    { product: "Laptop", region: "East", sales: 75000, profit: 22000, month: "March", year: 2023, customerId: 105, country: "UK" },
    { product: "Phone", region: "East", sales: 150000, profit: 55000, month: "March", year: 2023, customerId: 106, country: "UK" },
    { product: "Tablet", region: "West", sales: 90000, profit: 30000, month: "April", year: 2023, customerId: 107, country: "Germany" },
    { product: "Monitor", region: "West", sales: 70000, profit: 20000, month: "April", year: 2023, customerId: 108, country: "Germany" },
    { product: "Laptop", region: "North", sales: 55000, profit: 16000, month: "May", year: 2023, customerId: 109, country: "USA" },
    { product: "Phone", region: "South", sales: 130000, profit: 45000, month: "May", year: 2023, customerId: 110, country: "Canada" },
    { product: "Accessories", region: "North", sales: 20000, profit: 8000, month: "June", year: 2023, customerId: 111, country: "USA" },
    { product: "Accessories", region: "South", sales: 25000, profit: 10000, month: "June", year: 2023, customerId: 112, country: "Canada" },

    // 2024 Data
    { product: "Laptop", region: "North", sales: 60000, profit: 18000, month: "January", year: 2024, customerId: 113, country: "USA" },
    { product: "Phone", region: "North", sales: 140000, profit: 48000, month: "January", year: 2024, customerId: 114, country: "USA" },
    { product: "Tablet", region: "South", sales: 85000, profit: 28000, month: "February", year: 2024, customerId: 115, country: "Canada" },
    { product: "Monitor", region: "South", sales: 65000, profit: 20000, month: "February", year: 2024, customerId: 116, country: "Canada" },
    { product: "Laptop", region: "East", sales: 80000, profit: 25000, month: "March", year: 2024, customerId: 117, country: "UK" },
    { product: "Phone", region: "East", sales: 160000, profit: 60000, month: "March", year: 2024, customerId: 118, country: "UK" },
    { product: "Tablet", region: "West", sales: 95000, profit: 32000, month: "April", year: 2024, customerId: 119, country: "Germany" },
    { product: "Monitor", region: "West", sales: 75000, profit: 22000, month: "April", year: 2024, customerId: 120, country: "Germany" },
    { product: "Laptop", region: "North", sales: 65000, profit: 20000, month: "May", year: 2024, customerId: 121, country: "USA" },
    { product: "Phone", region: "South", sales: 135000, profit: 47000, month: "May", year: 2024, customerId: 122, country: "Canada" },
    { product: "Accessories", region: "East", sales: 30000, profit: 12000, month: "June", year: 2024, customerId: 123, country: "UK" },
    { product: "Accessories", region: "West", sales: 35000, profit: 14000, month: "June", year: 2024, customerId: 124, country: "Germany" },
];

const chartTypes = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
]

type ChartConfigState = {
    id: number;
    dimension: string;
    metrics: string[];
    chartType: string;
}

const DraggableItem = ({ item, type }: { item: { value: string, label: string }, type: string }) => (
    <div
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData("application/json", JSON.stringify({ ...item, type }));
        }}
        className="p-2 border rounded-md bg-muted cursor-grab text-sm"
    >
        {item.label}
    </div>
);


const DropZone = ({ onDrop, children, className }: { onDrop: (item: any) => void, children: React.ReactNode, className?: string }) => {
    const [isOver, setIsOver] = useState(false);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                const item = JSON.parse(e.dataTransfer.getData("application/json"));
                onDrop(item);
            }}
            className={cn(
                "p-2 border border-dashed rounded-md text-center transition-colors",
                isOver ? "bg-accent border-primary" : "border-border",
                className
            )}
        >
            {children}
        </div>
    )
}

const ChartComponent = ({ config, onConfigChange, onRemove, dimensions, metrics }: { config: ChartConfigState, onConfigChange: (newConfig: ChartConfigState) => void, onRemove: () => void, dimensions: {value: string, label: string}[], metrics: {value: string, label: string}[] }) => {

    const chartConfig: ChartConfig = useMemo(() => {
        const newChartConfig: ChartConfig = {};
        config.metrics.forEach((metric, index) => {
            newChartConfig[metric] = {
                label: metrics.find(m => m.value === metric)?.label,
                color: `hsl(var(--chart-${index + 1}))`,
            }
        });
        return newChartConfig;
    }, [config.metrics, metrics]);
    
    const aggregatedData = useMemo(() => {
        if (!config.dimension) return [];

        const dataMap = new Map();
        salesData.forEach(item => {
            const key = item[config.dimension as keyof typeof item];
            if (!dataMap.has(key)) {
                const initialData = { [config.dimension]: key };
                 metrics.forEach(m => {
                    (initialData as any)[m.value] = 0;
                 });
                dataMap.set(key, initialData);
            }
            const existing = dataMap.get(key);
            metrics.forEach(m => {
                existing[m.value] += (item as any)[m.value] || 0;
            });
        });

        // @ts-ignore
        return Array.from(dataMap.values()).sort((a,b) => (a[config.dimension] > b[config.dimension]) ? 1 : -1);
    }, [config.dimension, metrics]);

    const handleDrop = (item: { value: string, type: string }) => {
        if (item.type === 'dimension') {
            onConfigChange({ ...config, dimension: item.value });
        } else if (item.type === 'metric') {
            if (!config.metrics.includes(item.value)) {
                onConfigChange({ ...config, metrics: [...config.metrics, item.value] });
            }
        }
    }

    const removeMetric = (metricToRemove: string) => {
        onConfigChange({ ...config, metrics: config.metrics.filter(m => m !== metricToRemove) });
    };
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>Analysis</CardTitle>
                        <CardDescription>Drag and drop variables to build your chart.</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={onRemove}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                     <DropZone onDrop={handleDrop}>
                        <div className="text-sm font-semibold mb-2">Dimension</div>
                        {config.dimension ?
                            <div className="p-2 border rounded-md bg-primary text-primary-foreground text-sm">{dimensions.find(d => d.value === config.dimension)?.label}</div>
                            : <div className="text-xs text-muted-foreground">Drop here</div>}
                    </DropZone>
                     <DropZone onDrop={handleDrop}>
                        <div className="text-sm font-semibold mb-2">Metrics</div>
                        {config.metrics.length > 0 ?
                            <div className="flex flex-wrap gap-2">
                                {config.metrics.map(m => (
                                    <div key={m} className="flex items-center gap-1 p-2 border rounded-md bg-accent text-accent-foreground text-sm">
                                        <span>{metrics.find(metric => metric.value === m)?.label}</span>
                                        <button onClick={() => removeMetric(m)} className="text-accent-foreground/70 hover:text-accent-foreground">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            : <div className="text-xs text-muted-foreground">Drop here</div>}
                    </DropZone>
                </div>
                 <div className="pt-4">
                    <Select value={config.chartType} onValueChange={(value) => onConfigChange({...config, chartType: value})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Chart Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {chartTypes.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
            </CardHeader>
            <CardContent className="flex-1">
                 <Tabs defaultValue="visualize">
                    <TabsList>
                        <TabsTrigger value="visualize">Visualize</TabsTrigger>
                        <TabsTrigger value="raw_data">Raw Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="visualize" className="mt-6">
                      <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                          {config.chartType === 'bar' && (
                             <BarChart data={aggregatedData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey={config.dimension} tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                {config.metrics.map((metric) => (
                                    <Bar key={metric} dataKey={metric} fill={`var(--color-${metric})`} radius={4} />
                                ))}
                            </BarChart>
                          )}
                           {config.chartType === 'line' && (
                             <LineChart data={aggregatedData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey={config.dimension} tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                 {config.metrics.map((metric) => (
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
                            <TableHead className="capitalize">{config.dimension}</TableHead>
                            {config.metrics.map(m => <TableHead key={m} className="text-right capitalize">{metrics.find(metric => metric.value === m)?.label}</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aggregatedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{row[config.dimension as keyof typeof row]}</TableCell>
                                    {config.metrics.map(m => (
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
    )
}

export default function Dashboard() {
    const { charts, setCharts, dataSources } = useDashboardStore();
    
    const { dimensions, metrics } = useMemo(() => {
        const activeSources = dataSources.filter(ds => ds.enabled);
        const allDimensions = new Set<{ value: string, label: string }>();
        const allMetrics = new Set<{ value: string, label: string }>();

        activeSources.forEach(source => {
            source.schema.forEach(col => {
                const item = { value: col.id, label: col.label };
                if (col.type === 'dimension') {
                    allDimensions.add(item);
                } else if (col.type === 'metric') {
                    allMetrics.add(item);
                }
            });
        });
        
        return { 
            dimensions: Array.from(allDimensions).filter((dim, index, self) => self.findIndex(d => d.value === dim.value) === index),
            metrics: Array.from(allMetrics).filter((met, index, self) => self.findIndex(m => m.value === met.value) === index)
        };
    }, [dataSources]);
    
    const addChart = () => {
        const newChart: ChartConfigState = {
            id: Date.now(),
            dimension: dimensions.length > 0 ? dimensions[0].value : '',
            metrics: metrics.length > 0 ? [metrics[0].value] : [],
            chartType: 'bar'
        };
        setCharts([...charts, newChart]);
    }
    
    const updateChart = (id: number, newConfig: ChartConfigState) => {
        setCharts(charts.map(c => c.id === id ? newConfig : c));
    }

    const removeChart = (id: number) => {
        setCharts(charts.filter(c => c.id !== id));
    }
    
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Tableau-Style Dashboard</h1>
         <Button onClick={addChart}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Chart
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Variables</CardTitle>
                <CardDescription>Drag these to the chart areas.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {dimensions.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2 text-sm">Dimensions</h3>
                        <div className="grid gap-2">
                            {dimensions.map(d => <DraggableItem key={d.value} item={d} type="dimension" />)}
                        </div>
                    </div>
                )}
                 {metrics.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2 text-sm">Metrics</h3>
                        <div className="grid gap-2">
                            {metrics.map(m => <DraggableItem key={m.value} item={m} type="metric" />)}
                        </div>
                    </div>
                 )}
                 {dimensions.length === 0 && metrics.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Enable a data source in the 'Data Sources' page to see available variables.
                    </p>
                 )}
            </CardContent>
        </Card>
        
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {charts.map(chart => (
                <ChartComponent 
                    key={chart.id} 
                    config={chart}
                    onConfigChange={(newConfig) => updateChart(chart.id, newConfig)}
                    onRemove={() => removeChart(chart.id)}
                    dimensions={dimensions}
                    metrics={metrics}
                />
            ))}
        </div>
      </div>
    </>
  );
}
