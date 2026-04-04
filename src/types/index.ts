export type StatusPaciente = 
  | 'PRÉ-CADASTRO' 
  | 'INCOMPLETO' 
  | 'COMPLETO' 
  | 'PENDENTE ATIVAÇÃO' 
  | 'ATIVO' 
  | 'VENCIDO' 
  | 'CANCELADO';

export type TipoConsulta = 
  | 'Psicólogo' 
  | 'Psiquiatra' 
  | 'Clínico Geral' 
  | 'Nutricionista' 
  | 'Outro';

export type TipoPlano = 
  | 'Telemedicina Individual'
  | 'Telemedicina Familiar'
  | 'Tele+Presencial Individual'
  | 'Tele+Presencial Familiar';

export type FormaPagamento = 'Cartão' | 'Boleto';

export type Sexo = 'M' | 'F';

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Plano {
  tipo: TipoPlano;
  formaPagamento: FormaPagamento;
  valor: number;
  funeral: boolean;
  telepsicologia: boolean;
  presencial: boolean;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  celular: string;
  email?: string;
  dataNascimento?: string;
  sexo?: Sexo;
  endereco?: Endereco;
  diagnostico?: string;
  tipoConsulta?: TipoConsulta;
  status: StatusPaciente;
  plano?: Plano;
  dataCadastro: string;
  dataAtivacao?: string;
  dataVencimento?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'Admin' | 'Operadora';
  avatar?: string;
}

export interface MetricaMensal {
  mes: string;
  vidasAtivas: number;
  custoTotal: number;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}
