export type Billboard = {
  id: string;
  name: string;
  location: string;
  size: {
    width: string;
    height: string;
    depth?: string;
    isBothSides?: boolean;
    bothSidesMeasurement?: string;
  };
  availability: number;
  images: string[];
  isPaused?: boolean;
  facing?: string;
};
