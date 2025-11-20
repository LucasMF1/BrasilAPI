import { describe, expect, it } from 'vitest';
import {
  getWeekdayName,
  attachWeekdayToHolidays,
} from '@/services/holidays';

describe('attachWeekdayToHolidays (terceiro ciclo)', () => {
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

    const copiaOriginal = JSON.parse(JSON.stringify(original));

    const result = attachWeekdayToHolidays(original);

    // array retornado não é o mesmo array
    expect(result).not.toBe(original);
    // objetos originais permanecem sem o campo weekday
    expect(original).toEqual(copiaOriginal);
  });

  it('deve lançar erro se holidays não for um array', () => {
    expect(() => attachWeekdayToHolidays(null)).toThrow(
      /holidays deve ser um array/
    );
  });
});
