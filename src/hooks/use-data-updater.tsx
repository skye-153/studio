
"use client"

import { useEffect } from 'react';
import { useDashboardStore, initialDashboardData } from '@/app/dashboard/store';
import type { SalesData } from '@/app/dashboard/store';

export function useDataUpdater() {
  const { dataSources, addDashboardData, addLiveData } = useDashboardStore();

  const liveSources = dataSources.filter(ds => ds.enabled && ds.live);

  useEffect(() => {
    const interval = setInterval(() => {
      if (liveSources.length > 0) {
        // Add a new random record to simulate a live update
        const randomRecord: SalesData = initialDashboardData[Math.floor(Math.random() * initialDashboardData.length)];
        
        const newDashboardRecord: SalesData = { ...randomRecord };
        addDashboardData(newDashboardRecord);

        const newLiveRecord = { ...randomRecord, timestamp: new Date() };
        addLiveData(newLiveRecord);
      }
    }, 2000); // Add a new record every 2 seconds

    return () => clearInterval(interval);
  }, [liveSources.length, addDashboardData, addLiveData]);
}

    