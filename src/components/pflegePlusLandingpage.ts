/**
 * Bezahl-Landingpage „Pflegehilfe Plus" (CTA: „Zahlungsmethode auswählen").
 * Wird geöffnet, wenn in der Buchungs-Mail (Popup-Variante 4) auf
 * „Jetzt sicher bezahlen" geklickt wird. Self-contained HTML (eigener Tab).
 * Dem Referenz-Screenshot nachempfunden; Zahlungs-/Marken-Logos als schlichte
 * Text-/CSS-Nachbildungen, damit die Seite ohne externe Assets funktioniert.
 */
export const PFLEGE_PLUS_LANDINGPAGE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Pflegehilfe Plus – Sicher bezahlen</title>
<style>
  :root{ --gruen:#8cbf3f; --gruen-d:#7ab648; --text:#48453b; --muted:#8a887f; --line:#e6e6e6; --tp:#00b67a; }
  *{ box-sizing:border-box; }
  body{ margin:0; font-family:Arial,Helvetica,Tahoma,sans-serif; color:var(--text); background:#ffffff; }
  img{ border:0; }

  /* Topbar (Header wie Screenshot; Logo/TÜV/Trustpilot-Sterne wie in den Mails) */
  .topbar{ display:flex; align-items:center; justify-content:center; gap:120px; padding:12px 28px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .topbar .logo{ height:42px; }
  .tb-mid{ text-align:center; font-size:12px; color:var(--muted); line-height:1.5; }
  .tb-mid .kb{ color:var(--gruen-d); font-weight:bold; }
  .tb-mid .phone{ font-size:19px; font-weight:bold; color:var(--text); }
  .tb-mid .phone .ic{ color:var(--gruen-d); }
  .tb-right{ display:flex; align-items:center; gap:18px; }
  .tp{ text-align:center; font-size:13px; color:var(--text); line-height:1.5; }
  .tp .hd{ font-weight:bold; margin-right:6px; }
  .tp .stars{ display:inline-flex; gap:2px; vertical-align:middle; }
  .tp .stars span{ background:var(--tp); color:#fff; font-size:14px; line-height:1; padding:3px; }
  .tp .sub{ display:block; font-size:11px; color:var(--muted); margin-top:4px; }
  .tp .sub a{ text-decoration:underline; color:var(--muted); }
  .tp .sub .tpname{ color:var(--tp); font-weight:bold; }
  .tuev-img{ height:48px; }

  /* Hero */
  .hero{ position:relative; padding:44px 28px 54px; background:linear-gradient(120deg,#eef1f3 0%,#e7edf1 45%,#cfe0e6 78%,#bcd3d6 100%); overflow:hidden; }
  .hero::after{ content:""; position:absolute; right:0; top:0; bottom:0; width:46%; background:linear-gradient(180deg,#a9c7d6 0%,#8fb6c6 55%,#7aa38f 100%); opacity:.55; clip-path:polygon(22% 0,100% 0,100% 100%,0 100%); }
  .hero-inner{ position:relative; z-index:1; max-width:1080px; margin:0 auto; }
  .ph-logo{ display:inline-flex; align-items:center; gap:11px; margin-bottom:26px; }
  .ph-logo .word{ font-family:Georgia,'Times New Roman',serif; font-style:normal; font-weight:600; font-size:36px; line-height:1; color:#6c6a63; letter-spacing:.2px; }
  .ph-logo .plus{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:10px; background:var(--gruen); color:#fff; font-size:30px; font-weight:bold; line-height:1; font-family:Arial,Helvetica,sans-serif; padding-bottom:3px; }
  .hero h1{ margin:0 0 14px; font-size:30px; line-height:1.25; color:#3d3a32; max-width:560px; }
  .hero p{ margin:0; font-size:17px; color:#5b5849; }

  /* Content */
  .wrap{ max-width:520px; margin:0 auto; padding:34px 20px 60px; }
  .center{ text-align:center; }
  h2.section{ font-size:20px; color:var(--text); text-align:center; margin:0 0 22px; }

  .pay{ display:flex; align-items:center; gap:14px; border:1px solid #d7dade; border-radius:10px; padding:16px 18px; margin-bottom:12px; cursor:pointer; }
  .pay.sel{ border-color:var(--gruen); box-shadow:0 0 0 1px var(--gruen) inset; }
  .radio{ width:20px; height:20px; border-radius:50%; border:2px solid #c3c7cc; flex:0 0 auto; }
  .pay.sel .radio{ border-color:var(--gruen); background:radial-gradient(circle at center, var(--gruen) 0 6px, #fff 7px 20px); }
  .pay .name{ flex:1; font-size:15px; color:var(--text); }
  .pay .brand{ font-weight:bold; font-size:16px; }
  .paypal .pp1{ color:#003087; } .paypal .pp2{ color:#009cde; }
  .sepa{ color:#1a3d7c; font-style:italic; font-weight:bold; }
  .cards{ display:inline-flex; gap:6px; align-items:center; }
  .cc{ width:30px; height:20px; border-radius:3px; display:inline-block; }
  .cc.mc{ background:linear-gradient(90deg,#eb001b 0 50%,#f79e1b 50% 100%); }
  .cc.visa{ background:#1a1f71; color:#fff; font-size:10px; font-weight:bold; text-align:center; line-height:20px; font-style:italic; }

  .sum{ display:flex; align-items:flex-end; justify-content:space-between; margin:22px 2px 4px; }
  .sum .l b{ font-size:16px; } .sum .l div{ font-size:12px; color:var(--muted); margin-top:3px; }
  .sum .r{ text-align:right; } .sum .r .eur{ font-size:11px; color:var(--muted); } .sum .r .amt{ font-size:20px; font-weight:bold; }

  .cta{ display:block; width:100%; text-align:center; background:var(--gruen); color:#fff; font-size:17px; font-weight:bold; border:none; border-radius:10px; padding:16px; margin:16px 0 14px; cursor:pointer; }
  .cta:hover{ background:var(--gruen-d); }

  .badges{ display:flex; justify-content:center; gap:26px; flex-wrap:wrap; font-size:12px; color:#5b5849; }
  .badges .b{ display:flex; align-items:center; gap:7px; } .badges .ic{ color:var(--gruen); font-size:15px; }

  /* Testimonials */
  .reviews{ background:#fafbfc; border-top:1px solid var(--line); padding:34px 20px 44px; }
  .reviews h2{ text-align:center; font-size:20px; margin:0 0 22px; }
  .rev-row{ display:flex; gap:14px; overflow-x:auto; max-width:960px; margin:0 auto; padding:4px; }
  .rev{ flex:0 0 210px; background:#fff; border:1px solid #eaeaea; border-radius:8px; padding:14px; box-shadow:0 1px 3px rgba(0,0,0,.05); }
  .rev .rs span{ background:var(--tp); color:#fff; font-size:11px; padding:2px; margin-right:1px; }
  .rev .verif{ font-size:10px; color:var(--muted); margin:6px 0 8px; } .rev .verif b{ color:var(--tp); }
  .rev .t{ font-weight:bold; font-size:13px; margin-bottom:5px; }
  .rev .x{ font-size:12px; color:#5b5849; line-height:1.45; }
  .rev .n{ font-size:11px; color:var(--muted); margin-top:10px; }
  .rev-foot{ text-align:center; font-size:12px; color:var(--muted); margin-top:20px; }
  .rev-foot b{ color:var(--tp); }
  @media (max-width:640px){ .hero h1{ font-size:24px; } .hero::after{ display:none; } }

  /* Footer (nachgebaut von pflegehilfe.org) */
  .site-footer{ background:#4e7d8f; color:#ffffff; padding:44px 24px 0; }
  .sf-cols{ max-width:1120px; margin:0 auto; display:flex; flex-wrap:wrap; gap:36px; align-items:flex-start; }
  .sf-col{ flex:1 1 240px; min-width:220px; }
  .sf-col h4{ margin:22px 0 12px; font-size:15px; font-weight:bold; color:#ffffff; }
  .sf-col h4:first-child{ margin-top:0; }
  .sf-col a{ display:block; color:#eaf1f4; font-size:13px; padding:5px 0; }
  .sf-col a:hover{ color:#ffffff; text-decoration:underline; }
  /* Kontakt-/Fotokarte */
  .sf-card{ border:1px solid rgba(255,255,255,.5); border-radius:4px; padding:8px; margin-bottom:22px; max-width:290px; }
  .sf-photo{ height:150px; border-radius:2px; background:linear-gradient(135deg,#7a5a52 0%,#9a7d6e 45%,#c8b7a6 100%); }
  .sf-card .sf-contact-line{ font-size:13px; color:#eaf1f4; padding:10px 6px 2px; }
  .sf-card .sf-contact-line + .sf-contact-line{ padding-top:6px; }
  /* Trust-Badges rechts */
  .sf-badges{ flex:0 0 150px; display:flex; flex-direction:column; gap:16px; }
  .sf-badge{ background:#ffffff; color:#333; border-radius:4px; padding:10px 12px; text-align:center; font-size:11px; }
  .sf-badge .tpttl{ color:var(--tp); font-weight:bold; font-size:12px; }
  .sf-badge .tpstars{ display:inline-flex; gap:2px; margin:6px 0; }
  .sf-badge .tpstars span{ background:var(--tp); color:#fff; font-size:14px; line-height:1; padding:3px; }
  .sf-badge .muted{ color:#6b7280; }
  .sf-badge a{ color:#4c8ba5; text-decoration:underline; }
  .sf-badge img{ max-width:100%; height:auto; }
  .sf-badge.pe .pe-top{ font-size:10px; color:#6b7280; border-bottom:1px solid #e5e5e5; padding-bottom:5px; margin-bottom:6px; }
  .sf-badge.pe .pe-mid{ background:#12b5c9; color:#fff; font-weight:bold; padding:8px 4px; border-radius:2px; line-height:1.2; }
  .sf-badge.pe .pe-mid b{ display:block; font-size:15px; }
  /* Rechtsleiste */
  .sf-bar{ max-width:1120px; margin:32px auto 0; padding:22px 0 30px; border-top:1px solid rgba(255,255,255,.3); display:flex; flex-wrap:wrap; justify-content:space-between; gap:20px; }
  .sf-bar-left{ flex:1 1 560px; }
  .sf-legal{ font-size:14px; margin-bottom:14px; }
  .sf-legal a{ color:#ffffff; } .sf-legal a:hover{ text-decoration:underline; }
  .sf-fine{ font-size:11px; line-height:1.6; color:#d6e2e7; max-width:760px; }
  .sf-rating{ font-size:11px; color:#c9a96a; margin-top:12px; }
  .sf-bar-right{ display:flex; align-items:flex-end; gap:12px; }
  .sf-seal{ width:56px; height:56px; border-radius:50%; background:#ffffff; display:flex; align-items:center; justify-content:center; font-size:9px; color:#4e7d8f; text-align:center; line-height:1.15; padding:6px; }
  .sf-tools{ display:flex; gap:10px; align-self:flex-end; }
  .sf-tools span{ width:34px; height:34px; border-radius:50%; border:1px solid rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:15px; }
</style>
</head>
<body>

<!-- Topbar (Header) -->
<div class="topbar">
  <img class="logo" src="https://static.pflegehilfe.org/newsletter/logo-vp-186-59-1.png" alt="Verbund Pflegehilfe"/>
  <div class="tb-mid">
    <span class="kb">Kostenlose Pflegeberatung:</span><br/>
    <span class="phone"><span class="ic">&#9742;</span> 06131/49 32 039</span><br/>
    Mo – So von 8:00 bis 20:00 Uhr
  </div>
  <div class="tb-right">
    <div class="tp">
      <div><span class="hd">Hervorragend</span> <span class="stars"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></span></div>
      <div class="sub"><a href="#">95.190 Bewertungen auf</a> <span class="tpname">&#x2605; Trustpilot</span></div>
    </div>
    <img class="tuev-img" src="https://static.pflegehilfe.org/newsletter/tuev-siegel-133-70-2.png" alt="TÜV Saarland – Sehr gut, Kundenzufriedenheit"/>
  </div>
</div>

<!-- Hero -->
<div class="hero">
  <div class="hero-inner">
    <div class="ph-logo"><span class="word">Pflegehilfe</span><span class="plus">+</span></div>
    <h1>Wir haben uns auf die Suche nach der passenden Lösung für Sie begeben.</h1>
    <p>Unsere Vermittlungsgarantie – Ihre Sicherheit.</p>
  </div>
</div>

<!-- Bezahlung -->
<div class="wrap">
  <h2 class="section">Gebuchte Vermittlungsgarantie sicher und bequem bezahlen:</h2>

  <div class="pay paypal">
    <span class="radio"></span>
    <span class="name">PayPal</span>
    <span class="brand"><span class="pp1">Pay</span><span class="pp2">Pal</span></span>
  </div>

  <div class="pay sel">
    <span class="radio"></span>
    <span class="name">Sepa Lastschrift</span>
    <span class="brand sepa">SEPA</span>
  </div>

  <div class="pay">
    <span class="radio"></span>
    <span class="name">Kredit-/Debitkarte</span>
    <span class="cards"><span class="cc mc"></span><span class="cc visa">VISA</span></span>
  </div>

  <div class="sum">
    <div class="l"><b>Gesamtsumme</b><div>Inklusive 15,81 € MwSt.</div></div>
    <div class="r"><span class="eur">EUR</span> <span class="amt">99,00 €</span></div>
  </div>

  <button type="button" class="cta">Zahlungsmethode auswählen</button>

  <div class="badges">
    <div class="b"><span class="ic">&#x2605;</span> 88.000+ erfolgreiche Vermittlungen pro Monat</div>
    <div class="b"><span class="ic">&#10003;</span> 100 % SSL-verschlüsselt</div>
  </div>
</div>

<!-- Kundenstimmen -->
<div class="reviews">
  <h2>Die am besten bewertete Pflegeberatung Deutschlands</h2>
  <div class="rev-row">
    <div class="rev">
      <div class="rs"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></div>
      <div class="verif">&#10003; <b>Auf Einladung</b></div>
      <div class="t">Engagiert und kompetent</div>
      <div class="x">Engagiert und kompetent. Freundliches Personal, schnelle Rückmeldung.</div>
      <div class="n">Brigitte, vor 14 Minuten</div>
    </div>
    <div class="rev">
      <div class="rs"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></div>
      <div class="verif">&#10003; <b>Auf Einladung</b></div>
      <div class="t">Schnell und kompetent</div>
      <div class="x">Schnell und kompetent. Geht gleich ins Detail. Sofort Angebote bekommen.</div>
      <div class="n">Gudrun Meißvoll, vor 33 Minuten</div>
    </div>
    <div class="rev">
      <div class="rs"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></div>
      <div class="verif">&#10003; <b>Auf Einladung</b></div>
      <div class="t">Wir konnten kurz und konkret …</div>
      <div class="x">Wir konnten kurz und konkret alles Nötige besprechen. Sehr hilfreich.</div>
      <div class="n">Werner, vor 41 Minuten</div>
    </div>
    <div class="rev">
      <div class="rs"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></div>
      <div class="verif">&#10003; <b>Auf Einladung</b></div>
      <div class="t">Das Gespräch war in Ordnung.</div>
      <div class="x">Das Gespräch war in Ordnung. Freundlich und sachlich.</div>
      <div class="n">Susanne Wagner, vor 46 Minuten</div>
    </div>
  </div>
  <div class="rev-foot">Bewertet mit 4,8 von 5, basierend auf 103.351 Bewertungen. Echte, unabhängige 4-5-Sterne-Bewertungen. &nbsp;<b>&#x2605; Trustpilot</b></div>
</div>

<!-- Footer (pflegehilfe.org) -->
<footer class="site-footer">
  <div class="sf-cols">

    <!-- Spalte 1: Foto/Kontakt-Karte + Weitere Services -->
    <div class="sf-col">
      <div class="sf-card">
        <div class="sf-photo"></div>
        <div class="sf-contact-line">&#9742; 06131/49 32 039 – Täglich, 8 - 20 Uhr</div>
        <div class="sf-contact-line">&#9993; info@pflegehilfe.de</div>
      </div>
      <h4>Weitere Services</h4>
      <a href="#">&raquo; Kostenloser Pflegegrad-Rechner</a>
      <a href="#">&raquo; Beratung zu Pflege & Barrierefreiheit</a>
      <a href="#">&raquo; Alle Zuschuss-Informationen erhalten</a>
    </div>

    <!-- Spalte 2: Verbund / Presse / Pflegedienstleister -->
    <div class="sf-col">
      <h4>Mehr zum Verbund Pflegehilfe</h4>
      <a href="#">&raquo; Über den Verbund Pflegehilfe</a>
      <a href="#">&raquo; Karriereportal</a>
      <a href="#">&raquo; Kostenloser Pflege-Newsletter</a>
      <h4>Presse & Expertenrat</h4>
      <a href="#">&raquo; Pressebereich</a>
      <a href="#">&raquo; Die Verbund Pflegehilfe Experten</a>
      <h4>Für Pflegedienstleister</h4>
      <a href="#">&raquo; Mitglied im Verbund werden</a>
      <a href="#">&raquo; Entlass-Manager für Sozialdienste</a>
    </div>

    <!-- Trust-Badges rechts -->
    <div class="sf-badges">
      <div class="sf-badge">
        <div class="tpttl">&#x2605; Trustpilot</div>
        <div class="tpstars"><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span><span>&#x2605;</span></div>
        <div><b>TrustScore 4.8</b></div>
        <div><a href="#">99.465 Bewertungen</a></div>
      </div>
      <div class="sf-badge">
        <img src="https://static.pflegehilfe.org/newsletter/tuev-siegel-133-70-2.png" alt="TÜV Saarland – Sehr gut, Kundenzufriedenheit"/>
      </div>
      <div class="sf-badge pe">
        <div class="pe-top">Kundenmeinungen der letzten 12 Monate</div>
        <div class="pe-mid">TOP<br/><b>DIENSTLEISTER</b>2024</div>
        <div class="muted" style="margin-top:6px;">&#10003; Proven Expert</div>
      </div>
    </div>

  </div>

  <!-- Rechtsleiste -->
  <div class="sf-bar">
    <div class="sf-bar-left">
      <div class="sf-legal"><a href="#">Impressum</a> | <a href="#">AGB</a> | <a href="#">Datenschutz</a> | <a href="#">Barrierefreiheitserklärung</a></div>
      <div class="sf-fine">Wir möchten alle Menschen gleichermaßen ansprechen und beraten. Auf pflegehilfe.org wird aus Gründen der besseren Lesbarkeit das generische Maskulinum verwendet. Die Ansprache bezieht sich immer zugleich auf weibliche, männliche und diverse Personen.</div>
      <div class="sf-rating">Verbund Pflegehilfe hat 4,80 von 5 Sternen | 102055 Bewertungen auf ProvenExpert.com</div>
    </div>
    <div class="sf-bar-right">
      <div class="sf-seal">Transparenter Datenschutz</div>
      <div class="sf-seal">CO&#8322; neutrale</div>
      <div class="sf-tools"><span>&#128269;</span><span>&#8963;</span></div>
    </div>
  </div>
</footer>

<script>
(function(){
  var btn = document.querySelector('.cta');
  var wrap = document.querySelector('.wrap');
  if(!btn || !wrap){ return; }
  btn.addEventListener('click', function(){
    // Design der Landingpage (Header/Hero/Footer) bleibt; nur der weiße Bereich wird ersetzt.
    wrap.innerHTML =
      '<div style="text-align:center; padding:34px 0 44px;">' +
        '<div style="width:80px; height:80px; border-radius:50%; background:#8cbf3f; color:#fff; font-size:44px; line-height:80px; margin:0 auto 26px;">&#10003;</div>' +
        '<h1 style="font-family:Arial,Helvetica,Tahoma,sans-serif; font-size:26px; line-height:1.35; color:#3d3a32; margin:0;">Vielen Dank für die fristgerechte Zahlung.</h1>' +
      '</div>';
    window.scrollTo(0,0);
  });
})();
</script>

</body>
</html>`;
