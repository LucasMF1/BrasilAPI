import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/errors/NotFoundError', () => {
  class NotFoundError extends Error {
    constructor(opts = {}) {
      super(opts.message || 'ISBN não encontrado');
      this.name = 'NotFoundError';
    }
  }
  return { default: NotFoundError };
});

let searchInGoogleBooks;
beforeAll(async () => {
  ({ default: searchInGoogleBooks } = await import('../../services/isbn/googleBooks.js'));
});

function viVolume(publishedDate) {
  return { volumeInfo: { publishedDate } };
}

function fakeHttp(payload) {
  return async () => payload;
}

async function expectNotFound(promise) {
  await expect(promise).rejects.toMatchObject({ name: 'NotFoundError' });
}

describe('searchInGoogleBooks(isbn)', () => {
  const isbn = '9780000000002';

  it('CT1: items com elemento e ano válido (fluxo feliz)', async () => {
    const httpClient = fakeHttp({ items: [viVolume('2023-10-01')] });
    const res = await searchInGoogleBooks(isbn, { httpClient });
    expect(res).toBeDefined();
    expect(res.year).toBe(2023);
  });

  it('CT2: items ausente → NotFoundError', async () => {
    const httpClient = fakeHttp({});
    await expectNotFound(searchInGoogleBooks(isbn, { httpClient }));
  });

  it('CT3: items vazio → NotFoundError', async () => {
    const httpClient = fakeHttp({ items: [] });
    await expectNotFound(searchInGoogleBooks(isbn, { httpClient }));
  });

  it('CT4: publishedDate vazia → sem ano', async () => {
    const httpClient = fakeHttp({ items: [viVolume('')] });
    const res = await searchInGoogleBooks(isbn, { httpClient });
    expect(res.year).toBeUndefined();
  });

  it('CT5: publishedDate sem 4 dígitos → sem ano', async () => {
    const httpClient = fakeHttp({ items: [viVolume('abc')] });
    const res = await searchInGoogleBooks(isbn, { httpClient });
    expect(res.year).toBeUndefined();
  });

  it('CT6: publishedDate iniciando com 4 dígitos → ano válido', async () => {
    const httpClient = fakeHttp({ items: [viVolume('2019-05-20')] });
    const res = await searchInGoogleBooks(isbn, { httpClient });
    expect(res.year).toBe(2019);
  });
});
