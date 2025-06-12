import { apiService, InstantDebitRequest, LoginRequest, RegisterRequest, TransactionDTO, TransferRequest } from './apiService';

interface User {
  email: string;
  balance: number;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async checkAuth(): Promise<boolean> {
    return !!this.currentUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const request: LoginRequest = { email, password };
      await apiService.login(request);
      this.currentUser = { email, balance: 0 };
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    apiService.clearToken();
    this.currentUser = null;
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      const request: RegisterRequest = { email, password };
      await apiService.register(request);
      this.currentUser = { email, balance: 0 };
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  }

  async getBalance(): Promise<number> {
    if (!this.currentUser) return 0;
    try {
      return await apiService.getBalance(this.currentUser.email);
    } catch (error) {
      console.error('Error al obtener balance:', error);
      return 0;
    }
  }

  async transfer(amount: number, receiverEmail: string): Promise<boolean> {
    if (!this.currentUser) return false;
    
    try {
      const request: TransferRequest = {
        senderEmail: this.currentUser.email,
        receiverEmail,
        amount,
      };
      await apiService.transfer(request);
      return true;
    } catch (error) {
      console.error('Error en transferencia:', error);
      return false;
    }
  }

  async addMoney(amount: number): Promise<boolean> {
    if (!this.currentUser) return false;
    
    try {
      // En la API real, esto sería una llamada a un endpoint específico
      // Por ahora, simulamos que el balance se actualiza
      const currentBalance = await this.getBalance();
      this.currentUser.balance = currentBalance + amount;
      return true;
    } catch (error) {
      console.error('Error al agregar dinero:', error);
      return false;
    }
  }

  async requestDebin(amount: number, payerEmail: string, bankName: string, cbu: string): Promise<boolean> {
    if (!this.currentUser) return false;
    
    try {
      const request: InstantDebitRequest = {
        payerEmail,
        collectorEmail: this.currentUser.email,
        amount,
        bankName,
        cbu,
      };
      await apiService.requestInstantDebit(request);
      return true;
    } catch (error) {
      console.error('Error en DEBIN:', error);
      return false;
    }
  }

  async getTransactions(): Promise<TransactionDTO[]> {
    if (!this.currentUser) return [];
    try {
      return await apiService.getTransactions(this.currentUser.email);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return [];
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance(); 