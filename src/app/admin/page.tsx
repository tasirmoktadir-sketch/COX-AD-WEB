import { BillboardsTable } from './billboards-table';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AdminPage() {
  return (
    <>
    <Header />
    <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>
            <BillboardsTable />
        </div>
    </main>
    <Footer />
    </>
  );
}
