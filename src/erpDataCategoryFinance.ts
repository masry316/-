import { SheetConfig } from "./types";

export const FINANCE_ERP_SHEETS: SheetConfig[] = [
  {
    id: "receipts",
    name: "Receipts",
    arabicName: "سندات القبض الواردة",
    category: "Finance & Treasury",
    columns: [
      { key: "ReceiptNo", label: "Receipt No", type: "string" },
      { key: "CustomerCode", label: "Customer", type: "string" },
      { key: "ReceiptDate", label: "Receipt Date", type: "date" },
      { key: "Amount", label: "Amount Received", type: "currency" },
      { key: "PaymentMode", label: "Mode (Cash/Bank)", type: "string" },
      { key: "CashAccountCode", label: "Cash Account", type: "string" },
      { key: "BankCode", label: "Bank Account", type: "string" },
      { key: "ReferenceNo", label: "Reference/Check No", type: "string" }
    ],
    rows: [
      { ReceiptNo: "RC-2026-001", CustomerCode: "C001", ReceiptDate: "2026-01-16", Amount: 129960, PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", BankCode: "", ReferenceNo: "CASH-SI-001" },
      { ReceiptNo: "RC-2026-002", CustomerCode: "C002", ReceiptDate: "2026-01-19", Amount: 100000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_EGP", ReferenceNo: "TRF-920193" },
      { ReceiptNo: "RC-2026-003", CustomerCode: "C003", ReceiptDate: "2026-01-22", Amount: 63840, PaymentMode: "Bank", CashAccountCode: "", BankCode: "QNB_EGP", ReferenceNo: "CHK-40291" },
      { ReceiptNo: "RC-2026-004", CustomerCode: "C005", ReceiptDate: "2026-01-26", Amount: 467400, PaymentMode: "Bank", CashAccountCode: "", BankCode: "NBE_EGP", ReferenceNo: "TRF-881923" },
      { ReceiptNo: "RC-2026-005", CustomerCode: "C007", ReceiptDate: "2026-02-02", Amount: 200000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_EGP", ReferenceNo: "CHK-55092" },
      { ReceiptNo: "RC-2026-006", CustomerCode: "C009", ReceiptDate: "2026-02-12", Amount: 25080, PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", BankCode: "", ReferenceNo: "CASH-SI-008" },
      { ReceiptNo: "RC-2026-007", CustomerCode: "C001", ReceiptDate: "2026-02-22", Amount: 129960, PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", BankCode: "", ReferenceNo: "CASH-SI-010" },
      { ReceiptNo: "RC-2026-008", CustomerCode: "C002", ReceiptDate: "2026-03-01", Amount: 150000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_EGP", ReferenceNo: "TRF-402192" },
      { ReceiptNo: "RC-2026-009", CustomerCode: "C003", ReceiptDate: "2026-03-05", Amount: 80000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "QNB_EGP", ReferenceNo: "CHK-99102" },
      { ReceiptNo: "RC-2026-010", CustomerCode: "C005", ReceiptDate: "2026-03-10", Amount: 300000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "NBE_EGP", ReferenceNo: "TRF-309210" }
    ]
  },
  {
    id: "payments",
    name: "Payments",
    arabicName: "سندات الصرف الصادرة",
    category: "Finance & Treasury",
    columns: [
      { key: "PaymentNo", label: "Payment No", type: "string" },
      { key: "SupplierCode", label: "Supplier", type: "string" },
      { key: "PaymentDate", label: "Payment Date", type: "date" },
      { key: "Amount", label: "Amount Paid", type: "currency" },
      { key: "PaymentMode", label: "Mode (Cash/Bank)", type: "string" },
      { key: "CashAccountCode", label: "Cash Account", type: "string" },
      { key: "BankCode", label: "Bank Account", type: "string" },
      { key: "ReferenceNo", label: "Reference/Check No", type: "string" }
    ],
    rows: [
      { PaymentNo: "PV-2026-001", SupplierCode: "S001", PaymentDate: "2026-01-11", Amount: 345146, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_USD", ReferenceNo: "TRF-ES-9102" },
      { PaymentNo: "PV-2026-002", SupplierCode: "S003", PaymentDate: "2026-01-16", Amount: 176928, PaymentMode: "Bank", CashAccountCode: "", BankCode: "AAIB_USD", ReferenceNo: "TRF-IN-2019" },
      { PaymentNo: "PV-2026-003", SupplierCode: "S004", PaymentDate: "2026-01-19", Amount: 442320, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_USD", ReferenceNo: "TRF-JP-8021" },
      { PaymentNo: "PV-2026-004", SupplierCode: "S006", PaymentDate: "2026-01-21", Amount: 199044, PaymentMode: "Bank", CashAccountCode: "", BankCode: "AAIB_USD", ReferenceNo: "TRF-TW-3901" },
      { PaymentNo: "PV-2026-005", SupplierCode: "S008", PaymentDate: "2026-01-23", Amount: 100000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "NBE_EUR", ReferenceNo: "CHK-GER-409" },
      { PaymentNo: "PV-2026-006", SupplierCode: "S010", PaymentDate: "2026-01-26", Amount: 27930, PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", BankCode: "", ReferenceNo: "CASH-PI-007" },
      { PaymentNo: "PV-2026-007", SupplierCode: "S010", PaymentDate: "2026-01-29", Amount: 13452, PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", BankCode: "", ReferenceNo: "CASH-PI-008" },
      { PaymentNo: "PV-2026-008", SupplierCode: "S001", PaymentDate: "2026-02-15", Amount: 500000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "CIB_USD", ReferenceNo: "TRF-ES-1022" },
      { PaymentNo: "PV-2026-009", SupplierCode: "S002", PaymentDate: "2026-02-20", Amount: 800000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "NBE_EUR", ReferenceNo: "TRF-FI-3091" },
      { PaymentNo: "PV-2026-010", SupplierCode: "S005", PaymentDate: "2026-02-25", Amount: 400000, PaymentMode: "Bank", CashAccountCode: "", BankCode: "AAIB_USD", ReferenceNo: "TRF-CN-4019" }
    ]
  },
  {
    id: "checks",
    name: "Checks",
    arabicName: "الشيكات البنكية الصادرة والواردة",
    category: "Finance & Treasury",
    columns: [
      { key: "CheckNumber", label: "Check Number", type: "string" },
      { key: "BankCode", label: "Bank Code", type: "string" },
      { key: "Type", label: "Type (Pay/Rec)", type: "string" },
      { key: "Issuer", label: "Issuer Name", type: "string" },
      { key: "Beneficiary", label: "Beneficiary Name", type: "string" },
      { key: "Amount", label: "Amount", type: "currency" },
      { key: "DueDate", label: "Due/Maturity Date", type: "date" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { CheckNumber: "CHK-40291", BankCode: "QNB_EGP", Type: "Received", Issuer: "Alexandria Piping Co.", Beneficiary: "الدولية ستيل", Amount: 63840, DueDate: "2026-02-15", Status: "Cleared" },
      { CheckNumber: "CHK-55092", BankCode: "CIB_EGP", Type: "Received", Issuer: "Suez Petrochemicals Contracting", Beneficiary: "الدولية ستيل", Amount: 200000, DueDate: "2026-02-28", Status: "Cleared" },
      { CheckNumber: "CHK-GER-409", BankCode: "NBE_EUR", Type: "Paid", Issuer: "الدولية ستيل", Beneficiary: "ThyssenKrupp Materials", Amount: 100000, DueDate: "2026-03-01", Status: "Cleared" },
      { CheckNumber: "CHK-99102", BankCode: "QNB_EGP", Type: "Received", Issuer: "Alexandria Piping Co.", Beneficiary: "الدولية ستيل", Amount: 80000, DueDate: "2026-03-15", Status: "Cleared" },
      { CheckNumber: "CHK-90218", BankCode: "BM_EGP", Type: "Received", Issuer: "Cairo Stainless Steel Trade", Beneficiary: "الدولية ستيل", Amount: 250000, DueDate: "2026-03-30", Status: "Under Collection" },
      { CheckNumber: "CHK-10291", BankCode: "CIB_EGP", Type: "Paid", Issuer: "الدولية ستيل", Beneficiary: "Local Steel Trading Co.", Amount: 150000, DueDate: "2026-04-05", Status: "Issued" },
      { CheckNumber: "CHK-30491", BankCode: "BM_EGP", Type: "Paid", Issuer: "الدولية ستيل", Beneficiary: "Customs Authority Egypt", Amount: 75000, DueDate: "2026-04-10", Status: "Issued" },
      { CheckNumber: "CHK-88102", BankCode: "NBE_EGP", Type: "Received", Issuer: "Al-Nasr Metal Industries", Beneficiary: "الدولية ستيل", Amount: 110000, DueDate: "2026-04-20", Status: "Under Collection" },
      { CheckNumber: "CHK-20391", BankCode: "QNB_EGP", Type: "Paid", Issuer: "الدولية ستيل", Beneficiary: "Tax Authority Egypt", Amount: 35000, DueDate: "2026-04-25", Status: "Issued" },
      { CheckNumber: "CHK-55910", BankCode: "HSBC_EGP", Type: "Received", Issuer: "Pioneer Kitchen Equipment Co.", Beneficiary: "الدولية ستيل", Amount: 90000, DueDate: "2026-05-01", Status: "Post-Dated" }
    ]
  },
  {
    id: "bankTransfers",
    name: "BankTransfers",
    arabicName: "التحويلات البنكية الداخلية",
    category: "Finance & Treasury",
    columns: [
      { key: "TransferID", label: "Transfer ID", type: "string" },
      { key: "SourceBank", label: "Source Bank Code", type: "string" },
      { key: "DestinationBank", label: "Dest Bank Code", type: "string" },
      { key: "Amount", label: "Amount Transferred", type: "currency" },
      { key: "TransferDate", label: "Transfer Date", type: "date" },
      { key: "Charges", label: "Charges/Fees", type: "currency" },
      { key: "ApprovedBy", label: "Approved By", type: "string" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { TransferID: "BT-001", SourceBank: "CIB_EGP", DestinationBank: "NBE_EGP", Amount: 300000, TransferDate: "2026-01-15", Charges: 50, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-002", SourceBank: "NBE_EGP", DestinationBank: "QNB_EGP", Amount: 150000, TransferDate: "2026-01-28", Charges: 25, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-003", SourceBank: "QNB_EGP", DestinationBank: "BM_EGP", Amount: 100000, TransferDate: "2026-02-05", Charges: 20, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-004", SourceBank: "BM_EGP", DestinationBank: "HSBC_EGP", Amount: 50000, TransferDate: "2026-02-12", Charges: 15, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-005", SourceBank: "CIB_USD", DestinationBank: "AAIB_USD", Amount: 25000, TransferDate: "2026-02-20", Charges: 10, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-006", SourceBank: "AAIB_USD", DestinationBank: "CIB_USD", Amount: 15000, TransferDate: "2026-03-01", Charges: 10, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-007", SourceBank: "NBE_EGP", DestinationBank: "AAIB_EGP", Amount: 200000, TransferDate: "2026-03-05", Charges: 35, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-008", SourceBank: "AAIB_EGP", DestinationBank: "ADIB_EGP", Amount: 80000, TransferDate: "2026-03-12", Charges: 20, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-009", SourceBank: "CIB_EGP", DestinationBank: "BM_EGP", Amount: 120000, TransferDate: "2026-03-18", Charges: 30, ApprovedBy: "E003", Status: "Completed" },
      { TransferID: "BT-010", SourceBank: "QNB_EGP", DestinationBank: "CIB_EGP", Amount: 250000, TransferDate: "2026-03-25", Charges: 40, ApprovedBy: "E003", Status: "Completed" }
    ]
  },
  {
    id: "expenses",
    name: "Expenses",
    arabicName: "المصاريف والتكاليف العامة",
    category: "Finance & Treasury",
    columns: [
      { key: "ExpenseNo", label: "Expense No", type: "string" },
      { key: "CategoryCode", label: "Category", type: "string" },
      { key: "ExpenseDate", label: "Date", type: "date" },
      { key: "Amount", label: "Amount Paid", type: "currency" },
      { key: "PaidTo", label: "Paid To", type: "string" },
      { key: "PaymentMode", label: "Payment Mode", type: "string" },
      { key: "CashAccountCode", label: "Cash Safe", type: "string" },
      { key: "ApprovedBy", label: "Approved By", type: "string" }
    ],
    rows: [
      { ExpenseNo: "EXP-2026-001", CategoryCode: "SALARY", ExpenseDate: "2026-01-30", Amount: 423000, PaidTo: "Company Employees", PaymentMode: "Bank", CashAccountCode: "", ApprovedBy: "E001" },
      { ExpenseNo: "EXP-2026-002", CategoryCode: "RENT", ExpenseDate: "2026-01-01", Amount: 60000, PaidTo: "Obour Yards Owner", PaymentMode: "Bank", CashAccountCode: "", ApprovedBy: "E002" },
      { ExpenseNo: "EXP-2026-003", CategoryCode: "UTILITY", ExpenseDate: "2026-01-05", Amount: 18500, PaidTo: "North Cairo Electricity Co", PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", ApprovedBy: "E003" },
      { ExpenseNo: "EXP-2026-004", CategoryCode: "CUSTOM", ExpenseDate: "2026-01-12", Amount: 145000, PaidTo: "Egyptian Customs Authority", PaymentMode: "Bank", CashAccountCode: "", ApprovedBy: "E002" },
      { ExpenseNo: "EXP-2026-005", CategoryCode: "FREIGHT", ExpenseDate: "2026-01-15", Amount: 45000, PaidTo: "Nile Shipping & Transport", PaymentMode: "Cash", CashAccountCode: "SAFE_MAIN_EGP", ApprovedBy: "E005" },
      { ExpenseNo: "EXP-2026-006", CategoryCode: "CUT_SERV", ExpenseDate: "2026-01-18", Amount: 22000, PaidTo: "Laser Cutting Workshop Obour", PaymentMode: "Cash", CashAccountCode: "SAFE_CUST_2", ApprovedBy: "E005" },
      { ExpenseNo: "EXP-2026-007", CategoryCode: "OFF_SUP", ExpenseDate: "2026-01-22", Amount: 4800, PaidTo: "Samir & Ali Stationery", PaymentMode: "Cash", CashAccountCode: "SAFE_CUST_1", ApprovedBy: "E007" },
      { ExpenseNo: "EXP-2026-008", CategoryCode: "COMM", ExpenseDate: "2026-01-25", Amount: 15300, PaidTo: "Telecom Egypt WE", PaymentMode: "Cash", CashAccountCode: "SAFE_CUST_1", ApprovedBy: "E007" },
      { ExpenseNo: "EXP-2026-009", CategoryCode: "FUEL", ExpenseDate: "2026-01-28", Amount: 8500, PaidTo: "Copetrole Gas Station", PaymentMode: "Cash", CashAccountCode: "SAFE_CUST_2", ApprovedBy: "E005" },
      { ExpenseNo: "EXP-2026-010", CategoryCode: "MAINT", ExpenseDate: "2026-02-02", Amount: 12500, PaidTo: "Overhead Crane Repair Co", PaymentMode: "Cash", CashAccountCode: "SAFE_CUST_2", ApprovedBy: "E005" }
    ]
  },
  {
    id: "expenseCategories",
    name: "ExpenseCategories",
    arabicName: "تصنيفات المصاريف",
    category: "Finance & Treasury",
    columns: [
      { key: "CategoryCode", label: "Category Code", type: "string" },
      { key: "CategoryName", label: "Category Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "GLAccount", label: "GL Expense Account", type: "string" },
      { key: "IsOperating", label: "Is Operating Expense", type: "boolean" }
    ],
    rows: [
      { CategoryCode: "SALARY", CategoryName: "Salaries and Wages", ArabicName: "الرواتب والأجور والمكافآت", GLAccount: "5101-01", IsOperating: true },
      { CategoryCode: "RENT", CategoryName: "Warehouse and Office Rent", ArabicName: "إيجارات المكاتب والمستودعات", GLAccount: "5102-01", IsOperating: true },
      { CategoryCode: "UTILITY", CategoryName: "Utilities (Water, Power)", ArabicName: "مياه وإنارة وكهرباء وطاقة", GLAccount: "5103-01", IsOperating: true },
      { CategoryCode: "CUSTOM", CategoryName: "Customs and Clearing Fees", ArabicName: "الرسوم الجمركية والتخليص", GLAccount: "5104-01", IsOperating: false },
      { CategoryCode: "FREIGHT", CategoryName: "Freight and Steel Transport", ArabicName: "مصاريف الشحن والنقل والمشاولات", GLAccount: "5105-01", IsOperating: true },
      { CategoryCode: "CUT_SERV", CategoryName: "Steel Laser Cutting Services", ArabicName: "خدمات وقص وتجهيز ألواح الإستيل", GLAccount: "5106-01", IsOperating: true },
      { CategoryCode: "OFF_SUP", CategoryName: "Office Supplies & Stationery", ArabicName: "مستلزمات مكتبية ومطبوعات وقرطاسية", GLAccount: "5107-01", IsOperating: true },
      { CategoryCode: "COMM", CategoryName: "Telecommunications & Internet", ArabicName: "مصاريف البريد والاتصالات والإنترنت", GLAccount: "5108-01", IsOperating: true },
      { CategoryCode: "FUEL", CategoryName: "Fuel and Transport Charging", ArabicName: "وقود وزيوت ومصاريف سيارات النقل", GLAccount: "5109-01", IsOperating: true },
      { CategoryCode: "MAINT", CategoryName: "Equipment & Machinery Repair", ArabicName: "صيانة الآلات والرافعات والمعدات", GLAccount: "5110-01", IsOperating: true }
    ]
  },
  {
    id: "revenues",
    name: "Revenues",
    arabicName: "الإيرادات والمقبوضات العامة",
    category: "Finance & Treasury",
    columns: [
      { key: "RevenueNo", label: "Revenue No", type: "string" },
      { key: "RevenueSource", label: "Revenue Source", type: "string" },
      { key: "RevenueDate", label: "Date", type: "date" },
      { key: "Amount", label: "Amount Earned", type: "currency" },
      { key: "GLAccountCode", label: "GL Account Code", type: "string" },
      { key: "PaymentMode", label: "Mode", type: "string" },
      { key: "ReferenceNo", label: "Ref Document No", type: "string" },
      { key: "CollectedBy", label: "Collected By", type: "string" }
    ],
    rows: [
      { RevenueNo: "REV-2026-001", RevenueSource: "Standard Steel Sheets Sales", RevenueDate: "2026-01-15", Amount: 114000, GLAccountCode: "4101-01", PaymentMode: "Cash", ReferenceNo: "SI-2026-001", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-002", RevenueSource: "Standard Steel Sheets Sales", RevenueDate: "2026-01-18", Amount: 100000, GLAccountCode: "4101-01", PaymentMode: "Bank", ReferenceNo: "SI-2026-002", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-003", RevenueSource: "Stainless Steel Sheets Sales", RevenueDate: "2026-01-20", Amount: 56000, GLAccountCode: "4101-02", PaymentMode: "Bank", ReferenceNo: "SI-2026-003", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-004", RevenueSource: "Steel Coils Sales Batch", RevenueDate: "2026-01-25", Amount: 410000, GLAccountCode: "4102-01", PaymentMode: "Bank", ReferenceNo: "SI-2026-005", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-005", RevenueSource: "Cut Remnants & Leftovers", RevenueDate: "2026-01-28", Amount: 8500, GLAccountCode: "4106-01", PaymentMode: "Cash", ReferenceNo: "CASH-REC-01", CollectedBy: "E005" },
      { RevenueNo: "REV-2026-006", RevenueSource: "Steel Laser Cutting Commission", RevenueDate: "2026-02-02", Amount: 4500, GLAccountCode: "4107-01", PaymentMode: "Cash", ReferenceNo: "CASH-REC-02", CollectedBy: "E005" },
      { RevenueNo: "REV-2026-007", RevenueSource: "Steel Seamless Pipes Sales", RevenueDate: "2026-02-05", Amount: 120000, GLAccountCode: "4103-01", PaymentMode: "Bank", ReferenceNo: "TRF-REC-03", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-008", RevenueSource: "Steel Welded Tubes Sales", RevenueDate: "2026-02-12", Amount: 22000, GLAccountCode: "4103-02", PaymentMode: "Cash", ReferenceNo: "SI-2026-008", CollectedBy: "E003" },
      { RevenueNo: "REV-2026-009", RevenueSource: "Leftovers Scrap Clearance", RevenueDate: "2026-02-20", Amount: 15400, GLAccountCode: "4106-01", PaymentMode: "Cash", ReferenceNo: "CASH-REC-04", CollectedBy: "E005" },
      { RevenueNo: "REV-2026-010", RevenueSource: "Standard Steel Sheets Sales", RevenueDate: "2026-02-25", Amount: 114000, GLAccountCode: "4101-01", PaymentMode: "Cash", ReferenceNo: "SI-2026-010", CollectedBy: "E003" }
    ]
  },
  {
    id: "financialTransactions",
    name: "FinancialTransactions",
    arabicName: "القيود والقيود المحاسبية",
    category: "Finance & Treasury",
    columns: [
      { key: "TransactionID", label: "Trans ID", type: "string" },
      { key: "GLAccountCode", label: "GL Account", type: "string" },
      { key: "ReferenceNo", label: "Ref Document", type: "string" },
      { key: "Debit", label: "Debit (Dr)", type: "currency" },
      { key: "Credit", label: "Credit (Cr)", type: "currency" },
      { key: "TransactionDate", label: "Date", type: "date" },
      { key: "Description", label: "Narration/Description", type: "string" }
    ],
    rows: [
      { TransactionID: "FT-2026-001", GLAccountCode: "1101-01 (Cash Cairo)", ReferenceNo: "RC-2026-001", Debit: 129960, Credit: 0, TransactionDate: "2026-01-16", Description: "Payment from Al-Nasr C001 for Inv SI-001" },
      { TransactionID: "FT-2026-002", GLAccountCode: "1201-01 (AR Customers)", ReferenceNo: "RC-2026-001", Debit: 0, Credit: 129960, TransactionDate: "2026-01-16", Description: "Payment from Al-Nasr C001 for Inv SI-001" },
      { TransactionID: "FT-2026-003", GLAccountCode: "1102-01 (CIB Bank)", ReferenceNo: "RC-2026-002", Debit: 100000, Credit: 0, TransactionDate: "2026-01-19", Description: "Partial payment Cairo Stainless SI-002" },
      { TransactionID: "FT-2026-004", GLAccountCode: "1201-01 (AR Customers)", ReferenceNo: "RC-2026-002", Debit: 0, Credit: 100000, TransactionDate: "2026-01-19", Description: "Partial payment Cairo Stainless SI-002" },
      { TransactionID: "FT-2026-005", GLAccountCode: "2101-01 (AP Suppliers)", ReferenceNo: "PV-2026-001", Debit: 345146, Credit: 0, TransactionDate: "2026-01-11", Description: "Paid Spanish steel mill Acerinox PI-001" },
      { TransactionID: "FT-2026-006", GLAccountCode: "1102-02 (CIB USD)", ReferenceNo: "PV-2026-001", Debit: 0, Credit: 345146, TransactionDate: "2026-01-11", Description: "Paid Spanish steel mill Acerinox PI-001" },
      { TransactionID: "FT-2026-007", GLAccountCode: "5101-01 (Salary Expense)", ReferenceNo: "EXP-2026-001", Debit: 423000, Credit: 0, TransactionDate: "2026-01-30", Description: "Monthly payroll bank disbursement E001-E010" },
      { TransactionID: "FT-2026-008", GLAccountCode: "1102-03 (NBE Bank)", ReferenceNo: "EXP-2026-001", Debit: 0, Credit: 423000, TransactionDate: "2026-01-30", Description: "Monthly payroll bank disbursement E001-E010" },
      { TransactionID: "FT-2026-009", GLAccountCode: "5102-01 (Rent Expense)", ReferenceNo: "EXP-2026-002", Debit: 60000, Credit: 0, TransactionDate: "2026-01-01", Description: "Rent payment for obour warehouses" },
      { TransactionID: "FT-2026-010", GLAccountCode: "1102-01 (CIB Bank)", ReferenceNo: "EXP-2026-002", Debit: 0, Credit: 60000, TransactionDate: "2026-01-01", Description: "Rent payment for obour warehouses" }
    ]
  }
];
