import { config } from 'dotenv';
import * as path from 'path';

export function loadConfig(): void {
  // Определяем путь в зависимости от окружения
  let envPath: string;

  if (process.env.NODE_ENV === 'production') {
    envPath = path.resolve(process.cwd(), '.env');
  } else {
    // Для разработки: из users поднимаемся на уровень выше
    envPath = path.resolve(process.cwd(), '..', '.env');
  }

  console.log('Loading .env from:', envPath);

  const result = config({ path: envPath });

  if (result.error) {
    console.error('Error loading .env:', result.error);
    // В production это критическая ошибка, в development - предупреждение
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to load .env file');
    } else {
      console.warn('Continuing without .env file');
    }
  } else {
    console.log('Environment variables loaded successfully');
  }

  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
}
