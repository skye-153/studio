"use client"

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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export default function AnalysisPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Data Analysis Tool</h1>
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
    </>
  );
}
