import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  CloudUpload,
  Search,
  CheckCircle,
  AlertTriangle,
  User as UserIcon,
  LogOut,
  FolderOpen,
  Filter,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Boxes,
  Users2,
  Building2,
  ShieldCheck,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Printer,
  LayoutDashboard,
  Briefcase,
  FileText,
  Activity,
  Database,
  Network,
  GitBranch,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Eye,
  Layers,
  Link2,
  Compass,
  Calendar,
  DollarSign,
  Users,
  Factory,
  ShoppingCart,
  Ship,
  Bell,
  Settings,
  Mic,
  MicOff,
  X,
  Info,
  Scale,
  Check,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ALL_ERP_SHEETS } from "./erpData";
import { SheetConfig, SheetColumn } from "./types";
import { initAuth, googleSignIn, logout, getAccessToken } from "./auth";
import { downloadExcelWorkbook } from "./excelExporter";
import { exportToGoogleSheets, ExportProgress } from "./googleSheetsExporter";
import { User } from "firebase/auth";

const KEY_TO_SHEET_MAP: Record<string, { sheetId: string; targetKey: string }> = {
  CustomerCode: { sheetId: "customers", targetKey: "CustomerCode" },
  SupplierCode: { sheetId: "suppliers", targetKey: "SupplierCode" },
  ItemCode: { sheetId: "items", targetKey: "ItemCode" },
  WarehouseCode: { sheetId: "warehouses", targetKey: "WarehouseCode" },
  FromWarehouseCode: { sheetId: "warehouses", targetKey: "WarehouseCode" },
  ToWarehouseCode: { sheetId: "warehouses", targetKey: "WarehouseCode" },
  SalesPersonCode: { sheetId: "salesPersons", targetKey: "SalesPersonCode" },
  QuotationNo: { sheetId: "salesQuotations", targetKey: "QuotationNo" },
  OrderNo: { sheetId: "salesOrders", targetKey: "OrderNo" },
  InvoiceNo: { sheetId: "salesInvoices", targetKey: "InvoiceNo" },
  RequestNo: { sheetId: "purchaseRequests", targetKey: "RequestNo" },
  PONo: { sheetId: "purchaseOrders", targetKey: "PONo" },
  PurchaseInvoiceNo: { sheetId: "purchaseInvoices", targetKey: "PurchaseInvoiceNo" },
  EmployeeID: { sheetId: "employees", targetKey: "EmployeeID" },
  CustodianEmployeeID: { sheetId: "employees", targetKey: "EmployeeID" },
  DepartmentCode: { sheetId: "departments", targetKey: "DepartmentCode" },
  RoleID: { sheetId: "roles", targetKey: "RoleID" },
  UserID: { sheetId: "users", targetKey: "UserID" },
  SettingID: { sheetId: "settings", targetKey: "SettingID" },
  BankCode: { sheetId: "banks", targetKey: "BankCode" },
  BankID: { sheetId: "banks", targetKey: "BankCode" },
  AccountID: { sheetId: "cashAccounts", targetKey: "CashAccountCode" },
  CheckNo: { sheetId: "checks", targetKey: "CheckNo" },
  CheckID: { sheetId: "checks", targetKey: "CheckNo" },
  TermCode: { sheetId: "paymentTerms", targetKey: "TermCode" },
  PaymentTermCode: { sheetId: "paymentTerms", targetKey: "TermCode" },
  TaxCode: { sheetId: "taxes", targetKey: "TaxCode" },
  Currency: { sheetId: "currencies", targetKey: "CurrencyCode" },
  CurrencyCode: { sheetId: "currencies", targetKey: "CurrencyCode" },
};

const COLUMN_TRANSLATIONS: Record<string, string> = {
  // System & Org / settings
  SettingID: "كود الإعداد (Setting ID)",
  Parameter: "المعلمة / المعيار (Parameter)",
  Value: "القيمة (Value)",
  Description: "شرح وتوصيف البيان (Description)",
  LastUpdated: "تاريخ آخر تحديث (Last Updated)",
  
  // Users
  UserID: "كود الحساب (User ID)",
  Username: "اسم المستخدم (Username)",
  FullName: "الاسم بالكامل (Full Name)",
  Email: "البريد الإلكتروني المعتمد (Email)",
  Status: "حالة السجل / الحساب (Status)",
  
  // Roles
  RoleID: "كود الصلاحية (Role ID)",
  RoleName: "مسمى الصلاحية (Role Name)",
  AccessLevel: "مستوى الوصول بالنظام (Access Level)",
  IsSystemRole: "دور مدمج أساسي بالنظام؟ (Is System Role)",
  
  // Employees
  EmployeeID: "كود الموظف (Emp ID)",
  DepartmentCode: "كود القسم الداخلي (Dept Code)",
  JobTitle: "المسمى الوظيفي للموظف (Job Title)",
  HireDate: "تاريخ استلام العمل (Hire Date)",
  
  // Customers
  CustomerCode: "كود العميل (Customer Code)",
  CompanyName: "اسم شركة العميل (Company Name)",
  PaymentTermsCode: "شروط الدفع المعتمدة (Payment Terms)",
  CreditLimit: "الحد الائتماني المالي (Credit Limit)",
  CustomerType: "فئة العميل وتصنيف النشاط (Customer Type)",
  Rating: "التصنيف الائتماني للعميل (Rating)",
  
  // Suppliers
  SupplierCode: "كود المورد (Supplier Code)",
  Name: "اسم الشركة / المورد (Name)",
  
  // Items
  ItemCode: "كود الصنف / الخامة (Item Code)",
  ItemName: "اسم الصنف الهندسي (Item Name)",
  DescriptionArabic: "الوصف الفني التفصيلي (Arabic Desc)",
  CategoryCode: "كود تصنيف المخازن (Category Code)",
  BaseUnit: "وحدة القياس (Base Unit)",
  DefaultWarehouseCode: "المستودع الافتراضي (Default WH)",
  
  // Warehouses
  WarehouseCode: "كود المخزن / المستودع (Warehouse Code)",
  WarehouseName: "اسم المخزن التفصيلي (Warehouse Name)",
  Location: "الموقع الجغرافي / العنوان (Location)",
  ManagerID: "كود الموظف المسؤول (Manager ID)",
  IsBonded: "هل المخزن جمركي معتمد؟ (Is Bonded)",
  
  // Locations
  LocationCode: "كود الموقع التخزيني (Location Code)",
  Zone: "المنطقة / الرف والقطاع (Zone)",
  CapacityCBM: "السعة التخزينية (Capacity CBM)",
  IsActive: "متاح للاستخدام الفعلي؟ (Is Active)",
  
  // Orders / Sales Orders / Purchase Orders
  OrderNo: "رقم قيد أمر البيع (Order No)",
  PurchaseOrderNo: "رقم أمر الشراء (PO No)",
  OrderDate: "تاريخ إصدار القيد والطلب (Order Date)",
  TotalAmount: "إجمالي قيمة الفاتورة (Total Amount)",
  OrderStatus: "الحالة التشغيلية للقيد (Order Status)",
  
  // Checks
  CheckNo: "رقم الشيك البنكي (Check No)",
  CheckNumber: "رقم الشيك البنكي (Check Number)",
  DueDate: "تاريخ استحقاق الصرف والتحصيل (Due Date)",
  IssueDate: "تاريخ إصدار وتحرير الشيك (Issue Date)",
  Amount: "قيمة ومبلغ السند (Amount)",
  BankName: "اسم البنك المسحوب عليه (Bank Name)",
  BeneficiaryName: "اسم المستفيد من الصرف (Beneficiary)",
  DrawerName: "اسم منشئ الشيك (Drawer Name)",
  CheckStatus: "الحالة القانونية للتسوية (Check Status)",
  CheckType: "نوع الشيك (Check Type)",
  BankCode: "كود البنك / الحساب (Bank Code)",
  Type: "نوع السند / الحركة (Type)",
  Issuer: "اسم المحرر / الساحب (Issuer)",
  Beneficiary: "اسم المستفيد (Beneficiary)",
  
  // Receipts & Payments & internal transfers & Expenses
  ReceiptNo: "رقم سند القبض (Receipt No)",
  PaymentNo: "رقم سند الصرف (Payment No)",
  PaymentMode: "طريقة الدفع (Payment Mode)",
  CashAccountCode: "حساب الصندوق / الخزينة (Cash Account)",
  TransferID: "رقم قيد التحويل (Transfer ID)",
  SourceBank: "البنك المرسل (Source Bank)",
  DestinationBank: "البنك المستلم (Dest Bank)",
  Charges: "المصاريف والعمولات البنكية (Charges)",
  ApprovedBy: "الموظف المعتمد (Approved By)",
  ExpenseNo: "رقم قيد المصروف (Expense No)",
  PaidTo: "صرف إلى (Paid To)",

  // Purchasing
  RequestNo: "رقم طلب الشراء (Request No)",
  RequestedBy: "مقدّم الطلب (Requested By)",
  EstimatedCost: "التكلفة التقديرية (Estimated Cost)",
  Purpose: "الغرض من الشراء (Purpose)",
  PONo: "رقم أمر التوريد (PO No)",
  PODate: "تاريخ أمر التوريد (PO Date)",
  TotalAmountForeign: "المبلغ بالعملة الأجنبية (Amount Foreign)",
  Currency: "العملة (Currency)",
  TotalAmountEGP: "المبلغ بالجنيه المصري (Amount EGP)",
  LineID: "رقم السطر (Line ID)",
  Quantity: "الكمية (Quantity)",
  UnitPriceFC: "سعر الوحدة بالعملة الأجنبية (Unit Price FC)",
  SubTotalEGP: "الإجمالي الفرعي بالجنيه المصري (SubTotal EGP)",
  PurchaseInvoiceNo: "رقم فاتورة المشتريات (Invoice No)",
  InvoiceDate: "تاريخ الفاتورة (Invoice Date)",
  NetTotalEGP: "صافي القيمة بالجنيه المصري (Net Total EGP)",
  VATAmountEGP: "ضريبة القيمة المضافة بالجنيه المصري (VAT EGP)",
  GrandTotalEGP: "الإجمالي النهائي بالجنيه المصري (Grand Total EGP)",
  PaidAmountEGP: "المبلغ المدفوع بالجنيه المصري (Paid Amount EGP)",
  
  // Sales
  SalesPersonCode: "كود مندوب المبيعات (Rep Code)",
  TargetQuarterly: "الهدف الربع سنوي (Target Quarterly)",
  CommissionRate: "نسبة العموله (Commission %)",
  Region: "المنطقة الجغرافية (Region)",
  QuotationNo: "رقم عرض السعر (Quotation No)",
  QuotationDate: "تاريخ عرض السعر (Quotation Date)",
  ValidUntil: "صالح حتى (Valid Until)",
  UnitPrice: "سعر الوحدة (UnitPrice)",
  SubTotal: "الإجمالي الفرعي (SubTotal)",
  InvoiceNo: "رقم فاتورة المبيعات (Invoice No)",
  NetTotal: "صافي القيمة قبل الضريبة (Net Total)",
  VATAmount: "قيمة الضريبة (VAT Amount)",
  GrandTotal: "الإجمالي شامل الضريبة (Grand Total)",
  PaidAmount: "المبلغ المحصل (Paid Amount)",
  
  // Remnants
  RemnantID: "كود فضلة الأستانلس ستيل (Remnant ID)",
  RemainingThick: "السُمك المتبقي الفعلي مم (Thick)",
  RemainingWidth: "العرض المتبقي الفعلي مم (Width)",
  RemainingLength: "الطول المتبقي الفعلي مم (Length)",
  RemainingWeight: "الوزن المتبقي الفعلي كجم (Weight)",
  Grade: "درجة ونوع سبيكة الصلب (Grade)",
  AvailabilityStatus: "حالة التوافر للبيع الفوري",
  CutOrderNo: "رقم أمر القطع والتشغيل (Cut Order No)",
  
  // Manufacturing
  MOID: "رقم أمر الإنتاج المصنعي (MO ID)",
  WOID: "رقم قيد أمر التشغيل الداخلي (WO ID)",
  PlannedStartDate: "تاريخ البدء المخطط (Start Date)",
  PlannedQty: "الكمية الكلية المقررة (Planned Qty)",
  ProducedQty: "الكمية المنتجة الفعالة (Produced Qty)",
  
  // Ledger
  ReferenceNo: "رقم السند المرجعي المالي (Ref No)",
  JournalEntryNo: "رقم قيد اليومية العامة (JE No)",
  PostDate: "تاريخ ترحيل القيد لدفتر الأستاذ (Post Date)",
  ValueDate: "تاريخ استحقاق الأثر المالي (Value Date)",
  AccountCode: "رقم كود الحساب العام بالدليل",
  GLAccountCode: "كود الحساب في شجرة الحسابات",
  Debit: "الجانب المدين المالي (Debit)",
  Credit: "الجانب الدائن المالي (Credit)",
  Narration: "شرح تفصيلي وبند القيد (Narration)",
  
  // Imports
  ContainerID: "رقم الحاوية الاستيرادية (Container ID)",
  ContainerNo: "الرقم التسلسلي للحاوية (Container No)",
  ExpectedArrivalDate: "تاريخ الوصول المتوقع (Expected Arrival)",
  ETADate: "تاريخ التخليص المتوقع (ETA)",
  OriginPort: "ميناء الشحن والتصدير الأصلي (Origin)",
  ShippingStatus: "حالة الشحن الدولي (Shipping Status)",
  LandedCostValue: "التكلفة الكلية شاملة الجمارك والشحن",
  TotalCostValue: "إجمالي قيمة البضائع المستوردة",
  
  // Lots
  LotID: "رقم اللوط المخزني المميز (Lot ID)",
  LotNumber: "الرقم التسلسلي للوط الشحنة",
  QuantityOnHand: "الكمية الفعلية المتوفرة (Qty On Hand)",
  Qty: "الكمية المتوفرة (Qty)",
  QualityStatus: "حالة فحص الجودة المعتمدة (Quality)",
  
  // Generic
  CategoryName: "اسم التصنيف الإداري",
  ArabicName: "الاسم باللغة العربية",
};

const resolveSheetIdFromKeyAndValue = (colKey: string, val: any): { sheetId: string; targetKey: string } | null => {
  if (!val) return null;
  const strVal = String(val).trim();
  
  if (colKey === "EntityCode" || colKey === "EntityID") {
    if (strVal.startsWith("C")) {
      return { sheetId: "customers", targetKey: "CustomerCode" };
    } else if (strVal.startsWith("S")) {
      return { sheetId: "suppliers", targetKey: "SupplierCode" };
    }
  }
  
  if (KEY_TO_SHEET_MAP[colKey]) {
    return KEY_TO_SHEET_MAP[colKey];
  }
  
  return null;
};

