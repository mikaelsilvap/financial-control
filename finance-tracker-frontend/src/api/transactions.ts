import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  date: string;
  description: string;
  category: string;
  value: number;
}

export interface Summary {
  totalEntries: number;
  totalExpenses: number;
  currentBalance: number;
}


export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions`);
  return response.data;
};

export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions`, data);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/transactions/${id}`);
};

export const getSummary = async (): Promise<Summary> => {
  const response = await axios.get<Summary>(`${API_BASE_URL}/transactions/summary`);
  return response.data;
};