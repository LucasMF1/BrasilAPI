import { describe, expect, it } from 'vitest';
import { getWeekdayName } from '@/services/holidays';

describe('getWeekdayName', () => {
  it('deve retornar "quarta-feira" para 2025-01-01', () => {
    const weekday = getWeekdayName('2025-01-01');
    expect(weekday).toBe('quarta-feira');
  });

  it('deve retornar "segunda-feira" para 2024-01-01', () => {
    const weekday = getWeekdayName('2024-01-01');
    expect(weekday).toBe('segunda-feira');
  });

  it('deve retornar "domingo" para 2024-04-21 (Tiradentes)', () => {
    const weekday = getWeekdayName('2024-04-21');
    expect(weekday).toBe('domingo');
  });

  it('deve lançar erro para string que não esteja no formato YYYY-MM-DD', () => {
    expect(() => getWeekdayName('21/04/2024')).toThrow(
      /Data ISO inválida/
    );
  });
});