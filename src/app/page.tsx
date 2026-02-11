
"use client";

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Maximize, Package, Compass, Mail, Phone, Building } from 'lucide-react';
import type { Billboard, AboutInfo } from '@/lib/types';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import placeholderImages from '@/lib/placeholder-images.json';
import { useBillboards } from '@/context/billboard-context';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


function BillboardCard({ billboard }: { billboard: Billboard }) {
  const imageUrl = billboard.images && billboard.images[0];
  const placeholderImage = placeholderImages.placeholderImages.find(img => img.imageUrl === imageUrl);
  const imageDescription = placeholderImage?.description || billboard.name;
  const imageHint = placeholderImage?.imageHint || '';
  const displaySize = billboard.size && typeof billboard.size === 'object'
    ? `${billboard.size.width} x ${billboard.size.height}${billboard.size.depth ? ` x ${billboard.size.depth}` : ''}${billboard.size.isBothSides ? ` (Both Sides${billboard.size.bothSidesMeasurement ? `: ${billboard.size.bothSidesMeasurement}` : ''})` : ''}`
    : typeof (billboard.size as any) === 'string'
    ? (billboard.size as any)
    : 'N/A';

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader className="p-0">
        {imageUrl && (
          <div className="aspect-[4/3] relative">
            <Image
              src={imageUrl}
              alt={imageDescription}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
            />
          </div>
        )}
        <CardTitle className="p-6 pb-2 font-headline text-xl">{billboard.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="flex items-center text-muted-foreground">
          <Map className="mr-2 h-4 w-4 text-primary" />
          {billboard.location}
        </p>
        {billboard.facing && (
            <p className="flex items-center text-muted-foreground">
                <Compass className="mr-2 h-4 w-4 text-primary" />
                Facing: {billboard.facing}
            </p>
        )}
        <p className="flex items-center text-muted-foreground">
          <Maximize className="mr-2 h-4 w-4 text-primary" />
          Size: {displaySize}
        </p>
        <p className="flex items-center text-muted-foreground">
          <Package className="mr-2 h-4 w-4 text-primary" />
          {billboard.availability > 0 ? `${billboard.availability} ${billboard.availability > 1 ? 'units available' : 'unit available'}` : 'Unavailable'}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link href={`/billboards/${billboard.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function BillboardCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-6 pb-2">
            <Skeleton className="h-6 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/5" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function Home() {
  const { billboards, isLoading: areBillboardsLoading } = useBillboards();
  const activeBillboards = billboards.filter(b => !b.isPaused);
  
  const firestore = useFirestore();
  const aboutInfoRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'site_content', 'about_us');
  }, [firestore]);
  const { data: aboutInfo, isLoading: isAboutLoading } = useDoc<AboutInfo>(aboutInfoRef);

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center bg-background">
          <div 
            className="absolute inset-0 bg-primary/10" 
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
            }}
          ></div>
          <div className="container mx-auto px-4 relative">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
              Your Vision, Amplified.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-8">
              High-impact billboard advertising that puts your brand on the map. Literally.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105">
              <Link href="/contact">Start Your Campaign</Link>
            </Button>
          </div>
        </section>

        {/* Billboard Showcase */}
        <section id="billboards" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
              Our Prime Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areBillboardsLoading ? (
                <>
                  <BillboardCardSkeleton />
                  <BillboardCardSkeleton />
                  <BillboardCardSkeleton />
                </>
              ) : (
                activeBillboards.map((billboard) => (
                  <BillboardCard key={billboard.id} billboard={billboard} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
              About Us
            </h2>
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {isAboutLoading ? (
                      <>
                          <div className="space-y-4">
                              <Skeleton className="h-8 w-3/4" />
                              <Skeleton className="h-20 w-full" />
                          </div>
                          <div className="space-y-4">
                              <h3 className="font-headline text-2xl font-bold text-primary invisible md:visible">Contact</h3>
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="h-6 w-full" />
                          </div>
                      </>
                  ) : aboutInfo ? (
                      <>
                          <div className="space-y-4">
                              <h3 className="font-headline text-2xl font-bold text-primary">{aboutInfo.name}</h3>
                              <p className="flex items-start text-muted-foreground">
                                  <Building className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                  <span className="whitespace-pre-line">
                                      <strong>{aboutInfo.companyName}</strong><br />
                                      {aboutInfo.address}
                                  </span>
                              </p>
                          </div>
                          <div className="space-y-4">
                              <h3 className="font-headline text-2xl font-bold text-primary invisible md:visible">Contact</h3>
                               <p className="flex items-center text-muted-foreground">
                                  <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                                  <span>{aboutInfo.phone}</span>
                              </p>
                              <p className="flex items-center text-muted-foreground">
                                  <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                                  <a href={`mailto:${aboutInfo.email}`} className="hover:text-primary transition-colors">{aboutInfo.email}</a>
                              </p>
                          </div>
                      </>
                  ) : (
                      <div className="col-span-full text-center text-muted-foreground py-8">
                          <p>Company information will be available soon.</p>
                      </div>
                  )}
                </CardContent>
            </Card>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
