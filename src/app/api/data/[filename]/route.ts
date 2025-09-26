
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
    try {
        const filename = params.filename;
        const dataDir = path.join(process.cwd(), '.data');
        const filePath = path.join(dataDir, filename);

        // Basic security check to prevent path traversal
        if (path.dirname(filePath) !== dataDir) {
            return NextResponse.json({ success: false, error: 'Invalid path' }, { status: 400 });
        }

        const content = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(content);

        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error fetching data file:', error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ success: false, error: `Failed to fetch data file: ${errorMessage}` }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { filename: string } }) {
    try {
        const filename = params.filename;
        const dataDir = path.join(process.cwd(), '.data');
        const dataFilePath = path.join(dataDir, filename);
        const metadataFilePath = path.join(dataDir, `${filename}.meta.json`);

        // Basic security check
        if (path.dirname(dataFilePath) !== dataDir) {
            return NextResponse.json({ success: false, error: 'Invalid path' }, { status: 400 });
        }

        await fs.unlink(dataFilePath);
        await fs.unlink(metadataFilePath);

        return NextResponse.json({ success: true, message: `Successfully deleted ${filename}` });

    } catch (error) {
        console.error('Error deleting data source:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ success: false, error: `Deletion failed: ${errorMessage}` }, { status: 500 });
    }
}
