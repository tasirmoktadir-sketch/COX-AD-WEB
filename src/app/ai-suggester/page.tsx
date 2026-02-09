"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { suggestBillboardLocations } from "@/ai/flows/suggest-billboard-locations";
import type { SuggestBillboardLocationsOutput } from "@/ai/flows/suggest-billboard-locations";

const formSchema = z.object({
  targetDemographic: z.string().min(10, {
    message: "Please describe your target demographic in more detail.",
  }),
  campaignGoals: z.string().min(10, {
    message: "Please describe your campaign goals in more detail.",
  }),
  exampleBillboards: z.string().optional(),
});

export default function AiSuggesterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestBillboardLocationsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetDemographic: "",
      campaignGoals: "",
      exampleBillboards: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await suggestBillboardLocations(values);
      setResult(response);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        title: "An Error Occurred",
        description: "Failed to get suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              Predictive Billboard Selector
            </h1>
            <p className="text-lg text-foreground/80">
              Leverage our AI to find the perfect billboard locations for your campaign. Just tell us who you want to reach and what you want to achieve.
            </p>
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="targetDemographic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Demographic</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Young professionals aged 25-40, interested in tech and outdoor activities."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="campaignGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Goals</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Increase brand awareness for a new energy drink, drive traffic to our website."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="exampleBillboards"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Example Billboards (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., We like clean, minimalist designs with a strong call to action."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide examples of billboard styles or messages you like.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Suggestions...
                        </>
                      ) : (
                        "Get AI Suggestions"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:pt-20">
            <Card className="h-full shadow-lg bg-primary/5">
              <CardHeader>
                <CardTitle className="font-headline">AI-Powered Suggestions</CardTitle>
                <CardDescription>
                  Our top recommendations will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                )}
                {result && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{result.suggestedLocations}</p>
                  </div>
                )}
                {!loading && !result && (
                   <div className="text-center text-muted-foreground py-12">
                    <p>Your results are just a click away.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
