
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileName, dimension, metrics } = body;

        if (!fileName || !dimension || !metrics || !Array.isArray(metrics)) {
            return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), '.data');
        const filePath = path.join(dataDir, fileName);

        // Basic security check
        if (path.dirname(filePath) !== dataDir) {
            return NextResponse.json({ success: false, error: 'Invalid path' }, { status: 400 });
        }

        const content = await fs.readFile(filePath, 'utf-8');
        const salesData = JSON.parse(content);

        if (!Array.isArray(salesData)) {
            return NextResponse.json({ success: false, error: 'Data is not an array.' }, { status: 400 });
        }

        // Aggregation Logic
        const dataMap = new Map();
        salesData.forEach(item => {
            const key = item[dimension as keyof typeof item];
            if (key === undefined) return;

            if (!dataMap.has(key)) {
                const initialMetrics = {};
                metrics.forEach(m => initialMetrics[m] = 0);
                dataMap.set(key, { [dimension]: key, ...initialMetrics });
            }

            const existing = dataMap.get(key);
            metrics.forEach(m => {
                if(typeof item[m] === 'number') {
                    existing[m] += item[m];
                }
            });
        });

        const aggregatedData = Array.from(dataMap.values()).sort((a,b) => (a[dimension as keyof typeof a] > b[dimension as keyof typeof b]) ? 1 : -1);

        return NextResponse.json(aggregatedData);

    } catch (error) {
        console.error('Error during aggregation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ success: false, error: `Aggregation failed: ${errorMessage}` }, { status: 500 });
    }
}
