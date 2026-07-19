import * as fs from "fs";
import * as path from "path";

const sampleDir = path.resolve(__dirname, "../../../frontend/public/sample-data");

const products = [
  "Wireless Bluetooth Headphones", "Yoga Mat Premium", "Organic Green Tea 50-pack",
  "Stainless Steel Water Bottle", "USB-C Charging Cable 6ft", "Cashmere Blend Scarf",
  "Sourdough Bread Starter Kit", "Desk LED Lamp Touch Control", "Resistance Bands Set 5-pack",
  "French Press Coffee Maker", "Leather Journal A5 Lined", "Noise Cancelling Earbuds",
  "Plant-Based Protein Powder 2lb", "Bamboo Cutting Board Set", "Scented Soy Candle Trio",
  "Ergonomic Office Chair", "Smart Water Leak Detector", "Organic Cotton T-Shirt",
  "Cast Iron Skillet 12-inch", "Vitamin D3 5000 IU Supplement", "Portable Bluetooth Speaker",
  "Reusable Beeswax Food Wraps", "Men's Running Shoes", "Electric Kettle Temperature Control",
  "Bamboo Phone Stand", "Kombucha Starter Kit", "Winter Wool Beanie",
  "Stainless Steel Straws Set", "Adjustable Dumbbell Set", "Natural Lip Balm Trio",
  "Canvas Tote Bag", "Espresso Machine Pro", "Himalayan Salt Lamp",
  "Mandala Coloring Book", "Insulated Lunch Bag", "Polarized Sunglasses",
  "Wooden Chess Set", "Aromatherapy Diffuser", "Fitness Tracker Band",
  "Collapsible Travel Cup", "Microfiber Cleaning Cloth Set", "Wall-Mounted Shelf",
  "Organic Matcha Powder", "Yoga Block Set", "Solar Power Bank 20000mAh",
  "Wool Throw Blanket", "Ceramic Mug Set of 4", "Wireless Charging Pad",
  "Hemp Protein Bars Variety Pack", "Desk Organizer Bamboo",
];

const categories = [
  "Electronics", "Fitness", "Grocery", "Home & Living", "Fashion",
  "Food & Drinks", "Office", "Kitchen", "Stationery", "Health",
  "Sports", "Accessories", "Beauty", "Toys & Games", "Outdoor",
];

const platforms = [
  "Shopify", "WooCommerce", "Shopify", "WooCommerce", "Amazon",
  "Etsy", "Shopify", "Amazon", "WooCommerce", "Etsy",
];

const domains = [
  "email.com", "outlook.com", "gmail.com", "yahoo.com", "proton.me",
  "icloud.com", "hotmail.com", "aol.com", "mail.com", "zoho.com",
];

const firstNames = [
  "John", "Sarah", "Alex", "Emma", "Mike", "Linda", "Tom", "Rachel",
  "Kevin", "Maria", "James", "Priya", "Ryan", "Olivia", "Sophie",
  "David", "Anna", "Chris", "Jessica", "Daniel", "Megan", "Brian",
  "Amanda", "Jason", "Nicole", "Eric", "Stephanie", "Adam", "Laura",
  "Scott", "Michelle", "Tyler", "Ashley", "Brandon", "Kimberly",
];

