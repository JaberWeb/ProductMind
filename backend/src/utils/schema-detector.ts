const KNOWN_FIELDS: Record<string, string> = {
  orderid: "orderId",
  order_id: "orderId",
  "order id": "orderId",
  id: "orderId",
  "order id/ref": "orderId",
  productname: "productName",
  product_name: "productName",
  "product name": "productName",
  product: "productName",
  item: "productName",
  itemname: "productName",
  item_name: "productName",
  quantity: "quantity",
  qty: "quantity",
  qty_: "quantity",
  price: "price",
  unitprice: "price",
  unit_price: "price",
  "unit price": "price",
  amount: "price",
  revenue: "revenue",
  total: "revenue",
  "total amount": "revenue",
  totalamount: "revenue",
  sales: "revenue",
  date: "date",
  orderdate: "date",
  order_date: "date",
  "order date": "date",
  transactiondate: "date",
  transaction_date: "date",
  category: "category",
  categories: "category",
  productcategory: "category",
  product_category: "category",
  type: "category",
  customeremail: "customerEmail",
  customer_email: "customerEmail",
  "customer email": "customerEmail",
  email: "customerEmail",
  customer: "customerEmail",
  sourceplatform: "sourcePlatform",
  source_platform: "sourcePlatform",
  "source platform": "sourcePlatform",
  platform: "sourcePlatform",
  channel: "sourcePlatform",
};

export interface ColumnMapping {
  sourceColumn: string;
  targetField: string | null;
}

export interface DetectionResult {
  mapping: ColumnMapping[];
  confidence: number;
  unmappedColumns: string[];
}

export function detectSchema(headers: string[]): DetectionResult {
  const mapping: ColumnMapping[] = [];
  let mappedCount = 0;

  for (const header of headers) {
    const normalized = header.trim().toLowerCase().replace(/\s+/g, " ");
    const target = KNOWN_FIELDS[normalized] || null;
    mapping.push({ sourceColumn: header, targetField: target });
    if (target) mappedCount++;
  }

  const confidence = headers.length > 0 ? Math.round((mappedCount / headers.length) * 100) : 0;
  const unmappedColumns = mapping.filter((m) => !m.targetField).map((m) => m.sourceColumn);

  return { mapping, confidence, unmappedColumns };
}
