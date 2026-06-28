import { SheetConfig } from "./types";

export const LOGS_ERP_SHEETS: SheetConfig[] = [
  {
    id: "attachments",
    name: "Attachments",
    arabicName: "المستندات والملحقات المرفقة",
    category: "System Logs",
    columns: [
      { key: "AttachmentID", label: "Attachment ID", type: "string" },
      { key: "DocumentType", label: "Linked Doc Type", type: "string" },
      { key: "ReferenceNo", label: "Linked Ref No", type: "string" },
      { key: "FileName", label: "File Name", type: "string" },
      { key: "FileSize", label: "File Size", type: "string" },
      { key: "UploadDate", label: "Upload Date", type: "date" },
      { key: "UploadedBy", label: "Uploaded By User", type: "string" }
    ],
    rows: [
      { AttachmentID: "ATT-001", DocumentType: "Sales Invoice", ReferenceNo: "SI-2026-001", FileName: "signed_delivery_note_c001.pdf", FileSize: "1.2 MB", UploadDate: "2026-01-16", UploadedBy: "admin.mahmoud" },
      { AttachmentID: "ATT-002", DocumentType: "Purchase Invoice", ReferenceNo: "PI-2026-001", FileName: "acerinox_packing_list_192.pdf", FileSize: "4.5 MB", UploadDate: "2026-01-10", UploadedBy: "tarek.purchase" },
      { AttachmentID: "ATT-003", DocumentType: "Sales Order", ReferenceNo: "SO-2026-003", FileName: "po_attachment_cairopipes.pdf", FileSize: "890 KB", UploadDate: "2026-01-15", UploadedBy: "mostafa.sales" },
      { AttachmentID: "ATT-004", DocumentType: "Receipt Voucher", ReferenceNo: "RC-2026-002", FileName: "cib_deposit_receipt_100k.png", FileSize: "320 KB", UploadDate: "2026-01-19", UploadedBy: "sarah.finance" },
      { AttachmentID: "ATT-005", DocumentType: "Payment Voucher", ReferenceNo: "PV-2026-001", FileName: "bank_wire_transfer_spain_eur.pdf", FileSize: "2.1 MB", UploadDate: "2026-01-11", UploadedBy: "sarah.finance" },
      { AttachmentID: "ATT-006", DocumentType: "Cut Order", ReferenceNo: "CO-2026-01", FileName: "obour_cutting_plan_1.dwg", FileSize: "12.4 MB", UploadDate: "2026-01-12", UploadedBy: "yasser.warehouse" },
      { AttachmentID: "ATT-007", DocumentType: "Supplier Account", ReferenceNo: "S001", FileName: "acerinox_contract_2026.pdf", FileSize: "3.8 MB", UploadDate: "2026-01-01", UploadedBy: "tarek.purchase" },
      { AttachmentID: "ATT-008", DocumentType: "Item Specification", ReferenceNo: "SS304-S-1.5", FileName: "mill_certificate_spain_304.pdf", FileSize: "1.5 MB", UploadDate: "2026-01-10", UploadedBy: "yasser.warehouse" },
      { AttachmentID: "ATT-009", DocumentType: "Expense Voucher", ReferenceNo: "EXP-2026-002", FileName: "obour_rent_contract_2026.pdf", FileSize: "1.9 MB", UploadDate: "2026-01-01", UploadedBy: "sarah.finance" },
      { AttachmentID: "ATT-010", DocumentType: "Bank Transfer", ReferenceNo: "BT-001", FileName: "cib_to_nbe_300k_slip.png", FileSize: "420 KB", UploadDate: "2026-01-15", UploadedBy: "sarah.finance" }
    ]
  },
  {
    id: "auditLog",
    name: "AuditLog",
    arabicName: "سجل الرقابة والأمان النظامي",
    category: "System Logs",
    columns: [
      { key: "LogID", label: "Log ID", type: "string" },
      { key: "Timestamp", label: "Timestamp", type: "string" },
      { key: "Username", label: "Username", type: "string" },
      { key: "Action", label: "Action Taken", type: "string" },
      { key: "IPAddress", label: "IP Address", type: "string" },
      { key: "Details", label: "Operation Details", type: "string" }
    ],
    rows: [
      { LogID: "AUD-10029", Timestamp: "2026-06-26T14:30:11", Username: "admin.mahmoud", Action: "LOGIN_SUCCESS", IPAddress: "197.34.112.5", Details: "User mahmoud logged in from head office" },
      { LogID: "AUD-10030", Timestamp: "2026-06-26T14:45:22", Username: "sarah.finance", Action: "CREATE_RECEIPT", IPAddress: "197.34.112.9", Details: "Created receipt voucher RC-2026-010 for EGP 300,000" },
      { LogID: "AUD-10031", Timestamp: "2026-06-26T14:52:01", Username: "mostafa.sales", Action: "APPROVE_QUOTATION", IPAddress: "197.34.113.12", Details: "Approved sales quotation SQ-2026-001" },
      { LogID: "AUD-10032", Timestamp: "2026-06-26T15:10:45", Username: "yasser.warehouse", Action: "CREATE_REMNANT", IPAddress: "10.0.5.22", Details: "Logged new cut remnant REM-010 from Cairo yard" },
      { LogID: "AUD-10033", Timestamp: "2026-06-26T15:22:11", Username: "tarek.purchase", Action: "CREATE_PO", IPAddress: "197.34.112.18", Details: "Created Purchase Order PO-2026-010 to Jindal Steel" },
      { LogID: "AUD-10034", Timestamp: "2026-06-26T15:35:19", Username: "admin.mahmoud", Action: "EXPORT_WORKBOOK", IPAddress: "197.34.112.5", Details: "Exported Master ERP workbook to Google Sheets" },
      { LogID: "AUD-10035", Timestamp: "2026-06-26T15:40:02", Username: "sarah.finance", Action: "UPDATE_LEDGER", IPAddress: "197.34.112.9", Details: "Posted automatic general ledger entries for SI-2026-010" },
      { LogID: "AUD-10036", Timestamp: "2026-06-26T16:01:44", Username: "yasser.warehouse", Action: "STOCK_TRANSFER", IPAddress: "10.0.5.22", Details: "Completed steel stock transfer ST-2026-009" },
      { LogID: "AUD-10037", Timestamp: "2026-06-26T16:15:00", Username: "mostafa.sales", Action: "CREATE_ORDER", IPAddress: "197.34.113.12", Details: "Converted SQ-2026-010 into Sales Order SO-2026-010" },
      { LogID: "AUD-10038", Timestamp: "2026-06-26T16:30:12", Username: "sarah.finance", Action: "CLEAR_CHECK", IPAddress: "197.34.112.9", Details: "Cleared customer check CHK-40291 value EGP 63,840" }
    ]
  },
  {
    id: "dashboard_Data",
    name: "Dashboard_Data",
    arabicName: "بيانات لوحة القيادة التحليلية",
    category: "System Logs",
    columns: [
      { key: "MetricKey", label: "Metric Key", type: "string" },
      { key: "MetricName", label: "Metric/KPI Name", type: "string" },
      { key: "ArabicName", label: "Arabic KPI Name", type: "string" },
      { key: "CurrentValue", label: "Current Value", type: "number" },
      { key: "TargetValue", label: "Target Value", type: "number" },
      { key: "PerformanceRate", label: "Perf Rate", type: "number" },
      { key: "LastUpdated", label: "Last Sync Time", type: "string" }
    ],
    rows: [
      { MetricKey: "SALES_YTD", MetricName: "Year-To-Date Sales Amount", ArabicName: "مبيعات السنة حتى اليوم", CurrentValue: 1545000, TargetValue: 2000000, PerformanceRate: 0.7725, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "PURCHASE_YTD", MetricName: "Year-To-Date Purchases Amount", ArabicName: "مشتريات السنة حتى اليوم", CurrentValue: 5312000, TargetValue: 6000000, PerformanceRate: 0.8853, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "NET_MARGIN", MetricName: "Net Profit Margin Rate", ArabicName: "معدل هامش الربح الصافي", CurrentValue: 0.1850, TargetValue: 0.1500, PerformanceRate: 1.2333, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "ACTIVE_CUST", MetricName: "Active Steel Trading Customers", ArabicName: "العملاء النشطين للتداول", CurrentValue: 10, TargetValue: 15, PerformanceRate: 0.6667, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "STOCK_VALUE", MetricName: "Total Inventory Material Value", ArabicName: "القيمة الإجمالية لمخزون الإستيل", CurrentValue: 4210000, TargetValue: 3500000, PerformanceRate: 1.2028, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "CUT_COUNT", MetricName: "Total Cut Orders Processed", ArabicName: "إجمالي أوامر قص وتجهيز المعادن", CurrentValue: 45, TargetValue: 50, PerformanceRate: 0.9000, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "REMNANT_AVAIL", MetricName: "Available Stainless Steel Remnants", ArabicName: "عدد الفضلات والقصاصات المتاحة للبيع", CurrentValue: 6, TargetValue: 10, PerformanceRate: 0.6000, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "EXPENSE_YTD", MetricName: "Total Corporate Expenses YTD", ArabicName: "إجمالي المصاريف والمصروفات العمومية", CurrentValue: 712000, TargetValue: 800000, PerformanceRate: 0.8900, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "CASH_LIQUID", MetricName: "Total Safe & Banks Liquidity (EGP)", ArabicName: "السيولة النقدية الإجمالية بالخزائن والبنوك", CurrentValue: 2450000, TargetValue: 2000000, PerformanceRate: 1.2250, LastUpdated: "2026-06-26 17:00" },
      { MetricKey: "AUDIT_OK_RATE", MetricName: "Audit Validation Pass Rate", ArabicName: "معدل اجتياز تدقيق ومطابقة القيود", CurrentValue: 1.00, TargetValue: 1.00, PerformanceRate: 1.00, LastUpdated: "2026-06-26 17:00" }
    ]
  }
];
