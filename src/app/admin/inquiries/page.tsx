'use client';

import * as React from 'react';
import { collection, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, Inbox, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type InquiryData = {
  name: string;
  email: string;
  company?: string;
  contactNumber?: string;
  message: string;
  submittedAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
  read: boolean;
};

export default function InquiriesPage() {
  const firestore = useFirestore();

  const inquiriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'inquiries'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: inquiries, isLoading } = useCollection<InquiryData>(inquiriesQuery);

  React.useEffect(() => {
    if (!firestore || !inquiries || inquiries.length === 0) return;

    const unreadInquiries = inquiries.filter(inq => !inq.read);
    if (unreadInquiries.length === 0) return;

    const batch = writeBatch(firestore);
    unreadInquiries.forEach(inquiry => {
      const inquiryRef = doc(firestore, 'inquiries', inquiry.id);
      batch.update(inquiryRef, { read: true });
    });

    batch.commit().catch(console.error);
  }, [inquiries, firestore]);

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
              <CardDescription>New messages are highlighted. They are marked as read once you view this page.</CardDescription>
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
                        <TableRow key={inquiry.id} className={cn(!inquiry.read && "bg-primary/5 font-medium")}>
                          <TableCell className="hidden align-top md:table-cell whitespace-nowrap text-muted-foreground text-xs">
                            {formatDate(inquiry.submittedAt)}
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="flex items-center gap-3">
                              {!inquiry.read && (
                                <div className="h-2.5 w-2.5 rounded-full bg-primary" title="Unread"></div>
                              )}
                              <div>
                                <div className="font-semibold">{inquiry.name}</div>
                                <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                                {inquiry.contactNumber && (
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Phone className="mr-2 h-3 w-3" />
                                        {inquiry.contactNumber}
                                    </div>
                                )}
                                {inquiry.company && <Badge variant="secondary" className="mt-2">{inquiry.company}</Badge>}
                              </div>
                            </div>
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
