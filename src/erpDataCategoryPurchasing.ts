import { SheetConfig } from "./types";

export const PURCHASING_ERP_SHEETS: SheetConfig[] = [
  {
    id: "purchaseRequests",
    name: "PurchaseRequests",
    arabicName: "طلبات الشراء الداخلية",
    category: "Purchasing Department",
    columns: [
      { key: "RequestNo", label: "Request No", type: "string" },
      { key: "RequestedBy", label: "Requested By", type: "string" },
      { key: "DepartmentCode", label: "Department", type: "string" },
      { key: "RequestDate", label: "Request Date", type: "date" },
      { key: "EstimatedCost", label: "Est Cost (EGP)", type: "currency" },
      { key: "Purpose", label: "Purpose", type: "string" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { RequestNo: "PR-2026-001", RequestedBy: "E005", DepartmentCode: "D005", RequestDate: "2026-01-02", EstimatedCost: 350000, Purpose: "Replenish 304 sheets Cairo yard", Status: "Approved" },
      { RequestNo: "PR-2026-002", RequestedBy: "E009", DepartmentCode: "D005", RequestDate: "2026-01-04", EstimatedCost: 1200000, Purpose: "Procure high-grade 316 Finnish sheets", Status: "Approved" },
      { RequestNo: "PR-2026-003", RequestedBy: "E005", DepartmentCode: "D005", RequestDate: "2026-01-05", EstimatedCost: 150000, Purpose: "Replenish 430 sheets BA grade", Status: "Approved" },
      { RequestNo: "PR-2026-004", RequestedBy: "E004", DepartmentCode: "D004", RequestDate: "2026-01-08", EstimatedCost: 400000, Purpose: "Seamless pipes for Giza client project", Status: "Approved" },
      { RequestNo: "PR-2026-005", RequestedBy: "E009", DepartmentCode: "D005", RequestDate: "2026-01-10", EstimatedCost: 180000, Purpose: "Fittings and elbows replenishment", Status: "Approved" },
      { RequestNo: "PR-2026-006", RequestedBy: "E005", DepartmentCode: "D005", RequestDate: "2026-01-15", EstimatedCost: 220000, Purpose: "Equal angles steel German supply", Status: "Approved" },
      { RequestNo: "PR-2026-007", RequestedBy: "E003", DepartmentCode: "D003", RequestDate: "2026-01-18", EstimatedCost: 25000, Purpose: "Head office IT supplies & screens", Status: "Approved" },
      { RequestNo: "PR-2026-008", RequestedBy: "E007", DepartmentCode: "D007", RequestDate: "2026-01-20", EstimatedCost: 12000, Purpose: "Office stationery & safety masks", Status: "Approved" },
      { RequestNo: "PR-2026-009", RequestedBy: "E005", DepartmentCode: "D005", RequestDate: "2026-01-22", EstimatedCost: 3500000, Purpose: "Spanish steel coil batch import", Status: "Approved" },
      { RequestNo: "PR-2026-010", RequestedBy: "E009", DepartmentCode: "D005", RequestDate: "2026-01-25", EstimatedCost: 110000, Purpose: "Flat bars replacement stocks", Status: "Approved" }
    ]
  },
  {
    id: "purchaseOrders",
    name: "PurchaseOrders",
    arabicName: "أوامر الشراء والتوريد",
    category: "Purchasing Department",
    columns: [
      { key: "PONo", label: "PO No", type: "string" },
      { key: "RequestNo", label: "Request No", type: "string" },
      { key: "SupplierCode", label: "Supplier", type: "string" },
      { key: "PODate", label: "PO Date", type: "date" },
      { key: "TotalAmountForeign", label: "Amount (FC)", type: "number" },
      { key: "Currency", label: "Currency", type: "string" },
      { key: "TotalAmountEGP", label: "Amount (EGP)", type: "currency" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { PONo: "PO-2026-001", RequestNo: "PR-2026-001", SupplierCode: "S001", PODate: "2026-01-05", TotalAmountForeign: 5800, Currency: "EUR", TotalAmountEGP: 302760, Status: "Completed" },
      { PONo: "PO-2026-002", RequestNo: "PR-2026-002", SupplierCode: "S002", PODate: "2026-01-08", TotalAmountForeign: 22000, Currency: "EUR", TotalAmountEGP: 1148400, Status: "Completed" },
      { PONo: "PO-2026-003", RequestNo: "PR-2026-003", SupplierCode: "S003", PODate: "2026-01-10", TotalAmountForeign: 3200, Currency: "USD", TotalAmountEGP: 155200, Status: "Completed" },
      { PONo: "PO-2026-004", RequestNo: "PR-2026-004", SupplierCode: "S004", PODate: "2026-01-12", TotalAmountForeign: 8000, Currency: "USD", TotalAmountEGP: 388000, Status: "Completed" },
      { PONo: "PO-2026-005", RequestNo: "PR-2026-005", SupplierCode: "S006", PODate: "2026-01-15", TotalAmountForeign: 3600, Currency: "USD", TotalAmountEGP: 174600, Status: "Completed" },
      { PONo: "PO-2026-006", RequestNo: "PR-2026-006", SupplierCode: "S008", PODate: "2026-01-18", TotalAmountForeign: 4000, Currency: "EUR", TotalAmountEGP: 208800, Status: "Completed" },
      { PONo: "PO-2026-007", RequestNo: "PR-2026-007", SupplierCode: "S010", PODate: "2026-01-20", TotalAmountForeign: 24500, Currency: "EGP", TotalAmountEGP: 24500, Status: "Completed" },
      { PONo: "PO-2026-008", RequestNo: "PR-2026-008", SupplierCode: "S010", PODate: "2026-01-22", TotalAmountForeign: 11800, Currency: "EGP", TotalAmountEGP: 11800, Status: "Completed" },
      { PONo: "PO-2026-009", RequestNo: "PR-2026-009", SupplierCode: "S001", PODate: "2026-01-25", TotalAmountForeign: 68000, Currency: "EUR", TotalAmountEGP: 3549600, Status: "Approved" },
      { PONo: "PO-2026-010", RequestNo: "PR-2026-010", SupplierCode: "S003", PODate: "2026-01-28", TotalAmountForeign: 2200, Currency: "USD", TotalAmountEGP: 106700, Status: "In-Transit" }
    ]
  },
  {
    id: "purchaseOrderLines",
    name: "PurchaseOrderLines",
    arabicName: "تفاصيل أوامر الشراء",
    category: "Purchasing Department",
    columns: [
      { key: "LineID", label: "Line ID", type: "string" },
      { key: "PONo", label: "PO No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "Quantity", label: "Qty Ordered", type: "number" },
      { key: "UnitPriceFC", label: "Unit Price (FC)", type: "number" },
      { key: "SubTotalEGP", label: "Sub Total (EGP)", type: "currency" }
    ],
    rows: [
      { LineID: "POL-001", PONo: "PO-2026-001", ItemCode: "SS304-S-1.5", Quantity: 500, UnitPriceFC: 11.6, SubTotalEGP: 281300 },
      { LineID: "POL-002", PONo: "PO-2026-002", ItemCode: "SS316-S-2.0", Quantity: 200, UnitPriceFC: 110, SubTotalEGP: 1148400 },
      { LineID: "POL-003", PONo: "PO-2026-003", ItemCode: "SS430-S-1.0", Quantity: 800, UnitPriceFC: 4.0, SubTotalEGP: 155200 },
      { LineID: "POL-004", PONo: "PO-2026-004", ItemCode: "SS304-PIPE-2.0", Quantity: 400, UnitPriceFC: 20, SubTotalEGP: 388000 },
      { LineID: "POL-005", PONo: "PO-2026-005", ItemCode: "SS316-ELB-90", Quantity: 500, UnitPriceFC: 7.2, SubTotalEGP: 174600 },
      { LineID: "POL-006", PONo: "PO-2026-006", ItemCode: "SS316-ANG-50", Quantity: 100, UnitPriceFC: 40, SubTotalEGP: 208800 },
      { LineID: "POL-007", PONo: "PO-2026-007", ItemCode: "SS304-FLG-2", Quantity: 10, UnitPriceFC: 2450, SubTotalEGP: 24500 },
      { LineID: "POL-008", PONo: "PO-2026-008", ItemCode: "SS304-FLG-2", Quantity: 5, UnitPriceFC: 2360, SubTotalEGP: 11800 },
      { LineID: "POL-009", PONo: "PO-2026-009", ItemCode: "SS304-COIL-0.5", Quantity: 10, UnitPriceFC: 6800, SubTotalEGP: 3549600 },
      { LineID: "POL-010", PONo: "PO-2026-010", ItemCode: "SS304-BAR-40x5", Quantity: 100, UnitPriceFC: 22, SubTotalEGP: 106700 }
    ]
  },
  {
    id: "purchaseInvoices",
    name: "PurchaseInvoices",
    arabicName: "فواتير المشتريات",
    category: "Purchasing Department",
    columns: [
      { key: "PurchaseInvoiceNo", label: "Invoice No", type: "string" },
      { key: "PONo", label: "PO No", type: "string" },
      { key: "SupplierCode", label: "Supplier Code", type: "string" },
      { key: "InvoiceDate", label: "Invoice Date", type: "date" },
      { key: "NetTotalEGP", label: "Net Total (EGP)", type: "currency" },
      { key: "VATAmountEGP", label: "VAT (EGP)", type: "currency" },
      { key: "GrandTotalEGP", label: "Grand Total (EGP)", type: "currency" },
      { key: "PaidAmountEGP", label: "Paid Amount (EGP)", type: "currency" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { PurchaseInvoiceNo: "PI-2026-001", PONo: "PO-2026-001", SupplierCode: "S001", InvoiceDate: "2026-01-10", NetTotalEGP: 302760, VATAmountEGP: 42386, GrandTotalEGP: 345146, PaidAmountEGP: 345146, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-002", PONo: "PO-2026-002", SupplierCode: "S002", InvoiceDate: "2026-01-12", NetTotalEGP: 1148400, VATAmountEGP: 160776, GrandTotalEGP: 1309176, PaidAmountEGP: 0, Status: "Unpaid" },
      { PurchaseInvoiceNo: "PI-2026-003", PONo: "PO-2026-003", SupplierCode: "S003", InvoiceDate: "2026-01-15", NetTotalEGP: 155200, VATAmountEGP: 21728, GrandTotalEGP: 176928, PaidAmountEGP: 176928, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-004", PONo: "PO-2026-004", SupplierCode: "S004", InvoiceDate: "2026-01-18", NetTotalEGP: 388000, VATAmountEGP: 54320, GrandTotalEGP: 442320, PaidAmountEGP: 442320, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-005", PONo: "PO-2026-005", SupplierCode: "S006", InvoiceDate: "2026-01-20", NetTotalEGP: 174600, VATAmountEGP: 24444, GrandTotalEGP: 199044, PaidAmountEGP: 199044, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-006", PONo: "PO-2026-006", SupplierCode: "S008", InvoiceDate: "2026-01-22", NetTotalEGP: 208800, VATAmountEGP: 29232, GrandTotalEGP: 238032, PaidAmountEGP: 100000, Status: "Partially Paid" },
      { PurchaseInvoiceNo: "PI-2026-007", PONo: "PO-2026-007", SupplierCode: "S010", InvoiceDate: "2026-01-25", NetTotalEGP: 24500, VATAmountEGP: 3430, GrandTotalEGP: 27930, PaidAmountEGP: 27930, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-008", PONo: "PO-2026-008", SupplierCode: "S010", InvoiceDate: "2026-01-28", NetTotalEGP: 11800, VATAmountEGP: 1652, GrandTotalEGP: 13452, PaidAmountEGP: 13452, Status: "Fully Paid" },
      { PurchaseInvoiceNo: "PI-2026-009", PONo: "PO-2026-009", SupplierCode: "S001", InvoiceDate: "2026-02-05", NetTotalEGP: 3549600, VATAmountEGP: 496944, GrandTotalEGP: 4046544, PaidAmountEGP: 0, Status: "Unpaid" },
      { PurchaseInvoiceNo: "PI-2026-010", PONo: "PO-2026-010", SupplierCode: "S003", InvoiceDate: "2026-02-10", NetTotalEGP: 106700, VATAmountEGP: 14938, GrandTotalEGP: 121638, PaidAmountEGP: 0, Status: "Unpaid" }
    ]
  },
  {
    id: "purchaseInvoiceLines",
    name: "PurchaseInvoiceLines",
    arabicName: "تفاصيل فواتير المشتريات",
    category: "Purchasing Department",
    columns: [
      { key: "LineID", label: "Line ID", type: "string" },
      { key: "PurchaseInvoiceNo", label: "Invoice No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "Quantity", label: "Qty Received", type: "number" },
      { key: "UnitPriceFC", label: "Unit Price (FC)", type: "number" },
      { key: "SubTotalEGP", label: "Sub Total (EGP)", type: "currency" }
    ],
    rows: [
      { LineID: "PIL-001", PurchaseInvoiceNo: "PI-2026-001", ItemCode: "SS304-S-1.5", Quantity: 500, UnitPriceFC: 11.6, SubTotalEGP: 281300 },
      { LineID: "PIL-002", PurchaseInvoiceNo: "PI-2026-002", ItemCode: "SS316-S-2.0", Quantity: 200, UnitPriceFC: 110, SubTotalEGP: 1148400 },
      { LineID: "PIL-003", PurchaseInvoiceNo: "PI-2026-003", ItemCode: "SS430-S-1.0", Quantity: 800, UnitPriceFC: 4.0, SubTotalEGP: 155200 },
      { LineID: "PIL-004", PurchaseInvoiceNo: "PI-2026-004", ItemCode: "SS304-PIPE-2.0", Quantity: 400, UnitPriceFC: 20, SubTotalEGP: 388000 },
      { LineID: "PIL-005", PurchaseInvoiceNo: "PI-2026-005", ItemCode: "SS316-ELB-90", Quantity: 500, UnitPriceFC: 7.2, SubTotalEGP: 174600 },
      { LineID: "PIL-006", PurchaseInvoiceNo: "PI-2026-006", ItemCode: "SS316-ANG-50", Quantity: 100, UnitPriceFC: 40, SubTotalEGP: 208800 },
      { LineID: "PIL-007", PurchaseInvoiceNo: "PI-2026-007", ItemCode: "SS304-FLG-2", Quantity: 10, UnitPriceFC: 2450, SubTotalEGP: 24500 },
      { LineID: "PIL-008", PurchaseInvoiceNo: "PI-2026-008", ItemCode: "SS304-FLG-2", Quantity: 5, UnitPriceFC: 2360, SubTotalEGP: 11800 },
      { LineID: "PIL-009", PurchaseInvoiceNo: "PI-2026-009", ItemCode: "SS304-COIL-0.5", Quantity: 10, UnitPriceFC: 6800, SubTotalEGP: 3549600 },
      { LineID: "PIL-010", PurchaseInvoiceNo: "PI-2026-010", ItemCode: "SS304-BAR-40x5", Quantity: 100, UnitPriceFC: 22, SubTotalEGP: 106700 }
    ]
  }
];
