import type { Billboard } from './types';

const billboards: Billboard[] = [
  {
    id: 'b1',
    name: 'Downtown Crossing Digital',
    location: '123 Main St, Boston, MA',
    lat: 42.3556,
    lng: -71.0603,
    dimensions: "20' x 60'",
    weeklyImpressions: 550000,
    imageId: 'billboard-1',
  },
  {
    id: 'b2',
    name: 'I-93 Expressway Facing North',
    location: 'Interstate 93, Boston, MA',
    lat: 42.365,
    lng: -71.062,
    dimensions: "14' x 48'",
    weeklyImpressions: 720000,
    imageId: 'billboard-2',
  },
  {
    id: 'b3',
    name: 'Seaport District Spectacular',
    location: '25 Drydock Ave, Boston, MA',
    lat: 42.3453,
    lng: -71.0402,
    dimensions: "30' x 90'",
    weeklyImpressions: 480000,
    imageId: 'billboard-3',
  },
  {
    id: 'b4',
    name: 'Somerville Suburbia',
    location: 'Davis Square, Somerville, MA',
    lat: 42.3963,
    lng: -71.1223,
    dimensions: "12' x 24'",
    weeklyImpressions: 210000,
    imageId: 'billboard-4',
  },
  {
    id: 'b5',
    name: 'Financial District Tower',
    location: '1 Federal St, Boston, MA',
    lat: 42.3563,
    lng: -71.0568,
    dimensions: "50' x 50'",
    weeklyImpressions: 600000,
    imageId: 'billboard-5',
  },
  {
    id: 'b6',
    name: 'Fenway Park Approach',
    location: '4 Jersey St, Boston, MA',
    lat: 42.3467,
    lng: -71.0972,
    dimensions: "14' x 48'",
    weeklyImpressions: 850000,
    imageId: 'billboard-6',
  },
];

export const getBillboards = (): Billboard[] => {
  return billboards;
};

export const getBillboardById = (id: string): Billboard | undefined => {
  return billboards.find((b) => b.id === id);
};
