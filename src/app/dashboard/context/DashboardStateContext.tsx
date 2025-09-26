
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Types from dashboard/page.tsx
type ChartConfigState = {
  id: number;
  dimension: string;
  metrics: string[];
  chartType: string;
};

// Types from data-sources/page.tsx
type DataSource = {
  name: string;
  type: string;
  size: string;
  lastModified: string;
  enabled: boolean;
  rowLimit: number;
  totalRows: number;
};

// Types from insights/page.tsx
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Initial data from data-sources/page.tsx
const initialDataSources: DataSource[] = [
    { name: "Quarterly Sales CSV", type: "CSV", size: "2.3 MB", lastModified: "2 days ago", enabled: true, rowLimit: 100000, totalRows: 100000 },
    { name: "User Demographics", type: "Excel", size: "1.1 MB", lastModified: "5 days ago", enabled: true, rowLimit: 50000, totalRows: 50000 },
    { name: "Web Analytics Log", type: "XML", size: "15.8 MB", lastModified: "1 week ago", enabled: false, rowLimit: 1000000, totalRows: 1000000 },
    { name: "Customer Feedback", type: "CSV", size: "500 KB", lastModified: "2 weeks ago", enabled: true, rowLimit: 25000, totalRows: 25000 },
];

// Initial data from insights/page.tsx
const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hello! I can help you find inconsistencies or efficiency issues in your data. What would you like to analyze? For example, you could ask me to 'check stock levels'.",
  },
];

// Context state shape
type DashboardContextType = {
  // Dashboard page state
  charts: ChartConfigState[];
  setCharts: React.Dispatch<React.SetStateAction<ChartConfigState[]>>;
  
  // Data sources page state
  dataSources: DataSource[];
  setDataSources: React.Dispatch<React.SetStateAction<DataSource[]>>;

  // Insights page state
  insightMessages: Message[];
  setInsightMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  insightInput: string;
  setInsightInput: React.Dispatch<React.SetStateAction<string>>;
  isInsightLoading: boolean;
  setIsInsightLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Query tool page state
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  queryResult: string | null;
  setQueryResult: React.Dispatch<React.SetStateAction<string | null>>;
  queryError: string | null;
  setQueryError: React.Dispatch<React.SetStateAction<string | null>>;
  isQueryLoading: boolean;
  setIsQueryLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  // State from dashboard/page.tsx
  const [charts, setCharts] = useState<ChartConfigState[]>([
    { id: 1, dimension: "product", metrics: ["sales"], chartType: "bar" }
  ]);
  
  // State from data-sources/page.tsx
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);

  // State from insights/page.tsx
  const [insightMessages, setInsightMessages] = useState<Message[]>(initialMessages);
  const [insightInput, setInsightInput] = useState('');
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // State from query-tool/page.tsx
  const [query, setQuery] = useState('SELECT * FROM sales WHERE region = "North"');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const value = {
    charts,
    setCharts,
    dataSources,
    setDataSources,
    insightMessages,
    setInsightMessages,
    insightInput,
    setInsightInput,
    isInsightLoading,
    setIsInsightLoading,
    query,
    setQuery,
    queryResult,
    setQueryResult,
    queryError,
    setQueryError,
    isQueryLoading,
    setIsQueryLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardState must be used within a DashboardStateProvider');
  }
  return context;
}
