import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Hero
  "hero.tag": { en: "Multi-Agent AI Orchestration", pt: "Orquestração de IA Multi-Agente" },
  "hero.title1": { en: "The Hive Mind", pt: "A Mente de Colmeia" },
  "hero.title2": { en: "has Awakened.", pt: "Despertou." },
  "hero.sub": {
    en: "Beyond simple automation. We orchestrate a swarm of specialized AI agents to transform your business processes into a high-performance digital organism.",
    pt: "Além da automação simples. Orquestramos um enxame de agentes de IA especializados para transformar seus processos de negócios em um organismo digital de alto desempenho.",
  },
  "hero.cta": { en: "Automatizar", pt: "Automatizar" },

  // Hive Analogy
  "analogy.tag": { en: "The Philosophy & Analogy", pt: "A Filosofia & Analogia" },
  "analogy.title": { en: "A Symbiosis of Intelligence", pt: "Uma Simbiose de Inteligência" },
  "analogy.queen.label": { en: "The Queen", pt: "A Rainha" },
  "analogy.queen.title": { en: "The Master Orchestrator", pt: "A Orquestradora Mestre" },
  "analogy.queen.desc": {
    en: "In our systems, the Queen represents the central AI Orchestrator. She acts as the brain of the operation, delegating specialized tasks to various agents, validating outputs, and ensuring the swarm is synchronized toward a single strategic goal.",
    pt: "Em nossos sistemas, a Rainha representa o Orquestrador Central de IA. Ela age como o cérebro da operação, delegando tarefas especializadas a vários agentes, validando resultados e garantindo que o enxame esteja sincronizado em direção a um único objetivo estratégico.",
  },
  "analogy.workers.label": { en: "The Workers", pt: "Os Trabalhadores" },
  "analogy.workers.title": { en: "Specialized Agents", pt: "Agentes Especializados" },
  "analogy.workers.desc": {
    en: "Autonomous AI Agents specialized in atomic tasks. One worker handles Python scripting, another manages data extraction, and a third orchestrates API integrations. They are independent yet fundamentally connected to the whole.",
    pt: "Agentes de IA autônomos especializados em tarefas atômicas. Um trabalhador lida com scripts Python, outro gerencia extração de dados e um terceiro orquestra integrações de API. São independentes, mas fundamentalmente conectados ao todo.",
  },
  "analogy.hive.label": { en: "The Hive", pt: "A Colmeia" },
  "analogy.hive.title": { en: "The Modular Ecosystem", pt: "O Ecossistema Modular" },
  "analogy.hive.desc": {
    en: "The Hive is the infrastructure we build for our clients—a modular, scalable, and resilient environment where every cell is an integrated solution working in perfect synchrony.",
    pt: "A Colmeia é a infraestrutura que construímos para nossos clientes — um ambiente modular, escalável e resiliente onde cada célula é uma solução integrada trabalhando em perfeita sincronia.",
  },

  // Orchestrator
  "orch.tag": { en: "The Queen Protocol", pt: "O Protocolo da Rainha" },
  "orch.title1": { en: "Supreme Orchestration.", pt: "Orquestração Suprema." },
  "orch.title2": { en: "Synchronized Swarm.", pt: "Enxame Sincronizado." },
  "orch.body": {
    en: "While worker agents—specialized in Python, data extraction, or frontend code—execute tasks with superhuman speed, our Orchestrator AI acts as the central nervous system. It manages priorities, validates results, and ensures the swarm works toward a single strategic objective. Just like a hive, the future belongs to AI agents working in perfect, orchestrated harmony.",
    pt: "Enquanto agentes operários—especializados em Python, extração de dados ou código frontend—executam tarefas com velocidade sobre-humana, nossa IA Orquestradora atua como o sistema nervoso central. Ela gerencia prioridades, valida resultados e garante que o enxame trabalhe em direção a um único objetivo estratégico. Assim como uma colmeia, o futuro pertence a agentes de IA trabalhando em perfeita harmonia orquestrada.",
  },

  // Pillars (The Swarm Principles)
  "pillars.tag": { en: "The Swarm Principles", pt: "Os Princípios do Enxame" },
  "pillars.title": { en: "Four Pillars of the Hive", pt: "Quatro Pilares da Colmeia" },
  "pillar1.category": { en: "Modular Architecture", pt: "Arquitetura Modular" },
  "pillar1.title": { en: "Modular Cells", pt: "Células Modulares" },
  "pillar1.desc": {
    en: "Our automations are not monolithic blocks, but modular ecosystems. We develop independent 'Logic Cells' that integrate like Lego pieces, enabling total agility in scaling and intelligence reuse across new projects.",
    pt: "Nossas automações não são blocos monolíticos, mas ecossistemas modulares. Desenvolvemos 'Células de Lógica' independentes que se integram como peças de Lego, permitindo agilidade total na escala e reaproveitamento de inteligência em novos projetos.",
  },
  "pillar2.category": { en: "Divide & Conquer", pt: "Dividir & Conquistar" },
  "pillar2.title": { en: "Swarm Subdivision", pt: "Subdivisão de Enxame" },
  "pillar2.desc": {
    en: "Complex projects demand surgical precision. By decomposing massive challenges into atomic micro-tasks, we ensure each AI Agent operates at peak efficiency—drastically reducing error margins and making maintenance as simple as replacing a single piece.",
    pt: "Projetos complexos exigem precisão cirúrgica. Decompondo desafios massivos em micro-tarefas atômicas, garantimos que cada Agente de IA opere em sua zona de máxima eficiência, reduzindo drasticamente a margem de erro e tornando a manutenção tão simples quanto substituir uma peça específica.",
  },
  "pillar3.category": { en: "Total Validation", pt: "Validação Total" },
  "pillar3.title": { en: "Hive Integrity", pt: "Integridade da Colmeia" },
  "pillar3.desc": {
    en: "Resilience through verification. Every line of Python code and every interaction between agents undergoes rigorous unit and integration testing protocols. We ensure the Hive operates in perfect synchrony—from individual agent to complete organism.",
    pt: "Resiliência através da verificação. Cada linha de código Python e cada interação entre agentes passa por protocolos rigorosos de testes unitários e de integração. Garantimos que a 'Colmeia' funcione em perfeita sincronia, do agente individual ao organismo completo.",
  },
  "pillar4.category": { en: "Proactive Defense", pt: "Defesa Proativa" },
  "pillar4.title": { en: "Honeycomb Fortress", pt: "Fortaleza de Dados" },
  "pillar4.desc": {
    en: "Security is not a detail—it's our foundation. In a world of connected agents, we protect your data against modern vulnerabilities, from Prompt Injections to confidential data leaks. We apply layers of governance and encryption to ensure your intelligence remains private.",
    pt: "Segurança não é um detalhe, é nosso alicerce. Em um mundo de agentes conectados, protegemos seus dados contra vulnerabilidades modernas, de Prompt Injections a vazamentos confidenciais. Aplicamos camadas de governança e criptografia para garantir que sua inteligência permaneça privada.",
  },

  // Philosophy
  "phil.tag": { en: "The Hive Philosophy", pt: "A Filosofia da Colmeia" },
  "phil.title1": { en: "Tool-Agnostic.", pt: "Agnósticos em Ferramentas." },
  "phil.title2": { en: "Solution-Obsessed.", pt: "Obcecados por Soluções." },
  "phil.body": {
    en: "We are not tied to a single platform. Whether it's N8N, Python, OpenAI, or custom LLMs, our repertoire is vast and ever-evolving. We select the best-in-class tools for your specific demand, ensuring your infrastructure is scalable, cost-effective, and future-proof.",
    pt: "Não estamos presos a uma única plataforma. Seja N8N, Python, OpenAI ou LLMs customizados, nosso repertório é vasto e está em constante evolução. Selecionamos as melhores ferramentas para sua demanda específica, garantindo que sua infraestrutura seja escalável, econômica e à prova de futuro.",
  },
  "phil.extension": {
    en: "We are not just programmers—we are architects of complete digital ecosystems. Our mastery of AI allows us to deliver Branding, Marketing, and Web Development with a speed and precision impossible in traditional models.",
    pt: "Não somos apenas programadores—somos arquitetos de ecossistemas digitais completos. Nossa maestria em IA nos permite entregar Branding, Marketing e Desenvolvimento Web com velocidade e precisão impossíveis em modelos tradicionais.",
  },


  "cta.title1": { en: "Ready to unleash", pt: "Pronto para liberar" },
  "cta.title2": { en: "the swarm?", pt: "o enxame?" },
  "cta.sub": {
    en: "Join the revolution of coordinated intelligence and scale your operation with the Hive Mind.",
    pt: "Junte-se à revolução da inteligência coordenada e escale sua operação com a Hive Mind.",
  },
  "cta.button": { en: "Automatizar", pt: "Automatizar" },

  // Solutions (Practical Swarms)
  "sol.tag": { en: "Practical Swarms", pt: "Enxames na Prática" },
  "sol.title": { en: "Real Solutions. Measurable Results.", pt: "Soluções Reais. Resultados Mensuráveis." },
  "sol.subtitle": {
    en: "See how our orchestrated AI agents and Python-powered data pipelines solve universal business challenges.",
    pt: "Veja como nossos agentes de IA orquestrados e pipelines de dados em Python resolvem desafios universais dos negócios.",
  },
  "sol.layer1": { en: "Core Intelligence", pt: "Inteligência Core" },
  "sol.layer2": { en: "AI-Powered Extension", pt: "Extensão Potenciada por IA" },

  "sol.card1.title": { en: "Autonomous Sales & Lead Qualification", pt: "Vendas e Qualificação Autónoma de Leads" },
  "sol.card1.desc": {
    en: "AI agents that qualify leads in the CRM, schedule meetings and process orders autonomously—without human intervention.",
    pt: "Agentes de IA que qualificam leads no CRM, agendam reuniões e processam pedidos de forma autónoma, sem intervenção humana.",
  },
  "sol.card2.title": { en: "Demand Forecasting with ML", pt: "Previsão de Demanda com ML" },
  "sol.card2.desc": {
    en: "Python algorithms trained on your sales history to predict future inventory needs, eliminating waste and stockouts.",
    pt: "Algoritmos Python treinados com seu histórico de vendas para prever necessidades futuras de estoque, eliminando desperdícios.",
  },
  "sol.card3.title": { en: "Mass Document Processing", pt: "Processamento em Massa de Documentos" },
  "sol.card3.desc": {
    en: "AI that reads invoices, contracts and receipts at scale, extracts critical data and inserts it directly into ERP or spreadsheets.",
    pt: "IA que lê faturas, contratos e recibos em massa, extrai dados críticos e os insere automaticamente em ERPs ou planilhas.",
  },
  "sol.card4.title": { en: "Swarm Operations & Intelligence Reports", pt: "Operações em Enxame e Relatórios de Inteligência" },
  "sol.card4.desc": {
    en: "A hive of agents where one researches market trends, another drafts reports, and a third sends strategic alerts to leadership.",
    pt: "Uma colmeia de agentes onde um pesquisa tendências, outro redige relatórios e um terceiro envia alertas estratégicos à diretoria.",
  },
  "sol.card5.title": { en: "360° Decision Dashboards", pt: "Dashboards de Decisão 360°" },
  "sol.card5.desc": {
    en: "Real-time dashboards that consolidate marketing, finance and operations data for a complete view of your business performance.",
    pt: "Dashboards em tempo real que consolidam dados de marketing, finanças e operações para uma visão completa do desempenho.",
  },
  "sol.card6.title": { en: "Customer Sentiment Analysis", pt: "Análise de Sentimento de Clientes" },
  "sol.card6.desc": {
    en: "NLP pipelines that process thousands of customer feedbacks to instantly identify friction points and improvement opportunities.",
    pt: "Pipelines de NLP que processam milhares de feedbacks de clientes para identificar rapidamente pontos de atrito e oportunidades.",
  },

  // Impact Metrics
  "impact.tag": { en: "Expected Impact", pt: "Impacto Esperado" },
  "impact.metric1": { en: "Operational Efficiency Gained", pt: "de Eficiência Operacional Conquistada" },
  "impact.metric2": { en: "Faster Data-Driven Decisions", pt: "Decisões Baseadas em Dados mais Rápidas" },
  "impact.metric3": { en: "Human Error in Automated Flows", pt: "Erro Humano em Fluxos Automatizados" },

  // Footer
  "footer": {
    en: "© 2026 Hive Mind · Multi-Agent AI Orchestration",
    pt: "© 2026 Hive Mind · Orquestração de IA Multi-Agente",
  },

  // Sidebar
  "nav.hive": { en: "The Hive", pt: "A Colmeia" },
  "nav.analogy": { en: "Intelligence", pt: "Inteligência" },
  "nav.orchestrator": { en: "Orchestrator", pt: "Orquestrador" },
  "nav.expertise": { en: "Expertise", pt: "Expertise" },
  "nav.solutions": { en: "Solutions", pt: "Soluções" },
  "nav.philosophy": { en: "Philosophy", pt: "Filosofia" },
  "nav.contact": { en: "Contact", pt: "Contato" },
};

const detectLanguage = (): Language => {
  if (typeof navigator === "undefined") return "en";
  const lang = (
    navigator.language ||
    (navigator.languages && navigator.languages[0]) ||
    "en"
  ).toLowerCase();
  return lang.startsWith("pt") ? "pt" : "en";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(detectLanguage);

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
