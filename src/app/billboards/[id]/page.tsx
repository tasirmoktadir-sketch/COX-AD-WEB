'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBillboards } from '@/context/billboard-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Map, Maximize, Package, Compass, Layers } from 'lucide-react';
import type { Billboard } from '@/lib/types';

export default function BillboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { billboards, isLoading: areBillboardsLoading } = useBillboards();
  const [billboard, setBillboard] = React.useState<Billboard | null>(null);

  const id = params.id as string;

  React.useEffect(() => {
    if (!areBillboardsLoading && billboards.length > 0) {
      const foundBillboard = billboards.find((b) => b.id === id);
      if (foundBillboard) {
        setBillboard(foundBillboard);
      } else {
        // Optionally redirect if not found after loading
        router.push('/404');
      }
    }
  }, [id, billboards, areBillboardsLoading, router]);

  if (areBillboardsLoading || !billboard) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const displaySize = billboard.size && typeof billboard.size === 'object'
    ? `${billboard.size.width} x ${billboard.size.height}${billboard.size.depth ? ` x ${billboard.size.depth}` : ''}`
    : typeof (billboard.size as any) === 'string'
    ? (billboard.size as any)
    : 'N/A';
  
  const bothSidesInfo = billboard.size?.isBothSides 
    ? `Yes ${billboard.size.bothSidesMeasurement ? `(${billboard.size.bothSidesMeasurement})` : ''}` 
    : 'No';

  return (
    <>
      <Header />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Image Carousel */}
            <div className="lg:col-span-2">
               <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                    {(billboard.images && billboard.images.length > 0) ? (
                        billboard.images.map((url, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted group">
                                    <Image 
                                        src={url} 
                                        alt={`${billboard.name} - Image ${index + 1}`} 
                                        fill 
                                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                    />
                                </div>
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem>
                             <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No Image Available</p>
                            </div>
                        </CarouselItem>
                    )}
                    </CarouselContent>
                    {billboard.images && billboard.images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                    </>
                    )}
                </Carousel>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-1">
                <Card className="h-full shadow-lg">
                    <CardContent className="p-6 flex flex-col h-full">
                        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">{billboard.name}</h1>
                        
                        <div className="flex-grow space-y-5 mt-4">
                             <div className="space-y-1">
                                <p className="font-semibold text-foreground">Location</p>
                                <p className="flex items-start text-muted-foreground">
                                    <Map className="mr-3 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    {billboard.location}
                                </p>
                            </div>

                            <Separator />
                            
                            <div className="space-y-1">
                                <p className="font-semibold text-foreground">Specifications</p>
                                <div className="space-y-2 pl-[28px]">
                                     <p className="flex items-center text-muted-foreground">
                                        <Maximize className="mr-3 h-4 w-4 text-primary flex-shrink-0 -ml-7" />
                                        <strong>Size:&nbsp;</strong> {displaySize}
                                    </p>
                                    {billboard.facing && (
                                        <p className="flex items-center text-muted-foreground">
                                            <Compass className="mr-3 h-4 w-4 text-primary flex-shrink-0 -ml-7" />
                                            <strong>Facing:&nbsp;</strong> {billboard.facing}
                                        </p>
                                    )}
                                     <p className="flex items-center text-muted-foreground">
                                        <Layers className="mr-3 h-4 w-4 text-primary flex-shrink-0 -ml-7" />
                                        <strong>Both Sides:&nbsp;</strong> {bothSidesInfo}
                                    </p>
                                </div>
                            </div>
                            
                            <Separator />

                            <div className="space-y-1">
                                 <p className="font-semibold text-foreground">Availability</p>
                                 <div className="flex items-center pl-[28px]">
                                    <Package className="mr-3 h-4 w-4 text-primary flex-shrink-0 -ml-7" />
                                    {billboard.availability > 0 
                                    ? <Badge variant="secondary" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">{`${billboard.availability} ${billboard.availability > 1 ? 'units available' : 'unit available'}`}</Badge> 
                                    : <Badge variant="destructive">Unavailable</Badge>
                                    }
                                </div>
                            </div>
                        </div>

                        <Button asChild size="lg" className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/contact">Inquire Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
