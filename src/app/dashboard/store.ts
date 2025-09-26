
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

type ShipmentData = {
  shipmentCode: string;
  bay: string;
  product: string;
  quantity: number;
  flowRate: number;
  startTime: Date;
  endTime: Date;
};

type LiveShipmentData = ShipmentData & {
  timestamp: Date;
};

// Initial data
const initialDataSources: DataSource[] = [
    { 
        name: "Terminal Feed 1", 
        type: "API", 
        size: "2.3 MB", 
        lastModified: "2 days ago", 
        enabled: true, 
        live: true,
        rowLimit: 1000, 
        totalRows: 1000,
        schema: [
            { id: "bay", label: "Bay", type: "dimension" },
            { id: "product", label: "Product", type: "dimension" },
            { id: "quantity", label: "Quantity", type: "metric" },
            { id: "flowRate", label: "Flow Rate", type: "metric" },
        ]
    },
    { 
        name: "Historical Shipments", 
        type: "CSV", 
        size: "15.8 MB", 
        lastModified: "1 week ago", 
        enabled: false, 
        live: false,
        rowLimit: 100000, 
        totalRows: 100000,
        schema: [
            { id: "bay", label: "Bay", type: "dimension" },
            { id: "product", label: "Product", type: "dimension" },
            { id: "quantity", label: "Quantity", type: "metric" },
            { id: "flowRate", label: "Flow Rate", type: "metric" },
        ]
    },
];

const generateInitialData = (): ShipmentData[] => {
    const data: ShipmentData[] = [];
    const products = ["PROD-A95 (Unleaded Gasoline 95)", "PROD-JET (Jet Fuel A1)", "PROD-D2 (Diesel)"];
    const bays = ["BAY-01", "BAY-02", "BAY-03", "BAY-04"];

    for (let i = 0; i < 50; i++) {
        const startTime = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30);
        const endTime = new Date(startTime.getTime() + Math.random() * 1000 * 60 * 15 + 1000 * 60 * 5); // 5-20 mins later
        const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        const flowRate = Math.random() * 800 + 200; // 200-1000 L/min

        data.push({
            shipmentCode: `SH-${Math.floor(Math.random() * 90000) + 10000}`,
            bay: bays[Math.floor(Math.random() * bays.length)],
            product: products[Math.floor(Math.random() * products.length)],
            quantity: flowRate * durationMinutes,
            flowRate: flowRate,
            startTime: startTime,
            endTime: endTime,
        });
    }
    return data;
}

const initialDashboardData: ShipmentData[] = generateInitialData();


// Store state and actions
type DashboardState = {
  // Dashboard page state
  charts: ChartConfigState[];
  setCharts: (charts: ChartConfigState[]) => void;
  dashboardData: ShipmentData[];
  liveData: LiveShipmentData[];
  addDashboardData: (newData: ShipmentData) => void;
  addLiveData: (newData: LiveShipmentData) => void;
  
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
  charts: [{ id: 1, dimension: "product", metrics: ["quantity"], chartType: "bar" }],
  dataSources: initialDataSources,
  dashboardData: initialDashboardData,
  liveData: [],
  query: 'SELECT * FROM shipments WHERE bay = "BAY-01"',
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
export type { ShipmentData, LiveShipmentData };
