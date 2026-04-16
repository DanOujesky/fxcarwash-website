import { resend } from "../utils/mailer.js";

export const sendVerificationEmail = async (email: string, code: string) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";

  await resend.emails.send({
    from: `FX Carwash <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Ověřovací kód",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: ${darkBg}; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0; letter-spacing: 2px;">FX CARWASH</h2>
        </div>

        <div style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
          <h3 style="color: #333; margin-bottom: 10px;">Ověření identity</h3>
          <p style="color: #666; font-size: 15px; line-height: 1.5;">
            Obdrželi jsme žádost o obnovu hesla k Vašemu účtu. <br>
            Pro pokračování použijte prosím následující kód:
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px dashed ${brandColor};">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${darkBg}; font-family: monospace;">
              ${code}
            </span>
          </div>

          <p style="color: #999; font-size: 13px;">
            Platnost kódu je časově omezena. Pokud kód nevyužijete, vyprší.
          </p>
        </div>

        <div style="padding: 20px 30px; background-color: #fff8f8; border-top: 1px solid #ffecec; text-align: left;">
          <p style="margin: 0; font-size: 12px; color: #cc5c5c;">
            <strong>Pozor:</strong> Pokud jste o změnu hesla nežádali, tento e-mail prosím ignorujte a doporučujeme Vám změnit si stávající heslo. Nikomu tento kód nesdělujte.
          </p>
        </div>

        <div style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #999;">
          <p>© 2026 FX CarWash | Bezpečnostní upozornění</p>
        </div>
      </div>
    `,
  });
};
