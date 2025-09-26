// This file implements the Genkit flow for the DataQueryTool story.
// It allows users to construct targeted data requests via a user interface and view the results.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataQueryInputSchema = z.object({
  query: z.string().describe('The data query to be executed.'),
});
export type DataQueryInput = z.infer<typeof DataQueryInputSchema>;

const DataQueryOutputSchema = z.object({
  result: z.string().describe('The result of the data query.'),
});
export type DataQueryOutput = z.infer<typeof DataQueryOutputSchema>;

export async function executeDataQuery(input: DataQueryInput): Promise<DataQueryOutput> {
  return dataQueryFlow(input);
}

const dataQueryPrompt = ai.definePrompt({
  name: 'dataQueryPrompt',
  input: {schema: DataQueryInputSchema},
  output: {schema: DataQueryOutputSchema},
  prompt: `You are a data query execution tool.  Execute the following query and return the result.\n\nQuery: {{{query}}}`,
});

const dataQueryFlow = ai.defineFlow(
  {
    name: 'dataQueryFlow',
    inputSchema: DataQueryInputSchema,
    outputSchema: DataQueryOutputSchema,
  },
  async input => {
    const {output} = await dataQueryPrompt(input);
    return output!;
  }
);
