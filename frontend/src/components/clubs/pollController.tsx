import { bangers } from "@/styles/fonts";
interface PollControllerProps {
  css: string;
}

const governanceProposals = [
  {
    title: "Puppies in Bali",
    overview:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    summary:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    requirements:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    yes: 400,
    no: 100,
  },
  {
    title: "Puppies in Andorra",
    overview:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    summary:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    requirements:
      "We're seeking your support to create a heartwarming video featuring adorable puppies in Bali in collaboration with a renowned influencer. We need to borrow 10,000 Matics to make this dream project a reality, and we're excited to share the details with you.",
    yes: 100,
    no: 101,
  },
];

const PollController = ({ css }: PollControllerProps) => {
  return (
    <div className={`${css} w-full pt-3`}>
      <div className={`${bangers.className} text-center text-2xl`}>
        Proposals
      </div>
    </div>
  );
};

export default PollController;
