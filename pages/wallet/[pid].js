import { useRouter } from "next/router";
import Transaction from "../../components/Transaction";
import { utils } from "ethers";

const Post = () => {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <>
      {" "}
      <Transaction contractAddress={pid} />
    </>
  );
};

export default Post;
