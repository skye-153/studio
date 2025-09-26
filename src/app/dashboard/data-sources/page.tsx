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
import { Database, FileUp, Share2 } from "lucide-react";

const dataSources = [
    { name: "Quarterly Sales CSV", type: "CSV", size: "2.3 MB", lastModified: "2 days ago" },
    { name: "User Demographics", type: "Excel", size: "1.1 MB", lastModified: "5 days ago" },
    { name: "Web Analytics Log", type: "XML", size: "15.8 MB", lastModified: "1 week ago" },
    { name: "Customer Feedback", type: "CSV", size: "500 KB", lastModified: "2 weeks ago" },
];

export default function DataSourcesPage() {
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
            <div className="grid gap-4">
                {dataSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <Database className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <div className="font-semibold">{source.name}</div>
                                <div className="text-sm text-muted-foreground">{source.type} &middot; {source.size}</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-sm font-medium">Synced</div>
                             <div className="text-xs text-muted-foreground">{source.lastModified}</div>
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
