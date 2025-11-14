import { db, STORES } from '../db/indexedDB';
import { FixedAsset, FixedAssetSchema } from '../db/schema';

export const fixedAssetService = {
  async create(data: Omit<FixedAsset, 'id' | 'created_at' | 'updated_at'>): Promise<FixedAsset> {
    const asset: FixedAsset = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    FixedAssetSchema.parse(asset);
    await db.add(STORES.FIXED_ASSETS, asset);
    return asset;
  },

  async update(id: string, data: Partial<FixedAsset>): Promise<void> {
    const existing = await db.get<FixedAsset>(STORES.FIXED_ASSETS, id);
    if (!existing) throw new Error('Ativo fixo não encontrado');
    
    const updated: FixedAsset = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    FixedAssetSchema.parse(updated);
    await db.update(STORES.FIXED_ASSETS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.FIXED_ASSETS, id);
  },

  async getById(id: string): Promise<FixedAsset | undefined> {
    return db.get<FixedAsset>(STORES.FIXED_ASSETS, id);
  },

  async getAll(): Promise<FixedAsset[]> {
    return db.getAll<FixedAsset>(STORES.FIXED_ASSETS);
  },

  async getByStatus(status: string): Promise<FixedAsset[]> {
    return db.getByIndex<FixedAsset>(STORES.FIXED_ASSETS, 'status', status);
  },

  async calculateDepreciation(asset: FixedAsset): Promise<number> {
    const monthsSinceAcquisition = Math.floor(
      (new Date().getTime() - new Date(asset.acquisition_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.min(
      monthsSinceAcquisition * asset.monthly_depreciation,
      asset.acquisition_value - asset.residual_value
    );
  },
};
