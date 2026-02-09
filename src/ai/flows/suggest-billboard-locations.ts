'use server';
/**
 * @fileOverview An AI tool that suggests optimal billboard locations based on the client's target demographic and campaign goals.
 *
 * - suggestBillboardLocations - A function that handles the billboard location suggestion process.
 * - SuggestBillboardLocationsInput - The input type for the suggestBillboardLocations function.
 * - SuggestBillboardLocationsOutput - The return type for the suggestBillboardLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBillboardLocationsInputSchema = z.object({
  targetDemographic: z
    .string()
    .describe('The target demographic for the advertising campaign.'),
  campaignGoals: z.string().describe('The goals of the advertising campaign.'),
  exampleBillboards: z.string().optional().describe('Examples of billboards to use.'),
});
export type SuggestBillboardLocationsInput = z.infer<typeof SuggestBillboardLocationsInputSchema>;

const SuggestBillboardLocationsOutputSchema = z.object({
  suggestedLocations: z
    .string()
    .describe('A list of suggested billboard locations with reasoning.'),
});
export type SuggestBillboardLocationsOutput = z.infer<typeof SuggestBillboardLocationsOutputSchema>;

export async function suggestBillboardLocations(
  input: SuggestBillboardLocationsInput
): Promise<SuggestBillboardLocationsOutput> {
  return suggestBillboardLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBillboardLocationsPrompt',
  input: {schema: SuggestBillboardLocationsInputSchema},
  output: {schema: SuggestBillboardLocationsOutputSchema},
  prompt: `You are an expert advertising strategist. You will suggest optimal billboard locations based on the client's target demographic and campaign goals.

Target Demographic: {{{targetDemographic}}}
Campaign Goals: {{{campaignGoals}}}

{% if exampleBillboards %}
Example Billboards: {{{exampleBillboards}}}
{% endif %}

Suggested Billboard Locations:`,
});

const suggestBillboardLocationsFlow = ai.defineFlow(
  {
    name: 'suggestBillboardLocationsFlow',
    inputSchema: SuggestBillboardLocationsInputSchema,
    outputSchema: SuggestBillboardLocationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
