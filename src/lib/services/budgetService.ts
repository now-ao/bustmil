import { db, STORES } from '../db/indexedDB';
import { Budget, BudgetSchema } from '../db/schema';

export const budgetService = {
  async create(data: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    const budget: Budget = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    BudgetSchema.parse(budget);
    await db.add(STORES.BUDGETS, budget);
    return budget;
  },

  async update(id: string, data: Partial<Budget>): Promise<void> {
    const existing = await db.get<Budget>(STORES.BUDGETS, id);
    if (!existing) throw new Error('Orçamento não encontrado');
    
    const updated: Budget = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    BudgetSchema.parse(updated);
    await db.update(STORES.BUDGETS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.BUDGETS, id);
  },

  async getById(id: string): Promise<Budget | undefined> {
    return db.get<Budget>(STORES.BUDGETS, id);
  },

  async getAll(): Promise<Budget[]> {
    return db.getAll<Budget>(STORES.BUDGETS);
  },

  async getByStatus(status: string): Promise<Budget[]> {
    return db.getByIndex<Budget>(STORES.BUDGETS, 'status', status);
  },

  async getByClient(clientId: string): Promise<Budget[]> {
    return db.getByIndex<Budget>(STORES.BUDGETS, 'client_id', clientId);
  },

  async getNextBudgetNumber(): Promise<number> {
    const budgets = await this.getAll();
    if (budgets.length === 0) return 1;
    return Math.max(...budgets.map(b => b.budget_number)) + 1;
  },
};
