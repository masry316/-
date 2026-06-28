export interface SheetColumn {
  key: string;
  label: string;
  arabicLabel?: string;
  type: "string" | "number" | "boolean" | "date" | "currency";
}

export interface SheetConfig {
  id: string;
  name: string;
  arabicName: string;
  category: "System & Org" | "Contacts & Accounts" | "Inventory & Items" | "Sales Department" | "Purchasing Department" | "Finance & Treasury" | "System Logs";
  columns: SheetColumn[];
  rows: Record<string, any>[];
}
