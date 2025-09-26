
import { DataSource, ShipmentData, LiveShipmentData } from '@/app/dashboard/store';

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

const salesData = [
  { product: "Laptop", region: "North", sales: 50, profit: 15 },
  { product: "Laptop", region: "South", sales: 70, profit: 20 },
  { product: "Phone", region: "North", sales: 120, profit: 40 },
  { product: "Phone", region: "South", sales: 150, profit: 55 },
  { product: "Tablet", region: "North", sales: 80, profit: 25 },
  { product: "Tablet", region: "South", sales: 90, profit: 30 },
  { product: "Monitor", region: "East", sales: 60, profit: 18 },
  { product: "Monitor", region: "West", sales: 75, profit: 22 },
];

export const getSalesData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(salesData);
    }, 500);
  });
}

export const getInitialDataSources = async (): Promise<DataSource[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialDataSources);
    }, 500);
  });
}

export const getInitialDashboardData = async (): Promise<ShipmentData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialDashboardData);
    }, 500);
  });
}

export const executeDataQuery = async (query: string): Promise<{ result: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ result: "Query executed successfully. This is a mock response." });
    }, 1000);
  });
}
