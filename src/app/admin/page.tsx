import { BillboardsTable } from './billboards-table';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Settings } from 'lucide-react';

export default function AdminPage() {
  return (
    <>
    <Header />
    <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <Button asChild className="transition-transform duration-300 hover:scale-105">
                        <Link href="/admin/inquiries">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Inquiries
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="transition-transform duration-300 hover:scale-105">
                        <Link href="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Site Info
                        </Link>
                    </Button>
                </div>
            </div>
            <BillboardsTable />
        </div>
    </main>
    <Footer />
    </>
  );
}
