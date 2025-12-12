"use client"

import { useState, useEffect } from "react"

export function useFileNames() {
  const [names, setNames] = useState<Record<string, string>>({})

  // Carregar nomes salvos no navegador
  useEffect(() => {
    const stored = localStorage.getItem("medvault_file_names")
    if (stored) setNames(JSON.parse(stored))
  }, [])

  // Função para renomear um arquivo (apenas no front-end)
  const renameFile = (fileHash: string, newName: string) => {
    const updated = { ...names, [fileHash]: newName }
    setNames(updated)
    localStorage.setItem("medvault_file_names", JSON.stringify(updated))
  }

  return { names, renameFile }
}

