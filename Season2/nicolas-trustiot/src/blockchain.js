import { ethers } from "ethers";
import TrustIoT from "./TrustIoT.json"; // agora está no src/

const contractAddress = TrustIoT.address;
const contractABI = TrustIoT.abi;

export const getBlockchain = async () => {
  if (!window.ethereum) {
    alert("MetaMask não encontrada!");
    return null;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;

  } catch (error) {
    console.error("Erro ao conectar ao contrato:", error);
    alert("Erro ao conectar ao contrato.");
    return null;
  }
};

