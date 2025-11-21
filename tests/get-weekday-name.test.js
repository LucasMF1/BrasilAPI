import { describe, expect, it } from 'vitest';

import {getWeekdayName, attachWeekdayToHolidays} from '@/services/holidays';

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

  it('deve lançar erro para string que não esteja no formato ISO (YYYY-MM-DD)', () => {
    expect(() => getWeekdayName('21/04/2024')).toThrow(/Data ISO inválida/);
  });
});

describe('attachWeekdayToHolidays', () => {
  it('deve adicionar a propriedade weekday em cada feriado', () => {
    const input = [
      {
        date: '2024-01-01',
        name: 'Confraternização mundial',
        type: 'national',
      },
      {
        date: '2024-04-21',
        name: 'Tiradentes',
        type: 'national',
      },
    ];

    const result = attachWeekdayToHolidays(input);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      date: '2024-01-01',
      name: 'Confraternização mundial',
      type: 'national',
      weekday: 'segunda-feira',
    });

    expect(result[1]).toEqual({
      date: '2024-04-21',
      name: 'Tiradentes',
      type: 'national',
      weekday: 'domingo',
    });
  });

  it('não deve mutar o array original de feriados', () => {
    const original = [
      { date: '2024-12-25', name: 'Natal', type: 'national' },
    ];

    const copiaParaComparacao = JSON.parse(JSON.stringify(original));

    const result = attachWeekdayToHolidays(original);

    expect(result).not.toBe(original);
    expect(original).toEqual(copiaParaComparacao);
    expect(result[0]).toHaveProperty('weekday');
  });
});
