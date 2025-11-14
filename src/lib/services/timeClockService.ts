import { db, STORES } from '../db/indexedDB';
import { TimeClock, TimeClockSchema } from '../db/schema';

export const timeClockService = {
  async create(data: Omit<TimeClock, 'id' | 'created_at' | 'updated_at'>): Promise<TimeClock> {
    const timeClock: TimeClock = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    TimeClockSchema.parse(timeClock);
    await db.add(STORES.TIME_CLOCKS, timeClock);
    return timeClock;
  },

  async update(id: string, data: Partial<TimeClock>): Promise<void> {
    const existing = await db.get<TimeClock>(STORES.TIME_CLOCKS, id);
    if (!existing) throw new Error('Registro de ponto não encontrado');
    
    const updated: TimeClock = {
      ...existing,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    
    TimeClockSchema.parse(updated);
    await db.update(STORES.TIME_CLOCKS, updated);
  },

  async delete(id: string): Promise<void> {
    await db.delete(STORES.TIME_CLOCKS, id);
  },

  async getById(id: string): Promise<TimeClock | undefined> {
    return db.get<TimeClock>(STORES.TIME_CLOCKS, id);
  },

  async getAll(): Promise<TimeClock[]> {
    return db.getAll<TimeClock>(STORES.TIME_CLOCKS);
  },

  async getByEmployee(employeeId: string): Promise<TimeClock[]> {
    return db.getByIndex<TimeClock>(STORES.TIME_CLOCKS, 'employee_id', employeeId);
  },

  async getByDate(date: string): Promise<TimeClock[]> {
    return db.getByIndex<TimeClock>(STORES.TIME_CLOCKS, 'date', date);
  },

  calculateHours(clockIn?: string, clockOut?: string, lunchStart?: string, lunchEnd?: string): number {
    if (!clockIn || !clockOut) return 0;
    
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };
    
    const workHours = parseTime(clockOut) - parseTime(clockIn);
    let lunchHours = 0;
    
    if (lunchStart && lunchEnd) {
      lunchHours = parseTime(lunchEnd) - parseTime(lunchStart);
    }
    
    return Math.max(0, workHours - lunchHours);
  },
};
