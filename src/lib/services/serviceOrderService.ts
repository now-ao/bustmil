import { db, STORES } from '../db/indexedDB';
import { ServiceOrder, ServiceOrderSchema } from '../db/schema';

export const serviceOrderService = {
  async create(data: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceOrder> {
    const order: ServiceOrder = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    ServiceOrderSchema.parse(order);
    await db.add(STORES.SERVICE_ORDERS, order);
    return order;
  },

  async update(id: string, data: Partial<ServiceOrder>): Promise<void> {
    const existing = await db.get<ServiceOrder>(STORES.SERVICE_ORDERS, id);
    if (!existing) throw new Error('Ordem de serviço não encontrada');
    
    const updated: ServiceOrder = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    ServiceOrderSchema.parse(updated);
    await db.update(STORES.SERVICE_ORDERS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.SERVICE_ORDERS, id);
  },

  async getById(id: string): Promise<ServiceOrder | undefined> {
    return db.get<ServiceOrder>(STORES.SERVICE_ORDERS, id);
  },

  async getAll(): Promise<ServiceOrder[]> {
    return db.getAll<ServiceOrder>(STORES.SERVICE_ORDERS);
  },

  async getByStatus(status: string): Promise<ServiceOrder[]> {
    return db.getByIndex<ServiceOrder>(STORES.SERVICE_ORDERS, 'status', status);
  },

  async getByClient(clientId: string): Promise<ServiceOrder[]> {
    return db.getByIndex<ServiceOrder>(STORES.SERVICE_ORDERS, 'client_id', clientId);
  },

  async getNextOrderNumber(): Promise<number> {
    const orders = await this.getAll();
    if (orders.length === 0) return 1;
    return Math.max(...orders.map(o => o.order_number)) + 1;
  },
};
