/**
 * E-Mail-Template „Pflegehilfe Plus – Buchungsbestätigung und Zahlungsaufforderung".
 * Wird in Popup-Variante 4 nach dem Abschicken als Vorschau angezeigt.
 * Design (Header, Farben, Typo, Abschluss/Footer) übernommen aus der
 * „Ihre Anbietervorschläge"-Mail; Inhalte = Buchung/Zahlung.
 * Tabellenbasiertes Layout + Inline-Styles für maximale E-Mail-Client-Kompatibilität.
 */
export const PFLEGE_PLUS_EMAIL_HTML = `<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width"/>
<style>
@media only screen and (max-width: 569px) { div { margin-right: 0 !important; } }
a { color: #4c8ba5; text-decoration: none; }
table { border-collapse: collapse; }
td { border-collapse: collapse; }
</style>
</head>
<body style="width:100% !important; min-width:100%; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; background-color:#f2f4f7;">
<center>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="font-family:Arial,Helvetica,Tahoma,sans-serif; color:#48453b; text-align:left; padding:0; margin:0;">
<tr>
<td style="background-color:#f2f4f7; padding-top:20px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">

<!-- Header -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td align="left" style="text-align:left; vertical-align:middle; padding:20px 10px 15px 25px;"><img style="max-height:70px; max-width:90%; border:0;" src="https://static.pflegehilfe.org/newsletter/logo-vp-186-59-1.png" alt="Verbund Pflegehilfe" title="Verbund Pflegehilfe" /></td>
<td align="right" style="text-align:right; vertical-align:middle; padding:20px 25px 15px 10px;"><img style="max-height:65px; max-width:75%; border:0;" src="https://static.pflegehilfe.org/newsletter/tuev-siegel-133-70-2.png" alt="TÜV-zertifiziert" title="TÜV-zertifiziert" /></td>
</tr>
</table>
</td>
</tr>
<!-- Trennlinie -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr><td><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
<td style="padding:0 25px 12px 25px;">
<hr height="1" style="height:1px; border-width:0; color:#98c44c; background-color:#98c44c; margin:0;" />
</td>
</tr></table></td></tr>
</table>
</td>
</tr>

<!-- Überschrift -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:22px; line-height:27px; color:#48453b; text-align:left; padding:5px 25px 10px 25px;">
<b><span style="color:#98c44c;">››</span> Buchungsbestätigung und Zahlungsaufforderung</b>
</td>
</tr>
</table>
</td>
</tr>

<!-- Einstieg -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:14px 25px 20px 25px;">
<b>Guten Tag Anna Müller,</b><br/><br/>
vielen Dank für Ihr Vertrauen. Wir bestätigen hiermit die Buchung Ihrer <b>Vermittlungsgarantie</b> und starten ab sofort mit der individuellen Suche nach geeigneten Anbietern.
<br/><br/>
Wir setzen alles daran, eine passende Lösung für Sie zu erreichen. Gleichzeitig profitieren Sie von unserer <b>Geld-zurück-Garantie</b>, sodass Sie jederzeit auf der sicheren Seite sind.
</td>
</tr>
</table>
</td>
</tr>

<!-- Buchung im Überblick -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="text-align:left; color:#98c44c; font-size:20px; line-height:25px; font-family:Arial,Helvetica,Tahoma,sans-serif; padding:0 25px 5px 25px;"><b>Ihre Buchung im Überblick</b></td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:8px 25px 4px 25px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:550px; background-color:#ffffff; border:1px solid #dbd7cc; border-radius:12px;">
<tr><td style="padding:18px 20px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:20px; color:#48453b;">
<tr>
<td width="42%" style="padding:6px 0; vertical-align:top; font-weight:bold;">Kunde / Kundin</td>
<td style="padding:6px 0; vertical-align:top;">Anna Müller<br/>Musterstraße 12<br/>55116 Mainz</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Buchungsnummer</td>
<td style="padding:6px 0; vertical-align:top;">PHP-2026-000184</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Produkt</td>
<td style="padding:6px 0; vertical-align:top; color:#4c8ba5; font-weight:bold;">Vermittlungsgarantie (Pflegehilfe Plus)</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Buchungsdatum</td>
<td style="padding:6px 0; vertical-align:top;">10.07.2026</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Zahlungsstatus</td>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Offen</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Zahlungsfrist</td>
<td style="padding:6px 0; vertical-align:top;">Bitte begleichen Sie den Betrag bis zum <b>17.07.2026</b>.</td>
</tr>
</table>
</td></tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Gesamtbetrag -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:12px 25px 6px 25px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:550px;">
<tr>
<td style="background-color:#eef4e0; border-left:4px solid #98c44c; padding:14px 18px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:15px; color:#48453b;">
<b>Gesamtbetrag:</b> <span style="font-size:18px; font-weight:bold; color:#48453b;">99,00 €</span> inkl. 19 % USt.
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- CTA -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:12px 25px 6px 25px;">
<table align="left" border="0" cellpadding="0" cellspacing="0">
<tr>
<td align="center" bgcolor="#98c44c" style="border-radius:6px;">
<a href="#" onclick="if(window.parent&&window.parent.oeffnePflegehilfeLandingpage){window.parent.oeffnePflegehilfeLandingpage();return false;}" style="display:inline-block; padding:14px 30px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:6px;">Jetzt sicher bezahlen</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:8px 25px 20px 25px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:13px; line-height:18px; color:#8a887f;">
Verfügbare Zahlungsarten: PayPal, Überweisung, Kredit-/ Debitkarte.
</td>
</tr>
</table>
</td>
</tr>

<!-- Buchungsbeleg -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="text-align:left; color:#98c44c; font-size:20px; line-height:25px; font-family:Arial,Helvetica,Tahoma,sans-serif; padding:8px 25px 5px 25px;"><b>Buchungsbeleg</b></td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:8px 25px 4px 25px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:550px; background-color:#ffffff; border:1px solid #dbd7cc; border-radius:12px;">
<tr><td style="padding:18px 20px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:20px; color:#48453b;">
<tr>
<td width="42%" style="padding:6px 0; vertical-align:top; font-weight:bold;">Aussteller</td>
<td style="padding:6px 0; vertical-align:top;">VP Verbund Pflegehilfe GmbH<br/>Inge-Reitz-Straße 5–7<br/>55120 Mainz, Deutschland</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Ausstellungsdatum</td>
<td style="padding:6px 0; vertical-align:top;">10.07.2026</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Art der Leistung</td>
<td style="padding:6px 0; vertical-align:top;">Vermittlungsgarantie</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Gesamtbetrag brutto</td>
<td style="padding:6px 0; vertical-align:top; font-size:18px; font-weight:bold; color:#48453b;">99,00 €</td>
</tr>
<tr>
<td style="padding:6px 0; vertical-align:top; font-weight:bold;">Umsatzsteuersatz</td>
<td style="padding:6px 0; vertical-align:top;">inkl. 19 % USt.</td>
</tr>
</table>
</td></tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Beleg-Hinweis -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:10px 25px 16px 25px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:12px; line-height:18px; color:#8a887f;">
Diese E-Mail dient als Buchungsbestätigung, Zahlungsaufforderung und Beleg. Bitte bewahren Sie diese Nachricht gut auf.
</td>
</tr>
</table>
</td>
</tr>

<!-- Fragen? Wir sind für Sie da. -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:0 25px 18px 25px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:550px; background-color:#f2f4f7; border-radius:12px;">
<tr><td style="padding:18px 20px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:22px; color:#48453b;">
<b style="color:#48453b; font-size:18px; line-height:23px; display:inline-block; margin-bottom:6px;">Fragen? Wir sind für Sie da.</b><br/>
E-Mail: <a href="mailto:beratung@pflegehilfe.de" style="color:#4c8ba5;">beratung@pflegehilfe.de</a><br/>
<span style="font-size:13px; color:#8a887f;">Erreichbar: Mo–So von 8–20 Uhr</span>
</td></tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Abschluss / Signatur -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:6px 25px 6px 25px;">
Danke, dass Sie sich für Pflegehilfe Plus entschieden haben.
</td>
</tr>
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:12px 25px 20px 25px;">
Mit freundlichen Grüßen<br/>
<span style="color:#98c44c; font-weight:bold;">Mahmoud Halimeh</span><br/>
<b>Ihre persönliche Pflegeberatung</b>
</td>
</tr>
</table>
</td>
</tr>
<!-- Trennlinie -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr><td style="padding:0 25px 12px 25px;">
<hr height="1" style="height:1px; border-width:0; color:#98c44c; background-color:#98c44c; margin:0;" />
</td></tr>
</table>
</td>
</tr>
<!-- Kontaktzeile -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:6px 25px 20px 25px;">
<table align="left" border="0" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle; padding-right:24px;"><img style="max-height:52px; border:0;" src="https://static.pflegehilfe.org/newsletter/logo-vp-186-59-1.png" alt="Verbund Pflegehilfe" /></td>
<td style="vertical-align:middle; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:20px; color:#48453b;">
<b>06131 / 26 520 64</b><br/>
<span style="font-size:12px; color:#8a887f;">(Mo–So von 8–20 Uhr)</span><br/>
<a href="mailto:beratung@pflegehilfe.de" style="color:#4c8ba5;">beratung@pflegehilfe.de</a>
</td>
</tr></table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Trenner -->
<tr>
<td style="background-color:#f2f4f7;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr><td style="font-size:15px; line-height:17px; padding-top:3px;">&nbsp;</td></tr>
</table>
</td>
</tr>

<!-- Rechtlicher Footer -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:22px 25px 12px 25px; text-align:center; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:13px; color:#4c8ba5;">
<a href="#" style="color:#4c8ba5;">Datenschutz</a> &nbsp;|&nbsp;
<a href="#" style="color:#4c8ba5;">AGB</a> &nbsp;|&nbsp;
<a href="#" style="color:#4c8ba5;">Impressum</a>
</td>
</tr>
<tr>
<td style="padding:8px 25px 10px 25px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:12px; line-height:18px; color:#333333; text-align:left;">
VP Verbund Pflegehilfe GmbH | Inge-Reitz-Straße 5-7 | 55120 Mainz | Deutschland<br/>
Geschäftsführer: Johannes Haas, Michael Haas, Maximilian Haas<br/>
Sitz der Gesellschaft: Mainz, Rheinland Pfalz<br/>
Registergericht: Amtsgericht Frankfurt am Main | Registernummer: HRB 109505<br/>
Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE315652480
</td>
</tr>
<tr>
<td style="padding:8px 25px 28px 25px; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:12px; line-height:18px; color:#333333; text-align:left;">
Diese E-Mail könnte vertrauliche und/oder rechtlich geschützte Informationen enthalten. Wenn Sie nicht der richtige Adressat sind oder diese E-Mail irrtümlich erhalten haben, informieren Sie bitte sofort den Absender und vernichten Sie diese E-Mail. Das unerlaubte Kopieren sowie die unbefugte Weitergabe dieser E-Mail sind nicht gestattet.
</td>
</tr>
</table>
</td>
</tr>

</table>
</td>
</tr>
</table>
</center>
</body>
</html>`;

