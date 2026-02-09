'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth, initiateEmailSignIn, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { isUserLoading } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Note: The problematic useEffect that caused a redirect loop has been removed.
  // Redirection now happens explicitly after a successful login attempt.

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    initiateEmailSignIn(auth, values.email, values.password)
      .then(() => {
        toast({
          title: 'Sign-in successful!',
          description: 'You will be redirected to the admin dashboard shortly.',
        });
        // Redirect to admin page after successful login.
        // The AdminLayout will then verify if the user is an actual admin.
        router.push('/admin');
      })
      .catch((error: any) => {
        console.error(error);
        let description = 'An unknown error occurred.';
        if (error.code === 'auth/invalid-credential') {
            description = 'The email or password you entered is incorrect. Please try again.';
        } else {
            description = error.message;
        }
        toast({
          variant: 'destructive',
          title: 'Sign-in failed',
          description: description,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  // The loading state should only depend on the initial auth check, not on whether a user is present.
  // This prevents the page from getting stuck in a loading state for already-logged-in users.
  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Login'}
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
