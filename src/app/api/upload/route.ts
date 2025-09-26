
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Heuristics to classify columns
const isDimension = (key: string, value: any): boolean => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('id') || lowerKey.includes('code') || lowerKey.includes('name') || lowerKey.includes('category') || lowerKey.includes('region') || lowerKey.includes('type')) {
        return true;
    }
    return typeof value === 'string';
};

const isMetric = (key: string, value: any): boolean => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('date') || lowerKey.includes('time')) {
        return false; // Treat dates as dimensions for now
    }
    return typeof value === 'number';
};

export async function POST(request: NextRequest) {
  console.log('Received request to /api/upload');
  try {
    const data = await request.formData();
    console.log('Form data parsed successfully.');
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.error('No file found in form data.');
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    console.log(`File received: ${file.name}, size: ${file.size}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dataDir = path.join(process.cwd(), '.data');
    console.log(`Ensuring data directory exists at: ${dataDir}`)
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, file.name);
    console.log(`Attempting to write file to: ${filePath}`);
    await fs.writeFile(filePath, buffer);

    console.log(`File saved successfully to ${filePath}`);

    // Analyze the JSON file
    const fileContent = buffer.toString('utf-8');
    let jsonData;
    try {
        jsonData = JSON.parse(fileContent);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return NextResponse.json({ success: false, error: 'Invalid JSON format.' }, { status: 400 });
    }

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error('JSON is not a non-empty array.');
        return NextResponse.json({ success: false, error: 'JSON must be a non-empty array.' }, { status: 400 });
    }

    const firstItem = jsonData[0];
    const dimensions: string[] = [];
    const metrics: string[] = [];

    for (const key in firstItem) {
        if (Object.prototype.hasOwnProperty.call(firstItem, key)) {
            if (isMetric(key, firstItem[key])) {
                metrics.push(key);
            } else {
                dimensions.push(key);
            }
        }
    }
    console.log(`Analyzed columns - Dimensions: ${dimensions.join(', ')}, Metrics: ${metrics.join(', ')}`);

    const metadata = {
        fileName: file.name,
        size: file.size,
        lastModified: new Date().toISOString(),
        dimensions,
        metrics,
        enabled: true,
        limit: 100,
    };

    const metadataFilePath = path.join(dataDir, `${file.name}.meta.json`);
    console.log(`Writing metadata to: ${metadataFilePath}`);
    await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));
    console.log('Metadata saved successfully.');

    return NextResponse.json({ success: true, message: 'File uploaded and analyzed successfully.' });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: `Failed to process file: ${errorMessage}` }, { status: 500 });
  }
}
