import { ClubCard, Club } from "@/types/club";

export const club: Club = {
  id: "asdfasdf",
  name: "EthGlobal Podcast",
  contractAddress: "0x8F0D0011c2D3B6597Fa958bF2E551a69762c07Ab",
  description:
    "ETHGlobal's flagship online event is back: The idea for the first ETHOnline formed out of sheer necessity. As we were forced to take a break from in-person events back in 2020, we raced to create a virtual equivalent that could inspire the same magical feeling.",
  image:
    "https://pbs.twimg.com/profile_images/1333830155287097349/rGY9wviF_400x400.jpg",
  owner: "0x8F0D0011c2D3B6597Fa958bF2E551a69762c07Ab",
  chainId: 534351,
};

export const episodes = [
  {
    id: "ghuiiia",
    title: "Compact Certificate",
    description:
      "Compact Certificate is a tool that leverage EdDSA and ZK to generate proof for state, messages or anything. Very efficient verification. Please check it out.",
    contentUrl: "https://www.youtube.com/watch?v=TUFr3rfxSlY",
    createdAt: "2021-10-01",
    likes: 100,
    dislikes: 3,
    comments: [],
  },
  {
    id: "ghuiidfreia",
    title: "Scroll Workshop",
    description:
      "In this workshop participants will get an opportunity to take a look at the scroll architecture of a zk rollup and deploy smartcontracts to interact with the bridge.",
    contentUrl: "https://www.youtube.com/watch?v=qFM6GKG9dpg",
    createdAt: "2022-12-01",
    likes: 150,
    dislikes: 7,
    comments: [],
  },
];

export const personalClubs: ClubCard[] = [
  {
    id: "asdfasdf",
    name: "Scroll",
    description:
      "Scroll is a decentralized social media platform built on Ethereum.",
    image: "https://www.iab.com/wp-content/uploads/2020/05/iab-podcasts.png",
  },
  {
    id: "gjitsknksad",
    name: "Sepolia",
    description:
      "Sepolia is a decentralized social media platform built on Ethereum.",
    image:
      "https://www.ojp.gov/sites/g/files/xyckuh241/files/images/2022-04/JusticeToday_logo_1400x1400.png",
  },
];

export const subscribedClubs: ClubCard[] = [
  {
    id: "tiskdnfa",
    name: "iPodcast",
    description:
      "iPodcast is a decentralized social media platform built on Ethereum.",
    image:
      "https://media.istockphoto.com/id/1283532997/vector/podcast-concept-thin-line-icon-abstract-icon-abstract-gradient-background-modern-sound-wave.jpg?s=612x612&w=0&k=20&c=YLg7rHeSuYqeIuGRAcvf2a7J8X8Sx-IkmqYHXIJGPYQ=",
  },
  {
    id: "gdogowvms",
    name: "Around NFL",
    description:
      "Around NFL is a decentralized social media platform built on Ethereum.",
    image:
      "https://static.www.nfl.com/image/private/f_auto/league/whc8rsfa68onzz0nn7xj",
  },
  {
    id: "asdfasdf",
    name: "EthGlobal Podcast",
    description:
      "ETHGlobal's flagship online event is back: The idea for the first ETHOnline formed out of sheer necessity. As we were forced to take a break from in-person events back in 2020, we raced to create a virtual equivalent that could inspire the same magical feeling.",
    image:
      "https://pbs.twimg.com/profile_images/1333830155287097349/rGY9wviF_400x400.jpg",
  },
];

export const allClubs: ClubCard[] = [...personalClubs, ...subscribedClubs];
