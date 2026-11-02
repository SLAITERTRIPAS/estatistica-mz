export interface BudgetItem {
  category: string;
  item: string;
  valueUSD: number;
  valueMZN: number;
  desc: string;
}

export interface RiskItem {
  id: string;
  title: string;
  impact: string;
  mitigation: string;
}

export interface KPIItem {
  value: string;
  title: string;
  desc: string;
}

export interface TimelineItem {
  phase: string;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
}

export const budgetData: BudgetItem[] = [
  { 
    category: '1. Infraestrutura Tecnológica', 
    item: 'Servidores, Contêineres e Segurança', 
    valueUSD: 25000, 
    valueMZN: 1625000,
    desc: 'Servidores em nuvem (Azure/AWS), Contêineres e orquestração (Docker/Kubernetes), Segurança e proteção de dados (TLS/SSL, autenticação multifator).' 
  },
  { 
    category: '2. Desenvolvimento do Sistema', 
    item: 'Salários dos Programadores, API e Banco de Dados', 
    valueUSD: 40000, 
    valueMZN: 2600000,
    desc: 'Salários e honorários da equipa de desenvolvimento técnico, Programação backend (Node.js), Interfaces web responsivas, APIs REST/GraphQL e modelagem PostgreSQL.' 
  },
  { 
    category: '3. Capacitação e Formação', 
    item: 'Treinamento, Workshops e Manuais', 
    valueUSD: 25000, 
    valueMZN: 1625000,
    desc: 'Treinamento de técnicos e gestores das IES, Workshops regionais e provinciais, Produção de manuais e guias de utilização.' 
  },
  { 
    category: '4. Manutenção e Suporte', 
    item: 'Atualizações e Monitoramento de Segurança', 
    valueUSD: 20000, 
    valueMZN: 1300000,
    desc: 'Atualizações periódicas de software, Monitoramento de desempenho e segurança, Suporte técnico contínuo para instituições.' 
  },
  { 
    category: '5. Expansão e Inovação', 
    item: 'Inteligência Artificial, Mobilidade e Inclusão rústica', 
    valueUSD: 20000, 
    valueMZN: 1300000,
    desc: 'Integração futura com todo o sistema de ensino (primário, secundário e superior), Implementação de inteligência artificial e relatórios preditivos, Inclusão digital em zonas rurais e suporte multilingue.' 
  }
];

export const totalBudgetUSD = 89500;
export const totalBudgetMZN = 5817500;

