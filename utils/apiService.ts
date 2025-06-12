import axios from 'axios';

const BASE_URL = 'https://c491-186-136-2-160.ngrok-free.app';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      config: error.config,
      response: error.response,
    });
    return Promise.reject(error);
  }
);

// Tipos
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TransferRequest {
  senderEmail: string;
  receiverEmail: string;
  amount: number;
}

export interface InstantDebitRequest {
  receiverEmail: string;
  amount: number;
  bankName: string;
  cbu: string;
}

export interface TransactionDTO {
  type: 'INCOME' | 'OUTCOME';
  amount: number;
  createdAt: string;
  relatedWalletId?: string;
  relatedBankName?: string;
}

// Clase principal del servicio
class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  private constructor() {
    // Configuración base de axios
    api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Autenticación
  async login(request: LoginRequest): Promise<string> {
    try {
      console.log('Login request:', request);
      const response = await api.post('/users/login', request);
      this.token = response.data;
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      throw error;
    }
  }

  async register(request: RegisterRequest): Promise<string> {
    try {
      console.log('Register request:', request);
      const response = await api.post('/users/register', request);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error('El usuario ya existe');
      }
      throw error;
    }
  }

  // Billetera
  async getBalance(email: string): Promise<number> {
    try {
      console.log('Get balance request:', email);
      const response = await api.get(`/wallet/balance?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Get balance error:', error);
      throw new Error('Error al obtener el balance');
    }
  }

  async transfer(request: TransferRequest): Promise<string> {
    try {
      console.log('Transfer request:', request);
      const response = await api.post('/wallet/transfer', request);
      return response.data;
    } catch (error) {
      console.error('Transfer error:', error);
      throw new Error('Error al realizar la transferencia');
    }
  }

  async requestInstantDebit(request: InstantDebitRequest): Promise<any> {
    try {
      console.log('Instant debit request:', request);
      const response = await api.post('/wallet/instant-debit', request);
      return response.data;
    } catch (error) {
      console.error('Instant debit error:', error);
      throw new Error('Error al solicitar el débito instantáneo');
    }
  }

  async getUserEmailByWalletId(walletId: string): Promise<string> {
    try {
      console.log('Get user email request:', walletId);
      const response = await api.get(`/wallet/user-email?walletId=${walletId}`);
      return response.data;
    } catch (error) {
      console.error('Get user email error:', error);
      throw new Error('Error al obtener el email del usuario');
    }
  }

  // Transacciones
  async getTransactions(email: string): Promise<TransactionDTO[]> {
    try {
      console.log('Get transactions request:', email);
      const response = await api.get(`/transactions?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw new Error('Error al obtener las transacciones');
    }
  }

  // Utilidades
  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }
}

export const apiService = ApiService.getInstance(); 