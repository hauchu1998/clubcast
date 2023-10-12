export interface ClubCard {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Episode {
  id: string;
  description: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

export interface Club extends ClubCard {
  owner: string;
  episodes: Episode[];
}
