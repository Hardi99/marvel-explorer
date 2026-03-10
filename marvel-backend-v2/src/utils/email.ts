import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Marvel Explorer <onboarding@resend.dev>';
const APP_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#111111;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#ec1d24;padding:22px 32px;">
            <span style="color:#ffffff;font-weight:900;font-size:26px;letter-spacing:-1px;text-transform:uppercase;font-family:Arial,sans-serif;">MARVEL</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#1a1a1a;padding:40px 32px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d0d0d;padding:20px 32px;border:1px solid rgba(255,255,255,0.05);border-top:none;">
            <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;text-align:center;">
              Marvel Explorer &nbsp;·&nbsp; Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#ec1d24;color:#ffffff;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;padding:14px 32px;text-decoration:none;font-family:Arial,sans-serif;">${label}</a>`;
}

export async function sendWelcomeEmail(to: string, username: string) {
  const content = `
    <div style="width:40px;height:3px;background:#ec1d24;margin-bottom:24px;"></div>
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;font-family:Arial,sans-serif;">
      Bienvenue, ${username}
    </h1>
    <p style="margin:0 0 32px;color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;">
      Ton compte Marvel Explorer est prêt. Explore des milliers de personnages et de comics de l'univers Marvel.
    </p>
    ${ctaButton(APP_URL, 'Explorer l\'univers Marvel')}
    <p style="margin:32px 0 0;color:rgba(255,255,255,0.2);font-size:12px;">
      Si tu n'es pas à l'origine de cette inscription, ignore cet email.
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Bienvenue sur Marvel Explorer',
    html: baseTemplate(content),
  });
}

export async function sendResetEmail(to: string, username: string, token: string) {
  const resetUrl = `${APP_URL}/user/reset-password?token=${token}`;

  const content = `
    <div style="width:40px;height:3px;background:#ec1d24;margin-bottom:24px;"></div>
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;font-family:Arial,sans-serif;">
      Réinitialisation
    </h1>
    <p style="margin:0 0 8px;color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;">
      Bonjour ${username}, une demande de réinitialisation de mot de passe a été faite pour ton compte.
    </p>
    <p style="margin:0 0 32px;color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;">
      Ce lien est valable <strong style="color:rgba(255,255,255,0.8);">1 heure</strong>.
    </p>
    ${ctaButton(resetUrl, 'Réinitialiser mon mot de passe')}
    <div style="margin-top:32px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
      <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;">
        Si tu n'as pas demandé cette réinitialisation, ignore cet email — ton mot de passe ne changera pas.
      </p>
    </div>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Réinitialisation de ton mot de passe',
    html: baseTemplate(content),
  });
}
