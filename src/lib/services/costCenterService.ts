import { db, STORES } from '../db/indexedDB';
import { CostCenter, CostCenterSchema } from '../db/schema';

export const costCenterService = {
  async create(data: Omit<CostCenter, 'id' | 'created_at' | 'updated_at'>): Promise<CostCenter> {
    const costCenter: CostCenter = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    CostCenterSchema.parse(costCenter);
    await db.add(STORES.COST_CENTERS, costCenter);
    return costCenter;
  },

  async update(id: string, data: Partial<CostCenter>): Promise<void> {
    const existing = await db.get<CostCenter>(STORES.COST_CENTERS, id);
    if (!existing) throw new Error('Centro de custo não encontrado');
    
    const updated: CostCenter = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    CostCenterSchema.parse(updated);
    await db.update(STORES.COST_CENTERS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.COST_CENTERS, id);
  },

  async getById(id: string): Promise<CostCenter | undefined> {
    return db.get<CostCenter>(STORES.COST_CENTERS, id);
  },

  async getAll(): Promise<CostCenter[]> {
    return db.getAll<CostCenter>(STORES.COST_CENTERS);
  },

  async getActive(): Promise<CostCenter[]> {
    return db.getByIndex<CostCenter>(STORES.COST_CENTERS, 'active', true);
  },
};
