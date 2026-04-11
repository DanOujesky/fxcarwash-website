import { User, Order, OrderItem } from "@prisma/client";
import { transporter } from "../utils/mailer";
import { generateInvoice } from "../services/invoiceService";
import { logger } from "../utils/logger.js";

const escapeHtml = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

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
      <strong style="color: #333;">${escapeHtml(item.name)}</strong>
    ${item.delivery ? `<br><small style="color: #666;">Množství: ${item.quantity} ks</small> <br><small style="color: #666;">Způsob dopravy: ${item.shipping === "cp" ? "Česká pošta" : "Osobní převzetí"}</small>` : ""}
    ${item.cardNumber ? `<br><small style="color: #666;">Číslo karty: ${escapeHtml(item.cardNumber)}</small>` : ""}
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
        ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}<br>
        ${escapeHtml(order.address)}, ${escapeHtml(order.zipCode)} ${escapeHtml(order.city)}<br>
        ${escapeHtml(order.country)}
      </p>
    </div>`
    : "";

  const invoicePdf: Buffer = await generateInvoice(user, order);

  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: `Potvrzení objednávky č. ${order.orderIdentifier}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="background: ${darkBg}; color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0;">FX CARWASH</h1>
          <p style="margin: 10px 0 0; opacity: 0.7;">Objednávka byla úspěšně přijata</p>
        </div>

        <div style="padding: 30px;">
          <p>Dobrý den,</p>
          <p>děkujeme za Váš nákup. Fakturu k dodanému zboží naleznete v příloze mailu. Shrnutí Vaší objednávky:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 12px; font-weight: bold;">Celková cena s DPH</td>
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
        filename: `faktura_${order.orderIdentifier}.pdf`,
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
        <strong style="color: #333;">${escapeHtml(item.name)}</strong>
        ${item.delivery ? `<br><small style="color: #666;">Množství: ${item.quantity} ks</small> <br><small style="color: #666;">Způsob dopravy: ${item.shipping === "cp" ? "Česká pošta" : "Osobní převzetí"}</small>` : ""}
        ${item.cardNumber ? `<br><small style="color: #666;">Číslo karty: ${escapeHtml(item.cardNumber)}</small>` : ""}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString("cs-CZ")} Kč
      </td>
    </tr>
`,
    )
    .join("");

  const invoicePdf: Buffer = await generateInvoice(user, order);

  await transporter.sendMail({
    from: `"Systém FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `NOVÁ OBJEDNÁVKA: ${user.lastName} (${order.orderIdentifier})`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: ${darkBg}; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nová objednávka</h2>
          <p style="margin: 5px 0 0; opacity: 0.8;">Číslo objednávky: ${order.orderIdentifier}</p>
        </div>

        <div style="padding: 20px;">
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor};">Detail zákazníka</h3>
          <p style="line-height: 1.6;">
            <strong>Jméno:</strong> ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}<br>
            <strong>E-mail:</strong> ${escapeHtml(user.email)}<br>
            <strong>Telefon:</strong> ${escapeHtml(order.phone) || "Neuvedeno"}
          </p>

          ${
            order.address
              ? `
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Doručovací údaje</h3>
          <p style="line-height: 1.6;">
            ${escapeHtml(order.address)}<br>
            ${escapeHtml(order.zipCode)} ${escapeHtml(order.city)}<br>
            ${escapeHtml(order.country)}
          </p>`
              : `<p style="color: #e67e22; font-weight: bold;">(Digitální dobití - bez dopravy)</p>`
          }

          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Položky objednávky</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 10px; font-weight: bold;">Celková cena s DPH</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; font-size: 16px;">
                ${order.totalPrice.toLocaleString("cs-CZ")} Kč
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `faktura_${order.orderIdentifier}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf",
      },
    ],
  });
};

export const sendLowStockAlert = async (remainingCards: number) => {
  logger.warn({ remainingCards }, "Odesílám upozornění na nízkou zásobu karet");

  await transporter.sendMail({
    from: `"Systém FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `⚠️ UPOZORNĚNÍ: Nízká zásoba karet (zbývá ${remainingCards} ks)`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f39c12; border-radius: 8px;">
        <div style="background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 7px 7px 0 0;">
          <h2 style="margin: 0;">⚠️ Nízká zásoba karet</h2>
        </div>
        <div style="padding: 20px;">
          <p>Zbývá pouze <strong>${remainingCards} karet</strong>.</p>
          <p style="color: #888; font-size: 13px;">Toto upozornění bylo odesláno automaticky systémem FX Carwash.</p>
        </div>
      </div>
    `,
  });
};

export const sendWaitlistAvailabilityEmail = async (
  firstName: string,
  email: string,
) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";

  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "FX Karty jsou opět skladem!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="background: ${darkBg}; color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0;">FX CARWASH</h1>
          <p style="margin: 10px 0 0; opacity: 0.7;">Karty jsou opět k dispozici</p>
        </div>

        <div style="padding: 30px;">
          <p>Dobrý den, ${firstName},</p>
          <p>
            Máme pro Vás skvělou zprávu — FX karty jsou opět <strong style="color: ${brandColor}">skladem</strong>!<br>
            Zaregistroval(a) jste se do pořadníku a nyní můžete svou objednávku dokončit.
          </p>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/nova-karta"
               style="background: ${brandColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               OBJEDNAT KARTU
            </a>
          </div>

          <p style="margin-top: 30px; color: #888; font-size: 13px;">
            Karty se mohou opět vyprodávat rychle, doporučujeme neotálet.
          </p>
        </div>

        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>F.X. Carwash s.r.o. | Podpora: sales@fxcarwash.cz</p>
        </div>
      </div>
    `,
  });
};

export const sendCardPoolEmptyAlert = async (order: any, item: any) => {
  logger.error(
    { orderId: order.id, itemId: item.id },
    "KRITICKÉ: Pool karet prázdný po platbě",
  );

  await transporter.sendMail({
    from: `"Systém FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `🚨 KRITICKÉ: Zákazník zaplatil ale karta není k dispozici! Objednávka ${order.orderIdentifier}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #e74c3c; border-radius: 8px;">
        <div style="background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
          <h2 style="margin: 0;">🚨 NUTNÁ OKAMŽITÁ AKCE</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Zákazník zaplatil objednávku, ale v poolu nejsou žádné karty k přiřazení!</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; color: #666;">Číslo objednávky:</td><td style="padding: 8px; font-weight: bold;">${order.orderIdentifier}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Zákazník:</td><td style="padding: 8px;">${order.user?.firstName} ${order.user?.lastName}</td></tr>
            <tr><td style="padding: 8px; color: #666;">E-mail zákazníka:</td><td style="padding: 8px;">${order.user?.email}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Položka:</td><td style="padding: 8px;">${item.name}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Kredit:</td><td style="padding: 8px;">${item.credit} Kč</td></tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #fff3f3; border-radius: 6px; border-left: 4px solid #e74c3c;">
            <strong>Co dělat:</strong>
            <ol style="margin: 10px 0 0;">
              <li>Okamžitě kontaktuj zákazníka (${order.user?.email})</li>
              <li>Doplň karty do poolu v databázi</li>
              <li>Manuálně přiřaď kartu a dobij kredit</li>
            </ol>
          </div>
        </div>
      </div>
    `,
  });
};
