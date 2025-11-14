import { z } from 'zod';

// Enums
export const UserRoleSchema = z.enum(['admin', 'cashier']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const InvoiceStatusSchema = z.enum(['pending', 'paid', 'cancelled', 'overdue']);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const PaymentMethodSchema = z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const SaleStatusSchema = z.enum(['completed', 'cancelled', 'pending']);
export type SaleStatus = z.infer<typeof SaleStatusSchema>;

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: UserRoleSchema,
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// Product Schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).max(50),
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100),
  unit: z.string().max(20), // UN, KG, L, etc
  cost_price: z.number().min(0),
  sale_price: z.number().min(0),
  stock_quantity: z.number().min(0).default(0),
  min_stock: z.number().min(0).default(0),
  barcode: z.string().max(50).optional(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Product = z.infer<typeof ProductSchema>;

// Client Schema
export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(200),
  document: z.string().max(20), // CPF or CNPJ
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  zip_code: z.string().max(10).optional(),
  credit_limit: z.number().min(0).default(0),
  current_debt: z.number().min(0).default(0),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Client = z.infer<typeof ClientSchema>;

// Sale Schema
export const SaleSchema = z.object({
  id: z.string().uuid(),
  sale_number: z.number(),
  client_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  total_amount: z.number().min(0),
  discount: z.number().min(0).default(0),
  final_amount: z.number().min(0),
  payment_method: PaymentMethodSchema,
  status: SaleStatusSchema,
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().min(0.01),
    unit_price: z.number().min(0),
    subtotal: z.number().min(0),
  })),
  notes: z.string().max(500).optional(),
  created_at: z.string().datetime(),
});
export type Sale = z.infer<typeof SaleSchema>;

// Invoice Schema
export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  invoice_number: z.number(),
  sale_id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  issue_date: z.string().datetime(),
  due_date: z.string().datetime(),
  amount: z.number().min(0),
  paid_amount: z.number().min(0).default(0),
  status: InvoiceStatusSchema,
  payment_method: PaymentMethodSchema.optional(),
  notes: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

// Cash Register Schema
export const CashRegisterSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  opening_date: z.string().datetime(),
  closing_date: z.string().datetime().optional(),
  opening_balance: z.number().min(0),
  closing_balance: z.number().min(0).optional(),
  total_sales: z.number().min(0).default(0),
  total_expenses: z.number().min(0).default(0),
  status: z.enum(['open', 'closed']),
  notes: z.string().max(500).optional(),
});
export type CashRegister = z.infer<typeof CashRegisterSchema>;

// Cash Transaction Schema
export const CashTransactionSchema = z.object({
  id: z.string().uuid(),
  cash_register_id: z.string().uuid(),
  type: z.enum(['sale', 'expense', 'withdrawal', 'deposit']),
  amount: z.number(),
  payment_method: PaymentMethodSchema,
  description: z.string().max(500),
  reference_id: z.string().uuid().optional(), // sale_id or expense_id
  created_at: z.string().datetime(),
});
export type CashTransaction = z.infer<typeof CashTransactionSchema>;

// Supplier Schema
export const SupplierSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(200),
  document: z.string().max(20), // CNPJ
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  zip_code: z.string().max(10).optional(),
  contact_person: z.string().max(200).optional(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Supplier = z.infer<typeof SupplierSchema>;

// Purchase Schema
export const PurchaseStatusSchema = z.enum(['pending', 'approved', 'received', 'cancelled']);
export const PurchaseSchema = z.object({
  id: z.string().uuid(),
  purchase_number: z.number(),
  supplier_id: z.string().uuid(),
  user_id: z.string().uuid(),
  total_amount: z.number().min(0),
  discount: z.number().min(0).default(0),
  final_amount: z.number().min(0),
  status: PurchaseStatusSchema,
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().min(0.01),
    unit_price: z.number().min(0),
    subtotal: z.number().min(0),
  })),
  expected_date: z.string().datetime().optional(),
  received_date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Purchase = z.infer<typeof PurchaseSchema>;

