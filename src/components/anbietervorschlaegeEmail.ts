/**
 * E-Mail „Verbund Pflegehilfe – Ihre Anbietervorschläge".
 * Gerenderte Fassung des Handlebars-Templates mit BEISPIELDATEN (Frau Müller,
 * Produkt „Treppenlift", ein Premium- und ein Nicht-Premium-Anbieter, Bewertungsbox).
 * Dient als zweite Mail in der Vergleichsansicht (Popup-Variante 4).
 * Tabellenbasiertes Layout + Inline-Styles (E-Mail-Client-kompatibel).
 */
export const ANBIETERVORSCHLAEGE_EMAIL_HTML = `<!doctype html>
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

<!-- Einstieg -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:22px; line-height:25px; color:#48453b; text-align:left; padding:5px 25px 10px 25px;">
<b><span style="color:#98c44c;">››</span> Ihre Anbietervorschläge</b>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:14px 25px 20px 25px;">
<b>Sehr geehrte Frau Müller,</b><br/><br/>
mein Name ist Mahmoud Halimeh. Wir haben gerade eben zum Thema Treppenlift und weiteren Möglichkeiten für ein selbstbestimmtes Leben im Alter gesprochen.
<br><br>Wie besprochen, gebe ich Ihnen im Folgenden einen Überblick über unsere Anbietervorschläge.
</td>
</tr>
</table>
</td>
</tr>

<!-- Übersicht -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="text-align:left; color:#98c44c; font-size:20px; line-height:25px; font-family:Arial,Helvetica,Tahoma,sans-serif; padding:0 25px 5px 25px;"><b>Übersicht der Anbietervorschläge</b></td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:5px 25px 5px 25px;">
Folgende Mitglieder haben uns <b>freie Kapazitäten</b> gemeldet. Die Anbieter werden sich in den nächsten Tagen bei Ihnen melden.
</td>
</tr>
</table>
</td>
</tr>

<!-- Produkt -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="text-align:left; color:#4c8ba5; font-size:20px; line-height:22px; font-family:Arial,Helvetica,Tahoma,sans-serif; padding:20px 25px 20px 25px;"><b>Treppenlift</b></td>
</tr>
</table>
</td>
</tr>

<!-- Anbieter 1: Premium -->
<tr>
<td style="background-color:white;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;">
<tr>
<td style="padding:0 10px 0 10px;">
<table align="center" border="0" cellpadding="1" cellspacing="0" width="100%" style="max-width:580px; background-color:#dbd7cc; padding:1px; border-radius:20px; margin-bottom:20px; box-shadow:3px 3px 10px rgba(0,0,0,0.2)"><tr><td align="center" valign="top" width="100%">
<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px; min-height:210px; background-color:#ffffff; border-radius:20px;"><tr><td align="left" valign="top" style="font-size:0;">
<div style="display:inline-block; vertical-align:top; width:180px;">
<table border="0" cellpadding="0" cellspacing="0" align="center" width="130" height="170" style="margin-top:20px; margin-left:20px; max-width:180px;">
<tr>
<td style="width:130px; height:170px;">
<img width="130" src="https://static.pflegehilfe.org/newsletter/logo-vp-186-59-1.png" alt="Sonilift GmbH" title="Sonilift GmbH" align="center" border="0" style="border:0;"/>
</td>
</tr>
</table>
</div>
<div style="display:inline-block; vertical-align:top;">
<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:360px; margin-bottom:16px;">
<tr>
<td style="padding:0 15px 6px 15px;">
<table align="center" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left;">
<table border="0" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:13px; color:#ffffff; text-align:center; background-color:#4c8ba5; padding:3px; border-radius:4px;" width="155"><b>Besonders&nbsp;empfohlen</b></td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:18px; line-height:23px; color:#48453b; text-align:left; padding:10px 12px 1px 6px;"><b>Sonilift GmbH</b></td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:34px; line-height:19px; text-align:left; padding:5px;">
<span style="color:#98c44c;">&#x2605;&#x2605;&#x2605;&#x2605;&#x2606;</span>
</td>
</tr>
<tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:12px; line-height:19px; text-align:left; padding:2px 0 2px 6px; color:#48453b;">128 Bewertungen</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="background-color:#4D8BA5; border-radius:5px; padding:1px;">
<a href="#">
<table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:white; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; color:#4D8BA5; line-height:19px; text-align:left; border-radius:5px;"><tr><td style="padding:16px 48px;"><b>Profil ansehen</b></td></tr></table>
</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td></tr></table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Anbieter 2: Nicht-Premium -->
<tr>
<td style="background-color:white;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;">
<tr>
<td style="padding:0 10px 0 10px;">
<table align="center" border="0" cellpadding="1" cellspacing="0" width="100%" style="max-width:580px; background-color:#dbd7cc; padding:1px; border-radius:20px; margin-bottom:20px; box-shadow:3px 3px 10px rgba(0,0,0,0.2)"><tr><td align="center" valign="top" width="100%">
<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px; background-color:#ffffff; border-radius:20px;">
<tr><td style="padding:20px 20px 10px 20px; max-width:580px;">
<a style="text-decoration:none; color:#48453b;" href="#" target="_blank" title="SANA Treppenlifte"><b>SANA Treppenlifte GmbH</b></a>
</td></tr>
<tr><td style="padding:0 20px 20px 20px;">
<a style="color:#4D8BA5; border-bottom:1px solid #4D8BA5;" href="#">&gt; Profil ansehen</a>
</td></tr>
</table>
</td></tr></table>
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

<!-- Bewertung -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:30px 25px 15px 25px;">
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; border-width:2px; border-style:solid; border-color:#4c8ba5;">
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:18px 20px 0 20px;">
<table align="left" border="0" cellpadding="0" cellspacing="0"><tbody><tr>
<td style="padding-right:10px; text-align:left;"><img width="38" src="https://static.pflegehilfe.org/newsletter/icons/icon-haendemitherz-38-28-1.png" alt="Herz" title="Herz" align="center" border="0" style="border:0;"/></td>
<td style="padding-top:4px; text-align:left; color:#4c8ba5; font-size:18px; line-height:23px; font-family:Arial,Helvetica,Tahoma,sans-serif;"><b>Waren Sie mit unserer Beratung zufrieden?</b></td>
</tr></tbody></table>
</td>
</tr>
<tr>
<td style="padding:10px 20px 0 20px; text-align:left; color:#48453b; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px;">Unser täglicher Antrieb ist es, Pflegebedürftige und deren Angehörige bestmöglich zu unterstützen. Deshalb bitten wir Sie, unseren <b>Beratungsservice zu bewerten</b>. Nur so können wir uns stetig verbessern.</td>
</tr>
<tr>
<td style="padding:14px 20px 22px 20px; text-align:center;">
<a href="#" style="font-size:40px; text-decoration:none; color:#98c44c; letter-spacing:6px;">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</a>
<div style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:12px; color:#48453b; padding-top:8px;">Jetzt Beratung bewerten</div>
</td>
</tr>
</table>
</td>
</tr>
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
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:19px; color:#48453b; text-align:left; padding:20px 25px 6px 25px;">
Ich hoffe, dass ich Ihnen mit diesen Informationen weiterhelfen konnte.
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

<!-- Über uns / Trustpilot -->
<tr>
<td style="background-color:#ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
<tr>
<td style="padding:24px 25px 6px 25px; text-align:center; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:18px; line-height:23px; color:#48453b;"><b>Verbund Pflegehilfe</b></td>
</tr>
<tr>
<td style="padding:0 25px 14px 25px; text-align:center; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:15px; line-height:21px; color:#98c44c;"><b>Ihr Ansprechpartner für ein selbstbestimmtes Leben im Alter</b></td>
</tr>
<tr>
<td style="padding:0 25px 18px 25px; text-align:center; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:14px; line-height:20px; color:#48453b;">
Als größte Pflegeberatung Deutschlands beraten wir Pflegebedürftige und Angehörige kostenlos zu einem selbstbestimmten Leben im Alter. Wir freuen uns, dass wir allein in den letzten fünf Jahren bereits über <b>1,3 Millionen Menschen</b> beraten durften.
</td>
</tr>
<tr>
<td style="padding:0 25px 6px 25px; text-align:center;">
<table align="center" border="0" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:20px; font-weight:bold; color:#48453b; padding-right:12px; vertical-align:middle;">Hervorragend</td>
<td style="vertical-align:middle;">
<table border="0" cellpadding="0" cellspacing="2"><tr>
<td style="background-color:#00b67a; color:#ffffff; font-size:20px; line-height:1; padding:4px;">&#x2605;</td>
<td style="background-color:#00b67a; color:#ffffff; font-size:20px; line-height:1; padding:4px;">&#x2605;</td>
<td style="background-color:#00b67a; color:#ffffff; font-size:20px; line-height:1; padding:4px;">&#x2605;</td>
<td style="background-color:#00b67a; color:#ffffff; font-size:20px; line-height:1; padding:4px;">&#x2605;</td>
<td style="background-color:#00b67a; color:#ffffff; font-size:20px; line-height:1; padding:4px;">&#x2605;</td>
</tr></table>
</td>
</tr></table>
</td>
</tr>
<tr>
<td style="padding:4px 25px 24px 25px; text-align:center; font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:13px; color:#48453b;">basierend auf 106.447 Bewertungen &nbsp; <b style="color:#00b67a;">&#x2605; Trustpilot</b></td>
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
Wenn Sie der Verarbeitung Ihrer Daten widersprechen möchten, können Sie uns jederzeit per E-Mail an <a href="mailto:datenschutz@pflegehilfe.de" style="color:#333333; text-decoration:underline;">datenschutz@pflegehilfe.de</a> kontaktieren.<br/><br/>
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
