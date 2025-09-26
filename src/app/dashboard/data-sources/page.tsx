
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, FileUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Slider } from "@/components/ui/slider";

import { useDashboard } from "@/context/dashboard-context";

interface DataSource {
    fileName: string;
    size: number;
    lastModified: string;
    dimensions: string[];
    metrics: string[];
    enabled: boolean;
    limit: number;
}

export default function DataSourcesPage() {
    const { dataSources, setDataSources } = useDashboard();
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const fetchSources = async () => {
        if (dataSources.length === 0) {
            try {
                const res = await fetch('/api/data');
                if(res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setDataSources(data.sort((a, b) => a.fileName.localeCompare(b.fileName)));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data sources", error);
            }
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                fetchSources();
                setFile(null);
            } else {
                const errorData = await res.json();
                console.error("Upload failed:", errorData.error);
            }
        } catch (error) {
            console.error("An error occurred during upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleToggle = async (fileName: string, enabled: boolean) => {
        const source = dataSources.find(ds => ds.fileName === fileName);
        if (!source) return;

        const updatedSource = { ...source, enabled };

        // Optimistic UI update
        setDataSources(prev => prev.map(ds => ds.fileName === fileName ? updatedSource : ds));

        try {
            const res = await fetch('/api/data/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, enabled, limit: source.limit }),
            });

            if (!res.ok) {
                // Revert on failure
                setDataSources(prev => prev.map(ds => ds.fileName === fileName ? source : ds));
            }
        } catch (error) {
            console.error("Failed to toggle data source", error);
            // Revert on failure
            setDataSources(prev => prev.map(ds => ds.fileName === fileName ? source : ds));
        }
    };

    const handleLimitChange = async (fileName: string, limit: number) => {
        const source = dataSources.find(ds => ds.fileName === fileName);
        if (!source) return;

        const updatedSource = { ...source, limit };

        // Optimistic UI update
        setDataSources(prev => prev.map(ds => ds.fileName === fileName ? updatedSource : ds));

        try {
            const res = await fetch('/api/data/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, enabled: source.enabled, limit }),
            });

            if (!res.ok) {
                // Revert on failure
                setDataSources(prev => prev.map(ds => ds.fileName === fileName ? source : ds));
            }
        } catch (error) {
            console.error("Failed to update data limit", error);
            // Revert on failure
            setDataSources(prev => prev.map(ds => ds.fileName === fileName ? source : ds));
        }
    };

    const handleRemove = async (fileName: string) => {
        // Optimistic UI update
        setDataSources(prev => prev.filter(ds => ds.fileName !== fileName));

        try {
            const res = await fetch(`/api/data/${fileName}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                // Revert on failure by re-fetching
                fetchSources();
            }
        } catch (error) {
            console.error("Failed to remove data source", error);
            // Revert on failure by re-fetching
            fetchSources();
        }
    };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Data Sources</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Connected Data</CardTitle>
            <CardDescription>
              Enable, disable, or remove your uploaded data sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
                {dataSources.map((source) => (
                    <div key={source.fileName} className="grid gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Database className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <div className="font-semibold">{source.fileName}</div>
                                    <div className="text-sm text-muted-foreground">JSON &middot; {(source.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className='text-right'>
                                    <Switch
                                        checked={source.enabled}
                                        onCheckedChange={(checked) => handleToggle(source.fileName, checked)}
                                        aria-label="Enable connection"
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">{source.enabled ? 'Enabled' : 'Disabled'}</div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the data source
                                            and all associated metadata.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemove(source.fileName)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Data Limit</Label>
                                <span className="text-sm text-muted-foreground">{source.limit}%</span>
                            </div>
                            <Slider
                                value={[source.limit]}
                                onValueChange={(value) => handleLimitChange(source.fileName, value[0])}
                                min={1}
                                max={100}
                                step={1}
                                className="w-full"
                                disabled={!source.enabled}
                            />
                        </div>
                    </div>
                ))}
                 {dataSources.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No data sources connected yet.
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload New Data</CardTitle>
            <CardDescription>
              Upload a JSON file to start your analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <FileUp className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">{file ? file.name : "Drag & drop your file here, or"}</p>
                <Label htmlFor="file-upload" className="mt-2 text-primary font-semibold cursor-pointer">
                    browse files
                </Label>
                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".json"/>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
            <p className="text-xs text-muted-foreground">Max file size: 50MB</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
