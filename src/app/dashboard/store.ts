
'use client';

import { create } from 'zustand';
import { getInitialDataSources, getInitialDashboardData } from '@/ai/backend';

// Types
export type ChartConfigState = {
  id: number;
  dimension: string;
  metrics: string[];
  chartType: string;
};

export type DataColumn = {
  id: string;
  label: string;
  type: 'dimension' | 'metric';
}

export type DataSource = {
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

export type ShipmentData = {
  shipmentCode: string;
  bay: string;
  product: string;
  quantity: number;
  flowRate: number;
  startTime: Date;
  endTime: Date;
};

export type LiveShipmentData = ShipmentData & {
  timestamp: Date;
};


// Store state and actions
type DashboardState = {
  // Dashboard page state
  charts: ChartConfigState[];
  setCharts: (charts: ChartConfigState[]) => void;
  dashboardData: ShipmentData[];
  isDashboardDataLoading: boolean;
  liveData: LiveShipmentData[];
  addLiveData: (newData: LiveShipmentData) => void;
  fetchInitialDashboardData: () => Promise<void>;
  
  // Data sources page state
  dataSources: DataSource[];
  isDataSourcesLoading: boolean;
  setDataSources: (dataSources: DataSource[]) => void;
  fetchInitialDataSources: () => Promise<void>;
  addDataSource: (dataSource: DataSource, data: any[]) => void;
  sourceData: Map<string, any[]>;
  addSourceRecord: (sourceName: string, record: any) => void;

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

const recomputeDashboardData = (state: DashboardState): Partial<DashboardState> => {
    const newDashboardData: ShipmentData[] = [];
    state.dataSources.forEach(source => {
        if (source.enabled) {
            const data = state.sourceData.get(source.name);
            if (data) {
                newDashboardData.push(...data.slice(0, source.rowLimit));
            }
        }
    });
    return { dashboardData: newDashboardData };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // State
  charts: [{ id: 1, dimension: "product", metrics: ["quantity"], chartType: "bar" }],
  dataSources: [],
  isDataSourcesLoading: true,
  dashboardData: [],
  isDashboardDataLoading: true,
  liveData: [],
  sourceData: new Map(),
  query: 'SELECT * FROM shipments WHERE bay = "BAY-01"',
  queryResult: null,
  isQueryLoading: false,
  queryError: null,

  // Actions
  setCharts: (charts) => set({ charts }),
  setDataSources: (dataSources) => {
      set({ dataSources });
      set(recomputeDashboardData(get()));
  },
  setQuery: (query) => set({ query }),
  setQueryResult: (queryResult) => set({ queryResult }),
  setQueryError: (queryError) => set({ queryError }),
  setIsQueryLoading: (isQueryLoading) => set({ isQueryLoading }),
  addLiveData: (newData) => set((state) => ({ liveData: [newData, ...state.liveData].slice(0, 50) })), 
  fetchInitialDataSources: async () => {
    set({ isDataSourcesLoading: true });
    const dataSources = await getInitialDataSources();
    set({ dataSources, isDataSourcesLoading: false });
  },
  fetchInitialDashboardData: async () => {
    set({ isDashboardDataLoading: true });
    const dashboardData = await getInitialDashboardData();
    const currentSourceData = get().sourceData;
    currentSourceData.set("Terminal Feed 1", dashboardData);
    set({ sourceData: currentSourceData, isDashboardDataLoading: false });
    set(recomputeDashboardData(get()));
  },
  addDataSource: (dataSource, data) => {
      const { dataSources, sourceData } = get();
      const newSourceData = new Map(sourceData);
      newSourceData.set(dataSource.name, data);
      set({ dataSources: [...dataSources, dataSource], sourceData: newSourceData });
      set(recomputeDashboardData(get()));
  },
  addSourceRecord: (sourceName, record) => {
      const { sourceData } = get();
      const newSourceData = new Map(sourceData);
      const data = newSourceData.get(sourceName) || [];
      newSourceData.set(sourceName, [record, ...data]);
      set({ sourceData: newSourceData });
      set(recomputeDashboardData(get()));
  }
}));
