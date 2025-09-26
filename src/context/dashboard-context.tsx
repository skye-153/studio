
'use client';

import { createContext, useContext, useState } from 'react';

interface DashboardState {
  dataSources: any[];
  setDataSources: (dataSources: any[]) => void;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dataSources, setDataSources] = useState<any[]>([]);

  return (
    <DashboardContext.Provider value={{ dataSources, setDataSources }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
