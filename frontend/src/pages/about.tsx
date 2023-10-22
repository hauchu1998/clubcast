import Image from "next/image";
const About = () => {
  return (
    <div className="mt-[4.5rem] flex flex-col items-center">
      <div className="w-[50%] font-semibold">
        <Image
          src="/about.png"
          alt="about"
          width={1311}
          height={735}
          priority
        />
        {`Welcome to "ClubCast"! What is it and why do we need this?`} <br />
        {`Let's think about it, have you ever felt buyer's remorse after getting
        an online course that was just not advanced enough for you? Or subscribe
        to a YouTube channel only to find out the content is not interesting at
        all? ClubCast is a governance club platform that not only ensures the
        host creates good content but also makes members get what they want.`}{" "}
        <br />
        {`How does it work? `}
        <br />
        {`For hosts: `}
        <br />
        {` - To create a club, the host has to set up a governor
        structure for it, allowing your members to actively voice what they'd
        love to see.`}{" "}
        <br />
        {` - Profit from every fragment (our version of club
        NFTs) that's sold. `}
        <br />{" "}
        {` - To ensure the club's quality, hosts have to
        stake a certain amount of money as collateral. They can take it back
        when the club ends; on the contrary, the deposit will be distributed to
        members as a partial refund when they are not satisfied. `}
        <br />
        {` For members: `}
        <br /> {` - Buy the NFT as the ticket to join the club. `} <br />
        {`  - Vote for
        the topic they would like to see. `}{" "}
        <br />
        {`  - Request for refund Come on
        over to ClubCast, where content meets democracy, and where we truly the
        rights of members. See you in the club! `}{" "}
      </div>
    </div>
  );
};

export default About;
