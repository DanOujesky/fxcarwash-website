import puppeteer from "puppeteer";
import { User, Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

export const generateInvoice = async (user: User, order: OrderWithItems) => {
  const totalAll = order.totalPrice;
  const totalBase = Math.round((totalAll / 1.21) * 100) / 100;
  const totalVat = Math.round((totalAll - totalBase) * 100) / 100;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatCurrency = (val: number) =>
    val.toLocaleString("cs-CZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const htmlContent = `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 10px;
      color: #1a1a2e;
      background: #fff;
      padding: 52px 56px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 24px;
      border-bottom: 2px solid #1a1a2e;
      margin-bottom: 36px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #1a1a2e;
      line-height: 1;
    }

    .brand-sub {
      font-size: 8px;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #9ca3af;
      margin-top: 5px;
    }

    .invoice-title-block {
      text-align: right;
    }

    .invoice-label {
      font-size: 7.5px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 5px;
    }

    .invoice-number {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: 0.02em;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 32px;
    }

    .meta-cell {
      padding: 16px 20px;
      border-right: 1px solid #e5e7eb;
      background: #fafafa;
    }

    .meta-cell:last-child { border-right: none; }

    .meta-label {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #b0b7c3;
      margin-bottom: 6px;
    }

    .meta-value {
      font-size: 11px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .parties {
      display: flex;
      gap: 20px;
      margin-bottom: 36px;
    }

    .party-box {
      flex: 1;
      padding: 20px 22px;
      border-radius: 10px;
      background: #fafafa;
      border: 1px solid #e5e7eb;
    }

    .party-heading {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #b0b7c3;
      margin-bottom: 10px;
    }

    .party-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 7px;
      line-height: 1.3;
    }

    .party-detail {
      font-size: 9.5px;
      color: #6b7280;
      line-height: 1.7;
    }

    .party-tax {
      margin-top: 9px;
      padding-top: 9px;
      border-top: 1px solid #e5e7eb;
      font-size: 9px;
      color: #9ca3af;
      line-height: 1.6;
    }

    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    table.items thead tr {
      border-bottom: 1.5px solid #1a1a2e;
    }

    table.items th {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #9ca3af;
      padding: 0 12px 10px 12px;
      text-align: left;
    }

    table.items th:not(:first-child) { text-align: right; }

    table.items tbody tr {
      border-bottom: 1px solid #f3f4f6;
    }

    table.items tbody tr:last-child { border-bottom: 1.5px solid #e5e7eb; }

    table.items td {
      padding: 12px 12px;
      font-size: 10px;
      color: #374151;
      vertical-align: middle;
    }

    table.items td:not(:first-child) { text-align: right; }

    .item-name {
      font-weight: 500;
      color: #1a1a2e;
    }

    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 44px;
    }

    .totals-box {
      width: 260px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      font-size: 10px;
      color: #6b7280;
      border-bottom: 1px solid #f3f4f6;
    }

    .totals-row span:last-child {
      font-weight: 500;
      color: #374151;
    }

    .totals-row.grand {
      border-top: 2px solid #1a1a2e;
      border-bottom: none;
      margin-top: 6px;
      padding-top: 12px;
    }

    .totals-row.grand span {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e !important;
    }

    .footer {
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-note {
      font-size: 8px;
      color: #b0b7c3;
      line-height: 1.7;
    }

    .footer-brand {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #d1d5db;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand-name">F.X. CARWASH</div>
      <div class="brand-sub">F.X. CarWash s.r.o.</div>
    </div>
    <div class="invoice-title-block">
      <div class="invoice-label">Faktura — daňový doklad</div>
      <div class="invoice-number">${order.orderFullNumber}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-cell">
      <div class="meta-label">Datum vystavení</div>
      <div class="meta-value">${formatDate(new Date())}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Datum zdanitelného plnění</div>
      <div class="meta-value">${formatDate(new Date())}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Variabilní symbol</div>
      <div class="meta-value">${order.orderIdentifier}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Forma úhrady</div>
      <div class="meta-value">Platba kartou</div>
    </div>
  </div>

  <div class="parties">
    <div class="party-box">
      <div class="party-heading">Dodavatel</div>
      <div class="party-name">F.X. CarWash s.r.o.</div>
      <div class="party-detail">
        Žižkova 1125<br>
        252 62 Horoměřice
      </div>
      <div class="party-tax">
        IČ: 23579102 &nbsp;·&nbsp; DIČ: CZ23579102<br>
        <span style="font-size:8px;">zapsaná v OR u MS v Praze, oddíl C, vložka 429539</span>
      </div>
    </div>

    <div class="party-box">
      <div class="party-heading">Odběratel</div>
      <div class="party-name">
        ${order.companyName ? order.companyName : `${user.firstName} ${user.lastName}`}
      </div>
      <div class="party-detail">
        ${order.companyAddress || order.address || user.address || ""}<br>
        ${order.companyCity || order.city || user.city || ""}${order.companyZipCode || order.zipCode || user.zipCode ? `, ${order.companyZipCode || order.zipCode || user.zipCode}` : ""}
      </div>
      ${
        order.companyICO || order.companyDIC
          ? `
      <div class="party-tax">
        ${order.companyICO ? `IČ: ${order.companyICO}` : ""}
        ${order.companyICO && order.companyDIC ? "&nbsp;·&nbsp;" : ""}
        ${order.companyDIC ? `DIČ: ${order.companyDIC}` : ""}
      </div>`
          : ""
      }
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th style="width:44%;">Popis</th>
        <th>Ks</th>
        <th>Základ bez DPH</th>
        <th>Sazba DPH</th>
        <th>DPH</th>
        <th>Celkem s DPH</th>
      </tr>
    </thead>
    <tbody>
      ${order.items
        .map((item) => {
          const total = item.price * item.quantity;
          const base = total / 1.21;
          const vat = total - base;
          return `
        <tr>
          <td class="item-name">${item.name}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(base)} Kč</td>
          <td>21 %</td>
          <td>${formatCurrency(vat)} Kč</td>
          <td style="font-weight:600; color:#1a1a2e;">${formatCurrency(total)} Kč</td>
        </tr>`;
        })
        .join("")}
    </tbody>
  </table>

  <div class="totals-wrapper">
    <div class="totals-box">
      <div class="totals-row">
        <span>Základ DPH (21 %)</span>
        <span>${formatCurrency(totalBase)} Kč</span>
      </div>
      <div class="totals-row">
        <span>DPH (21 %)</span>
        <span>${formatCurrency(totalVat)} Kč</span>
      </div>
      <div class="totals-row grand">
        <span>Celkem</span>
        <span>${formatCurrency(totalAll)} Kč</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-note">
      Vystavil: sales@fxcarwash.cz
    </div>
    <div class="footer-brand">F.X. CarWash</div>
  </div>

</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();
  return Buffer.from(pdf);
};
