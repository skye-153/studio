
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
  live: boolean;
  rowLimit: number;
  totalRows: number;
  schema: DataColumn[];
};

type SalesData = {
  product: string;
  region: string;
  sales: number;
  profit: number;
  month: string;
  year: number;
  customerId: number;
  country: string;
};

type LiveSalesData = SalesData & {
  timestamp: Date;
};

// Initial data
const initialDataSources: DataSource[] = [
    { 
        name: "Quarterly Sales CSV", 
        type: "CSV", 
        size: "2.3 MB", 
        lastModified: "2 days ago", 
        enabled: true, 
        live: true,
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
        live: false,
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
        live: true,
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
        live: false,
        rowLimit: 25000, 
        totalRows: 25000,
        schema: []
    },
];

const initialDashboardData: SalesData[] = [
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

// Store state and actions
type DashboardState = {
  // Dashboard page state
  charts: ChartConfigState[];
  setCharts: (charts: ChartConfigState[]) => void;
  dashboardData: SalesData[];
  liveData: LiveSalesData[];
  addDashboardData: (newData: SalesData) => void;
  addLiveData: (newData: LiveSalesData) => void;
  
  // Data sources page state
  dataSources: DataSource[];
  setDataSources: (dataSources: DataSource[]) => void;

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
  dashboardData: initialDashboardData,
  liveData: [],
  query: 'SELECT * FROM sales WHERE region = "North"',
  queryResult: null,
  isQueryLoading: false,
  queryError: null,

  // Actions
  setCharts: (charts) => set({ charts }),
  setDataSources: (dataSources) => set({ dataSources }),
  setQuery: (query) => set({ query }),
  setQueryResult: (queryResult) => set({ queryResult }),
  setQueryError: (queryError) => set({ queryError }),
  setIsQueryLoading: (isQueryLoading) => set({ isQueryLoading }),
  addDashboardData: (newData) => set((state) => ({ dashboardData: [newData, ...state.dashboardData] })),
  addLiveData: (newData) => set((state) => ({ liveData: [newData, ...state.liveData].slice(0, 50) })),
}));

export { initialDashboardData };
export type { SalesData, LiveSalesData };

    