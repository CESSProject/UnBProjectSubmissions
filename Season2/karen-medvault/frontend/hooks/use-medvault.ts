// hooks/use-medvault.ts
"use client"

import { useState, useCallback, useEffect } from "react"
import { ethers, type Signer } from "ethers"
// Assumimos que o useWeb3 agora retorna account, contract e signer
import { useWeb3 } from "@/lib/web3-provider" 

/* =========================
   TYPES
========================= */
export interface MedVaultFile {
  hash: string
  cid: string
  uploadedAt: Date
  owner: string
}

export interface FileAccessGrant {
  doctorAddress: string
  expiration: number
  grantedAt: number
}

/* =========================
   MAIN HOOK
========================= */
export function useMedVault() {
  // 🚨 Recebe 'signer' do Web3Provider para garantir a escrita.
  const { account, contract, signer } = useWeb3()

  const [files, setFiles] = useState<MedVaultFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =========================
     INTERNAL HELPER (SIGNER)
  ========================= */
  /**
   * Retorna o objeto Contract conectado ao Signer para transações de escrita.
   * Lança um erro se o Signer não estiver disponível.
   */
  const getWritableContract = useCallback(() => {
    if (!contract || !signer) {
        throw new Error("Contrato não conectado ou Signer indisponível. Conecte sua carteira.")
    }
    // Conecta o objeto Contrato (que pode ser read-only) ao Signer para escrita
    return contract.connect(signer) as typeof contract
    
  }, [contract, signer])


  /* =========================
     LOAD FILES (READ ONLY)
  ========================= */
  const loadUserFiles = useCallback(async () => {
    if (!account || !contract) {
      setFiles([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const hashes: string[] = await contract.getMyFiles()
      const loaded: MedVaultFile[] = []

      for (const hash of hashes) {
        // contract! é usado após a verificação de null
        const info = await contract!.getFileInfo(hash) 

        const owner = info[0] as string
        const timestamp = Number(info[1])
        const fid = info[2] as string
        const exists = info[3] as boolean

        if (!exists || owner === ethers.ZeroAddress) continue

        loaded.push({
          hash,
          cid: fid,
          uploadedAt: new Date(timestamp * 1000),
          owner,
        })
      }

      setFiles(loaded)
    } catch (err) {
      console.error("[useMedVault] loadUserFiles error:", err)
      setError("Erro ao carregar arquivos da blockchain. Verifique a rede.")
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }, [account, contract])

  /* =========================
     FILE EXISTS (READ)
  ========================= */
  const fileExists = useCallback(
    async (hash: string): Promise<boolean> => {
      if (!contract) return false
      try {
        return await contract.hasFile(hash)
      } catch {
        return false
      }
    },
    [contract],
  )

  /* =========================
     REGISTER FILE (WRITE)
  ========================= */
  const registerFile = useCallback(
    async (hash: string, fid: string) => {
      if (!ethers.isHexString(hash, 32)) {
        throw new Error("Hash inválido (bytes32 esperado).")
      }

      const writableContract = getWritableContract()

      try {
        const tx = await writableContract.registerFile(hash, fid)
        const receipt = await tx.wait()

        if (receipt?.status !== 1) {
          throw new Error("Transação revertida pelo contrato.")
        }

        await loadUserFiles()
        return tx.hash
      } catch (e) {
        throw e;
      }
    },
    [getWritableContract, loadUserFiles],
  )

  /* =========================
     REMOVE FILE (WRITE)
  ========================= */
  const removeFile = useCallback(
    async (hash: string) => {
      if (!ethers.isHexString(hash, 32)) {
        throw new Error("Hash inválido (bytes32 esperado).")
      }

      const writableContract = getWritableContract()

      try {
        const tx = await writableContract.removeFile(hash)
        const receipt = await tx.wait()

        if (receipt?.status !== 1) {
          throw new Error("Transação revertida pelo contrato.")
        }

        await loadUserFiles()
        return tx.hash
      } catch (e) {
        throw e;
      }
    },
    [getWritableContract, loadUserFiles],
  )

  /* =========================
     GRANT ACCESS (WRITE) - COM CORREÇÃO DE EXPIRAÇÃO
  ========================= */
  const grantAccess = useCallback(
    async (hash: string, doctor: string, hours: number) => {
      if (!account || !contract) {
        throw new Error("Carteira/Contrato não conectado.")
      }

      if (!ethers.isHexString(hash, 32)) {
        throw new Error("Hash inválido (bytes32 esperado).")
      }

      if (doctor.toLowerCase() === account.toLowerCase()) {
        throw new Error("Não é permitido conceder acesso a si mesmo.")
      }

      if (hours < 1) {
        throw new Error("Duração mínima de 1 hora.")
      }

      // 🔐 Pre-flight check de Propriedade (READ)
      const info = await contract.getFileInfo(hash)
      if (info[0].toLowerCase() !== account.toLowerCase()) {
        // Se este erro for lançado, o problema é que a conta não é o proprietário.
        throw new Error("Você não é o proprietário deste arquivo.")
      }

      // 🚨 CORREÇÃO DE REVERSÃO: Adiciona margem de 5 minutos (300 segundos) para garantir que expire no futuro
      const timeNowSeconds = Math.floor(Date.now() / 1000);
      const expiration = timeNowSeconds + (hours * 3600) + 300; 

      const writableContract = getWritableContract()

      try {
        const tx = await writableContract.grantAccess(hash, doctor, expiration)
        const receipt = await tx.wait()

        if (receipt?.status !== 1) {
          throw new Error("Transação revertida pelo contrato.")
        }

        return tx.hash
      } catch (e) {
        throw e;
      }
    },
    [getWritableContract, account, contract],
  )

  /* =========================
     REVOKE ACCESS (WRITE)
  ========================= */
  const revokeAccess = useCallback(
    async (hash: string, doctor: string) => {
      if (!account || !contract) throw new Error("Carteira/Contrato não conectado.")

      if (!ethers.isHexString(hash, 32)) {
        throw new Error("Hash inválido (bytes32 esperado).")
      }

      // Pre-flight check de Propriedade
      const info = await contract.getFileInfo(hash)
      if (info[0].toLowerCase() !== account.toLowerCase()) {
        throw new Error("Você não é o proprietário deste arquivo.")
      }

      const writableContract = getWritableContract()

      try {
        const tx = await writableContract.revokeAccess(hash, doctor)
        const receipt = await tx.wait()

        if (receipt?.status !== 1) {
          throw new Error("Transação revertida pelo contrato.")
        }

        return tx.hash
      } catch (e) {
        throw e;
      }
    },
    [getWritableContract, account, contract],
  )

  /* =========================
     CHECK ACCESS (READ)
  ========================= */
  const checkAccess = useCallback(
    async (hash: string, user: string): Promise<boolean> => {
      if (!contract) return false
      try {
        return await contract.hasAccess(hash, user)
      } catch {
        return false
      }
    },
    [contract],
  )

  /* =========================
     STUBS (KEEP FRONT STABLE)
  ========================= */
  const renameFile = useCallback(() => {}, [])
  const getFileAccessGrants = useCallback(
    (_hash: string): FileAccessGrant[] => [],
    [],
  )

  /* =========================
     AUTO LOAD
  ========================= */
  useEffect(() => {
    if (account && contract) loadUserFiles()
    else setFiles([])
  }, [account, contract, loadUserFiles])

  /* =========================
     API
  ========================= */
  return {
    files,
    isLoading,
    error,

    loadUserFiles,
    registerFile,
    removeFile,
    fileExists,

    grantAccess,
    revokeAccess,
    checkAccess,

    renameFile,
    getFileAccessGrants,
  }
}
