import type { Billboard } from './types';

const billboards: Billboard[] = [
  {
    id: 'b1',
    name: 'Downtown Crossing Digital',
    location: '123 Main St, Boston, MA',
    lat: 42.3556,
    lng: -71.0603,
    size: "20' x 60'",
    availability: 1,
    images: ['https://images.unsplash.com/photo-1506606401543-2e73709cebb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjaXR5JTIwbmlnaHR8ZW58MHx8fHwxNzcwNTk5NTU3fDA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'b2',
    name: 'I-93 Expressway Facing North',
    location: 'Interstate 93, Boston, MA',
    lat: 42.365,
    lng: -71.062,
    size: "14' x 48'",
    availability: 2,
    images: ['https://images.unsplash.com/photo-1660925732757-1054762d916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoaWdod2F5JTIwdHJhZmZpY3xlbnwwfHx8fDE3NzA2MTk1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'b3',
    name: 'Seaport District Spectacular',
    location: '25 Drydock Ave, Boston, MA',
    lat: 42.3453,
    lng: -71.0402,
    size: "30' x 90'",
    availability: 1,
    images: ['https://images.unsplash.com/photo-1696375300630-6c9616ede777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzaG9wcGluZyUyMGRpc3RyaWN0fGVufDB8fHx8MTc3MDYxOTU4M3ww&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'b4',
    name: 'Somerville Suburbia',
    location: 'Davis Square, Somerville, MA',
    lat: 42.3963,
    lng: -71.1223,
    size: "12' x 24'",
    availability: 3,
    images: ['https://images.unsplash.com/photo-1711730423032-8e832733fef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdWJ1cmJhbiUyMHJvYWR8ZW58MHx8fHwxNzcwNjE5NTgzfDA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'b5',
    name: 'Financial District Tower',
    location: '1 Federal St, Boston, MA',
    lat: 42.3563,
    lng: -71.0568,
    size: "50' x 50'",
    availability: 1,
    images: ['https://images.unsplash.com/photo-1768230621592-4a8750c1adaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxidWlsZGluZyUyMGNpdHlzY2FwZXxlbnwwfHx8fDE3NzA2MTk1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'b6',
    name: 'Fenway Park Approach',
    location: '4 Jersey St, Boston, MA',
    lat: 42.3467,
    lng: -71.0972,
    size: "14' x 48'",
    availability: 0,
    images: ['https://images.unsplash.com/photo-1567883251222-651d554b880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx0b3VyaXN0JTIwYXR0cmFjdGlvbnxlbnwwfHx8fDE3NzA1NzM4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
];

export const getBillboards = (): Billboard[] => {
  return billboards;
};

export const getBillboardById = (id: string): Billboard | undefined => {
  return billboards.find((b) => b.id === id);
};
