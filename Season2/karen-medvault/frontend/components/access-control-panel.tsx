"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Clock, UserPlus, Users, X } from "lucide-react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { AccessControlSkeleton } from "@/components/loading-skeleton" // Componente de Loading
import { useMedVault, type FileAccessGrant } from "@/hooks/use-medvault" // Importamos o tipo FileAccessGrant

// TIPOS DE DADOS LOCAIS
// Nota: O tipo 'File' local precisa ser mais completo ou usar o tipo exportado de use-med-vault
interface File {
  hash: string
  cid: string
  uploadedAt: Date
  owner: string
  customName?: string
}

interface AccessControlPanelProps {
  files: File[]
  walletAddress: string
}

export default function AccessControlPanel({
  files,
  walletAddress,
}: AccessControlPanelProps) {
  const [selectedFile, setSelectedFile] = useState("")
  const [doctorAddress, setDoctorAddress] = useState("")
  const [expirationHours, setExpirationHours] = useState("24")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [activeGrants, setActiveGrants] = useState<FileAccessGrant[]>([])

  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [pendingRevokeAddress, setPendingRevokeAddress] = useState("")

  const { toast } = useToast()
  const { grantAccess, revokeAccess, getFileAccessGrants } = useMedVault()

  // --------------------------------------------------------
  // LÓGICA DE ATUALIZAÇÃO E INICIALIZAÇÃO
  // --------------------------------------------------------

  const updateActiveGrants = useCallback(
    (hash: string) => {
      const grants = getFileAccessGrants(hash)
      // Filtra apenas concessões válidas/não expiradas
      const active = grants.filter((g) => g.expiration * 1000 > Date.now())
      setActiveGrants(active)
    },
    [getFileAccessGrants],
  )

  // Inicialização (seleciona o primeiro arquivo e carrega grants)
  useEffect(() => {
    if (files && files.length > 0) {
      const initialHash = files[0].hash
      setSelectedFile(initialHash)
      updateActiveGrants(initialHash)
    }
    setIsInitializing(false)
  }, [files, updateActiveGrants])

  // Lógica de mudança de arquivo selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHash = e.target.value
    setSelectedFile(newHash)
    updateActiveGrants(newHash)
  }

  // --------------------------------------------------------
  // GRANT ACCESS
  // --------------------------------------------------------
  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const addr = doctorAddress.trim()
      const duration = Number(expirationHours)

      if (!ethers.isAddress(addr)) {
        toast({
          title: "Endereço Inválido",
          description: "Por favor, insira uma carteira Ethereum válida.",
          variant: "destructive",
        })
        return
      }

      if (!selectedFile) {
        toast({
          title: "Informação Faltando",
          description: "Selecione um arquivo para conceder acesso.",
          variant: "destructive",
        })
        return
      }

      if (duration <= 0 || duration > 720) {
        toast({
          title: "Duração Inválida",
          description: "A duração deve ser entre 1 e 720 horas (30 dias).",
          variant: "destructive",
        })
        return
      }

      const checksumAddress = ethers.getAddress(addr)

      const txHash = await grantAccess(selectedFile, checksumAddress, duration)

      toast({
        title: "Acesso Concedido",
        description: `Transação: ${txHash.slice(0, 10)}...`,
      })

      // Atualiza a lista local de grants após sucesso
      updateActiveGrants(selectedFile)

      setDoctorAddress("")
      setExpirationHours("24")
    } catch (err) {
      toast({
        title: "Falha ao Conceder Acesso",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------------------------------
  // INITIATE REVOKE
  // --------------------------------------------------------
  const initiateRevoke = (doctorAddress: string) => {
    if (!doctorAddress) {
      toast({
        title: "Endereço Inválido",
        description: "Endereço do médico está faltando.",
        variant: "destructive",
      })
      return
    }

    setPendingRevokeAddress(doctorAddress)
    setRevokeDialogOpen(true)
  }

  // --------------------------------------------------------
  // REVOKE ACCESS
  // --------------------------------------------------------
  const handleRevokeAccess = async () => {
    if (!selectedFile || !pendingRevokeAddress) return

    try {
      // O hook revokeAccess lida com a revogação no contrato e atualização local
      const txHash = await revokeAccess(selectedFile, pendingRevokeAddress)

      toast({
        title: "Acesso Revogado",
        description: `Transação: ${txHash?.slice(0, 10)}...`,
      })

      // Atualiza a lista local de grants
      updateActiveGrants(selectedFile)
    } catch (err) {
      toast({
        title: "Falha ao Revogar Acesso",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setRevokeDialogOpen(false)
      setPendingRevokeAddress("")
    }
  }

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  if (isInitializing) return <AccessControlSkeleton />

  if (files.length === 0) {
    return (
      <Card className="rounded-xl border border-dashed p-12 text-center shadow-none">
        <Lock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Nenhum arquivo encontrado</h3>
        <p className="text-muted-foreground text-sm">
          Faça o upload de um arquivo para gerenciar as permissões de acesso.
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-in">
        {/* LEFT PANEL: Grant Access Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5 text-primary" />
              Conceder Acesso a Médicos
            </h3>

            <form onSubmit={handleGrantAccess} className="space-y-6">
              {/* Select File */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Selecione o Arquivo Médico
                </label>
                <select
                  value={selectedFile}
                  onChange={handleFileChange}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {files.map((file) => (
                    <option key={file.hash} value={file.hash}>
                      {file.customName || file.hash.slice(0, 16)}... (em{" "}
                      {file.uploadedAt.toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Address */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Endereço da Carteira do Médico
                </label>
                <Input
                  placeholder="0x..."
                  value={doctorAddress}
                  onChange={(e) => setDoctorAddress(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Duração do Acesso (horas)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="720" // 30 dias
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo: 720 horas (30 dias).
                </p>
              </div>

              <Button disabled={isLoading} size="lg" className="w-full gap-2">
                {isLoading ? <Spinner size="sm" /> : "Conceder Acesso"}
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT PANEL: Access Info and Active Grants List */}
        <div className="space-y-4">
          <Card className="p-6">
            <h4 className="mb-4 flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Informações de Acesso
            </h4>

            <p className="mb-1 text-sm text-muted-foreground">
              Concessões Ativas (para o arquivo selecionado)
            </p>
            <p className="text-2xl font-bold text-primary">
              {activeGrants.length}
            </p>
            
            <p className="mt-4 mb-1 text-sm text-muted-foreground">
              Arquivo Selecionado
            </p>
            <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded truncate">
              {selectedFile.slice(0, 20)}...
            </p>
            
            <p className="mt-4 mb-1 text-sm text-muted-foreground">
              Total de Arquivos
            </p>
            <p className="text-xl font-semibold">{files.length}</p>
          </Card>
          
          {/* LISTA DE ACESSOS ATIVOS */}
          {activeGrants.length > 0 && (
            <Card className="p-6">
              <h4 className="mb-4 font-semibold text-sm border-b pb-2">
                Médicos com Acesso Ativo
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeGrants.map((g) => {
                  const expirationDate = new Date(g.expiration * 1000)
                  return (
                    <div
                      key={g.doctorAddress}
                      className="flex items-center justify-between border-b border-dashed pb-2 last:border-b-0"
                    >
                      <div>
                        <span className="font-mono text-xs block truncate">
                          {g.doctorAddress.slice(0, 10)}...
                          {g.doctorAddress.slice(-8)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Expira: {expirationDate.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-500/10"
                        onClick={() => initiateRevoke(g.doctorAddress)}
                        title="Revogar Acesso"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
          
        </div>
      </div>

      {/* Confirmação de Revogação */}
      <ConfirmDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        title="Revogar Acesso"
        description={`Tem certeza de que deseja revogar o acesso do médico ${pendingRevokeAddress.slice(0, 10)}...? Esta ação é irreversível na blockchain.`}
        confirmText="Revogar"
        onConfirm={handleRevokeAccess}
        variant="destructive"
      />
    </>
  )
}
