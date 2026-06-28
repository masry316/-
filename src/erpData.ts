import { SheetConfig } from "./types";
import { CONTACTS_ERP_SHEETS } from "./erpDataCategoryContacts";
import { INVENTORY_ERP_SHEETS } from "./erpDataCategoryInventory";
import { SALES_ERP_SHEETS } from "./erpDataCategorySales";
import { PURCHASING_ERP_SHEETS } from "./erpDataCategoryPurchasing";
import { FINANCE_ERP_SHEETS } from "./erpDataCategoryFinance";
import { LOGS_ERP_SHEETS } from "./erpDataCategoryLogs";

export const INITIAL_ERP_SHEETS: SheetConfig[] = [
  // --- SYSTEM & ORG CATEGORY ---
  {
    id: "settings",
    name: "Settings",
    arabicName: "الإعدادات العامة",
    category: "System & Org",
    columns: [
      { key: "SettingID", label: "Setting ID", type: "string" },
      { key: "Parameter", label: "Parameter", type: "string" },
      { key: "Value", label: "Value", type: "string" },
      { key: "Description", label: "Description", type: "string" },
      { key: "LastUpdated", label: "Last Updated", type: "date" }
    ],
    rows: [
      { SettingID: "SET001", Parameter: "CompanyName", Value: "الدولية ستيل (International Steel)", Description: "Official Registered Name", LastUpdated: "2026-01-01" },
      { SettingID: "SET002", Parameter: "TaxNo", Value: "645-312-987", Description: "Corporate Tax Registration Number", LastUpdated: "2026-01-01" },
      { SettingID: "SET003", Parameter: "BaseCurrency", Value: "EGP", Description: "Egyptian Pound Base Currency", LastUpdated: "2026-01-01" },
      { SettingID: "SET004", Parameter: "FiscalYearStart", Value: "01-01", Description: "Start of Fiscal Year", LastUpdated: "2026-01-01" },
      { SettingID: "SET005", Parameter: "DefaultTaxRate", Value: "0.14", Description: "VAT Standard Rate 14%", LastUpdated: "2026-01-01" },
      { SettingID: "SET006", Parameter: "InventoryValuation", Value: "FIFO", Description: "First-In First-Out Valuation", LastUpdated: "2026-01-01" },
      { SettingID: "SET007", Parameter: "DefaultWarehouse", Value: "W001", Description: "Cairo Main Warehouse", LastUpdated: "2026-01-01" },
      { SettingID: "SET008", Parameter: "SystemStatus", Value: "Production", Description: "Current deployment environment status", LastUpdated: "2026-01-01" },
      { SettingID: "SET009", Parameter: "BackupInterval", Value: "Daily", Description: "Automated database backup frequency", LastUpdated: "2026-01-01" },
      { SettingID: "SET010", Parameter: "Version", Value: "v4.2.0-PROD", Description: "ERP Solution Version ID", LastUpdated: "2026-01-01" }
    ]
  },
  {
    id: "users",
    name: "Users",
    arabicName: "المستخدمين",
    category: "System & Org",
    columns: [
      { key: "UserID", label: "User ID", type: "string" },
      { key: "Username", label: "Username", type: "string" },
      { key: "FullName", label: "Full Name", type: "string" },
      { key: "Email", label: "Email", type: "string" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { UserID: "U001", Username: "admin.mahmoud", FullName: "Mahmoud Sobhy", Email: "mahmoudsobhyacc@gmail.com", Status: "Active" },
      { UserID: "U002", Username: "ahmed.steel", FullName: "Ahmed Mansour", Email: "ahmed.m@intlsteel.com", Status: "Active" },
      { UserID: "U003", Username: "sarah.finance", FullName: "Sarah Kamel", Email: "sarah.k@intlsteel.com", Status: "Active" },
      { UserID: "U004", Username: "mostafa.sales", FullName: "Mostafa Fawzy", Email: "mostafa.f@intlsteel.com", Status: "Active" },
      { UserID: "U005", Username: "yasser.warehouse", FullName: "Yasser Abdelhady", Email: "yasser.a@intlsteel.com", Status: "Active" },
      { UserID: "U006", Username: "tarek.purchase", FullName: "Tarek Hegazi", Email: "tarek.h@intlsteel.com", Status: "Active" },
      { UserID: "U007", Username: "mona.hr", FullName: "Mona El-Deeb", Email: "mona.e@intlsteel.com", Status: "Active" },
      { UserID: "U008", Username: "hassan.audit", FullName: "Hassan Khalifa", Email: "hassan.k@intlsteel.com", Status: "Active" },
      { UserID: "U009", Username: "guest.reviewer", FullName: "Reviewer Guest", Email: "reviewer@intlsteel.com", Status: "Inactive" },
      { UserID: "U010", Username: "layla.sales2", FullName: "Layla Shakir", Email: "layla.s@intlsteel.com", Status: "Active" }
    ]
  },
  {
    id: "roles",
    name: "Roles",
    arabicName: "الأدوار والصلاحيات",
    category: "System & Org",
    columns: [
      { key: "RoleID", label: "Role ID", type: "string" },
      { key: "RoleName", label: "Role Name", type: "string" },
      { key: "Description", label: "Description", type: "string" },
      { key: "AccessLevel", label: "Access Level", type: "string" },
      { key: "IsSystemRole", label: "Is System Role", type: "boolean" }
    ],
    rows: [
      { RoleID: "R001", RoleName: "Administrator", Description: "Full access to all modules and configurations", AccessLevel: "Level-10", IsSystemRole: true },
      { RoleID: "R002", RoleName: "Financial Manager", Description: "Full accounting, treasury, and tax management", AccessLevel: "Level-9", IsSystemRole: true },
      { RoleID: "R003", RoleName: "Inventory Controller", Description: "Manage warehouses, stocks, cuts, and movements", AccessLevel: "Level-8", IsSystemRole: true },
      { RoleID: "R004", RoleName: "Sales Executive", Description: "Process sales quotations, orders, and customer logs", AccessLevel: "Level-7", IsSystemRole: false },
      { RoleID: "R005", RoleName: "Purchasing Officer", Description: "Submit purchase requests, purchase orders, invoices", AccessLevel: "Level-7", IsSystemRole: false },
      { RoleID: "R006", RoleName: "General Cashier", Description: "Register cash/bank receipts, payments, bank transfers", AccessLevel: "Level-6", IsSystemRole: false },
      { RoleID: "R007", RoleName: "Auditor", Description: "Read-only access to all reports, audit logs, ledger", AccessLevel: "Level-5", IsSystemRole: true },
      { RoleID: "R008", RoleName: "HR Officer", Description: "Manage employees, departments, and payroll logs", AccessLevel: "Level-6", IsSystemRole: false },
      { RoleID: "R009", RoleName: "Warehouse Operator", Description: "Log physical stock takes and location movements", AccessLevel: "Level-4", IsSystemRole: false },
      { RoleID: "R010", RoleName: "Guest Account", Description: "Minimal read-only access to Settings only", AccessLevel: "Level-1", IsSystemRole: true }
    ]
  },
  {
    id: "employees",
    name: "Employees",
    arabicName: "الموظفين",
    category: "System & Org",
    columns: [
      { key: "EmployeeID", label: "Emp ID", type: "string" },
      { key: "FullName", label: "Full Name", type: "string" },
      { key: "DepartmentCode", label: "Dept Code", type: "string" },
      { key: "JobTitle", label: "Job Title", type: "string" },
      { key: "HireDate", label: "Hire Date", type: "date" }
    ],
    rows: [
      { EmployeeID: "E001", FullName: "Mahmoud Sobhy", DepartmentCode: "D001", JobTitle: "Executive Chairman", HireDate: "2020-01-15" },
      { EmployeeID: "E002", FullName: "Ahmed Mansour", DepartmentCode: "D002", JobTitle: "General Manager", HireDate: "2021-03-01" },
      { EmployeeID: "E003", FullName: "Sarah Kamel", DepartmentCode: "D003", JobTitle: "Chief Accountant", HireDate: "2022-06-12" },
      { EmployeeID: "E004", FullName: "Mostafa Fawzy", DepartmentCode: "D004", JobTitle: "Sales Director", HireDate: "2021-11-01" },
      { EmployeeID: "E005", FullName: "Yasser Abdelhady", DepartmentCode: "D005", JobTitle: "Logistics Manager", HireDate: "2023-02-10" },
      { EmployeeID: "E006", FullName: "Tarek Hegazi", DepartmentCode: "D006", JobTitle: "Procurement Lead", HireDate: "2022-09-15" },
      { EmployeeID: "E007", FullName: "Mona El-Deeb", DepartmentCode: "D007", JobTitle: "HR Director", HireDate: "2021-05-20" },
      { EmployeeID: "E008", FullName: "Hassan Khalifa", DepartmentCode: "D003", JobTitle: "Internal Auditor", HireDate: "2024-01-05" },
      { EmployeeID: "E009", FullName: "Amr Hegazi", DepartmentCode: "D005", JobTitle: "Warehouse Supervisor", HireDate: "2023-04-01" },
      { EmployeeID: "E010", FullName: "Layla Shakir", DepartmentCode: "D004", JobTitle: "Senior Sales Rep", HireDate: "2022-12-01" }
    ]
  },
  {
    id: "departments",
    name: "Departments",
    arabicName: "الأقسام الإدارية",
    category: "System & Org",
    columns: [
      { key: "DepartmentCode", label: "Dept Code", type: "string" },
      { key: "DepartmentName", label: "Department Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "ManagerID", label: "Manager ID", type: "string" },
      { key: "CostCenter", label: "Cost Center Code", type: "string" }
    ],
    rows: [
      { DepartmentCode: "D001", DepartmentName: "Executive Office", ArabicName: "المكتب التنفيذي", ManagerID: "E001", CostCenter: "CC100" },
      { DepartmentCode: "D002", DepartmentName: "General Management", ArabicName: "الإدارة العامة", ManagerID: "E002", CostCenter: "CC200" },
      { DepartmentCode: "D003", DepartmentName: "Finance & Accounts", ArabicName: "المالية والحسابات", ManagerID: "E003", CostCenter: "CC300" },
      { DepartmentCode: "D004", DepartmentName: "Sales & Marketing", ArabicName: "المبيعات والتسويق", ManagerID: "E004", CostCenter: "CC400" },
      { DepartmentCode: "D005", DepartmentName: "Logistics & Warehouses", ArabicName: "الخدمات اللوجستية والمستودعات", ManagerID: "E005", CostCenter: "CC500" },
      { DepartmentCode: "D006", DepartmentName: "Procurement & Purchasing", ArabicName: "المشتريات والتعاقدات", ManagerID: "E006", CostCenter: "CC600" },
      { DepartmentCode: "D007", DepartmentName: "Human Resources", ArabicName: "الموارد البشرية", ManagerID: "E007", CostCenter: "CC700" },
      { DepartmentCode: "D008", DepartmentName: "Quality Assurance", ArabicName: "توكيد الجودة الفنية", ManagerID: "E008", CostCenter: "CC800" },
      { DepartmentCode: "D009", DepartmentName: "Operations & Processing", ArabicName: "العمليات والتشغيل والتجهيز", ManagerID: "E009", CostCenter: "CC900" },
      { DepartmentCode: "D010", DepartmentName: "IT Support", ArabicName: "نظم المعلومات والدعم الفني", ManagerID: "E002", CostCenter: "CC110" }
    ]
  },
  {
    id: "currencies",
    name: "Currencies",
    arabicName: "العملات والأسعار",
    category: "System & Org",
    columns: [
      { key: "CurrencyCode", label: "Currency Code", type: "string" },
      { key: "CurrencyName", label: "Currency Name", type: "string" },
      { key: "ExchangeRate", label: "Exchange Rate (to EGP)", type: "number" },
      { key: "Symbol", label: "Symbol", type: "string" },
      { key: "IsBase", label: "Is Base Currency", type: "boolean" }
    ],
    rows: [
      { CurrencyCode: "EGP", CurrencyName: "Egyptian Pound", ExchangeRate: 1.00, Symbol: "ج.م", IsBase: true },
      { CurrencyCode: "USD", CurrencyName: "US Dollar", ExchangeRate: 48.50, Symbol: "$", IsBase: false },
      { CurrencyCode: "EUR", CurrencyName: "Euro", ExchangeRate: 52.20, Symbol: "€", IsBase: false },
      { CurrencyCode: "CNY", CurrencyName: "Chinese Yuan", ExchangeRate: 6.75, Symbol: "¥", IsBase: false },
      { CurrencyCode: "GBP", CurrencyName: "British Pound", ExchangeRate: 61.30, Symbol: "£", IsBase: false },
      { CurrencyCode: "AED", CurrencyName: "UAE Dirham", ExchangeRate: 13.20, Symbol: "د.إ", IsBase: false },
      { CurrencyCode: "SAR", CurrencyName: "Saudi Riyal", ExchangeRate: 12.92, Symbol: "ر.س", IsBase: false },
      { CurrencyCode: "JPY", CurrencyName: "Japanese Yen", ExchangeRate: 0.32, Symbol: "¥", IsBase: false },
      { CurrencyCode: "CHF", CurrencyName: "Swiss Franc", ExchangeRate: 54.10, Symbol: "₣", IsBase: false },
      { CurrencyCode: "INR", CurrencyName: "Indian Rupee", ExchangeRate: 0.58, Symbol: "₹", IsBase: false }
    ]
  },
  {
    id: "taxes",
    name: "Taxes",
    arabicName: "الضرائب المعتمدة",
    category: "System & Org",
    columns: [
      { key: "TaxCode", label: "Tax Code", type: "string" },
      { key: "TaxName", label: "Tax Name", type: "string" },
      { key: "TaxRate", label: "Tax Rate", type: "number" },
      { key: "Description", label: "Description", type: "string" },
      { key: "IsActive", label: "Is Active", type: "boolean" }
    ],
    rows: [
      { TaxCode: "VAT14", TaxName: "Value Added Tax 14%", TaxRate: 0.14, Description: "Standard VAT applied on trading", IsActive: true },
      { TaxCode: "WHT01", TaxName: "Withholding Tax 1%", TaxRate: 0.01, Description: "Applied on steel material purchases", IsActive: true },
      { TaxCode: "WHT03", TaxName: "Withholding Tax 3%", TaxRate: 0.03, Description: "Applied on steel cutting services", IsActive: true },
      { TaxCode: "VAT05", TaxName: "VAT Export Rate 5%", TaxRate: 0.05, Description: "Reduced VAT for specific services", IsActive: true },
      { TaxCode: "TAXEX", TaxName: "Tax Exempt", TaxRate: 0.00, Description: "Exempted sales or government contracts", IsActive: true },
      { TaxCode: "VAT00", TaxName: "Zero VAT", TaxRate: 0.00, Description: "Export sales standard rate", IsActive: true },
      { TaxCode: "CUST10", TaxName: "Customs Duty 10%", TaxRate: 0.10, Description: "Applied during steel importation", IsActive: true },
      { TaxCode: "CUST05", TaxName: "Customs Duty 5%", TaxRate: 0.05, Description: "Reduced customs for raw steel blocks", IsActive: true },
      { TaxCode: "EDTAX", TaxName: "Educational/Surcharge", TaxRate: 0.005, Description: "Surcharge for development funds", IsActive: true },
      { TaxCode: "ENVTAX", TaxName: "Environmental Surcharge", TaxRate: 0.02, Description: "Carbon footprint steel trading tax", IsActive: true }
    ]
  },
  {
    id: "paymentTerms",
    name: "PaymentTerms",
    arabicName: "شروط الدفع والتحصيل",
    category: "System & Org",
    columns: [
      { key: "TermCode", label: "Term Code", type: "string" },
      { key: "TermName", label: "Term Name", type: "string" },
      { key: "DaysDue", label: "Days Due", type: "number" },
      { key: "DiscountPercent", label: "Discount %", type: "number" },
      { key: "IsDefault", label: "Is Default", type: "boolean" }
    ],
    rows: [
      { TermCode: "CASH", TermName: "Cash On Delivery (COD)", DaysDue: 0, DiscountPercent: 0, IsDefault: true },
      { TermCode: "NET15", TermName: "Net 15 Days", DaysDue: 15, DiscountPercent: 0, IsDefault: false },
      { TermCode: "NET30", TermName: "Net 30 Days", DaysDue: 30, DiscountPercent: 0, IsDefault: false },
      { TermCode: "NET45", TermName: "Net 45 Days", DaysDue: 45, DiscountPercent: 0, IsDefault: false },
      { TermCode: "NET60", TermName: "Net 60 Days", DaysDue: 60, DiscountPercent: 0, IsDefault: false },
      { TermCode: "2/10_NET30", TermName: "2% Discount if paid within 10 days", DaysDue: 30, DiscountPercent: 0.02, IsDefault: false },
      { TermCode: "ADV50", TermName: "50% Advance, 50% on Delivery", DaysDue: 7, DiscountPercent: 0, IsDefault: false },
      { TermCode: "ADV100", TermName: "100% Full Advance Payment", DaysDue: 0, DiscountPercent: 0.01, IsDefault: false },
      { TermCode: "LC_90D", TermName: "Letter of Credit (LC) 90 Days", DaysDue: 90, DiscountPercent: 0, IsDefault: false },
      { TermCode: "LC_120D", TermName: "Letter of Credit (LC) 120 Days", DaysDue: 120, DiscountPercent: 0, IsDefault: false }
    ]
  },
  {
    id: "documentTypes",
    name: "DocumentTypes",
    arabicName: "أنواع المستندات المالية",
    category: "System & Org",
    columns: [
      { key: "DocTypeCode", label: "Doc Type Code", type: "string" },
      { key: "DocTypeName", label: "Document Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "SeriesPrefix", label: "Series Prefix", type: "string" },
      { key: "IsActive", label: "Is Active", type: "boolean" }
    ],
    rows: [
      { DocTypeCode: "SQ", DocTypeName: "Sales Quotation", ArabicName: "عرض سعر مبيعات", SeriesPrefix: "SQ-2026-", IsActive: true },
      { DocTypeCode: "SO", DocTypeName: "Sales Order", ArabicName: "أمر مبيعات", SeriesPrefix: "SO-2026-", IsActive: true },
      { DocTypeCode: "SI", DocTypeName: "Sales Invoice", ArabicName: "فاتورة مبيعات", SeriesPrefix: "SI-2026-", IsActive: true },
      { DocTypeCode: "PR", DocTypeName: "Purchase Request", ArabicName: "طلب شراء", SeriesPrefix: "PR-2026-", IsActive: true },
      { DocTypeCode: "PO", DocTypeName: "Purchase Order", ArabicName: "أمر توريد شراء", SeriesPrefix: "PO-2026-", IsActive: true },
      { DocTypeCode: "PI", DocTypeName: "Purchase Invoice", ArabicName: "فاتورة مشتريات", SeriesPrefix: "PI-2026-", IsActive: true },
      { DocTypeCode: "IM", DocTypeName: "Inventory Movement", ArabicName: "حركة مخزنية", SeriesPrefix: "IM-2026-", IsActive: true },
      { DocTypeCode: "RC", DocTypeName: "Receipt Voucher", ArabicName: "سند قبض نقدي/بنكي", SeriesPrefix: "RC-2026-", IsActive: true },
      { DocTypeCode: "PV", DocTypeName: "Payment Voucher", ArabicName: "سند صرف نقدي/بنكي", SeriesPrefix: "PV-2026-", IsActive: true },
      { DocTypeCode: "ST", DocTypeName: "Stock Transfer", ArabicName: "تحويل مخزني داخلي", SeriesPrefix: "ST-2026-", IsActive: true }
    ]
  }
];

export const ALL_ERP_SHEETS: SheetConfig[] = [
  ...INITIAL_ERP_SHEETS,
  ...CONTACTS_ERP_SHEETS,
  ...INVENTORY_ERP_SHEETS,
  ...SALES_ERP_SHEETS,
  ...PURCHASING_ERP_SHEETS,
  ...FINANCE_ERP_SHEETS,
  ...LOGS_ERP_SHEETS
];

