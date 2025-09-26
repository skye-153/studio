"use client"

import { useState } from "react";
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
import { Database, FileUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const initialDataSources = [
    { name: "Quarterly Sales CSV", type: "CSV", size: "2.3 MB", lastModified: "2 days ago", enabled: true, rowLimit: 100000, totalRows: 100000 },
    { name: "User Demographics", type: "Excel", size: "1.1 MB", lastModified: "5 days ago", enabled: true, rowLimit: 50000, totalRows: 50000 },
    { name: "Web Analytics Log", type: "XML", size: "15.8 MB", lastModified: "1 week ago", enabled: false, rowLimit: 1000000, totalRows: 1000000 },
    { name: "Customer Feedback", type: "CSV", size: "500 KB", lastModified: "2 weeks ago", enabled: true, rowLimit: 25000, totalRows: 25000 },
];

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState(initialDataSources);

  const handleToggle = (index: number) => {
    const newSources = [...dataSources];
    newSources[index].enabled = !newSources[index].enabled;
    setDataSources(newSources);
  };

  const handleRowLimitChange = (index: number, percentage: number) => {
    const newSources = [...dataSources];
    const newRowLimit = Math.round((newSources[index].totalRows * percentage) / 100);
    newSources[index].rowLimit = newRowLimit;
    setDataSources(newSources);
  }

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
                {dataSources.map((source, index) => (
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
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload New Data</CardTitle>
            <CardDescription>
              Upload CSV, Excel, or XML files to start your analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <FileUp className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Drag & drop your file here, or</p>
                <Label htmlFor="file-upload" className="mt-2 text-primary font-semibold cursor-pointer">
                    browse files
                </Label>
                <Input id="file-upload" type="file" className="sr-only" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full">Upload File</Button>
            <p className="text-xs text-muted-foreground">Max file size: 50MB</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