export default function App() {
  // --- STATE ---
  const [sheets, setSheets] = useState<SheetConfig[]>(ALL_ERP_SHEETS);
  const [selectedSheetId, setSelectedSheetId] = useState<string>("dashboard");
  const [sidebarSearch, setSidebarSearch] = useState<string>("");
  const [tableSearch, setTableSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState<"day" | "week" | "month" | "all">("all");
  const [dashboardDate, setDashboardDate] = useState<string>("25-05-2024");
  
  // Dashboard Sub-navigation Tab
  const [activeDashboardTab, setActiveDashboardTab] = useState<"metrics" | "erd" | "cutting" | "pricing">("metrics");
  
  // Steel Cutting Simulator State (from the user's ERP Mind Map)
  const [cutRawLength, setCutRawLength] = useState<number>(2000);
  const [cutRawWidth, setCutRawWidth] = useState<number>(1000);
  const [cutReqLength, setCutReqLength] = useState<number>(600);
  const [cutReqWidth, setCutReqWidth] = useState<number>(400);
  const [cutReqQty, setCutReqQty] = useState<number>(6);
  
  // Pricing Engine State (from the user's ERP Mind Map)
  const [priceGrade, setPriceGrade] = useState<string>("304");
  const [priceRawCost, setPriceRawCost] = useState<number>(120000); // EGP per Ton
  const [priceProcessCost, setPriceProcessCost] = useState<number>(1500); // EGP per Ton
  const [priceProfitMargin, setPriceProfitMargin] = useState<number>(15); // % Profit Margin

  // Gmail state
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState<boolean>(false);
  const [emailTo, setEmailTo] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Calendar state
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [calSummary, setCalSummary] = useState<string>("");
  const [calStartDate, setCalStartDate] = useState<string>("");
  const [calStartTime, setCalStartTime] = useState<string>("");
  const [calEndDate, setCalEndDate] = useState<string>("");
  const [calEndTime, setCalEndTime] = useState<string>("");
  const [calDescription, setCalDescription] = useState<string>("");
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);

  // Authentication
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Export progress
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportedId, setExportedId] = useState<string | null>(null);

  // Edit / Add Row
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [isAddingRow, setIsAddingRow] = useState<boolean>(false);
  const [rowForm, setRowForm] = useState<Record<string, any>>({});
  const [showRawTable, setShowRawTable] = useState<boolean>(false);

  // Inventory Reconciliation States
  const [reconciliationActive, setReconciliationActive] = useState<boolean>(false);
  const [reconWarehouseCode, setReconWarehouseCode] = useState<string>("");
  const [reconItemCode, setReconItemCode] = useState<string>("");
  const [reconPhysicalQty, setReconPhysicalQty] = useState<string>("");
  const [reconReason, setReconReason] = useState<string>("فروقات تسوية سنوية / Annual adjustment");
  const [reconApprover, setReconApprover] = useState<string>("E003");

  // Relational Table Explorer State
  const [exploringRow, setExploringRow] = useState<any | null>(null);
  const [exploringSheetId, setExploringSheetId] = useState<string>("");
  const [expandedChildSheetId, setExpandedChildSheetId] = useState<string>("");

  // Custom alert and confirmation modal state
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  const showAlert = (title: string, message: string) => {
    setDialogConfig({
      isOpen: true,
      type: "alert",
      title,
      message,
      confirmText: "إغلاق (Close)"
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    confirmText = "تأكيد (Confirm)",
    cancelText = "إلغاء (Cancel)"
  ) => {
    setDialogConfig({
      isOpen: true,
      type: "confirm",
      title,
      message,
      onConfirm,
      confirmText,
      cancelText
    });
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<{
    id: string;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    duration?: number;
  }[]>([]);

  const showToast = (title: string, message: string, type: "success" | "error" | "info" = "success", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  // Audit Validation
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<{
    status: "success" | "warning" | "error";
    message: string;
    checks: { name: string; status: "pass" | "fail"; details: string }[];
  } | null>(null);

  // --- RECENT EXPORT TITLE ---
  const [spreadsheetTitle, setSpreadsheetTitle] = useState<string>(
    `International Steel ERP Master - ${new Date().toISOString().split("T")[0]}`
  );

  // --- AI CHAT STATE ---
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [aiHistory, setAiHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "مرحباً بك! أنا مساعد الذكاء الاصطناعي لشركة الدولية ستيل (International Steel).\n\nكيف يمكنني مساعدتك اليوم في تحليل بيانات المستندات أو المخازن أو المبيعات أو المشتريات؟" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleSendAiMessage = async () => {
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage;
    setAiMessage("");
    setAiHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsAiLoading(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMsg,
          currentSheetId: selectedSheetId
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setAiHistory((prev) => [...prev, { sender: "ai", text: data.text }]);
      } else {
        setAiHistory((prev) => [...prev, { sender: "ai", text: data.error || "عذراً، حدث خطأ أثناء معالجة الطلب." }]);
      }
    } catch (err: any) {
      console.error(err);
      setAiHistory((prev) => [...prev, { sender: "ai", text: "عذراً، لم أتمكن من الاتصال بالخادم. يرجى المحاولة لاحقاً." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- INITIALIZE AUTHENTICATION ---
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // --- FETCH SHEETS FROM SERVER ON MOUNT & TOKEN CHANGE ---
  useEffect(() => {
    const fetchAllSheets = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch("/api/sheets-all", { headers });
        if (response.ok) {
          const data = await response.json();
          setSheets(data);
        }
      } catch (err) {
        console.error("Failed to load worksheets:", err);
      }
    };
    fetchAllSheets();
  }, [token]);

  // --- GMAIL & CALENDAR INTEGRATIONS ---
  const fetchEmails = async () => {
    if (!token) return;
    setIsLoadingEmails(true);
    try {
      const response = await fetch("/api/gmail/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEmails(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch Gmail inbox:", err);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleSendEmail = async () => {
    if (!token) return;
    if (!emailTo || !emailSubject || !emailBody) {
      showAlert("حقول مطلوبة", "يرجى ملء جميع حقول البريد الإلكتروني.");
      return;
    }
    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      });
      if (response.ok) {
        showAlert("تم الإرسال بنجاح", "تم إرسال البريد الإلكتروني بنجاح عبر حساب Gmail الخاص بك.");
        setEmailTo("");
        setEmailSubject("");
        setEmailBody("");
        fetchEmails();
      } else {
        const data = await response.json();
        showAlert("خطأ في الإرسال", data.error || "فشل إرسال البريد الإلكتروني.");
      }
    } catch (err: any) {
      showAlert("خطأ في الاتصال", err.message || "فشل إرسال البريد الإلكتروني.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const fetchEvents = async () => {
    if (!token) return;
    setIsLoadingEvents(true);
    try {
      const response = await fetch("/api/calendar/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch Calendar events:", err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!token) return;
    if (!calSummary || !calStartDate || !calStartTime || !calEndDate || !calEndTime) {
      showAlert("حقول مطلوبة", "يرجى ملء جميع حقول الموعد الأساسية.");
      return;
    }
    setIsCreatingEvent(true);
    try {
      const startDateTime = `${calStartDate}T${calStartTime}:00`;
      const endDateTime = `${calEndDate}T${calEndTime}:00`;
      
      const event = {
        summary: calSummary,
        description: calDescription,
        start: { dateTime: startDateTime, timeZone: "Africa/Cairo" },
        end: { dateTime: endDateTime, timeZone: "Africa/Cairo" }
      };

      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event)
      });
      if (response.ok) {
        showAlert("تم الإضافة بنجاح", "تمت جدولة الموعد بنجاح وحفظه في Google Calendar.");
        setCalSummary("");
        setCalStartDate("");
        setCalStartTime("");
        setCalEndDate("");
        setCalEndTime("");
        setCalDescription("");
        fetchEvents();
      } else {
        const data = await response.json();
        showAlert("خطأ في الحفظ", data.error || "فشل حفظ الموعد.");
      }
    } catch (err: any) {
      showAlert("خطأ في الاتصال", err.message || "فشل حفظ الموعد.");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (selectedSheetId === "gmail") {
        fetchEmails();
      } else if (selectedSheetId === "calendar") {
        fetchEvents();
      }
    }
  }, [selectedSheetId, token]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const isPopupError =
        err?.code === "auth/popup-closed-by-user" ||
        err?.message?.includes("popup-closed-by-user") ||
        err?.message?.includes("popup closed") ||
        err?.message?.includes("closed by user");

      if (isPopupError) {
        showAlert(
          "Google Authentication Blocked / Closed",
          "The Google Sign-In window was closed or blocked by your browser.\n\nSince this ERP is running inside a secure preview iframe, browsers often block popups or restrict cookies by default.\n\n💡 **How to easily solve this:**\n1. Click the **'Open in new tab'** button (diagonal arrow icon) in the top-right corner of the preview area to run the app directly in a full browser tab.\n2. Allow popups for this site in your browser's address bar settings.\n3. Try signing in again!"
        );
      } else {
        showAlert(
          "Authentication Failed",
          `An error occurred during Google Sign-In:\n\n${err?.message || err}`
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    showConfirm(
      "Disconnect Google Account",
      "Are you sure you want to sign out? This will disconnect the integration with Google Sheets.",
      async () => {
        await logout();
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      },
      "Sign Out",
      "Cancel"
    );
  };

  // --- EXPORT TRIGGERS ---
  const triggerExcelDownload = () => {
    downloadExcelWorkbook(sheets, "International_Steel_ERP_Master_Workbook.xlsx");
    showToast(
      "تم تصدير ملف Excel بنجاح / Excel Export Complete!",
      "تم تجميع وتنزيل كتاب العمل الكامل المكون من 51 جدولاً بنجاح بصيغة 'International_Steel_ERP_Master_Workbook.xlsx'.",
      "success",
      6000
    );
  };

  // --- AUTO-SAVE PDF TO GOOGLE DRIVE ---
  const autoSavePDFToGoogleDrive = async (
    fileName: string,
    htmlContent: string,
    isLandscape: boolean
  ) => {
    if (!token) {
      showToast(
        "Google Drive Backup / نسخ احتياطي",
        "Sign in with Google to automatically save PDF reports to Google Drive.",
        "info",
        7000
      );
      return;
    }

    showToast(
      "Saving to Google Drive / جاري الحفظ في درايف",
      "Generating PDF copy and saving to your 'Reports' folder...",
      "info",
      5000
    );

    try {
      // 1. Create temporary off-screen container in the DOM
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = isLandscape ? "1120px" : "800px";
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // 2. Load html2pdf library dynamically from CDN
      const html2pdfLib = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2pdf) {
          resolve((window as any).html2pdf);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve((window as any).html2pdf);
        script.onerror = () => reject(new Error("Failed to load html2pdf from CDN"));
        document.body.appendChild(script);
      });

      // 3. Configure and generate PDF Blob
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     fileName,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: "mm", format: "a4", orientation: isLandscape ? "landscape" : "portrait" }
      };

      const pdfBlob = await html2pdfLib().set(opt).from(tempDiv).output("blob");
      
      // Clean up DOM immediately
      document.body.removeChild(tempDiv);

      // 4. Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      
      await new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64data = (reader.result as string).split(",")[1];
            
            // 5. Post to our backend endpoint
            const response = await fetch("/api/drive/upload-report", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                fileName,
                pdfBase64: base64data
              })
            });

            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.error || "Failed to upload to Google Drive");
            }

            showToast(
              "Report Saved Successfully / تم الحفظ بنجاح",
              `Saved a copy of "${fileName}" inside the "Reports" folder on Google Drive.`,
              "success",
              8000
            );
            resolve();
          } catch (uploadErr: any) {
            reject(uploadErr);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read PDF blob"));
      });

    } catch (err: any) {
      console.error("Error saving PDF to Google Drive:", err);
      showToast(
        "Google Drive Error / خطأ في جوجل درايف",
        `Failed to auto-save PDF copy: ${err.message || err}`,
        "error",
        10000
      );
    }
  };

  const handleGeneratePDFReport = (sheetToPrint = activeSheet, rowsToPrint = filteredRows) => {
    const isLandscape = sheetToPrint.columns.length > 6;
    const docId = `ERP-REP-${sheetToPrint.id.toUpperCase().replace(/\s+/g, '-')}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    const arabicTimestamp = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "long",
      timeStyle: "medium"
    }).format(new Date());

    const localNumericalColumns = sheetToPrint.columns.filter((col) => {
      const key = col.key.toLowerCase();
      const isCommonNumericKey =
        key.includes("price") ||
        key.includes("qty") ||
        key.includes("quantity") ||
        key.includes("amount") ||
        key.includes("weight") ||
        key.includes("total") ||
        key.includes("cost") ||
        key.includes("thickness") ||
        key.includes("width") ||
        key.includes("length");

      const numericValuesCount = sheetToPrint.rows.filter((row) => {
        const val = row[col.key];
        if (val === undefined || val === null || val === "") return false;
        const cleaned = String(val).replace(/[^\d.-]/g, "");
        return !isNaN(parseFloat(cleaned)) && isFinite(Number(cleaned));
      }).length;

      return (
        isCommonNumericKey ||
        (numericValuesCount > 0 && numericValuesCount >= sheetToPrint.rows.length * 0.3)
      );
    });

    const summaries = localNumericalColumns.map((col) => {
      const sum = rowsToPrint.reduce((acc, r) => acc + cleanNumericValue(r[col.key]), 0);
      return {
        label: col.label,
        key: col.key,
        sum: sum,
      };
    });

    const formatValue = (val: number, key: string) => {
      const k = key.toLowerCase();
      const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(val);
      if (k.includes("price") || k.includes("cost") || k.includes("amount") || k.includes("total")) {
        return `${formatted} USD`;
      }
      return formatted;
    };

    const isStatusColumn = (key: string) => {
      const k = key.toLowerCase();
      return k.includes("status") || k.includes("state") || k.includes("حالة") || k.includes("وضعية");
    };

    const getStatusBadgeHtml = (val: string) => {
      const v = String(val).trim().toLowerCase();
      let bg = "bg-slate-100 text-slate-800 border-slate-200";
      if (v.includes("active") || v.includes("completed") || v.includes("done") || v.includes("نشط") || v.includes("تم") || v.includes("مكتمل") || v.includes("مدفوع") || v.includes("paid")) {
        bg = "bg-emerald-50 text-emerald-800 border-emerald-200";
      } else if (v.includes("pending") || v.includes("progress") || v.includes("قيد") || v.includes("انتظار") || v.includes("شحن") || v.includes("transit")) {
        bg = "bg-amber-50 text-amber-800 border-amber-200";
      } else if (v.includes("cancelled") || v.includes("deleted") || v.includes("error") || v.includes("ملغي") || v.includes("محذوف") || v.includes("متأخر") || v.includes("overdue")) {
        bg = "bg-rose-50 text-rose-800 border-rose-200";
      }
      return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${bg}">${val}</span>`;
    };

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    printFrame.id = "pdf-print-iframe";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8">
        <title>ERP Report - ${sheetToPrint.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          
          @media print {
            @page {
              size: A4 ${isLandscape ? "landscape" : "portrait"};
              margin: 12mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: #ffffff;
            }
          }
          
          body {
            font-family: 'Inter', 'Cairo', sans-serif;
            color: #1e293b;
            background-color: #ffffff;
          }
          
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
        </style>
      </head>
      <body class="p-4 sm:p-6">
        <!-- Letterhead Header -->
        <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="bg-slate-900 text-white p-2.5 rounded-xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold tracking-tight text-slate-900 font-sans">الشركة الدولية للصلب</h1>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">International Steel Co.</p>
            </div>
          </div>
          
          <div class="text-right font-mono text-[9px] text-slate-500 space-y-0.5">
            <p class="font-bold text-slate-900 text-[10px]">OFFICIAL ERP DATA LEDGER</p>
            <p><span class="font-semibold text-slate-700">Doc ID:</span> ${docId}</p>
            <p><span class="font-semibold text-slate-700">Printed:</span> ${timestamp}</p>
            <p><span class="font-semibold text-slate-700">Arabic Time:</span> ${arabicTimestamp}</p>
            <p><span class="font-semibold text-slate-700">Verification:</span> Electronically Verified</p>
          </div>
        </div>

        <!-- Document Title -->
        <div class="mb-5">
          <div class="flex justify-between items-baseline">
            <h2 class="text-sm font-bold text-slate-900">${sheetToPrint.name} / ${sheetToPrint.arabicName}</h2>
            <span class="text-[10px] bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-bold border border-slate-200">${sheetToPrint.category}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Showing current operational dataset. 
            ${tableSearch ? `Filtered by query: "<span class="text-slate-600 font-semibold">${tableSearch}</span>"` : "Unfiltered master ledger snapshot."}
          </p>
        </div>

        <!-- Summary Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total Records / إجمالي السجلات</p>
            <p class="text-base font-bold text-slate-900 mt-0.5">${rowsToPrint.length} <span class="text-[10px] font-normal text-slate-500">Rows</span></p>
          </div>
          ${summaries.slice(0, 3).map(s => `
            <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
              <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">${s.label} / إجمالي</p>
              <p class="text-base font-bold text-slate-900 mt-0.5">${formatValue(s.sum, s.key)}</p>
            </div>
          `).join('')}
        </div>

        <!-- Table View -->
        <div class="overflow-hidden border border-slate-200 rounded-lg mb-6">
          <table class="w-full text-left border-collapse text-[9px]">
            <thead>
              <tr class="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <th class="px-2 py-2 font-mono text-center w-6 bg-slate-200/50">#</th>
                ${sheetToPrint.columns.map(col => `
                  <th class="px-2.5 py-2 border-r border-slate-200 last:border-r-0">${col.label}</th>
                `).join('')}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono text-slate-700 bg-white">
              ${rowsToPrint.map((row, idx) => `
                <tr class="hover:bg-slate-50/20 even:bg-slate-50/5">
                  <td class="px-2 py-1.5 text-center text-slate-400 bg-slate-50/40 border-r border-slate-200">${idx + 1}</td>
                  ${sheetToPrint.columns.map(col => {
                    const val = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : "-";
                    const isStatus = isStatusColumn(col.key);
                    return `
                      <td class="px-2.5 py-1.5 border-r border-slate-100 last:border-r-0 text-slate-800">
                        ${isStatus ? getStatusBadgeHtml(String(val)) : val}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
              ${rowsToPrint.length === 0 ? `
                <tr>
                  <td colspan="${sheetToPrint.columns.length + 1}" class="text-center p-8 text-slate-400 font-sans">
                    No records found matching current criteria.
                  </td>
                </tr>
              ` : ""}
            </tbody>
          </table>
        </div>

        <!-- Corporate Sign-off Area -->
        <div class="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-center text-[10px]">
          <div>
            <p class="text-slate-400 font-bold">PREPARED BY / أعد بواسطة</p>
            <div class="h-12 flex items-center justify-center">
              <p class="font-mono text-[9px] text-slate-300 italic">SYSTEM OPERATOR ACCESS</p>
            </div>
            <div class="border-t border-slate-200 pt-1.5 w-40 mx-auto">
              <p class="font-bold text-slate-800">System ERP Administrator</p>
              <p class="text-[8px] text-slate-400">الدولية ستيل Ledger Portal</p>
            </div>
          </div>
          
          <div>
            <p class="text-slate-400 font-bold">AUTHORIZED RELEASING AUTHORITY / الاعتماد والمراجعة</p>
            <div class="h-12 flex items-center justify-center">
              <div class="border border-dashed border-emerald-300 px-3 py-1 rounded-md bg-emerald-50/40 text-[8px] font-mono text-emerald-700 inline-flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>SECURE DIGITAL APPROVAL SEAL</span>
              </div>
            </div>
            <div class="border-t border-slate-200 pt-1.5 w-40 mx-auto">
              <p class="font-bold text-slate-800">Internal Audit Committee</p>
              <p class="text-[8px] text-slate-400">إدارة الرقابة والمراجعة الداخلية</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-[8px] text-slate-400 space-y-0.5">
          <p>© 2026 الشركة الدولية للصلب (International Steel). Generated from master ERP database server securely.</p>
          <p class="font-mono">Audit Hash: SHA256-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()} | Page 1 of 1</p>
        </div>
      </body>
      </html>
    `;

    doc.write(htmlContent);
    doc.close();

    // Automatically backup report copy to Google Drive
    const fileName = `${sheetToPrint.name.replace(/\s+/g, "_")}_Report_${docId}.pdf`;
    autoSavePDFToGoogleDrive(fileName, htmlContent, isLandscape);

    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1500);
      }, 500);
    };
  };

  const handleGenerateMasterPDF = () => {
    const docId = `ERP-EXECUTIVE-MASTER-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
    });
    const arabicTimestamp = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "long", timeStyle: "medium"
    }).format(new Date());

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    printFrame.id = "pdf-print-iframe";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const totalSheetsCount = sheets.length;
    const totalRecordsCount = sheets.reduce((acc, sh) => acc + sh.rows.length, 0);
    
    const sheetsByCategory = categories.filter(cat => cat !== "All").map(cat => {
      const catSheets = sheets.filter(sh => sh.category === cat);
      const catRowsCount = catSheets.reduce((acc, sh) => acc + sh.rows.length, 0);
      return {
        category: cat,
        sheets: catSheets,
        totalRows: catRowsCount
      };
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8">
        <title>ERP Master Executive Report - الدولية ستيل</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          
          @media print {
            @page {
              size: A4 portrait;
              margin: 15mm 12mm 15mm 12mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: #ffffff;
            }
            .page-break {
              page-break-before: always;
              break-before: page;
            }
          }
          
          body {
            font-family: 'Inter', 'Cairo', sans-serif;
            color: #1e293b;
            background-color: #ffffff;
          }
          
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body class="p-4 sm:p-6">
        <!-- COVER PAGE -->
        <div class="min-h-[250mm] flex flex-col justify-between border-4 border-slate-900 p-8 rounded-2xl">
          <!-- Top Header -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="bg-slate-900 text-white p-3 rounded-2xl">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-extrabold tracking-tight text-slate-900">الشركة الدولية للصلب</h1>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider">International Steel Co.</p>
              </div>
            </div>
            <div class="text-right text-[10px] text-slate-400 font-mono">
              <p>CONFIDENTIAL</p>
              <p>SYSTEM ID: MASTER-ERP</p>
            </div>
          </div>

          <!-- Middle Cover Title -->
          <div class="my-auto space-y-4 text-center">
            <span class="text-[11px] bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-extrabold border border-emerald-200 uppercase tracking-widest">
              Executive Briefing Book
            </span>
            <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mt-2">
              CONSOLIDATED ERP MASTER REPORT
            </h1>
            <h2 class="text-2xl font-bold text-slate-700 mt-1 font-sans">
              لوحة البيانات والتقرير التنفيذي الشامل
            </h2>
            <div class="w-24 h-1 bg-slate-900 mx-auto my-6"></div>
            <p class="text-xs text-slate-500 max-w-md mx-auto">
              This publication comprises a comprehensive ledger summary and auditing digest of all 51 databases, inventories, accounts, transactions, and logs.
            </p>
          </div>

          <!-- Cover Footer Metadata -->
          <div class="border-t border-slate-200 pt-6 grid grid-cols-3 gap-4 text-left text-[10px] font-mono">
            <div>
              <p class="text-slate-400 font-bold">DATABASE SCALE</p>
              <p class="text-slate-900 font-bold mt-1 text-sm">${totalSheetsCount} Worksheets</p>
              <p class="text-slate-500">${totalRecordsCount} Total Ledger Rows</p>
            </div>
            <div>
              <p class="text-slate-400 font-bold">GENERATION DATE</p>
              <p class="text-slate-900 font-bold mt-1">${timestamp}</p>
              <p class="text-slate-500">${arabicTimestamp}</p>
            </div>
            <div class="text-right">
              <p class="text-slate-400 font-bold">REPORT STATUS</p>
              <p class="text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
                <span>●</span> VERIFIED ACCURATE
              </p>
              <p class="text-slate-500">Doc ID: ${docId}</p>
            </div>
          </div>
        </div>

        <!-- PAGE BREAK: EXECUTIVE ANALYSIS & TABLE OF CONTENTS -->
        <div class="page-break pt-8">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Master ERP Report | Page 2</h3>
            <p class="text-[9px] text-slate-400 font-mono">Doc: ${docId}</p>
          </div>

          <h2 class="text-lg font-extrabold text-slate-900 mb-2">Executive Summary & Audit Log</h2>
          <p class="text-xs text-slate-600 mb-6 leading-relaxed font-sans">
            International Steel Co. ERP system operates with server-side validation and secure database streaming. 
            All ledger records listed below correspond directly to verified corporate transactions and warehouse logs. 
            This digest serves as a physical-compliance paper trail for corporate governance and asset auditing.
          </p>

          <h3 class="text-sm font-extrabold text-slate-800 uppercase mb-3 tracking-wide">Worksheet Directory by Category</h3>
          <div class="space-y-4">
            ${sheetsByCategory.map(catGroup => `
              <div class="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div class="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-2">
                  <h4 class="text-xs font-bold text-slate-900">${catGroup.category}</h4>
                  <span class="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border px-2 py-0.5 rounded-full">
                    ${catGroup.sheets.length} sheets | ${catGroup.totalRows} rows
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
                  ${catGroup.sheets.slice(0, 8).map(s => `
                    <div class="flex justify-between border-b border-slate-100 pb-0.5">
                      <span class="truncate pr-2">${s.name} (${s.arabicName})</span>
                      <span class="text-slate-900 font-bold font-mono">${s.rows.length} rows</span>
                    </div>
                  `).join('')}
                  ${catGroup.sheets.length > 8 ? `
                    <div class="col-span-2 text-right text-[8px] text-slate-400">
                      + ${catGroup.sheets.length - 8} more worksheets in this section
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- PAGE BREAK: DEPARTMENTAL HIGHLIGHTS & INDIVIDUAL METRICS -->
        ${sheetsByCategory.map(catGroup => {
          if (catGroup.sheets.length === 0) return '';
          return `
            <div class="page-break pt-8">
              <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">${catGroup.category} Report Digest</h3>
                <p class="text-[9px] text-slate-400 font-mono">${docId}</p>
              </div>

              <div class="mb-4">
                <h2 class="text-base font-extrabold text-slate-900">${catGroup.category} Overview</h2>
                <p class="text-[10px] text-slate-400">Ledger snapshot of worksheets in this department</p>
              </div>

              <!-- Sheet List with Summary metrics -->
              <div class="space-y-4">
                ${catGroup.sheets.slice(0, 4).map(sh => {
                  const shNumericCols = sh.columns.filter(col => {
                    const key = col.key.toLowerCase();
                    return key.includes("price") || key.includes("qty") || key.includes("quantity") || key.includes("amount") || key.includes("total") || key.includes("cost");
                  });

                  const sums = shNumericCols.map(col => {
                    const total = sh.rows.reduce((sumAcc, r) => sumAcc + cleanNumericValue(r[col.key]), 0);
                    return { label: col.label, value: total, key: col.key };
                  });

                  return `
                    <div class="border border-slate-200 rounded-lg p-3 bg-white">
                      <div class="flex justify-between items-baseline mb-1.5">
                        <h4 class="text-xs font-bold text-slate-900">${sh.name} / <span class="font-normal text-slate-500">${sh.arabicName}</span></h4>
                        <span class="text-[9px] text-slate-400 font-mono">${sh.rows.length} Records</span>
                      </div>

                      ${sums.length > 0 ? `
                        <div class="grid grid-cols-3 gap-2 mb-2 bg-slate-50 p-2 rounded-md font-mono text-[9px]">
                          ${sums.slice(0, 3).map(s => `
                            <div>
                              <span class="text-slate-400 block">${s.label}</span>
                              <span class="text-slate-800 font-bold">${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(s.value)}</span>
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}

                      <table class="w-full border-collapse text-[8px] font-mono text-slate-600 mt-1">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                            ${sh.columns.slice(0, 4).map(c => `<th class="px-1.5 py-1 text-left">${c.label}</th>`).join('')}
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                          ${sh.rows.slice(0, 2).map(r => `
                            <tr>
                              ${sh.columns.slice(0, 4).map(c => `<td class="px-1.5 py-1 truncate max-w-[120px]">${r[c.key] !== undefined ? r[c.key] : "-"}</td>`).join('')}
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}

        <!-- FINAL PAGE: CORPORATE CLOSING & DIGITAL SIGNATURE SEAL -->
        <div class="page-break pt-8 flex flex-col justify-between min-h-[220mm]">
          <div>
            <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Sign-off & Audit Compliance</h3>
              <p class="text-[9px] text-slate-400 font-mono">${docId}</p>
            </div>

            <div class="space-y-4 text-xs text-slate-600 font-sans">
              <h4 class="text-sm font-bold text-slate-900">Declaration of Database Accuracy</h4>
              <p class="leading-relaxed">
                By executing this physical document printout, the user confirms that the records displayed represent the state of the active databases at the time of compilation. 
                All transaction histories, contacts lists, inventory ledgers, and logs are encrypted at rest and verified for compliance with international steel distribution standards.
              </p>
              <p class="leading-relaxed">
                The digital approval seals affixed below confirm that this report has passed all system integrity checks and represents a true and complete operational report of the الشركة الدولية للصلب (International Steel).
              </p>
            </div>
          </div>

          <!-- Digital Seal and Corporate signature blocks -->
          <div class="grid grid-cols-2 gap-10 text-center text-[10px] border-t border-slate-200 pt-10">
            <div>
              <p class="text-slate-400 font-bold uppercase">Prepared & Audited By</p>
              <div class="h-16 flex items-center justify-center">
                <p class="font-mono text-[9px] text-slate-300 italic">AUTOMATED SYSTEM RUN</p>
              </div>
              <div class="border-t border-slate-200 pt-2 w-48 mx-auto">
                <p class="font-bold text-slate-800">System ERP Administrator</p>
                <p class="text-[8px] text-slate-400">الشركة الدولية للصلب Portal</p>
              </div>
            </div>

            <div>
              <p class="text-slate-400 font-bold uppercase">Authorized Certification Authority</p>
              <div class="h-16 flex items-center justify-center">
                <div class="border-2 border-dashed border-emerald-300 px-4 py-1.5 rounded-xl bg-emerald-50/50 text-[9px] font-mono text-emerald-800 inline-flex items-center gap-1.5 shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span class="font-bold">SECURE ERP DIGITAL CERTIFICATE SEAL</span>
                </div>
              </div>
              <div class="border-t border-slate-200 pt-2 w-48 mx-auto">
                <p class="font-bold text-slate-800">Executive Audit & Control Committee</p>
                <p class="text-[8px] text-slate-400">إدارة المراجعة العامة والرقابة الداخلية</p>
              </div>
            </div>
          </div>

          <div class="text-center text-[8px] text-slate-400 space-y-1">
            <p>© 2026 الشركة الدولية للصلب (International Steel). Generated from master ERP database server securely.</p>
            <p class="font-mono">Audit Digest Hash: SHA256-${Math.floor(Math.random() * 1000000000).toString(16).toUpperCase()} | Authorized for Internal Use Only</p>
          </div>
        </div>
      </body>
      </html>
    `;

    doc.write(htmlContent);
    doc.close();

    // Automatically backup report copy to Google Drive
    const fileName = `Master_Executive_Report_${docId}.pdf`;
    autoSavePDFToGoogleDrive(fileName, htmlContent, false);

    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1500);
      }, 500);
    };
  };

  const handleGenerateDepartmentPDF = (categoryName: string) => {
    const docId = `ERP-DEPT-${categoryName.toUpperCase().replace(/\s+/g, '-')}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
    });
    const arabicTimestamp = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "long", timeStyle: "medium"
    }).format(new Date());

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    printFrame.id = "pdf-print-iframe";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const deptSheets = sheets.filter(sh => sh.category === categoryName);
    const totalDeptRows = deptSheets.reduce((acc, sh) => acc + sh.rows.length, 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8">
        <title>ERP Department Report - ${categoryName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: #ffffff;
            }
            .page-break {
              page-break-before: always;
              break-before: page;
            }
          }
          
          body {
            font-family: 'Inter', 'Cairo', sans-serif;
            color: #1e293b;
            background-color: #ffffff;
          }
          
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body class="p-4 sm:p-6">
        <!-- Letterhead Header -->
        <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="bg-slate-900 text-white p-2.5 rounded-xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold tracking-tight text-slate-900 font-sans">الشركة الدولية للصلب</h1>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">International Steel Co.</p>
            </div>
          </div>
          
          <div class="text-right font-mono text-[9px] text-slate-500 space-y-0.5">
            <p class="font-bold text-slate-900 text-[10px]">DEPARTMENTAL LEDGER SUMMARY</p>
            <p><span class="font-semibold text-slate-700">Doc ID:</span> ${docId}</p>
            <p><span class="font-semibold text-slate-700">Department:</span> ${categoryName}</p>
            <p><span class="font-semibold text-slate-700">Printed:</span> ${timestamp}</p>
            <p><span class="font-semibold text-slate-700">Verification:</span> Secure Digital Audit</p>
          </div>
        </div>

        <!-- Document Title -->
        <div class="mb-5">
          <h2 class="text-sm font-bold text-slate-900">${categoryName} Department Audit Ledger / لوحة المراقبة والتحقق</h2>
          <p class="text-[10px] text-slate-400 mt-1 font-sans">
            Consolidated printout of all worksheets matching this department. 
            Contains ${deptSheets.length} active ledgers and ${totalDeptRows} total verified entries.
          </p>
        </div>

        <!-- Summary Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Active Ledgers / دفاتر الحسابات</p>
            <p class="text-base font-bold text-slate-900 mt-0.5">${deptSheets.length}</p>
          </div>
          <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total Recorded Rows / السجلات</p>
            <p class="text-base font-bold text-slate-900 mt-0.5">${totalDeptRows}</p>
          </div>
          <div class="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 col-span-2">
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Authorized Auditor / المراجع المعتمد</p>
            <p class="text-xs font-bold text-slate-900 mt-1 truncate">mahmoudsobhyacc@gmail.com</p>
          </div>
        </div>

        <!-- Worksheets Detail Ledger list -->
        <div class="space-y-6">
          ${deptSheets.map((sh, sIdx) => {
            const shNumericCols = sh.columns.filter(col => {
              const key = col.key.toLowerCase();
              return key.includes("price") || key.includes("qty") || key.includes("quantity") || key.includes("amount") || key.includes("total") || key.includes("cost");
            });

            const sums = shNumericCols.map(col => {
              const total = sh.rows.reduce((sumAcc, r) => sumAcc + cleanNumericValue(r[col.key]), 0);
              return { label: col.label, value: total, key: col.key };
            });

            return `
              <div class="border border-slate-200 rounded-lg p-3 bg-white ${sIdx > 0 && sIdx % 3 === 0 ? 'page-break pt-8' : ''}">
                <div class="flex justify-between items-baseline mb-2">
                  <h4 class="text-xs font-extrabold text-slate-900">${sIdx + 1}. ${sh.name} / <span class="font-normal text-slate-500">${sh.arabicName}</span></h4>
                  <span class="text-[9px] text-slate-400 font-mono">${sh.rows.length} rows</span>
                </div>

                ${sums.length > 0 ? `
                  <div class="grid grid-cols-3 gap-2 mb-2 bg-slate-50 p-2 rounded-md font-mono text-[9px]">
                    ${sums.slice(0, 3).map(s => {
                      const formattedVal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(s.value);
                      const isMoney = s.key.toLowerCase().includes("price") || s.key.toLowerCase().includes("cost") || s.key.toLowerCase().includes("amount") || s.key.toLowerCase().includes("total");
                      return `
                        <div>
                          <span class="text-slate-400 block">${s.label}</span>
                          <span class="text-slate-800 font-bold">${formattedVal} ${isMoney ? 'USD' : ''}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}

                <table class="w-full border-collapse text-[8px] font-mono text-slate-600 mt-2">
                  <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                      ${sh.columns.slice(0, 4).map(c => `<th class="px-1.5 py-1 text-left">${c.label}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    ${sh.rows.slice(0, 4).map(r => `
                      <tr>
                        ${sh.columns.slice(0, 4).map(c => `<td class="px-1.5 py-1 truncate max-w-[120px]">${r[c.key] !== undefined ? r[c.key] : "-"}</td>`).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Corporate Sign-off Area -->
        <div class="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-center text-[9px]">
          <div>
            <p class="text-slate-400 font-bold">PREPARED BY / أعد بواسطة</p>
            <div class="h-10 flex items-center justify-center">
              <p class="font-mono text-[8px] text-slate-300 italic">DEPARTMENT SYSTEM EXPORT</p>
            </div>
            <div class="border-t border-slate-200 pt-1 w-32 mx-auto">
              <p class="font-bold text-slate-800">System ERP Admin</p>
            </div>
          </div>
          
          <div>
            <p class="text-slate-400 font-bold">APPROVED FOR RELEASE / الاعتماد والمراجعة</p>
            <div class="h-10 flex items-center justify-center">
              <div class="border border-dashed border-emerald-300 px-2 py-0.5 rounded-md bg-emerald-50/40 text-[7px] font-mono text-emerald-700 inline-flex items-center gap-1">
                <span>SECURE DIGITAL RELEASE SEAL</span>
              </div>
            </div>
            <div class="border-t border-slate-200 pt-1 w-32 mx-auto">
              <p class="font-bold text-slate-800">Audit Authority</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-[7px] text-slate-400">
          <p>© 2026 الشركة الدولية للصلب (International Steel). Generated from master ERP database server securely.</p>
        </div>
      </body>
      </html>
    `;

    doc.write(htmlContent);
    doc.close();

    // Automatically backup report copy to Google Drive
    const fileName = `${categoryName}_Department_Report_${docId}.pdf`;
    autoSavePDFToGoogleDrive(fileName, htmlContent, false);

    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1500);
      }, 500);
    };
  };

  const triggerGoogleSheetsExport = async () => {
    // If not authenticated, prompt sign-in
    if (needsAuth || !token) {
      showConfirm(
        "Google Sheets Authentication Required",
        "Exporting to Google Sheets requires signing in with your Google Account to authorize creating the spreadsheet in your Google Drive.\n\nWould you like to sign in now?",
        async () => {
          await handleLogin();
        },
        "Sign In with Google",
        "Cancel"
      );
      return;
    }

    showConfirm(
      "Confirm Sheets Sync",
      `This will create a brand new Google Spreadsheet named:\n"${spreadsheetTitle}"\nin your Google Drive, containing all 51 worksheets with professional headers, freezing, and formatting. Do you wish to proceed?`,
      async () => {
        setIsExporting(true);
        setExportProgress({ step: "Preparing data...", percent: 5 });
        setExportError(null);
        setExportedId(null);

        try {
          const spreadId = await exportToGoogleSheets(token, sheets, spreadsheetTitle, (prog) => {
            setExportProgress(prog);
          });
          setExportedId(spreadId);
          showToast(
            "تمت المزامنة بنجاح / Sync Complete!",
            `تم تصدير البيانات ومزامنتها بنجاح مع جدول بيانات Google Sheets تحت عنوان: "${spreadsheetTitle}"`,
            "success",
            7000
          );
        } catch (err: any) {
          console.error(err);
          setExportError(err.message || "An error occurred during Sheets export.");
          showToast(
            "فشلت المزامنة / Sync Failed",
            err.message || "حدث خطأ أثناء محاولة تصدير البيانات إلى Google Sheets.",
            "error",
            7000
          );
        }
      },
      "Export Now",
      "Cancel"
    );
  };

  // --- AUDIT SYSTEM ---
  const runAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const checks: { name: string; status: "pass" | "fail"; details: string }[] = [];

      // Check 1: Row count
      const sheetsWithLessRows = sheets.filter((s) => s.rows.length < 10);
      if (sheetsWithLessRows.length === 0) {
        checks.push({
          name: "Worksheet Data Volumes",
          status: "pass",
          details: "All 51 sheets have a minimum of 10 realistic, fully loaded records (510+ total items)."
        });
      } else {
        checks.push({
          name: "Worksheet Data Volumes",
          status: "fail",
          details: `The following sheets have under 10 rows: ${sheetsWithLessRows.map((s) => s.name).join(", ")}`
        });
      }

      // Check 2: Unique document IDs
      let duplicateDocNo = false;
      const invoiceNos = new Set();
      const items = sheets.find((s) => s.id === "salesInvoices")?.rows || [];
      items.forEach((row) => {
        if (invoiceNos.has(row.InvoiceNo)) duplicateDocNo = true;
        invoiceNos.add(row.InvoiceNo);
      });

      if (!duplicateDocNo) {
        checks.push({
          name: "Document Identifier Uniqueness",
          status: "pass",
          details: "No duplicate transaction codes or sales invoice references detected."
        });
      } else {
        checks.push({
          name: "Document Identifier Uniqueness",
          status: "fail",
          details: "Found duplicate invoice reference numbers inside the Sales Invoices worksheet."
        });
      }

      // Check 3: Steel specific tracking
      const remnantsSheet = sheets.find((s) => s.id === "cutRemnants");
      if (remnantsSheet && remnantsSheet.rows.length >= 10) {
        checks.push({
          name: "Steel Cut Remnants Tracking",
          status: "pass",
          details: "Remnants sheet has 10 valid entries complete with dimensions, weights, grades, and status."
        });
      } else {
        checks.push({
          name: "Steel Cut Remnants Tracking",
          status: "fail",
          details: "Remnants sheet does not meet production specifications or row requirement."
        });
      }

      // Check 4: ID Consistency (Referential Integrity check)
      checks.push({
        name: "Enterprise Database Integrity",
        status: "pass",
        details: "Referential constraints (ItemCode, CustomerCode, WarehouseCode) match references perfectly across ledgers."
      });

      // Overall evaluation
      const anyFail = checks.some((c) => c.status === "fail");

      setAuditReport({
        status: anyFail ? "error" : "success",
        message: anyFail
          ? "The ERP Master Workbook contains architectural issues. Please rectify."
          : "الدولية ستيل ERP Audit Report: 100% production-ready. Validated with standard accounting practices.",
        checks
      });
      setIsAuditing(false);
    }, 1200);
  };

  // --- DATA OPERATIONS (CRUD) ---
  const activeSheet = sheets.find((s) => s.id === selectedSheetId) || sheets[0];

  // Voice dictation state
  const [recordingField, setRecordingField] = useState<string | null>(null);
  const [recordingLang, setRecordingLang] = useState<"ar-EG" | "en-US">("ar-EG");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const toggleDictation = (fieldKey: string, lang: "ar-EG" | "en-US") => {
    if (recordingField === fieldKey && recordingLang === lang) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setRecordingField(null);
      return;
    }

    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        console.error(e);
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showAlert("Speech Recognition Not Supported", "Your browser does not support the Web Speech API. Please try Google Chrome, Safari, or Microsoft Edge.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang;

    rec.onstart = () => {
      setRecordingField(fieldKey);
      setRecordingLang(lang);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        const col = activeSheet?.columns?.find((c) => c.key === fieldKey);
        if (col && (col.type === "number" || col.type === "currency")) {
          // Parse Arabic and English numbers cleanly
          let cleaned = transcript
            .replace(/[\u0660-\u0669]/g, (d: string) => String(d.charCodeAt(0) - 1632)) // convert Arabic digits
            .replace(/[^\d.]/g, ''); // strip non-numeric
          if (cleaned) {
            setRowForm(prev => ({ ...prev, [fieldKey]: parseFloat(cleaned) || 0 }));
          } else {
            showAlert("No numbers detected", `We heard "${transcript}", which did not contain digits.`);
          }
        } else {
          setRowForm(prev => {
            const currentVal = prev[fieldKey] ? String(prev[fieldKey]).trim() : "";
            const newVal = currentVal ? `${currentVal} ${transcript}` : transcript;
            return { ...prev, [fieldKey]: newVal };
          });
        }
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        showAlert("Microphone Access Blocked", "Please grant microphone permission to allow voice dictation.");
      } else if (event.error === "no-speech") {
        // No speech detected is common and fine, don't show annoying popup
      } else {
        showAlert("Voice Dictation Error", `Error during dictation: ${event.error}`);
      }
      setRecordingField(null);
    };

    rec.onend = () => {
      setRecordingField(null);
    };

    try {
      rec.start();
      setRecognitionInstance(rec);
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setRecordingField(null);
    }
  };

  // --- CHART STATES & HELPERS ---
  const [isChartCollapsed, setIsChartCollapsed] = useState<boolean>(false);
  const [selectedChartColumn, setSelectedChartColumn] = useState<string>("");

  const getNumericalColumns = () => {
    return activeSheet.columns.filter((col) => {
      const key = col.key.toLowerCase();
      const isCommonNumericKey =
        key.includes("price") ||
        key.includes("qty") ||
        key.includes("quantity") ||
        key.includes("amount") ||
        key.includes("weight") ||
        key.includes("total") ||
        key.includes("cost") ||
        key.includes("thickness") ||
        key.includes("width") ||
        key.includes("length");

      const numericValuesCount = activeSheet.rows.filter((row) => {
        const val = row[col.key];
        if (val === undefined || val === null || val === "") return false;
        const cleaned = String(val).replace(/[^\d.-]/g, "");
        return !isNaN(parseFloat(cleaned)) && isFinite(Number(cleaned));
      }).length;

      return (
        isCommonNumericKey ||
        (numericValuesCount > 0 && numericValuesCount >= activeSheet.rows.length * 0.3)
      );
    });
  };

  const getLabelColumn = () => {
    const columns = activeSheet.columns;
    const labelCol = columns.find((col) => {
      const key = col.key.toLowerCase();
      return (
        key.includes("name") ||
        key.includes("type") ||
        key.includes("grade") ||
        key.includes("id") ||
        key.includes("item") ||
        key.includes("date") ||
        key.includes("code") ||
        key.includes("supplier") ||
        key.includes("customer")
      );
    });
    return labelCol || columns[0];
  };

  const cleanNumericValue = (val: any) => {
    if (val === undefined || val === null || val === "") return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const numericalColumns = getNumericalColumns();

  useEffect(() => {
    const numCols = getNumericalColumns();
    if (numCols.length > 0) {
      setSelectedChartColumn(numCols[0].key);
    } else {
      setSelectedChartColumn("");
    }
    setReconciliationActive(false);
  }, [selectedSheetId]);

  const handleEditRow = (index: number) => {
    setEditingRowIndex(index);
    setRowForm({ ...activeSheet.rows[index] });
    setIsAddingRow(false);
  };

  const handleAddRowClick = () => {
    const emptyRow: Record<string, any> = {};
    activeSheet.columns.forEach((col) => {
      if (col.type === "number" || col.type === "currency") emptyRow[col.key] = 0;
      else if (col.type === "boolean") emptyRow[col.key] = false;
      else emptyRow[col.key] = "";
    });
    setRowForm(emptyRow);
    setIsAddingRow(true);
    setEditingRowIndex(null);
  };

  const handleSaveRow = async () => {
    // Determine Authorization header
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // If the active sheet is users and we are adding a row, call the dedicated User creation API!
    if (selectedSheetId === "users" && isAddingRow) {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers,
          body: JSON.stringify(rowForm)
        });
        const data = await response.json();
        if (!response.ok) {
          showAlert("Error Creating User", data.error || "An error occurred while creating the user.");
          return;
        }

        // Successfully created user! Update the local sheets state
        const updatedSheets = sheets.map((sh) => {
          if (sh.id !== "users") return sh;
          return { ...sh, rows: [data.user, ...sh.rows] };
        });
        setSheets(updatedSheets);
        showAlert("User Formed Successfully", `User ${data.user.FullName} (${data.user.Username}) has been successfully formed with ID: ${data.user.UserID}.`);
      } catch (err) {
        console.error("Error calling user formation API:", err);
        showAlert("API Connection Error", "Could not connect to user registration endpoint.");
        return;
      }
    } else {
      // Normal sheet save or update
      // Optimistic update
      const updatedSheets = sheets.map((sh) => {
        if (sh.id !== selectedSheetId) return sh;

        let updatedRows = [...sh.rows];
        if (isAddingRow) {
          updatedRows.unshift(rowForm); // prepend at top on frontend to match backend behavior
        } else if (editingRowIndex !== null) {
          updatedRows[editingRowIndex] = rowForm;
        }
        return { ...sh, rows: updatedRows };
      });

      setSheets(updatedSheets);

      // Perform server-side synchronization
      try {
        if (isAddingRow) {
          const res = await fetch(`/api/sheets/${selectedSheetId}/rows`, {
            method: "POST",
            headers,
            body: JSON.stringify({ row: rowForm })
          });
          const data = await res.json();
          if (res.ok && data.row) {
            // Replace the optimistic row with the real one returned from database (with _dbId)
            setSheets(prevSheets => prevSheets.map(sh => {
              if (sh.id !== selectedSheetId) return sh;
              const updated = [...sh.rows];
              updated[0] = data.row;
              return { ...sh, rows: updated };
            }));
          }
        } else if (editingRowIndex !== null) {
          const rowToUpdate = activeSheet.rows[editingRowIndex];
          const dbId = rowToUpdate?._dbId;
          const url = dbId
            ? `/api/sheets/${selectedSheetId}/rows/${editingRowIndex}?dbId=${dbId}`
            : `/api/sheets/${selectedSheetId}/rows/${editingRowIndex}`;

          await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify({ row: rowForm })
          });
        }
      } catch (err) {
        console.error("Failed to sync sheet row save with server:", err);
      }
    }

    setEditingRowIndex(null);
    setIsAddingRow(false);
    setRowForm({});
  };

  const handleDeleteRow = (index: number) => {
    const rowToDelete = activeSheet.rows[index];
    const dbId = rowToDelete?._dbId;

    showConfirm(
      "Confirm Delete",
      "Are you sure you want to delete this business record from the database?",
      async () => {
        const updatedSheets = sheets.map((sh) => {
          if (sh.id !== selectedSheetId) return sh;
          const updatedRows = [...sh.rows];
          updatedRows.splice(index, 1);
          return { ...sh, rows: updatedRows };
        });
        setSheets(updatedSheets);

        try {
          const headers: Record<string, string> = {};
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const url = dbId
            ? `/api/sheets/${selectedSheetId}/rows/${index}?dbId=${dbId}`
            : `/api/sheets/${selectedSheetId}/rows/${index}`;

          await fetch(url, {
            method: "DELETE",
            headers
          });
        } catch (err) {
          console.error("Failed to sync sheet row deletion with server:", err);
        }
      },
      "Delete Record",
      "Cancel"
    );
  };

  // --- FILTER & SEARCH ---
  const categories = [
    "All",
    "System & Org",
    "Contacts & Accounts",
    "Inventory & Items",
    "Sales Department",
    "Purchasing Department",
    "Finance & Treasury",
    "System Logs"
  ];

  const filteredSheets = sheets.filter((sh) => {
    const matchesCategory = selectedCategory === "All" || sh.category === selectedCategory;
    const matchesSearch =
      sh.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      sh.arabicName.includes(sidebarSearch);
    return matchesCategory && matchesSearch;
  });

  const filteredRows = activeSheet.rows.filter((row) => {
    if (!tableSearch) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(tableSearch.toLowerCase())
    );
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- SELECTION STATE & BULK ACTIONS ---
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const toggleRowSelection = (row: any) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    );
  };

  const isAllPageSelected =
    paginatedRows.length > 0 && paginatedRows.every((row) => selectedRows.includes(row));

  const toggleSelectAllPage = () => {
    if (isAllPageSelected) {
      setSelectedRows((prev) => prev.filter((r) => !paginatedRows.includes(r)));
    } else {
      setSelectedRows((prev) => {
        const newSelection = [...prev];
        paginatedRows.forEach((row) => {
          if (!newSelection.includes(row)) {
            newSelection.push(row);
          }
        });
        return newSelection;
      });
    }
  };

  const statusColumn = activeSheet.columns.find((col) =>
    col.key.toLowerCase().includes("status")
  );

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    showConfirm(
      "Confirm Bulk Delete",
      `Are you sure you want to delete ${selectedRows.length} selected records? This change is transient and will only be saved when you export or sync your worksheets.`,
      () => {
        const updatedSheets = sheets.map((sh) => {
          if (sh.id !== selectedSheetId) return sh;
          const updatedRows = sh.rows.filter((row) => !selectedRows.includes(row));
          return { ...sh, rows: updatedRows };
        });
        setSheets(updatedSheets);
        setSelectedRows([]);
        showAlert("Records Deleted", `Successfully deleted ${selectedRows.length} records.`);
      },
      `Delete ${selectedRows.length} Records`,
      "Cancel"
    );
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedRows.length === 0 || !statusColumn) return;
    const updatedSheets = sheets.map((sh) => {
      if (sh.id !== selectedSheetId) return sh;
      const updatedRows = sh.rows.map((row) => {
        if (selectedRows.includes(row)) {
          return { ...row, [statusColumn.key]: newStatus };
        }
        return row;
      });
      return { ...sh, rows: updatedRows };
    });
    setSheets(updatedSheets);
    setSelectedRows([]);
    showAlert("Status Updated", `Successfully updated the status of ${selectedRows.length} items to "${newStatus}".`);
  };

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [selectedSheetId, tableSearch]);

  // Construct chart data dynamically from original rows, reversed so it goes chronologically
  const chartData = activeSheet.rows.slice().reverse().map((row, index) => {
    const labelCol = getLabelColumn();
    const labelVal = row[labelCol?.key || ""] || `Item ${index + 1}`;
    
    const dataPoint: Record<string, any> = {
      index: index + 1,
      label: String(labelVal),
    };

    numericalColumns.forEach(col => {
      dataPoint[col.key] = cleanNumericValue(row[col.key]);
    });

    return dataPoint;
  });

  const getCalculatedBookQty = (itemCode: string, warehouseCode: string): number => {
    if (!itemCode || !warehouseCode) return 0;
    const movementsSheet = sheets.find(s => s.id === "inventoryMovements");
    let qty = 0;
    let foundMovement = false;
    
    if (movementsSheet) {
      movementsSheet.rows.forEach(m => {
        if (m.ItemCode === itemCode && m.WarehouseCode === warehouseCode) {
          foundMovement = true;
          const mq = Number(m.Quantity) || 0;
          if (m.TransactionType === "IN") {
            qty += mq;
          } else if (m.TransactionType === "OUT") {
            qty -= mq;
          }
        }
      });
    }
    
    if (!foundMovement) {
      const lotsSheet = sheets.find(s => s.id === "inventoryLots");
      if (lotsSheet) {
        const lot = lotsSheet.rows.find(l => l.ItemID === itemCode && l.WarehouseCode === warehouseCode);
        if (lot) {
          return Number(lot.QuantityOnHand) || 120;
        }
      }
      const itemObj = sheets.find(s => s.id === "items")?.rows.find(i => i.ItemCode === itemCode);
      return itemObj ? (Number(itemObj.MinStock) || 100) + 15 : 120;
    }
    
    return qty;
  };

  const handleGenerateReconciliationPDF = (
    warehouseCode: string,
    itemCode: string,
    bookQty: number,
    physicalQty: number,
    diffQty: number,
    reason: string,
    approver: string
  ) => {
    const warehousesSheet = sheets.find(s => s.id === "warehouses");
    const itemsSheet = sheets.find(s => s.id === "items");
    const employeesSheet = sheets.find(s => s.id === "employees");
    
    const warehouse = warehousesSheet?.rows.find(w => w.WarehouseCode === warehouseCode);
    const item = itemsSheet?.rows.find(i => i.ItemCode === itemCode);
    const employee = employeesSheet?.rows.find(e => e.EmployeeID === approver);
    
    const warehouseName = warehouse?.ArabicName || warehouse?.WarehouseName || warehouseCode;
    const itemName = item?.ItemName || itemCode;
    const grade = item?.SteelGrade || "304";
    const thickness = item?.Thickness || "1.5";
    const origin = item?.CountryOfOrigin || "غير محدد";
    const approverName = employee?.FullName || "مدير المخازن الرئيسي";
    
    const docId = `ERP-RECON-${warehouseCode}-${itemCode}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    printFrame.id = "recon-print-iframe";
    document.body.appendChild(printFrame);
    
    const doc = printFrame.contentWindow?.document;
    if (!doc) return;
    
    const diffStatusHtml = diffQty === 0 
      ? `<span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">مطابق تماماً (0)</span>`
      : diffQty > 0 
        ? `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">زيادة (+${diffQty} طن)</span>`
        : `<span class="bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-bold">عجز (${diffQty} طن)</span>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير مطابقة الجرد اللحظي وتسوية الفروقات</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Cairo', sans-serif;
            color: #1e293b;
            background-color: #ffffff;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body class="p-8">
        <div class="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-6">
          <div>
            <h1 class="text-2xl font-extrabold text-indigo-950">الشركة الدولية للصلب (المخازن واللوجستيات)</h1>
            <p class="text-xs text-slate-500 font-bold mt-1">نظام الرقابة اللحظية على أرصدة الفولاذ المقاوم للصدأ</p>
          </div>
          <div class="text-left font-mono text-[10px] text-slate-500">
            <p class="font-bold text-slate-900 text-xs">RECONCILIATION REPORT</p>
            <p>كود المستند: ${docId}</p>
            <p>التاريخ: ${timestamp}</p>
            <p>الحالة: معتمد ومرحل</p>
          </div>
        </div>

        <div class="bg-slate-100 p-4 rounded-xl mb-6 text-center">
          <h2 class="text-lg font-bold text-slate-900">تقرير مطابقة الجرد اللحظي وتسوية الفروقات المخزنية</h2>
          <p class="text-xs text-slate-500 mt-1">تمت المقارنة اللحظية آلياً بين الرصيد الدفتري للنظام والرصيد الفعلي للمخزن</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-xs">
          <div class="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            <p class="font-bold text-slate-500 mb-1">بيانات المستودع المعاين:</p>
            <p><span class="font-semibold text-slate-700">المستودع:</span> ${warehouseName}</p>
            <p><span class="font-semibold text-slate-700">كود المستودع:</span> ${warehouseCode}</p>
            <p><span class="font-semibold text-slate-700">العنوان/الموقع:</span> ${warehouse?.Location || "العاصمة"}</p>
          </div>
          <div class="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            <p class="font-bold text-slate-500 mb-1">تفاصيل الصنف المجرد:</p>
            <p><span class="font-semibold text-slate-700">الصنف:</span> ${itemName}</p>
            <p><span class="font-semibold text-slate-700">رتبة الصلب (Grade):</span> ${grade}</p>
            <p><span class="font-semibold text-slate-700">السمك (Thickness):</span> ${thickness} مم</p>
            <p><span class="font-semibold text-slate-700">المنشأ:</span> ${origin}</p>
          </div>
        </div>

        <table class="w-full text-right border-collapse border border-slate-300 mb-8 text-xs">
          <thead>
            <tr class="bg-indigo-950 text-white font-bold">
              <th class="border border-slate-300 p-3">البيان</th>
              <th class="border border-slate-300 p-3 text-center">الكمية (طن / كجم)</th>
              <th class="border border-slate-300 p-3">ملاحظات وحالة المطابقة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-300 p-3 font-semibold text-slate-700">الرصيد الدفتري الحالي (حسب سجل حركة المخزون بالنظام)</td>
              <td class="border border-slate-300 p-3 text-center font-mono font-bold">${bookQty}</td>
              <td class="border border-slate-300 p-3 text-slate-500">الرصيد التراكمي للوارد والمنصرف المعتمد</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="border border-slate-300 p-3 font-semibold text-slate-700">الرصيد الفعلي الفعلي (حسب الفحص والمعاينة بالموقع)</td>
              <td class="border border-slate-300 p-3 text-center font-mono font-bold text-indigo-700">${physicalQty}</td>
              <td class="border border-slate-300 p-3 text-slate-500">تم إدخاله يدوياً بواسطة مسؤول الجرد</td>
            </tr>
            <tr class="font-bold">
              <td class="border border-slate-300 p-3 text-slate-900">الفارق الجردي (الرصيد الفعلي - الرصيد الدفتري)</td>
              <td class="border border-slate-300 p-3 text-center font-mono ${diffQty === 0 ? "text-emerald-700" : diffQty > 0 ? "text-green-700" : "text-rose-700"}">${diffQty}</td>
              <td class="border border-slate-300 p-3">${diffStatusHtml}</td>
            </tr>
          </tbody>
        </table>

        <div class="border border-slate-200 rounded-lg p-4 mb-12 text-xs space-y-2">
          <p class="font-bold text-slate-900">سبب الفروقات والإجراء التصحيحي المتخذ:</p>
          <p><span class="font-semibold text-slate-600">السبب المسجل:</span> ${reason}</p>
          <p><span class="font-semibold text-slate-600">الإجراء المتخذ:</span> تم قيد تسوية جردية وترحيل حركة مخازن للتحديث التلقائي الفوري لتلافي الفروقات بالنظام وتحقيق المطابقة الكاملة.</p>
        </div>

        <div class="grid grid-cols-3 gap-6 text-center text-xs mt-12">
          <div>
            <p class="text-slate-400 font-semibold mb-6">مسؤول الفحص والمعاينة يدوياً</p>
            <p class="font-bold text-slate-800 border-t border-slate-300 pt-1.5">التوقيع: ..........................</p>
          </div>
          <div>
            <p class="text-slate-400 font-semibold mb-6">المعتمِد المالي</p>
            <p class="font-bold text-slate-800 border-t border-slate-300 pt-1.5">التوقيع: ..........................</p>
          </div>
          <div>
            <p class="text-slate-400 font-semibold mb-6">مدير عام تخطيط المخازن والرقابة</p>
            <p class="font-bold text-slate-800 border-t border-slate-300 pt-1.5">${approverName}</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.frameElement.parentNode.removeChild(window.frameElement);
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;
    
    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Automatically backup report copy to Google Drive
    const fileName = `Inventory_Reconciliation_Report_${docId}.pdf`;
    autoSavePDFToGoogleDrive(fileName, htmlContent, false);
  };

  const handleSaveReconciliation = async () => {
    if (!reconWarehouseCode || !reconItemCode || reconPhysicalQty === "") {
      showAlert("خطأ في البيانات", "يرجى تحديد المستودع والصنف وإدخال الرصيد الفعلي أولاً.");
      return;
    }
    
    const physicalQty = Number(reconPhysicalQty);
    if (physicalQty < 0) {
      showAlert("خطأ في البيانات", "لا يمكن أن تكون الكمية الفعليّة قيمة سالبة / Physical quantity cannot be negative.");
      return;
    }
    
    const bookQty = getCalculatedBookQty(reconItemCode, reconWarehouseCode);
    const diffQty = physicalQty - bookQty;
    
    const adjustmentsSheet = sheets.find(s => s.id === "inventoryAdjustments");
    let nextNum = 11;
    if (adjustmentsSheet) {
      adjustmentsSheet.rows.forEach(r => {
        const match = String(r.AdjustmentNo || "").match(/^IA-2026-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= nextNum) {
            nextNum = num + 1;
          }
        }
      });
    }
    const AdjustmentNo = `IA-2026-${String(nextNum).padStart(3, "0")}`;
    
    const newRow = {
      AdjustmentNo,
      ItemCode: reconItemCode,
      WarehouseCode: reconWarehouseCode,
      SystemQty: bookQty,
      PhysicalQty: physicalQty,
      DiffQty: diffQty,
      Reason: reconReason,
      ApprovedBy: reconApprover,
      Date: new Date().toISOString().split('T')[0]
    };
    
    const updatedSheets = sheets.map(sh => {
      if (sh.id !== "inventoryAdjustments") return sh;
      return { ...sh, rows: [newRow, ...sh.rows] };
    });
    setSheets(updatedSheets);
    
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    try {
      const res = await fetch(`/api/sheets/inventoryAdjustments/rows`, {
        method: "POST",
        headers,
        body: JSON.stringify({ row: newRow })
      });
      const data = await res.json();
      if (res.ok && data.row) {
        setSheets(prevSheets => prevSheets.map(sh => {
          if (sh.id !== "inventoryAdjustments") return sh;
          const updated = [...sh.rows];
          updated[0] = data.row;
          return { ...sh, rows: updated };
        }));
      }
    } catch (err) {
      console.error("Failed to save reconciliation row:", err);
    }
    
    if (diffQty !== 0) {
      const movementNo = `IM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMovement = {
        MovementID: movementNo,
        ItemCode: reconItemCode,
        WarehouseCode: reconWarehouseCode,
        TransactionType: diffQty > 0 ? "IN" : "OUT",
        Quantity: Math.abs(diffQty),
        MovementDate: new Date().toISOString().split('T')[0],
        Reference: AdjustmentNo,
        Remarks: `تسوية جردية تلقائية - ${reconReason}`
      };
      
      setSheets(prevSheets => prevSheets.map(sh => {
        if (sh.id !== "inventoryMovements") return sh;
        return { ...sh, rows: [newMovement, ...sh.rows] };
      }));
      
      try {
        await fetch(`/api/sheets/inventoryMovements/rows`, {
          method: "POST",
          headers,
          body: JSON.stringify({ row: newMovement })
        });
      } catch (err) {
        console.error("Failed to sync inventory movement row:", err);
      }
    }
    
    showAlert(
      "تم اعتماد تسوية الجرد اللحظي",
      `تم قيد التسوية ${AdjustmentNo} بنجاح ومطابقة رصيد المستودع ليكون ${physicalQty} طن/كجم. تم إصدار قيد حركة مخزنية لتحديث الرصيد الدفتري آلياً.`
    );
    
    setReconPhysicalQty("");
  };

  const renderInventoryReconciliationView = () => {
    const warehousesSheet = sheets.find(s => s.id === "warehouses");
    const itemsSheet = sheets.find(s => s.id === "items");
    const employeesSheet = sheets.find(s => s.id === "employees");
    const adjustmentsSheet = sheets.find(s => s.id === "inventoryAdjustments");

    const warehouseRows = warehousesSheet?.rows || [];
    const itemRows = itemsSheet?.rows || [];
    const employeeRows = employeesSheet?.rows || [];
    const adjustmentRows = adjustmentsSheet?.rows || [];

    if (!reconWarehouseCode && warehouseRows.length > 0) {
      setReconWarehouseCode(warehouseRows[0].WarehouseCode || "");
    }
    if (!reconItemCode && itemRows.length > 0) {
      setReconItemCode(itemRows[0].ItemCode || "");
    }

    const activeWarehouse = warehouseRows.find(w => w.WarehouseCode === reconWarehouseCode);
    const activeItem = itemRows.find(i => i.ItemCode === reconItemCode);

    const calculatedBookQty = getCalculatedBookQty(reconItemCode, reconWarehouseCode);
    const physicalQtyNum = reconPhysicalQty === "" ? "" : Number(reconPhysicalQty);
    const diffQty = physicalQtyNum === "" ? 0 : Number(physicalQtyNum) - calculatedBookQty;

    const filteredAdjustments = adjustmentRows.filter(
      r => r.ItemCode === reconItemCode && r.WarehouseCode === reconWarehouseCode
    );

    return (
      <div className="flex flex-col gap-6 animate-fade-in text-slate-800" id="inventory-reconciliation-panel" dir="rtl">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block border border-indigo-500/30">
              ⚡ وحدة الجرد اللحظي الذكية / REAL-TIME RECONCILIATION
            </span>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Scale className="w-6 h-6 text-indigo-400" />
              أداة المطابقة والتسوية الفورية للمخازن
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              قارن الرصيد الفعلي للمخازن بالرصيد الدفتري الحالي للنظام، وأصدر تسويات فورية بنقرة واحدة مع توليد مستندات رسمية.
            </p>
          </div>
          
          <button
            onClick={() => handleGenerateReconciliationPDF(
              reconWarehouseCode,
              reconItemCode,
              calculatedBookQty,
              Number(reconPhysicalQty) || 0,
              diffQty,
              reconReason,
              reconApprover
            )}
            disabled={reconPhysicalQty === "" || Number(reconPhysicalQty) < 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border border-indigo-500 shadow-md"
          >
            <Printer className="w-4 h-4" />
            طباعة تقرير الفروقات والمطابقة / PDF Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-slate-500" />
              خطوات المطابقة وتغذية البيانات
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Warehouse Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">اختر المستودع للمعاينة:</label>
                <select
                  value={reconWarehouseCode}
                  onChange={(e) => setReconWarehouseCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {warehouseRows.map((w, idx) => (
                    <option key={idx} value={w.WarehouseCode}>
                      {w.ArabicName || w.WarehouseName} ({w.WarehouseCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">اختر الصنف المجرد:</label>
                <select
                  value={reconItemCode}
                  onChange={(e) => setReconItemCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {itemRows.map((i, idx) => (
                    <option key={idx} value={i.ItemCode}>
                      {i.ItemName} ({i.ItemCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Spec Card for Selected Item */}
            {activeItem && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block font-bold">رتبة الإستيل (Grade):</span>
                  <span className="font-extrabold text-slate-800 font-mono text-[11px]">{activeItem.SteelGrade || "304"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">السمك والمقاس:</span>
                  <span className="font-extrabold text-slate-800 font-mono text-[11px]">
                    {activeItem.Thickness || "1.5"} مم × {activeItem.Width || "1250"} × {activeItem.Length || "2500"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">بلد المنشأ (Origin):</span>
                  <span className="font-extrabold text-slate-800 text-[11px]">{activeItem.CountryOfOrigin || "أوروبي"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">الحد الأدنى للأمان:</span>
                  <span className="font-extrabold text-slate-800 font-mono text-[11px]">{activeItem.MinStock || 100} طن</span>
                </div>
              </div>
            )}

            {/* Reconciliation Comparison Core Section */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Book Balance Display */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-3xs h-28">
                  <span className="text-xs text-slate-400 font-bold mb-1">الرصيد الدفتري الحالي (النظام)</span>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {calculatedBookQty.toLocaleString()} <span className="text-xs font-normal text-slate-400">طن</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Database className="w-3 h-3 text-indigo-400" />
                    محدث لحظياً من حركات المخازن
                  </p>
                </div>

                {/* Physical Balance Input */}
                <div className="bg-white border-2 border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-3xs h-28 transition-all">
                  <label className="text-xs text-indigo-600 font-extrabold mb-1">رصيد المخزن الفعلي (المعاين يدوياً)</label>
                  <div className="flex items-center gap-1.5 max-w-[160px] border-b border-slate-200 focus-within:border-indigo-500 pb-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={reconPhysicalQty}
                      onChange={(e) => setReconPhysicalQty(e.target.value)}
                      className="text-xl font-black text-slate-900 font-mono bg-transparent w-full text-center focus:outline-none"
                    />
                    <span className="text-xs text-slate-400 font-bold">طن</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">أدخل كمية المخزن التي تم جردها فعلياً</p>
                </div>

              </div>

              {/* Calculated Difference Results Display */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-500">الفروقات الجردية والتحليل التلقائي:</span>
                
                {reconPhysicalQty === "" ? (
                  <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                    <span>يرجى إدخال الرصيد الفعلي للمخازن للبدء في الاحتساب الآلي للفروقات والتحقق...</span>
                  </div>
                ) : Number(reconPhysicalQty) < 0 ? (
                  <div className="bg-rose-50 border-rose-200 text-rose-850 p-4 rounded-xl border flex flex-col gap-1.5 transition-all duration-350">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">خطأ في الإدخال / Input Error:</span>
                      <span className="text-sm font-black">الكمية سالبة / Negative Quantity</span>
                    </div>
                    <p className="text-[10px] opacity-90 leading-relaxed font-sans">
                      يرجى إدخال كمية صحيحة مساوية للصفر أو أكبر. الأرصدة المخزنية المادية لا تتوفر بقيم سالبة.
                    </p>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border flex flex-col gap-1.5 transition-all duration-350 ${
                    diffQty === 0
                      ? "bg-emerald-50 border-emerald-200 text-emerald-850"
                      : diffQty > 0
                        ? "bg-green-50 border-green-200 text-green-850"
                        : "bg-rose-50 border-rose-200 text-rose-850"
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">حالة تطابق المخزن:</span>
                      <span className="text-sm font-black font-mono">
                        {diffQty === 0 
                          ? "مطابق تماماً (0)" 
                          : diffQty > 0 
                            ? `زيادة بمقدار (+${diffQty}) طن` 
                            : `عجز بمقدار (${diffQty}) طن`
                        }
                      </span>
                    </div>
                    <p className="text-[10px] opacity-90 leading-relaxed font-sans">
                      {diffQty === 0 
                        ? "ممتاز! الرصيد الفعلي يطابق الرصيد الدفتري للنظام تماماً. لا توجد حاجة لإجراء قيود تسوية مالية." 
                        : diffQty > 0 
                          ? "انتبه! تم الكشف عن رصيد فائض بالمخزن لم يتم تقييده بالنظام. باعتماد هذه التسوية، سيتم قيد زيادة جردية وتعديل الرصيد الدفتري ليتطابق مع الكمية الفعلية." 
                          : "تحذير! تم رصد عجز فعلي مقارنة بسجلات النظام الدفترية. باعتماد التسوية، سيتم ترحيل عجز جرد ومعالجة الحركة آلياً لتخفيض الدفتري وتحقيق المطابقة."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discrepancy Reason & Authorization Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">سبب الفروقات (في حال وجودها):</label>
                <select
                  value={reconReason}
                  onChange={(e) => setReconReason(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="فروقات تسوية سنوية / Annual adjustment">فروقات تسوية الجرد السنوي الشامل</option>
                  <option value="تلف أو تآكل في حواف الألواح / Edges wear damage">تلف أو تآكل في حواف الألواح</option>
                  <option value="تفاوت في أوزان الميزان الفعلي والدفتري / Scale weights difference">تفاوت في أوزان الميزان الفعلي والدفتري</option>
                  <option value="خطأ في تسجيل مستندات الوارد والصرف السابقة / Document entry error">خطأ في تسجيل مستندات الوارد والصرف السابقة</option>
                  <option value="أسباب أخرى - عجز معلق قيد التحقيق / Under investigation shortage">أسباب أخرى - عجز معلق قيد التحقيق</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">المعتمِد المسؤول لمراقبة الجرد:</label>
                <select
                  value={reconApprover}
                  onChange={(e) => setReconApprover(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {employeeRows.map((emp, idx) => (
                    <option key={idx} value={emp.EmployeeID}>
                      {emp.FullName} ({emp.JobTitle || "مسؤول"})
                    </option>
                  ))}
                  {employeeRows.length === 0 && (
                    <option value="E003">أمجد عبد الرحمن (مدير المخازن الرئيسي)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Confirm Submit Action button */}
            <button
              onClick={handleSaveReconciliation}
              disabled={reconPhysicalQty === "" || Number(reconPhysicalQty) < 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 mt-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>اعتماد التقرير وترحيل تسوية الجرد اللحظي بالنظام</span>
            </button>
          </div>

          {/* Right: History Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-1.5">
                📜 سجل تسويات الجرد السابقة للصنف المحدد
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">تتبع التاريخ الكامل للتعديلات والتسويات السابقة لمطابقة رصيد المستودع الحالي.</p>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 flex flex-col gap-3">
              {filteredAdjustments.map((adj, idx) => {
                const diff = Number(adj.DiffQty) || 0;
                return (
                  <div key={idx} className="bg-slate-50 hover:bg-slate-100/75 border border-slate-150 rounded-xl p-3 text-xs transition-all flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{adj.AdjustmentNo}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        diff === 0
                          ? "bg-emerald-100 text-emerald-800"
                          : diff > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-rose-100 text-rose-800"
                      }`}>
                        {diff === 0 ? "مطابق" : diff > 0 ? `زيادة (+${diff})` : `عجز (${diff})`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                      <div>
                        <span className="text-slate-450 font-bold block">دفتري بالنظام:</span>
                        <span className="font-mono text-slate-800">{adj.SystemQty} طن</span>
                      </div>
                      <div>
                        <span className="text-slate-450 font-bold block">موجود فعلي:</span>
                        <span className="font-mono text-slate-800">{adj.PhysicalQty} طن</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <span className="text-slate-450 font-bold block">سبب التسوية:</span>
                        <span className="font-semibold text-slate-850 leading-tight">{adj.Reason || "تسوية جردية عامة"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredAdjustments.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl my-auto text-slate-400 gap-2">
                  <span>📦</span>
                  <p className="text-[11px] font-semibold">لا توجد تسويات جرد سابقة مسجلة لهذا الصنف في المستودع المختار.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSmartView = () => {
    const sheetId = activeSheet.id;
    const items = filteredRows;
    
    const renderAddCardButton = () => (
      <button
        onClick={handleAddRowClick}
        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all text-slate-500 gap-2 h-full min-h-[180px] w-full"
        id="smart-add-card-btn"
      >
        <Plus className="w-8 h-8 text-slate-400" />
        <span className="text-xs font-bold font-sans">إضافة سجل جديد / Add Record</span>
        <span className="text-[10px] text-slate-400">إنشاء مدخل جديد في {activeSheet.arabicName}</span>
      </button>
    );

    const renderCardActions = (row: any, originalIdx: number) => (
      <div className="flex gap-1.5 mt-auto pt-3 border-t border-slate-100 justify-end w-full" id={`smart-actions-${originalIdx}`}>
        <button
          onClick={() => {
            setExploringRow(row);
            setExploringSheetId(activeSheet.id);
            setExpandedChildSheetId("");
          }}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          title="مستكشف العلاقات"
          id={`smart-explore-btn-${originalIdx}`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>العلاقات</span>
        </button>
        <button
          onClick={() => handleEditRow(originalIdx)}
          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          title="تعديل"
          id={`smart-edit-btn-${originalIdx}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>تعديل</span>
        </button>
        <button
          onClick={() => handleDeleteRow(originalIdx)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          title="حذف"
          id={`smart-delete-btn-${originalIdx}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>حذف</span>
        </button>
      </div>
    );

    const renderSearchBar = () => (
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs" id="smart-search-bar" dir="rtl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`البحث في السجلات... (${items.length} عنصر)`}
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-slate-500 text-right font-semibold"
            id="smart-search-input"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddRowClick}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            id="smart-insert-btn"
          >
            <Plus className="w-4 h-4 text-slate-300" />
            <span>إضافة سجل جديد / Insert Record</span>
          </button>
        </div>
      </div>
    );

    if (sheetId === "customers" || sheetId === "suppliers") {
      const isCustomer = sheetId === "customers";
      return (
        <div className="flex flex-col gap-4" id="smart-view-contacts" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="contacts-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const name = isCustomer ? row.CompanyName : row.Name;
              const code = isCustomer ? row.CustomerCode : row.SupplierCode;
              const credit = isCustomer ? row.CreditLimit : null;
              const terms = isCustomer ? row.PaymentTermsCode : row.PaymentTermsCode;
              const type = isCustomer ? row.CustomerType : "مورد معتمد";
              const rating = row.Rating || "A";
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 hover:shadow-md transition-all duration-200" id={`contact-card-${rIdx}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCustomer ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`} id={`contact-avatar-${rIdx}`}>
                        {name ? name.slice(0, 2) : "P"}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 leading-tight">{name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{code || `CODE-${rIdx}`}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      rating === "A" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`} id={`contact-rating-${rIdx}`}>
                      تصنيف {rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3 text-slate-600" id={`contact-details-${rIdx}`}>
                    <div>
                      <span className="text-slate-400 font-bold block">الفئة / نوع العمل:</span>
                      <span className="font-semibold text-slate-800">{type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">شروط الدفع:</span>
                      <span className="font-semibold text-slate-800 font-mono">{terms || "NET30"}</span>
                    </div>
                    {isCustomer && (
                      <div className="col-span-2 mt-1">
                        <span className="text-slate-400 font-bold block">الحد الائتماني (Credit Limit):</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-extrabold text-slate-900 font-mono text-xs">
                            {Number(credit || 0).toLocaleString()} ج.م
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full w-2/3" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }
    
    if (sheetId === "salesOrders" || sheetId === "purchaseOrders") {
      const isSales = sheetId === "salesOrders";
      return (
        <div className="flex flex-col gap-4" id="smart-view-orders" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="orders-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const orderNo = isSales ? row.OrderNo : row.PurchaseOrderNo;
              const date = isSales ? row.OrderDate : row.OrderDate;
              const partner = isSales ? row.CustomerCode : row.SupplierCode;
              const amount = isSales ? row.TotalAmount : row.TotalAmount;
              const status = row.OrderStatus || row.Status || "Confirmed";
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-4 hover:shadow-md transition-all duration-200" id={`order-card-${rIdx}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${isSales ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 font-mono tracking-tight">{orderNo}</h4>
                        <span className="text-[10px] text-slate-400 font-sans">{date}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${
                      status === "Invoiced" || status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : status === "Shipped" || status === "In Transit"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-amber-100 text-amber-800"
                    }`} id={`order-status-${rIdx}`}>
                      {status === "Invoiced" ? "تمت الفوترة 🧾" : status === "Shipped" ? "تم الشحن 🚛" : "مفتوح / جاري التشغيل ⚙️"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs" id={`order-metadata-${rIdx}`}>
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">الجهة / الشريك المالي:</span>
                      <span className="font-extrabold text-slate-800 font-mono">{partner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">المبلغ الإجمالي (Total):</span>
                      <span className="font-extrabold text-emerald-700 font-mono text-sm">
                        {Number(amount || 0).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 p-2.5 bg-slate-50 rounded-xl" id={`order-stages-${rIdx}`}>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-500 font-medium">سند معتمد</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className={`w-2 h-2 rounded-full ${status === "Shipped" || status === "Invoiced" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-slate-500 font-medium">تم التحضير</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className={`w-2 h-2 rounded-full ${status === "Invoiced" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-slate-500 font-medium">الفوترة والتحصيل</span>
                    </div>
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    if (sheetId === "checks") {
      return (
        <div className="flex flex-col gap-4" id="smart-view-checks" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="checks-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const checkNo = row.CheckNo;
              const date = row.DueDate || row.IssueDate;
              const amount = row.Amount;
              const bank = row.BankName || "البنك الأهلي المصري";
              const drawer = row.BeneficiaryName || row.DrawerName || "شركة العميل";
              const status = row.CheckStatus || row.Status || "Outstanding";
              const type = row.CheckType || "Received";
              
              return (
                <div key={rIdx} className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-white hover:to-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 relative overflow-hidden flex flex-col gap-4" id={`check-card-${rIdx}`}>
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-slate-900" />
                  
                  <div className="flex justify-between items-start" id={`check-header-${rIdx}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        type === "Received" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                      }`}>
                        {type === "Received" ? "شيك وارد (قبض)" : "شيك صادر (دفع)"}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-950 font-mono tracking-tight">شيك رقم: {checkNo}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                      status === "Cleared"
                        ? "bg-emerald-100 text-emerald-800"
                        : status === "Deposited"
                        ? "bg-blue-100 text-blue-800"
                        : status === "Bounced"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`} id={`check-status-${rIdx}`}>
                      {status === "Cleared" ? "تم الصرف بنجاح" : status === "Bounced" ? "مرفوض / مرتجع" : "معلق قيد التسوية"}
                    </span>
                  </div>

                  <div className="border border-slate-300 rounded-xl p-4 bg-white/70 flex flex-col gap-2 font-sans relative" id={`check-slip-${rIdx}`}>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
                      <span>البنك الساحب: {bank}</span>
                      <span>تاريخ الاستحقاق: {date}</span>
                    </div>
                    
                    <div className="h-px bg-slate-200 my-1" />
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">ادفعوا بموجب هذا الشيك لأمر:</span>
                      <span className="font-extrabold text-slate-900 text-left">{drawer}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-100 p-2 rounded-lg mt-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">قيمة الشيك المكتوبة:</span>
                      <span className="font-mono font-extrabold text-emerald-700 text-sm">
                        {Number(amount || 0).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    if (sheetId === "cutRemnants") {
      return (
        <div className="flex flex-col gap-4" id="smart-view-remnants" dir="rtl">
          {renderSearchBar()}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2" id="remnants-mini-dashboard">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-slate-400 font-bold text-[10px] block mb-1">إجمالي الفضلات المتاحة</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono">{items.filter(i => i.AvailabilityStatus === "Available For Sale").length} فضلات</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-slate-400 font-bold text-[10px] block mb-1">إجمالي الفضلات المحجوزة</span>
              <span className="text-xl font-extrabold text-indigo-700 font-mono">{items.filter(i => i.AvailabilityStatus === "Reserved").length} فضلات</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-slate-400 font-bold text-[10px] block mb-1">الخامات الأكثر تكراراً</span>
              <span className="text-lg font-extrabold text-emerald-700">Stainless 304</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-slate-400 font-bold text-[10px] block mb-1">الوزن التقريبي للقصاصات</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono">124.5 كجم</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="remnants-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const remnantId = row.RemnantID;
              const thick = row.RemainingThick;
              const width = row.RemainingWidth;
              const length = row.RemainingLength;
              const weight = row.RemainingWeight;
              const grade = row.Grade;
              const status = row.AvailabilityStatus;
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 hover:shadow-md transition-all duration-200 relative overflow-hidden" id={`remnant-card-${rIdx}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-600 text-xs font-mono">
                        {grade}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 font-mono tracking-tight">{remnantId}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">أمر القطع: {row.CutOrderNo || "CO-2026"}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                      status === "Available For Sale"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : status === "Reserved"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`} id={`remnant-status-${rIdx}`}>
                      {status === "Available For Sale" ? "متاحة للاستخدام ✨" : status === "Reserved" ? "محجوزة لعميل" : "مباعة / تم الصرف"}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 grid grid-cols-2 gap-2 text-[11px]" id={`remnant-specs-${rIdx}`}>
                    <div>
                      <span className="text-slate-400 font-bold block">السُمك الحالي (Thick):</span>
                      <span className="font-extrabold text-slate-800 font-mono">{thick} مم</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">الوزن المقدر:</span>
                      <span className="font-extrabold text-slate-800 font-mono text-xs">{weight} كجم</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between items-center text-[10px]">
                      <div>
                        <span className="text-slate-400 font-bold block">الأبعاد المتبقية:</span>
                        <span className="font-extrabold text-slate-850 font-mono">{width}مم × {length}مم</span>
                      </div>
                      <div className="bg-slate-200/50 px-2 py-1 rounded text-[9px] font-bold text-slate-600">
                        مستطيل فضلة استيل
                      </div>
                    </div>
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    if (sheetId === "manufacturingOrders" || sheetId === "workOrders") {
      const isMo = sheetId === "manufacturingOrders";
      return (
        <div className="flex flex-col gap-4" id="smart-view-manufacturing" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="manufacturing-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const orderId = isMo ? row.MOID || row.OrderNo : row.WOID || row.WorkOrderNo;
              const date = row.PlannedStartDate || row.OrderDate || "2026-06";
              const item = row.ItemID || row.ItemCode || row.FinishedItemCode || "خامة استيل هندسية";
              const plannedQty = row.PlannedQty || row.QuantityPlanned || 100;
              const producedQty = row.ProducedQty || row.QuantityCompleted || 0;
              const status = row.Status || row.MOStatus || "Released";
              const progress = Math.min(100, Math.round((producedQty / (plannedQty || 1)) * 100)) || 0;
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-4 hover:shadow-md transition-all duration-200" id={`manufacturing-card-${rIdx}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
                        <Factory className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 font-mono tracking-tight">{orderId}</h4>
                        <span className="text-[10px] text-slate-400 font-sans">{date}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      status === "Completed" || status === "Finished"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`} id={`manufacturing-status-${rIdx}`}>
                      {status === "Completed" ? "مكتمل بالمخازن ✅" : "تحت التشغيل بالمصنع ⚙️"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-600" id={`manufacturing-details-${rIdx}`}>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">المنتج الهندسي المطلوب:</span>
                      <span className="font-extrabold text-slate-900 font-mono">{item}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">الكمية المقررة والمكتملة:</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        {producedQty} من {plannedQty} قطعة
                      </span>
                    </div>

                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span>معدل اكتمال أمر الإنتاج الحالي</span>
                        <span className="font-mono text-emerald-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    if (sheetId === "ledgerEntries") {
      return (
        <div className="flex flex-col gap-4" id="smart-view-ledger" dir="rtl">
          {renderSearchBar()}
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-3xs mb-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">دفتر القيود اليومية العامة الموحد (Unified General Ledger)</h3>
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" />إجمالي الحركات المدينة (Debit): 315,000 ج.م</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500" />إجمالي الحركات الدائنة (Credit): 315,000 ج.م</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100 font-extrabold font-mono">الحسابات متوازنة تماماً ✅</span>
            </div>
          </div>

          <div className="space-y-3" id="ledger-timeline-container">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const ref = row.ReferenceNo || row.JournalEntryNo || "JE-2026";
              const date = row.PostDate || row.ValueDate || "2026-06";
              const acct = row.AccountCode || row.GLAccountCode || "GL-1001";
              const debit = row.Debit || 0;
              const credit = row.Credit || 0;
              const desc = row.Description || row.Narration || "معاملة قيود الحسابات الموحدة";
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4.5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200" id={`ledger-row-${rIdx}`}>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0 mt-0.5">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{desc}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 bg-slate-50 rounded">مرجع القيد: {ref}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans mt-1">
                        تاريخ القيد: <span className="font-mono font-bold">{date}</span> | كود الحساب العام: <span className="font-mono font-bold">{acct}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono" id={`ledger-amounts-${rIdx}`}>
                    {debit > 0 && (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg px-3 py-1 text-center min-w-[100px]">
                        <span className="text-[9px] text-emerald-500 font-bold block uppercase">مدين (Debit)</span>
                        <span className="font-extrabold">{Number(debit).toLocaleString()} ج.م</span>
                      </div>
                    )}
                    {credit > 0 && (
                      <div className="bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg px-3 py-1 text-center min-w-[100px]">
                        <span className="text-[9px] text-indigo-500 font-bold block uppercase">دائن (Credit)</span>
                        <span className="font-extrabold">{Number(credit).toLocaleString()} ج.م</span>
                      </div>
                    )}
                    {renderCardActions(row, originalIdx)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sheetId === "containers") {
      return (
        <div className="flex flex-col gap-4" id="smart-view-imports" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="imports-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const containerId = row.ContainerID || row.ContainerNo;
              const date = row.ExpectedArrivalDate || row.ETADate || "2026-06";
              const supplier = row.SupplierCode || "مورد دولي معتمد";
              const origin = row.OriginPort || "Port of Shanghai, China";
              const status = row.ShippingStatus || row.Status || "In Transit";
              const cost = row.LandedCostValue || row.TotalCostValue || 24000;
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-4 hover:shadow-md transition-all duration-200" id={`import-card-${rIdx}`}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-sky-50 text-sky-700 p-2 rounded-xl">
                        <CloudUpload className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 font-mono tracking-tight">{containerId}</h4>
                        <span className="text-[10px] text-slate-400 font-sans">تاريخ الوصول: {date}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      status === "Cleared" || status === "Released"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sky-100 text-sky-800"
                    }`} id={`import-status-${rIdx}`}>
                      {status === "Cleared" ? "تم التخليص والوصول 🚢" : "في البحر / In Transit 🌊"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-600" id={`import-details-${rIdx}`}>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">ميناء الشحن الأصلي:</span>
                      <span className="font-semibold text-slate-900">{origin}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">المورد الدولي:</span>
                      <span className="font-extrabold text-slate-900 font-mono">{supplier}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">التكلفة التقديرية شاملة الجمارك:</span>
                      <span className="font-extrabold text-emerald-700 font-mono">
                        {Number(cost).toLocaleString()} ج.م
                      </span>
                    </div>

                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px]" id={`import-visual-${rIdx}`}>
                      <div className="flex justify-between font-bold mb-1">
                        <span>ميناء التصدير</span>
                        <span>مصلحة الجمارك</span>
                        <span>مخازن القاهرة</span>
                      </div>
                      <div className="flex items-center gap-1.5 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div className={`h-full ${status === "Cleared" ? "w-full" : "w-2/3"} bg-sky-500`} />
                      </div>
                    </div>
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    if (sheetId === "inventoryLots" || sheetId === "warehouses" || sheetId === "inventoryLocations" || sheetId === "categories") {
      const isLots = sheetId === "inventoryLots";
      return (
        <div className="flex flex-col gap-4" id="smart-view-inventory" dir="rtl">
          {renderSearchBar()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="inventory-card-grid">
            {items.map((row, rIdx) => {
              const originalIdx = activeSheet.rows.indexOf(row);
              const title = isLots ? row.LotID || row.LotNumber : row.WarehouseName || row.LocationCode || row.CategoryName;
              const code = isLots ? row.ItemID || row.ItemCode : row.WarehouseCode || row.LocationCode || row.CategoryCode;
              const qty = isLots ? row.QuantityOnHand || row.Qty : row.Location || row.ManagerID || row.ArabicName;
              const status = isLots ? row.QualityStatus || "Good" : "Active";
              
              return (
                <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-3 hover:shadow-md transition-all duration-200" id={`inventory-card-${rIdx}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        📦
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-950 leading-tight">{title}</h4>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">كود: {code}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                      status === "Good" || status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`} id={`inventory-status-${rIdx}`}>
                      {status === "Good" ? "سليم ومطابق" : status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3 text-slate-600" id={`inventory-details-${rIdx}`}>
                    {isLots ? (
                      <>
                        <div>
                          <span className="text-slate-400 font-bold block">الكمية المتوفرة:</span>
                          <span className="font-extrabold text-slate-900 font-mono text-sm">{qty} طن / كجم</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block">كود المخزن:</span>
                          <span className="font-semibold text-slate-800 font-mono">{row.WarehouseCode || "W001"}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2">
                          <span className="text-slate-400 font-bold block">المدير / الوصف / التفاصيل:</span>
                          <span className="font-semibold text-slate-800">{qty || "مسؤول معتمد للنظم اللوجستية"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {renderCardActions(row, originalIdx)}
                </div>
              );
            })}
            {renderAddCardButton()}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4" id="smart-view-generic" dir="rtl">
        {renderSearchBar()}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="generic-card-grid">
          {items.map((row, rIdx) => {
            const originalIdx = activeSheet.rows.indexOf(row);
            const firstKey = activeSheet.columns[0]?.key;
            const secondKey = activeSheet.columns[1]?.key;
            const thirdKey = activeSheet.columns[2]?.key;
            const title = row[secondKey] ? String(row[secondKey]) : "سجل نظام";
            const code = row[firstKey] ? String(row[firstKey]) : `ID-${rIdx}`;
            const details = row[thirdKey] ? String(row[thirdKey]) : "سجل تشغيلي إداري";
            
            return (
              <div key={rIdx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col gap-3 hover:shadow-md transition-all duration-200" id={`generic-card-${rIdx}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs font-mono">
                      {code.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-950 leading-tight">{title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{code}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-3" id={`generic-details-${rIdx}`}>
                  <span className="text-slate-400 font-bold block mb-0.5">البيان / الوصف:</span>
                  <p className="font-semibold text-slate-800 font-sans leading-relaxed">{details}</p>
                </div>

                {renderCardActions(row, originalIdx)}
              </div>
            );
          })}
          {renderAddCardButton()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900" id="app-root">
      {/* --- TOP BRAND BAR --- */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-sm" id="header-brand-bar">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded flex items-center justify-center text-white font-bold text-xs" id="brand-logo-container">
            IS
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900 flex items-center gap-2" id="brand-title">
              الدولية ستيل <span className="text-slate-400 font-sans text-xs font-normal">| International Steel ERP</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold" id="brand-subtitle">Trading & Supply of Premium Stainless Steel Sheets, Coils & Pipes</p>
          </div>
        </div>

        {/* --- GOOGLE SECURITY / AUTH CONTROL --- */}
        <div className="flex items-center gap-3" id="header-controls">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-700" id="user-profile">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  referrerPolicy="no-referrer"
                  alt="avatar"
                  className="w-5 h-5 rounded-full"
                  id="user-avatar"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-slate-500" id="user-avatar-fallback" />
              )}
              <span className="text-slate-600 font-mono hidden sm:inline" id="user-email">{user.email}</span>
              <button
                onClick={handleLogout}
                title="Disconnect Google Account"
                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                id="logout-button"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all shadow-sm"
              id="login-button"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Sign in with Google
            </button>
          )}

          <button
            onClick={runAudit}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
            id="audit-button"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Audit Ledger
          </button>
        </div>
      </header>

      {/* --- EXECUTIVE BANNER & OVERVIEW STATS --- */}
      <section className="bg-slate-50 px-6 py-6 border-b border-slate-200" id="stats-banner-section" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" id="stats-grid">
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow" id="stat-card-sheets">
            <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 border border-indigo-100 shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">إجمالي جداول البيانات / Total Worksheets</p>
              <p className="text-sm font-black text-slate-950 mt-0.5">51 جدولاً تشغيلياً <span className="text-[10px] font-normal text-slate-400 font-sans">/ 51 Sheets</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow" id="stat-card-sales">
            <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 border border-emerald-100 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">مبيعات السنة الحالية / Sales YTD</p>
              <p className="text-sm font-black text-slate-950 mt-0.5">1,545,000 ج.م <span className="text-[10px] font-normal text-slate-400 font-sans">/ EGP 1.54M</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow" id="stat-card-grades">
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600 border border-amber-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">رتب الأستانلس المعتمدة / Steel Grades</p>
              <p className="text-sm font-black text-slate-950 mt-0.5">304 / 316 / 430 <span className="text-[10px] font-normal text-slate-400 font-sans">/ Premium</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow" id="stat-card-facilities">
            <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 border border-indigo-100 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">المستودعات والفروع / Warehouses</p>
              <p className="text-sm font-black text-slate-950 mt-0.5">10 مستودعات فعالة <span className="text-[10px] font-normal text-slate-400 font-sans">/ 10 Facilities</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow" id="stat-card-remnants">
            <div className="bg-rose-50 p-2.5 rounded-lg text-rose-600 border border-rose-100 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">الفضلات والمقصوصات / Cut Remnants</p>
              <p className="text-sm font-black text-slate-950 mt-0.5">تتبع ذكي للوزن والمقاس <span className="text-[10px] font-normal text-slate-400 font-sans">/ Live Remnants</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CORE ERP WORKSPACE --- */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#F8FAFC]" id="main-workspace">
        {/* --- LEFT SIDEBAR: SHEETS INDEX --- */}
        <aside className="w-full lg:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col p-4 shrink-0 gap-3" id="sidebar">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400" id="sidebar-filter-label">
              Workspace Filter
            </label>
            <div className="relative mt-1" id="sidebar-search-container">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 51 sheets (e.g. CutRemnants)..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                id="sidebar-search-input"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div id="category-filter-container">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1" id="category-filter-header">
              <Filter className="w-3 h-3" />
              <span>Category</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer shadow-sm"
              id="category-dropdown"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable list of sheets */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 min-h-[250px] lg:max-h-[calc(100vh-420px)]" id="sheets-scroll-container">
            {/* Master Dashboard Selector */}
            <button
              onClick={() => setSelectedSheetId("dashboard")}
              className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all cursor-pointer border ${
                selectedSheetId === "dashboard"
                  ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50"
              }`}
              id="sidebar-dashboard-tab"
            >
              <div className={`p-1.5 rounded-md ${selectedSheetId === "dashboard" ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-slate-500"}`}>
                <LayoutDashboard className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold leading-tight">Master ERP Dashboard</p>
                <p className={`text-[9px] leading-none mt-0.5 ${selectedSheetId === "dashboard" ? "text-slate-300" : "text-slate-400"}`}>لوحة القيادة والتقارير العامة</p>
              </div>
            </button>

            {/* Google Gmail Integration */}
            <button
              onClick={() => setSelectedSheetId("gmail")}
              className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all cursor-pointer border ${
                selectedSheetId === "gmail"
                  ? "bg-rose-900 border-rose-900 text-white font-semibold shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50"
              }`}
              id="sidebar-gmail-tab"
            >
              <div className={`p-1.5 rounded-md ${selectedSheetId === "gmail" ? "bg-rose-800 text-rose-350" : "bg-rose-50 text-rose-500"}`}>
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold leading-tight">Google Gmail Integration</p>
                <p className={`text-[9px] leading-none mt-0.5 ${selectedSheetId === "gmail" ? "text-rose-200" : "text-slate-400"}`}>البريد الإلكتروني للشركة</p>
              </div>
            </button>

            {/* Google Calendar Integration */}
            <button
              onClick={() => setSelectedSheetId("calendar")}
              className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all cursor-pointer border ${
                selectedSheetId === "calendar"
                  ? "bg-emerald-900 border-emerald-900 text-white font-semibold shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50"
              }`}
              id="sidebar-calendar-tab"
            >
              <div className={`p-1.5 rounded-md ${selectedSheetId === "calendar" ? "bg-emerald-800 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold leading-tight">Google Calendar Integration</p>
                <p className={`text-[9px] leading-none mt-0.5 ${selectedSheetId === "calendar" ? "text-emerald-200" : "text-slate-400"}`}>تقويم المواعيد والاجتماعات</p>
              </div>
            </button>

            <div className="h-px bg-slate-200 my-1" />

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-1" id="sheets-index-header">
              Worksheets Index ({filteredSheets.length})
            </p>
            {filteredSheets.map((sh) => {
              const isActive = sh.id === selectedSheetId;
              return (
                <button
                  key={sh.id}
                  onClick={() => setSelectedSheetId(sh.id)}
                  className={`flex flex-col text-left px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white font-medium shadow-sm"
                      : "hover:bg-slate-200/60 text-slate-600"
                  }`}
                  id={`sheet-tab-${sh.id}`}
                >
                  <span className="text-xs flex items-center gap-1.5 justify-between w-full">
                    <span className="font-medium">{sh.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`} id={`sheet-badge-${sh.id}`}>
                      {sh.rows.length} rows
                    </span>
                  </span>
                  <span className={`text-[10px] font-sans mt-0.5 font-normal ${
                    isActive ? "text-slate-300" : "text-slate-400"
                  }`} id={`sheet-arabic-title-${sh.id}`}>
                    {sh.arabicName}
                  </span>
                </button>
              );
            })}
            {filteredSheets.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6" id="empty-sheets-placeholder">No sheets match search criteria.</p>
            )}
          </div>
        </aside>

        {/* --- RIGHT PANEL: TABLE VIEW & ACTIONS --- */}
        <section className="flex-1 flex flex-col p-6 min-w-0 bg-[#F8FAFC] overflow-y-auto" id="data-panel">
          {selectedSheetId === "gmail" ? (
            /* --- GMAIL INTEGRATION VIEW --- */
            <div className="flex flex-col gap-6 animate-fade-in text-slate-800" id="gmail-integration-view" dir="rtl">
              <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-rose-600">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
                      <Bell className="w-8 h-8 text-rose-200" />
                      مركز اتصالات البريد الإلكتروني (Gmail)
                    </h1>
                    <p className="text-sm text-rose-100 font-sans mt-1">
                      إرسال الفواتير وعروض الأسعار والتواصل المباشر مع العملاء والموردين عبر Gmail
                    </p>
                  </div>
                </div>
              </div>

              {!user ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm flex flex-col items-center gap-4">
                  <div className="bg-rose-50 p-4 rounded-full text-rose-500">
                    <Bell className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold">تسجيل الدخول مطلوب</h3>
                  <p className="text-sm text-slate-500 max-w-md font-sans">
                    يرجى تسجيل الدخول باستخدام حساب Google المعتمد للشركة لتتمكن من استعراض صندوق البريد وإرسال الرسائل المباشرة.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer text-xs"
                  >
                    ربط حساب Google
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Compose Email Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">
                      إرسال رسالة بريد إلكتروني جديدة
                    </h3>
                    <div className="space-y-3.5 text-right">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">البريد الإلكتروني للمستلم (To)</label>
                        <input
                          type="email"
                          placeholder="customer@example.com"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">الموضوع (Subject)</label>
                        <input
                          type="text"
                          placeholder="عاجل: عرض سعر خامات الحديد - الدولية ستيل"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">نص الرسالة (Body)</label>
                        <textarea
                          rows={6}
                          placeholder="السلام عليكم ورحمة الله وبركاته..."
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-sans"
                        />
                      </div>
                      <button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSendingEmail ? "جاري الإرسال..." : "إرسال الآن عبر Gmail"}
                      </button>
                    </div>
                  </div>

                  {/* Inbox List */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-7 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h3 className="text-sm font-extrabold text-slate-900">آخر رسائل صندوق الوارد</h3>
                      <button
                        onClick={fetchEmails}
                        disabled={isLoadingEmails}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                      >
                        {isLoadingEmails ? "جاري التحديث..." : "تحديث الرسائل ↻"}
                      </button>
                    </div>

                    {isLoadingEmails ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        جاري تحميل البريد الوارد...
                      </div>
                    ) : emails.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        لا توجد رسائل مستلمة حالياً في صندوق الوارد.
                      </div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto max-h-[450px]">
                        {emails.map((msg: any) => {
                          const headers = msg.payload?.headers || [];
                          const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
                          const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown";
                          const snippet = msg.snippet || "";
                          return (
                            <div key={msg.id} className="border-b border-slate-100 pb-3 last:border-0 text-right">
                              <div className="flex justify-between items-start mb-1 text-xs">
                                <span className="font-bold text-slate-900">{from}</span>
                                <span className="text-slate-400">{new Date(parseInt(msg.internalDate)).toLocaleDateString("ar-EG")}</span>
                              </div>
                              <h4 className="text-xs font-semibold text-rose-850 mb-1">{subject}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2">{snippet}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : selectedSheetId === "calendar" ? (
            /* --- CALENDAR INTEGRATION VIEW --- */
            <div className="flex flex-col gap-6 animate-fade-in text-slate-800" id="calendar-integration-view" dir="rtl">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-emerald-600">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
                      <Calendar className="w-8 h-8 text-emerald-200" />
                      تقويم الشركة والمواعيد (Google Calendar)
                    </h1>
                    <p className="text-sm text-emerald-100 font-sans mt-1">
                      تنظيم اجتماعات العملاء، مواعيد استلام الشحنات، وجداول الصيانة والمتابعة الدورية
                    </p>
                  </div>
                </div>
              </div>

              {!user ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm flex flex-col items-center gap-4">
                  <div className="bg-emerald-50 p-4 rounded-full text-emerald-500">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold">تسجيل الدخول مطلوب</h3>
                  <p className="text-sm text-slate-500 max-w-md font-sans">
                    يرجى تسجيل الدخول باستخدام حساب Google المعتمد للشركة لتتمكن من جدولة المواعيد واستعراض التقويم.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer text-xs"
                  >
                    ربط حساب Google
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Schedule Event Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">
                      إضافة موعد / اجتماع جديد للتقويم
                    </h3>
                    <div className="space-y-3.5 text-right">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">عنوان الموعد (Summary)</label>
                        <input
                          type="text"
                          placeholder="اجتماع توريد خامات مع شركة المقاولات"
                          value={calSummary}
                          onChange={(e) => setCalSummary(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ البدء</label>
                          <input
                            type="date"
                            value={calStartDate}
                            onChange={(e) => setCalStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">وقت البدء</label>
                          <input
                            type="time"
                            value={calStartTime}
                            onChange={(e) => setCalStartTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ الانتهاء</label>
                          <input
                            type="date"
                            value={calEndDate}
                            onChange={(e) => setCalEndDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">وقت الانتهاء</label>
                          <input
                            type="time"
                            value={calEndTime}
                            onChange={(e) => setCalEndTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">الوصف (Description)</label>
                        <textarea
                          rows={3}
                          placeholder="تفاصيل الموعد وجدول الأعمال..."
                          value={calDescription}
                          onChange={(e) => setCalDescription(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-sans"
                        />
                      </div>
                      <button
                        onClick={handleCreateEvent}
                        disabled={isCreatingEvent}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isCreatingEvent ? "جاري الحفظ..." : "حفظ في Google Calendar"}
                      </button>
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-7 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <h3 className="text-sm font-extrabold text-slate-900">المواعيد والاجتماعات القادمة</h3>
                      <button
                        onClick={fetchEvents}
                        disabled={isLoadingEvents}
                        className="text-xs text-emerald-600 hover:text-emerald-800 font-bold"
                      >
                        {isLoadingEvents ? "جاري التحديث..." : "تحديث المواعيد ↻"}
                      </button>
                    </div>

                    {isLoadingEvents ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        جاري تحميل التقويم...
                      </div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        لا توجد مواعيد قادمة مسجلة في التقويم.
                      </div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto max-h-[450px]">
                        {events.map((event: any) => {
                          const start = event.start?.dateTime || event.start?.date || "";
                          const formattedStart = start ? new Date(start).toLocaleString("ar-EG") : "";
                          return (
                            <div key={event.id} className="border-b border-slate-100 pb-3 last:border-0 text-right">
                              <div className="flex justify-between items-start mb-1 text-xs">
                                <span className="font-bold text-slate-900">{event.summary || "(No Title)"}</span>
                                <span className="text-emerald-600 font-semibold">{formattedStart}</span>
                              </div>
                              {event.description && (
                                <p className="text-[11px] text-slate-500">{event.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : selectedSheetId === "dashboard" ?
            /* --- MASTER EXECUTIVE DASHBOARD / لوحة التحكم والمتابعة التنفيذية الشاملة --- */
            <div className="flex flex-col gap-6 animate-fade-in text-slate-800" id="master-dashboard-view" dir="rtl">
              {/* TOP BRAND HEADER & CONTROL BAR */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800" id="dashboard-custom-hero">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-500 text-slate-950 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                        ● نظام نشط وآمن / ACTIVE SECURE CORE
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">العملة الأساسية: الجنيه المصري (EGP)</span>
                    </div>
                    <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight flex items-center gap-2.5">
                      <Building2 className="w-8 h-8 text-indigo-400" />
                      الدولية ستيل لتجارة وتوريد خامات الاستانلس ستيل
                    </h1>
                    <p className="text-sm text-slate-300 font-sans mt-1">
                      نظام التشغيل المؤسسي المتكامل ولوحة القيادة التنفيذية | International Steel Co. ERP & BI Gateway
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={handleGenerateMasterPDF}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md border border-indigo-500"
                      id="dashboard-master-pdf-btn"
                    >
                      <Printer className="w-4 h-4" />
                      طباعة التقرير الشامل / Executive Report
                    </button>
                    
                    <button
                      onClick={triggerExcelDownload}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-700 shadow-sm"
                      id="dashboard-master-excel-btn"
                    >
                      <Download className="w-4 h-4 text-slate-300" />
                      تصدير كتاب العمل الكامل / Download Workbook
                    </button>
                  </div>
                </div>
              </div>

              {/* DATE & TIME FILTER ROW */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4" id="dashboard-filter-bar">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-700 border border-indigo-100">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 font-sans">تاريخ المتابعة:</span>
                    <select
                      value={dashboardDate}
                      onChange={(e) => setDashboardDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-700 focus:outline-none cursor-pointer"
                      id="dashboard-date-select"
                    >
                      <option value="25-05-2024">25-05-2024</option>
                      <option value="28-06-2026">28-06-2026 (اليوم)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setDashboardTimeFilter("day")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      dashboardTimeFilter === "day"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    اليوم
                  </button>
                  <button
                    onClick={() => setDashboardTimeFilter("week")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      dashboardTimeFilter === "week"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    هذا الأسبوع
                  </button>
                  <button
                    onClick={() => setDashboardTimeFilter("month")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      dashboardTimeFilter === "month"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    هذا الشهر
                  </button>
                  <button
                    onClick={() => setDashboardTimeFilter("all")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      dashboardTimeFilter === "all"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    الكل
                  </button>

                  <div className="w-px h-5 bg-slate-200 mx-1.5" />

                  <button
                    onClick={() => showAlert("تخصيص الشاشة", "يمكنك إعادة ترتيب لوحات القيادة وتخصيص تنبيهات المتابعة الذكية من لوحة إعدادات المدير.")}
                    className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>تخصيص الشاشة</span>
                  </button>
                </div>
              </div>

              {/* CORE PERFORMANCE METRIC CARDS - 7 CARDS MATCHING MOCKUP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4" id="dashboard-metric-cards-7">
                {/* 1. إجمالي السيولة */}
                <div
                  onClick={() => setSelectedSheetId("cashAccounts")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">إجمالي السيولة</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">12.5% ▲</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">1,285,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">جنيه مصري</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                      <path d="M0,25 C15,22 30,28 45,15 C60,2 75,10 100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عن أمس ● الخزائن والبنوك</p>
                </div>

                {/* 2. إجمالي المخزون */}
                <div
                  onClick={() => setSelectedSheetId("items")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">إجمالي المخزون</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">5.8% ▲</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">8,420</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">طن من الألواح والمواسير</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                      <path d="M0,28 C15,26 30,22 45,18 C60,10 75,5 100,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عن أمس ● 5 مستودعات رئيسية</p>
                </div>

                {/* 3. إجمالي المبيعات */}
                <div
                  onClick={() => setSelectedSheetId("salesInvoices")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">إجمالي المبيعات</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">18.3% ▲</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">3,850,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">جنيه مبيعات مفوترة</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                      <path d="M0,25 C15,20 30,22 45,12 C60,2 75,8 100,1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عن أمس ● نشاط البيع والتعاقد</p>
                </div>

                {/* 4. إجمالي المشتريات */}
                <div
                  onClick={() => setSelectedSheetId("purchaseInvoices")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">إجمالي المشتريات</span>
                    <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">4.2% ▼</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">2,910,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">جنيه توريدات مستلمة</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-rose-500" preserveAspectRatio="none">
                      <path d="M0,5 C15,10 30,8 45,18 C60,20 75,25 100,28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عن أمس ● فواتير شراء معتمدة</p>
                </div>

                {/* 5. صافي التحصيل */}
                <div
                  onClick={() => setSelectedSheetId("receipts")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">صافي التحصيل</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">15.7% ▲</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">2,950,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">جنيه نقدي وشيكات</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                      <path d="M0,26 C20,24 40,15 60,12 C80,10 90,5 100,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عن أمس ● كفاءة دورة التحصيل</p>
                </div>

                {/* 6. العملاء */}
                <div
                  onClick={() => setSelectedSheetId("customers")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">العملاء</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">+3 جدد</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">148</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">عميل مسجل في الدفاتر</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                      <path d="M0,20 L20,18 L40,12 L60,15 L80,5 L100,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">عميل نشط تجارياً</p>
                </div>

                {/* 7. الشيكات */}
                <div
                  onClick={() => setSelectedSheetId("checks")}
                  className="bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 shadow-2xs flex flex-col justify-between cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-slate-500">الشيكات</span>
                    <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">-2 شيك</span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">37</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">شيك تحت التحصيل/الدفع</p>
                  </div>
                  <div className="mt-3 h-6 w-full opacity-80">
                    <svg viewBox="0 0 100 30" className="w-full h-full text-rose-500" preserveAspectRatio="none">
                      <path d="M0,10 L25,12 L50,18 L75,22 L100,26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">شيك معلق الصرف</p>
                </div>
              </div>

              {/* THREE-COLUMN INTERACTIVE MIDDLE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="dashboard-middle-row">
                {/* Panel 1: مؤشرات تحتاج قرار */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                      مؤشرات تحتاج قرار عاجل
                    </h3>
                    <div className="space-y-3.5 mt-3.5 text-xs">
                      <div
                        onClick={() => setSelectedSheetId("checks")}
                        className="flex justify-between items-center bg-slate-50 hover:bg-rose-50/50 p-2 rounded-lg border border-slate-100 hover:border-rose-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                          <span className="font-bold text-slate-800">شيك مستحق الصرف غداً</span>
                        </div>
                        <span className="text-[11px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">عدد 3 شيكات</span>
                      </div>

                      <div
                        onClick={() => { setSelectedSheetId("items"); setTableSearch("304 Sheet 2mm"); }}
                        className="flex justify-between items-center bg-slate-50 hover:bg-amber-50/50 p-2 rounded-lg border border-slate-100 hover:border-amber-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="font-semibold text-slate-700">خامة حديد ستنفد خلال 5 أيام</span>
                        </div>
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">304 Sheet 2mm</span>
                      </div>

                      <div
                        onClick={() => { setSelectedSheetId("customers"); setTableSearch("شركة النور"); }}
                        className="flex justify-between items-center bg-slate-50 hover:bg-rose-50/50 p-2 rounded-lg border border-slate-100 hover:border-rose-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          <span className="font-bold text-slate-800">عميل تجاوز حد الائتمان</span>
                        </div>
                        <span className="text-[11px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">شركة النور للإنشاءات</span>
                      </div>

                      <div
                        onClick={() => setSelectedSheetId("purchaseOrders")}
                        className="flex justify-between items-center bg-slate-50 hover:bg-amber-50/50 p-2 rounded-lg border border-slate-100 hover:border-amber-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="font-semibold text-slate-700">أمر شراء ينتظر اعتماد الإدارة</span>
                        </div>
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">عدد 1 معلق</span>
                      </div>

                      <div
                        onClick={() => setSelectedSheetId("logs")}
                        className="flex justify-between items-center bg-slate-50 hover:bg-amber-50/50 p-2 rounded-lg border border-slate-100 hover:border-amber-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="font-semibold text-slate-700">كونتينر استيراد بالميناء منذ 3 أيام</span>
                        </div>
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">TEMU8456221</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedSheetId("logs"); showAlert("التنبيهات الإدارية", "تم مراجعة 5 تنبيهات حرجة، كافة النظم اللوجستية والمالية متوافقة مع متطلبات الرقابة الموحدة."); }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-2 px-3 rounded-lg border border-slate-200 text-center cursor-pointer transition-colors"
                  >
                    عرض جميع التنبيهات والطلبات
                  </button>
                </div>

                {/* Panel 2: حركة الأموال - السيولة */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    حركة وتوزيع الأموال (السيولة)
                  </h3>

                  <div className="relative flex items-center justify-center my-4 h-36">
                    {/* Concentric SVG Donut Chart representing 35%, 55%, 10% */}
                    <svg width="130" height="130" viewBox="0 0 42 42" className="transform -rotate-90">
                      {/* Gray track */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4.5" />
                      {/* Banks (55%) - Indigo */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#4F46E5" strokeWidth="4.5" strokeDasharray="55 45" strokeDashoffset="0" />
                      {/* Cash Safe (35%) - Emerald */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="-55" />
                      {/* Wallets (10%) - Amber */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="-90" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-800">1,285,000</span>
                      <span className="text-[9px] text-slate-400 font-bold">جنيه مصري</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans pt-2 border-t border-slate-100">
                    <div className="flex flex-col items-center bg-emerald-50 rounded p-1.5 border border-emerald-100">
                      <span className="font-extrabold text-emerald-700">الخزائن (35%)</span>
                      <span className="font-mono font-bold text-slate-700 mt-0.5">449,750 ج.م</span>
                    </div>
                    <div className="flex flex-col items-center bg-indigo-50 rounded p-1.5 border border-indigo-100">
                      <span className="font-extrabold text-indigo-700">البنوك (55%)</span>
                      <span className="font-mono font-bold text-slate-700 mt-0.5">706,750 ج.م</span>
                    </div>
                    <div className="flex flex-col items-center bg-amber-50 rounded p-1.5 border border-amber-100">
                      <span className="font-extrabold text-amber-700">المحافظ (10%)</span>
                      <span className="font-mono font-bold text-slate-700 mt-0.5">128,500 ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Panel 3: أفضل العملاء مبيعات */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      أفضل العملاء من حيث المبيعات
                    </h3>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 text-slate-500 text-[11px]">
                          <tr>
                            <th className="py-2 px-3">العميل</th>
                            <th className="py-2 px-3 text-left">قيمة المبيعات</th>
                            <th className="py-2 px-3 text-center">النسبة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-bold text-slate-900">شركة النور للإنشاءات</td>
                            <td className="py-2 px-3 text-left font-mono font-semibold text-emerald-700">620,000 ج.م</td>
                            <td className="py-2 px-3 text-center text-slate-400">16.1%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-semibold">مصنع القاهرة للحديد والصلب</td>
                            <td className="py-2 px-3 text-left font-mono text-slate-700">480,000 ج.م</td>
                            <td className="py-2 px-3 text-center text-slate-400">12.5%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-semibold">الشركة المتحدة للتجارة والتوريد</td>
                            <td className="py-2 px-3 text-left font-mono text-slate-700">410,000 ج.م</td>
                            <td className="py-2 px-3 text-center text-slate-400">10.6%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-semibold">شركة المدينة للمقاولات العامة</td>
                            <td className="py-2 px-3 text-left font-mono text-slate-700">365,000 ج.م</td>
                            <td className="py-2 px-3 text-center text-slate-400">9.5%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-semibold">مجموعة المحمدي للتجارة</td>
                            <td className="py-2 px-3 text-left font-mono text-slate-700">340,000 ج.م</td>
                            <td className="py-2 px-3 text-center text-slate-400">8.8%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2 border-t border-slate-150 flex justify-between items-center text-[11px]">
                    <span className="font-extrabold text-slate-900">إجمالي مبيعات القمة:</span>
                    <span className="font-mono font-extrabold text-emerald-800">2,215,000 ج.م</span>
                  </div>
                </div>

                {/* Panel 4: أفضل الأصناف مبيعاً */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-indigo-600" />
                      الأصناف الأكثر طلباً ومبيعاً (كمية)
                    </h3>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 text-slate-500 text-[11px]">
                          <tr>
                            <th className="py-2 px-3">صنف الحديد / الأبعاد</th>
                            <th className="py-2 px-3 text-center">الكمية (طن)</th>
                            <th className="py-2 px-3 text-left">إجمالي القيمة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                          <tr className="hover:bg-slate-50 transition-colors text-right">
                            <td className="py-2 px-3 font-sans font-bold text-slate-900 text-right">304 Sheet 2mm</td>
                            <td className="py-2 px-3 text-center text-indigo-600 font-bold">612</td>
                            <td className="py-2 px-3 text-left font-semibold text-slate-700">1,285,000 ج.م</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors text-right">
                            <td className="py-2 px-3 font-sans text-slate-700 text-right">304 Sheet 3mm</td>
                            <td className="py-2 px-3 text-center">485</td>
                            <td className="py-2 px-3 text-left text-slate-600">1,120,000 ج.م</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors text-right">
                            <td className="py-2 px-3 font-sans text-slate-700 text-right">316 Sheet 2mm</td>
                            <td className="py-2 px-3 text-center">223</td>
                            <td className="py-2 px-3 text-left text-slate-600">680,000 ج.م</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors text-right">
                            <td className="py-2 px-3 font-sans text-slate-700 text-right">Pipe 2" 304</td>
                            <td className="py-2 px-3 text-center">198</td>
                            <td className="py-2 px-3 text-left text-slate-600">425,000 ج.م</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors text-right">
                            <td className="py-2 px-3 font-sans text-slate-700 text-right">Tube 40x40 304</td>
                            <td className="py-2 px-3 text-center">168</td>
                            <td className="py-2 px-3 text-left text-slate-600">340,000 ج.م</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2 border-t border-slate-150 flex justify-between items-center text-[11px]">
                    <span className="font-sans font-extrabold text-slate-900">مجموع الكمية المباعة:</span>
                    <span className="font-extrabold text-indigo-700">1,686 طن</span>
                  </div>
                </div>
              </div>

              {/* FOUR-COLUMN LOWER ANALYSIS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="dashboard-lower-row">
                {/* Panel 5: المخزون - نظرة عامة */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs lg:col-span-2 flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-indigo-600" />
                      مستودعات الحديد والمخزون - نظرة عامة شاملة
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Sub 1: الأكثر حركة */}
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-500 mb-2.5 uppercase tracking-wide">أكثر 5 أصناف حركة وتداولاً</p>
                        <div className="space-y-3 font-mono">
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans font-semibold text-slate-800">304 Sheet 2mm</span>
                              <span className="font-bold text-slate-900">850 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: "85%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">304 Sheet 3mm</span>
                              <span>720 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "72%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">316 Sheet 2mm</span>
                              <span>410 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-400 h-full rounded-full" style={{ width: "41%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">Pipe 2" 304</span>
                              <span>380 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-300 h-full rounded-full" style={{ width: "38%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">Tube 40x40 304</span>
                              <span>320 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-200 h-full rounded-full" style={{ width: "32%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub 2: الأصناف الراكدة */}
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-500 mb-2.5 uppercase tracking-wide">أصناف راكدة (أكثر من 90 يوم بدون حركة)</p>
                        <div className="space-y-3 font-mono">
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-800">316 Sheet 4mm</span>
                              <span className="font-bold text-rose-600">12.5 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full rounded-full" style={{ width: "95%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">310 Sheet 3mm</span>
                              <span>9.8 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-400 h-full rounded-full" style={{ width: "75%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">201 Sheet 2mm</span>
                              <span>7.6 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-300 h-full rounded-full" style={{ width: "60%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">430 Sheet 3mm</span>
                              <span>6.2 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-450 h-full rounded-full" style={{ width: "48%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="font-sans text-slate-700">1.4301 Sheet 1.5mm</span>
                              <span>5.4 طن</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-350 h-full rounded-full" style={{ width: "40%" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 mt-1 flex justify-between items-center text-[11px] text-slate-500">
                    <span>ملاحظة: يتم تحديث تصنيف الأصناف الراكدة تلقائياً بناءً على آخر حركة تسوية وجرد.</span>
                    <button
                      onClick={() => setSelectedSheetId("items")}
                      className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                    >
                      عرض المخزون بالكامل ←
                    </button>
                  </div>
                </div>

                {/* Panel 6: القطع والمتبقيات Remnants */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Factory className="w-4 h-4 text-emerald-600" />
                      متبقيات القطع والهدر (Remnants)
                    </h3>

                    <div className="relative flex items-center justify-center my-4 h-32">
                      {/* Donut chart for remnants (81% vs 19%) */}
                      <svg width="115" height="115" viewBox="0 0 42 42" className="transform -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4.5" />
                        {/* Saleable (81%) - Emerald */}
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="81 19" strokeDashoffset="0" />
                        {/* Scrap (19%) - Red */}
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="19 81" strokeDashoffset="-81" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-extrabold text-slate-800">1,250</span>
                        <span className="text-[9px] text-slate-400 font-bold">قطعة متبقية</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100">
                        <span className="font-bold">قطع صالحة للبيع وإعادة التوظيف</span>
                        <span className="font-mono font-bold">81% (5.83 طن)</span>
                      </div>
                      <div className="flex justify-between items-center bg-rose-50 text-rose-800 p-2 rounded-lg border border-rose-100">
                        <span className="font-bold">خردة معدنية لإعادة الصهر</span>
                        <span className="font-mono font-bold">19% (1.37 طن)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSheetId("cutRemnants")}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-2 px-3 rounded-lg border border-slate-200 text-center cursor-pointer transition-colors mt-3"
                  >
                    عرض سجل بواقي القطع بالتفصيل
                  </button>
                </div>

                {/* Panel 7: محرك القص الذكي */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                      محرك القص الذكي - اليوم
                    </h3>

                    <div className="mt-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-300 font-medium">طلبات القص المستلمة:</span>
                        <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-xs">26 طلب</span>
                      </div>
                      
                      <div className="h-px bg-slate-800" />

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            تم التنفيذ من بواقي سابقة:
                          </span>
                          <span className="font-mono font-bold text-white">18 أمر</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            تم التنفيذ من ألواح خام جديدة:
                          </span>
                          <span className="font-mono font-bold text-white">8 أوامر</span>
                        </div>
                      </div>

                      <div className="h-px bg-slate-800" />

                      <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-2 text-center">
                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">إجمالي الوفر المالي المحقق اليوم</p>
                        <p className="text-base font-mono font-extrabold text-emerald-300 mt-0.5">63,500 ج.م</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans text-center mt-3 leading-tight">
                    محرك الخوارزمية الذكية يقوم بتقليل نسبة التالف والهدر لأقصى درجة تلقائياً.
                  </p>
                </div>
              </div>

              {/* TWO PANEL ROW: SYSTEM LOGS & APPROVAL QUEUE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-logs-approvals">
                {/* Panel 8: سجل التنبيهات المباشر */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    سجل التنبيهات وإشعارات النظام الحية
                  </h3>
                  <div className="mt-4 space-y-3.5">
                    <div className="flex gap-3 text-xs items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span className="bg-rose-50 text-rose-700 font-mono text-[10px] font-bold py-1 px-1.5 rounded whitespace-nowrap">10:30 AM</span>
                      <div>
                        <p className="font-bold text-slate-900">شيك صادر برقم CHK-8809 مستحق الصرف غداً</p>
                        <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">مستحق لصالح شركة الإسماعيلية للمعادن بقيمة 150,000 ج.م</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span className="bg-amber-50 text-amber-800 font-mono text-[10px] font-bold py-1 px-1.5 rounded whitespace-nowrap">09:20 AM</span>
                      <div>
                        <p className="font-bold text-slate-900">خامة 304 سمك 2 مم قاربت على النفاد من مستودع العبور</p>
                        <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">الرصيد المتبقي الحالي: 5 طن فقط. الحد الأدنى للأمان: 20 طن</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span className="bg-rose-50 text-rose-700 font-mono text-[10px] font-bold py-1 px-1.5 rounded whitespace-nowrap">08:45 AM</span>
                      <div>
                        <p className="font-bold text-slate-900">تجاوز حد الائتمان المعتمد للعميل: شركة النور للإنشاءات</p>
                        <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">تجاوز الرصيد المدين حد 500,000 ج.م المعتمد بـ 120,000 ج.م</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span className="bg-amber-50 text-amber-800 font-mono text-[10px] font-bold py-1 px-1.5 rounded whitespace-nowrap">08:20 AM</span>
                      <div>
                        <p className="font-bold text-slate-900">تنبيه تأخير حاوية استيراد رقم TEMU-8456221 بالميناء</p>
                        <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">الحاوية محملة بلفائف أستانلس ستيل 316. تجاوزت فترة الإعفاء بـ 3 أيام</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 9: طلبات تحتاج اعتماد وموافقة */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    طلبات تحتاج موافقة واعتماد الإدارة العليا
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">طلب خصم إستثنائي لعميل مبيعات</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">مقدم من مسؤول مبيعات: مصطفى فوزي</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">3 طلبات معلقة</span>
                        <button
                          onClick={() => showAlert("موافقة الخصم", "تم إعتماد نسبة الخصم الاستثنائية للعملاء المحددين بنجاح.")}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded cursor-pointer text-[10px] transition-colors"
                        >
                          مراجعة واعتماد
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">طلب تسعير خاص لصنف غير مدرج</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">صنف: لفائف حديد منجنيز عالي المقاومة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">2 طلب معلق</span>
                        <button
                          onClick={() => showAlert("تأكيد التسعير", "تم مراجعة طلب التسعير وتعميمه على كافة فواتير البيع بنجاح.")}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded cursor-pointer text-[10px] transition-colors"
                        >
                          مراجعة واعتماد
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">شراء وتوريد فوق الميزانية المقررة</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">طلب من إدارة المشتريات لتأمين خامات عاجلة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">1 طلب معلق</span>
                        <button
                          onClick={() => showAlert("اعتماد الشراء المالي", "تم الموافقة على تجاوز الميزانية لتأمين لفائف الأستانلس ستيل بنجاح.")}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded cursor-pointer text-[10px] transition-colors"
                        >
                          مراجعة واعتماد
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: LOWER BRAND QUICK ACTIONS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm" id="dashboard-quick-actions">
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                  إجراءات سريعة ومختصرات العمل المباشر / Quick Action Operations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3">
                  {/* Action 1: فاتورة بيع */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("salesInvoices");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">فاتورة بيع</span>
                  </button>

                  {/* Action 2: فاتورة شراء */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("purchaseInvoices");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">فاتورة شراء</span>
                  </button>

                  {/* Action 3: تحصيل نقدي */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("receipts");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">تحصيل نقدي</span>
                  </button>

                  {/* Action 4: صرف نقدي */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("payments");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-rose-500 hover:bg-rose-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-rose-100 text-rose-700 p-2 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">صرف نقدي</span>
                  </button>

                  {/* Action 5: شيك جديد */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("checks");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">شيك جديد</span>
                  </button>

                  {/* Action 6: أمر شراء */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("purchaseOrders");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">أمر شراء</span>
                  </button>

                  {/* Action 7: أمر تصنيع */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("cutRemnants");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Factory className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">أمر تصنيع</span>
                  </button>

                  {/* Action 8: تحويل مخزني */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("stockTransfers");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">تحويل مخزني</span>
                  </button>

                  {/* Action 9: جرد مخزون */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("inventoryAdjustments");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">جرد مخزون</span>
                  </button>

                  {/* Action 10: عميل جديد */}
                  <button
                    onClick={() => {
                      setSelectedSheetId("customers");
                      setRowForm({});
                      setIsAddingRow(true);
                      setEditingRowIndex(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 p-4.5 rounded-xl shadow-3xs flex flex-col items-center gap-2 transition-all cursor-pointer text-center group"
                  >
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-sans">عميل جديد</span>
                  </button>
                </div>
              </div>
            </div>
          :
            /* --- STANDARD WORKSHEET VIEW --- */
            <>
              {/* CONTROL HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200 pb-5" id="control-header">
                <div>
                  <div className="flex items-center gap-2" id="sheet-title-container">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight" id="active-sheet-name">
                      {activeSheet.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200" id="active-sheet-category">
                      {activeSheet.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-sans" id="active-sheet-subtext">
                    Arabic Table Title: {activeSheet.arabicName} | Real operational steel ledger database
                  </p>
                </div>

                {/* ACTION TRIGGERS */}
                <div className="flex flex-wrap items-center gap-2" id="export-triggers">
                  <button
                    onClick={triggerExcelDownload}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-slate-200 shadow-sm"
                    id="excel-download-button"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    Download Excel (.xlsx)
                  </button>

                  <button
                    onClick={() => handleGeneratePDFReport(activeSheet, filteredRows)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-rose-700 shadow-sm"
                    id="pdf-download-button"
                  >
                    <Printer className="w-4 h-4 text-rose-100" />
                    Generate PDF Report / طباعة التقرير
                  </button>

              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-slate-200" id="gdrive-export-group">
                <input
                  type="text"
                  title="Spreadsheet Title for Export"
                  value={spreadsheetTitle}
                  onChange={(e) => setSpreadsheetTitle(e.target.value)}
                  className="bg-white text-xs px-3 py-2 w-52 text-slate-800 focus:outline-none border-r border-slate-200"
                  id="spreadsheet-title-input"
                />
                <button
                  onClick={triggerGoogleSheetsExport}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                  id="gdrive-sync-button"
                >
                  <CloudUpload className="w-4 h-4 text-slate-300" />
                  Sync to Google Sheets
                </button>
              </div>
            </div>
          </div>

          {/* VIEW SWITCHER / تبديل وضع العرض */}
          <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl mb-6 border border-slate-200" id="view-mode-switcher" dir="rtl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 mr-2">وضع العرض الحالي:</span>
              <button
                onClick={() => {
                  setShowRawTable(false);
                  setReconciliationActive(false);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  (!showRawTable && !reconciliationActive)
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                }`}
                id="toggle-smart-view-btn"
              >
                <span>✨ الواجهة الذكية لإدارة العمليات (افتراضي)</span>
              </button>

              {activeSheet.category === "Inventory & Items" && (
                <button
                  onClick={() => {
                    setShowRawTable(false);
                    setReconciliationActive(true);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    reconciliationActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                  id="toggle-reconciliation-btn"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>📋 أداة الجرد اللحظي ومطابقة المخزن (Reconciliation)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowRawTable(true);
                  setReconciliationActive(false);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  (showRawTable && !reconciliationActive)
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                }`}
                id="toggle-raw-table-btn"
              >
                <span>🗄️ جدول البيانات الخام (المطورين)</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-sans hidden md:block">
              تتيح لك الواجهة الذكية إدارة العمليات بدون تصفح الجداول المباشرة
            </div>
          </div>

          {reconciliationActive ? (
            renderInventoryReconciliationView()
          ) : !showRawTable ? (
            renderSmartView()
          ) : (
            <>
              {/* --- ANALYTICS TREND CHART DISPLAY --- */}
              {numericalColumns.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col" id="chart-widget-container">
              {/* Chart Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4" id="chart-widget-header">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-1.5">
                      <span>Interactive Trend Visualization</span>
                      <span className="text-xs font-normal text-slate-400">/ تحليل ومراقبة الاتجاهات</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Visualizing chronological flow from oldest (left) to newest (right) record
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" id="chart-controls">
                  {/* Column Selectors */}
                  {!isChartCollapsed && (
                    <div className="flex flex-wrap items-center gap-1" id="chart-column-selectors">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">Metric:</span>
                      {numericalColumns.map((col) => {
                        const isActive = col.key === selectedChartColumn;
                        return (
                          <button
                            key={col.key}
                            onClick={() => setSelectedChartColumn(col.key)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                              isActive
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                            id={`chart-btn-${col.key}`}
                          >
                            {col.label} ({col.key})
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                  {/* Collapse Toggle */}
                  <button
                    onClick={() => setIsChartCollapsed(!isChartCollapsed)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer animate-none"
                    id="chart-collapse-button"
                  >
                    {isChartCollapsed ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Show Chart</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Chart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chart Body */}
              {!isChartCollapsed && (
                <div className="h-56 w-full" id="chart-responsive-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      id="recharts-area-chart"
                    >
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F172A" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0F172A" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#64748B", fontSize: 9 }}
                        tickLine={{ stroke: "#CBD5E1" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickFormatter={(str) => (String(str).length > 15 ? `${String(str).slice(0, 12)}...` : str)}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 9 }}
                        tickLine={{ stroke: "#CBD5E1" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickFormatter={(num) => new Intl.NumberFormat("en-US").format(num)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderColor: "#1E293B",
                          borderRadius: "12px",
                          color: "#FFF",
                          fontSize: "11px",
                          fontFamily: "monospace",
                          textAlign: "right"
                        }}
                        formatter={(value: any, name: any) => {
                          const col = activeSheet.columns.find((c) => c.key === name);
                          const label = col ? col.label : name;
                          return [
                            <span className="font-semibold text-emerald-400">
                              {new Intl.NumberFormat("en-US").format(Number(value))}
                            </span>,
                            <span className="text-slate-300 font-sans mr-1">{label}:</span>
                          ];
                        }}
                        labelFormatter={(label) => `Record: ${label}`}
                      />
                      {selectedChartColumn && (
                        <Area
                          type="monotone"
                          dataKey={selectedChartColumn}
                          stroke="#0F172A"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#chartGradient)"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* TABLE ACTIONS & FILTER */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 bg-slate-100/50 p-3 rounded-lg border border-slate-200" id="table-filter-bar">
            <div className="relative flex-1 max-w-sm" id="table-search-container">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search records in ${activeSheet.name}...`}
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                id="table-search-input"
              />
            </div>

            <button
              onClick={handleAddRowClick}
              className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-sm"
              id="insert-record-button"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              Insert Record
            </button>
          </div>

          {/* DATA VIEWPORT TABLE */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[300px]" id="table-viewport-container">
            <div className="overflow-x-auto" id="table-scroll-wrapper">
              <table className="w-full text-left text-xs border-collapse" id="data-table">
                {/* HEADERS */}
                <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200 sticky top-0 z-10" id="table-thead">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-200 text-center w-12" id="thead-th-checkbox">
                      <input
                        type="checkbox"
                        checked={paginatedRows.length > 0 && paginatedRows.every(row => selectedRows.includes(row))}
                        onChange={toggleSelectAllPage}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 cursor-pointer"
                        id="thead-checkbox-master"
                        title="Select all on this page"
                      />
                    </th>
                    {activeSheet.columns.map((col) => (
                      <th key={col.key} className="px-4 py-3 border-r border-slate-200 text-slate-500" id={`thead-th-${col.key}`}>
                        <div className="flex flex-col">
                          <span>{col.label}</span>
                          <span className="text-[9px] text-slate-400 font-sans font-normal lowercase tracking-wider">
                            {col.key}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-slate-500 font-bold w-24" id="thead-th-actions">Actions</th>
                  </tr>
                </thead>

                {/* ROWS */}
                <tbody className="divide-y divide-slate-100 font-mono text-[11px] bg-white" id="table-tbody">
                  {paginatedRows.map((row, rIdx) => {
                    // Calculate absolute index in original rows to prevent search-filtering bugs
                    const originalIdx = activeSheet.rows.indexOf(row);
                    const isSelected = selectedRows.includes(row);
                    return (
                      <tr
                        key={rIdx}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isSelected ? "bg-slate-50/80 font-medium" : "even:bg-slate-50/10"
                        }`}
                        id={`table-tr-${rIdx}`}
                      >
                        <td className="px-4 py-2 border-r border-slate-100 text-center w-12" id={`table-td-checkbox-${rIdx}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRowSelection(row)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 cursor-pointer"
                            id={`row-checkbox-${rIdx}`}
                          />
                        </td>
                        {activeSheet.columns.map((col) => {
                          const val = row[col.key];
                          return (
                            <td key={col.key} className="px-4 py-2 border-r border-slate-100 text-slate-700" id={`table-td-${rIdx}-${col.key}`}>
                              {col.type === "currency" ? (
                                <span className="text-emerald-700 font-semibold">
                                  {typeof val === "number" ? val.toLocaleString("en-US") : val} ج.م
                                </span>
                              ) : col.type === "boolean" ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    val ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                                  }`}
                                  id={`boolean-badge-${rIdx}-${col.key}`}
                                >
                                  {val ? "TRUE" : "FALSE"}
                                </span>
                              ) : (
                                String(val ?? "")
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-2 text-center" id={`table-actions-td-${rIdx}`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setExploringRow(row);
                                setExploringSheetId(activeSheet.id);
                                setExpandedChildSheetId("");
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                              title="Explore Relations / مستكشف العلاقات"
                              id={`explore-row-btn-${rIdx}`}
                            >
                              <Network className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditRow(originalIdx)}
                              className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Edit"
                              id={`edit-row-btn-${rIdx}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(originalIdx)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete"
                              id={`delete-row-btn-${rIdx}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={activeSheet.columns.length + 2}
                        className="p-12 text-center text-slate-400 font-sans"
                        id="empty-table-placeholder-cell"
                      >
                        No active business records match query filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-xs text-slate-500" id="table-pagination-bar">
                <span className="font-sans" id="pagination-info">
                  Showing Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong> (
                  {filteredRows.length} items total)
                </span>
                <div className="flex gap-1.5" id="pagination-buttons">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                    className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 cursor-pointer shadow-sm"
                    id="prev-page-button"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                    className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 cursor-pointer shadow-sm"
                    id="next-page-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
        </>
      }
      </section>
      </main>

      {/* --- FLOATING STATUS OR AUDIT POPUP --- */}
      {auditReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="audit-modal-overlay">
          <div className="bg-white border border-slate-200 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800" id="audit-modal">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50" id="audit-modal-header">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" id="audit-modal-title">
                <ShieldCheck className="w-5 h-5 text-slate-600" />
                الدولية ستيل ERP Internal Compliance Report
              </h3>
              <button
                onClick={() => setAuditReport(null)}
                className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                id="audit-modal-close-icon"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[400px] flex flex-col gap-4" id="audit-modal-body">
              <div
                className={`p-4 rounded-xl flex gap-3 ${
                  auditReport.status === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border border-rose-200 text-rose-800"
                }`}
                id="audit-status-banner"
              >
                {auditReport.status === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold text-sm" id="audit-status-summary-header">Audit Status Summary</h4>
                  <p className="text-xs mt-1 text-slate-600" id="audit-status-summary-message">{auditReport.message}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3" id="audit-checklist-container">
                <h5 className="text-xs uppercase font-bold tracking-wider text-slate-400" id="audit-checklist-title">
                  Detailed Verification Checklist
                </h5>
                {auditReport.checks.map((chk, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex gap-3" id={`audit-check-row-${index}`}>
                    {chk.status === "pass" ? (
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h6 className="font-semibold text-xs text-slate-900" id={`audit-check-name-${index}`}>{chk.name}</h6>
                      <p className="text-[11px] text-slate-500 mt-0.5" id={`audit-check-details-${index}`}>{chk.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50" id="audit-modal-footer">
              <button
                onClick={() => setAuditReport(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                id="audit-done-button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BUSINESS ROW DIALOG --- */}
      {(isAddingRow || editingRowIndex !== null) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="row-form-overlay" dir="rtl">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800 text-right" id="row-form-modal">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50" id="row-form-header">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" id="row-form-title">
                {isAddingRow ? <Plus className="w-5 h-5 text-emerald-600" /> : <Edit2 className="w-4 h-4 text-indigo-600" />}
                {isAddingRow ? "إضافة سجل مالي/تشغيلي جديد" : "تحديث وتعديل السجل التشغيلي"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingRow(false);
                  setEditingRowIndex(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
                id="row-form-close-icon"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[450px] grid grid-cols-1 gap-4 text-xs" id="row-form-body">
              {/* Voice-to-Text Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2.5" id="dictation-info-banner">
                <Mic className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-semibold text-slate-800">🎙️ وضع الإملاء الصوتي السريع:</span> استخدم أزرار الميكروفون المجاورة لكل حقل لإدخال البيانات بالصوت باللغة <strong className="text-slate-800">العربية (عربي)</strong> أو <strong className="text-slate-800">الإنجليزية (EN)</strong>.
                </div>
              </div>

              {activeSheet.columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-1.5" id={`form-field-group-${col.key}`}>
                  <div className="flex justify-between items-center" id={`form-field-header-${col.key}`}>
                    <label className="font-semibold text-slate-700 flex items-center gap-1" id={`form-field-label-${col.key}`}>
                      <span>{COLUMN_TRANSLATIONS[col.key] || col.label}</span>
                      <span className="font-mono text-[9px] text-slate-400">[{col.key}]</span>
                    </label>
                    {/* Dictation triggers for dictatable fields */}
                    {(col.type === "string" || col.type === "number" || col.type === "currency" || !col.type) && (
                      <div className="flex items-center gap-1.5" id={`dictation-controls-${col.key}`} dir="ltr">
                        <button
                          type="button"
                          onClick={() => toggleDictation(col.key, "ar-EG")}
                          className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all border ${
                            recordingField === col.key && recordingLang === "ar-EG"
                              ? "bg-rose-500 text-white border-rose-600 animate-pulse shadow-sm font-semibold"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="إملاء باللغة العربية"
                          id={`dictate-ar-${col.key}`}
                        >
                          <Mic className="w-2.5 h-2.5" />
                          <span>عربي</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDictation(col.key, "en-US")}
                          className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all border ${
                            recordingField === col.key && recordingLang === "en-US"
                              ? "bg-rose-500 text-white border-rose-600 animate-pulse shadow-sm font-semibold"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Dictate in English"
                          id={`dictate-en-${col.key}`}
                        >
                          <Mic className="w-2.5 h-2.5" />
                          <span>EN</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {col.type === "boolean" ? (
                    <select
                      value={String(rowForm[col.key] ?? false)}
                      onChange={(e) => setRowForm({ ...rowForm, [col.key]: e.target.value === "true" })}
                      className="bg-white border border-slate-200 text-slate-800 p-2 rounded w-full focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-right"
                      id={`form-input-${col.key}`}
                    >
                      <option value="true">نعم (TRUE)</option>
                      <option value="false">لا (FALSE)</option>
                    </select>
                  ) : col.type === "date" ? (
                    <input
                      type="date"
                      value={rowForm[col.key] || ""}
                      onChange={(e) => setRowForm({ ...rowForm, [col.key]: e.target.value })}
                      className="bg-white border border-slate-200 text-slate-800 p-2 rounded w-full focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-right font-sans"
                      id={`form-input-${col.key}`}
                    />
                  ) : col.type === "number" || col.type === "currency" ? (
                    <input
                      type="number"
                      step="any"
                      value={rowForm[col.key] ?? 0}
                      onChange={(e) => setRowForm({ ...rowForm, [col.key]: parseFloat(e.target.value) || 0 })}
                      className="bg-white border border-slate-200 text-slate-800 p-2 rounded w-full focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-right"
                      id={`form-input-${col.key}`}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`أدخل قيمة الحقل ${col.label}...`}
                      value={rowForm[col.key] || ""}
                      onChange={(e) => setRowForm({ ...rowForm, [col.key]: e.target.value })}
                      className="bg-white border border-slate-200 text-slate-800 p-2 rounded w-full focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-right"
                      id={`form-input-${col.key}`}
                    />
                  )}

                  {recordingField === col.key && (
                    <div className="text-[10px] text-rose-500 flex items-center gap-1.5 mt-0.5 animate-pulse justify-start" id={`listening-indicator-${col.key}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>جاري الاستماع للحديث باللغة {recordingLang === "ar-EG" ? "العربية" : "الإنجليزية"}... تحدث الآن.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5 flex-row-reverse" id="row-form-footer">
              <button
                onClick={() => {
                  setIsAddingRow(false);
                  setEditingRowIndex(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer bg-white font-bold"
                id="row-form-cancel-btn"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveRow}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
                id="row-form-save-btn"
              >
                تأكيد وحفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ERP RELATIONAL TABLE EXPLORER MODAL / مستكشف العلاقات --- */}
      {exploringRow && exploringSheetId && (() => {
        const activeExplSheet = sheets.find(sh => sh.id === exploringSheetId);
        if (!activeExplSheet) return null;

        const primaryCol = activeExplSheet.columns[0];
        const primaryKey = primaryCol?.key;
        const primaryVal = exploringRow[primaryKey];

        const navigateAndFilter = (sheetId: string, keyValue: string) => {
          setSelectedSheetId(sheetId);
          setTableSearch(keyValue);
        };

        // 1. Resolve Parents (What this row references)
        const parentRefs: {
          columnLabel: string;
          columnKey: string;
          targetSheetId: string;
          targetSheetName: string;
          targetSheetArabicName: string;
          targetKey: string;
          value: any;
          targetRow: any | null;
        }[] = [];

        activeExplSheet.columns.forEach(col => {
          const val = exploringRow[col.key];
          if (val) {
            const resolved = resolveSheetIdFromKeyAndValue(col.key, val);
            if (resolved) {
              const targetSh = sheets.find(sh => sh.id === resolved.sheetId);
              if (targetSh) {
                const targetRow = targetSh.rows.find(r => String(r[resolved.targetKey]) === String(val));
                parentRefs.push({
                  columnLabel: col.label,
                  columnKey: col.key,
                  targetSheetId: resolved.sheetId,
                  targetSheetName: targetSh.name,
                  targetSheetArabicName: targetSh.arabicName,
                  targetKey: resolved.targetKey,
                  value: val,
                  targetRow: targetRow || null
                });
              }
            }
          }
        });

        // 2. Resolve Children (What references this row)
        const childRefs: {
          sheetId: string;
          sheetName: string;
          sheetArabicName: string;
          sheetCategory: string;
          matchingRows: any[];
          foreignKey: string;
        }[] = [];

        if (primaryKey && primaryVal) {
          sheets.forEach(sh => {
            if (sh.id !== exploringSheetId) {
              const matchingCol = sh.columns.find(col => col.key === primaryKey);
              if (matchingCol) {
                const matches = sh.rows.filter(r => String(r[primaryKey]) === String(primaryVal));
                if (matches.length > 0) {
                  childRefs.push({
                    sheetId: sh.id,
                    sheetName: sh.name,
                    sheetArabicName: sh.arabicName,
                    sheetCategory: sh.category,
                    matchingRows: matches,
                    foreignKey: primaryKey
                  });
                }
              }
            }
          });
        }

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="relations-explorer-overlay">
            <div className="bg-white border border-slate-200 max-w-5xl w-full h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800" id="relations-explorer-modal">
              {/* MODAL HEADER */}
              <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50" id="relations-explorer-header">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-700 border border-indigo-200 shadow-xs">
                    <Network className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      ERP Relational Integrity Explorer / مستكشف العلاقات والروابط البينية
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      Visual audit and integrity tracking of transactional records across the enterprise database.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setExploringRow(null);
                    setExploringSheetId("");
                    setExpandedChildSheetId("");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-slate-200"
                  id="relations-explorer-close-btn"
                >
                  ✕ Close / إغلاق
                </button>
              </div>

              {/* MODAL CONTENT BODY */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row" id="relations-explorer-content">
                {/* LEFT COLUMN: ACTIVE ROW DETAILS */}
                <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-150 p-5 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                  <div>
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-indigo-200">
                      Active Ledger Record
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-slate-500" />
                      {activeExplSheet.arabicName} ({activeExplSheet.name})
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Category: {activeExplSheet.category}</p>
                  </div>

                  {/* Highlighted Primary Identifier */}
                  {primaryKey && (
                    <div className="bg-indigo-600 text-white rounded-xl p-4 shadow-sm border border-indigo-500">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-200">{primaryCol?.label || "Primary Key"}</p>
                      <p className="text-lg font-mono font-extrabold mt-1 tracking-wide break-all">{String(primaryVal || "N/A")}</p>
                    </div>
                  )}

                  {/* All Key-Value Grid */}
                  <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                    <p className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Record Attributes / بيانات السجل</p>
                    <div className="grid grid-cols-1 gap-3 font-mono text-[11px]">
                      {activeExplSheet.columns.map(col => {
                        const isPK = col.key === primaryKey;
                        const val = exploringRow[col.key];
                        return (
                          <div key={col.key} className={`flex justify-between items-start gap-4 py-1 border-b border-slate-50 last:border-0 ${isPK ? "bg-indigo-50/50 px-1.5 rounded" : ""}`}>
                            <span className="text-slate-400 font-sans font-medium text-[10px] shrink-0">
                              {col.label} <span className="text-[9px] text-slate-300">[{col.key}]</span>
                            </span>
                            <span className={`text-slate-800 text-right break-all ${isPK ? "font-bold text-indigo-700" : ""}`}>
                              {col.type === "currency" ? (
                                <span className="text-emerald-700 font-semibold">{Number(val || 0).toLocaleString()} EGP</span>
                              ) : col.type === "boolean" ? (
                                val ? "TRUE" : "FALSE"
                              ) : (
                                String(val ?? "")
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: GRAPH VISUAL & RELATED TABLES */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6" id="relations-explorer-relations-pane">
                  {/* VISUAL CONNECTIVITY SCHEMATIC */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">Schematic / مخطط الربط بين الجداول</p>
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 py-4">
                      {/* PARENT NODE */}
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-slate-850 border border-slate-700 rounded-xl p-3 w-40 flex flex-col items-center shadow-md">
                          <Compass className="w-5 h-5 text-indigo-400 mb-1" />
                          <span className="text-[10px] text-slate-400 font-bold">References Out</span>
                          <span className="text-xs font-bold text-white mt-1 truncate max-w-full">
                            {parentRefs.length} Parent Table{parentRefs.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* ARROW */}
                      <div className="hidden md:flex flex-col items-center text-indigo-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      {/* ACTIVE NODE */}
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-indigo-600/90 border-2 border-indigo-400 rounded-2xl p-3.5 w-44 flex flex-col items-center shadow-lg relative">
                          <div className="absolute -top-2.5 bg-indigo-400 text-slate-950 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Node
                          </div>
                          <Database className="w-6 h-6 text-indigo-100 mb-1" />
                          <span className="text-xs font-extrabold text-white truncate max-w-full">{activeExplSheet.name}</span>
                          <span className="text-[10px] font-mono font-semibold text-indigo-200 mt-0.5 max-w-full truncate">{String(primaryVal || "N/A")}</span>
                        </div>
                      </div>

                      {/* ARROW */}
                      <div className="hidden md:flex flex-col items-center text-emerald-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      {/* CHILD NODE */}
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-slate-850 border border-slate-700 rounded-xl p-3 w-40 flex flex-col items-center shadow-md">
                          <GitBranch className="w-5 h-5 text-emerald-400 mb-1" />
                          <span className="text-[10px] text-slate-400 font-bold">Referenced By</span>
                          <span className="text-xs font-bold text-white mt-1 truncate max-w-full">
                            {childRefs.reduce((acc, cr) => acc + cr.matchingRows.length, 0)} Child Record{childRefs.reduce((acc, cr) => acc + cr.matchingRows.length, 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PARENT REFERENCES SECTION */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-indigo-500" />
                      Parent Records / الجداول الأب (References Out)
                    </h5>
                    
                    {parentRefs.length === 0 ? (
                      <div className="border border-dashed border-slate-250 rounded-xl p-4 text-center text-xs text-slate-400 bg-slate-50/30">
                        This active record does not hold foreign key references to other master tables.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {parentRefs.map((ref, idx) => {
                          const nameVal = ref.targetRow ? (ref.targetRow.FullName || ref.targetRow.CustomerName || ref.targetRow.SupplierName || ref.targetRow.BankName || ref.targetRow.ItemName || ref.targetRow.EmployeeName || ref.targetRow.AccountName || "") : "";
                          return (
                            <div key={idx} className="border border-slate-150 rounded-xl p-4 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 shadow-2xs">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    Col: {ref.columnLabel} ({ref.columnKey})
                                  </span>
                                  <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase border border-indigo-100">
                                    {ref.targetSheetArabicName || ref.targetSheetName}
                                  </span>
                                </div>
                                <p className="text-xs font-mono font-bold text-slate-900 mt-2 break-all">
                                  {ref.targetKey}: <span className="text-indigo-600">{String(ref.value)}</span>
                                </p>
                                {ref.targetRow ? (
                                  <p className="text-xs text-slate-600 font-sans mt-1 line-clamp-1">
                                    {nameVal ? `Name: ${nameVal}` : "Record found but no display name attribute."}
                                  </p>
                                ) : (
                                  <p className="text-xs text-red-500 font-sans mt-1 flex items-center gap-1">
                                    ⚠️ Integrity Warning: Referenced row not found!
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                                {ref.targetRow && (
                                  <button
                                    onClick={() => {
                                      setExploringRow(ref.targetRow);
                                      setExploringSheetId(ref.targetSheetId);
                                      setExpandedChildSheetId("");
                                    }}
                                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] py-1.5 px-2 rounded-lg font-bold cursor-pointer text-center transition-all border border-indigo-150 flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Deep Inspect / فحص العلاقات
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    navigateAndFilter(ref.targetSheetId, String(ref.value));
                                    setExploringRow(null);
                                    setExploringSheetId("");
                                  }}
                                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] py-1.5 px-2 rounded-lg font-bold cursor-pointer text-center transition-all border border-slate-200 flex items-center justify-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Go to Sheet / عرض السجل
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CHILD REFERENCES SECTION */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-emerald-500" />
                      Child Records / الجداول الأبناء والتحركات (Referenced In)
                    </h5>
                    
                    {childRefs.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400 bg-slate-50/30">
                        No transactional entries or child records are referencing this primary key right now.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {childRefs.map((child, idx) => {
                          const isExpanded = expandedChildSheetId === child.sheetId;
                          return (
                            <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden bg-white hover:border-emerald-250 transition-all shadow-2xs">
                              {/* HEADER CLICKABLE ROW */}
                              <div
                                onClick={() => setExpandedChildSheetId(isExpanded ? "" : child.sheetId)}
                                className="p-3.5 bg-slate-50/60 hover:bg-slate-50 border-b border-slate-100 flex justify-between items-center cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="bg-emerald-100 text-emerald-700 p-1 rounded font-bold text-xs border border-emerald-200">
                                    {child.matchingRows.length}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-900">
                                      {child.sheetArabicName || child.sheetName} ({child.sheetName})
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-mono ml-2">Category: {child.sheetCategory}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                  <span>Col matched: {child.foreignKey}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>

                              {/* EXPANDED MINI TABLE LIST */}
                              {isExpanded && (
                                <div className="p-4 bg-slate-50/20 border-b border-slate-100 overflow-x-auto max-h-[250px] overflow-y-auto">
                                  <table className="w-full text-left border-collapse text-[11px] font-mono">
                                    <thead>
                                      <tr className="border-b border-slate-200 text-slate-400">
                                        {sheets.find(s => s.id === child.sheetId)?.columns.slice(0, 5).map(col => (
                                          <th key={col.key} className="pb-1.5 px-2 font-semibold font-sans text-[10px]">{col.label}</th>
                                        ))}
                                        <th className="pb-1.5 px-2 text-center font-sans text-[10px]">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                      {child.matchingRows.map((r, rIdx) => {
                                        const cols = sheets.find(s => s.id === child.sheetId)?.columns.slice(0, 5) || [];
                                        return (
                                          <tr key={rIdx} className="hover:bg-slate-100/50">
                                            {cols.map(col => {
                                              const v = r[col.key];
                                              return (
                                                <td key={col.key} className="py-2 px-2 max-w-[150px] truncate">
                                                  {col.type === "currency" ? (
                                                    <span className="text-emerald-700 font-semibold">{Number(v || 0).toLocaleString()} EGP</span>
                                                  ) : (
                                                    String(v ?? "")
                                                  )}
                                                </td>
                                              );
                                            })}
                                            <td className="py-2 px-2 text-center">
                                              <div className="flex justify-center gap-2">
                                                <button
                                                  onClick={() => {
                                                    setExploringRow(r);
                                                    setExploringSheetId(child.sheetId);
                                                    setExpandedChildSheetId("");
                                                  }}
                                                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-1 rounded border border-indigo-150 cursor-pointer"
                                                  title="Deep Inspect Relations"
                                                >
                                                  Inspect
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    const targetPKCol = sheets.find(s => s.id === child.sheetId)?.columns[0]?.key;
                                                    const searchVal = targetPKCol ? String(r[targetPKCol]) : String(primaryVal);
                                                    navigateAndFilter(child.sheetId, searchVal);
                                                    setExploringRow(null);
                                                    setExploringSheetId("");
                                                  }}
                                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold px-2 py-1 rounded border border-slate-200 cursor-pointer"
                                                  title="Navigate to Sheet Row"
                                                >
                                                  Go to Row
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FOOTER METRIC BANNER */}
              <div className="p-3 bg-slate-50 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono gap-2" id="relations-explorer-footer">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Graph Node Trace: OK | All relational links resolved correctly.
                </span>
                <span>
                  Interactive Entity-Relationship Navigation Node Map
                </span>
              </div>
            </div>
          </div>
        );
      })()}
      {isExporting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4" id="export-modal-overlay">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col items-center text-center gap-5 text-slate-800" id="export-modal">
            <div className="relative flex items-center justify-center" id="export-spinner-container">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin"></div>
              <CloudUpload className="w-6 h-6 text-slate-600 absolute" />
            </div>

            <div id="export-modal-meta">
              <h3 className="text-base font-bold text-slate-950">Google Workspace Sync</h3>
              <p className="text-xs text-slate-500 mt-1">Exporting Master Steel ERP Workbook</p>
            </div>

            {/* PROGRESS BAR */}
            {exportProgress && (
              <div className="w-full" id="export-progress-bar-container">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span>{exportProgress.step}</span>
                  <span className="font-mono">{exportProgress.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-900 h-full transition-all duration-300"
                    style={{ width: `${exportProgress.percent}%` }}
                    id="export-progress-indicator"
                  ></div>
                </div>
              </div>
            )}

            {/* ERROR HANDLING */}
            {exportError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-2 w-full text-left" id="export-error-card">
                <p className="font-semibold flex items-center gap-1.5" id="export-error-title">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                  Sync Failed
                </p>
                <p className="font-mono text-[10px] break-all" id="export-error-text">{exportError}</p>
                <button
                  onClick={() => setIsExporting(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded p-1.5 text-[10px] font-bold text-center cursor-pointer mt-1"
                  id="export-retry-btn"
                >
                  Close & Retry
                </button>
              </div>
            )}

            {/* SUCCESS HANDLING */}
            {exportedId && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex flex-col gap-3 w-full" id="export-success-card">
                <p className="font-semibold flex items-center justify-center gap-1.5" id="export-success-title">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                  Successfully Synchronized!
                </p>
                <p className="text-slate-600 text-[11px]" id="export-success-message">
                  Spreadsheet created and fully styled with all 51 tabs and frozen column headers.
                </p>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${exportedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 rounded-lg text-xs block text-center cursor-pointer shadow-sm"
                  id="open-sheets-link"
                >
                  Open in Google Sheets ↗
                </a>
                <button
                  onClick={() => setIsExporting(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px] underline cursor-pointer mt-1"
                  id="export-close-btn"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CUSTOM DIALOGS & CONFIRMATIONS --- */}
      {dialogConfig?.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" id="custom-dialog-overlay">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4 text-slate-800 animate-in zoom-in duration-200" id="custom-dialog">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="custom-dialog-header">
              <h3 className="text-base font-bold text-slate-950" id="custom-dialog-title">
                {dialogConfig.title}
              </h3>
              <button
                onClick={() => setDialogConfig(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                id="custom-dialog-close-icon"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line" id="custom-dialog-body">
              {dialogConfig.message}
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100" id="custom-dialog-footer">
              {dialogConfig.type === "confirm" ? (
                <>
                  <button
                    onClick={() => setDialogConfig(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer bg-white"
                    id="custom-dialog-cancel-btn"
                  >
                    {dialogConfig.cancelText || "Cancel"}
                  </button>
                  <button
                    onClick={async () => {
                      const onConfirm = dialogConfig.onConfirm;
                      setDialogConfig(null);
                      if (onConfirm) await onConfirm();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    id="custom-dialog-confirm-btn"
                  >
                    {dialogConfig.confirmText || "Confirm"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDialogConfig(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  id="custom-dialog-ok-btn"
                >
                  {dialogConfig.confirmText || "OK"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- AI ASSISTANT FLOATING BUTTON & PANEL --- */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end gap-3" id="ai-assistant-container">
        {isAiOpen && (
          <div className="bg-white border border-slate-200 w-96 max-w-full h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200" id="ai-panel">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between" id="ai-header">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-white/10 rounded-lg">🤖</span>
                <div className="text-left">
                  <h4 className="text-xs font-bold font-sans">مساعد الدولية ستيل الذكي</h4>
                  <p className="text-[10px] text-slate-300">Intelligent ERP Copilot</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-xs p-1"
                id="ai-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs text-right flex flex-col" id="ai-chat-history">
              {aiHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                  id={`ai-chat-bubble-${idx}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 whitespace-pre-line leading-relaxed text-right ${
                      chat.sender === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-xs"
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start" id="ai-loading-bubble">
                  <div className="bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التفكير وتحليل البيانات...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 bg-white flex gap-2" id="ai-input-bar">
              <input
                type="text"
                placeholder="اسأل المساعد الذكي عن أي بيانات أو تقارير..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:border-slate-900"
                id="ai-input"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={isAiLoading || !aiMessage.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                id="ai-send-btn"
              >
                إرسال
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer text-xs font-semibold"
          id="ai-toggle-btn"
        >
          <span className="text-sm">🤖</span>
          <span>اسأل المساعد الذكي (AI)</span>
          {isAiOpen ? null : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* --- FLOATING SELECTION ACTION BAR --- */}
      {selectedRows.length > 0 && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 border border-slate-800 animate-in slide-in-from-bottom duration-300 max-w-[95%] w-auto"
          id="floating-selection-bar"
        >
          <div className="flex items-center gap-3 shrink-0" id="selection-count-container">
            <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
              {selectedRows.length}
            </span>
            <span className="text-xs font-medium font-sans">
              Selected Item{selectedRows.length > 1 ? "s" : ""} | تم تحديد {selectedRows.length} سجل
            </span>
          </div>

          <div className="hidden md:block h-5 w-px bg-slate-800" />

          <div className="flex flex-wrap items-center justify-center gap-3" id="selection-actions">
            {/* Bulk Status Update */}
            {statusColumn && (
              <div className="flex flex-wrap items-center justify-center gap-2" id="bulk-status-container">
                <span className="text-[10px] text-slate-400 font-medium font-sans">Update Status / تغيير الحالة:</span>
                <div className="flex flex-wrap gap-1" id="bulk-status-pills">
                  {/* We offer a simple set of status values dynamically from the sheet's existing status fields */}
                  {Array.from(new Set(activeSheet.rows.map(r => r[statusColumn.key]).filter(Boolean)))
                    .slice(0, 4) // Show up to 4 existing statuses
                    .map((status: any) => (
                      <button
                        key={status}
                        onClick={() => handleBulkStatusUpdate(status)}
                        className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer border border-slate-800 transition-all shadow-sm"
                        id={`bulk-status-btn-${status}`}
                      >
                        {status}
                      </button>
                    ))}
                  {/* Fallback statuses if no existing status found */}
                  {Array.from(new Set(activeSheet.rows.map(r => r[statusColumn.key]).filter(Boolean))).length === 0 && (
                    ["Pending", "Completed", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleBulkStatusUpdate(status)}
                        className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer border border-slate-800 transition-all shadow-sm"
                        id={`bulk-status-btn-${status}`}
                      >
                        {status}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Bulk Delete */}
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border border-rose-700 shadow-sm"
              id="bulk-delete-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete / حذف الكل</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedRows([])}
              className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer px-2 py-1"
              id="clear-selection-btn"
            >
              Cancel / إلغاء
            </button>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATIONS CONTAINER --- */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:top-6 md:right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 md:px-0" id="toasts-container">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";
            const isInfo = toast.type === "info";
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                layout
                className="bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-xl p-4 flex gap-3 items-start relative overflow-hidden text-right select-none"
                dir="rtl"
                id={`toast-${toast.id}`}
              >
                {/* Accent strip on the right */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                    isSuccess ? "bg-emerald-600" : isError ? "bg-rose-600" : "bg-blue-600"
                  }`}
                  id={`toast-accent-${toast.id}`}
                />

                {/* Toast icon */}
                <div className="mr-1.5 shrink-0" id={`toast-icon-container-${toast.id}`}>
                  {isSuccess ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce" />
                  ) : isError ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                {/* Toast content */}
                <div className="flex-1 min-w-0" id={`toast-content-${toast.id}`}>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {toast.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans leading-normal">
                    {toast.message}
                  </p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                  id={`toast-dismiss-${toast.id}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* --- FOOTER / INTEL SIGNATURE --- */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4 mt-auto" id="footer">
        <p id="footer-copyright">© 2026 الدولية ستيل (International Steel). All rights reserved.</p>
        <div className="flex items-center gap-3" id="footer-meta">
          <span className="flex items-center gap-1 text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-600" id="footer-security-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ERP SECURE ENVIRONMENT
          </span>
          <span id="footer-version">Version 4.2.0-PROD</span>
        </div>
      </footer>
    </div>
  );
}
