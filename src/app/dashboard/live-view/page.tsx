
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
                                <TableRow key={row.timestamp.getTime()} className={index === 0 ? 'bg-accent/50 animate-pulse-once' : ''}>
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

    