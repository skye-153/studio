
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
import { useDataUpdater } from '@/hooks/use-data-updater';

export default function LiveViewPage() {
    const { dataSources, liveData } = useDashboardStore();
    useDataUpdater();

    const liveSources = dataSources.filter(ds => ds.enabled && ds.live);

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
                    <CardTitle>Real-Time Terminal Feed</CardTitle>
                    <CardDescription>
                        Displaying live shipment data from connected sources. Updates appear automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Shipment Code</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Bay</TableHead>
                                <TableHead className="text-right">Quantity (L)</TableHead>
                                <TableHead className="text-right">Flow Rate (L/min)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {liveData.map((row, index) => (
                                <TableRow key={row.timestamp.getTime()} className={index === 0 ? 'bg-accent/50 animate-pulse-once' : ''}>
                                    <TableCell>{row.timestamp.toLocaleTimeString()}</TableCell>
                                    <TableCell className="font-medium">{row.shipmentCode}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{row.product}</Badge>
                                    </TableCell>
                                    <TableCell>{row.bay}</TableCell>
                                    <TableCell className="text-right">{row.quantity.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{row.flowRate.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
