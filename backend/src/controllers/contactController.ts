import { Request, Response } from "express";
import { resend } from "../utils/mailer.js";
import { logger } from "../utils/logger.js";

export const sendContactEmail = async (req: Request, res: Response) => {
  const { email, telephone, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: `FX Carwash web <${process.env.EMAIL_FROM}>`,
      to: process.env.FXCARWASH_EMAIL!,
      replyTo: email,
      subject: `Nová zpráva z kontaktního formuláře`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background: #252525; color: white; padding: 24px 28px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Nová zpráva z webu</h2>
          </div>
          <div style="padding: 28px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #666; width: 110px; vertical-align: top;">E-mail:</td>
                <td style="padding: 10px 0; color: #111; font-weight: 500;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666; vertical-align: top;">Telefon:</td>
                <td style="padding: 10px 0; color: #111; font-weight: 500;">${telephone}</td>
              </tr>
              <tr style="border-top: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666; vertical-align: top;">Zpráva:</td>
                <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f4f4f4; padding: 14px 28px; font-size: 12px; color: #888;">
            Odesláno přes kontaktní formulář na fxcarwash.cz
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error({ error }, "Resend API vrátila chybu");
      return res.status(500).json({ error: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu." });
    }

    logger.info({ email, messageId: data?.id }, "Kontaktní formulář odeslán");
    res.status(200).json({ status: "success", message: "Zpráva byla úspěšně odeslána." });
  } catch (err: any) {
    logger.error({ err, message: err?.message }, "Chyba při odesílání kontaktního emailu");
    res.status(500).json({ error: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu." });
  }
};
