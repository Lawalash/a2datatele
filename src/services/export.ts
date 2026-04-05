import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { insertLog } from './audit';
import type { Patient } from '@/types';

/**
 * Exporta pacientes selecionados para planilha XLSX no formato Quality Life.
 * Após gerar, atualiza status → pendente_ativacao e registra audit log.
 */
export async function exportPlanilhaQualityLife(patientIds: string[]) {
  try {
    // 1. Buscar dados completos dos pacientes
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .in('id', patientIds);

    if (error) return { error: error.message };
    if (!patients || patients.length === 0) return { error: 'Nenhum paciente encontrado.' };

    // 2. Montar dados formatados para a planilha
    const formatCEP = (cep: string | null) => {
      if (!cep) return '';
      const num = cep.replace(/\D/g, '');
      if (num.length === 8) return `${num.slice(0, 5)}-${num.slice(5)}`;
      return num;
    };

    const getPlanType = (plano: string | null) => {
      if (!plano) return '';
      if (plano.toLowerCase().includes('individual')) return 'Individual';
      if (plano.toLowerCase().includes('familiar')) return 'Familiar';
      return plano;
    };

    const rows = (patients as Patient[]).map((p) => ({
      'Nome': p.nome,
      'CPF': p.cpf.replace(/\D/g, ''),
      'Data de nascimento': p.data_nascimento
        ? formatDateBR(p.data_nascimento)
        : '',
      'Sexo': p.sexo || '',
      'Celular': p.celular.replace(/\D/g, ''),
      'E-mail': p.email || '',
      'CEP': formatCEP(p.cep),
      'Logradouro': p.logradouro || '',
      'Número': p.numero || '',
      'Complemento': p.complemento || '',
      'Bairro': p.bairro || '',
      'Cidade': p.cidade || '',
      'UF': p.uf || '',
      'Tipo de plano': getPlanType(p.plano),
      'Funeral?': p.funeral ? 'Sim' : 'Não',
      'Telepsicologia?': p.telepsicologia ? 'Sim' : 'Não',
      'Presencial?': p.presencial ? 'Sim' : 'Não',
    }));

    // 3. Gerar XLSX
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 35 }, // NOME
      { wch: 14 }, // CPF
      { wch: 14 }, // DATA_NASCIMENTO
      { wch: 6 },  // SEXO
      { wch: 14 }, // CELULAR
      { wch: 30 }, // EMAIL
      { wch: 10 }, // CEP
      { wch: 35 }, // LOGRADOURO
      { wch: 8 },  // NUMERO
      { wch: 20 }, // COMPLEMENTO
      { wch: 20 }, // BAIRRO
      { wch: 20 }, // CIDADE
      { wch: 4 },  // UF
      { wch: 16 }, // Tipo de plano
      { wch: 10 }, // FUNERAL?
      { wch: 16 }, // TELEPSICOLOGIA?
      { wch: 12 }, // PRESENCIAL?
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes Quality Life');

    // 4. Baixar o arquivo
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `quality_life_${today}.csv`, { bookType: 'csv' });

    // 5. Atualizar pacientes: status e data_envio_quality_life
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('patients')
      .update({
        status: 'pendente_ativacao',
        data_envio_quality_life: now,
      })
      .in('id', patientIds);

    if (updateError) {
      console.warn('Erro ao atualizar status após exportação:', updateError.message);
    }

    // 6. Audit log
    await insertLog('export', null, {
      patient_ids: patientIds,
      count: patientIds.length,
      exported_at: now,
    });

    return { error: null };
  } catch {
    return { error: 'Erro ao exportar planilha.' };
  }
}

/**
 * Formata data ISO para DD/MM/AAAA
 */
function formatDateBR(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
