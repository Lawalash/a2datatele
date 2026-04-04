import { useState, useEffect } from 'react';
import { Plus, Edit2, CheckCircle, XCircle, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { getPricingPlans, createPricingPlan, updatePricingPlan } from '@/services/patients';
import { formatCurrency } from '@/utils/formatters';
import type { FormaPagamento, PricingPlan } from '@/types';
import { toast } from 'sonner';

export function Planos() {
  const [planos, setPlanos] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    forma_pagamento: 'Cartão' as FormaPagamento,
    valor: '',
    ativo: true,
  });

  const [saving, setSaving] = useState(false);

  const fetchPlanos = async () => {
    setLoading(true);
    const { data, error } = await getPricingPlans(true); // Pega ativos e inativos
    if (error) {
      toast.error(error);
    } else {
      setPlanos(data as PricingPlan[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  const handleOpenModal = (plan?: PricingPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        nome: plan.nome,
        forma_pagamento: plan.forma_pagamento,
        valor: plan.valor.toString(),
        ativo: plan.ativo,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        nome: '',
        forma_pagamento: 'Cartão',
        valor: '',
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(formData.valor.replace(',', '.'));
    
    if (!formData.nome || isNaN(valorNum)) {
      toast.error('Preencha os campos corretamente.');
      return;
    }

    setSaving(true);
    const payload = {
      nome: formData.nome,
      forma_pagamento: formData.forma_pagamento,
      valor: valorNum,
      ativo: formData.ativo,
    };

    if (editingPlan) {
      const { error } = await updatePricingPlan(editingPlan.id, payload);
      if (error) toast.error('Erro ao editar plano');
      else {
        toast.success('Plano atualizado com sucesso!');
        setIsModalOpen(false);
        fetchPlanos();
      }
    } else {
      const { error } = await createPricingPlan(payload as any);
      if (error) toast.error('Erro ao criar plano. Pode já existir esta combinação.');
      else {
        toast.success('Plano criado com sucesso!');
        setIsModalOpen(false);
        fetchPlanos();
      }
    }
    setSaving(false);
  };

  const toggleAtivo = async (plan: PricingPlan) => {
    const { error } = await updatePricingPlan(plan.id, { ativo: !plan.ativo });
    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success(`Plano ${!plan.ativo ? 'ativado' : 'desativado'}!`);
      fetchPlanos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planos e Preços</h1>
          <p className="text-slate-500">Gerencie a tabela de valores do sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="flex items-center justify-center py-20">
               <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
               <span className="ml-3 text-slate-500">Carregando planos...</span>
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Plano</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planos.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 border-slate-200">
                        {plan.forma_pagamento}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {formatCurrency(plan.valor)}
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleAtivo(plan)} className="focus:outline-none">
                        {plan.ativo ? (
                          <div className="flex items-center text-emerald-600 gap-1.5 text-sm font-medium hover:text-emerald-700">
                            <CheckCircle className="w-4 h-4" /> Ativo
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400 gap-1.5 text-sm font-medium hover:text-slate-500">
                            <XCircle className="w-4 h-4" /> Inativo
                          </div>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(plan)}>
                          <Edit2 className="w-4 h-4 text-slate-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Plano</Label>
              <Input
                placeholder="Ex: Telemedicina Individual"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={formData.forma_pagamento}
                onValueChange={(val) => setFormData({ ...formData, forma_pagamento: val as FormaPagamento })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label>Habilitar plano?</Label>
                <p className="text-xs text-slate-500">Planos desabilitados não aparecem em novos cadastros.</p>
              </div>
              <Switch
                checked={formData.ativo}
                onCheckedChange={(val) => setFormData({ ...formData, ativo: val })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving ? 'Salvando...' : 'Salvar Plano'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
