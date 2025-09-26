'use server';

/**
 * @fileOverview Provides AI-driven data insights through a chat-like interface.
 *
 * - aiDataInsights - A function that returns AI-driven insights based on user input.
 * - AiDataInsightsInput - The input type for the aiDataInsights function.
 * - AiDataInsightsOutput - The return type for the aiDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDataInsightsInputSchema = z.object({
  userInput: z.string().describe('The user input query for data insights.'),
  dataContext: z.string().optional().describe('The data context or relevant information for analysis.'),
});
export type AiDataInsightsInput = z.infer<typeof AiDataInsightsInputSchema>;

const AiDataInsightsOutputSchema = z.object({
  insights: z.string().describe('The AI-generated insights based on the user input and data context.'),
});
export type AiDataInsightsOutput = z.infer<typeof AiDataInsightsOutputSchema>;

export async function aiDataInsights(input: AiDataInsightsInput): Promise<AiDataInsightsOutput> {
  return aiDataInsightsFlow(input);
}

const aiDataInsightsPrompt = ai.definePrompt({
  name: 'aiDataInsightsPrompt',
  input: {schema: AiDataInsightsInputSchema},
  output: {schema: AiDataInsightsOutputSchema},
  prompt: `You are an AI assistant designed to identify data inconsistencies and potential efficiency issues based on user queries and provided data context.

  User Query: {{{userInput}}}

  Data Context: {{{dataContext}}}

  Analyze the user query and data context to provide relevant insights. Focus on identifying inconsistencies, inefficiencies, and potential areas for improvement in the data. Return a concise summary of your findings.
  `,
});

const aiDataInsightsFlow = ai.defineFlow(
  {
    name: 'aiDataInsightsFlow',
    inputSchema: AiDataInsightsInputSchema,
    outputSchema: AiDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await aiDataInsightsPrompt(input);
    return output!;
  }
);
