/**
 * Calcula se passaram X horas úteis desde uma data.
 * Horas úteis: segunda a sexta, 08:00 às 18:00 (10h/dia).
 */

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 18;


function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1=Mon, 5=Fri
}



/**
 * Calcula quantas horas úteis se passaram desde startDate até agora (ou endDate).
 */
export function getWorkingHoursElapsed(
  startDate: Date,
  endDate: Date = new Date()
): number {
  let totalMinutes = 0;

  const current = new Date(startDate);

  // Se começa fora do horário/dia útil, avança para próximo útil
  while (!isWeekday(current) || current.getHours() < WORK_START_HOUR) {
    if (!isWeekday(current)) {
      current.setDate(current.getDate() + 1);
      current.setHours(WORK_START_HOUR, 0, 0, 0);
    } else if (current.getHours() < WORK_START_HOUR) {
      current.setHours(WORK_START_HOUR, 0, 0, 0);
    }
  }

  // Se começou depois do horário comercial, avança para próximo dia útil
  if (current.getHours() >= WORK_END_HOUR) {
    current.setDate(current.getDate() + 1);
    current.setHours(WORK_START_HOUR, 0, 0, 0);
    while (!isWeekday(current)) {
      current.setDate(current.getDate() + 1);
    }
  }

  while (current < endDate) {
    if (!isWeekday(current)) {
      current.setDate(current.getDate() + 1);
      current.setHours(WORK_START_HOUR, 0, 0, 0);
      continue;
    }

    if (current.getHours() >= WORK_END_HOUR) {
      current.setDate(current.getDate() + 1);
      current.setHours(WORK_START_HOUR, 0, 0, 0);
      continue;
    }

    if (current.getHours() < WORK_START_HOUR) {
      current.setHours(WORK_START_HOUR, 0, 0, 0);
      continue;
    }

    // Calcular minutos até o fim do dia útil ou até endDate
    const endOfWorkDay = new Date(current);
    endOfWorkDay.setHours(WORK_END_HOUR, 0, 0, 0);

    const effectiveEnd = endDate < endOfWorkDay ? endDate : endOfWorkDay;
    const minutesThisPeriod = Math.max(
      0,
      (effectiveEnd.getTime() - current.getTime()) / (1000 * 60)
    );

    totalMinutes += minutesThisPeriod;

    // Avançar para o próximo dia útil
    current.setDate(current.getDate() + 1);
    current.setHours(WORK_START_HOUR, 0, 0, 0);
  }

  return totalMinutes / 60;
}

/**
 * Verifica se passaram X horas úteis desde startDate.
 */
export function hasPassedWorkingHours(
  startDate: Date,
  hours: number
): boolean {
  const elapsed = getWorkingHoursElapsed(startDate);
  return elapsed >= hours;
}
