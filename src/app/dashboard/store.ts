
'use client';

import { create } from 'zustand';

// Types
type ChartConfigState = {
  id: number;
  dimension: string;
  metrics: string[];
  chartType: string;
};

type DataColumn = {
  id: string;
  label: string;
  type: 'dimension' | 'metric';
}

type DataSource = {
  name: string;
  type: string;
  size: string;
  lastModified: string;
  enabled: boolean;
  rowLimit: number;
  totalRows: number;
  schema: DataColumn[];
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Initial data
const initialDataSources: DataSource[] = [
    { 
        name: "Quarterly Sales CSV", 
        type: "CSV", 
        size: "2.3 MB", 
        lastModified: "2 days ago", 
        enabled: true, 
        rowLimit: 100000, 
        totalRows: 100000,
        schema: [
            { id: "product", label: "Product", type: "dimension" },
            { id: "region", label: "Region", type: "dimension" },
            { id: "month", label: "Month", type: "dimension" },
            { id: "year", label: "Year", type: "dimension" },
            { id: "sales", label: "Sales", type: "metric" },
            { id: "profit", label: "Profit", type: "metric" },
        ]
    },
    { 
        name: "User Demographics", 
        type: "Excel", 
        size: "1.1 MB", 
        lastModified: "5 days ago", 
        enabled: true, 
        rowLimit: 50000, 
        totalRows: 50000,
        schema: [
            { id: "country", label: "Country", type: "dimension" },
            { id: "customerId", label: "Customer ID", type: "metric" }
        ]
    },
    { 
        name: "Web Analytics Log", 
        type: "XML", 
        size: "15.8 MB", 
        lastModified: "1 week ago", 
        enabled: false, 
        rowLimit: 1000000, 
        totalRows: 1000000,
        schema: []
    },
    { 
        name: "Customer Feedback", 
        type: "CSV", 
        size: "500 KB", 
        lastModified: "2 weeks ago", 
        enabled: true, 
        rowLimit: 25000, 
        totalRows: 25000,
        schema: []
    },
];

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hello! I can help you find inconsistencies or efficiency issues in your data. What would you like to analyze? For example, you could ask me to 'check stock levels'.",
  },
];

// Store state and actions
type DashboardState = {
  // Dashboard page state
  charts: ChartConfigState[];
  setCharts: (charts: ChartConfigState[]) => void;
  
  // Data sources page state
  dataSources: DataSource[];
  setDataSources: (dataSources: DataSource[]) => void;

  // Insights page state
  insightMessages: Message[];
  setInsightMessages: (messages: Message[]) => void;
  insightInput: string;
  setInsightInput: (input: string) => void;
  isInsightLoading: boolean;
  setIsInsightLoading: (isLoading: boolean) => void;

  // Query tool page state
  query: string;
  setQuery: (query: string) => void;
  queryResult: string | null;
  setQueryResult: (result: string | null) => void;
  queryError: string | null;
  setQueryError: (error: string | null) => void;
  isQueryLoading: boolean;
  setIsQueryLoading: (isLoading: boolean) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  // State
  charts: [{ id: 1, dimension: "product", metrics: ["sales"], chartType: "bar" }],
  dataSources: initialDataSources,
  insightMessages: initialMessages,
  insightInput: '',
  isInsightLoading: false,
  query: 'SELECT * FROM sales WHERE region = "North"',
  queryResult: null,
  isQueryLoading: false,
  queryError: null,

  // Actions
  setCharts: (charts) => set({ charts }),
  setDataSources: (dataSources) => set({ dataSources }),
  setInsightMessages: (insightMessages) => set({ insightMessages }),
  setInsightInput: (insightInput) => set({ insightInput }),
  setIsInsightLoading: (isInsightLoading) => set({ isInsightLoading }),
  setQuery: (query) => set({ query }),
  setQueryResult: (queryResult) => set({ queryResult }),
  setQueryError: (queryError) => set({ queryError }),
  setIsQueryLoading: (isQueryLoading) => set({ isQueryLoading }),
}));
