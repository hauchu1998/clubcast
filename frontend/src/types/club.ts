import { address } from "./address";

export interface ClubCard {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Episode {
  id: string;
  publisher: string;
  createdAt: string;
  title: string;
  description: string;
  ipfsUrl: string;
  likes: number;
  dislikes: number;
}

interface Comment {
  id: string;
  from: string;
  content: string;
  createdAt: string;
}

export interface Club extends ClubCard {
  owner: string;
  chainId: number;
}
