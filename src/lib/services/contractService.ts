import { db, STORES } from '../db/indexedDB';
import { Contract, ContractSchema } from '../db/schema';

export const contractService = {
  async create(data: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<Contract> {
    const contract: Contract = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    ContractSchema.parse(contract);
    await db.add(STORES.CONTRACTS, contract);
    return contract;
  },

  async update(id: string, data: Partial<Contract>): Promise<void> {
    const existing = await db.get<Contract>(STORES.CONTRACTS, id);
    if (!existing) throw new Error('Contrato não encontrado');
    
    const updated: Contract = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    ContractSchema.parse(updated);
    await db.update(STORES.CONTRACTS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.CONTRACTS, id);
  },

  async getById(id: string): Promise<Contract | undefined> {
    return db.get<Contract>(STORES.CONTRACTS, id);
  },

  async getAll(): Promise<Contract[]> {
    return db.getAll<Contract>(STORES.CONTRACTS);
  },

  async getByStatus(status: string): Promise<Contract[]> {
    return db.getByIndex<Contract>(STORES.CONTRACTS, 'status', status);
  },

  async getExpiringSoon(days: number = 30): Promise<Contract[]> {
    const contracts = await this.getAll();
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return contracts.filter(c => {
      const endDate = new Date(c.end_date);
      return c.status === 'active' && endDate >= now && endDate <= futureDate;
    });
  },
};
