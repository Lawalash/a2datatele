import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  MessageCircle,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { pacientes, calcularValorPlano } from '@/data/mock';
import type { TipoPlano, FormaPagamento, Sexo } from '@/types';
import { formatCEP, formatCurrency, removeMask } from '@/utils/formatters';
import { toast } from 'sonner';

const tiposPlano: TipoPlano[] = [
  'Telemedicina Individual',
  'Telemedicina Familiar',
  'Tele+Presencial Individual',
  'Tele+Presencial Familiar',
];

const formasPagamento: FormaPagamento[] = ['Cartão', 'Boleto'];

export function EditarPaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  
  // Encontra o paciente nos dados mockados
  const paciente = pacientes.find(p => p.id === id);

  const [formData, setFormData] = useState({
    // Dados pessoais (editáveis)
    dataNascimento: paciente?.dataNascimento || '',
    sexo: (paciente?.sexo as Sexo) || '',
    email: paciente?.email || '',
    
    // Endereço (editáveis)
    cep: paciente?.endereco?.cep || '',
    logradouro: paciente?.endereco?.logradouro || '',
    numero: paciente?.endereco?.numero || '',
    complemento: paciente?.endereco?.complemento || '',
    bairro: paciente?.endereco?.bairro || '',
    cidade: paciente?.endereco?.cidade || '',
    uf: paciente?.endereco?.uf || '',
    
    // Plano (editáveis)
    tipoPlano: (paciente?.plano?.tipo as TipoPlano) || '',
    formaPagamento: (paciente?.plano?.formaPagamento as FormaPagamento) || '',
    funeral: paciente?.plano?.funeral || false,
    telepsicologia: paciente?.plano?.telepsicologia || false,
    presencial: paciente?.plano?.presencial || false,
  });

  const [valorPlano, setValorPlano] = useState(paciente?.plano?.valor || 0);

  useEffect(() => {
    if (formData.tipoPlano && formData.formaPagamento) {
      const valor = calcularValorPlano(formData.tipoPlano, formData.formaPagamento);
      setValorPlano(valor);
    }
  }, [formData.tipoPlano, formData.formaPagamento]);

  if (!paciente) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Paciente não encontrado</p>
        <Button onClick={() => navigate('/pacientes')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    handleChange('cep', formatted);
    
    // Simula busca de CEP (em produção, usaria uma API)
    if (removeMask(formatted).length === 8) {
      // Simula delay
      setTimeout(() => {
        handleChange('logradouro', 'Rua Exemplo');
        handleChange('bairro', 'Bairro Exemplo');
        handleChange('cidade', 'São Paulo');
        handleChange('uf', 'SP');
      }, 500);
    }
  };

  const handleWhatsApp = () => {
    const mensagem = encodeURIComponent(
      `Olá ${paciente.nome}! Sou da Quality Life Telemedicina. ` +
      `Gostaria de confirmar algumas informações do seu cadastro. Poderia me ajudar?`
    );
    const numero = removeMask(paciente.celular);
    window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    // Simula o salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Paciente atualizado com sucesso!');
    setCarregando(false);
    navigate('/pacientes');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/pacientes')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Paciente</h1>
            <p className="text-slate-500">Complementar cadastro</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-green-500 text-green-600 hover:bg-green-50"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contatar via WhatsApp
        </Button>
      </div>

      {/* Dados do pré-cadastro (somente leitura) */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-slate-500" />
            Dados do Pré-cadastro
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="text-slate-500">Nome</Label>
            <p className="font-medium">{paciente.nome}</p>
          </div>
          <div>
            <Label className="text-slate-500">CPF</Label>
            <p className="font-medium">{paciente.cpf}</p>
          </div>
          <div>
            <Label className="text-slate-500">Celular</Label>
            <p className="font-medium">{paciente.celular}</p>
          </div>
          <div>
            <Label className="text-slate-500">Status</Label>
            <div>
              <Badge variant="secondary">{paciente.status}</Badge>
            </div>
          </div>
          {paciente.diagnostico && (
            <div className="md:col-span-2 lg:col-span-4">
              <Label className="text-slate-500">Diagnóstico/Observação</Label>
              <p className="font-medium">{paciente.diagnostico}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange('dataNascimento', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) => handleChange('sexo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => handleCEPChange(e.target.value)}
                    maxLength={9}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    placeholder="Rua, Avenida, etc."
                    value={formData.logradouro}
                    onChange={(e) => handleChange('logradouro', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    placeholder="123"
                    value={formData.numero}
                    onChange={(e) => handleChange('numero', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    placeholder="Apto, Sala, etc."
                    value={formData.complemento}
                    onChange={(e) => handleChange('complemento', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) => handleChange('bairro', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Select
                    value={formData.uf}
                    onValueChange={(value) => handleChange('uf', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoPlano">Tipo de Plano</Label>
                  <Select
                    value={formData.tipoPlano}
                    onValueChange={(value) => handleChange('tipoPlano', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposPlano.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={(value) => handleChange('formaPagamento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPagamento.map((forma) => (
                        <SelectItem key={forma} value={forma}>
                          {forma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {valorPlano > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-700">Valor do Plano</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {formatCurrency(valorPlano)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {formData.tipoPlano} • {formData.formaPagamento}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <Label className="mb-3 block">Coberturas Adicionais</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.funeral}
                      onCheckedChange={(checked) => handleChange('funeral', checked as boolean)}
                    />
                    <span>Funeral</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.telepsicologia}
                      onCheckedChange={(checked) => handleChange('telepsicologia', checked as boolean)}
                    />
                    <span>Telepsicologia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.presencial}
                      onCheckedChange={(checked) => handleChange('presencial', checked as boolean)}
                    />
                    <span>Presencial</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/pacientes')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={carregando}
            >
              {carregando ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Salvando...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
