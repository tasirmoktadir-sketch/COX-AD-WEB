'use client';

import * as React from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// This type represents the data structure of an inquiry document in Firestore.
type InquiryData = {
  name: string;
  email: string;
  company?: string;
  message: string;
  submittedAt: {
    seconds: number;
    nanoseconds: number;
  } | null; // This is how Firestore Timestamps are represented when they come to the client.
};

export default function InquiriesPage() {
  const firestore = useFirestore();

  // We create a memoized query to fetch inquiries, ordered by the most recent.
  const inquiriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'inquiries'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: inquiries, isLoading } = useCollection<InquiryData>(inquiriesQuery);

  // Helper function to format the Firestore timestamp into a readable date string.
  const formatDate = (timestamp: InquiryData['submittedAt']) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') return 'No date';
    try {
        const date = new Date(timestamp.seconds * 1000);
        return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
        return "Invalid date";
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Client Inquiries</h1>
          <Card>
            <CardHeader>
              <CardTitle>Received Messages</CardTitle>
              <CardDescription>Here are the messages submitted through your contact form.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="hidden align-top md:table-cell whitespace-nowrap text-muted-foreground text-xs">
                            {formatDate(inquiry.submittedAt)}
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="font-medium">{inquiry.name}</div>
                            <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                            {inquiry.company && <Badge variant="secondary" className="mt-2">{inquiry.company}</Badge>}
                          </TableCell>
                          <TableCell className="align-top">
                            <p className="whitespace-pre-wrap text-sm">{inquiry.message}</p>
                            <div className="text-xs text-muted-foreground mt-2 md:hidden">
                                {formatDate(inquiry.submittedAt)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <Inbox className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">No inquiries yet</h3>
                    <p className="mt-1 text-sm">
                        Messages from your contact form will appear here.
                    </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
