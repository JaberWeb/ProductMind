import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const headers = [
  "Name", "Email", "Financial Status", "Paid at", "Fulfillment Status",
  "Lineitem quantity", "Lineitem name", "Lineitem price",
  "Total", "Discount Amount", "Shipping", "Taxes", "Created at",
];

const rows = [
  ["#ORD-001", "john.doe@email.com", "paid", "2024-01-15", "fulfilled",
    2, "Wireless Bluetooth Headphones", 79.99, 159.98, 0, 5.00, 12.80, "2024-01-15 10:30:00"],
  ["#ORD-002", "sarah.wilson@email.com", "paid", "2024-01-15", "fulfilled",
    1, "Yoga Mat Premium", 45.00, 45.00, 0, 0, 3.60, "2024-01-15 14:15:00"],
  ["#ORD-003", "alex.chen@email.com", "paid", "2024-01-16", "fulfilled",
    3, "Organic Green Tea 50-pack", 12.99, 38.97, 2.00, 4.50, 3.12, "2024-01-16 09:45:00"],
  ["#ORD-004", "emma.jones@email.com", "paid", "2024-01-16", "fulfilled",
    4, "Stainless Steel Water Bottle", 24.50, 98.00, 5.00, 6.00, 7.84, "2024-01-16 11:20:00"],
  ["#ORD-005", "mike.t@email.com", "paid", "2024-01-17", "fulfilled",
    10, "USB-C Charging Cable 6ft", 8.99, 89.90, 0, 4.00, 7.19, "2024-01-17 08:00:00"],
  ["#ORD-006", "linda.park@email.com", "paid", "2024-01-17", "fulfilled",
    2, "Cashmere Blend Scarf", 34.99, 69.98, 0, 3.50, 5.60, "2024-01-17 16:30:00"],
  ["#ORD-007", "tom.baker@email.com", "paid", "2024-01-18", "fulfilled",
    1, "Sourdough Bread Starter Kit", 28.50, 28.50, 0, 5.00, 2.28, "2024-01-18 07:45:00"],
  ["#ORD-008", "rachel.green@email.com", "paid", "2024-01-18", "fulfilled",
    3, "Desk LED Lamp Touch Control", 39.99, 119.97, 10.00, 0, 9.60, "2024-01-18 13:10:00"],
  ["#ORD-009", "kevin.nguyen@email.com", "paid", "2024-01-19", "fulfilled",
    5, "Resistance Bands Set 5-pack", 19.99, 99.95, 3.00, 4.50, 7.99, "2024-01-19 10:00:00"],
  ["#ORD-010", "maria.garcia@email.com", "paid", "2024-01-19", "fulfilled",
    1, "French Press Coffee Maker", 32.00, 32.00, 0, 5.50, 2.56, "2024-01-19 15:40:00"],
  ["#ORD-011", "james.wright@email.com", "paid", "2024-01-20", "fulfilled",
    6, "Leather Journal A5 Lined", 14.99, 89.94, 0, 0, 7.20, "2024-01-20 09:30:00"],
  ["#ORD-012", "priya.sharma@email.com", "paid", "2024-01-20", "fulfilled",
    2, "Noise Cancelling Earbuds", 89.99, 179.98, 15.00, 4.00, 14.40, "2024-01-20 12:15:00"],
  ["#ORD-013", "ryan.lee@email.com", "paid", "2024-01-21", "fulfilled",
    1, "Plant-Based Protein Powder 2lb", 44.99, 44.99, 0, 0, 3.60, "2024-01-21 11:00:00"],
  ["#ORD-014", "olivia.martinez@email.com", "paid", "2024-01-21", "fulfilled",
    3, "Bamboo Cutting Board Set", 27.99, 83.97, 5.00, 5.00, 6.72, "2024-01-21 14:50:00"],
  ["#ORD-015", "sophie.taylor@email.com", "paid", "2024-01-22", "fulfilled",
    4, "Scented Soy Candle Trio", 18.50, 74.00, 0, 3.00, 5.92, "2024-01-22 10:20:00"],
];

const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Orders");

const colWidths = headers.map((h) => ({ wch: Math.max(h.length, 18) }));
ws["!cols"] = colWidths;

const outPath = path.resolve(__dirname, "../../../frontend/public/sample-data/shopify-orders.xlsx");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
XLSX.writeFile(wb, outPath);
console.log("Generated:", outPath);
