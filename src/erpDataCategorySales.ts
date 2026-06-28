import { SheetConfig } from "./types";

export const SALES_ERP_SHEETS: SheetConfig[] = [
  {
    id: "salesPersons",
    name: "SalesPersons",
    arabicName: "مندوبي المبيعات",
    category: "Sales Department",
    columns: [
      { key: "SalesPersonCode", label: "Rep Code", type: "string" },
      { key: "FullName", label: "Representative Name", type: "string" },
      { key: "TargetQuarterly", label: "Q Target (EGP)", type: "currency" },
      { key: "CommissionRate", label: "Comm %", type: "number" },
      { key: "Region", label: "Territory/Region", type: "string" }
    ],
    rows: [
      { SalesPersonCode: "SP01", FullName: "Mostafa Fawzy", TargetQuarterly: 3000000, CommissionRate: 0.015, Region: "Cairo & Giza" },
      { SalesPersonCode: "SP02", FullName: "Layla Shakir", TargetQuarterly: 2000000, CommissionRate: 0.012, Region: "Alexandria & Delta" },
      { SalesPersonCode: "SP03", FullName: "Hany Abdelgawad", TargetQuarterly: 1500000, CommissionRate: 0.010, Region: "Suez & Red Sea" },
      { SalesPersonCode: "SP04", FullName: "Mona Zakaria", TargetQuarterly: 1200000, CommissionRate: 0.010, Region: "Upper Egypt" },
      { SalesPersonCode: "SP05", FullName: "Sherif Younis", TargetQuarterly: 2500000, CommissionRate: 0.014, Region: "Cairo Industrial Zone" },
      { SalesPersonCode: "SP06", FullName: "Rania El-Sawy", TargetQuarterly: 1800000, CommissionRate: 0.012, Region: "Tanta & Mansoura" },
      { SalesPersonCode: "SP07", FullName: "Bassem Sharaf", TargetQuarterly: 2200000, CommissionRate: 0.013, Region: "6th of October City" },
      { SalesPersonCode: "SP08", FullName: "Noha Roushdy", TargetQuarterly: 1000000, CommissionRate: 0.008, Region: "Port Said & Damietta" },
      { SalesPersonCode: "SP09", FullName: "Tarek Nour", TargetQuarterly: 1400000, CommissionRate: 0.010, Region: "Ismailia & Sharkia" },
      { SalesPersonCode: "SP10", FullName: "Houssem Ghaly", TargetQuarterly: 800000, CommissionRate: 0.008, Region: "Assiut & Sohag" }
    ]
  },
  {
    id: "salesQuotations",
    name: "SalesQuotations",
    arabicName: "عروض أسعار المبيعات",
    category: "Sales Department",
    columns: [
      { key: "QuotationNo", label: "Quotation No", type: "string" },
      { key: "CustomerCode", label: "Customer", type: "string" },
      { key: "SalesPersonCode", label: "Sales Rep", type: "string" },
      { key: "TotalAmount", label: "Total Amount", type: "currency" },
      { key: "QuotationDate", label: "Quotation Date", type: "date" },
      { key: "ValidUntil", label: "Valid Until", type: "date" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { QuotationNo: "SQ-2026-001", CustomerCode: "C001", SalesPersonCode: "SP01", TotalAmount: 114000, QuotationDate: "2026-01-05", ValidUntil: "2026-01-20", Status: "Approved" },
      { QuotationNo: "SQ-2026-002", CustomerCode: "C002", SalesPersonCode: "SP01", TotalAmount: 204000, QuotationDate: "2026-01-06", ValidUntil: "2026-01-21", Status: "Approved" },
      { QuotationNo: "SQ-2026-003", CustomerCode: "C003", SalesPersonCode: "SP02", TotalAmount: 56000, QuotationDate: "2026-01-08", ValidUntil: "2026-01-23", Status: "Approved" },
      { QuotationNo: "SQ-2026-004", CustomerCode: "C004", SalesPersonCode: "SP07", TotalAmount: 88000, QuotationDate: "2026-01-10", ValidUntil: "2026-01-25", Status: "Approved" },
      { QuotationNo: "SQ-2026-005", CustomerCode: "C005", SalesPersonCode: "SP05", TotalAmount: 410000, QuotationDate: "2026-01-12", ValidUntil: "2026-01-27", Status: "Approved" },
      { QuotationNo: "SQ-2026-006", CustomerCode: "C006", SalesPersonCode: "SP05", TotalAmount: 33000, QuotationDate: "2026-01-15", ValidUntil: "2026-01-30", Status: "Approved" },
      { QuotationNo: "SQ-2026-007", CustomerCode: "C007", SalesPersonCode: "SP03", TotalAmount: 360000, QuotationDate: "2026-01-18", ValidUntil: "2026-02-02", Status: "Approved" },
      { QuotationNo: "SQ-2026-008", CustomerCode: "C008", SalesPersonCode: "SP01", TotalAmount: 120000, QuotationDate: "2026-01-20", ValidUntil: "2026-02-04", Status: "Expired" },
      { QuotationNo: "SQ-2026-009", CustomerCode: "C009", SalesPersonCode: "SP01", TotalAmount: 22000, QuotationDate: "2026-01-22", ValidUntil: "2026-02-06", Status: "Pending" },
      { QuotationNo: "SQ-2026-010", CustomerCode: "C010", SalesPersonCode: "SP02", TotalAmount: 45000, QuotationDate: "2026-01-25", ValidUntil: "2026-02-09", Status: "Pending" }
    ]
  },
  {
    id: "salesQuotationLines",
    name: "SalesQuotationLines",
    arabicName: "تفاصيل عروض الأسعار",
    category: "Sales Department",
    columns: [
      { key: "LineID", label: "Line ID", type: "string" },
      { key: "QuotationNo", label: "Quotation No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "Quantity", label: "Qty", type: "number" },
      { key: "UnitPrice", label: "Unit Price", type: "currency" },
      { key: "SubTotal", label: "Sub Total", type: "currency" }
    ],
    rows: [
      { LineID: "SQL-001", QuotationNo: "SQ-2026-001", ItemCode: "SS304-S-1.5", Quantity: 30, UnitPrice: 3800, SubTotal: 114000 },
      { LineID: "SQL-002", QuotationNo: "SQ-2026-002", ItemCode: "SS304-S-1.5", Quantity: 50, UnitPrice: 3200, SubTotal: 160000 },
      { LineID: "SQL-003", QuotationNo: "SQ-2026-002", ItemCode: "SS316-S-2.0", Quantity: 5, UnitPrice: 8800, SubTotal: 44000 },
      { LineID: "SQL-004", QuotationNo: "SQ-2026-003", ItemCode: "SS316-S-2.0", Quantity: 10, UnitPrice: 5600, SubTotal: 56000 },
      { LineID: "SQL-005", QuotationNo: "SQ-2026-004", ItemCode: "SS430-S-1.0", Quantity: 40, UnitPrice: 2200, SubTotal: 88000 },
      { LineID: "SQL-006", QuotationNo: "SQ-2026-005", ItemCode: "SS304-COIL-0.5", Quantity: 1, UnitPrice: 410000, SubTotal: 410000 },
      { LineID: "SQL-007", QuotationNo: "SQ-2026-006", ItemCode: "SS304-PIPE-2.0", Quantity: 10, UnitPrice: 3300, SubTotal: 33000 },
      { LineID: "SQL-008", QuotationNo: "SQ-2026-007", ItemCode: "SS316-PIPE-1.0", Quantity: 600, UnitPrice: 600, SubTotal: 360000 },
      { LineID: "SQL-009", QuotationNo: "SQ-2026-008", ItemCode: "SS316-ANG-50", Quantity: 50, UnitPrice: 2400, SubTotal: 120000 },
      { LineID: "SQL-010", QuotationNo: "SQ-2026-009", ItemCode: "SS304-BAR-40x5", Quantity: 20, UnitPrice: 1100, SubTotal: 22000 }
    ]
  },
  {
    id: "salesOrders",
    name: "SalesOrders",
    arabicName: "أوامر المبيعات المؤكدة",
    category: "Sales Department",
    columns: [
      { key: "OrderNo", label: "Order No", type: "string" },
      { key: "QuotationNo", label: "Quotation No", type: "string" },
      { key: "CustomerCode", label: "Customer", type: "string" },
      { key: "SalesPersonCode", label: "Sales Rep", type: "string" },
      { key: "OrderDate", label: "Order Date", type: "date" },
      { key: "TotalAmount", label: "Total Amount", type: "currency" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { OrderNo: "SO-2026-001", QuotationNo: "SQ-2026-001", CustomerCode: "C001", SalesPersonCode: "SP01", OrderDate: "2026-01-10", TotalAmount: 114000, Status: "Fully Invoiced" },
      { OrderNo: "SO-2026-002", QuotationNo: "SQ-2026-002", CustomerCode: "C002", SalesPersonCode: "SP01", OrderDate: "2026-01-12", TotalAmount: 204000, Status: "Fully Invoiced" },
      { OrderNo: "SO-2026-003", QuotationNo: "SQ-2026-003", CustomerCode: "C003", SalesPersonCode: "SP02", OrderDate: "2026-01-15", TotalAmount: 56000, Status: "Fully Invoiced" },
      { OrderNo: "SO-2026-004", QuotationNo: "SQ-2026-004", CustomerCode: "C004", SalesPersonCode: "SP07", OrderDate: "2026-01-18", TotalAmount: 88000, Status: "Partially Invoiced" },
      { OrderNo: "SO-2026-005", QuotationNo: "SQ-2026-005", CustomerCode: "C005", SalesPersonCode: "SP05", OrderDate: "2026-01-20", TotalAmount: 410000, Status: "Approved" },
      { OrderNo: "SO-2026-006", QuotationNo: "SQ-2026-006", CustomerCode: "C006", SalesPersonCode: "SP05", OrderDate: "2026-01-22", TotalAmount: 33000, Status: "Approved" },
      { OrderNo: "SO-2026-007", QuotationNo: "SQ-2026-007", CustomerCode: "C007", SalesPersonCode: "SP03", OrderDate: "2026-01-25", TotalAmount: 360000, Status: "Processing" },
      { OrderNo: "SO-2026-008", QuotationNo: "SQ-2026-008", CustomerCode: "C008", SalesPersonCode: "SP01", OrderDate: "2026-01-28", TotalAmount: 120000, Status: "Cancelled" },
      { OrderNo: "SO-2026-009", QuotationNo: "SQ-2026-009", CustomerCode: "C009", SalesPersonCode: "SP01", OrderDate: "2026-02-02", TotalAmount: 22000, Status: "Approved" },
      { OrderNo: "SO-2026-010", QuotationNo: "SQ-2026-010", CustomerCode: "C010", SalesPersonCode: "SP02", OrderDate: "2026-02-05", TotalAmount: 45000, Status: "Draft" }
    ]
  },
  {
    id: "salesOrderLines",
    name: "SalesOrderLines",
    arabicName: "تفاصيل أوامر المبيعات",
    category: "Sales Department",
    columns: [
      { key: "LineID", label: "Line ID", type: "string" },
      { key: "OrderNo", label: "Order No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "Quantity", label: "Qty", type: "number" },
      { key: "UnitPrice", label: "Unit Price", type: "currency" },
      { key: "SubTotal", label: "Sub Total", type: "currency" }
    ],
    rows: [
      { LineID: "SOL-001", OrderNo: "SO-2026-001", ItemCode: "SS304-S-1.5", Quantity: 30, UnitPrice: 3800, SubTotal: 114000 },
      { LineID: "SOL-002", OrderNo: "SO-2026-002", ItemCode: "SS304-S-1.5", Quantity: 50, UnitPrice: 3200, SubTotal: 160000 },
      { LineID: "SOL-003", OrderNo: "SO-2026-002", ItemCode: "SS316-S-2.0", Quantity: 5, UnitPrice: 8800, SubTotal: 44000 },
      { LineID: "SOL-004", OrderNo: "SO-2026-003", ItemCode: "SS316-S-2.0", Quantity: 10, UnitPrice: 5600, SubTotal: 56000 },
      { LineID: "SOL-005", OrderNo: "SO-2026-004", ItemCode: "SS430-S-1.0", Quantity: 40, UnitPrice: 2200, SubTotal: 88000 },
      { LineID: "SOL-006", OrderNo: "SO-2026-005", ItemCode: "SS304-COIL-0.5", Quantity: 1, UnitPrice: 410000, SubTotal: 410000 },
      { LineID: "SOL-007", OrderNo: "SO-2026-006", ItemCode: "SS304-PIPE-2.0", Quantity: 10, UnitPrice: 3300, SubTotal: 33000 },
      { LineID: "SOL-008", OrderNo: "SO-2026-007", ItemCode: "SS316-PIPE-1.0", Quantity: 600, UnitPrice: 600, SubTotal: 360000 },
      { LineID: "SOL-009", OrderNo: "SO-2026-008", ItemCode: "SS316-ANG-50", Quantity: 50, UnitPrice: 2400, SubTotal: 120000 },
      { LineID: "SOL-010", OrderNo: "SO-2026-009", ItemCode: "SS304-BAR-40x5", Quantity: 20, UnitPrice: 1100, SubTotal: 22000 }
    ]
  },
  {
    id: "salesInvoices",
    name: "SalesInvoices",
    arabicName: "فواتير المبيعات",
    category: "Sales Department",
    columns: [
      { key: "InvoiceNo", label: "Invoice No", type: "string" },
      { key: "OrderNo", label: "Order No", type: "string" },
      { key: "CustomerCode", label: "Customer", type: "string" },
      { key: "InvoiceDate", label: "Invoice Date", type: "date" },
      { key: "NetTotal", label: "Net Total (Excl VAT)", type: "currency" },
      { key: "VATAmount", label: "VAT Amount (14%)", type: "currency" },
      { key: "GrandTotal", label: "Grand Total (Incl VAT)", type: "currency" },
      { key: "PaidAmount", label: "Paid Amount", type: "currency" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { InvoiceNo: "SI-2026-001", OrderNo: "SO-2026-001", CustomerCode: "C001", InvoiceDate: "2026-01-15", NetTotal: 114000, VATAmount: 15960, GrandTotal: 129960, PaidAmount: 129960, Status: "Fully Paid" },
      { InvoiceNo: "SI-2026-002", OrderNo: "SO-2026-002", CustomerCode: "C002", InvoiceDate: "2026-01-18", NetTotal: 204000, VATAmount: 28560, GrandTotal: 232560, PaidAmount: 100000, Status: "Partially Paid" },
      { InvoiceNo: "SI-2026-003", OrderNo: "SO-2026-003", CustomerCode: "C003", InvoiceDate: "2026-01-20", NetTotal: 56000, VATAmount: 7840, GrandTotal: 63840, PaidAmount: 63840, Status: "Fully Paid" },
      { InvoiceNo: "SI-2026-004", OrderNo: "SO-2026-004", CustomerCode: "C004", InvoiceDate: "2026-01-22", NetTotal: 88000, VATAmount: 12320, GrandTotal: 100320, PaidAmount: 0, Status: "Unpaid" },
      { InvoiceNo: "SI-2026-005", OrderNo: "SO-2026-005", CustomerCode: "C005", InvoiceDate: "2026-01-25", NetTotal: 410000, VATAmount: 57400, GrandTotal: 467400, PaidAmount: 467400, Status: "Fully Paid" },
      { InvoiceNo: "SI-2026-006", OrderNo: "SO-2026-006", CustomerCode: "C006", InvoiceDate: "2026-01-28", NetTotal: 33000, VATAmount: 4620, GrandTotal: 37620, PaidAmount: 0, Status: "Unpaid" },
      { InvoiceNo: "SI-2026-007", OrderNo: "SO-2026-007", CustomerCode: "C007", InvoiceDate: "2026-02-01", NetTotal: 360000, VATAmount: 50400, GrandTotal: 410400, PaidAmount: 200000, Status: "Partially Paid" },
      { InvoiceNo: "SI-2026-008", OrderNo: "SO-2026-009", CustomerCode: "C009", InvoiceDate: "2026-02-10", NetTotal: 22000, VATAmount: 3080, GrandTotal: 25080, PaidAmount: 25080, Status: "Fully Paid" },
      { InvoiceNo: "SI-2026-009", OrderNo: "SO-2026-010", CustomerCode: "C010", InvoiceDate: "2026-02-15", NetTotal: 45000, VATAmount: 6300, GrandTotal: 51300, PaidAmount: 0, Status: "Unpaid" },
      { InvoiceNo: "SI-2026-010", OrderNo: "SO-2026-001", CustomerCode: "C001", InvoiceDate: "2026-02-20", NetTotal: 114000, VATAmount: 15960, GrandTotal: 129960, PaidAmount: 129960, Status: "Fully Paid" }
    ]
  },
  {
    id: "salesInvoiceLines",
    name: "SalesInvoiceLines",
    arabicName: "تفاصيل فواتير المبيعات",
    category: "Sales Department",
    columns: [
      { key: "LineID", label: "Line ID", type: "string" },
      { key: "InvoiceNo", label: "Invoice No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "Quantity", label: "Qty Invoiced", type: "number" },
      { key: "UnitPrice", label: "Unit Price", type: "currency" },
      { key: "SubTotal", label: "Sub Total", type: "currency" }
    ],
    rows: [
      { LineID: "SIL-001", InvoiceNo: "SI-2026-001", ItemCode: "SS304-S-1.5", Quantity: 30, UnitPrice: 3800, SubTotal: 114000 },
      { LineID: "SIL-002", InvoiceNo: "SI-2026-002", ItemCode: "SS304-S-1.5", Quantity: 50, UnitPrice: 3200, SubTotal: 160000 },
      { LineID: "SIL-003", InvoiceNo: "SI-2026-002", ItemCode: "SS316-S-2.0", Quantity: 5, UnitPrice: 8800, SubTotal: 44000 },
      { LineID: "SIL-004", InvoiceNo: "SI-2026-003", ItemCode: "SS316-S-2.0", Quantity: 10, UnitPrice: 5600, SubTotal: 56000 },
      { LineID: "SIL-005", InvoiceNo: "SI-2026-004", ItemCode: "SS430-S-1.0", Quantity: 40, UnitPrice: 2200, SubTotal: 88000 },
      { LineID: "SIL-006", InvoiceNo: "SI-2026-005", ItemCode: "SS304-COIL-0.5", Quantity: 1, UnitPrice: 410000, SubTotal: 410000 },
      { LineID: "SIL-007", InvoiceNo: "SI-2026-006", ItemCode: "SS304-PIPE-2.0", Quantity: 10, UnitPrice: 3300, SubTotal: 33000 },
      { LineID: "SIL-008", InvoiceNo: "SI-2026-007", ItemCode: "SS316-PIPE-1.0", Quantity: 600, UnitPrice: 600, SubTotal: 360000 },
      { LineID: "SIL-009", InvoiceNo: "SI-2026-008", ItemCode: "SS316-ANG-50", Quantity: 50, UnitPrice: 2400, SubTotal: 120000 },
      { LineID: "SIL-010", InvoiceNo: "SI-2026-009", ItemCode: "SS304-BAR-40x5", Quantity: 20, UnitPrice: 1100, SubTotal: 22000 }
    ]
  }
];