const lastNames = [
  "Doe", "Wilson", "Chen", "Jones", "Taylor", "Park", "Baker", "Green",
  "Nguyen", "Garcia", "Wright", "Sharma", "Lee", "Martinez", "Smith",
  "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Jackson",
  "Martin", "Thompson", "White", "Harris", "Clark", "Lewis", "Walker",
  "Hall", "Allen", "Young", "King", "Scott", "Adams",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function randomEmail(): string {
  const fn = pick(firstNames).toLowerCase();
  const ln = pick(lastNames).toLowerCase();
  const n = rand(1, 999);
  return `${fn}.${ln}${n}@${pick(domains)}`;
}

function randomDate(year = 2024): string {
  const m = String(rand(1, 12)).padStart(2, "0");
  const d = String(rand(1, 28)).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function randomPrice(): string {
  return (rand(399, 9999) / 100).toFixed(2);
}

function randomQty(): number {
  const weights = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 8, 10];
  return pick(weights);
}

// ===== SALES-SAMPLE.CSV =====
// 100% map-able: Order ID,Product Name,Quantity,Unit Price,Revenue,Date,Category,Customer Email,Platform
function generateSalesSampleRecords(count: number) {
  const header = "Order ID,Product Name,Quantity,Unit Price,Revenue,Date,Category,Customer Email,Platform";
  const rows: string[] = [];
  for (let i = 1; i <= count; i++) {
    const qty = randomQty();
    const price = randomPrice();
    const revenue = (qty * parseFloat(price)).toFixed(2);
    const orderId = `ORD-${String(i).padStart(5, "0")}`;
    const product = pick(products);
    const date = randomDate();
    const cat = pick(categories);
    const email = randomEmail();
    const platform = pick(platforms);
    rows.push(`${orderId},${product},${qty},${price},${revenue},${date},${cat},${email},${platform}`);
  }
  return [header, ...rows].join("\n");
}

// ===== SHOPIFY-ORDERS.CSV =====
// Shopify export: Name,Email,Financial Status,Paid at,Fulfillment Status,Lineitem quantity,Lineitem name,Lineitem price,Total,Discount Amount,Shipping,Taxes,Created at
function generateShopifyRecords(count: number) {
  const header = "Name,Email,Financial Status,Paid at,Fulfillment Status,Lineitem quantity,Lineitem name,Lineitem price,Total,Discount Amount,Shipping,Taxes,Created at";
  const rows: string[] = [];
  for (let i = 1; i <= count; i++) {
    const qty = randomQty();
    const price = randomPrice();
    const subtotal = (qty * parseFloat(price)).toFixed(2);
    const discount = rand(0, 3) === 0 ? (rand(100, 2000) / 100).toFixed(2) : "0.00";
    const shipping = rand(0, 2) === 0 ? (rand(200, 800) / 100).toFixed(2) : "0.00";
    const afterDiscount = (parseFloat(subtotal) - parseFloat(discount)).toFixed(2);
    const tax = (parseFloat(afterDiscount) * 0.08).toFixed(2);
    const total = (parseFloat(afterDiscount) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);
    const orderId = `#ORD-${String(i).padStart(5, "0")}`;
    const email = randomEmail();
    const status = pick(["paid", "paid", "paid", "refunded", "partially_refunded"]);
    const fulfillment = pick(["fulfilled", "fulfilled", "fulfilled", "unfulfilled", "partial"]);
    const paidAt = randomDate();
    const product = pick(products);
    const created = `${paidAt} ${String(rand(8, 18)).padStart(2, "0")}:${String(rand(0, 59)).padStart(2, "0")}:00`;
    rows.push(
      `${orderId},${email},${status},${paidAt},${fulfillment},${qty},"${product}",${price},${total},${discount},${shipping},${tax},${created}`
    );
  }
  return [header, ...rows].join("\n");
}

// ===== WOOCOMMERCE-ORDERS.CSV =====
// WooCommerce export: Order Number,Product Name,Qty,Unit Price,Total,Order Date,Category,Billing Email,Payment Method,Order Status
function generateWooCommerceRecords(count: number) {
  const header = "Order Number,Product Name,Qty,Unit Price,Total,Order Date,Category,Billing Email,Payment Method,Order Status";
  const rows: string[] = [];
  const paymentMethods = ["PayPal", "Stripe", "Credit Card", "Bank Transfer", "Cash on Delivery"];
  const orderStatuses = ["Completed", "Processing", "On Hold", "Refunded", "Cancelled"];
  for (let i = 1; i <= count; i++) {
    const qty = randomQty();
    const price = randomPrice();
    const total = (qty * parseFloat(price)).toFixed(2);
    const orderId = `WC-${String(i).padStart(5, "0")}`;
    const product = pick(products);
    const date = randomDate();
    const cat = pick(categories);
    const email = randomEmail();
    const payment = pick(paymentMethods);
    const status = pick(orderStatuses);
    rows.push(
      `${orderId},${product},${qty},${price},${total},${date},${cat},${email},${payment},${status}`
    );
  }
  return [header, ...rows].join("\n");
}

// Generate all 3 CSVs
const count = 120;

fs.mkdirSync(sampleDir, { recursive: true });

const csv1 = generateSalesSampleRecords(count);
fs.writeFileSync(path.join(sampleDir, "sales-sample.csv"), csv1, "utf-8");
console.log(`✅ sales-sample.csv — ${count} records`);

const csv2 = generateShopifyRecords(count);
fs.writeFileSync(path.join(sampleDir, "shopify-orders.csv"), csv2, "utf-8");
console.log(`✅ shopify-orders.csv — ${count} records`);

const csv3 = generateWooCommerceRecords(count);
fs.writeFileSync(path.join(sampleDir, "woocommerce-orders.csv"), csv3, "utf-8");
console.log(`✅ woocommerce-orders.csv — ${count} records`);
