
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { EmblaCarouselType } from 'embla-carousel-react';

interface ImageViewerDialogProps {
  images: string[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewerDialog({ images, startIndex, isOpen, onClose }: ImageViewerDialogProps) {
    const [api, setApi] = React.useState<EmblaCarouselType | undefined>();

    React.useEffect(() => {
        if (api && isOpen) {
            api.scrollTo(startIndex, true); // Instantly jump to the selected image
        }
    }, [api, isOpen, startIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-none p-4 w-screen h-screen max-w-full max-h-screen flex items-center justify-center">
        <DialogTitle className="sr-only">Image Viewer</DialogTitle>
        <DialogDescription className="sr-only">A carousel of larger images for the selected billboard.</DialogDescription>
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true, startIndex }}>
          <CarouselContent className="h-full">
            {images.map((url, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                  <Image
                    src={url}
                    alt={`Full screen image ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images && images.length > 1 && (
            <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 text-white bg-white/10 hover:bg-white/20 border-white/20" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 text-white bg-white/10 hover:bg-white/20 border-white/20" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
