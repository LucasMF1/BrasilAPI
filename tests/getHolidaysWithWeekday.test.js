import { describe, expect, it } from 'vitest';
import getHolidays from '@/services/holidays';

describe('getHolidays com weekday (quarto ciclo)', () => {
  it('deve adicionar weekday a todos os feriados de 2024', () => {
    const holidays2024 = getHolidays(2024);

    expect(holidays2024.length).toBeGreaterThan(0);

    holidays2024.forEach((holiday) => {
      expect(holiday).toHaveProperty('weekday');
      expect(typeof holiday.weekday).toBe('string');
      expect(holiday.weekday.length).toBeGreaterThan(0);
    });
  });

  it('deve retornar o weekday correto para Tiradentes 2024', () => {
    const holidays2024 = getHolidays(2024);

    const tiradentes = holidays2024.find(
      (holiday) => holiday.name === 'Tiradentes',
    );

    expect(tiradentes).toBeDefined();
    expect(tiradentes.date).toBe('2024-04-21');
    expect(tiradentes.weekday).toBe('domingo');
  });
});
