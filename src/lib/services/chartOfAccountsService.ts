import { db, STORES } from '../db/indexedDB';
import { ChartOfAccount, ChartOfAccountSchema } from '../db/schema';

export const chartOfAccountsService = {
  async create(data: Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at'>): Promise<ChartOfAccount> {
    const account: ChartOfAccount = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    ChartOfAccountSchema.parse(account);
    await db.add(STORES.CHART_OF_ACCOUNTS, account);
    return account;
  },

  async update(id: string, data: Partial<ChartOfAccount>): Promise<void> {
    const existing = await db.get<ChartOfAccount>(STORES.CHART_OF_ACCOUNTS, id);
    if (!existing) throw new Error('Conta contábil não encontrada');
    
    const updated: ChartOfAccount = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    ChartOfAccountSchema.parse(updated);
    await db.update(STORES.CHART_OF_ACCOUNTS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.CHART_OF_ACCOUNTS, id);
  },

  async getById(id: string): Promise<ChartOfAccount | undefined> {
    return db.get<ChartOfAccount>(STORES.CHART_OF_ACCOUNTS, id);
  },

  async getAll(): Promise<ChartOfAccount[]> {
    return db.getAll<ChartOfAccount>(STORES.CHART_OF_ACCOUNTS);
  },

  async getByType(type: string): Promise<ChartOfAccount[]> {
    return db.getByIndex<ChartOfAccount>(STORES.CHART_OF_ACCOUNTS, 'type', type);
  },

  async getActive(): Promise<ChartOfAccount[]> {
    return db.getByIndex<ChartOfAccount>(STORES.CHART_OF_ACCOUNTS, 'active', true);
  },
};
