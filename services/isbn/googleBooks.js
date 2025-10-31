import axios from 'axios';
import NotFoundError from '@/errors/NotFoundError';

const API_BASE_URL = 'https://www.googleapis.com/books/v1';
const API_SEARCH_URL = `${API_BASE_URL}/volumes`;

function parseDimensions(dimensions) {
  if (!dimensions) return null;
  return {
    width: parseFloat(dimensions.width.replace(/\s(cm|in)+$/, '')),
    height: parseFloat(dimensions.height.replace(/\s(cm|in)+$/, '')),
    unit: dimensions.width.includes('cm') ? 'CENTIMETER' : 'INCH',
  };
}

function parsePrice(saleInfo) {
  if (!saleInfo || saleInfo.saleability === 'NOT_FOR_SALE') return null;
  return {
    currency: saleInfo.retailPrice.currencyCode,
    amount: saleInfo.retailPrice.amount,
  };
}

/**
 * Search for book details into the Google Books database.
 *
 * @param {string} isbn
 * @param {{ httpClient?: (url: string, options?: any) => Promise<any> }} [deps]
 * @returns {Promise<object>}
 */
export default async function searchInGoogleBooks(isbn, deps = {}) {
  const httpClient =
    deps.httpClient ??
    (async (url, options) => {
      const res = await axios.get(url, options);
      return res.data; // normaliza para .data direto
    });

  const data = await httpClient(API_SEARCH_URL, {
    params: { q: `isbn:${isbn}`, country: 'BR' },
    headers: { Accept: 'application/json' },
  });

  if (!data.items || !data.items[0]) {
    throw new NotFoundError({ message: 'ISBN não encontrado' });
  }

  const gbBook = data.items[0];
  const { volumeInfo } = gbBook;

  // Normalização de ano: somente quando há 4 dígitos iniciais válidos e > 0
  const pd = volumeInfo.publishedDate;
  let year;
  if (typeof pd === 'string' && pd.length >= 4) {
    const y = parseInt(pd.substring(0, 4), 10);
    if (Number.isFinite(y) && y > 0) {
      year = y;
    }
  }

  const coverUrl =
    volumeInfo.imageLinks?.extraLarge ||
    volumeInfo.imageLinks?.large ||
    volumeInfo.imageLinks?.medium ||
    volumeInfo.imageLinks?.small ||
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail;

  return {
    isbn,
    title: volumeInfo.title?.trim(),
    subtitle: null,
    authors: volumeInfo.authors,
    publisher: volumeInfo.publisher,
    synopsis: volumeInfo.description,
    dimensions: parseDimensions(volumeInfo.dimensions),
    year,
    format: volumeInfo.dimensions ? 'PHYSICAL' : 'DIGITAL',
    page_count: volumeInfo.pageCount,
    subjects: volumeInfo.categories,
    location: null,
    retail_price: parsePrice(gbBook.saleInfo),
    cover_url: coverUrl && coverUrl.replace('http://', 'https://'),
    provider: 'google-books',
  };
}
