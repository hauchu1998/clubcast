import { address } from "@/types/address";
import { useCallback, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Spinner from "../spinner";
import { bangers } from "@/styles/fonts";
import { AiOutlineClose } from "react-icons/ai";
import useCreateProposal from "@/hooks/useCreateProposal";
import { Proposal } from "@/types/governance";

interface ProposalModalProps {
  governanceAddress: address;
  isMember: boolean;
}

// 0x250E633D64F5D4810438cDBE9367E1bE835f8fdB
const ProposalModal = ({ governanceAddress, isMember }: ProposalModalProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    proposalId,
    title,
    setTitle,
    description,
    setDescription,
    callData,
    setCallData,
    doNothing,
    writeCreateProposal,
    isSuccess,
  } = useCreateProposal(governanceAddress);

  const handleProposalCreated = useCallback(async () => {
    if (!title || !description || !callData) return;
    try {
      console.log("creating proposal");
      setIsLoading(true);
      writeCreateProposal?.();
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  }, [title, description, callData, writeCreateProposal, setIsLoading]);

  useEffect(() => {
    if (isSuccess) {
      setOpenModal(false);
      setIsLoading(false);
    }
  }, [isSuccess]);

  if (!isMember) return null;

  return (
    <div className="absolute top-0 right-5 text-3xl text-purple-500 hover:cursor-pointer">
      <button onClick={() => setOpenModal(true)}>
        <IoMdAdd />
      </button>

      {openModal && (
        <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <div className="w-[40%] rounded-lg border-2 border-purple-500 bg-color">
            <div className="relative h-16 flex justify-center items-center bg-purple-500 text-white rounded-t-lg">
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={() => setOpenModal(false)}
              >
                <AiOutlineClose />
              </button>
              <div className="text-2xl font-semibold">Create Proposal</div>
            </div>
            <div className="px-10 py-5 text-black">
              <div className={`${bangers.className} text-3xl`}>Proposal</div>
              <input
                type="text"
                className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="Enter Episode Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className={`${bangers.className} mt-5 text-3xl`}>
                Description
              </div>
              <textarea
                className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="Enter Episode Description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="mt-5 flex gap-5 items-center">
                <div className={`${bangers.className} text-3xl`}>CallData</div>
                <button
                  className="text-sm text-purple-500 underline"
                  onClick={doNothing}
                >
                  Do Nothing
                </button>
              </div>
              <textarea
                className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="Enter Episode Description"
                rows={3}
                value={callData}
                onChange={(e) => setCallData(e.target.value)}
              />
              <div className="w-full">
                {title && description && callData && (
                  <div className="w-full flex justify-center">
                    <button
                      className={`${bangers.className} mt-5 px-3 py-1 bg-black text-white text-2xl rounded-lg`}
                      onClick={handleProposalCreated}
                    >
                      Propose
                    </button>
                  </div>
                )}
                {isLoading && (
                  <div className="w-full flex gap-3 justify-center text-xl text-pink-500">
                    Loading <Spinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalModal;