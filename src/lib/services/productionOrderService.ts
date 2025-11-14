import { db, STORES } from '../db/indexedDB';
import { ProductionOrder, ProductionOrderSchema } from '../db/schema';

export const productionOrderService = {
  async create(data: Omit<ProductionOrder, 'id' | 'created_at' | 'updated_at'>): Promise<ProductionOrder> {
    const order: ProductionOrder = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    ProductionOrderSchema.parse(order);
    await db.add(STORES.PRODUCTION_ORDERS, order);
    return order;
  },

  async update(id: string, data: Partial<ProductionOrder>): Promise<void> {
    const existing = await db.get<ProductionOrder>(STORES.PRODUCTION_ORDERS, id);
    if (!existing) throw new Error('Ordem de produção não encontrada');
    
    const updated: ProductionOrder = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    ProductionOrderSchema.parse(updated);
    await db.update(STORES.PRODUCTION_ORDERS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.PRODUCTION_ORDERS, id);
  },

  async getById(id: string): Promise<ProductionOrder | undefined> {
    return db.get<ProductionOrder>(STORES.PRODUCTION_ORDERS, id);
  },

  async getAll(): Promise<ProductionOrder[]> {
    return db.getAll<ProductionOrder>(STORES.PRODUCTION_ORDERS);
  },

  async getByStatus(status: string): Promise<ProductionOrder[]> {
    return db.getByIndex<ProductionOrder>(STORES.PRODUCTION_ORDERS, 'status', status);
  },

  async getByProduct(productId: string): Promise<ProductionOrder[]> {
    return db.getByIndex<ProductionOrder>(STORES.PRODUCTION_ORDERS, 'product_id', productId);
  },

  async getNextOrderNumber(): Promise<number> {
    const orders = await this.getAll();
    if (orders.length === 0) return 1;
    return Math.max(...orders.map(o => o.order_number)) + 1;
  },
};
