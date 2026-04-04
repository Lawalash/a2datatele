import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TipoConsulta } from '@/types';
import { formatCPF, formatPhone, removeMask } from '@/utils/formatters';
import { toast } from 'sonner';

const tiposConsulta: TipoConsulta[] = [
  'Psicólogo',
  'Psiquiatra',
  'Clínico Geral',
  'Nutricionista',
  'Outro',
];

export function NovoPaciente() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    celular: '',
    diagnostico: '',
    tipoConsulta: '',
  });

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'celular') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (removeMask(formData.cpf).length !== 11) {
      toast.error('CPF inválido');
      return;
    }
    if (removeMask(formData.celular).length < 10) {
      toast.error('Celular inválido');
      return;
    }

    setCarregando(true);
    
    // Simula o salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aqui você adicionaria o paciente aos dados mockados
    // pacientes.push({
    //   id: generateId(),
    //   nome: formData.nome,
    //   cpf: formData.cpf,
    //   celular: formData.celular,
    //   diagnostico: formData.diagnostico,
    //   tipoConsulta: formData.tipoConsulta as TipoConsulta,
    //   status: 'PRÉ-CADASTRO',
    //   dataCadastro: new Date().toISOString().split('T')[0],
    // });
    
    toast.success('Paciente cadastrado com sucesso!');
    setCarregando(false);
    navigate('/pacientes');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/pacientes')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Paciente</h1>
          <p className="text-slate-500">Pré-cadastro de paciente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="h-11"
              />
            </div>

            {/* CPF e Celular */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  maxLength={14}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">
                  Celular (com DDD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="celular"
                  placeholder="(00) 00000-0000"
                  value={formData.celular}
                  onChange={(e) => handleChange('celular', e.target.value)}
                  maxLength={15}
                  className="h-11"
                />
              </div>
            </div>

            {/* Tipo de Consulta */}
            <div className="space-y-2">
              <Label htmlFor="tipoConsulta">Tipo de Consulta</Label>
              <Select
                value={formData.tipoConsulta}
                onValueChange={(value) => handleChange('tipoConsulta', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione o tipo de consulta" />
                </SelectTrigger>
                <SelectContent>
                  {tiposConsulta.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diagnóstico */}
            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico / Observação Clínica</Label>
              <Textarea
                id="diagnostico"
                placeholder="Descreva o diagnóstico ou observações clínicas..."
                value={formData.diagnostico}
                onChange={(e) => handleChange('diagnostico', e.target.value)}
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