export const riskData: RiskItem[] = [
  {
    id: 'Risco A',
    title: 'Vazamento de Dados ou Modificação Não Autorizada (Cibersegurança)',
    impact: 'Crítico. Quebra da integridade jurídica e perda de confiabilidade nas estatísticas nacionais.',
    mitigation: 'Todo o tráfego é blindado por HTTPS/TLS 1.3 ponta-a-ponta. Credenciais de utilizadores utilizam criptografia forte de hashing. Implementação de Row Level Security (RLS) no PostgreSQL, restringindo acessos unicamente aos perfis autenticados. Cópias de segurança (backups automáticos criptografados) são guardadas em nuvem de forma redundante e assíncrona diariamente.'
  },
  {
    id: 'Risco B',
    title: 'Sobrecarga dos Servidores por Picos de Submissão Simultânea',
    impact: 'Alto. Queda do serviço ou lentidão acentuada na plataforma nas vésperas das datas limites de encerramento de ciclos.',
    mitigation: 'A arquitetura de servidores foi montada utilizando contêineres Docker orquestrados em ambiente de escalabilidade vertical automática. O banco de dados PostgreSQL possui cache inteligente e rotinas de indexação otimizadas que eliminam o gargalo de concorrência. Foi definido um limite de taxa (rate-limiting) na API backend para evitar ataques de negação de serviço (DDoS).'
  },
  {
    id: 'Risco C',
    title: 'Instabilidade ou Queda na Conexão à Internet em Delegações Rurais',
    impact: 'Alto. Incapacidade de preenchimento ou perda de dados digitados por delegações em regiões com baixa cobertura de telecomunicação.',
    mitigation: 'O sistema incorpora tecnologias de Progressive Web App (PWA), permitindo o cache de recursos estáticos no browser. Implementação de buffering local no formulário (armazenando dados rascunhados no LocalStorage do navegador), permitindo que o utilizador continue preenchendo as tabelas mesmo sem conexão ativa, realizando o envio ao servidor somente quando a rede estabilizar. Os payloads das APIs de envio de formulários são comprimidos em formato leve (JSON compactado).'
  },
  {
    id: 'Risco D',
    title: 'Perda, Vazamento ou Compromisso de Chaves de Assinatura Digital',
    impact: 'Médio-Alto. Envio de relatórios falsos utilizando assinaturas de Reitores comprometidas ou roubadas.',
    mitigation: 'Criação de um diretório seguro de revogação de chaves criptográficas sob responsabilidade direta dos administradores DNES. Para cada assinatura oficial, é exigido um segundo fator de autenticação (MFA) via código temporário enviado ao dispositivo móvel verificado do Reitor, garantindo que o portador da chave digital é legítimo.'
  },
  {
    id: 'Risco E',
    title: 'Resistência Cultural e Baixo Engajamento de Operadores das IES',
    impact: 'Médio. Incompletude de relatórios e atrasos na adoção por operadores que preferem os formulários físicos clássicos.',
    mitigation: 'Realização sistemática de workshops práticos de capacitação e fornecimento de manuais ilustrados e guias rápidos em português. O módulo integrado de Mensagens permite suporte direto e imediato entre os Pontos Focais provinciais e os operadores locais, reduzindo a curva de aprendizado da interface de usuário que foi simplificada com práticas modernas de usabilidade.'
  }
];

export const kpiData: KPIItem[] = [
  {
    value: '100%',
    title: 'Adesão das IES',
    desc: 'Métrica que mede a transição e registo de todas as IES registradas no país na plataforma digital.'
  },
  {
    value: '< 3 Minutos',
    title: 'Tempo de Consolidação',
    desc: 'Redução drástica no tempo de compilação do anuário estatístico nacional (comparado a 6 meses de processos manuais).'
  },
  {
    value: '99.9%',
    title: 'Uptime do Servidor',
    desc: 'Disponibilidade contínua da infraestrutura em nuvem, garantindo acessos em prazos finais de preenchimento.'
  },
  {
    value: '0 Erros',
    title: 'Discrepâncias de Dados',
    desc: 'Validação automática impede a inserção de incongruências matemáticas ou dados aberrantes nos quadros.'
  },
  {
    value: '100%',
    title: 'Fé Pública Auditável',
    desc: 'Totalidade de submissões oficiais confirmadas por criptografia de Assinatura Digital das Reitorias.'
  },
  {
    value: '> 350 Técnicos',
    title: 'Profissionais Treinados',
    desc: 'Quantidade de gestores provinciais, focais e acadêmicos certificados nos workshops oficiais.'
  }
];

export const timelineData: TimelineItem[] = [
  {
    phase: 'Requisitos e Modelagem',
    t1: 'Mapeamento',
    t2: '---',
    t3: '---',
    t4: '---'
  },
  {
    phase: 'Desenvolvimento de Software',
    t1: 'Modelagem',
    t2: 'Programação',
    t3: '---',
    t4: '---'
  },
  {
    phase: 'Projeto Piloto e Testes',
    t1: '---',
    t2: 'Preparação',
    t3: 'Implantação',
    t4: '---'
  },
  {
    phase: 'Workshops e Assinaturas',
    t1: '---',
    t2: '---',
    t3: 'Treinamentos',
    t4: '---'
  },
  {
    phase: 'Rollout e Consolidação',
    t1: '---',
    t2: '---',
    t3: '---',
    t4: 'Rollout Nacional'
  }
];
