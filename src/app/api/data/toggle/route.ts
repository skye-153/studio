
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileName, enabled, limit } = body;

        if (!fileName || typeof enabled !== 'boolean' || typeof limit !== 'number') {
            return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), '.data');
        const metadataFilePath = path.join(dataDir, `${fileName}.meta.json`);

        // Basic security check
        if (path.dirname(metadataFilePath) !== dataDir) {
            return NextResponse.json({ success: false, error: 'Invalid path' }, { status: 400 });
        }

        const content = await fs.readFile(metadataFilePath, 'utf-8');
        const metadata = JSON.parse(content);

        metadata.enabled = enabled;
        metadata.limit = limit;

        await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));

        return NextResponse.json({ success: true, metadata });

    } catch (error) {
        console.error('Error toggling data source:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ success: false, error: `Toggle failed: ${errorMessage}` }, { status: 500 });
    }
}
