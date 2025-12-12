"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, CheckCircle, FileUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { generateFileHash, validateFile } from "@/lib/file-utils"
import { uploadToDeOSS } from "@/lib/deoss"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { useMedVault } from "@/hooks/use-medvault"

interface FileUploadCardProps {
  onUpload: (fileHash: string, deossFID: string) => void
  walletAddress: string
}

export default function FileUploadCard({
  onUpload,
}: FileUploadCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { registerFile, fileExists } = useMedVault()

  // --------------------------------------------------------
  // PROCESSAMENTO DO ARQUIVO
  // --------------------------------------------------------
  const processFile = async (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      toast({
        title: "Arquivo inválido",
        description: validation.error ?? "Falha na validação do arquivo.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setFileName(file.name)
    setUploadProgress(10)

    try {
      // 1. Gerar hash
      setUploadProgress(25)
      const fileHash = await generateFileHash(file)

      // 2. Verificar duplicidade na blockchain
      setUploadProgress(35)
      const exists = await fileExists(fileHash)
      if (exists) {
        throw new Error("Este arquivo já está registrado na blockchain.")
      }

      // 3. Upload para DeOSS
      setUploadProgress(55)
      const deossFID = await uploadToDeOSS(file)

      // 4. Registrar na blockchain
      setUploadProgress(80)
      await registerFile(fileHash, deossFID)

      // 5. Sucesso
      setUploadProgress(100)
      toast({
        title: "Upload concluído",
        description: `Arquivo registrado na blockchain (FID: ${deossFID.slice(
          0,
          12,
        )}...)`,
      })

      onUpload(fileHash, deossFID)

      setTimeout(() => {
        setUploadProgress(0)
        setFileName("")
        setIsLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }, 1200)
    } catch (err) {
      toast({
        title: "Erro no upload",
        description:
          err instanceof Error ? err.message : "Falha ao processar o arquivo.",
        variant: "destructive",
      })

      setUploadProgress(0)
      setFileName("")
      setIsLoading(false)
    }
  }

  // --------------------------------------------------------
  // DRAG & DROP
  // --------------------------------------------------------
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) processFile(files[0])
    },
    [],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------
  return (
    <Card
      className={`p-8 border-2 border-dashed transition-all ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Upload className="h-5 w-5 text-primary" />
          Upload de Arquivo Médico
        </h3>

        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Spinner size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {uploadProgress < 30
                    ? "Gerando hash..."
                    : uploadProgress < 60
                    ? "Enviando para DeOSS..."
                    : uploadProgress < 90
                    ? "Registrando na blockchain..."
                    : "Finalizando..."}
                </p>
              </div>

              {uploadProgress === 100 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>

            <Progress value={uploadProgress} />
          </div>
        )}

        {!isLoading && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.dcm"
            />

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              Selecionar Arquivo
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              PDF, DICOM, JPG, PNG — até 100MB
            </p>
          </>
        )}
      </div>
    </Card>
  )
}

