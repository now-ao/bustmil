const DB_NAME = 'erp_database';
const DB_VERSION = 2;

export const STORES = {
  USERS: 'users',
  PRODUCTS: 'products',
  CLIENTS: 'clients',
  SALES: 'sales',
  INVOICES: 'invoices',
  CASH_REGISTERS: 'cash_registers',
  CASH_TRANSACTIONS: 'cash_transactions',
  ACCOUNTS: 'accounts',
  STOCK_MOVEMENTS: 'stock_movements',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  EXPENSES: 'expenses',
  EMPLOYEES: 'employees',
  BUDGETS: 'budgets',
  SERVICE_ORDERS: 'service_orders',
  CONTRACTS: 'contracts',
  COST_CENTERS: 'cost_centers',
  CHART_OF_ACCOUNTS: 'chart_of_accounts',
  FIXED_ASSETS: 'fixed_assets',
  TIME_CLOCKS: 'time_clocks',
  PRODUCTION_ORDERS: 'production_orders',
} as const;

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
        }

        // Products store
        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
          productsStore.createIndex('code', 'code', { unique: true });
          productsStore.createIndex('barcode', 'barcode', { unique: false });
          productsStore.createIndex('category', 'category', { unique: false });
        }

        // Clients store
        if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
          const clientsStore = db.createObjectStore(STORES.CLIENTS, { keyPath: 'id' });
          clientsStore.createIndex('document', 'document', { unique: true });
          clientsStore.createIndex('email', 'email', { unique: false });
        }

        // Sales store
        if (!db.objectStoreNames.contains(STORES.SALES)) {
          const salesStore = db.createObjectStore(STORES.SALES, { keyPath: 'id' });
          salesStore.createIndex('sale_number', 'sale_number', { unique: true });
          salesStore.createIndex('client_id', 'client_id', { unique: false });
          salesStore.createIndex('user_id', 'user_id', { unique: false });
          salesStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Invoices store
        if (!db.objectStoreNames.contains(STORES.INVOICES)) {
          const invoicesStore = db.createObjectStore(STORES.INVOICES, { keyPath: 'id' });
          invoicesStore.createIndex('invoice_number', 'invoice_number', { unique: true });
          invoicesStore.createIndex('client_id', 'client_id', { unique: false });
          invoicesStore.createIndex('status', 'status', { unique: false });
          invoicesStore.createIndex('due_date', 'due_date', { unique: false });
        }

        // Cash Registers store
        if (!db.objectStoreNames.contains(STORES.CASH_REGISTERS)) {
          const cashStore = db.createObjectStore(STORES.CASH_REGISTERS, { keyPath: 'id' });
          cashStore.createIndex('user_id', 'user_id', { unique: false });
          cashStore.createIndex('status', 'status', { unique: false });
          cashStore.createIndex('opening_date', 'opening_date', { unique: false });
        }

        // Cash Transactions store
        if (!db.objectStoreNames.contains(STORES.CASH_TRANSACTIONS)) {
          const transactionsStore = db.createObjectStore(STORES.CASH_TRANSACTIONS, { keyPath: 'id' });
          transactionsStore.createIndex('cash_register_id', 'cash_register_id', { unique: false });
          transactionsStore.createIndex('type', 'type', { unique: false });
          transactionsStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Accounts store
        if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
          const accountsStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
          accountsStore.createIndex('type', 'type', { unique: false });
          accountsStore.createIndex('status', 'status', { unique: false });
          accountsStore.createIndex('due_date', 'due_date', { unique: false });
          accountsStore.createIndex('client_id', 'client_id', { unique: false });
        }

        // Stock Movements store
        if (!db.objectStoreNames.contains(STORES.STOCK_MOVEMENTS)) {
          const stockStore = db.createObjectStore(STORES.STOCK_MOVEMENTS, { keyPath: 'id' });
          stockStore.createIndex('product_id', 'product_id', { unique: false });
          stockStore.createIndex('type', 'type', { unique: false });
          stockStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Suppliers store
        if (!db.objectStoreNames.contains(STORES.SUPPLIERS)) {
          const suppliersStore = db.createObjectStore(STORES.SUPPLIERS, { keyPath: 'id' });
          suppliersStore.createIndex('document', 'document', { unique: true });
          suppliersStore.createIndex('email', 'email', { unique: false });
        }

        // Purchases store
        if (!db.objectStoreNames.contains(STORES.PURCHASES)) {
          const purchasesStore = db.createObjectStore(STORES.PURCHASES, { keyPath: 'id' });
          purchasesStore.createIndex('purchase_number', 'purchase_number', { unique: true });
          purchasesStore.createIndex('supplier_id', 'supplier_id', { unique: false });
          purchasesStore.createIndex('status', 'status', { unique: false });
          purchasesStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Expenses store
        if (!db.objectStoreNames.contains(STORES.EXPENSES)) {
          const expensesStore = db.createObjectStore(STORES.EXPENSES, { keyPath: 'id' });
          expensesStore.createIndex('category', 'category', { unique: false });
          expensesStore.createIndex('expense_date', 'expense_date', { unique: false });
          expensesStore.createIndex('supplier_id', 'supplier_id', { unique: false });
        }

        // Employees store
        if (!db.objectStoreNames.contains(STORES.EMPLOYEES)) {
          const employeesStore = db.createObjectStore(STORES.EMPLOYEES, { keyPath: 'id' });
          employeesStore.createIndex('document', 'document', { unique: true });
          employeesStore.createIndex('department', 'department', { unique: false });
          employeesStore.createIndex('active', 'active', { unique: false });
        }

        // Budgets store
        if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
          const budgetsStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
          budgetsStore.createIndex('budget_number', 'budget_number', { unique: true });
          budgetsStore.createIndex('client_id', 'client_id', { unique: false });
          budgetsStore.createIndex('status', 'status', { unique: false });
          budgetsStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Service Orders store
        if (!db.objectStoreNames.contains(STORES.SERVICE_ORDERS)) {
          const serviceOrdersStore = db.createObjectStore(STORES.SERVICE_ORDERS, { keyPath: 'id' });
          serviceOrdersStore.createIndex('order_number', 'order_number', { unique: true });
          serviceOrdersStore.createIndex('client_id', 'client_id', { unique: false });
          serviceOrdersStore.createIndex('status', 'status', { unique: false });
          serviceOrdersStore.createIndex('assigned_to', 'assigned_to', { unique: false });
        }

        // Contracts store
        if (!db.objectStoreNames.contains(STORES.CONTRACTS)) {
          const contractsStore = db.createObjectStore(STORES.CONTRACTS, { keyPath: 'id' });
          contractsStore.createIndex('contract_number', 'contract_number', { unique: true });
          contractsStore.createIndex('status', 'status', { unique: false });
          contractsStore.createIndex('end_date', 'end_date', { unique: false });
        }

        // Cost Centers store
        if (!db.objectStoreNames.contains(STORES.COST_CENTERS)) {
          const costCentersStore = db.createObjectStore(STORES.COST_CENTERS, { keyPath: 'id' });
          costCentersStore.createIndex('code', 'code', { unique: true });
          costCentersStore.createIndex('active', 'active', { unique: false });
        }

        // Chart of Accounts store
        if (!db.objectStoreNames.contains(STORES.CHART_OF_ACCOUNTS)) {
          const chartStore = db.createObjectStore(STORES.CHART_OF_ACCOUNTS, { keyPath: 'id' });
          chartStore.createIndex('code', 'code', { unique: true });
          chartStore.createIndex('type', 'type', { unique: false });
          chartStore.createIndex('active', 'active', { unique: false });
        }

        // Fixed Assets store
        if (!db.objectStoreNames.contains(STORES.FIXED_ASSETS)) {
          const assetsStore = db.createObjectStore(STORES.FIXED_ASSETS, { keyPath: 'id' });
          assetsStore.createIndex('code', 'code', { unique: true });
          assetsStore.createIndex('status', 'status', { unique: false });
          assetsStore.createIndex('category', 'category', { unique: false });
        }

        // Time Clocks store
        if (!db.objectStoreNames.contains(STORES.TIME_CLOCKS)) {
          const timeClocksStore = db.createObjectStore(STORES.TIME_CLOCKS, { keyPath: 'id' });
          timeClocksStore.createIndex('employee_id', 'employee_id', { unique: false });
          timeClocksStore.createIndex('date', 'date', { unique: false });
        }

        // Production Orders store
        if (!db.objectStoreNames.contains(STORES.PRODUCTION_ORDERS)) {
          const productionStore = db.createObjectStore(STORES.PRODUCTION_ORDERS, { keyPath: 'id' });
          productionStore.createIndex('order_number', 'order_number', { unique: true });
          productionStore.createIndex('product_id', 'product_id', { unique: false });
          productionStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async add<T>(storeName: string, data: T): Promise<string> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new IndexedDBService();
