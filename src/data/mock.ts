import type { Paciente, Usuario, MetricaMensal, Notificacao } from '@/types';

export const usuarioAtual: Usuario = {
  id: '1',
  nome: 'Fernando Silva',
  email: 'fernando@qualitylife.com.br',
  role: 'Admin',
  avatar: undefined,
};

export const notificacoes: Notificacao[] = [
  {
    id: '1',
    titulo: 'Novo paciente cadastrado',
    mensagem: 'Maria Oliveira foi cadastrada com sucesso.',
    data: '2024-01-15T10:30:00',
    lida: false,
  },
  {
    id: '2',
    titulo: 'Plano vencendo',
    mensagem: 'O plano de João Santos vence em 7 dias.',
    data: '2024-01-14T16:45:00',
    lida: false,
  },
  {
    id: '3',
    titulo: 'Bônus atualizado',
    mensagem: 'Seu bônus mensal foi creditado.',
    data: '2024-01-01T09:00:00',
    lida: true,
  },
];

export const metricasMensais: MetricaMensal[] = [
  { mes: 'Ago', vidasAtivas: 8, custoTotal: 239.20 },
  { mes: 'Set', vidasAtivas: 12, custoTotal: 358.80 },
  { mes: 'Out', vidasAtivas: 10, custoTotal: 299.00 },
  { mes: 'Nov', vidasAtivas: 15, custoTotal: 448.50 },
  { mes: 'Dez', vidasAtivas: 13, custoTotal: 388.70 },
  { mes: 'Jan', vidasAtivas: 11, custoTotal: 328.90 },
];

