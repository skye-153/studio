
'use client'

import { useEffect, useState, useCallback } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, FileUp, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useDashboardStore, DataSource, DataColumn } from "../store";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function DataSourcesPage() {
  const { dataSources, setDataSources, fetchInitialDataSources, isDataSourcesLoading, addDataSource } = useDashboardStore();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (dataSources.length === 0) {
        fetchInitialDataSources();
    }
  }, [fetchInitialDataSources, dataSources.length]);

  const handleToggle = (index: number) => {
    const newSources = [...dataSources];
    newSources[index].enabled = !newSources[index].enabled;
    setDataSources(newSources);
  };
  
  const handleLiveToggle = (index: number) => {
    const newSources = [...dataSources];
    newSources[index].live = !newSources[index].live;
    setDataSources(newSources);
  }

  const handleRowLimitChange = (index: number, percentage: number) => {
    const newSources = [...dataSources];
    const newRowLimit = Math.round((newSources[index].totalRows * percentage) / 100);
    newSources[index].rowLimit = newRowLimit;
    setDataSources(newSources);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid JSON file. Expected an array of objects.");
      }

      const firstRow = data[0];
      const schema: DataColumn[] = Object.keys(firstRow).map(key => ({
        id: key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: typeof firstRow[key] === 'number' ? 'metric' : 'dimension',
      }));

      const newSource: DataSource = {
        name: file.name,
        type: "JSON",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toLocaleDateString(),
        enabled: true,
        live: false,
        totalRows: data.length,
        rowLimit: data.length,
        schema,
      };

      addDataSource(newSource, data);
      toast({ title: "File uploaded successfully!", description: `Added ${file.name} as a new data source.` });
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({ variant: "destructive", title: "Upload failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
      setIsUploading(false);
    }
  }, [file, addDataSource, toast]);

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
              Manage your connected data sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
                {isDataSourcesLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  dataSources.map((source, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4">
                          <div className="flex items-center gap-4">
                              <Database className="h-6 w-6 text-muted-foreground" />
                              <div>
                                  <div className="font-semibold">{source.name}</div>
                                  <div className="text-sm text-muted-foreground">{source.type} &middot; {source.size} &middot; {source.lastModified}</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-4 ml-auto sm:ml-0">
                            <div className="flex items-center space-x-2">
                                  <Switch
                                      id={`enabled-${index}`}
                                      checked={source.enabled}
                                      onCheckedChange={() => handleToggle(index)}
                                      aria-label="Enable or disable data source"
                                  />
                                  <Label htmlFor={`enabled-${index}`} className="text-sm font-medium">
                                      {source.enabled ? "Enabled" : "Disabled"}
                                  </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`live-${index}`}
                                      checked={source.live}
                                      onCheckedChange={() => handleLiveToggle(index)}
                                      aria-label="Toggle live data"
                                      disabled={!source.enabled}
                                  />
                                  <Label htmlFor={`live-${index}`} className="text-sm font-medium">
                                      Live
                                  </Label>
                            </div>
                              <div className="flex items-center gap-3 w-48">
                                  <Slider
                                    id={`rows-${index}`}
                                    value={[(source.rowLimit / source.totalRows) * 100]}
                                    onValueChange={([value]) => handleRowLimitChange(index, value)}
                                    max={100}
                                    step={1}
                                    className="flex-1"
                                    disabled={!source.enabled}
                                  />
                                  <div className="flex flex-col items-end">
                                      <span className="text-sm font-medium w-20 text-right">{source.rowLimit.toLocaleString()}</span>
                                      <span className="text-xs text-muted-foreground">rows</span>
                                  </div>
                            </div>
                          </div>
                      </div>
                  )
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload New Data</CardTitle>
            <CardDescription>
              Upload JSON files to start your analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <FileUp className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">{file ? file.name : "Drag & drop your file here, or"}</p>
                <Label htmlFor="file-upload" className="mt-2 text-primary font-semibold cursor-pointer">
                    browse files
                </Label>
                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".json" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
            <p className="text-xs text-muted-foreground">Max file size: 50MB</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
