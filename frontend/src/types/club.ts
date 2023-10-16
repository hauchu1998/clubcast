export interface ClubCard {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  contentUrl: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  from: string;
  content: string;
  createdAt: string;
}

export interface Club extends ClubCard {
  owner: string;
  daoAddress: string;
  chainId: number;
  episodes: Episode[];
}

export enum Vote {
  No,
  Abstain,
  Yes,
}
export interface Proposal {
  id: string;
  title: string;
  proposer: string;
  description: string;
  expiration: Date;
  yes: number;
  abstain: number;
  no: number;
  user: Vote;
}
