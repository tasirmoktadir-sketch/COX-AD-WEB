import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Pin, Users, Eye } from 'lucide-react';
import { getBillboards } from '@/lib/data';
import type { Billboard } from '@/lib/types';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MapView } from '@/components/billboards/map-view';
import placeholderImages from '@/lib/placeholder-images.json';

function BillboardCard({ billboard }: { billboard: Billboard }) {
  const image = placeholderImages.placeholderImages.find(img => img.id === billboard.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader className="p-0">
        {image && (
          <div className="aspect-[4/3] relative">
            <Image
              src={image.imageUrl}
              alt={billboard.name}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
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
        <p className="flex items-center text-muted-foreground">
          <Eye className="mr-2 h-4 w-4 text-primary" />
          {billboard.weeklyImpressions.toLocaleString()} weekly impressions
        </p>
        <p className="flex items-center text-muted-foreground">
          <Users className="mr-2 h-4 w-4 text-primary" />
          Dimensions: {billboard.dimensions}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="/contact">Inquire Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const billboards = getBillboards();

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
              {billboards.map((billboard) => (
                <BillboardCard key={billboard.id} billboard={billboard} />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <section id="map" className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
              Find Your Perfect Spot
            </h2>
            <Card className="overflow-hidden shadow-2xl">
              <div className="h-[500px] md:h-[600px] w-full">
                <MapView billboards={billboards} />
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
