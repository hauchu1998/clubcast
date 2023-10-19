import { MAX_FILE_SIZE } from "@/constants/attachmentSize";
import Upload from "@/helpers/upload";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage";

export const useMediaUploaded = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaBytes, setMediaBytes] = useState<Upload | null>(null);
  const web3Storage = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || "",
  });

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedia(e.target.files?.[0] || null);
    e.target.value = "";
  };

  const handleMediaUpload = async () => {
    const ipfsDomain = "https://ipfs.io/ipfs";
    if (!media || !mediaBytes) return "";
    try {
      const cid = await web3Storage.put([mediaBytes]);
      const ipfsUrl = `${ipfsDomain}/${cid}/${media.name}`;
      console.log(ipfsUrl);
      return ipfsUrl;
    } catch (e) {
      console.log(e);
      return "";
    }
  };

  useEffect(() => {
    console.log(media);
    if (!media) {
      return;
    }
    if (media.size >= MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      const data = fileReader.result;

      if (!(data instanceof ArrayBuffer)) {
        return;
      }

      const upload = new Upload(media.name, new Uint8Array(data));
      console.log(upload);
      setMediaBytes(upload);
    });

    fileReader.readAsArrayBuffer(media);
    fileReader.removeEventListener("load", () => {});
  }, [media]);
  return { media, setMedia, handleMediaUpload, handleMediaChange };
};
