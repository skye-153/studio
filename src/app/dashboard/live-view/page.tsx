
"use client"

import React, { useEffect, useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from '../store';

// Mock data similar to what the store provides
const salesData = [
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

export default function LiveViewPage() {
    const { dataSources } = useDashboardStore();
    const [liveData, setLiveData] = useState<any[]>([]);

    const liveSources = dataSources.filter(ds => ds.enabled && ds.live);

    useEffect(() => {
        // Mock real-time data updates
        const interval = setInterval(() => {
            if (liveSources.length > 0) {
                // Add a new random record to the start of the list to simulate a live update
                const randomRecord = salesData[Math.floor(Math.random() * salesData.length)];
                const newRecord = { ...randomRecord, timestamp: new Date() };
                setLiveData(prevData => [newRecord, ...prevData].slice(0, 50)); // Keep the list to a manageable size
            }
        }, 2000); // Add a new record every 2 seconds

        return () => clearInterval(interval);
    }, [liveSources.length]);

    if (liveSources.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>No Live Data Sources</CardTitle>
                        <CardDescription>
                            There are no data sources enabled for live view. Please go to the 'Data Sources' page and enable a live connection.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }
  
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Live Data View</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Real-Time Sales Feed</CardTitle>
                    <CardDescription>
                        Displaying live data from connected sources. Updates appear automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Region</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead className="text-right">Sales</TableHead>
                                <TableHead className="text-right">Profit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {liveData.map((row, index) => (
                                <TableRow key={index} className={index === 0 ? 'bg-accent/50 animate-pulse-once' : ''}>
                                    <TableCell>{row.timestamp.toLocaleTimeString()}</TableCell>
                                    <TableCell className="font-medium">{row.product}</TableCell>
                                    <TableCell>{row.region}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{row.country}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{row.sales.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{row.profit.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

// Add this to your globals.css or a suitable stylesheet to get the pulse animation
/*
@keyframes pulse-once {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: hsl(var(--accent) / 0.5);
  }
}
.animate-pulse-once {
  animation: pulse-once 1.5s ease-out;
}
*/
