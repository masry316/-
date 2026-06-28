import { SheetConfig } from "./types";

export const CONTACTS_ERP_SHEETS: SheetConfig[] = [
  {
    id: "customers",
    name: "Customers",
    arabicName: "العملاء",
    category: "Contacts & Accounts",
    columns: [
      { key: "CustomerCode", label: "Cust Code", type: "string" },
      { key: "CustomerName", label: "Customer Name (EN)", type: "string" },
      { key: "ArabicName", label: "Customer Name (AR)", type: "string" },
      { key: "TaxNumber", label: "Tax Number", type: "string" },
      { key: "CreditLimit", label: "Credit Limit", type: "currency" },
      { key: "ActiveStatus", label: "Status", type: "string" }
    ],
    rows: [
      { CustomerCode: "C001", CustomerName: "Al-Nasr Metal Industries", ArabicName: "صناعات النصر المعدنية", TaxNumber: "512-409-723", CreditLimit: 500000, ActiveStatus: "Active" },
      { CustomerCode: "C002", CustomerName: "Cairo Stainless Steel Trade", ArabicName: "القاهرة لتجارة الإستيل", TaxNumber: "119-382-764", CreditLimit: 1200000, ActiveStatus: "Active" },
      { CustomerCode: "C003", CustomerName: "Alexandria Piping Co.", ArabicName: "الإسكندرية للمواسير والصناعات", TaxNumber: "420-581-229", CreditLimit: 750000, ActiveStatus: "Active" },
      { CustomerCode: "C004", CustomerName: "Delta Steel Contracting", ArabicName: "الدلتا للمقاولات والتوريدات الحديدية", TaxNumber: "884-219-450", CreditLimit: 300000, ActiveStatus: "Active" },
      { CustomerCode: "C005", CustomerName: "Middle East Tanks Factory", ArabicName: "مصنع الشرق الأوسط للغلايات والخزانات", TaxNumber: "303-918-472", CreditLimit: 1500000, ActiveStatus: "Active" },
      { CustomerCode: "C006", CustomerName: "Giza Industrial Equipment", ArabicName: "الجيزة للمعدات الصناعية", TaxNumber: "291-039-444", CreditLimit: 400000, ActiveStatus: "Active" },
      { CustomerCode: "C007", CustomerName: "Suez Petrochemicals Contracting", ArabicName: "السويس لمقاولات البتروكيماويات", TaxNumber: "912-384-592", CreditLimit: 2000000, ActiveStatus: "Active" },
      { CustomerCode: "C008", CustomerName: "Arab Steel Elevators", ArabicName: "المصاعد العربية للحديد والإستيل", TaxNumber: "610-384-918", CreditLimit: 600000, ActiveStatus: "Active" },
      { CustomerCode: "C009", CustomerName: "Nile Stainless Steel Kitchens", ArabicName: "مطابخ النيل للإستيل", TaxNumber: "732-410-559", CreditLimit: 250000, ActiveStatus: "Active" },
      { CustomerCode: "C010", CustomerName: "Pioneer Kitchen Equipment Co.", ArabicName: "رواد مطابخ ومعدات الفنادق والطهي", TaxNumber: "841-592-338", CreditLimit: 450000, ActiveStatus: "Active" }
    ]
  },
  {
    id: "suppliers",
    name: "Suppliers",
    arabicName: "الموردين",
    category: "Contacts & Accounts",
    columns: [
      { key: "SupplierCode", label: "Supplier Code", type: "string" },
      { key: "SupplierName", label: "Supplier Name (EN)", type: "string" },
      { key: "ArabicName", label: "Supplier Name (AR)", type: "string" },
      { key: "Country", label: "Country of Origin", type: "string" },
      { key: "TaxNumber", label: "Tax Number", type: "string" },
      { key: "PaymentTermCode", label: "Terms", type: "string" }
    ],
    rows: [
      { SupplierCode: "S001", SupplierName: "Acerinox Europe", ArabicName: "أسيرينوكس أوروبا", Country: "Spain", TaxNumber: "ESA-28301928", PaymentTermCode: "NET45" },
      { SupplierCode: "S002", SupplierName: "Outokumpu Stainless", ArabicName: "أوتوكمبو ستانلس ستيل", Country: "Finland", TaxNumber: "FIE-09182390", PaymentTermCode: "NET60" },
      { SupplierCode: "S003", SupplierName: "Jindal Stainless Ltd.", ArabicName: "جندال ستانلس المحدودة", Country: "India", TaxNumber: "IN-29AAECJ38C", PaymentTermCode: "ADV50" },
      { SupplierCode: "S004", SupplierName: "Nippon Steel Corporation", ArabicName: "نيبون ستيل العالمية", Country: "Japan", TaxNumber: "JP-109283019", PaymentTermCode: "LC_90D" },
      { SupplierCode: "S005", SupplierName: "BaoSteel Trading Co.", ArabicName: "باوستيل الصينية للتجارة", Country: "China", TaxNumber: "CN-91309218A", PaymentTermCode: "LC_120D" },
      { SupplierCode: "S006", SupplierName: "Yusco Stainless Steel", ArabicName: "يوسكو تايوان للمعادن", Country: "Taiwan", TaxNumber: "TW-409182390", PaymentTermCode: "ADV100" },
      { SupplierCode: "S007", SupplierName: "Aperam Stainless Steel", ArabicName: "أبيرام إستيل بلجيكا", Country: "Belgium", TaxNumber: "BE-038291038", PaymentTermCode: "NET30" },
      { SupplierCode: "S008", SupplierName: "ThyssenKrupp Materials", ArabicName: "تيسين كروب الألمانية للمعادن", Country: "Germany", TaxNumber: "DE-120391823", PaymentTermCode: "NET60" },
      { SupplierCode: "S009", SupplierName: "Posco Steel", ArabicName: "بوسكو الكورية للحديد", Country: "South Korea", TaxNumber: "KR-482019283", PaymentTermCode: "LC_90D" },
      { SupplierCode: "S010", SupplierName: "Local Steel Trading Co.", ArabicName: "الشركة المحلية لتجارة الحديد والصلب", Country: "Egypt", TaxNumber: "381-402-998", PaymentTermCode: "CASH" }
    ]
  },
  {
    id: "contacts",
    name: "Contacts",
    arabicName: "جهات الاتصال",
    category: "Contacts & Accounts",
    columns: [
      { key: "ContactID", label: "Contact ID", type: "string" },
      { key: "EntityCode", label: "Entity Code", type: "string" },
      { key: "ContactName", label: "Contact Name", type: "string" },
      { key: "Phone", label: "Phone", type: "string" },
      { key: "Email", label: "Email", type: "string" }
    ],
    rows: [
      { ContactID: "CT001", EntityCode: "C001", ContactName: "Eng. Hesham El-Banna", Phone: "+201001234567", Email: "h.banna@alnasrmetals.com" },
      { ContactID: "CT002", EntityCode: "C002", ContactName: "Haj Khaled Mansour", Phone: "+201223456789", Email: "khaled@cairostainless.com" },
      { ContactID: "CT003", EntityCode: "C003", ContactName: "Mr. Sameh El-Refaie", Phone: "+201112345678", Email: "s.refaie@alexpiping.com" },
      { ContactID: "CT004", EntityCode: "S001", ContactName: "Carlos Gomez (Acerinox)", Phone: "+34913204918", Email: "carlos.gomez@acerinox.com" },
      { ContactID: "CT005", EntityCode: "S002", ContactName: "Kari Virtanen (Outokumpu)", Phone: "+35890281938", Email: "kari.virtanen@outokumpu.com" },
      { ContactID: "CT006", EntityCode: "S003", ContactName: "Rajesh Kumar (Jindal)", Phone: "+91223849120", Email: "rajesh.kumar@jindal.com" },
      { ContactID: "CT007", EntityCode: "C005", ContactName: "Eng. Sherif Kamel", Phone: "+201067890123", Email: "s.kamel@metanks.com" },
      { ContactID: "CT008", EntityCode: "C007", ContactName: "Mr. Medhat Hegazi", Phone: "+201552394812", Email: "m.hegazi@suezpetro.com" },
      { ContactID: "CT009", EntityCode: "S010", ContactName: "Haj Ragab Mahmoud", Phone: "+201009876543", Email: "ragab@localsteel.com" },
      { ContactID: "CT010", EntityCode: "C010", ContactName: "Chef Ahmed Refaat", Phone: "+201201928374", Email: "chef.refaat@pioneerkitchen.com" }
    ]
  },
  {
    id: "banks",
    name: "Banks",
    arabicName: "البنوك المعتمدة",
    category: "Contacts & Accounts",
    columns: [
      { key: "BankCode", label: "Bank Code", type: "string" },
      { key: "BankName", label: "Bank Name", type: "string" },
      { key: "AccountNumber", label: "Account Number", type: "string" },
      { key: "IBAN", label: "IBAN", type: "string" },
      { key: "Currency", label: "Currency", type: "string" }
    ],
    rows: [
      { BankCode: "CIB_EGP", BankName: "Commercial International Bank - CIB", AccountNumber: "100029304918", IBAN: "EG9100020100029304918000000", Currency: "EGP" },
      { BankCode: "CIB_USD", BankName: "Commercial International Bank - USD", AccountNumber: "100029304955", IBAN: "EG9100020100029304955000000", Currency: "USD" },
      { BankCode: "NBE_EGP", BankName: "National Bank of Egypt - NBE", AccountNumber: "110928301928", IBAN: "EG5400030110928301928000000", Currency: "EGP" },
      { BankCode: "NBE_EUR", BankName: "National Bank of Egypt - EUR", AccountNumber: "110928301999", IBAN: "EG5400030110928301999000000", Currency: "EUR" },
      { BankCode: "QNB_EGP", BankName: "QNB Alahli", AccountNumber: "203918239103", IBAN: "EG2100040203918239103000000", Currency: "EGP" },
      { BankCode: "BM_EGP", BankName: "Banque Misr", AccountNumber: "381029301928", IBAN: "EG8200050381029301928000000", Currency: "EGP" },
      { BankCode: "AAIB_EGP", BankName: "Arab African International Bank", AccountNumber: "402918239401", IBAN: "EG4000060402918239401000000", Currency: "EGP" },
      { BankCode: "AAIB_USD", BankName: "Arab African International Bank - USD", AccountNumber: "402918239455", IBAN: "EG4000060402918239455000000", Currency: "USD" },
      { BankCode: "HSBC_EGP", BankName: "HSBC Egypt", AccountNumber: "082019283018", IBAN: "EG0800070082019283018000000", Currency: "EGP" },
      { BankCode: "ADIB_EGP", BankName: "Abu Dhabi Islamic Bank - Egypt", AccountNumber: "782910381920", IBAN: "EG780008078291038192000000", Currency: "EGP" }
    ]
  },
  {
    id: "cashAccounts",
    name: "CashAccounts",
    arabicName: "الخزائن النقدية",
    category: "Contacts & Accounts",
    columns: [
      { key: "CashAccountCode", label: "Cash Acc Code", type: "string" },
      { key: "AccountName", label: "Account Name", type: "string" },
      { key: "CustodianEmployeeID", label: "Custodian ID", type: "string" },
      { key: "Currency", label: "Currency", type: "string" },
      { key: "CurrentBalance", label: "Current Balance", type: "currency" }
    ],
    rows: [
      { CashAccountCode: "SAFE_MAIN_EGP", AccountName: "Cairo Head Office Main Safe (EGP)", CustodianEmployeeID: "E003", Currency: "EGP", CurrentBalance: 450000 },
      { CashAccountCode: "SAFE_MAIN_USD", AccountName: "Cairo Head Office Main Safe (USD)", CustodianEmployeeID: "E003", Currency: "USD", CurrentBalance: 12500 },
      { CashAccountCode: "SAFE_MAIN_EUR", AccountName: "Cairo Head Office Main Safe (EUR)", CustodianEmployeeID: "E003", Currency: "EUR", CurrentBalance: 3200 },
      { CashAccountCode: "SAFE_ALEX_EGP", AccountName: "Alexandria Branch Safe (EGP)", CustodianEmployeeID: "E009", Currency: "EGP", CurrentBalance: 85000 },
      { CashAccountCode: "SAFE_CUST_1", AccountName: "Petty Cash Safe - Admin Office", CustodianEmployeeID: "E007", Currency: "EGP", CurrentBalance: 15000 },
      { CashAccountCode: "SAFE_CUST_2", AccountName: "Petty Cash Safe - Warehouse Cairo", CustodianEmployeeID: "E005", Currency: "EGP", CurrentBalance: 20000 },
      { CashAccountCode: "SAFE_CUST_3", AccountName: "Petty Cash Safe - Sales Department", CustodianEmployeeID: "E010", Currency: "EGP", CurrentBalance: 8000 },
      { CashAccountCode: "SAFE_EX_EGP", AccountName: "Executive Chairman Safe (EGP)", CustodianEmployeeID: "E001", Currency: "EGP", CurrentBalance: 150000 },
      { CashAccountCode: "SAFE_SEC_USD", AccountName: "Secretary Safe (USD)", CustodianEmployeeID: "E002", Currency: "USD", CurrentBalance: 2000 },
      { CashAccountCode: "SAFE_TRIAL_EGP", AccountName: "Temporary Receipts Safe", CustodianEmployeeID: "E003", Currency: "EGP", CurrentBalance: 0 }
    ]
  },
  {
    id: "customerAccounts",
    name: "CustomerAccounts",
    arabicName: "حسابات أرصدة العملاء",
    category: "Contacts & Accounts",
    columns: [
      { key: "CustomerCode", label: "Customer Code", type: "string" },
      { key: "CustomerName", label: "Customer Name", type: "string" },
      { key: "Currency", label: "Currency", type: "string" },
      { key: "OpeningBalance", label: "Opening Balance", type: "currency" },
      { key: "CurrentBalance", label: "Current Balance", type: "currency" }
    ],
    rows: [
      { CustomerCode: "C001", CustomerName: "Al-Nasr Metal Industries", Currency: "EGP", OpeningBalance: 120000, CurrentBalance: 345000 },
      { CustomerCode: "C002", CustomerName: "Cairo Stainless Steel Trade", Currency: "EGP", OpeningBalance: 450000, CurrentBalance: 890000 },
      { CustomerCode: "C003", CustomerName: "Alexandria Piping Co.", Currency: "EGP", OpeningBalance: 90000, CurrentBalance: 210000 },
      { CustomerCode: "C004", CustomerName: "Delta Steel Contracting", Currency: "EGP", OpeningBalance: 50000, CurrentBalance: 145000 },
      { CustomerCode: "C005", CustomerName: "Middle East Tanks Factory", Currency: "EGP", OpeningBalance: 350000, CurrentBalance: 780000 },
      { CustomerCode: "C006", CustomerName: "Giza Industrial Equipment", Currency: "EGP", OpeningBalance: 80000, CurrentBalance: 135000 },
      { CustomerCode: "C007", CustomerName: "Suez Petrochemicals Contracting", Currency: "EGP", OpeningBalance: 600000, CurrentBalance: 1450000 },
      { CustomerCode: "C008", CustomerName: "Arab Steel Elevators", Currency: "EGP", OpeningBalance: 150000, CurrentBalance: 290000 },
      { CustomerCode: "C009", CustomerName: "Nile Stainless Steel Kitchens", Currency: "EGP", OpeningBalance: 40000, CurrentBalance: 85000 },
      { CustomerCode: "C010", CustomerName: "Pioneer Kitchen Equipment Co.", Currency: "EGP", OpeningBalance: 95000, CurrentBalance: 190000 }
    ]
  },
  {
    id: "supplierAccounts",
    name: "SupplierAccounts",
    arabicName: "حسابات أرصدة الموردين",
    category: "Contacts & Accounts",
    columns: [
      { key: "SupplierCode", label: "Supplier Code", type: "string" },
      { key: "SupplierName", label: "Supplier Name", type: "string" },
      { key: "Currency", label: "Currency", type: "string" },
      { key: "OpeningBalance", label: "Opening Balance", type: "currency" },
      { key: "CurrentBalance", label: "Current Balance", type: "currency" }
    ],
    rows: [
      { SupplierCode: "S001", SupplierName: "Acerinox Europe", Currency: "EUR", OpeningBalance: -45000, CurrentBalance: -112000 },
      { SupplierCode: "S002", SupplierName: "Outokumpu Stainless", Currency: "EUR", OpeningBalance: -80000, CurrentBalance: -145000 },
      { SupplierCode: "S003", SupplierName: "Jindal Stainless Ltd.", Currency: "USD", OpeningBalance: -35000, CurrentBalance: -78000 },
      { SupplierCode: "S004", SupplierName: "Nippon Steel Corporation", Currency: "USD", OpeningBalance: -120000, CurrentBalance: -240000 },
      { SupplierCode: "S005", SupplierName: "BaoSteel Trading Co.", Currency: "USD", OpeningBalance: -90000, CurrentBalance: -195000 },
      { SupplierCode: "S006", SupplierName: "Yusco Stainless Steel", Currency: "USD", OpeningBalance: -25000, CurrentBalance: -45000 },
      { SupplierCode: "S007", SupplierName: "Aperam Stainless Steel", Currency: "EUR", OpeningBalance: -30000, CurrentBalance: -62000 },
      { SupplierCode: "S008", SupplierName: "ThyssenKrupp Materials", Currency: "EUR", OpeningBalance: -75000, CurrentBalance: -130000 },
      { SupplierCode: "S009", SupplierName: "Posco Steel", Currency: "USD", OpeningBalance: -50000, CurrentBalance: -115000 },
      { SupplierCode: "S010", SupplierName: "Local Steel Trading Co.", Currency: "EGP", OpeningBalance: -150000, CurrentBalance: -285000 }
    ]
  },
  {
    id: "employeeAccounts",
    name: "EmployeeAccounts",
    arabicName: "حسابات أرصدة الموظفين",
    category: "Contacts & Accounts",
    columns: [
      { key: "EmployeeID", label: "Employee ID", type: "string" },
      { key: "EmployeeName", label: "Employee Name", type: "string" },
      { key: "BaseSalary", label: "Base Salary", type: "currency" },
      { key: "CurrentLoanBalance", label: "Current Loan Balance", type: "currency" },
      { key: "NetPaidThisMonth", label: "Paid This Month", type: "currency" }
    ],
    rows: [
      { EmployeeID: "E001", EmployeeName: "Mahmoud Sobhy", BaseSalary: 95000, CurrentLoanBalance: 0, NetPaidThisMonth: 95000 },
      { EmployeeID: "E002", EmployeeName: "Ahmed Mansour", BaseSalary: 65000, CurrentLoanBalance: 12000, NetPaidThisMonth: 65000 },
      { EmployeeID: "E003", EmployeeName: "Sarah Kamel", BaseSalary: 45000, CurrentLoanBalance: 5000, NetPaidThisMonth: 45000 },
      { EmployeeID: "E004", EmployeeName: "Mostafa Fawzy", BaseSalary: 40000, CurrentLoanBalance: 0, NetPaidThisMonth: 40000 },
      { EmployeeID: "E005", EmployeeName: "Yasser Abdelhady", BaseSalary: 35000, CurrentLoanBalance: 3000, NetPaidThisMonth: 35000 },
      { EmployeeID: "E006", EmployeeName: "Tarek Hegazi", BaseSalary: 35000, CurrentLoanBalance: 0, NetPaidThisMonth: 35000 },
      { EmployeeID: "E007", EmployeeName: "Mona El-Deeb", BaseSalary: 30000, CurrentLoanBalance: 4000, NetPaidThisMonth: 30000 },
      { EmployeeID: "E008", EmployeeName: "Hassan Khalifa", BaseSalary: 28000, CurrentLoanBalance: 0, NetPaidThisMonth: 28000 },
      { EmployeeID: "E009", EmployeeName: "Amr Hegazi", BaseSalary: 25000, CurrentLoanBalance: 2000, NetPaidThisMonth: 25000 },
      { EmployeeID: "E010", EmployeeName: "Layla Shakir", BaseSalary: 25000, CurrentLoanBalance: 0, NetPaidThisMonth: 25000 }
    ]
  }
];
