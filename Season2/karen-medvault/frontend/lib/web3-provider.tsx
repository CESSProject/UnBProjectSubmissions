// lib/web3-provider.tsx (VERSÃO FINAL COM DISCONNECT)
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ethers, type BrowserProvider, type Signer, type Contract } from "ethers";
// 🚨 Assuma que estas constantes estão com o endereço CORRETO
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts"; 

// --- CONFIGURAÇÃO DA REDE TCESS ---
const TCESS_CHAIN_ID = 11330;
const TCESS_CHAIN_ID_HEX = "0x2c42"; // 11330 em hexadecimal
const TCESS_RPC = "https://testnet-rpc.cess.network/rpc";
const TCESS_EXPLORER = "https://explorer.cess.network";

// Tipagem do Contexto (Adicionando 'disconnect' e 'error')
interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  contract: Contract | null; 
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void; // <--- FUNÇÃO DISCONNECT ADICIONADA AQUI
  error: string | null; 
}

// Estendendo a interface Window para incluir o objeto ethereum do MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// --------------------------------------------------------------------------
// COMPONENTE PROVIDER
// --------------------------------------------------------------------------
export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para redefinir o estado para desconectado
  const resetWeb3State = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setIsConnected(false);
    setError(null);
  }, []);

  // --------------------------------------------------------------------------
  // NOVO: FUNÇÃO DE DESCONEXÃO
  // --------------------------------------------------------------------------
  const disconnect = useCallback(() => {
    if (window.ethereum) {
      try {
        // Tenta revogar permissões (pode não funcionar em todas as versões/browsers, mas é a melhor tentativa)
        window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      } catch (err) {
        // Ignorar erros na revogação, pois a limpeza do estado local é a prioridade
        console.warn("Falha ao tentar revogar permissões MetaMask.", err);
      }
    }
    // O essencial: limpar o estado da aplicação
    resetWeb3State();
  }, [resetWeb3State]);


  // Função centralizada para conectar, trocar a rede e instanciar o contrato
  const connect = useCallback(async (isInitialLoad = false) => {
    setError(null);
    setContract(null);

    if (typeof window.ethereum === "undefined") {
      setError("MetaMask não instalado. Por favor, instale.");
      return;
    }

    try {
      let accounts: string[];
      if (isInitialLoad) {
        // Tenta obter contas sem abrir o popup (se já conectado)
        accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) return; // Não conectado
      } else {
        // Força o popup de conexão
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      }

      if (accounts.length === 0) {
        throw new Error("Conexão rejeitada ou nenhuma conta encontrada.");
      }
      
      const injected = new ethers.BrowserProvider(window.ethereum);
      let network = await injected.getNetwork();

      // --- 2. SWITCH/ADD CHAIN LÓGICA ---
      if (network.chainId !== BigInt(TCESS_CHAIN_ID)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: TCESS_CHAIN_ID_HEX }],
          });
          // Nota: chainChanged irá disparar um reload, mas o código continua aqui
        } catch (err: any) {
          if (err.code === 4902) { 
            // Rede não existe, Adicionar
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: TCESS_CHAIN_ID_HEX,
                  chainName: "CESS EVM Testnet",
                  rpcUrls: [TCESS_RPC],
                  nativeCurrency: { name: "TCESS", symbol: "TCESS", decimals: 18, },
                  blockExplorerUrls: [TCESS_EXPLORER],
                },
              ],
            });
          } else if (err.code === 4001) {
            setError("O usuário rejeitou a troca de rede. Contrato não instanciado.");
            return;
          } else {
            throw err;
          }
        }
      }
      
      // 3. Re-instancia após a possível troca de rede
      const finalProvider = new ethers.BrowserProvider(window.ethereum);
      const finalSigner = await finalProvider.getSigner();
      const address = await finalSigner.getAddress();
      
      const currentNetwork = await finalProvider.getNetwork();

      if (currentNetwork.chainId !== BigInt(TCESS_CHAIN_ID)) {
          // A rede ainda está errada
          setContract(null); 
          setError("Conectado, mas na rede errada. Por favor, mude para CESS EVM Testnet.");
      } else {
          // 4. Instancia o Contrato na rede correta
          try {
              const instance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, finalSigner);
              setContract(instance);
          } catch (e) {
              console.error("🚨 Falha ao instanciar o Contrato (Verifique Address/ABI).", e);
              setError("Erro de Contrato: Verifique se o endereço e a ABI estão corretos.");
          }
      }

      setProvider(finalProvider);
      setSigner(finalSigner);
      setAccount(address);
      setIsConnected(true);

    } catch (err: any) {
      console.error("Erro na conexão:", err);
      if (err.code === 4001) {
        setError("Conexão rejeitada pelo usuário.");
      } else {
        setError(`Falha ao conectar: ${err.message || 'Erro desconhecido'}`);
      }
      resetWeb3State();
    }
  }, [resetWeb3State]);


  // --------------------------------------------------------------------------
  // HOOK DE EFEITO (LISTENERS)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    // 1. Tenta reconectar silenciosamente ao carregar
    connect(true); 

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed. Reconnecting...");
      if (accounts.length > 0) {
        connect(); 
      } else {
        resetWeb3State();
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log(`Chain changed to ${chainId}. Forcing refresh...`);
      // Recarregar é a maneira mais confiável para garantir que o ethers.js se reconfigure
      window.location.reload(); 
    };
    
    // 2. Adiciona os listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // 3. Limpa os listeners
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [connect, resetWeb3State]); 

  // --------------------------------------------------------------------------

  return (
    <Web3Context.Provider
      value={{ provider, signer, contract, account, isConnected, connect, disconnect, error }} // <--- DISCONNECT INCLUÍDO NO VALOR DO CONTEXTO
    >
      {children}
    </Web3Context.Provider>
  );
}

// --------------------------------------------------------------------------
// HOOK PARA CONSUMIR O CONTEXTO
// --------------------------------------------------------------------------
export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used inside Web3Provider");
  return ctx;
}
