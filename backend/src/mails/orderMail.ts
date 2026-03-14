import { User, Order, OrderItem } from "@prisma/client";
import { transporter } from "../utils/mailer";
import { generateInvoice } from "../services/invoiceService";

type OrderWithItems = Order & {
  items: OrderItem[];
};

export const sendOrderEmailToUser = async (
  user: User,
  order: OrderWithItems,
) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";

  const itemsHtml = order.items
    .map(
      (item) => `
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #eee;">
      <strong style="color: #333;">${item.name}</strong>
    ${item.delivery ? `<br><small style="color: #666;">Množství: ${item.quantity} ks</small> <br><small style="color: #666;">Způsob dopravy: ${item.shipping === "cp" ? "Česká pošta" : "Osobní převzetí"}</small>` : ""}
    ${item.cardNumber ? `<br><small style="color: #666;">Číslo karty: ${item.cardNumber}</small>` : ""}
    </td>
    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
      ${item.price.toLocaleString("cs-CZ")} Kč
    </td>
  </tr>
`,
    )
    .join("");

  const addressHtml = order.address
    ? `
    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Doručovací adresa</h3>
      <p style="margin: 0; color: #555; line-height: 1.5;">
        ${user.firstName} ${user.lastName}<br>
        ${order.address}, ${order.zipCode} ${order.city}<br>
        ${order.country}
      </p>
    </div>`
    : "";

  const invoicePdf: Buffer = await generateInvoice(user, order);
  const paddedNumber = order.orderNumberCount.toString().padStart(4, "0");

  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: `Potvrzení objednávky č. ${paddedNumber}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="background: ${darkBg}; color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0;">FX CARWASH</h1>
          <p style="margin: 10px 0 0; opacity: 0.7;">Objednávka byla úspěšně přijata</p>
        </div>

        <div style="padding: 30px;">
          <p>Dobrý den, ${user.firstName},</p>
          <p>děkujeme za Vaši objednávku. Zde je přehled Vaší objednávky:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 12px; font-weight: bold;">Celkem k úhradě</td>
              <td style="padding: 15px 12px; font-weight: bold; text-align: right; color: ${brandColor}; font-size: 18px;">
                ${order.totalPrice.toLocaleString("cs-CZ")} Kč
              </td>
            </tr>
          </table>

          ${addressHtml}

          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/moje-karty" 
               style="background: ${brandColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               VSTOUPIT DO MÉHO ÚČTU
            </a>
          </div>
        </div>

        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>F.X. Carwash s.r.o. | Podpora: sales@fxcarwash.cz</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `faktura_${order.id.slice(0, 8)}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf",
      },
    ],
  });
};
export const sendOrderEmailToCompany = async (
  user: User,
  order: OrderWithItems,
) => {
  const adminColor = "#3498db";
  const darkBg = "#252525";

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong style="color: #333;">${item.name}</strong>
        ${item.delivery ? `<br><small style="color: #666;">Množství: ${item.quantity} ks</small> <br><small style="color: #666;">Způsob dopravy: ${item.shipping === "cp" ? "Česká pošta" : "Osobní převzetí"}</small>` : ""}
        ${item.cardNumber ? `<br><small style="color: #666;">Číslo karty: ${item.cardNumber}</small>` : ""}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString("cs-CZ")} Kč
      </td>
    </tr>
`,
    )
    .join("");

  const invoicePdf: Buffer = await generateInvoice(user, order);
  const paddedNumber = order.orderNumberCount.toString().padStart(4, "0");

  await transporter.sendMail({
    from: `"Systém FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `NOVÁ OBJEDNÁVKA: ${user.lastName} (${paddedNumber})`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: ${darkBg}; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nová objednávka</h2>
          <p style="margin: 5px 0 0; opacity: 0.8;">ID: ${order.id}</p>
        </div>

        <div style="padding: 20px;">
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor};">Detail zákazníka</h3>
          <p style="line-height: 1.6;">
            <strong>Jméno:</strong> ${user.firstName} ${user.lastName}<br>
            <strong>E-mail:</strong> ${user.email}<br>
            <strong>Telefon:</strong> ${order.phone || "Neuvedeno"}
          </p>

          ${
            order.address
              ? `
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Doručovací údaje</h3>
          <p style="line-height: 1.6;">
            ${order.address}<br>
            ${order.zipCode} ${order.city}<br>
            ${order.country}
          </p>`
              : `<p style="color: #e67e22; font-weight: bold;">(Digitální dobití - bez dopravy)</p>`
          }

          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Položky objednávky</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 10px; font-weight: bold;">Celkový obrat</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; font-size: 16px;">
                ${order.totalPrice.toLocaleString("cs-CZ")} Kč
              </td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-left: 4px solid ${adminColor}; font-size: 13px;">
            <strong>Poznámka pro expedici:</strong> Pokud objednávka obsahuje fyzické karty, připravte je k odeslání. U dobití kreditu proběhla aktualizace v DB automaticky.
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `faktura_${order.id.slice(0, 8)}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf",
      },
    ],
  });
};
