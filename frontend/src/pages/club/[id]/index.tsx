import { useRouter } from "next/router";

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div></div>;
};

export default ClubPage;