// Account (Contas a Receber/Pagar) Schema
export const AccountTypeSchema = z.enum(['receivable', 'payable']);
export const AccountSchema = z.object({
  id: z.string().uuid(),
  type: AccountTypeSchema,
  description: z.string().min(2).max(500),
  amount: z.number(),
  due_date: z.string().datetime(),
  paid_date: z.string().datetime().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  client_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  invoice_id: z.string().uuid().optional(),
  purchase_id: z.string().uuid().optional(),
  payment_method: PaymentMethodSchema.optional(),
  notes: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Account = z.infer<typeof AccountSchema>;

// Expense Schema
export const ExpenseCategorySchema = z.enum([
  'rent', 'utilities', 'salaries', 'supplies', 'maintenance', 
  'taxes', 'insurance', 'marketing', 'transport', 'other'
]);
export const ExpenseSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(2).max(500),
  category: ExpenseCategorySchema,
  amount: z.number().min(0),
  payment_method: PaymentMethodSchema,
  expense_date: z.string().datetime(),
  supplier_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  receipt_number: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  created_at: z.string().datetime(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

// Employee Schema
export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(200),
  document: z.string().max(20), // CPF
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  position: z.string().max(100),
  department: z.string().max(100),
  salary: z.number().min(0),
  hire_date: z.string().datetime(),
  termination_date: z.string().datetime().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  zip_code: z.string().max(10).optional(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Employee = z.infer<typeof EmployeeSchema>;

// Stock Movement Schema
export const StockMovementSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  type: z.enum(['in', 'out', 'adjustment']),
  quantity: z.number(),
  unit_cost: z.number().min(0).optional(),
  reason: z.string().max(500),
  reference_id: z.string().uuid().optional(), // sale_id, purchase_id, etc
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
});
export type StockMovement = z.infer<typeof StockMovementSchema>;

// Budget/Quote Schema
export const BudgetStatusSchema = z.enum(['draft', 'sent', 'approved', 'rejected', 'expired', 'converted']);
export const BudgetSchema = z.object({
  id: z.string().uuid(),
  budget_number: z.number(),
  client_id: z.string().uuid(),
  user_id: z.string().uuid(),
  issue_date: z.string().datetime(),
  expiry_date: z.string().datetime(),
  total_amount: z.number().min(0),
  discount: z.number().min(0).default(0),
  final_amount: z.number().min(0),
  status: BudgetStatusSchema,
  items: z.array(z.object({
    product_id: z.string().uuid().optional(),
    description: z.string(),
    quantity: z.number().min(0.01),
    unit_price: z.number().min(0),
    subtotal: z.number().min(0),
  })),
  notes: z.string().max(1000).optional(),
  terms: z.string().max(2000).optional(),
  converted_sale_id: z.string().uuid().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Budget = z.infer<typeof BudgetSchema>;

// Service Order Schema
export const ServiceOrderStatusSchema = z.enum(['open', 'in_progress', 'waiting_parts', 'completed', 'cancelled']);
export const ServiceOrderPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent']);
export const ServiceOrderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.number(),
  client_id: z.string().uuid(),
  equipment: z.string().max(200),
  serial_number: z.string().max(100).optional(),
  reported_problem: z.string().max(1000),
  diagnosis: z.string().max(1000).optional(),
  solution: z.string().max(1000).optional(),
  status: ServiceOrderStatusSchema,
  priority: ServiceOrderPrioritySchema,
  assigned_to: z.string().uuid().optional(), // employee_id
  start_date: z.string().datetime(),
  estimated_completion: z.string().datetime().optional(),
  completion_date: z.string().datetime().optional(),
  labor_cost: z.number().min(0).default(0),
  parts_cost: z.number().min(0).default(0),
  total_cost: z.number().min(0).default(0),
  parts_used: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().min(0.01),
    unit_price: z.number().min(0),
    subtotal: z.number().min(0),
  })).optional(),
  notes: z.string().max(1000).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ServiceOrder = z.infer<typeof ServiceOrderSchema>;

// Contract Schema
export const ContractStatusSchema = z.enum(['draft', 'active', 'suspended', 'expired', 'cancelled']);
export const ContractTypeSchema = z.enum(['service', 'rental', 'supply', 'partnership', 'other']);
export const ContractSchema = z.object({
  id: z.string().uuid(),
  contract_number: z.string().max(50),
  title: z.string().max(200),
  type: ContractTypeSchema,
  client_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  value: z.number().min(0),
  payment_terms: z.string().max(500),
  status: ContractStatusSchema,
  auto_renew: z.boolean().default(false),
  renewal_notice_days: z.number().min(0).default(30),
  description: z.string().max(2000).optional(),
  terms: z.string().max(5000).optional(),
  responsible_user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Contract = z.infer<typeof ContractSchema>;

// Cost Center Schema
export const CostCenterSchema = z.object({
  id: z.string().uuid(),
  code: z.string().max(20),
  name: z.string().max(200),
  description: z.string().max(500).optional(),
  parent_id: z.string().uuid().optional(),
  budget: z.number().min(0).default(0),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type CostCenter = z.infer<typeof CostCenterSchema>;

// Chart of Accounts Schema
export const AccountTypeEnum = z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']);
export const ChartOfAccountSchema = z.object({
  id: z.string().uuid(),
  code: z.string().max(20),
  name: z.string().max(200),
  type: AccountTypeEnum,
  parent_id: z.string().uuid().optional(),
  level: z.number().min(1).max(5),
  accept_entries: z.boolean().default(true),
  description: z.string().max(500).optional(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ChartOfAccount = z.infer<typeof ChartOfAccountSchema>;

// Fixed Asset Schema
export const AssetStatusSchema = z.enum(['active', 'inactive', 'maintenance', 'disposed']);
export const FixedAssetSchema = z.object({
  id: z.string().uuid(),
  code: z.string().max(50),
  name: z.string().max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100),
  acquisition_date: z.string().datetime(),
  acquisition_value: z.number().min(0),
  useful_life_months: z.number().min(1),
  monthly_depreciation: z.number().min(0),
  accumulated_depreciation: z.number().min(0).default(0),
  residual_value: z.number().min(0).default(0),
  location: z.string().max(200).optional(),
  responsible_id: z.string().uuid().optional(), // employee_id
  status: AssetStatusSchema,
  disposal_date: z.string().datetime().optional(),
  disposal_value: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type FixedAsset = z.infer<typeof FixedAssetSchema>;

// Time Clock Schema
export const TimeClockSchema = z.object({
  id: z.string().uuid(),
  employee_id: z.string().uuid(),
  date: z.string().datetime(),
  clock_in: z.string().optional(), // HH:MM
  clock_out: z.string().optional(), // HH:MM
  lunch_start: z.string().optional(), // HH:MM
  lunch_end: z.string().optional(), // HH:MM
  total_hours: z.number().min(0).default(0),
  overtime_hours: z.number().min(0).default(0),
  notes: z.string().max(500).optional(),
  approved_by: z.string().uuid().optional(), // user_id
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type TimeClock = z.infer<typeof TimeClockSchema>;

// Production Order Schema
export const ProductionOrderStatusSchema = z.enum(['planned', 'in_progress', 'completed', 'cancelled']);
export const ProductionOrderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.number(),
  product_id: z.string().uuid(),
  product_name: z.string(),
  quantity: z.number().min(0.01),
  start_date: z.string().datetime(),
  expected_completion: z.string().datetime(),
  completion_date: z.string().datetime().optional(),
  status: ProductionOrderStatusSchema,
  materials: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity_needed: z.number().min(0.01),
    quantity_used: z.number().min(0).default(0),
  })),
  labor_hours: z.number().min(0).default(0),
  production_cost: z.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
  responsible_id: z.string().uuid().optional(), // employee_id
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ProductionOrder = z.infer<typeof ProductionOrderSchema>;
