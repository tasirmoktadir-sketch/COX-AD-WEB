
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Map, Maximize, Package, Compass, Layers } from 'lucide-react';
import type { Billboard } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BillboardDetailDialogProps {
  billboard: Billboard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BillboardDetailDialog({ billboard, isOpen, onClose }: BillboardDetailDialogProps) {
  if (!billboard) {
    return null;
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl w-full p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Carousel */}
            <div className="relative p-6 flex items-center justify-center bg-muted/30">
                <Carousel className="w-full max-w-md" opts={{ loop: true }}>
                    <CarouselContent>
                    {(billboard.images && billboard.images.length > 0) ? (
                        billboard.images.map((url, index) => (
                            <CarouselItem key={index}>
                                <Link href={url} target="_blank" rel="noopener noreferrer" title="View full image in new tab">
                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-black group">
                                        <Image 
                                            src={url} 
                                            alt={`${billboard.name} - Image ${index + 1}`} 
                                            fill 
                                            className="object-contain transition-transform duration-300 group-hover:scale-105" 
                                        />
                                    </div>
                                </Link>
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
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </>
                    )}
                </Carousel>
            </div>

            {/* Details Section */}
            <div className="p-6 flex flex-col">
                <DialogHeader className="mb-6">
                    <DialogTitle className="font-headline text-3xl text-primary">{billboard.name}</DialogTitle>
                </DialogHeader>

                <div className="flex-grow space-y-4 text-sm">
                    <div className="space-y-1">
                        <p className="font-semibold text-foreground">Location</p>
                        <p className="flex items-center text-muted-foreground">
                            <Map className="mr-3 h-4 w-4 text-primary flex-shrink-0" />
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
                         <p className="flex items-center">
                            <Package className="mr-3 h-4 w-4 text-primary flex-shrink-0" />
                            {billboard.availability > 0 
                            ? <Badge variant="secondary" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">{`${billboard.availability} ${billboard.availability > 1 ? 'units available' : 'unit available'}`}</Badge> 
                            : <Badge variant="destructive">Unavailable</Badge>
                            }
                        </p>
                    </div>

                </div>
                
                <DialogFooter className="pt-8 sm:justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    <Button asChild>
                        <Link href="/contact">Inquire Now</Link>
                    </Button>
                </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
