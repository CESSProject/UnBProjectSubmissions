"use client";

import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts";

export interface FileInfo {
  owner: string;
  uploadedAt: number;
  deossCID: string;
  exists: boolean;
}

export class MedVaultContract {
  private contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  // -----------------------------
  // REGISTER FILE
  // -----------------------------
  async registerFile(fileHash: string, fid: string): Promise<string> {
    const tx = await this.contract.registerFile(fileHash, fid);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  // -----------------------------
  // SYNC FILE (already exists)
  // -----------------------------
  async syncFile(fileHash: string, fid: string, owner: string): Promise<string> {
    const tx = await this.contract.syncFile(fileHash, fid, owner);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  // -----------------------------
  // GET USER FILES (msg.sender)
  // -----------------------------
  async getMyFiles(): Promise<string[]> {
    return await this.contract.getMyFiles();
  }

  // -----------------------------
  // GET FILE INFO
  // -----------------------------
  async getFileInfo(fileHash: string): Promise<FileInfo> {
    const [owner, timestamp, fid, exists] =
      await this.contract.getFileInfo(fileHash);

    return {
      owner,
      uploadedAt: Number(timestamp),
      deossCID: fid,
      exists,
    };
  }

  // -----------------------------
  // GET FILES WITH DETAILS
  // -----------------------------
  async getMyFilesWithDetails(): Promise<FileInfo[]> {
    const hashes = await this.getMyFiles();
    const files: FileInfo[] = [];

    for (const hash of hashes) {
      try {
        const info = await this.getFileInfo(hash);
        files.push(info);
      } catch (e) {
        console.error("Failed to fetch file info:", hash, e);
      }
    }

    return files;
  }
}

// -----------------------------
// FACTORY
// -----------------------------
export function createContractInstance(
  signer: ethers.Signer
): MedVaultContract {
  return new MedVaultContract(signer);
}