/** Ein Panel der Vergleichsansicht. */
export interface EmailVergleichPanel {
  label: string;
  html: string;
}

/**
 * Baut eine eigenständige HTML-Seite, die zwei E-Mails nebeneinander in je einem
 * <iframe> (srcdoc) zeigt – dunkler Header/Chrome, unter 900px untereinander.
 * Layout angelehnt an die „Alt vs. Neu"-Vergleichsseite.
 */
export function buildEmailVergleichHtml(
  links: EmailVergleichPanel,
  rechts: EmailVergleichPanel,
  landingpageHtml?: string,
): string {
  // Für das srcdoc-Attribut: & und " maskieren, damit der HTML-Inhalt beim
  // Parsen des Attributs 1:1 wiederhergestellt wird (Entities wie &euro; bleiben erhalten).
  const escapeSrcdoc = (html: string) =>
    html.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  // Wird vom „Jetzt sicher bezahlen"-Button in der linken Mail (per parent-Aufruf)
  // genutzt, um die Bezahl-Landingpage in einem neuen Tab zu öffnen.
  const landingpageSkript = landingpageHtml
    ? `<script>window.oeffnePflegehilfeLandingpage=function(){var w=window.open('','_blank');if(!w)return;w.document.open();w.document.write(${JSON.stringify(
        landingpageHtml,
      ).replace(/<\//g, '<\\/')});w.document.close();};</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>E-Mail-Vorschau: Vergleich</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #2b2f36; color: #fff; }
    header { padding: 12px 16px; background: #1e2228; border-bottom: 1px solid #3d4450; font-size: 14px; }
    .compare { display: flex; gap: 12px; padding: 12px; height: calc(100vh - 49px); }
    .panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .label { text-align: center; font-weight: bold; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; padding: 8px; border-radius: 6px 6px 0 0; }
    .label-a { background: #6b7280; }
    .label-b { background: #98c44c; color: #2b2f36; }
    iframe { flex: 1; width: 100%; border: none; background: #ffffff; border-radius: 0 0 6px 6px; }
    @media (max-width: 900px) { .compare { flex-direction: column; height: auto; } iframe { min-height: 70vh; } }
  </style>
</head>
<body>
  <header>E-Mail-Vorschau: Vergleich</header>
  <div class="compare">
    <div class="panel">
      <div class="label label-a">${links.label}</div>
      <iframe srcdoc="${escapeSrcdoc(links.html)}" title="${links.label}"></iframe>
    </div>
    <div class="panel">
      <div class="label label-b">${rechts.label}</div>
      <iframe srcdoc="${escapeSrcdoc(rechts.html)}" title="${rechts.label}"></iframe>
    </div>
  </div>
  ${landingpageSkript}
</body>
</html>`;
}
