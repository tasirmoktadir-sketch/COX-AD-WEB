export type Billboard = {
  id: string;
  name: string;
  location: string;
  size: {
    width: string;
    height: string;
    isBothSides?: boolean;
  };
  availability: number;
  images: string[];
  isPaused?: boolean;
};