export const pacientes: Paciente[] = [
  {
    id: '1',
    nome: 'Maria Oliveira Santos',
    cpf: '123.456.789-00',
    celular: '(11) 98765-4321',
    email: 'maria@email.com',
    dataNascimento: '1985-03-15',
    sexo: 'F',
    endereco: {
      cep: '01001-000',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    diagnostico: 'Paciente com ansiedade generalizada',
    tipoConsulta: 'Psicólogo',
    status: 'ATIVO',
    plano: {
      tipo: 'Telemedicina Individual',
      formaPagamento: 'Cartão',
      valor: 29.90,
      funeral: false,
      telepsicologia: true,
      presencial: false,
    },
    dataCadastro: '2023-12-01',
    dataAtivacao: '2023-12-05',
    dataVencimento: '2024-02-05',
  },
  {
    id: '2',
    nome: 'João Pedro Silva',
    cpf: '987.654.321-00',
    celular: '(11) 91234-5678',
    email: 'joao@email.com',
    dataNascimento: '1990-07-22',
    sexo: 'M',
    endereco: {
      cep: '02002-000',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    diagnostico: 'Consulta de rotina',
    tipoConsulta: 'Clínico Geral',
    status: 'ATIVO',
    plano: {
      tipo: 'Tele+Presencial Familiar',
      formaPagamento: 'Cartão',
      valor: 64.90,
      funeral: true,
      telepsicologia: false,
      presencial: true,
    },
    dataCadastro: '2023-11-15',
    dataAtivacao: '2023-11-20',
    dataVencimento: '2024-01-28',
  },
  {
    id: '3',
    nome: 'Ana Carolina Lima',
    cpf: '456.789.123-00',
    celular: '(11) 94567-8901',
    status: 'PRÉ-CADASTRO',
    diagnostico: 'Primeira avaliação psiquiátrica',
    tipoConsulta: 'Psiquiatra',
    dataCadastro: '2024-01-10',
  },
  {
    id: '4',
    nome: 'Carlos Eduardo Mendes',
    cpf: '789.123.456-00',
    celular: '(11) 97890-1234',
    email: 'carlos@email.com',
    dataNascimento: '1978-11-30',
    sexo: 'M',
    status: 'PENDENTE ATIVAÇÃO',
    plano: {
      tipo: 'Telemedicina Individual',
      formaPagamento: 'Boleto',
      valor: 34.90,
      funeral: false,
      telepsicologia: false,
      presencial: false,
    },
    dataCadastro: '2024-01-08',
    dataVencimento: '2024-01-15',
  },
  {
    id: '5',
    nome: 'Fernanda Costa',
    cpf: '321.654.987-00',
    celular: '(11) 93456-7890',
    status: 'INCOMPLETO',
    diagnostico: 'Acompanhamento nutricional',
    tipoConsulta: 'Nutricionista',
    dataCadastro: '2024-01-05',
  },
  {
    id: '6',
    nome: 'Roberto Almeida',
    cpf: '654.987.321-00',
    celular: '(11) 96789-0123',
    email: 'roberto@email.com',
    dataNascimento: '1965-05-10',
    sexo: 'M',
    endereco: {
      cep: '03003-000',
      logradouro: 'Rua Augusta',
      numero: '500',
      complemento: 'Sala 12',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    status: 'COMPLETO',
    dataCadastro: '2024-01-03',
  },
  {
    id: '7',
    nome: 'Patrícia Souza',
    cpf: '147.258.369-00',
    celular: '(11) 99012-3456',
    email: 'patricia@email.com',
    dataNascimento: '1988-09-25',
    sexo: 'F',
    endereco: {
      cep: '04004-000',
      logradouro: 'Rua Oscar Freire',
      numero: '800',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    status: 'VENCIDO',
    plano: {
      tipo: 'Telemedicina Familiar',
      formaPagamento: 'Boleto',
      valor: 63.90,
      funeral: true,
      telepsicologia: true,
      presencial: false,
    },
    dataCadastro: '2023-08-01',
    dataAtivacao: '2023-08-05',
    dataVencimento: '2023-11-05',
  },
  {
    id: '8',
    nome: 'Lucas Ferreira',
    cpf: '369.258.147-00',
    celular: '(11) 92345-6789',
    status: 'CANCELADO',
    dataCadastro: '2023-09-10',
    dataAtivacao: '2023-09-15',
  },
  {
    id: '9',
    nome: 'Mariana Rodrigues',
    cpf: '852.741.963-00',
    celular: '(11) 95678-9012',
    email: 'mariana@email.com',
    dataNascimento: '1995-12-08',
    sexo: 'F',
    endereco: {
      cep: '05005-000',
      logradouro: 'Avenida Faria Lima',
      numero: '3000',
      bairro: 'Itaim Bibi',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    diagnostico: 'Terapia cognitivo-comportamental',
    tipoConsulta: 'Psicólogo',
    status: 'ATIVO',
    plano: {
      tipo: 'Tele+Presencial Individual',
      formaPagamento: 'Cartão',
      valor: 34.90,
      funeral: false,
      telepsicologia: true,
      presencial: true,
    },
    dataCadastro: '2023-12-20',
    dataAtivacao: '2023-12-22',
    dataVencimento: '2024-02-22',
  },
  {
    id: '10',
    nome: 'Gabriel Martins',
    cpf: '741.852.963-00',
    celular: '(11) 98901-2345',
    status: 'PRÉ-CADASTRO',
    diagnostico: 'Avaliação clínica',
    tipoConsulta: 'Clínico Geral',
    dataCadastro: '2024-01-12',
  },
  {
    id: '11',
    nome: 'Juliana Pereira',
    cpf: '159.357.486-00',
    celular: '(11) 91234-5678',
    email: 'juliana@email.com',
    dataNascimento: '1982-04-18',
    sexo: 'F',
    endereco: {
      cep: '06006-000',
      logradouro: 'Rua da Consolação',
      numero: '200',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    status: 'ATIVO',
    plano: {
      tipo: 'Telemedicina Familiar',
      formaPagamento: 'Cartão',
      valor: 59.90,
      funeral: true,
      telepsicologia: false,
      presencial: false,
    },
    dataCadastro: '2023-10-05',
    dataAtivacao: '2023-10-10',
    dataVencimento: '2024-01-18',
  },
  {
    id: '12',
    nome: 'Ricardo Gomes',
    cpf: '357.159.852-00',
    celular: '(11) 94567-8901',
    status: 'PENDENTE ATIVAÇÃO',
    dataCadastro: '2024-01-11',
  },
];

// Tabela de preços
export const tabelaPrecos: Record<string, Record<string, number>> = {
  'Telemedicina Individual': {
    'Cartão': 29.90,
    'Boleto': 34.90,
  },
  'Telemedicina Familiar': {
    'Cartão': 59.90,
    'Boleto': 63.90,
  },
  'Tele+Presencial Individual': {
    'Cartão': 34.90,
    'Boleto': 37.90,
  },
  'Tele+Presencial Familiar': {
    'Cartão': 64.90,
    'Boleto': 67.90,
  },
};

// Funções utilitárias
export const calcularValorPlano = (tipo: string, formaPagamento: string): number => {
  return tabelaPrecos[tipo]?.[formaPagamento] || 0;
};

export const getPacientesAtivos = () => pacientes.filter(p => p.status === 'ATIVO');
export const getPacientesPendentes = () => pacientes.filter(p => 
  ['PRÉ-CADASTRO', 'INCOMPLETO', 'PENDENTE ATIVAÇÃO'].includes(p.status)
);
export const getPacientesVencendo = (dias: number = 7) => {
  const hoje = new Date();
  const limite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);
  return pacientes.filter(p => {
    if (!p.dataVencimento || p.status !== 'ATIVO') return false;
    const vencimento = new Date(p.dataVencimento);
    return vencimento <= limite && vencimento >= hoje;
  });
};

export const calcularCustoPlanosAtivos = () => {
  return getPacientesAtivos().reduce((total, p) => total + (p.plano?.valor || 0), 0);
};

export const calcularCustoProjetado = () => {
  return pacientes
    .filter(p => ['PRÉ-CADASTRO', 'INCOMPLETO', 'COMPLETO', 'PENDENTE ATIVAÇÃO'].includes(p.status))
    .reduce((total, p) => {
      if (p.plano?.valor) return total + p.plano.valor;
      // Estimativa baseada no tipo de consulta ou valor padrão
      return total + 29.90;
    }, 0);
};
