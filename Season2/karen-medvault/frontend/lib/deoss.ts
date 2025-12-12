// medvault/lib/deoss.ts

const DEOSS_GATEWAY = "http://127.0.0.1:8080"

const DEOSS_CONFIG = {
  territory: "MedVault",
  account: "cXjYfiR6LZQsfxFpL5grUMnagj8edvvCN7aiA9z3N53PkBtAj",
  message: "MedVaultSign",
  signature:
    "0x880da2c78fb7f8793b82db6c411199e92c9d043da2ee76cd7aaaaac7a70f627f1bcc6ff7e02cf79d4f9b3301c6ee9599b1511d9bbec2cb4b3941a12296427787",
}

/* =====================================================
   UPLOAD
===================================================== */
export async function uploadToDeOSS(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${DEOSS_GATEWAY}/file`, {
    method: "PUT",
    headers: {
      Territory: DEOSS_CONFIG.territory,
      Account: DEOSS_CONFIG.account,
      Message: DEOSS_CONFIG.message,
      Signature: DEOSS_CONFIG.signature,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  const data = await response.json()

  if (!data?.data?.fid) {
    console.error("[DeOSS] Resposta inválida:", data)
    throw new Error("DeOSS não retornou FID")
  }

  return data.data.fid
}

/* =====================================================
   DOWNLOAD  ✅ EXPORT EXISTE
===================================================== */
export async function downloadFromDeOSS(
  fid: string,
  filename?: string,
): Promise<void> {
  const response = await fetch(
    `${DEOSS_GATEWAY}/file/download/${fid}`,
  )

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename || `medvault_${fid.slice(0, 8)}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/* =====================================================
   PREVIEW
===================================================== */
export function openFilePreview(fid: string) {
  window.open(`${DEOSS_GATEWAY}/file/open/${fid}`, "_blank")
}

/* =====================================================
   METADATA
===================================================== */
export async function getFileMetadata(fid: string) {
  const response = await fetch(
    `${DEOSS_GATEWAY}/file/metadata/${fid}`,
  )

  if (!response.ok) {
    throw new Error(`Metadata failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data || data
}

/* =====================================================
   DELETE
===================================================== */
export async function deleteFileFromDeOSS(fid: string): Promise<void> {
  const response = await fetch(
    `${DEOSS_GATEWAY}/file/${fid}`,
    {
      method: "DELETE",
      headers: {
        Account: DEOSS_CONFIG.account,
        Message: DEOSS_CONFIG.message,
        Signature: DEOSS_CONFIG.signature,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`)
  }
}

