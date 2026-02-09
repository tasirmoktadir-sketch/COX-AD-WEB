"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type FormState = {
  succeeded: boolean;
  submitting: boolean;
  errors: { field?: string, message: string }[] | null;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [state, setState] = React.useState<FormState>({
    succeeded: false,
    submitting: false,
    errors: null
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(prevState => ({ ...prevState, submitting: true, errors: null }));

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xkovgbrw", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setState({ succeeded: true, submitting: false, errors: null });
        form.reset();
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
            const formErrors = responseData.errors.map((error: any) => ({ field: error.field, message: error.message }));
            setState(prevState => ({ ...prevState, errors: formErrors, submitting: false }));
            toast({
              variant: "destructive",
              title: "Submission Error",
              description: "Please check the form for errors and try again.",
            });
        } else {
          throw new Error("An unknown error occurred on submission.");
        }
      }
    } catch (error) {
      console.error(error);
      setState(prevState => ({ ...prevState, submitting: false, errors: [{message: 'Could not send your message. Please try again later.'}] }));
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not send your message. Please try again later.",
      });
    }
  };
  
  const getErrorMessage = (fieldName: string) => {
    if (!state.errors) return null;
    const error = state.errors.find(e => (e.field && e.field.toLowerCase().includes(fieldName.toLowerCase())) || (!e.field && fieldName === 'form'));
    return error ? <p className="text-sm font-medium text-destructive">{error.message}</p> : null;
  }

  if (state.succeeded) {
      return (
          <>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
                <Card className="w-full max-w-2xl shadow-xl bg-card/80 backdrop-blur-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Thank You!</CardTitle>
                        <CardDescription className="text-lg">
                            Your message has been sent. We'll be in touch shortly.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </main>
            <Footer />
          </>
      );
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl bg-card/80 backdrop-blur-lg">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Get in Touch</CardTitle>
              <CardDescription className="text-lg">
                Ready to make a big impact? Let's talk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" name="name" placeholder="John Doe" required />
                    {getErrorMessage('name')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" name="email" placeholder="you@company.com" required />
                    {getErrorMessage('email')}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
                    <Input id="contactNumber" type="tel" name="contactNumber" placeholder="+1 (555) 123-4567" />
                     {getErrorMessage('contactNumber')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" type="text" name="company" placeholder="Your Company Inc." />
                     {getErrorMessage('company')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us about your advertising goals..." className="min-h-[150px]" required />
                    <p className="text-sm text-muted-foreground">The more details you provide, the better we can assist you.</p>
                     {getErrorMessage('message')}
                </div>
                
                {getErrorMessage('form')}

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105" disabled={state.submitting}>
                  {state.submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : "Send Inquiry"
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
