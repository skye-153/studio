
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const dataDir = path.join(process.cwd(), '.data');
        const files = await fs.readdir(dataDir);

        const metadataFiles = files.filter(file => file.endsWith('.meta.json'));

        const dataSources = await Promise.all(metadataFiles.map(async (file) => {
            const filePath = path.join(dataDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        }));

        return NextResponse.json(dataSources);
    } catch (error) {
        console.error('Error fetching data sources:', error);
        // If the .data directory doesn't exist, return an empty array.
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return NextResponse.json([]);
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ success: false, error: `Failed to fetch data sources: ${errorMessage}` }, { status: 500 });
    }
}
