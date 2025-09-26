
"use client"

import { useEffect } from 'react';
import { useDashboardStore } from '@/app/dashboard/store';
import type { ShipmentData } from '@/app/dashboard/store';

const generateRandomRecord = (): ShipmentData => {
    const products = ["PROD-A95 (Unleaded Gasoline 95)", "PROD-JET (Jet Fuel A1)", "PROD-D2 (Diesel)"];
    const bays = ["BAY-01", "BAY-02", "BAY-03", "BAY-04"];
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + Math.random() * 1000 * 60 * 15 + 1000 * 60 * 5); // 5-20 mins later
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const flowRate = Math.random() * 800 + 200; // 200-1000 L/min

    return {
        shipmentCode: `SH-${Math.floor(Math.random() * 90000) + 10000}`,
        bay: bays[Math.floor(Math.random() * bays.length)],
        product: products[Math.floor(Math.random() * products.length)],
        quantity: flowRate * durationMinutes,
        flowRate: flowRate,
        startTime: startTime,
        endTime: endTime,
    };
}


export function useDataUpdater() {
  const { dataSources, addSourceRecord, addLiveData } = useDashboardStore();

  const liveSources = dataSources.filter(ds => ds.enabled && ds.live);

  useEffect(() => {
    const interval = setInterval(() => {
      if (liveSources.length > 0) {
        const randomRecord = generateRandomRecord();
        
        liveSources.forEach(source => {
            addSourceRecord(source.name, randomRecord);
        });

        const newLiveRecord = { ...randomRecord, timestamp: new Date() };
        addLiveData(newLiveRecord);
      }
    }, 2000); // Add a new record every 2 seconds

    return () => clearInterval(interval);
  }, [liveSources.length, addSourceRecord, addLiveData]);
}
