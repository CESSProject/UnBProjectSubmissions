"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Copy,
  Eye,
  Download,
  Share2,
  Trash2,
  Info,
  FileIcon,
  Clock,
  Hash,
  CheckCircle2,
  Edit2,
  Users,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { FileListSkeleton } from "@/components/loading-skeleton"
import { downloadFromDeOSS, openFilePreview, getFileMetadata, deleteFileFromDeOSS } from "@/lib/deoss"
import { Spinner } from "@/components/ui/spinner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMedVault } from "@/hooks/use-medvault"
import { Input } from "@/components/ui/input"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { useFileNames } from "@/hooks/use-file-names"

interface File {
  hash: string
  cid: string
  uploadedAt: Date
  owner: string
}

interface FileListProps {
  files: File[]
  walletAddress: string
  isLoading: boolean
  onManageAccess?: (file: File) => void
  onFileDeleted?: (fileHash: string) => void
}

export default function FileList({
  files = [],
  walletAddress = "",
  isLoading = false,
  onManageAccess,
  onFileDeleted,
}: FileListProps) {
  const [copiedFid, setCopiedFid] = useState<string>("")
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})
  const [metadataFile, setMetadataFile] = useState<any>(null)
  const [showMetadataDialog, setShowMetadataDialog] = useState(false)
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<File | null>(null)

  const { toast } = useToast()
  const { removeFile, getFileAccessGrants } = useMedVault()

  // ---------------------
  // RENAME
  // ---------------------
  const { names, renameFile } = useFileNames()
  const [editing, setEditing] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const startRename = (f: File) => {
    setEditing(f.hash)
    setEditText(names[f.hash] || "")
  }

  const saveRename = (hash: string) => {
    if (editText.trim()) {
      renameFile(hash, editText.trim())
      toast({ title: "Renamed", description: "File name updated." })
    }
    setEditing(null)
    setEditText("")
  }

  // ---------------------

  const setActionLoading = (action: string, fileHash: string, loading: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [`${action}-${fileHash}`]: loading }))
  }

  const isActionLoading = (action: string, fileHash: string) =>
    loadingActions[`${action}-${fileHash}`] || false

  // FIX #1 — Corrigir label para FID (não CID)
  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: `${label} copied`, description: text })
  }

  const copyFid = async (fid: string) => copyToClipboard(fid, "FID")
  const copyHash = async (h: string) => copyToClipboard(h, "Hash")

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const handleMetadata = async (file: File) => {
    try {
      setActionLoading("metadata", file.hash, true)
      const metadata = await getFileMetadata(file.cid)
      setMetadataFile(metadata)
      setShowMetadataDialog(true)
    } catch {
      toast({ title: "Error", description: "Could not load metadata", variant: "destructive" })
    } finally {
      setActionLoading("metadata", file.hash, false)
    }
  }

  // FIX #2 — DELETE funcionando
  const handleDeleteFile = async () => {
    if (!deleteConfirmFile) return

    try {
      await removeFile(deleteConfirmFile.hash)

      onFileDeleted?.(deleteConfirmFile.hash)

      toast({
        title: "File Deleted",
        description: "The file was successfully removed.",
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Could not delete file.",
        variant: "destructive",
      })
    } finally {
      setDeleteConfirmFile(null)
    }
  }

  if (isLoading) return <FileListSkeleton />

  if (!files || files.length === 0)
    return (
      <Card className="p-16 text-center border-2 border-dashed border-muted-foreground/20 bg-muted/5">
        <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <FileIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-semibold">No Files Yet</h3>
          <p className="text-muted-foreground text-sm">Upload your first medical file to get started.</p>
        </div>
      </Card>
    )

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4">

          {files.map((file) => {
            if (!file.hash || !file.cid) return null

            const displayName = names[file.hash] || `File ${file.hash.slice(0, 8)}...`
            const activeGrants = getFileAccessGrants(file.hash).filter(
              (g) => g.expiration * 1000 > Date.now()
            )

            return (
              <Card key={file.hash} className="group relative overflow-hidden hover:shadow-lg hover:border-primary/40">
                <div className="relative p-5">
                  <div className="flex items-start gap-4">

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                    </div>

                    {/* Info section */}
                    <div className="flex-1 space-y-2">

                      {/* Name / rename */}
                      {editing === file.hash ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                            className="h-8 text-sm"
                          />
                          <Button size="sm" onClick={() => saveRename(file.hash)} className="h-8">Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="h-8">Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium truncate">{displayName}</h4>
                          <Button variant="ghost" size="sm" onClick={() => startRename(file)} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {/* Real Hash */}
                      <p className="text-[11px] font-mono text-muted-foreground truncate cursor-pointer hover:text-primary" onClick={() => copyHash(file.hash)}>
                        {file.hash}
                      </p>

                      {/* Sub info */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">

                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(file.uploadedAt)}
                        </div>

                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          <button onClick={() => copyFid(file.cid)} className="font-mono hover:text-primary">
                            {file.cid.slice(0, 10)}...
                          </button>
                        </div>

                        {activeGrants.length > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Users className="h-3 w-3" /> {activeGrants.length} active
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-1.5 pt-2">

                        <Button variant="ghost" size="sm" onClick={() => copyFid(file.cid)} className="h-8 gap-1">
                          <Copy className="h-4 w-4" />
                          <span className="text-xs">Copy</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => openFilePreview(file.cid)} className="h-8 gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs">Preview</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => downloadFromDeOSS(file.cid)} className="h-8 gap-1">
                          <Download className="h-4 w-4" />
                          <span className="text-xs">Download</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => handleMetadata(file)} className="h-8 gap-1">
                          <Info className="h-4 w-4" />
                          <span className="text-xs">Metadata</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => onManageAccess?.(file)} className="h-8 gap-1">
                          <Share2 className="h-4 w-4" />
                          <span className="text-xs">Share</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmFile(file)} className="h-8 gap-1 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              </Card>
            )
          })}

        </div>
      </div>

      {/* METADATA DIALOG */}
      <Dialog open={showMetadataDialog} onOpenChange={setShowMetadataDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Metadata</DialogTitle>
            <DialogDescription>Information from DeOSS gateway</DialogDescription>
          </DialogHeader>

          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto border">
            {metadataFile ? JSON.stringify(metadataFile, null, 2) : "No metadata available"}
          </pre>

          <Button variant="outline" onClick={() => setShowMetadataDialog(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      {deleteConfirmFile && (
        <Dialog open={!!deleteConfirmFile} onOpenChange={() => setDeleteConfirmFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Do you want to permanently delete this file?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setDeleteConfirmFile(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteFile}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </TooltipProvider>
  )
}

