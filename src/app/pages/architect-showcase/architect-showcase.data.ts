import { ArchitectShowcaseData } from './architect-showcase.models';
import { environment } from 'src/environments/environment';

export const ARCHITECT_SHOWCASE_DATA: ArchitectShowcaseData = {
  brand: {
    logoText: 'Cloud Engineer Portfolio', //CloudCraft Sustainability Systems
    logoTagline: 'Software Architecture and Engineering'
  },
  hero: {
    title: 'Arquitetura Cloud (AWS) e Projetos em Producao',
    subtitle: 'Lideranca tecnica para escalar produtos com seguranca, reduzir custo operacional e acelerar entregas com arquitetura moderna orientada a eventos.',
    primaryLabel: 'Ver Projetos',
    secondaryLabel: 'Falar com o Arquiteto',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Painel de arquitetura cloud e monitoramento em ambiente de producao'
  },
  architect: {
    name: 'Dayvison Vicente',
    title: 'Arquiteto de Software e Especialista em AWS/Cloud',
    bio: 'Mais de 15 anos em engenharia de software, liderando times para construir plataformas resilientes, seguras e com foco em resultado de negocio.',
    photoUrl: `${environment.assetsBaseUrl}/assest/cmo_t_7.jpg`,
    highlights: [
      'Arquitetura orientada a eventos',
      'Governanca e seguranca cloud',
      'FinOps e otimizacao de custos',
      'Observabilidade ponta a ponta'
    ]
  },
  metrics: [
    { label: 'Anos de experiencia', value: '15+' },
    { label: 'Especialidade principal', value: 'AWS Cloud' },
    { label: 'Modelo de arquitetura', value: 'Serverless' },
    { label: 'Disciplina financeira', value: 'FinOps' },
    { label: 'Pilar tecnico', value: 'Seguranca' },
    { label: 'Objetivo operacional', value: 'Alta disponibilidade' }
  ],
  logos: ['SaaS', 'Marketplace', 'HealthTech', 'EdTech', 'FinTech', 'Logistica', 'Capital Markets & Structured Products Expertise', 'Payments'],
  services: [
    {
      title: 'Especialista em Cloud (AWS)',
      description: 'Arquitetura escalavel, segura e observavel para sistemas criticos, com desenhos tecnicos prontos para crescimento real de trafego.',
      bullets: [
        'Landing zones, IAM e rede com boas praticas',
        'Escalabilidade horizontal com servicos gerenciados',
        'Monitoracao, logs e alertas acionaveis',
        'Seguranca by design desde o inicio'
      ],
      iconKey: 'cloud',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'E-mails profissionais e envio de e-mails',
      description: 'Implantacao de e-mail profissional no dominio da empresa e trilhas transacionais para operacao com alta entregabilidade.',
      bullets: [
        'E-mail corporativo com dominio proprio',
        'Fluxos de boas-vindas, recuperacao de senha e recibos',
        'SPF, DKIM e DMARC para reputacao do dominio',
        'Monitoramento de bounce, abertura e cliques'
      ],
      iconKey: 'email',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Notificacoes',
      description: 'Comunicacao omnichannel com rastreabilidade completa para eventos de negocio e jornada do cliente.',
      bullets: [
        'Canais por e-mail, push e SMS/WhatsApp',
        'Filas e eventos para resiliencia no envio',
        'Reprocessamento seguro e trilha de auditoria',
        'Dashboards de entrega e latencia por canal'
      ],
      iconKey: 'notification',
      imageUrl: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Integracao de pagamentos',
      description: 'Implementacao de pagamentos com foco em conversao, seguranca e conciliacao confiavel para operacoes digitais.',
      bullets: [
        'Checkout com boleto, Pix, cartao de credito e Bitcoin',
        'Webhooks assinados e processamento idempotente',
        'Consolidacao de status e conciliacao financeira',
        'Camadas antifraude e compliance de dados'
      ],
      iconKey: 'payment',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Servicos de IA atualizados',
      description: 'Aplicacao pratica de IA para atendimento, automacao e ganho de produtividade com integracao aos sistemas existentes.',
      bullets: [
        'Chatbots e assistentes para atendimento 24/7',
        'RAG e knowledge base para respostas contextualizadas',
        'Automacao de processos internos e operacionais',
        'Integracao com CRM, ERP e ferramentas de suporte'
      ],
      iconKey: 'ai',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Reducao de custo e migracao para Serverless',
      description: 'Evolucao de infraestrutura local para AWS Lambda e servicos gerenciados com foco direto em custo, elasticidade e time-to-market.',
      bullets: [
        'Mapeamento de cargas e estrategia de migracao',
        'Arquitetura orientada a eventos para reduzir acoplamento',
        'Aproveitamento de beneficios free/baixo custo quando aplicavel (AWS Free Tier)',
        'Governanca de custo continuo com FinOps'
      ],
      iconKey: 'serverless',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
    }
  ],
  projects: [
    {
      name: 'Plataforma de Doacoes de Alta Escala',
      summary: 'Ecossistema de arrecadacao com checkout multimeios, notificacoes em tempo real e painel operacional.',
      stack: ['Angular', 'Node.js', 'AWS Lambda', 'API Gateway', 'DynamoDB'],
      highlights: ['Latencia media abaixo de 200ms', 'Arquitetura event-driven', 'Observabilidade centralizada'],
      links: [
        { label: 'Ver caso', url: '#projetos' },
        { label: 'Arquitetura tecnica', url: '#servicos' }
      ]
    },
    {
      name: 'Motor de Notificacoes Omnichannel',
      summary: 'Pipeline unificado para envios transacionais em multiplos canais com retries e rastreabilidade.',
      stack: ['TypeScript', 'SQS', 'SNS', 'SES', 'CloudWatch'],
      highlights: ['99.9% de disponibilidade', 'Retentativas inteligentes', 'Auditoria de ponta a ponta'],
      links: [
        { label: 'Ver projeto', url: '#projetos' },
        { label: 'Solicitar demo', url: '#contato' }
      ]
    },
    {
      name: 'Assistente IA para Operacoes',
      summary: 'Assistente conectado a base de conhecimento para suporte tecnico e automacao de tarefas repetitivas.',
      stack: ['Angular', 'API REST', 'Vector Search', 'Pipelines de IA'],
      highlights: ['Atendimento 24/7', 'RAG com contexto do negocio', 'Integracao com sistemas legados'],
      links: [
        { label: 'Ver fluxos', url: '#depoimentos' },
        { label: 'Falar com especialista', url: '#contato' }
      ]
    }
  ],
  testimonials: [
    {
      quote: 'Nossa migracao para serverless reduziu custos e eliminou gargalos de deploy. A equipe entregou arquitetura e execucao com alto nivel tecnico.',
      name: 'Mariana Costa',
      role: 'CTO',
      company: 'Nexa Commerce'
    },
    {
      quote: 'A integracao de pagamentos com webhooks confiaveis resolveu problemas antigos de conciliacao e melhorou a experiencia no checkout.',
      name: 'Eduardo Martins',
      role: 'Head de Produto',
      company: 'Pulse Fintech'
    },
    {
      quote: 'O projeto de notificacoes e IA elevou nosso atendimento e trouxe visibilidade operacional real com metricas acionaveis.',
      name: 'Carla Ribeiro',
      role: 'Diretora de Operacoes',
      company: 'Orbit Health'
    }
  ],
  cta: {
    primaryLabel: 'Agendar conversa',
    secondaryLabel: 'Solicitar orcamento',
    note: 'Ver portfolio completo'
  }
};
