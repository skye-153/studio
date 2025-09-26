'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { executeDataQuery } from '@/ai/flows/data-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function QueryToolPage() {
  const [query, setQuery] = useState('SELECT * FROM sales WHERE region = "North"');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await executeDataQuery({ query });
      setResult(response.result);
    } catch (e) {
      setError('Failed to execute query. The AI model might be busy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Data Query Tool</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Query Editor</CardTitle>
            <CardDescription>
              Write and execute targeted data requests using a familiar query language.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM users..."
              className="h-64 font-code"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Result</CardTitle>
            <CardDescription>
              Results from your query will be displayed here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-4 right-4">
                 <Button onClick={handleExecuteQuery} disabled={isLoading}>
                    {isLoading ? 'Executing...' : 'Execute Query'}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-md min-h-[17.5rem] font-code text-sm">
                {isLoading && (
                   <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[75%]" />
                        <Skeleton className="h-4 w-[80%]" />
                   </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {result && <pre className="whitespace-pre-wrap">{result}</pre>}
                {!isLoading && !error && !result && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Click 'Execute Query' to see results.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
