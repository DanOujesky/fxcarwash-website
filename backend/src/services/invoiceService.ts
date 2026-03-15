import puppeteer from "puppeteer";
import { User, Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

export const generateInvoice = async (user: User, order: OrderWithItems) => {
  const totalAll = order.totalPrice;
  const totalBase = Math.round((totalAll / 1.21) * 100) / 100;
  const totalVat = Math.round((totalAll - totalBase) * 100) / 100;

  const formatDate = (date: Date) => date.toLocaleDateString("cs-CZ");
  const formatCurrency = (val: number) =>
    val.toLocaleString("cs-CZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const htmlContent = `
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; font-size: 11px; margin: 0; padding: 40px; color: #333; line-height: 1.4; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 5px; align-items: flex-end; }
            .blue-title { color: #000080; font-weight: bold; border-bottom: 1px solid #ccc; margin: 10px 0 5px 0; padding-bottom: 2px; }
            .details { display: flex; border-bottom: 1px solid #000; }
            .column { flex: 1; padding: 10px; border-right: 1px solid #000; }
            .column:last-child { border-right: none; }
            .customer-box { padding: 10px; flex: 1; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table.items th { border-bottom: 1px solid #000; text-align: left; padding: 8px 5px; background-color: #f9f9f9; }
            table.items td { padding: 8px 5px; border-bottom: 1px solid #eee; }
            .total-section { display: flex; justify-content: flex-end; margin-top: 30px; }
            .recap-table { width: 100%; border-collapse: collapse; font-size: 10px; }
            .recap-table th { border-bottom: 1px solid #000; text-align: right; padding: 3px; }
            .recap-table td { text-align: right; padding: 3px; }
            .total-row { font-size: 16px; font-weight: bold; border-top: 2px solid #000; }
            .footer { margin-top: 50px; font-size: 9px; color: #444; border-top: 1px solid #ccc; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="font-size: 28px; font-weight: bold;">F.X. CARWASH</div>
            <div style="text-align: right;">
                <h2 style="margin: 0; font-size: 16px;">FAKTURA - DAŇOVÝ DOKLAD č. ${order.orderFullNumber}</h2>
            </div>
        </div>

        <div class="details">
            <div class="column">
                <div class="blue-title">Dodavatel:</div>
                <strong style="font-size: 12px;">F.X. CarWash s.r.o.</strong><br>
                Žižkova 1125, 252 62 Horoměřice<br>
                IČ: 23579102, DIČ: CZ23579102<br>
                <small>zapsaná v OR u MS v Praze, oddíl C, vložka 429539</small>
            </div>
            <div class="column">
                <table style="width: 100%;">
                    <tr><td>Variabilní symbol:</td><td style="text-align: right;"><strong>${order.orderIdentifier}</strong></td></tr>
                    <tr><td>Číslo účtu:</td><td style="text-align: right;"><strong>361179237 / 0300</strong></td></tr>
                    <tr><td>Forma úhrady:</td><td style="text-align: right;">Platba kartou</td></tr>
                </table>
            </div>
            <div class="customer-box">
                <div class="blue-title">Odběratel:</div>
                <strong>
                    ${order.companyName ? order.companyName : `${user.firstName} ${user.lastName}`}
                </strong><br>
                
                ${order.companyAddress || order.address || user.address || ""}<br>
                
                ${order.companyCity || order.city || user.city || ""} 
                ${order.companyZipCode || order.zipCode || user.zipCode ? `, ${order.companyZipCode || order.zipCode || user.zipCode}` : ""}<br>
                
                ${order.companyICO ? `IČ: ${order.companyICO}<br>` : ""}
                ${order.companyDIC ? `DIČ: ${order.companyDIC}` : ""}
            </div>
        </div>

        <table style="width: 100%; margin-top: 10px;">
            <tr>
                <td>Datum vystavení: <strong>${formatDate(new Date())}</strong></td>
                <td>Datum uskutečnitelného zdanitelného pnění: <strong>${formatDate(new Date())}</strong></td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 40%;">Označení dodávky</th>
                    <th style="text-align: center;">Ks</th>
                    <th style="text-align: right;">Základ</th>
                    <th style="text-align: right;">%DPH</th>
                    <th style="text-align: right;">DPH</th>
                    <th style="text-align: right;">Kč Celkem</th>
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
                            <td>${item.name}</td>
                            <td style="text-align: center;">${item.quantity}</td>
                            <td style="text-align: right;">${formatCurrency(base)}</td>
                            <td style="text-align: right;">21%</td>
                            <td style="text-align: right;">${formatCurrency(vat)}</td>
                            <td style="text-align: right;">${formatCurrency(total)}</td>
                        </tr>
                        `;
                  })
                  .join("")}
            </tbody>
        </table>

        <div class="total-section">
            <div style="width: 40%; text-align: right;">
                <table style="width: 100%;">
                    <tr><td>Základ (21%):</td><td style="text-align: right;">${formatCurrency(totalBase)} Kč</td></tr>
                    <tr><td>DPH:</td><td style="text-align: right;">${formatCurrency(totalVat)} Kč</td></tr>
                    <tr class="total-row">
                        <td style="padding-top: 10px;">CELKEM:</td>
                        <td style="padding-top: 10px;">${formatCurrency(totalAll)} Kč</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="footer">
            <div>Vystavil: sales@fxcarwash.cz</div>
        </div>
    </body>
    </html>
    `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return Buffer.from(pdf);
};
