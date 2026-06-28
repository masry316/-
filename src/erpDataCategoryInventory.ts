import { SheetConfig } from "./types";

export const INVENTORY_ERP_SHEETS: SheetConfig[] = [
  {
    id: "warehouses",
    name: "Warehouses",
    arabicName: "المستودعات والمخازن",
    category: "Inventory & Items",
    columns: [
      { key: "WarehouseCode", label: "Wh Code", type: "string" },
      { key: "WarehouseName", label: "Warehouse Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "Location", label: "Location/City", type: "string" },
      { key: "ManagerID", label: "Manager ID", type: "string" }
    ],
    rows: [
      { WarehouseCode: "W001", WarehouseName: "Cairo Head Warehouse", ArabicName: "مستودع القاهرة الرئيسي - العبور", Location: "El Obour City", ManagerID: "E005" },
      { WarehouseCode: "W002", WarehouseName: "Alexandria Heavy Yard", ArabicName: "ساحة الإسكندرية للمعادن - العامرية", Location: "Amreya, Alex", ManagerID: "E009" },
      { WarehouseCode: "W003", WarehouseName: "Suez Logistics Depot", ArabicName: "مستودع السويس اللوجستي - الأدبية", Location: "Adabiya, Suez", ManagerID: "E006" },
      { WarehouseCode: "W004", WarehouseName: "6th of October Sheets Depot", ArabicName: "مخزن أكتوبر للألواح واللفائف", Location: "6th of October City", ManagerID: "E005" },
      { WarehouseCode: "W005", WarehouseName: "10th of Ramadan Pipes Store", ArabicName: "مستودع العاشر للمواسير والإكسسوارات", Location: "10th of Ramadan City", ManagerID: "E005" },
      { WarehouseCode: "W006", WarehouseName: "Damietta Port Transit Zone", ArabicName: "منطقة ترانزيت ميناء دمياط", Location: "Damietta Port", ManagerID: "E006" },
      { WarehouseCode: "W007", WarehouseName: "Industrial Cut Remnants Store", ArabicName: "مخزن فضلات وقصاصات الإستيل Cairo", Location: "El Obour City", ManagerID: "E005" },
      { WarehouseCode: "W008", WarehouseName: "Showroom Store - Cairo", ArabicName: "مخزن صالة العرض - القاهرة", Location: "Down Town Cairo", ManagerID: "E010" },
      { WarehouseCode: "W009", WarehouseName: "Showroom Store - Alex", ArabicName: "مخزن صالة العرض - الإسكندرية", Location: "Smouha, Alex", ManagerID: "E009" },
      { WarehouseCode: "W010", WarehouseName: "Scrap & Disposed Materials Yard", ArabicName: "ساحة الخردة والمواد التالفة Obour", Location: "El Obour City", ManagerID: "E005" }
    ]
  },
  {
    id: "warehouseLocations",
    name: "WarehouseLocations",
    arabicName: "مواقع التخزين الداخلية",
    category: "Inventory & Items",
    columns: [
      { key: "LocationCode", label: "Location Code", type: "string" },
      { key: "WarehouseCode", label: "Warehouse", type: "string" },
      { key: "Zone", label: "Zone/Aisle", type: "string" },
      { key: "Shelf", label: "Shelf/Rack", type: "string" },
      { key: "Description", label: "Description", type: "string" }
    ],
    rows: [
      { LocationCode: "W001-A1-S1", WarehouseCode: "W001", Zone: "Aisle A1 - Heavy Sheets", Shelf: "Rack S1", Description: "Stainless steel sheets 304 rack" },
      { LocationCode: "W001-A2-S2", WarehouseCode: "W001", Zone: "Aisle A2 - Light Coils", Shelf: "Rack S2", Description: "Coils 2B BA HL 1.5mm to 3.0mm" },
      { LocationCode: "W001-B1-S3", WarehouseCode: "W001", Zone: "Aisle B1 - Seamless Pipes", Shelf: "Rack S3", Description: "Industrial heavy-duty steel pipes" },
      { LocationCode: "W002-Y1-Z1", WarehouseCode: "W002", Zone: "Open Yard Zone 1", Shelf: "Ground Level", Description: "Large-diameter steel pipes & plates" },
      { LocationCode: "W002-Y1-Z2", WarehouseCode: "W002", Zone: "Open Yard Zone 2", Shelf: "Ground Level", Description: "Heavy heavy coils steel grades 316" },
      { LocationCode: "W004-X1-R1", WarehouseCode: "W004", Zone: "Aisle X1", Shelf: "Rack 1", Description: "Sheets 430 grade storage" },
      { LocationCode: "W005-P1-R2", WarehouseCode: "W005", Zone: "Zone Pipes P1", Shelf: "Rack 2", Description: "Threaded and welded fittings" },
      { LocationCode: "W007-REM-01", WarehouseCode: "W007", Zone: "Zone Remnants Cairo", Shelf: "Bins A to F", Description: "Cut remnants and remaining steel pieces" },
      { LocationCode: "W008-SR-01", WarehouseCode: "W008", Zone: "Showroom Front-Row", Shelf: "Display Stands", Description: "Premium finish polished steel sheets" },
      { LocationCode: "W010-SCR-01", WarehouseCode: "W010", Zone: "Scrap Heap Zone", Shelf: "Open Containers", Description: "Disposed remnants and metallic scrap" }
    ]
  },
  {
    id: "units",
    name: "Units",
    arabicName: "وحدات القياس",
    category: "Inventory & Items",
    columns: [
      { key: "UnitCode", label: "Unit Code", type: "string" },
      { key: "UnitName", label: "Unit Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "BaseMultiplier", label: "Base Multiplier", type: "number" },
      { key: "IsBase", label: "Is Base", type: "boolean" }
    ],
    rows: [
      { UnitCode: "KG", UnitName: "Kilogram", ArabicName: "كيلوجرام", BaseMultiplier: 1.0, IsBase: true },
      { UnitCode: "TON", UnitName: "Metric Ton", ArabicName: "طن متري", BaseMultiplier: 1000.0, IsBase: false },
      { UnitCode: "PCS", UnitName: "Piece", ArabicName: "قطعة", BaseMultiplier: 1.0, IsBase: true },
      { UnitCode: "SHT", UnitName: "Sheet", ArabicName: "لوح معدني", BaseMultiplier: 1.0, IsBase: false },
      { UnitCode: "MTR", UnitName: "Meter", ArabicName: "متر طولي", BaseMultiplier: 1.0, IsBase: true },
      { UnitCode: "LEN", UnitName: "6m Length Bar", ArabicName: "طول 6 أمتار", BaseMultiplier: 6.0, IsBase: false },
      { UnitCode: "COIL", UnitName: "Coil Roll", ArabicName: "لفة لفائف كاملة", BaseMultiplier: 5000.0, IsBase: false },
      { UnitCode: "BOX", UnitName: "Box (Fittings)", ArabicName: "صندوق إكسسوارات", BaseMultiplier: 24.0, IsBase: false },
      { UnitCode: "SET", UnitName: "Set", ArabicName: "طقم كامل", BaseMultiplier: 1.0, IsBase: false },
      { UnitCode: "SQM", UnitName: "Square Meter", ArabicName: "متر مربع", BaseMultiplier: 1.0, IsBase: true }
    ]
  },
  {
    id: "itemCategories",
    name: "ItemCategories",
    arabicName: "تصنيفات الأصناف المعتمدة",
    category: "Inventory & Items",
    columns: [
      { key: "CategoryCode", label: "Category Code", type: "string" },
      { key: "CategoryName", label: "Category Name", type: "string" },
      { key: "ArabicName", label: "Arabic Name", type: "string" },
      { key: "ItemType", label: "Item Type", type: "string" },
      { key: "GLAccountCode", label: "GL Revenue Account", type: "string" }
    ],
    rows: [
      { CategoryCode: "SHT-304", CategoryName: "Stainless Steel Sheets - 304", ArabicName: "ألواح ستانلس ستيل 304", ItemType: "Raw Material", GLAccountCode: "4101-01" },
      { CategoryCode: "SHT-316", CategoryName: "Stainless Steel Sheets - 316", ArabicName: "ألواح ستانلس ستيل 316", ItemType: "Raw Material", GLAccountCode: "4101-02" },
      { CategoryCode: "SHT-430", CategoryName: "Stainless Steel Sheets - 430", ArabicName: "ألواح ستانلس ستيل 430", ItemType: "Raw Material", GLAccountCode: "4101-03" },
      { CategoryCode: "COIL-ALL", CategoryName: "Stainless Steel Coils", ArabicName: "لفائف ستانلس ستيل كاملة", ItemType: "Raw Material", GLAccountCode: "4102-01" },
      { CategoryCode: "PIPE-SEAM", CategoryName: "Seamless Steel Pipes", ArabicName: "مواسير ستانلس ستيل بدون لحام", ItemType: "Finished Material", GLAccountCode: "4103-01" },
      { CategoryCode: "TUBE-WELD", CategoryName: "Welded Tubes & Pipes", ArabicName: "أنابيب ستانلس ستيل ملحومة", ItemType: "Finished Material", GLAccountCode: "4103-02" },
      { CategoryCode: "BAR-FLAT", CategoryName: "Flat Bars & Angles", ArabicName: "خوص وزوايا حديدية مسطحة", ItemType: "Raw Material", GLAccountCode: "4104-01" },
      { CategoryCode: "FIT-IND", CategoryName: "Industrial Fittings", ArabicName: "وصلات وفلانشات وكيعان صناعية", ItemType: "Accessory", GLAccountCode: "4105-01" },
      { CategoryCode: "ACC-GEN", CategoryName: "Accessories & Screws", ArabicName: "إكسسوارات ومستلزمات عامة", ItemType: "Accessory", GLAccountCode: "4105-02" },
      { CategoryCode: "CUT-REM", CategoryName: "Cut Pieces & Remnants", ArabicName: "قطعيات وفضلات متبقية جاهزة للبيع", ItemType: "By-Product", GLAccountCode: "4106-01" }
    ]
  },
  {
    id: "items",
    name: "Items",
    arabicName: "الأصناف والمواصفات الفنية",
    category: "Inventory & Items",
    columns: [
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "ItemName", label: "Item Name", type: "string" },
      { key: "SteelGrade", label: "Steel Grade", type: "string" },
      { key: "Finish", label: "Finish", type: "string" },
      { key: "Thickness", label: "Thick (mm)", type: "number" },
      { key: "Width", label: "Width (mm)", type: "number" },
      { key: "Length", label: "Length (mm)", type: "number" },
      { key: "TheoreticalWeight", label: "Weight (kg)", type: "number" },
      { key: "HeatNumber", label: "Heat No.", type: "string" },
      { key: "CountryOfOrigin", label: "Origin", type: "string" },
      { key: "MinStock", label: "Min Stock", type: "number" }
    ],
    rows: [
      { ItemCode: "SS304-S-1.5", ItemName: "SS304 Sheet 1.5mm x 1220mm x 2440mm", SteelGrade: "304", Finish: "2B", Thickness: 1.5, Width: 1220, Length: 2440, TheoreticalWeight: 35.34, HeatNumber: "H304192", CountryOfOrigin: "Spain", MinStock: 100 },
      { ItemCode: "SS316-S-2.0", ItemName: "SS316 Sheet 2.0mm x 1500mm x 3000mm", SteelGrade: "316", Finish: "HL", Thickness: 2.0, Width: 1500, Length: 3000, TheoreticalWeight: 72.00, HeatNumber: "H316492", CountryOfOrigin: "Finland", MinStock: 50 },
      { ItemCode: "SS430-S-1.0", ItemName: "SS430 Sheet 1.0mm x 1220mm x 2440mm", SteelGrade: "430", Finish: "BA", Thickness: 1.0, Width: 1220, Length: 2440, TheoreticalWeight: 23.56, HeatNumber: "H430112", CountryOfOrigin: "China", MinStock: 200 },
      { ItemCode: "SS304-COIL-0.5", ItemName: "SS304 Coil Roll 0.5mm x 1000mm", SteelGrade: "304", Finish: "2B", Thickness: 0.5, Width: 1000, Length: 0, TheoreticalWeight: 5000, HeatNumber: "H304005", CountryOfOrigin: "India", MinStock: 5 },
      { ItemCode: "SS304-PIPE-2.0", ItemName: "SS304 Seamless Pipe Sch40 2 Inch x 6m", SteelGrade: "304", Finish: "Industrial", Thickness: 3.91, Width: 60.3, Length: 6000, TheoreticalWeight: 33.1, HeatNumber: "HP30458", CountryOfOrigin: "Japan", MinStock: 150 },
      { ItemCode: "SS316-PIPE-1.0", ItemName: "SS316 Welded Tube 1 Inch x 1.5mm x 6m", SteelGrade: "316", Finish: "Mirror/Polished", Thickness: 1.5, Width: 25.4, Length: 6000, TheoreticalWeight: 5.39, HeatNumber: "HP31692", CountryOfOrigin: "South Korea", MinStock: 250 },
      { ItemCode: "SS304-BAR-40x5", ItemName: "SS304 Flat Bar 40mm x 5mm x 6m", SteelGrade: "304", Finish: "Industrial", Thickness: 5.0, Width: 40.0, Length: 6000, TheoreticalWeight: 9.60, HeatNumber: "HB30401", CountryOfOrigin: "India", MinStock: 300 },
      { ItemCode: "SS316-ANG-50", ItemName: "SS316 Equal Angle 50mm x 50mm x 5mm x 6m", SteelGrade: "316", Finish: "Industrial", Thickness: 5.0, Width: 50.0, Length: 6000, TheoreticalWeight: 22.8, HeatNumber: "HA31612", CountryOfOrigin: "Germany", MinStock: 100 },
      { ItemCode: "SS304-FLG-2", ItemName: "SS304 Flange ANSI Class 150 2 Inch", SteelGrade: "304", Finish: "Forged Machined", Thickness: 19.1, Width: 150.0, Length: 150.0, TheoreticalWeight: 2.65, HeatNumber: "HF30488", CountryOfOrigin: "Italy", MinStock: 400 },
      { ItemCode: "SS316-ELB-90", ItemName: "SS316 Threaded Elbow 90 Degree 1 Inch", SteelGrade: "316", Finish: "Screwed Machined", Thickness: 3.0, Width: 50.0, Length: 50.0, TheoreticalWeight: 0.35, HeatNumber: "HE31604", CountryOfOrigin: "Taiwan", MinStock: 500 }
    ]
  },
  {
    id: "itemPrices",
    name: "ItemPrices",
    arabicName: "أسعار بيع وشراء الأصناف",
    category: "Inventory & Items",
    columns: [
      { key: "PriceID", label: "Price ID", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "PriceListCode", label: "List Code", type: "string" },
      { key: "PurchaseCost", label: "Purchase Cost (EGP)", type: "currency" },
      { key: "SellingPrice", label: "Selling Price (EGP)", type: "currency" }
    ],
    rows: [
      { PriceID: "PRI001", ItemCode: "SS304-S-1.5", PriceListCode: "PL-RETAIL", PurchaseCost: 2800, SellingPrice: 3800 },
      { PriceID: "PRI002", ItemCode: "SS304-S-1.5", PriceListCode: "PL-WHOLE", PurchaseCost: 2800, SellingPrice: 3200 },
      { PriceID: "PRI003", ItemCode: "SS316-S-2.0", PriceListCode: "PL-RETAIL", PurchaseCost: 5900, SellingPrice: 7800 },
      { PriceID: "PRI004", ItemCode: "SS316-S-2.0", PriceListCode: "PL-WHOLE", PurchaseCost: 5900, SellingPrice: 6800 },
      { PriceID: "PRI005", ItemCode: "SS430-S-1.0", PriceListCode: "PL-RETAIL", PurchaseCost: 1900, SellingPrice: 2800 },
      { PriceID: "PRI006", ItemCode: "SS304-COIL-0.5", PriceListCode: "PL-WHOLE", PurchaseCost: 350000, SellingPrice: 410000 },
      { PriceID: "PRI007", ItemCode: "SS304-PIPE-2.0", PriceListCode: "PL-RETAIL", PurchaseCost: 2400, SellingPrice: 3300 },
      { PriceID: "PRI008", ItemCode: "SS316-PIPE-1.0", PriceListCode: "PL-RETAIL", PurchaseCost: 420, SellingPrice: 600 },
      { PriceID: "PRI009", ItemCode: "SS304-BAR-40x5", PriceListCode: "PL-RETAIL", PurchaseCost: 750, SellingPrice: 1100 },
      { PriceID: "PRI010", ItemCode: "SS316-ANG-50", PriceListCode: "PL-WHOLE", PurchaseCost: 1800, SellingPrice: 2300 }
    ]
  },
  {
    id: "priceLists",
    name: "PriceLists",
    arabicName: "قوائم الأسعار التسويقية",
    category: "Inventory & Items",
    columns: [
      { key: "PriceListCode", label: "List Code", type: "string" },
      { key: "ListName", label: "Price List Name", type: "string" },
      { key: "Description", label: "Description", type: "string" },
      { key: "DiscountRate", label: "Base Discount Rate", type: "number" },
      { key: "IsActive", label: "Is Active", type: "boolean" }
    ],
    rows: [
      { PriceListCode: "PL-RETAIL", ListName: "Standard Retail Price List", Description: "Standard prices for small quantities & cash customers", DiscountRate: 0.00, IsActive: true },
      { PriceListCode: "PL-WHOLE", ListName: "Wholesale Steel Price List", Description: "Discounted prices for distributors and bulk steel orders", DiscountRate: 0.12, IsActive: true },
      { PriceListCode: "PL-PROJECT", ListName: "Engineering Project Pricing", Description: "Special contract bidding prices for petro and chemical projects", DiscountRate: 0.15, IsActive: true },
      { PriceListCode: "PL-DIST", ListName: "Exclusive Distributor Pricing", Description: "Highest tier discount for premium partner companies", DiscountRate: 0.18, IsActive: true },
      { PriceListCode: "PL-EXPORT", ListName: "Export International Price List", Description: "Tax exempt prices denoted in foreign currencies (USD/EUR)", DiscountRate: 0.05, IsActive: true },
      { PriceListCode: "PL-OFFSEAS", ListName: "Off-Season Clearance List", Description: "Clearance discount of slow-moving steel items and sizes", DiscountRate: 0.20, IsActive: true },
      { PriceListCode: "PL-REMNANT", ListName: "Stainless Steel Remnants Clearance", Description: "Special discount pricing list for cut sheets and bars pieces", DiscountRate: 0.35, IsActive: true },
      { PriceListCode: "PL-GOVT", ListName: "Government Direct Bids List", Description: "Highly optimized low margin pricing for governmental agencies", DiscountRate: 0.08, IsActive: true },
      { PriceListCode: "PL-VIP", ListName: "VIP Corporate Clients", Description: "Tailored long-term contract pricing for major construction firms", DiscountRate: 0.10, IsActive: true },
      { PriceListCode: "PL-TRIAL", ListName: "Promotional Steel Marketing List", Description: "Short-term trial price list to attract new local fabricators", DiscountRate: 0.03, IsActive: true }
    ]
  },
  {
    id: "inventoryMovements",
    name: "InventoryMovements",
    arabicName: "حركات المخزون التفصيلية",
    category: "Inventory & Items",
    columns: [
      { key: "MovementID", label: "Move ID", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "WarehouseCode", label: "Warehouse", type: "string" },
      { key: "TransactionType", label: "Type (IN/OUT)", type: "string" },
      { key: "Quantity", label: "Qty", type: "number" },
      { key: "ReferenceDoc", label: "Ref Document", type: "string" },
      { key: "BatchNo", label: "Batch No", type: "string" },
      { key: "MovementDate", label: "Date", type: "date" }
    ],
    rows: [
      { MovementID: "IM001", ItemCode: "SS304-S-1.5", WarehouseCode: "W001", TransactionType: "IN", Quantity: 500, ReferenceDoc: "PI-2026-001", BatchNo: "B-304-01", MovementDate: "2026-01-10" },
      { MovementID: "IM002", ItemCode: "SS304-S-1.5", WarehouseCode: "W001", TransactionType: "OUT", Quantity: 30, ReferenceDoc: "SI-2026-001", BatchNo: "B-304-01", MovementDate: "2026-01-15" },
      { MovementID: "IM003", ItemCode: "SS316-S-2.0", WarehouseCode: "W002", TransactionType: "IN", Quantity: 200, ReferenceDoc: "PI-2026-002", BatchNo: "B-316-01", MovementDate: "2026-01-12" },
      { MovementID: "IM004", ItemCode: "SS316-S-2.0", WarehouseCode: "W002", TransactionType: "OUT", Quantity: 15, ReferenceDoc: "SI-2026-002", BatchNo: "B-316-01", MovementDate: "2026-01-18" },
      { MovementID: "IM005", ItemCode: "SS430-S-1.0", WarehouseCode: "W001", TransactionType: "IN", Quantity: 800, ReferenceDoc: "PI-2026-003", BatchNo: "B-430-01", MovementDate: "2026-01-20" },
      { MovementID: "IM006", ItemCode: "SS430-S-1.0", WarehouseCode: "W001", TransactionType: "OUT", Quantity: 100, ReferenceDoc: "SI-2026-003", BatchNo: "B-430-01", MovementDate: "2026-01-22" },
      { MovementID: "IM007", ItemCode: "SS304-PIPE-2.0", WarehouseCode: "W005", TransactionType: "IN", Quantity: 400, ReferenceDoc: "PI-2026-004", BatchNo: "B-PP304-01", MovementDate: "2026-01-25" },
      { MovementID: "IM008", ItemCode: "SS316-PIPE-1.0", WarehouseCode: "W005", TransactionType: "IN", Quantity: 600, ReferenceDoc: "PI-2026-005", BatchNo: "B-PP316-01", MovementDate: "2026-01-28" },
      { MovementID: "IM009", ItemCode: "SS304-BAR-40x5", WarehouseCode: "W001", TransactionType: "OUT", Quantity: 50, ReferenceDoc: "SI-2026-004", BatchNo: "B-BR304-01", MovementDate: "2026-02-02" },
      { MovementID: "IM010", ItemCode: "SS316-ANG-50", WarehouseCode: "W002", TransactionType: "OUT", Quantity: 12, ReferenceDoc: "SI-2026-005", BatchNo: "B-AN316-01", MovementDate: "2026-02-05" }
    ]
  },
  {
    id: "inventoryAdjustments",
    name: "InventoryAdjustments",
    arabicName: "تسويات جرد المخزون",
    category: "Inventory & Items",
    columns: [
      { key: "AdjustmentNo", label: "Adjustment No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "WarehouseCode", label: "Warehouse", type: "string" },
      { key: "SystemQty", label: "System Qty", type: "number" },
      { key: "PhysicalQty", label: "Physical Qty", type: "number" },
      { key: "DiffQty", label: "Diff Qty", type: "number" },
      { key: "Reason", label: "Reason", type: "string" },
      { key: "ApprovedBy", label: "Approved By", type: "string" }
    ],
    rows: [
      { AdjustmentNo: "IA-2026-001", ItemCode: "SS304-S-1.5", WarehouseCode: "W001", SystemQty: 470, PhysicalQty: 470, DiffQty: 0, Reason: "Annual stock take matching", ApprovedBy: "E003" },
      { AdjustmentNo: "IA-2026-002", ItemCode: "SS316-S-2.0", WarehouseCode: "W002", SystemQty: 185, PhysicalQty: 184, DiffQty: -1, Reason: "Damage on sheet margin - disposed", ApprovedBy: "E003" },
      { AdjustmentNo: "IA-2026-003", ItemCode: "SS430-S-1.0", WarehouseCode: "W001", SystemQty: 700, PhysicalQty: 702, DiffQty: 2, Reason: "Found surplus unrecorded in rack", ApprovedBy: "E003" },
      { AdjustmentNo: "IA-2026-004", ItemCode: "SS304-PIPE-2.0", WarehouseCode: "W005", SystemQty: 400, PhysicalQty: 400, DiffQty: 0, Reason: "Bi-monthly verification", ApprovedBy: "E005" },
      { AdjustmentNo: "IA-2026-005", ItemCode: "SS316-PIPE-1.0", WarehouseCode: "W005", SystemQty: 600, PhysicalQty: 598, DiffQty: -2, Reason: "Cutting scrap losses during delivery prep", ApprovedBy: "E005" },
      { AdjustmentNo: "IA-2026-006", ItemCode: "SS304-BAR-40x5", WarehouseCode: "W001", SystemQty: 250, PhysicalQty: 251, DiffQty: 1, Reason: "Slight weight tolerance difference", ApprovedBy: "E005" },
      { AdjustmentNo: "IA-2026-007", ItemCode: "SS316-ANG-50", WarehouseCode: "W002", SystemQty: 88, PhysicalQty: 88, DiffQty: 0, Reason: "Stock take OK", ApprovedBy: "E009" },
      { AdjustmentNo: "IA-2026-008", ItemCode: "SS304-FLG-2", WarehouseCode: "W005", SystemQty: 120, PhysicalQty: 120, DiffQty: 0, Reason: "Box tally OK", ApprovedBy: "E005" },
      { AdjustmentNo: "IA-2026-009", ItemCode: "SS316-ELB-90", WarehouseCode: "W005", SystemQty: 340, PhysicalQty: 339, DiffQty: -1, Reason: "Missing piece during packing auditing", ApprovedBy: "E003" },
      { AdjustmentNo: "IA-2026-010", ItemCode: "SS304-COIL-0.5", WarehouseCode: "W004", SystemQty: 5, PhysicalQty: 5, DiffQty: 0, Reason: "Coil inspection OK", ApprovedBy: "E005" }
    ]
  },
  {
    id: "stockTransfers",
    name: "StockTransfers",
    arabicName: "تحويلات المخزون البينية",
    category: "Inventory & Items",
    columns: [
      { key: "TransferNo", label: "Transfer No", type: "string" },
      { key: "ItemCode", label: "Item Code", type: "string" },
      { key: "FromWarehouseCode", label: "From Wh", type: "string" },
      { key: "ToWarehouseCode", label: "To Wh", type: "string" },
      { key: "Quantity", label: "Qty Transferred", type: "number" },
      { key: "TransferDate", label: "Date", type: "date" },
      { key: "RequestedBy", label: "Requested By", type: "string" },
      { key: "Status", label: "Status", type: "string" }
    ],
    rows: [
      { TransferNo: "ST-2026-001", ItemCode: "SS304-S-1.5", FromWarehouseCode: "W001", ToWarehouseCode: "W002", Quantity: 50, TransferDate: "2026-02-10", RequestedBy: "E010", Status: "Completed" },
      { TransferNo: "ST-2026-002", ItemCode: "SS316-S-2.0", FromWarehouseCode: "W002", ToWarehouseCode: "W001", Quantity: 20, TransferDate: "2026-02-12", RequestedBy: "E004", Status: "Completed" },
      { TransferNo: "ST-2026-003", ItemCode: "SS430-S-1.0", FromWarehouseCode: "W001", ToWarehouseCode: "W004", Quantity: 150, TransferDate: "2026-02-15", RequestedBy: "E005", Status: "Completed" },
      { TransferNo: "ST-2026-004", ItemCode: "SS304-PIPE-2.0", FromWarehouseCode: "W005", ToWarehouseCode: "W001", Quantity: 60, TransferDate: "2026-02-18", RequestedBy: "E004", Status: "Completed" },
      { TransferNo: "ST-2026-005", ItemCode: "SS316-PIPE-1.0", FromWarehouseCode: "W005", ToWarehouseCode: "W002", Quantity: 100, TransferDate: "2026-02-20", RequestedBy: "E009", Status: "Completed" },
      { TransferNo: "ST-2026-006", ItemCode: "SS304-BAR-40x5", FromWarehouseCode: "W001", ToWarehouseCode: "W002", Quantity: 40, TransferDate: "2026-02-22", RequestedBy: "E010", Status: "Completed" },
      { TransferNo: "ST-2026-007", ItemCode: "SS316-ANG-50", FromWarehouseCode: "W002", ToWarehouseCode: "W001", Quantity: 15, TransferDate: "2026-02-24", RequestedBy: "E004", Status: "Completed" },
      { TransferNo: "ST-2026-008", ItemCode: "SS304-FLG-2", FromWarehouseCode: "W005", ToWarehouseCode: "W002", Quantity: 30, TransferDate: "2026-02-26", RequestedBy: "E009", Status: "Completed" },
      { TransferNo: "ST-2026-009", ItemCode: "SS316-ELB-90", FromWarehouseCode: "W005", ToWarehouseCode: "W001", Quantity: 80, TransferDate: "2026-02-28", RequestedBy: "E004", Status: "Completed" },
      { TransferNo: "ST-2026-010", ItemCode: "SS304-COIL-0.5", FromWarehouseCode: "W001", ToWarehouseCode: "W004", Quantity: 1, TransferDate: "2026-03-01", RequestedBy: "E005", Status: "In-Transit" }
    ]
  },
  {
    id: "cutRemnants",
    name: "CutRemnants",
    arabicName: "فضلات وقصاصات ألواح الإستيل",
    category: "Inventory & Items",
    columns: [
      { key: "RemnantID", label: "Remnant ID", type: "string" },
      { key: "OriginalItemCode", label: "Orig Item", type: "string" },
      { key: "CutOrderNo", label: "Cut Order No", type: "string" },
      { key: "Grade", label: "Grade", type: "string" },
      { key: "RemainingThick", label: "Thick (mm)", type: "number" },
      { key: "RemainingWidth", label: "Width (mm)", type: "number" },
      { key: "RemainingLength", label: "Length (mm)", type: "number" },
      { key: "RemainingWeight", label: "Weight (kg)", type: "number" },
      { key: "WarehouseCode", label: "Warehouse", type: "string" },
      { key: "AvailabilityStatus", label: "Status", type: "string" }
    ],
    rows: [
      { RemnantID: "REM-001", OriginalItemCode: "SS304-S-1.5", CutOrderNo: "CO-2026-01", Grade: "304", RemainingThick: 1.5, RemainingWidth: 600, RemainingLength: 1220, RemainingWeight: 8.84, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" },
      { RemnantID: "REM-002", OriginalItemCode: "SS304-S-1.5", CutOrderNo: "CO-2026-01", Grade: "304", RemainingThick: 1.5, RemainingWidth: 620, RemainingLength: 2440, RemainingWeight: 17.96, WarehouseCode: "W007", AvailabilityStatus: "Reserved" },
      { RemnantID: "REM-003", OriginalItemCode: "SS316-S-2.0", CutOrderNo: "CO-2026-02", Grade: "316", RemainingThick: 2.0, RemainingWidth: 500, RemainingLength: 1500, RemainingWeight: 12.00, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" },
      { RemnantID: "REM-004", OriginalItemCode: "SS316-S-2.0", CutOrderNo: "CO-2026-02", Grade: "316", RemainingThick: 2.0, RemainingWidth: 1000, RemainingLength: 1500, RemainingWeight: 24.00, WarehouseCode: "W007", AvailabilityStatus: "Sold" },
      { RemnantID: "REM-005", OriginalItemCode: "SS430-S-1.0", CutOrderNo: "CO-2026-03", Grade: "430", RemainingThick: 1.0, RemainingWidth: 1220, RemainingLength: 440, RemainingWeight: 4.25, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" },
      { RemnantID: "REM-006", OriginalItemCode: "SS304-BAR-40x5", CutOrderNo: "CO-2026-04", Grade: "304", RemainingThick: 5.0, RemainingWidth: 40, RemainingLength: 1200, RemainingWeight: 1.92, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" },
      { RemnantID: "REM-007", OriginalItemCode: "SS304-BAR-40x5", CutOrderNo: "CO-2026-04", Grade: "304", RemainingThick: 5.0, RemainingWidth: 40, RemainingLength: 800, RemainingWeight: 1.28, WarehouseCode: "W007", AvailabilityStatus: "Disposed" },
      { RemnantID: "REM-008", OriginalItemCode: "SS316-ANG-50", CutOrderNo: "CO-2026-05", Grade: "316", RemainingThick: 5.0, RemainingWidth: 50, RemainingLength: 3000, RemainingWeight: 11.40, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" },
      { RemnantID: "REM-009", OriginalItemCode: "SS316-ANG-50", CutOrderNo: "CO-2026-05", Grade: "316", RemainingThick: 5.0, RemainingWidth: 50, RemainingLength: 1500, RemainingWeight: 5.70, WarehouseCode: "W007", AvailabilityStatus: "Reserved" },
      { RemnantID: "REM-010", OriginalItemCode: "SS304-S-1.5", CutOrderNo: "CO-2026-06", Grade: "304", RemainingThick: 1.5, RemainingWidth: 400, RemainingLength: 400, RemainingWeight: 1.92, WarehouseCode: "W007", AvailabilityStatus: "Available For Sale" }
    ]
  }
];
