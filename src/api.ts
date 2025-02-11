import axios from 'axios';
import { ICall } from './types';

const API_URL = 'https://api.skilla.ru/mango';
const TOKEN = 'testtoken';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const getCalls = async (
  dateStart?: string,
  dateEnd?: string,
  inOut?: number,
  sortBy?: string,
  sortDirection?: string,
): Promise<ICall[]> => {
  const params = new URLSearchParams({
    ...(dateStart && { date_start: dateStart }),
    ...(dateEnd && { date_end: dateEnd }),
    ...(inOut !== undefined && { in_out: String(inOut) }),
    ...(sortBy && { sort_by: sortBy }),
    ...(sortDirection && { order: sortDirection }),
  });

  const response = await api.post(`/getList?${params.toString()}`);
  return response.data.results;
};

export const getCallRecording = async (recordId: string, partnershipId: string): Promise<Blob> => {
  const params = new URLSearchParams({ record: recordId, partnership_id: partnershipId });

  const response = await api.post(`/getRecord?${params.toString()}`, null, {
    responseType: 'blob',
  });

  if (!response.data || !(response.data instanceof Blob)) {
    throw new Error('Некорректный ответ от сервера');
  }

  return response.data;
};
