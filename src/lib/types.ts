export type Billboard = {
  id: string;
  name: string;
  location: string;
  size: string;
  availability: number;
  images: string[];
  isPaused?: boolean;
};
