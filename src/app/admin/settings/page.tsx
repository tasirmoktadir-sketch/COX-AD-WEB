
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AboutInfo } from '@/lib/types';

const aboutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const aboutDocRef = useMemoFirebase(() => doc(firestore, 'site_content', 'about_us'), [firestore]);
  const { data: aboutData, isLoading: isDataLoading } = useDoc<AboutInfo>(aboutDocRef);

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      name: '',
      companyName: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  React.useEffect(() => {
    if (aboutData) {
      form.reset(aboutData);
    }
  }, [aboutData, form]);

  const onSubmit = async (values: AboutFormValues) => {
    try {
        await setDoc(aboutDocRef, values, { merge: true });
        toast({
            title: 'Settings Saved',
            description: 'The "About Us" information has been updated.',
        });
    } catch (error: any) {
        console.error("Failed to save settings:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: error.message || "Could not save settings.",
        });
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Site Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>About Us Information</CardTitle>
            <CardDescription>Edit the company details that appear on your homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Contact Person</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="companyName" render={({ field }) => ( <FormItem> <FormLabel>Company Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number(s)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email Address</FormLabel> <FormControl><Input type="email" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> ) : ( <><Save className="mr-2 h-4 w-4" /> Save Changes</> )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

    