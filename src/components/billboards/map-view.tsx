"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Clapperboard } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import type { Billboard as BillboardType } from '@/lib/types';

export function MapView({ billboards }: { billboards: BillboardType[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <Card className="m-4">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
                <p className="text-muted-foreground">
                Google Maps API key is not configured. Please add it to your environment variables to display the map.
                </p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: 42.3601, lng: -71.0589 }}
        defaultZoom={11}
        mapId="adview_map"
        disableDefaultUI={true}
      >
        {billboards.map((billboard) => (
          <AdvancedMarker
            key={billboard.id}
            position={{ lat: billboard.lat, lng: billboard.lng }}
            title={billboard.name}
          >
            <Clapperboard className="w-8 h-8 text-primary drop-shadow-lg" />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
