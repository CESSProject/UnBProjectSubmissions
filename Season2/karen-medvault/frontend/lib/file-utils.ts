
import { ethers } from "ethers"

// Generate SHA-256 hash for a file and return as bytes32 (0x prefixed hex string)
export async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return "0x" + hashHex
}

// Convert string to bytes32 for smart contract
export function stringToBytes32(str: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(str))
}

// Convert CID to bytes32 hash for smart contract storage
export function cidToBytes32(cid: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(cid))
}

// Convert bytes32 back to hex string
export function bytes32ToHex(bytes32: string): string {
  return bytes32
}

// Validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 100 * 1024 * 1024 // 100MB
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/dicom"]

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 100MB limit" }
  }

  // Allow DICOM files without specific mime type
  if (!allowedTypes.includes(file.type) && !file.name.endsWith(".dcm")) {
    return { valid: false, error: "File type not supported" }
  }

  return { valid: true }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
