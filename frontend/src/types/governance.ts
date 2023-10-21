export enum Vote {
  No,
  Yes,
  Abstain,
}
export interface Proposal {
  id: string;
  title: string;
  blockNumber: number;
  description: string;
}
