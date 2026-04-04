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
    const rows = (patients as Patient[]).map((p) => ({
      'NOME': p.nome,
      'CPF': p.cpf.replace(/\D/g, ''),
      'DATA_NASCIMENTO': p.data_nascimento
        ? formatDateBR(p.data_nascimento)
        : '',
      'SEXO': p.sexo || '',
      'CELULAR': p.celular.replace(/\D/g, ''),
      'EMAIL': p.email || '',
      'CEP': p.cep?.replace(/\D/g, '') || '',
      'LOGRADOURO': p.logradouro || '',
      'NUMERO': p.numero || '',
      'COMPLEMENTO': p.complemento || '',
      'BAIRRO': p.bairro || '',
      'CIDADE': p.cidade || '',
      'UF': p.uf || '',
      'PLANO': p.plano || '',
      'FUNERAL?': p.funeral ? 'Sim' : 'Não',
      'TELEPSICOLOGIA?': p.telepsicologia ? 'Sim' : 'Não',
      'PRESENCIAL?': p.presencial ? 'Sim' : 'Não',
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
      { wch: 30 }, // PLANO
      { wch: 10 }, // FUNERAL?
      { wch: 16 }, // TELEPSICOLOGIA?
      { wch: 12 }, // PRESENCIAL?
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes Quality Life');

    // 4. Baixar o arquivo
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `quality_life_${today}.xlsx`);

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
