import DemoBlockchain from "./components/DemoBlockchain";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Network, Cpu, Github, Mail } from "lucide-react";
import Dashboard from "./components/Dashboard";


// Wrapper para seções com animação de entrada
const AnimatedSection = ({ children, id, className = "" }) => {
  return (
    <motion.section
      id={id}
      className={`py-20 sm:py-24 px-6 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

// Card de Funcionalidade reutilizável
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-slate-900 p-6 rounded-2xl shadow-lg text-center border border-slate-800 transition-all duration-300 hover:border-teal-400 hover:shadow-teal-500/20"
    whileHover={{ y: -8, scale: 1.03 }}
  >
    {icon}
    <h4 className="font-semibold text-xl mt-4 mb-2 text-slate-100">{title}</h4>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

// Componente principal da aplicação
export default function App() {
  const navLinks = [
    { href: "#about", text: "Sobre" },
    { href: "#how", text: "Como Funciona" },
    { href: "#demo", text: "Demo" },
    { href: "#team", text: "Equipe" },
    { href: "#contact", text: "Contato" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-teal-400/30">
      {/* Background com gradiente */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.3),rgba(255,255,255,0))]"></div>
      
      {/* Navbar */}
      <motion.nav 
        className="sticky top-0 z-50 flex justify-between items-center p-4 md:px-8 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <a href="#" className="flex items-center gap-2">
          <img src="/logo_cortada.png" alt="TrustIoT Logo" className="h-12 w-auto" />
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-slate-300 hover:text-teal-400 transition-colors duration-300">
              {link.text}
            </a>
          ))}
        </div>
        
        {/* Menu Hamburguer para mobile (placeholder) */}
        <button className="md:hidden p-2 rounded-md hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </motion.nav>

      {/* Hero Section */}
      <section className="text-center pt-24 pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
        >
          <img src="/logo_cortada.png" alt="TrustIoT Logo" className="mx-auto h-32 md:h-40 w-auto drop-shadow-[0_0_20px_theme(colors.teal.500)]" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold my-6 bg-gradient-to-r from-slate-100 to-teal-400 bg-clip-text text-transparent leading-tight pb-4"
        >
          Segurança e Integridade para o Futuro da IoT
        </motion.h1>
        
        <motion.p 
          className="text-slate-400 text-lg max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          Uma aplicação descentralizada que garante a autenticidade dos dados de sensores usando Blockchain e a CESS Network.
        </motion.p>

        <motion.a 
          href="#demo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <button className="mt-10 bg-teal-400 text-slate-950 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:bg-teal-300 hover:scale-105 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/40">
            Ver em Ação
          </button>
        </motion.a>
      </section>

      {/* About */}
      <AnimatedSection id="about" className="bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-teal-400">Sobre o Projeto</h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            O TrustIoT é uma solução inovadora que utiliza Blockchain e armazenamento descentralizado para garantir a integridade dos dados de sensores de Internet das Coisas (IoT). O projeto integra segurança, transparência e resiliência em uma arquitetura confiável.
          </p>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection id="how">
        <h2 className="text-center text-3xl font-bold mb-12 text-teal-400">Como Funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Cpu size={40} className="mx-auto text-teal-400" />}
            title="Coleta IoT"
            description="Sensores reais ou simulados enviam dados ao gateway TrustIoT de forma segura."
          />
          <FeatureCard 
            icon={<Network size={40} className="mx-auto text-teal-400" />}
            title="CESS Network"
            description="Os dados são armazenados de forma descentralizada, garantindo redundância e segurança."
          />
          <FeatureCard 
            icon={<Shield size={40} className="mx-auto text-teal-400" />}
            title="Prova em Blockchain"
            description="O hash dos dados é registrado em smart contract para uma prova de existência imutável."
          />
        </div>
      </AnimatedSection>

     {/* Demo */}
      <AnimatedSection id="demo" className="bg-slate-900/50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-teal-400">Demonstração Blockchain</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
    Interaja com o contrato TrustIoT implantado na rede Sepolia — registre e verifique dispositivos IoT.
  </p>

  <DemoBlockchain />
      </AnimatedSection>

      {/* Team */}
      <AnimatedSection id="team">
        <h2 className="text-center text-3xl font-bold mb-10 text-teal-400">Equipe</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <motion.div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold text-slate-100">Nicolas Carregosa de Jesus</h3>
            <p className="text-slate-400">Engenharia de Redes - Universidade de Brasília</p>
          </motion.div>
          <motion.div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold text-slate-100">Profa. Cláudia Jacy Barenco Abbas</h3>
            <p className="text-slate-400">Orientadora - Projetos Transversais I</p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 py-10 text-center border-t border-slate-800">
        <div className="flex justify-center items-center gap-6 mb-6">
          <a
            href="https://github.com/nicjesus/TrustIoT_site"
            className="text-slate-400 hover:text-teal-400 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={28} />
          </a>
          <a
            href="mailto:241024535@aluno.unb.br"
            className="text-slate-400 hover:text-teal-400 transition-colors"
          >
            <Mail size={28} />
          </a>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} TrustIoT - Projeto Transversal de Redes - UnB
        </p>
      </footer>
    </div>
  );
}



