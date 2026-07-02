import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './AnfrageSitzlift.css';
import { isCrmAdminUser } from '../config/crmAdmin';
import Dashboard from './Dashboard';

// SelectField Component für Single- und Multiselect
interface SelectFieldProps {
  name: string;
  value: string | string[];
  onChange: (name: string, value: string | string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  multiple?: boolean;
  label: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Auswählen',
  multiple = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [];
  const singleValue = multiple ? '' : (typeof value === 'string' ? value : '');

  // Schließe Dropdown wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        // Entfernen wenn bereits ausgewählt
        onChange(name, currentValues.filter(v => v !== optionValue));
      } else {
        // Hinzufügen
        onChange(name, [...currentValues, optionValue]);
      }
    } else {
      onChange(name, optionValue);
      setIsOpen(false);
    }
  };

  const removeSelected = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(name, value.filter(v => v !== valueToRemove));
    } else if (!multiple) {
      // Für Single-Select: Wert zurücksetzen
      onChange(name, '');
    }
  };

  const getSelectedLabel = () => {
    if (multiple) {
      return selectedValues.length > 0 ? `${selectedValues.length} ausgewählt` : '';
    } else {
      const selectedOption = options.find(opt => opt.value === singleValue);
      return selectedOption ? selectedOption.label : '';
    }
  };

  const getSelectedTags = () => {
    if (multiple) {
      return selectedValues.map(val => {
        const option = options.find(opt => opt.value === val);
        return { value: val, label: option?.label || val };
      });
    } else {
      if (singleValue) {
        const option = options.find(opt => opt.value === singleValue);
        return option ? [{ value: singleValue, label: option.label }] : [];
      }
      return [];
    }
  };

  const selectedTags = getSelectedTags();

  return (
    <div className={`form-group ${multiple ? 'multiselect-group' : 'singleselect-group'}`}>
      <label>{label}</label>
      <div className="custom-multiselect-wrapper" ref={dropdownRef}>
        <div 
          className={`custom-multiselect ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
        >
          <div className="multiselect-input">
            {selectedTags.length > 0 ? (
              <div className="tags-container">
                {selectedTags.map(tag => (
                  <span key={tag.value} className="input-tag">
                    {tag.label}
                    <button
                      type="button"
                      onClick={(e) => removeSelected(e, tag.value)}
                      className="tag-remove-btn"
                      aria-label="Entfernen"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="placeholder-text">{placeholder}</span>
            )}
          </div>
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isOpen && (
          <div className="dropdown-menu">
            {options.map(option => {
              const isSelected = multiple 
                ? selectedValues.includes(option.value)
                : singleValue === option.value;
              return (
                <div
                  key={option.value}
                  className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className="checkbox-indicator">
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Gesprächsguidance-Komponente
interface GuidanceTip {
  title: string;
  question?: string;
  followUp?: string;
  tip?: string;
}

interface GuidanceGroup {
  title: string;
  items?: string[];
  entries?: { title: string; text: string }[];
  collapsible?: boolean;
}

interface GuidanceSection {
  id: string;
  title: string;
  icon: string;
  tips?: GuidanceTip[];
  groups?: GuidanceGroup[];
}

const guidanceData: GuidanceSection[] = [
  {
    id: 'klient',
    title: 'Klient / Interessent',
    icon: '👤',
    tips: [
      {
        title: 'Anrede & Name',
        question: 'Wie darf ich Sie ansprechen? Frau oder Herr?',
        followUp: 'Können Sie mir bitte Ihren vollständigen Namen nennen?',
        tip: 'Höflich nachfragen und auf akademische Titel achten.'
      },
      {
        title: 'Kontaktdaten',
        question: 'Unter welcher E-Mail-Adresse kann ich Sie erreichen?',
        followUp: 'Welche Telefonnummer ist für Rückfragen am besten erreichbar?',
        tip: 'Mehrere Kontaktmöglichkeiten erfragen für bessere Erreichbarkeit.'
      },
      {
        title: 'Interner Kommentar',
        question: 'Gibt es noch wichtige Informationen, die ich wissen sollte?',
        tip: 'Besondere Umstände, Terminwünsche oder Anmerkungen notieren.'
      }
    ]
  },
  {
    id: 'senior',
    title: 'Bedarfsermittlung',
    icon: '👴',
    groups: [
      {
        title: 'Vorwandbehandlung',
        collapsible: true,
        entries: [
          {
            title: 'Hat sich erledigt',
            text: 'Das freut mich zu hören. Welche **Lösung** haben Sie denn gefunden? Haben Sie sich **passende Vergleichsangebote** einholen können?'
          },
          {
            title: 'Keine Zeit',
            text: 'Da verstehe ich Sie. Ich möchte nur sichergehen, dass die **pflegerische Versorgung** bestmöglich sichergestellt ist. Wie ist denn die **aktuelle Versorgung** gewährleistet?'
          },
          {
            title: 'Keine Erinnerung',
            text: 'Wir sind eine **kostenfreie Pflegeberatung**. Wir helfen Ihnen, die **pflegerische Versorgung** sicherzustellen. Wie sieht denn die **Pflegesituation** aktuell aus?'
          },
          {
            title: 'Kein Interesse',
            text: 'Danke für Ihre Offenheit. Wir haben die Erfahrung gemacht, dass viele unserer Klienten nicht wissen, was Ihnen mit einem **Pflegegrad** alles zusteht. Welche **Unterstützungsleistungen** nutzen Sie bereits?'
          }
        ]
      }
    ]
  },
  {
    id: 'weiterleitung',
    title: 'Weiterleitung',
    icon: '➡️',
    groups: [
      {
        title: 'Vorwandbehandlung',
        collapsible: true,
        entries: [
          {
            title: 'Hat sich erledigt',
            text: 'Das freut mich zu hören. Welche **Lösung** haben Sie denn gefunden? Haben Sie sich **passende Vergleichsangebote** einholen können?'
          },
          {
            title: 'Keine Zeit',
            text: 'Da verstehe ich Sie. Ich möchte nur sichergehen, dass die **pflegerische Versorgung** bestmöglich sichergestellt ist. Wie ist denn die **aktuelle Versorgung** gewährleistet?'
          },
          {
            title: 'Keine Erinnerung',
            text: 'Wir sind eine **kostenfreie Pflegeberatung**. Wir helfen Ihnen, die **pflegerische Versorgung** sicherzustellen. Wie sieht denn die **Pflegesituation** aktuell aus?'
          },
          {
            title: 'Kein Interesse',
            text: 'Danke für Ihre Offenheit. Wir haben die Erfahrung gemacht, dass viele unserer Klienten nicht wissen, was Ihnen mit einem **Pflegegrad** alles zusteht. Welche **Unterstützungsleistungen** nutzen Sie bereits?'
          }
        ]
      },
      {
        title: 'Bedarfsermittlung',
        entries: [
          {
            title: 'Senior',
            text: [
              'Wie sieht denn die **Pflegesituation** aktuell bei Ihnen aus?',
              'Welche **körperlichen Einschränkungen** liegen vor?',
              'Wie wird die **pflegerische Versorgung** aktuell gewährleistet?',
              'Welcher **Pflegegrad** liegt aktuell vor und gab es zuletzt eine **Veränderung**?',
              'Welche **Sturzgefahren** gibt es aktuell im Wohnbereich, die den Alltag erschweren?'
            ].join('\n\n')
          }
        ]
      },
      {
        title: 'Einwandbehandlung',
        entries: [
          {
            title: 'Zu teuer',
            text: 'Das verstehe ich gut. Die **Kosten** sind für viele ein wichtiger Punkt. Genau deshalb ist es sinnvoll, die **Zuschüsse der Pflegekasse** zu nutzen und mehrere **unverbindliche Angebote** zu vergleichen, damit Sie eine **bezahlbare Lösung** finden. Was halten Sie davon, erst einmal kostenfrei Angebote einzuholen und in Ruhe zu vergleichen?'
          },
          {
            title: 'Zu früh',
            text: 'Das kann ich gut nachvollziehen. Das sagen viele, solange noch alles einigermaßen gut läuft. Genau deshalb ist **Vorsorge** so wichtig. Denn falls plötzlich etwas passiert, hat man oft keine Zeit mehr, um in Ruhe zu vergleichen. Deswegen ist jetzt das **Einholen von Angeboten** für eine gute Vorsorge wichtig. Was halten Sie davon?'
          },
          {
            title: 'Zeit zum Nachdenken',
            text: 'Das ist absolut verständlich. Niemand möchte vorschnell wichtige **Entscheidungen** treffen. Genau deshalb geht es heute ja nicht um eine **finale Entscheidung**, sondern erst einmal um **unverbindliche Angebote**, die Ihnen die Möglichkeit für eine gute Entscheidung geben. Was halten Sie davon?'
          },
          {
            title: 'Senior möchte nicht',
            text: 'Das kann ich gut verstehen, das erleben wir sehr häufig. Genau deshalb ist es hilfreich, erst einmal **unverbindliche Angebote** und **fachliche Beratung** einzuholen, damit Sie die richtigen **Argumente** an der Hand haben, um die betroffene Person zu überzeugen. Glauben Sie auch, dass zusätzliche **Informationen** und **Vergleichsangebote** von Experten dabei helfen könnten?'
          },
          {
            title: 'Lokaler Anbieter',
            text: 'Das verstehe ich gut. Der Wunsch nach einer **lokalen Lösung** ist völlig nachvollziehbar. Gerade deshalb fragen wir nach Ihrer **Postleitzahl**, damit wir ermitteln können, ob ein anderer **Dienstleister** in Ihrer Region Ihnen vielleicht **bessere Konditionen** oder mehr **Leistungen** bieten kann. Was halten Sie davon, erst einmal kostenfrei zu vergleichen und danach ganz in Ruhe zu entscheiden, welcher Anbieter für Sie wirklich der richtige ist?'
          }
        ]
      },
      {
        title: 'Cross-Selling',
        entries: [
          {
            title: 'Überleitung',
            text: '[Anrede] [Nachname], wir haben die Erfahrung gemacht, dass viele unserer Klienten nicht wissen, welche **Unterstützung** Ihnen mit einem **Pflegegrad** zusteht und welche **Möglichkeiten** sich dafür eröffnen. Lassen Sie uns hierfür noch kurz Zeit nehmen.'
          },
          {
            title: '24h-Betreuung, Std. Betreuung & Pflegedienst',
            text: 'Über den **Pflegegrad** erhalten Sie **finanzielle Unterstützung**, um die **Pflege & Betreuung** sicher zu stellen. Nutzen Sie hierfür bereits alle **Möglichkeiten**?'
          },
          {
            title: 'Sitzlift & Badewanne zu Dusche',
            text: 'Nutzen Sie schon die **4.180 €**, die es Ihnen ermöglichen, Ihr Zuhause **barrierefrei** zu gestalten, entweder durch einen **Treppenlift** oder ein **barrierefreies Bad**?'
          },
          {
            title: 'Hausnotruf',
            text: 'Haben Sie bereits den **kostenlosen Hausnotruf**, der die **Sicherheit** in den eigenen vier Wänden sicherstellt?'
          },
          {
            title: 'Haushaltshilfe',
            text: 'Erhalten Sie bereits **hauswirtschaftliche Unterstützung**, die Sie durch den **Entlastungsbetrag** in Höhe von **131€ im Monat** kostenfrei erhalten?'
          },
          {
            title: 'Pflegehilfsmittel',
            text: 'Beziehen Sie schon die **kostenfreien Pflegehilfsmittel**, wie **Bettschutzeinlagen**, **Einmalhandschuhe** oder **Desinfektionsmittel**?'
          },
          {
            title: 'Hörtest',
            text: 'Wann war denn die letzte **Hörvorsorge**? Bekannterweise ist es wichtig, ein gesundes **Hörvermögen** zu haben, um **Demenz** und **Sturzgefahren** vorzubeugen.'
          },
          {
            title: 'Elektromobil',
            text: 'Wissen Sie bereits, dass Sie mit einem **Rezept** kostenlos ein **Elektromobil** erhalten?'
          }
        ]
      },
      {
        title: 'Zusammenfassung',
        entries: [
          {
            title: 'Anfrage abschließen',
            text: 'Vielen Dank. Dann haben wir nun **alle wichtigen Informationen** zusammen, damit ich Ihnen die passenden **Ansprechpartner** an die Hand geben kann.'
          }
        ]
      },
      {
        title: 'Abschluss',
        items: [
          'Vielen Dank. Dann haben wir nun **alle wichtigen Informationen** zusammen, damit ich Ihnen die passenden **Ansprechpartner** an die Hand geben kann.'
        ]
      }
    ]
  }
];

/** Eintrag für Weiterleiten-Modal „Abschluss“ (Überschrift + Fließtext) */
interface AbschlussWeiterleitenVariant {
  heading: string;
  body: string;
}

/**
 * Weiterleiten-Modal „Abschluss“: 9 Textvarianten (Demo: ein/mehrere Kapa, WL, Kombi, T&I).
 * 1 Nur ein Kapa · 2 Mehrere Kapa · 3 Nur ein WL · 4 Mehrere WL · 5 Kapa & WL ·
 * 6 Kapa & Tools · 7 Warteliste & Tools · 8 Alles mit T&I · 9 Nur T&I
 */
const ABSCHLUSS_WEITERLEITEN_VARIANTS: readonly AbschlussWeiterleitenVariant[] = [
  {
    heading: 'Nur ein Kapa Produkt',
    body: `Ich werde nun für Sie die aktuellen Verfügbarkeiten prüfen und Ihnen für Sitzlift den Kontakt zu Sonilift GmbH, SANA Treppenlifte und Expertlift GmbH herstellen. Dafür reserviere ich für Sie jetzt die kostenfreien Erstgespräche. Die Anbieter werden sich nun in den nächsten Minuten, spätestens im Laufe des Tages bei Ihnen melden. Bleiben Sie deshalb bitte telefonisch erreichbar, um die nächsten Schritte abzusprechen.`
  },
  {
    heading: 'Mehrere Kapa Produkte',
    body: `Ich werde nun für Sie die aktuellen Verfügbarkeiten prüfen und Ihnen für Sitzlift den Kontakt zu Sonilift GmbH, SANA Treppenlifte und Expertlift GmbH und für Hausnotruf den Kontakt zu Deutsche Hausnotruf AG und Pflegemittelbox herstellen. Dafür reserviere ich für Sie jetzt die kostenfreien Erstgespräche. Die Anbieter werden sich nun in den nächsten Minuten, spätestens im Laufe des Tages bei Ihnen melden. Bleiben Sie deshalb bitte telefonisch erreichbar, um die nächsten Schritte abzusprechen.`
  },
  {
    heading: 'Nur ein WL Produkt',
    body: `Für Vollstationäre Pflege haben wir aktuell keine Verfügbarkeiten. Ich frage für Sie deshalb zusätzlich bei weiteren Dienstleistern an. Das sind Kasteler Krankenhaus-Verein, Seniorenzentrum Stockstadt und Pflegehilfe für Senioren. Diese melden sich telefonisch bei Ihnen, insofern sie aktuell freie Verfügbarkeiten haben.`
  },
  {
    heading: 'Mehrere WL Produkte',
    body: `Für Vollstationäre Pflege & Pflegedienst haben wir aktuell keine Verfügbarkeiten. Ich frage für Sie deshalb zusätzlich bei weiteren Dienstleistern an. Das sind für Vollstationäre Pflege Kasteler Krankenhaus-Verein, Seniorenzentrum Stockstadt und Pflegehilfe für Senioren und für Pflegedienst simCura Wiesbaden Ost, Antara Ambulanter Pflegedienst GmbH und Pflegedienst Gemeinsam GmbH. Diese melden sich telefonisch bei Ihnen, insofern sie aktuell freie Verfügbarkeiten haben.`
  },
  {
    heading: 'Kombi Kapa & WL',
    body: `Ich werde nun für Sie die aktuellen Verfügbarkeiten prüfen und Ihnen für Sitzlift den Kontakt zu Sonilift GmbH, SANA Treppenlifte und Expertlift GmbH herstellen. Dafür reserviere ich für Sie jetzt die kostenfreien Erstgespräche. Die Anbieter werden sich nun in den nächsten Minuten, spätestens im Laufe des Tages bei Ihnen melden. Bleiben Sie deshalb bitte telefonisch erreichbar, um die nächsten Schritte abzusprechen.

Für Vollstationäre Pflege haben wir aktuell keine Verfügbarkeiten. Ich frage für Sie deshalb zusätzlich bei weiteren Dienstleistern an. Das sind Kasteler Krankenhaus-Verein, Seniorenzentrum Stockstadt und Pflegehilfe für Senioren. Diese melden sich telefonisch bei Ihnen, insofern sie aktuell freie Verfügbarkeiten haben.`
  },
  {
    heading: 'Kapa & Tools',
    body: `Ich werde nun für Sie die aktuellen Verfügbarkeiten prüfen und Ihnen für Sitzlift den Kontakt zu Sonilift GmbH, SANA Treppenlifte und Expertlift GmbH herstellen. Dafür reserviere ich für Sie jetzt die kostenfreien Erstgespräche. Die Anbieter werden sich nun in den nächsten Minuten, spätestens im Laufe des Tages bei Ihnen melden. Bleiben Sie deshalb bitte telefonisch erreichbar, um die nächsten Schritte abzusprechen.

Zusätzlich sende ich Ihnen noch passende Infobroschüren zu. Dazu bleiben wir in Kontakt und schauen dann gemeinsam, wie sich Ihre Situation entwickelt und welche nächsten Schritte sinnvoll sind.`
  },
  {
    heading: 'Warteliste & Tools',
    body: `Für Vollstationäre Pflege haben wir aktuell keine Verfügbarkeiten. Ich frage für Sie deshalb zusätzlich bei weiteren Dienstleistern an. Das sind Kasteler Krankenhaus-Verein, Seniorenzentrum Stockstadt und Pflegehilfe für Senioren. Diese melden sich telefonisch bei Ihnen, insofern sie aktuell freie Verfügbarkeiten haben.

Zusätzlich sende ich Ihnen noch passende Infobroschüren zu. Dazu bleiben wir in Kontakt und schauen dann gemeinsam, wie sich Ihre Situation entwickelt und welche nächsten Schritte sinnvoll sind.`
  },
  {
    heading: 'Alles mit T&I',
    body: `Ich werde nun für Sie die aktuellen Verfügbarkeiten prüfen und Ihnen für Sitzlift den Kontakt zu Sonilift GmbH, SANA Treppenlifte und Expertlift GmbH herstellen. Dafür reserviere ich für Sie jetzt die kostenfreien Erstgespräche. Die Anbieter werden sich nun in den nächsten Minuten, spätestens im Laufe des Tages bei Ihnen melden. Bleiben Sie deshalb bitte telefonisch erreichbar, um die nächsten Schritte abzusprechen.

Für Vollstationäre Pflege haben wir aktuell keine Verfügbarkeiten. Ich frage für Sie deshalb zusätzlich bei weiteren Dienstleistern an. Das sind Kasteler Krankenhaus-Verein, Seniorenzentrum Stockstadt und Pflegehilfe für Senioren. Diese melden sich telefonisch bei Ihnen, insofern sie aktuell freie Verfügbarkeiten haben.

Zusätzlich sende ich Ihnen noch passende Infobroschüren zu. Dazu bleiben wir in Kontakt und schauen dann gemeinsam, wie sich Ihre Situation entwickelt und welche nächsten Schritte sinnvoll sind.`
  },
  {
    heading: 'Nur T&I',
    body: `Zusätzlich sende ich Ihnen noch passende Infobroschüren zu. Dazu bleiben wir in Kontakt und schauen dann gemeinsam, wie sich Ihre Situation entwickelt und welche nächsten Schritte sinnvoll sind.`
  }
];

const GUIDANCE_BUBBLE_HIDE_MS = 180;
const BUBBLE_W = 456;

const BUBBLE_BOLD = /\*\*(.+?)\*\*/g;

/**
 * `**Hervorhebung**` → fett, übriger Text normal (für Sprechblasen-Fließtext).
 */
function renderGuidanceBubbleRichText(source: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  BUBBLE_BOLD.lastIndex = 0;
  while ((m = BUBBLE_BOLD.exec(source)) !== null) {
    if (m.index > lastIndex) {
      parts.push(source.slice(lastIndex, m.index));
    }
    parts.push(<strong key={`b-${m.index}`}>{m[1]}</strong>);
    lastIndex = BUBBLE_BOLD.lastIndex;
  }
  if (lastIndex < source.length) {
    parts.push(source.slice(lastIndex));
  }
  return parts.length > 0 ? parts : source;
}

/**
 * Sprechblase per Portal; Pfeil + Kartenfläche am Trigger ausgerichtet, Volltext im Tooltip.
 * `markdownText` ist Klient-Platzhalter-ersetzt und kann `**…**` für Fettdruck enthalten.
 */
const GuidanceSideBubble: React.FC<{
  markdownText: string;
  className?: string;
  children: React.ReactNode;
}> = ({ markdownText, className, children }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [bubbleState, setBubbleState] = useState<{
    top: number;
    left: number;
    maxHeight: number;
    tailOnRight: boolean;
  } | null>(null);

  const clearHide = () => {
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  };

  const recalc = useCallback(() => {
    const el = wrapRef.current;
    const t = markdownText?.trim();
    if (!el || !t) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    const w = BUBBLE_W;
    const maxH = Math.min(0.78 * window.innerHeight, window.innerHeight - 20);
    const anchorY = r.top + r.height / 2;
    let left: number;
    let tailOnRight: boolean;
    if (r.right + gap + w <= window.innerWidth - 6) {
      left = r.right + gap;
      tailOnRight = false;
    } else {
      left = r.left - gap - w;
      if (left < 6) left = 6;
      tailOnRight = true;
    }
    setBubbleState({
      top: anchorY,
      left,
      maxHeight: maxH,
      tailOnRight
    });
  }, [markdownText]);

  useLayoutEffect(() => {
    if (open) recalc();
  }, [open, recalc]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => recalc();
    const onResize = () => recalc();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, recalc]);

  useEffect(
    () => () => {
      if (hideRef.current) clearTimeout(hideRef.current);
    },
    []
  );

  const onEnterWrap = () => {
    clearHide();
    if (!markdownText?.trim()) return;
    setOpen(true);
  };
  const onLeaveWrap = () => {
    hideRef.current = setTimeout(() => {
      setOpen(false);
      setBubbleState(null);
    }, GUIDANCE_BUBBLE_HIDE_MS);
  };
  const onEnterBubble = () => clearHide();
  const onLeaveBubble = () => {
    hideRef.current = setTimeout(() => {
      setOpen(false);
      setBubbleState(null);
    }, GUIDANCE_BUBBLE_HIDE_MS);
  };

  return (
    <>
      <div
        ref={wrapRef}
        className={className}
        onMouseEnter={onEnterWrap}
        onMouseLeave={onLeaveWrap}
      >
        {children}
      </div>
      {open &&
        bubbleState &&
        createPortal(
          <div
            className="guidance-speech-bubble-root"
            style={
              {
                top: bubbleState.top,
                left: bubbleState.left
              } as React.CSSProperties
            }
            onMouseEnter={onEnterBubble}
            onMouseLeave={onLeaveBubble}
            role="tooltip"
          >
            {!bubbleState.tailOnRight && (
              <div className="guidance-speech-bubble__sleeve" aria-hidden>
                <div className="guidance-speech-bubble__point guidance-speech-bubble__point--to-left" />
              </div>
            )}
            <div
              className="guidance-speech-bubble__card"
              style={{ maxHeight: bubbleState.maxHeight }}
            >
              <div className="guidance-speech-bubble__text">
                {renderGuidanceBubbleRichText(markdownText)}
              </div>
            </div>
            {bubbleState.tailOnRight && (
              <div className="guidance-speech-bubble__sleeve" aria-hidden>
                <div className="guidance-speech-bubble__point guidance-speech-bubble__point--to-right" />
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

const Gespraechsguidance: React.FC<{
  klientDisplayName: string;
  klientAnrede: string;
  klientNachname: string;
  isWeiterleitenMode: boolean;
  /** Sidebar sichtbar aber ausgegraut, ohne Texte (z. B. anderes Modal offen) */
  obscured?: boolean;
}> = ({
  klientDisplayName,
  klientAnrede,
  klientNachname,
  isWeiterleitenMode,
  obscured = false
}) => {
  /* Ohne „Abschluss“ in der normalen Ansicht; „Abschluss“ nur bei offenem Weiterleiten-Modal (isWeiterleitenMode) */
  const groupOrder = [
    'Vorwandbehandlung',
    'Bedarfsermittlung',
    'Einwandbehandlung',
    'Cross-Selling',
    'Zusammenfassung',
  ];
  const allGroups = guidanceData.flatMap((section) => section.groups ?? []);
  const defaultVisibleGroups = groupOrder
    .map((title) => allGroups.find((group) => group.title === title))
    .filter((group): group is GuidanceGroup => Boolean(group));
  const weiterleitenModeGroups: GuidanceGroup[] = [
    {
      title: 'Abschluss',
      items: [
        `${ABSCHLUSS_WEITERLEITEN_VARIANTS[0].heading}\n\n${ABSCHLUSS_WEITERLEITEN_VARIANTS[0].body}`
      ]
    },
    {
      title: 'Verabschiedung',
      items: [
        'Sie bekommen jetzt noch eine **E-Mail** von mir, da steht **alles Wichtige** auch noch einmal drin. Wenn noch etwas sein sollte, melden Sie sich gerne. Ansonsten werden wir sie in **zwei Wochen** noch einmal anrufen und fragen, ob die **Unterstützung** hilfreich war.'
      ]
    },
    {
      title: 'Einwandbehandlung',
      entries: [
        {
          title: 'Zu viele Anrufe',
          text: 'Da verstehe ich Sie vollkommen. Mal abgesehen davon, dass Sie heute etwas **Zeit** und **Aufwand** investieren, hätten Sie auf lange Sicht viel **Zeit** und **Aufwand** gespart und sichergestellt, dass Sie auch wirklich die **beste Lösung** haben. Was halten Sie davon?'
        },
        {
          title: 'Nur ein Anbieter',
          text: 'Das kann ich verstehen. Damit Sie eine gute **Entscheidung** treffen und vor allem die verschiedenen **Dienstleistungen** und **Preise** miteinander vergleichen können, lohnt sich der **Vergleich** von verschiedenen **Anbietern**. Was halten Sie davon?'
        },
        {
          title: 'Zeit zum Nachdenken',
          text: 'Das ist absolut verständlich. Niemand möchte vorschnell wichtige **Entscheidungen** treffen. Genau deshalb geht es heute ja nicht um eine **finale Entscheidung**, sondern erst einmal um **unverbindliche Angebote**, die Ihnen die Möglichkeit für eine gute **Entscheidung** geben. Was halten Sie davon?'
        },
        {
          title: 'Nur regionale Anbieter',
          text: 'Das verstehe ich gut. Der Wunsch nach einer **lokalen Lösung** ist völlig nachvollziehbar. Gerade deshalb fragen wir nach Ihrer **Postleitzahl**, damit wir ermitteln können, ob ein anderer **Dienstleister** in Ihrer Region Ihnen vielleicht **bessere Konditionen** oder mehr **Leistungen** bieten kann. Was halten Sie davon, erst einmal kostenfrei zu vergleichen und danach ganz in Ruhe zu entscheiden, welcher Anbieter für Sie wirklich der richtige ist?'
        },
        {
          title: 'Will selbst anrufen',
          text: 'Das kann ich verstehen. Gerne behält man in Ihrer Situation selbst die **Kontrolle**. Genau deshalb suchen unsere **Partner** den **direkten Kontakt** zu Ihnen, weil es in der **Pflege** häufig schnell gehen muss und die **Verfügbarkeiten** sich unmittelbar ändern können. So stellen wir eine **schnelle Versorgung** sicher. Wie klingt das für Sie?'
        }
      ]
    }
  ];
  const visibleGroups = isWeiterleitenMode ? weiterleitenModeGroups : defaultVisibleGroups;
  /** Sprechblase: Platzhalter ersetzen; `**Wort**` in den Texten = fett in der Sprechblase. */
  const replaceKlientPlaceholders = (text: string) =>
    text
      .replace('[Anrede]', klientAnrede || '')
      .replace('[Nachname]', klientNachname || '')
      .replace(/[ \t]+/g, ' ')
      .trim();

  /** Weiterleiten-Modal: welche Abschluss-Demo-Variante (0…n-1) im Flächen-Titel/Sprechblase gilt */
  const [weiterleitenAbschlussVariantIdx, setWeiterleitenAbschlussVariantIdx] = useState(0);
  useEffect(() => {
    if (!isWeiterleitenMode) setWeiterleitenAbschlussVariantIdx(0);
  }, [isWeiterleitenMode]);

  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(() => {
    if (isWeiterleitenMode) {
      return weiterleitenModeGroups.length > 0 ? 0 : null;
    }
    if (defaultVisibleGroups.length === 0) return null;
    const vIdx = defaultVisibleGroups.findIndex(
      (g) => g.title === 'Vorwandbehandlung'
    );
    return vIdx >= 0 ? vIdx : 0;
  });
  const prevWeiterleitenRef = useRef(isWeiterleitenMode);
  useEffect(() => {
    if (prevWeiterleitenRef.current && !isWeiterleitenMode) {
      const vIdx = defaultVisibleGroups.findIndex(
        (g) => g.title === 'Vorwandbehandlung'
      );
      if (vIdx >= 0) setOpenGroupIndex(vIdx);
    }
    prevWeiterleitenRef.current = isWeiterleitenMode;
  }, [isWeiterleitenMode]);

  const handleGroupSummaryClick = (index: number) => {
    setOpenGroupIndex((prev) => (prev === index ? null : index));
  };

  if (obscured) {
    return (
      <div
        className="guidance-sidebar guidance-sidebar--obscured"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="guidance-sidebar">
      <header className="guidance-panel-head" aria-label="Klient">
        <div
          className="guidance-klient-chip"
          title={`Klient: ${klientDisplayName}`}
        >
          <div className="guidance-klient-chip__text">
            <span className="guidance-klient-chip__label">Klient</span>
            <span className="guidance-klient-chip__name">{klientDisplayName}</span>
          </div>
        </div>
      </header>
      <div className="guidance-content">
        <div className="guidance-tips">
          {visibleGroups.map((group, groupIndex) => {
            const isAbschlussWeiterleitenFlat =
              isWeiterleitenMode && group.title === 'Abschluss';
            const isFlatGuidanceSection =
              group.title === 'Bedarfsermittlung' ||
              group.title === 'Zusammenfassung' ||
              (isWeiterleitenMode && group.title === 'Verabschiedung') ||
              isAbschlussWeiterleitenFlat;
            const shouldUseTitleTooltipFromItems =
              isWeiterleitenMode && group.title === 'Verabschiedung';
            const vAbs = ABSCHLUSS_WEITERLEITEN_VARIANTS[weiterleitenAbschlussVariantIdx];
            const flatSectionTooltipMarkdown =
              group.entries && group.entries.length > 0
                ? group.entries
                    .map((entry) => replaceKlientPlaceholders(entry.text))
                    .join('\n\n')
                : shouldUseTitleTooltipFromItems &&
                    group.items &&
                    group.items.length > 0
                  ? group.items
                      .map((item) => replaceKlientPlaceholders(item))
                      .join('\n\n')
                  : isAbschlussWeiterleitenFlat && vAbs
                    ? replaceKlientPlaceholders(`${vAbs.heading}\n\n${vAbs.body}`)
                    : null;

            const entriesBlock =
              group.entries && group.entries.length > 0 && !isFlatGuidanceSection ? (
                <div className="guidance-group-entries guidance-collapsible-content">
                  {group.entries.map((entry, entryIndex) => (
                    <div
                      key={entryIndex}
                      className="guidance-entry-collapsible guidance-entry--static"
                    >
                      <div className="guidance-entry-summary">
                        <GuidanceSideBubble
                          className="guidance-bubble-anchor"
                          markdownText={replaceKlientPlaceholders(entry.text)}
                        >
                          <span className="guidance-entry-row">
                            {entry.title}
                          </span>
                        </GuidanceSideBubble>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null;

            return (
              <div
                key={groupIndex}
                className={
                  isFlatGuidanceSection
                    ? 'guidance-tip guidance-tip--flat-tooltip'
                    : 'guidance-tip'
                }
              >
                {isFlatGuidanceSection ? (
                  <>
                    {flatSectionTooltipMarkdown ? (
                      <GuidanceSideBubble
                        className="guidance-bubble-anchor guidance-flat-tooltip-fullcard"
                        markdownText={flatSectionTooltipMarkdown}
                      >
                        <div
                          className="tip-title guidance-tip-title--static"
                          aria-label="Gesprächstext in der Sprechblase"
                        >
                          {group.title}
                        </div>
                      </GuidanceSideBubble>
                    ) : (
                      <div className="guidance-flat-tooltip-fullcard guidance-flat-tooltip-fullcard--static-title">
                        <div className="tip-title guidance-tip-title--static">
                          {group.title}
                        </div>
                      </div>
                    )}
                    {group.items &&
                      group.items.length > 0 &&
                      !shouldUseTitleTooltipFromItems &&
                      !isAbschlussWeiterleitenFlat && (
                      <div className="guidance-group-items guidance-collapsible-content">
                        {group.items.map((item, itemIndex) => (
                          <GuidanceSideBubble
                            key={itemIndex}
                            className="guidance-bubble-anchor"
                            markdownText={replaceKlientPlaceholders(item)}
                          >
                            <div className="guidance-group-item guidance-group-item--tooltip-only">
                              <span className="guidance-item-faux-label">
                                Textvorschlag {itemIndex + 1}
                              </span>
                            </div>
                          </GuidanceSideBubble>
                        ))}
                      </div>
                    )}
                    {isAbschlussWeiterleitenFlat && (
                      <div
                        className="guidance-abschluss-demo guidance-abschluss-demo--minimal guidance-abschluss-demo--flat"
                        role="group"
                        aria-label="Abschluss: Demo-Textvariante wählen, Volltext in der Sprechblase über der Überschrift"
                      >
                        <div
                          className="guidance-abschluss-variant-strip"
                          role="list"
                          aria-label="Textvariante für die Anzeige wählen"
                        >
                          {ABSCHLUSS_WEITERLEITEN_VARIANTS.map((variant, i) => (
                            <button
                              key={variant.heading}
                              type="button"
                              className={i === weiterleitenAbschlussVariantIdx ? 'is-active' : ''}
                              aria-pressed={i === weiterleitenAbschlussVariantIdx}
                              aria-label={`Textvariante ${i + 1}: ${variant.heading}`}
                              onClick={() => setWeiterleitenAbschlussVariantIdx(i)}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {entriesBlock}
                  </>
                ) : (
                  <details
                    className="guidance-group-collapsible"
                    open={openGroupIndex === groupIndex}
                  >
                    <summary
                      className="tip-title guidance-collapsible-summary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGroupSummaryClick(groupIndex);
                      }}
                    >
                      {group.title}
                    </summary>
                    {group.items && group.items.length > 0 && (
                      <div className="guidance-group-items guidance-collapsible-content">
                        {group.items.map((item, itemIndex) => (
                          <GuidanceSideBubble
                            key={itemIndex}
                            className="guidance-bubble-anchor"
                            markdownText={replaceKlientPlaceholders(item)}
                          >
                            <div className="guidance-group-item guidance-group-item--tooltip-only">
                              <span className="guidance-item-faux-label">
                                Textvorschlag {itemIndex + 1}
                              </span>
                            </div>
                          </GuidanceSideBubble>
                        ))}
                      </div>
                    )}
                    {entriesBlock}
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Wochentage wie auf der Landingpage [Kontaktpräferenzen](https://visionary-marigold-e3945d.netlify.app/) (Schritt 3) */
const ANRUF_LANDING_WOCHENTAGE: { id: string; label: string }[] = [
  { id: 'mo', label: 'Mo' },
  { id: 'di', label: 'Di' },
  { id: 'mi', label: 'Mi' },
  { id: 'do', label: 'Do' },
  { id: 'fr', label: 'Fr' },
  { id: 'sa', label: 'Sa' },
  { id: 'so', label: 'So' },
];

// Standardwerte des Formulars (dienen als Fallback, wenn nichts gespeichert ist)
const DEFAULT_FORM_DATA = {
  // Active section for guidance
  activeGuidanceSection: 'klient',
  // Klient/Interessent Felder (jetzt oben)
  anrede: 'Frau',
  akademGrad: '',
  vorname: 'Hannah',
  nachname: 'Venohr',
  email: 'demo@test.de',
  versichertennummer: '',
  telefon: '',
  internerKommentar: '',

  // Senior Felder
  beziehung: 'Mutter', // Single-Select
  pflegegrad: 'Pflegegrad 3', // Single-Select
  medizinischerHintergrund: ['Altersschwäche', 'Arthrose'] as string[], // Multiselect
  erhoehungBeantragt: false,
  mobilitaet: 'Eingeschränkt mobil', // Single-Select
  barrierefreiheit: ['Treppenlift'] as string[], // Multiselect
  wohnsituation: ['Eigene Wohnung'] as string[], // Multiselect
  aktuelleVersorgung: ['Angehörige'] as string[], // Multiselect
  seniorAnrede: 'Frau',
  seniorAkademGrad: '',
  seniorVorname: 'Erika',
  seniorNachname: 'Venohr',
  alter: '82',
  postleitzahl: '65197',
  region: 'Wiesbaden',
};

type FormDataShape = typeof DEFAULT_FORM_DATA;

// localStorage-Schlüssel für die Persistenz der Eingaben
const FORM_DATA_STORAGE_KEY = 'anfrageSitzlift.formData';
const PHONE_NUMBERS_STORAGE_KEY = 'anfrageSitzlift.phoneNumbers';

const DEFAULT_PHONE_NUMBERS = [
  { id: 'phone-1', type: 'Mobil', number: '01512 3456789', countryCode: '+49' },
];

const AnfrageSitzlift: React.FC = () => {
  const [formData, setFormData] = useState<FormDataShape>(() => {
    try {
      const saved = localStorage.getItem(FORM_DATA_STORAGE_KEY);
      // Gespeicherte Werte über die Defaults legen, damit später ergänzte
      // Felder weiterhin ihren Standardwert erhalten.
      if (saved) return { ...DEFAULT_FORM_DATA, ...(JSON.parse(saved) as Partial<FormDataShape>) };
    } catch {
      /* Fehlerhafte/blockierte Speicherung ignorieren und Defaults nutzen */
    }
    return DEFAULT_FORM_DATA;
  });

  // Telefonnummern-Management
  interface PhoneNumber {
    id: string;
    type: string;
    number: string;
    countryCode: string;
  }
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(() => {
    try {
      const saved = localStorage.getItem(PHONE_NUMBERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as PhoneNumber[];
      }
    } catch {
      /* Fehlerhafte/blockierte Speicherung ignorieren und Defaults nutzen */
    }
    return DEFAULT_PHONE_NUMBERS;
  });

  // Eingaben bei jeder Änderung persistieren, damit sie nach dem Neuladen
  // wieder vorausgewählt sind.
  useEffect(() => {
    try {
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      /* Speicherplatz voll / privater Modus – Persistenz überspringen */
    }
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem(PHONE_NUMBERS_STORAGE_KEY, JSON.stringify(phoneNumbers));
    } catch {
      /* Speicherplatz voll / privater Modus – Persistenz überspringen */
    }
  }, [phoneNumbers]);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isWeiterleitenModalOpen, setIsWeiterleitenModalOpen] = useState(false);
  const [isKlientLoeschenModalOpen, setIsKlientLoeschenModalOpen] = useState(false);
  /** Nur Demo: Klient-löschen-Modal Berater-Ansicht vs. Admin-Ansicht */
  const [klientLoeschenDemoModus, setKlientLoeschenDemoModus] = useState<'berater' | 'admin'>('berater');
  const [klientLoeschenAdminKlientBestaetigt, setKlientLoeschenAdminKlientBestaetigt] = useState(false);
  const [klientLoeschenAdminDuplikatBestaetigt, setKlientLoeschenAdminDuplikatBestaetigt] = useState(false);
  /** Kombiniertes „Kontakt-Einstellungen“-Modal (aus dem Aktionen-Menü) */
  const [isKontaktEinstellungenModalOpen, setIsKontaktEinstellungenModalOpen] = useState(false);
  const [kontaktLoeschenKlientBestaetigt, setKontaktLoeschenKlientBestaetigt] = useState(false);
  const [kontaktLoeschenDubletteBestaetigt, setKontaktLoeschenDubletteBestaetigt] = useState(false);
  const [kontaktTelefonieAbmeldenBestaetigt, setKontaktTelefonieAbmeldenBestaetigt] = useState(false);
  const [kontaktNewsletterAnmeldenBestaetigt, setKontaktNewsletterAnmeldenBestaetigt] = useState(false);
  const [kontaktAutomationAbmeldenBestaetigt, setKontaktAutomationAbmeldenBestaetigt] = useState(false);
  const [isAnrufEinstellungenModalOpen, setIsAnrufEinstellungenModalOpen] = useState(false);
  /** Nur Demo/Preview: Ansicht im Anruf-Modal (Standard / Admin) */
  const [anrufDemoModus, setAnrufDemoModus] = useState<
    'telefonie-aktiv' | 'abgemeldet' | 'admin' | 'admin-anmelden'
  >('telefonie-aktiv');
  /** Telefonie Admin-Abmeldung: Bestätigung per Checkbox vor Speichern */
  const [anrufAdminTelefonieAbmeldungBestaetigt, setAnrufAdminTelefonieAbmeldungBestaetigt] = useState(false);
  /** Telefonie Admin-Anmeldung (nur Admins): Bestätigung per Checkbox vor Speichern */
  const [anrufAdminTelefonieAnmeldungBestaetigt, setAnrufAdminTelefonieAnmeldungBestaetigt] = useState(false);
  /** Landingpage Schritt 3 – Anruf-Einstellungen (nur echte CRM-Admins, Demo-Zustand) */
  const [anrufLandingEinstellungen, setAnrufLandingEinstellungen] = useState({
    regelmaessigkeit: 'regelmaessig' as 'regelmaessig' | 'halbjaehrlich' | 'jaehrlich',
    pausierung: 'keine' as 'keine' | '3monate' | '6monate',
    anrufzeit: 'keine' as 'keine' | 'vormittags' | 'nachmittags' | 'abends',
    wochentage: [] as string[],
    telefonnummer: '',
  });
  const [isAktionenDropdownOpen, setIsAktionenDropdownOpen] = useState(false);
  /** Header: V1 = mit Bewertung, V2 = ohne Bewertung (kompakt), V3 = ohne Bewertung (Platzhalter) */
  const [headerUiVersion, setHeaderUiVersion] = useState<1 | 2 | 3>(1);
  const bewertungAusgeblendet = headerUiVersion !== 1;
  /** Komplette Oberflächen-Variante (neben „Pflegehilfe CRM“ umschaltbar). Aktuell sind alle 3
   *  identisch (= Variante 1). Zum Abweichen einer Variante an der gewünschten Stelle mit
   *  `appVariant === n ? (…) : (…)` verzweigen. */
  const [appVariant, setAppVariant] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  // App-Variante 4 verhält sich (zunächst) wie Variante 2; Variante 5 & 6 wie Variante 3.
  // Variante 2 & 3 teilen fast alles (→ `appVariant !== 1`); nur die {3,5,6}-Spezifika brauchen diesen Helfer.
  const istWieVariante3 = appVariant === 3 || appVariant === 5 || appVariant === 6;
  /** Oberfläche: Dashboard vs. Anfrage-Detail (Klienten) */
  const [crmMainView, setCrmMainView] = useState<'dashboard' | 'anfrage'>('anfrage');
  const aktionenDropdownRef = useRef<HTMLDivElement>(null);
  const appToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [appToast, setAppToast] = useState<{
    variant: 'copy' | 'email';
    tick: number;
    message?: string;
    /** Kein Ein-/Ausblend- oder Icon-Animation (z. B. Admin-Direktlöschung → Dashboard) */
    instant?: boolean;
  } | null>(null);
  const [erreichbarkeit, setErreichbarkeit] = useState({ ganztägig: false, vormittags: false, nachmittags: false, abends: false });
  const [zustimmungKontaktweitergabe, setZustimmungKontaktweitergabe] = useState(false);
  const [zustimmungNachgespraechBeratung, setZustimmungNachgespraechBeratung] = useState(false);
  /** „Kein akuter Bedarf“: optionaler Haken, um den E-Mail-Versand zu deaktivieren */
  const [keinBedarfEmailVersandDeaktiviert, setKeinBedarfEmailVersandDeaktiviert] = useState(false);
  const [weiterleitenPopupVersion, setWeiterleitenPopupVersion] = useState<1 | 2 | 3 | 4>(1);
  const [weiterleitenV3Tools, setWeiterleitenV3Tools] = useState({
    pflegegradChecked: true,
    kontaktPraeferenzenChecked: false,
    pflegeWohnenChecked: false,
    hilfsmittelMobilitaetChecked: false,
    zuschuesseVorsorgeChecked: false,
    showMoreTools: false,
  });
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [phoneModalData, setPhoneModalData] = useState({
    type: 'Mobil',
    number: '',
    countryCode: '+49'
  });
  const [phoneValidationError, setPhoneValidationError] = useState('');
  const nextPhoneIdRef = useRef(2);

  // App-Variante 3/5/6 + Popup-Variante 2: NUR „Zuschüsse & Vorsorge“ angezeigt & vorausgewählt,
  // „Weitere“ klappt die restlichen Broschüren auf.
  const istV3Popup2 = istWieVariante3 && weiterleitenPopupVersion === 2;

  useEffect(() => {
    if (!isWeiterleitenModalOpen || weiterleitenPopupVersion === 1) {
      return;
    }

    // App-Varianten 2–5 teilen sich die Popup-Logik (4 wie 2, 5 wie 3)
    const istAppVariante2Oder3 = appVariant !== 1;

    // Popup-Variante 4 → alle Broschüren angezeigt, nichts vorausgewählt.
    if (istAppVariante2Oder3 && weiterleitenPopupVersion === 4) {
      setWeiterleitenV3Tools({
        pflegegradChecked: false,
        kontaktPraeferenzenChecked: false,
        pflegeWohnenChecked: false,
        hilfsmittelMobilitaetChecked: false,
        zuschuesseVorsorgeChecked: false,
        showMoreTools: true,
      });
      return;
    }

    // App-Variante 3/5/6 + Popup-Variante 2 → NUR „Zuschüsse & Vorsorge“ vorausgewählt, „Weitere“ eingeklappt.
    if (istV3Popup2) {
      setWeiterleitenV3Tools({
        pflegegradChecked: false,
        kontaktPraeferenzenChecked: false,
        pflegeWohnenChecked: false,
        hilfsmittelMobilitaetChecked: false,
        zuschuesseVorsorgeChecked: true,
        showMoreTools: false,
      });
      return;
    }

    // App-Variante 2 & 3:
    //  · Popup-Variante 2 → „Hilfsmittel & Mobilität“ als 2. Kachel angeheftet & vorausgewählt,
    //    „Weitere“ eingeklappt (restliche Broschüren auf Klick).
    //  · Popup-Variante 3 → alle Broschüren angezeigt (ausgeklappt) und vorausgewählt.
    const alleBroschueren = istAppVariante2Oder3 && weiterleitenPopupVersion === 3;
    setWeiterleitenV3Tools({
      pflegegradChecked: true,
      kontaktPraeferenzenChecked: false,
      pflegeWohnenChecked: alleBroschueren,
      hilfsmittelMobilitaetChecked: istAppVariante2Oder3,
      zuschuesseVorsorgeChecked: alleBroschueren,
      showMoreTools: alleBroschueren,
    });
  }, [isWeiterleitenModalOpen, weiterleitenPopupVersion, appVariant]);


  // Popup-Varianten 2/3/4 zeigen die interaktiven Broschüren-Kacheln (statt der Sitzlift-Anbieter)
  const weiterleitenZeigtTools =
    weiterleitenPopupVersion === 2 ||
    weiterleitenPopupVersion === 3 ||
    weiterleitenPopupVersion === 4;

  // „Kein akuter Bedarf: E-Mail-Strecke“ nur, wenn ALLE grünen Broschüren abgewählt sind
  const keineBroschuereAusgewaehlt =
    !weiterleitenV3Tools.pflegegradChecked &&
    !weiterleitenV3Tools.pflegeWohnenChecked &&
    !weiterleitenV3Tools.hilfsmittelMobilitaetChecked &&
    !weiterleitenV3Tools.zuschuesseVorsorgeChecked;

  // „Kein akuter Bedarf: E-Mail-Strecke“ + „Kontakt-Präferenzen“ in Popup-Variante 2/3/4,
  // sobald keine grüne Broschüre gewählt ist (in V4 also direkt von Beginn an)
  const weiterleitenV2EmailStreckeSichtbar =
    weiterleitenZeigtTools && keineBroschuereAusgewaehlt;

  // Wenn „Kein akuter Bedarf“ oder „Kontakt-Präferenzen“ gewählt ist (= keine grüne Broschüre),
  // reduziert sich die Bonus-Berechtigung → roter Hinweis über „Abschicken“
  const weiterleitenBonusHinweisSichtbar = weiterleitenV2EmailStreckeSichtbar;

  // Sonderfälle App-Variante 1 bei „Kein akuter Bedarf“:
  //  · Popup-3 → Nachgespräch-Zustimmung zusätzlich angezeigt, aber OPTIONAL.
  //  · Popup-4 → Nachgespräch-Zustimmung zusätzlich angezeigt und PFLICHT.
  //  · „Kontakt-Einstellungen“ gewählt → Nachgespräch-Zustimmung bleibt ausgeblendet.
  const istV1Popup3 = appVariant === 1 && weiterleitenPopupVersion === 3;
  const istV1Popup4 = appVariant === 1 && weiterleitenPopupVersion === 4;
  const keinAkuterBedarfGewaehlt =
    weiterleitenV2EmailStreckeSichtbar && !weiterleitenV3Tools.kontaktPraeferenzenChecked;

  // Nachgespräch-Zustimmung ist immer Pflicht vor dem Weiterleiten – außer wenn „Kein akuter Bedarf“ /
  // „Kontakt-Einstellungen“ gewählt ist. Ausnahme: App-Variante 1 + Popup-4 → bei „Kein akuter Bedarf“ Pflicht.
  const weiterleitenV2V3NachgespraechZustimmungErforderlich =
    !weiterleitenV2EmailStreckeSichtbar || (istV1Popup4 && keinAkuterBedarfGewaehlt);

  const nachgespraechConsentSichtbar =
    !weiterleitenV2EmailStreckeSichtbar ||
    ((istV1Popup3 || istV1Popup4) && keinAkuterBedarfGewaehlt);

  const weiterleitenAbschickenEnabled =
    weiterleitenPopupVersion === 1
      ? zustimmungKontaktweitergabe &&
        zustimmungNachgespraechBeratung &&
        (erreichbarkeit.ganztägig ||
          erreichbarkeit.vormittags ||
          erreichbarkeit.nachmittags ||
          erreichbarkeit.abends)
      : weiterleitenV2V3NachgespraechZustimmungErforderlich
        ? zustimmungNachgespraechBeratung
        : true;

  const toggleWeiterleitenV3Pflegegrad = () => {
    setWeiterleitenV3Tools((prev) => {
      const next = !prev.pflegegradChecked;
      return {
        ...prev,
        pflegegradChecked: next,
        // Beim Anhaken „Kontakt-Präferenzen“ lösen
        ...(next ? { kontaktPraeferenzenChecked: false } : {}),
      };
    });
  };

  // „Kein akuter Bedarf: E-Mail-Strecke“ ist angehakt, solange Kontakt-Präferenzen
  // nicht gewählt ist. Klick darauf wählt Kontakt-Präferenzen ab (= E-Mail-Strecke an).
  const selectWeiterleitenV3EmailStrecke = () => {
    setWeiterleitenV3Tools((prev) => ({
      ...prev,
      kontaktPraeferenzenChecked: false,
    }));
  };

  const toggleWeiterleitenV3KontaktPraeferenzen = () => {
    setWeiterleitenV3Tools((prev) => {
      const next = !prev.kontaktPraeferenzenChecked;
      // Beim Aktivieren von „Kontakt-Präferenzen“ alle anderen Häkchen entfernen
      return next
        ? {
            ...prev,
            kontaktPraeferenzenChecked: true,
            pflegegradChecked: false,
            pflegeWohnenChecked: false,
            hilfsmittelMobilitaetChecked: false,
            zuschuesseVorsorgeChecked: false,
          }
        : {
            ...prev,
            kontaktPraeferenzenChecked: false,
          };
    });
  };

  const handleWeiterleitenWeitereClick = () => {
    setWeiterleitenV3Tools((prev) => ({
      ...prev,
      showMoreTools: !prev.showMoreTools,
    }));
  };

  const toggleWeiterleitenV3PflegeWohnen = () => {
    setWeiterleitenV3Tools((prev) => {
      const next = !prev.pflegeWohnenChecked;
      return {
        ...prev,
        pflegeWohnenChecked: next,
        ...(next ? { kontaktPraeferenzenChecked: false } : {}),
      };
    });
  };

  const toggleWeiterleitenV3HilfsmittelMobilitaet = () => {
    setWeiterleitenV3Tools((prev) => {
      const next = !prev.hilfsmittelMobilitaetChecked;
      return {
        ...prev,
        hilfsmittelMobilitaetChecked: next,
        ...(next ? { kontaktPraeferenzenChecked: false } : {}),
      };
    });
  };

  const toggleWeiterleitenV3ZuschuesseVorsorge = () => {
    setWeiterleitenV3Tools((prev) => {
      const next = !prev.zuschuesseVorsorgeChecked;
      return {
        ...prev,
        zuschuesseVorsorgeChecked: next,
        ...(next ? { kontaktPraeferenzenChecked: false } : {}),
      };
    });
  };

  // Produktauswahl: Reiter unter "Produktempfehlung", UI wie im Screenshot (Name, "X von Y AN", ×)
  const [produktTabs, setProduktTabs] = useState<{ id: string; label: string; count: number; maxAN: number }[]>([
    { id: 'sitzlift', label: 'Sitzlift', count: 0, maxAN: 10 },
  ]);
  const [activeProduktTabId, setActiveProduktTabId] = useState<string>('sitzlift');
  const [produktDropdownOpen, setProduktDropdownOpen] = useState(false);
  const nextProduktIdRef = useRef(2);
  const produktDropdownRef = useRef<HTMLDivElement>(null);

  const availableProdukte = [
    // Ambulant
    { value: 'inkontinenzartikel-ambulant', label: 'Inkontinenzartikel', maxAN: 1 },
    { value: 'std-betreuung-ambulant', label: 'Std. Betreuung', maxAN: 2 },
    { value: 'badewanne-zur-dusche-ambulant', label: 'Badewanne zur Dusche', maxAN: 4 },
    { value: 'haushaltshilfe-ambulant', label: 'Haushaltshilfe', maxAN: 2 },
    { value: 'pflegeberatung-vor-ort-ambulant', label: 'Pflegeberatung vor Ort', maxAN: 5 },
    { value: 'intensivpflege-1zu1', label: '1:1 – Intensivpflege', maxAN: 6 },
    { value: 'essen-auf-raedern', label: 'Essen auf Rädern', maxAN: 0 },
    { value: 'hausnotruf', label: 'Hausnotruf', maxAN: 8 },
    { value: 'intensivpflege-wg', label: 'Intensivpflege-WG', maxAN: 3 },
    { value: 'pflegedienst', label: 'Pflegedienst', maxAN: 0 },
    { value: 'pflegekurse-angehoerige', label: 'Pflegekurse für Angehörige', maxAN: 1 },
    { value: 'senioren-wg-ambulant', label: 'Senioren-WG', maxAN: 2 },
    // Bad
    { value: 'badausstellung', label: 'Badausstellung', maxAN: 0 },
    { value: 'badewanne-zur-dusche-bad', label: 'Badewanne zur Dusche', maxAN: 4 },
    { value: 'badewannentuer', label: 'Badewannentür', maxAN: 4 },
    { value: 'badsanierung', label: 'Badsanierung', maxAN: 1 },
    { value: 'seniorenbadewanne', label: 'Seniorenbadewanne', maxAN: 3 },
    // Betreuung
    { value: '24h-betreuung', label: '24 Stunden Betreuung', maxAN: 20 },
    { value: '24h-verhinderungspflege', label: '24h Verhinderungspflege', maxAN: 2 },
    { value: 'deutsche-24h-betreuung', label: 'Deutsche 24h Betreuung', maxAN: 1 },
    { value: 'std-betreuung-betreuung', label: 'Std. Betreuung', maxAN: 2 },
    // Immobilien
    { value: 'immobilienverkauf', label: 'Immobilienverkauf', maxAN: 2 },
    { value: 'immobilienverrentung', label: 'Immobilienverrentung', maxAN: 0 },
    { value: 'pflegeimmobilie', label: 'Pflegeimmobilie', maxAN: 6 },
    // Lifte
    { value: 'aufzug', label: 'Aufzug', maxAN: 0 },
    { value: 'hublift', label: 'Hublift', maxAN: 3 },
    { value: 'patientenlifter', label: 'Patientenlifter', maxAN: 0 },
    { value: 'plattform-rollstuhllift', label: 'Plattform/Rollstuhllift', maxAN: 4 },
    { value: 'senkrechtlift', label: 'Senkrechtlift', maxAN: 2 },
    { value: 'sitzlift', label: 'Sitzlift', maxAN: 10 },
    // Personal
    { value: 'betreuungskraft', label: 'Betreuungskraft', maxAN: 0 },
    { value: 'pflegeazubis', label: 'Pflegeazubis', maxAN: 0 },
    { value: 'pflegedienstleitung', label: 'Pflegedienstleitung', maxAN: 0 },
    { value: 'pflegefachkraft', label: 'Pflegefachkraft', maxAN: 4 },
    { value: 'pflegehelfer', label: 'Pflegehelfer', maxAN: 1 },
    // Produkte
    { value: 'hoertest', label: 'Hörtest', maxAN: 1 },
    { value: 'badewannenlift', label: 'Badewannenlift', maxAN: 1 },
    { value: 'elektromobil', label: 'Elektromobil', maxAN: 4 },
    { value: 'elektrorollstuhl', label: 'Elektrorollstuhl', maxAN: 5 },
    { value: 'inkontinenzartikel-produkte', label: 'Inkontinenzartikel', maxAN: 1 },
    { value: 'pflegebett', label: 'Pflegebett', maxAN: 0 },
    { value: 'pflegehilfsmittel', label: 'Pflegehilfsmittel', maxAN: 8 },
    { value: 'pflegesessel', label: 'Pflegesessel', maxAN: 0 },
    { value: 'rollstuhlrampen', label: 'Rollstuhlrampen', maxAN: 0 },
    // Stationär
    { value: 'betreutes-wohnen', label: 'Betreutes Wohnen', maxAN: 2 },
    { value: 'stationaere-intensivpflege', label: 'Stationäre Intensivpflege', maxAN: 0 },
    { value: 'tagespflege', label: 'Tagespflege', maxAN: 3 },
    { value: 'verhinderungs-kurzzeitpflege', label: 'Verhinderungs-/ Kurzzeitpflege', maxAN: 0 },
    { value: 'vollstationaere-pflege', label: 'Vollstationäre Pflege', maxAN: 0 },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (produktDropdownRef.current && !produktDropdownRef.current.contains(e.target as Node)) {
        setProduktDropdownOpen(false);
      }
    };
    if (produktDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [produktDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aktionenDropdownRef.current && !aktionenDropdownRef.current.contains(e.target as Node)) {
        setIsAktionenDropdownOpen(false);
      }
    };
    if (isAktionenDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAktionenDropdownOpen]);

  useEffect(() => {
    if (isAnrufEinstellungenModalOpen && anrufDemoModus === 'admin') {
      setAnrufAdminTelefonieAbmeldungBestaetigt(false);
    }
    if (isAnrufEinstellungenModalOpen && anrufDemoModus === 'admin-anmelden') {
      setAnrufAdminTelefonieAnmeldungBestaetigt(false);
    }
  }, [isAnrufEinstellungenModalOpen, anrufDemoModus]);

  useEffect(() => {
    if (!isKlientLoeschenModalOpen) return;
    setKlientLoeschenAdminKlientBestaetigt(false);
    setKlientLoeschenAdminDuplikatBestaetigt(false);
  }, [isKlientLoeschenModalOpen, klientLoeschenDemoModus]);

  useEffect(() => {
    return () => {
      if (appToastTimerRef.current) clearTimeout(appToastTimerRef.current);
    };
  }, []);

  const showAppToast = (variant: 'copy' | 'email', message?: string, options?: { instant?: boolean }) => {
    if (appToastTimerRef.current) clearTimeout(appToastTimerRef.current);
    setAppToast({ variant, tick: Date.now(), message, instant: options?.instant });
    appToastTimerRef.current = setTimeout(() => {
      setAppToast(null);
      appToastTimerRef.current = null;
    }, 2800);
  };

  const addProduktTab = (value?: string, label?: string, maxAN?: number) => {
    if (value !== undefined && label !== undefined && maxAN !== undefined) {
      const exists = produktTabs.some((t) => t.id === value || t.label === label);
      if (exists) {
        setProduktDropdownOpen(false);
        return;
      }
      setProduktTabs((prev) => [...prev, { id: value, label, count: 0, maxAN }]);
      setActiveProduktTabId(value);
    } else {
      const newId = String(nextProduktIdRef.current++);
      setProduktTabs((prev) => [...prev, { id: newId, label: `Produkt ${newId}`, count: 0, maxAN: 8 }]);
      setActiveProduktTabId(newId);
    }
    setProduktDropdownOpen(false);
  };

  const removeProduktTab = (id: string) => {
    setProduktTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeProduktTabId === id) {
      const remaining = produktTabs.filter((tab) => tab.id !== id);
      // Kein Produkt mehr offen, wenn der letzte Reiter geschlossen wird
      setActiveProduktTabId(remaining[0]?.id ?? '');
    }
  };

  // Accordion-Status für Generelle Kriterien, Produktkriterien
  const [generelleKriterienExpanded, setGenerelleKriterienExpanded] = useState(false);
  const [produktkriterienExpanded, setProduktkriterienExpanded] = useState(true); // Standardmäßig ausgeklappt
  const [activeProduktkriterienTab, setActiveProduktkriterienTab] = useState<'nachfrage' | 'einsatzdetails' | 'zeitpunkt'>('nachfrage');

  // Produktkriterien erstes Produkt (Sitzlift) – für „Cross-Selling“ öffnen wenn alle ausgefüllt
  const [sitzliftKriterien, setSitzliftKriterien] = useState<{
    einverstaendnisSenior: string;
    pflegegradSitzlift: string;
    hausart: string;
    immobilie: string;
    einverstaendnisVermieter: string;
    treppenform: string;
    etagen: string;
    treppenbreite: string;
    koerpergewicht: string;
    zustand: string[];
    budgetrahmen: string;
    vorOrtTermin: string[];
    bedarfSitzlift: string;
  }>({
    // Standardmäßig alle Sitzlift-Produktkriterien angehakt/ausgefüllt
    einverstaendnisSenior: 'vorhanden',
    pflegegradSitzlift: 'vorhanden',
    hausart: 'einfamilienhaus',
    immobilie: 'eigentum',
    einverstaendnisVermieter: 'vorhanden',
    treppenform: 'gerade_innen',
    etagen: '1',
    treppenbreite: '110',
    koerpergewicht: '60',
    zustand: ['neu'],
    budgetrahmen: '12000',
    vorOrtTermin: ['vormittags'],
    bedarfSitzlift: 'schnell',
  });

  const handleSitzliftKriterienChange = (name: string, value: string | string[]) => {
    setSitzliftKriterien((prev) => ({ ...prev, [name]: value }));
  };

  // Sind alle Sitzlift-Produktkriterien angehakt/ausgefüllt?
  const sitzliftKriterienVollstaendig =
    sitzliftKriterien.einverstaendnisSenior !== '' &&
    sitzliftKriterien.pflegegradSitzlift !== '' &&
    sitzliftKriterien.hausart !== '' &&
    sitzliftKriterien.immobilie !== '' &&
    sitzliftKriterien.einverstaendnisVermieter !== '' &&
    sitzliftKriterien.treppenform !== '' &&
    sitzliftKriterien.etagen !== '' &&
    sitzliftKriterien.treppenbreite.trim() !== '' &&
    sitzliftKriterien.koerpergewicht.trim() !== '' &&
    sitzliftKriterien.zustand.length > 0 &&
    sitzliftKriterien.budgetrahmen.trim() !== '' &&
    sitzliftKriterien.vorOrtTermin.length > 0 &&
    sitzliftKriterien.bedarfSitzlift !== '';

  // „Anfrage abschließen“ ist gesperrt, sobald ein ausgewähltes Produkt nicht alle Produktkriterien
  // angehakt hat. (Aktuell sind nur die Sitzlift-Kriterien zustandsbasiert prüfbar.)
  const alleProduktKriterienVollstaendig = produktTabs.every((tab) =>
    tab.id === 'sitzlift' || tab.label === 'Sitzlift' ? sitzliftKriterienVollstaendig : true
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Erzeugt und lädt ein bearbeitbares Word-Dokument (.doc) mit der
   * DSGVO-Auskunft nach Art. 15 Abs. 1, befüllt mit den Klientendaten aus
   * der Maske. Das HTML-basierte .doc-Format wird von Word als voll
   * bearbeitbares Dokument geöffnet und benötigt keine externen Pakete.
   */
  const handleDsgvoAuskunftDownload = () => {
    const esc = (v?: string) =>
      (v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const list = (arr?: string[]) => esc((arr ?? []).join(', '));
    // Telefonnummern nach Typ zuordnen
    const phoneByType = (needle: string) =>
      esc(
        phoneNumbers
          .filter((p) => p.type.toLowerCase().includes(needle))
          .map((p) => `${p.countryCode} ${p.number}`.trim())
          .join(', ')
      );

    const row = (label: string, value: string) =>
      `<tr><td class="lbl">${label}</td><td class="val">${value || 'n/a'}</td></tr>`;

    const personRows = [
      row('Anrede', esc([formData.anrede, formData.akademGrad].filter(Boolean).join(' '))),
      row('Vorname', esc(formData.vorname)),
      row('Nachname', esc(formData.nachname)),
      row('Straße und Hausnummer', ''),
      row('Postleitzahl', esc(formData.postleitzahl)),
      row('Ort', esc(formData.region)),
      row('Land', ''),
      row('Festnetz', phoneByType('festnetz')),
      row('Mobil', phoneByType('mobil')),
      row('Fax', phoneByType('fax')),
      row('E-Mail-Adresse', esc(formData.email)),
    ].join('');

    const seniorRows = [
      row('Beziehung', esc(formData.beziehung)),
      row('Pflegegrad/-stufe', esc(formData.pflegegrad)),
      row('Medizinischer Hintergrund', list(formData.medizinischerHintergrund)),
      row('Mobilität', esc(formData.mobilitaet)),
      row('Barrierefreiheit', list(formData.barrierefreiheit)),
      row('Wohnsituation', list(formData.wohnsituation)),
      row('Aktuelle Versorgung', list(formData.aktuelleVersorgung)),
      row('Anrede', esc([formData.seniorAnrede, formData.seniorAkademGrad].filter(Boolean).join(' '))),
      row('Vorname des Seniors', esc(formData.seniorVorname)),
      row('Nachname des Seniors', esc(formData.seniorNachname)),
      row('Alter', esc(formData.alter)),
    ].join('');

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>DSGVO Auskunft nach Art. 15 Abs. 1</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4; margin: 2cm; }
body { font-family: Arial, sans-serif; font-size: 10.5pt; color: #000; }
.brand { color: #7a7a5c; font-size: 14pt; font-weight: bold; margin-bottom: 4pt; }
.hinweis { font-size: 8.5pt; color: #555; margin-bottom: 18pt; }
h1 { font-size: 13pt; margin: 0 0 14pt 0; }
h2 { font-size: 11pt; margin: 16pt 0 6pt 0; }
table { border-collapse: collapse; width: 100%; }
td { border: 1px solid #333; padding: 3pt 6pt; vertical-align: top; }
td.lbl { width: 40%; }
td.val { width: 60%; }
p { margin: 0 0 6pt 0; }
</style>
</head>
<body>
<div class="brand">Verbund Pflegehilfe</div>
<p class="hinweis">„n/a" = kein Datenwert vorhanden oder keine Verarbeitung in dieser Kategorie.<br/>In Abschnitt 5 bedeutet „n/a" = keine Weitergabe an Dritte erfolgt.</p>

<h1>Auskunft nach Art. 15 Abs. 1 der Datenschutz-Grundverordnung</h1>

<h2>1. Gespeicherte Daten zu Ihrer Person</h2>
<table>${personRows}</table>

<h2>2. Gespeicherte Daten zur pflegebedürftigen Person</h2>
<table>${seniorRows}</table>

<h2>3. Zweck der Verarbeitung</h2>
<p>Wir nutzen Ihre obenstehenden Daten ausschließlich zum Zwecke des Versands eines Newsletters und zur Vermittlung von Angeboten.</p>

<h2>4. Kategorien der verarbeiteten Daten</h2>
<p>Wir verarbeiten Stamm-, Kontakt-, Adress-, Sozial- und Gesundheitsdaten.</p>
</body>
</html>`;

    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateiName = ['DSGVO-Auskunft', formData.nachname, formData.vorname]
      .filter(Boolean)
      .join('_')
      .replace(/\s+/g, '-');
    link.href = url;
    link.download = `${dateiName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Telefonnummern-Funktionen
  const openPhoneModal = (phoneId?: string) => {
    if (phoneId) {
      // Bearbeitungsmodus
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (phone) {
        setPhoneModalData({
          type: phone.type,
          number: phone.number,
          countryCode: phone.countryCode
        });
        setEditingPhoneId(phoneId);
      }
    } else {
      // Neuer Modus
      setPhoneModalData({ type: 'Mobil', number: '', countryCode: '+49' });
      setEditingPhoneId(null);
    }
    setPhoneValidationError('');
    setIsPhoneModalOpen(true);
  };

  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
    setPhoneModalData({ type: 'Mobil', number: '', countryCode: '+49' });
    setEditingPhoneId(null);
    setPhoneValidationError('');
  };

  const handleAnrufEinstellungenSpeichernAdminAbmeldung = () => {
    if (!anrufAdminTelefonieAbmeldungBestaetigt) return;
    setAnrufDemoModus('abgemeldet');
    setIsAnrufEinstellungenModalOpen(false);
    showAppToast('email');
  };

  const handleAnrufEinstellungenSpeichernAdminTelefonieAnmeldung = () => {
    if (!anrufAdminTelefonieAnmeldungBestaetigt) return;
    setAnrufDemoModus('telefonie-aktiv');
    setIsAnrufEinstellungenModalOpen(false);
  };

  const handleAnrufLandingEinstellungenZuruecksetzen = () => {
    setAnrufLandingEinstellungen({
      regelmaessigkeit: 'regelmaessig',
      pausierung: 'keine',
      anrufzeit: 'keine',
      wochentage: [],
      telefonnummer: '',
    });
  };

  const handleAnrufLandingEinstellungenSpeichern = () => {
    /* Demo: später Persistenz / API an Landingpage-Klienten */
    showAppToast('email', 'Die Anruf-Einstellungen wurden gespeichert.');
  };

  const toggleAnrufLandingWochentag = (tag: string) => {
    setAnrufLandingEinstellungen((prev) => {
      const has = prev.wochentage.includes(tag);
      const wochentage = has ? prev.wochentage.filter((t) => t !== tag) : [...prev.wochentage, tag];
      return { ...prev, wochentage };
    });
  };

  const validatePhoneNumber = (number: string): boolean => {
    // Entferne Leerzeichen und Sonderzeichen für Validierung
    const cleaned = number.replace(/\s+/g, '').replace(/[-\/]/g, '');
    // Deutsche Telefonnummer: mindestens 10 Ziffern (mit Vorwahl) oder 11 Ziffern (mit 0)
    // International: mindestens 8 Ziffern
    const digitsOnly = cleaned.replace(/\D/g, '');
    return digitsOnly.length >= 8;
  };

  const handlePhoneModalChange = (field: string, value: string) => {
    setPhoneModalData(prev => ({ ...prev, [field]: value }));
    if (field === 'number' && phoneValidationError) {
      // Validierung beim Tippen aktualisieren
      if (validatePhoneNumber(value)) {
        setPhoneValidationError('');
      }
    }
  };

  const savePhoneNumber = () => {
    if (!phoneModalData.number.trim()) {
      setPhoneValidationError('*Keine gültige Telefonnummer');
      return;
    }

    if (!validatePhoneNumber(phoneModalData.number)) {
      setPhoneValidationError('*Keine gültige Telefonnummer');
      return;
    }

    if (editingPhoneId) {
      // Update bestehende Nummer
      setPhoneNumbers(prev => prev.map(phone => 
        phone.id === editingPhoneId
          ? { ...phone, type: phoneModalData.type, number: phoneModalData.number, countryCode: phoneModalData.countryCode }
          : phone
      ));
    } else {
      // Neue Nummer hinzufügen
      const newPhone: PhoneNumber = {
        id: `phone-${nextPhoneIdRef.current++}`,
        type: phoneModalData.type,
        number: phoneModalData.number,
        countryCode: phoneModalData.countryCode
      };
      setPhoneNumbers(prev => [...prev, newPhone]);
    }
    closePhoneModal();
  };

  const callPhoneNumber = (phone: PhoneNumber) => {
    // Hier könnte die Anruf-Logik implementiert werden
    const fullNumber = `${phone.countryCode} ${phone.number}`;
    window.location.href = `tel:${fullNumber.replace(/\s+/g, '')}`;
  };

  const deletePhoneNumber = (id: string) => {
    setPhoneNumbers(prev => prev.filter(phone => phone.id !== id));
  };

  const getCountryFlag = (countryCode: string): JSX.Element | null => {
    const flagMap: { [key: string]: JSX.Element } = {
      '+49': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="160" fill="#000000" y="0"/>
          <rect width="640" height="160" fill="#DD0000" y="160"/>
          <rect width="640" height="160" fill="#FFCE00" y="320"/>
        </svg>
      ),
      '+43': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="160" fill="#ED2939" y="0"/>
          <rect width="640" height="160" fill="#FFFFFF" y="160"/>
          <rect width="640" height="160" fill="#ED2939" y="320"/>
        </svg>
      ),
      '+41': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="480" fill="#FF0000"/>
          <path d="M170 257.5h300v-35h-300z" fill="#FFFFFF"/>
          <path d="M275 190v100h-35V190z" fill="#FFFFFF"/>
        </svg>
      ),
      '+33': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="213.3" height="480" fill="#002654" x="0"/>
          <rect width="213.3" height="480" fill="#FFFFFF" x="213.3"/>
          <rect width="213.3" height="480" fill="#ED2939" x="426.6"/>
        </svg>
      ),
    };
    return flagMap[countryCode] || null;
  };

  /** Modals, die die Gesprächshilfen ausgrauen (nicht das „Anfrage abschicken“-/Weiterleiten-Popup) */
  const guidanceSidebarObscuredByOtherModal =
    isKlientLoeschenModalOpen ||
    isAnrufEinstellungenModalOpen ||
    isPhoneModalOpen;

  /** Während „Anfrage abschicken“ (Weiterleiten) offen ist: immer volle Gesprächshilfen, nie ausgrauen */
  const guidanceSidebarObscured =
    guidanceSidebarObscuredByOtherModal && !isWeiterleitenModalOpen;

  return (
    <div className="anfrage-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <span>Pflegehilfe CRM</span>
          </div>
          <div
            className="app-variant-toggle"
            title="Oberflächen-Variante (Demo)"
          >
            <span className="app-variant-toggle__label">Variante</span>
            <div className="app-variant-toggle__buttons" role="group" aria-label="Oberflächen-Variante">
              {([1, 2, 3, 4, 5, 6] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={appVariant === v ? 'is-active' : ''}
                  aria-pressed={appVariant === v}
                  onClick={() => setAppVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="nav-center">
          <div className="nav-links">
            <a
              href="#"
              className={crmMainView === 'dashboard' ? 'nav-link-active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCrmMainView('dashboard');
              }}
            >
              Dashboard
            </a>
            <a
              href="#"
              className={crmMainView === 'anfrage' ? 'nav-link-active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCrmMainView('anfrage');
              }}
            >
              Klienten
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Anbieter
            </a>
          </div>
          <div className="nav-actions">
            <button type="button" className="nav-btn green">
              Neue Anfrage →
            </button>
            <button type="button" className="nav-btn green">
              Neue Aufgabe →
            </button>
            <button type="button" className="nav-btn green">
              Neue Aufgabe →
            </button>
            <button type="button" className="nav-btn blue">
              Neuer Sozialdienst →
            </button>
          </div>
        </div>
        <div className="nav-right">
          <div
            className="header-version-toggle header-version-toggle--top-nav"
            title="Header-Version (Demo): V2 ohne Bewertung, V3 mit Platzhalter"
          >
            <span className="header-version-toggle__label">UI</span>
            <div className="header-version-toggle__buttons" role="group" aria-label="Header-Version">
              <button
                type="button"
                className={headerUiVersion === 1 ? 'is-active' : ''}
                aria-pressed={headerUiVersion === 1}
                onClick={() => setHeaderUiVersion(1)}
              >
                V1
              </button>
              <button
                type="button"
                className={headerUiVersion === 2 ? 'is-active' : ''}
                aria-pressed={headerUiVersion === 2}
                onClick={() => setHeaderUiVersion(2)}
              >
                V2
              </button>
              <button
                type="button"
                className={headerUiVersion === 3 ? 'is-active' : ''}
                aria-pressed={headerUiVersion === 3}
                onClick={() => setHeaderUiVersion(3)}
              >
                V3
              </button>
            </div>
          </div>
          <div className="user-menu">
            <span>Hallo Hannah Venohr</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </nav>

      <div className={`crm-shell${crmMainView === 'dashboard' ? ' crm-shell--with-sidebar' : ''}`}>
        {crmMainView === 'dashboard' && (
          <aside className="crm-sidebar" aria-label="Hauptnavigation">
            <nav className="crm-sidebar-nav">
              <button
                type="button"
                className="crm-sidebar-item is-active"
                onClick={() => setCrmMainView('dashboard')}
              >
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ▤
                </span>
                Dashboard
              </button>
              <button type="button" className="crm-sidebar-item" onClick={() => setCrmMainView('anfrage')}>
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ＋
                </span>
                Neuer Klient
              </button>
              <button type="button" className="crm-sidebar-item" onClick={(e) => e.preventDefault()}>
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ⌕
                </span>
                Klient suchen
              </button>
              <button type="button" className="crm-sidebar-item" onClick={(e) => e.preventDefault()}>
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ⌕
                </span>
                Anbieter suchen
              </button>
              <button type="button" className="crm-sidebar-item" onClick={(e) => e.preventDefault()}>
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ☰
                </span>
                Offene Anfragen
              </button>
              <button type="button" className="crm-sidebar-item" onClick={(e) => e.preventDefault()}>
                <span className="crm-sidebar-icon" aria-hidden="true">
                  ⏱
                </span>
                Nachbetreuung
              </button>
            </nav>
            <footer className="crm-sidebar-footer">
              <p>© 2016 – Pflegehilfe CRM v2.0</p>
              <p>Verantwortlich: Michael Haas</p>
            </footer>
          </aside>
        )}

        {crmMainView === 'dashboard' ? (
          <div className="crm-main crm-main--dashboard">
            <Dashboard userDisplayName="Hannah Venohr" />
          </div>
        ) : (
          <div className="crm-main crm-main--anfrage">
            <div className="main-content-wrapper">
              <Gespraechsguidance
                klientDisplayName={
                  [formData.anrede, formData.vorname, formData.nachname].filter(Boolean).join(' ') || 'Unbekannt'
                }
                klientAnrede={formData.anrede}
                klientNachname={formData.nachname}
                isWeiterleitenMode={isWeiterleitenModalOpen}
                obscured={guidanceSidebarObscured}
              />

              {/* Anfrage anschließen / Anfrage abschließen */}
              {isWeiterleitenModalOpen && (
                <div
                  className="main-content-modal-overlay"
                  onClick={() => setIsWeiterleitenModalOpen(false)}
                >
                  <div
                    className={`modal-content weiterleiten-modal weiterleiten-modal--v${weiterleitenPopupVersion}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="weiterleiten-modal-kopfzeile">
                      <h2 className="modal-title modal-title-weiterleiten-kopf">Anfrage abschließen</h2>
                      <div className="weiterleiten-version-toggle" title="Variante des Popups (Vorschau)">
                        <span className="weiterleiten-version-toggle-label">Variante</span>
                        <div className="einstellungen-demo-segment-buttons" role="group" aria-label="Anfrage abschließen Variante">
                          <button
                            type="button"
                            className={weiterleitenPopupVersion === 1 ? 'is-active' : ''}
                            onClick={() => setWeiterleitenPopupVersion(1)}
                          >
                            1
                          </button>
                          <button
                            type="button"
                            className={weiterleitenPopupVersion === 2 ? 'is-active' : ''}
                            onClick={() => setWeiterleitenPopupVersion(2)}
                          >
                            2
                          </button>
                          <button
                            type="button"
                            className={weiterleitenPopupVersion === 3 ? 'is-active' : ''}
                            onClick={() => setWeiterleitenPopupVersion(3)}
                          >
                            3
                          </button>
                          <button
                            type="button"
                            className={weiterleitenPopupVersion === 4 ? 'is-active' : ''}
                            onClick={() => setWeiterleitenPopupVersion(4)}
                          >
                            4
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`weiterleiten-grid${weiterleitenPopupVersion !== 1 ? ' weiterleiten-grid--ohne-sitzlift-zeile' : ''}`}
                    >
                      {weiterleitenPopupVersion === 1 && (
                        <>
                          <div className="weiterleiten-column-title">Sitzlift</div>
                          <div className="weiterleiten-anbieter-card selected">
                            <div className="anbieter-head">
                              <span className="anbieter-name">Sonilift GmbH</span>
                              <span className="anbieter-check">✓</span>
                            </div>
                            <div className="anbieter-status">Kriterien Check erfolgreich!</div>
                          </div>
                          <div className="weiterleiten-anbieter-card selected">
                            <div className="anbieter-head">
                              <span className="anbieter-name">SANA Treppenlifte</span>
                              <span className="anbieter-check">✓</span>
                            </div>
                            <div className="anbieter-status">Kriterien Check erfolgreich!</div>
                          </div>
                          <div className="weiterleiten-anbieter-card selected">
                            <div className="anbieter-head">
                              <span className="anbieter-name">Expertlift GmbH</span>
                              <span className="anbieter-check">✓</span>
                            </div>
                            <div className="anbieter-status">Kriterien Check erfolgreich!</div>
                          </div>
                          <div className="weiterleiten-anbieter-card selected">
                            <div className="anbieter-head">
                              <span className="anbieter-name">Fairlifi Treppenlifte GmbH</span>
                              <span className="anbieter-check">✓</span>
                            </div>
                            <div className="anbieter-status">Kriterien Check erfolgreich!</div>
                          </div>
                        </>
                      )}

                      {weiterleitenPopupVersion !== 1 && (
                        <>
                          <div className="weiterleiten-column-title weiterleiten-column-title--tools">
                            <span className="weiterleiten-tools-heading">Informationsbroschüre</span>
                            <p className="weiterleiten-tools-subhint">Wird dem Klienten via E-Mail zugesendet.</p>
                          </div>
                          {istV3Popup2 && (
                            <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                              <div className="anbieter-head">
                                <span className="anbieter-name">Zuschüsse & Vorsorge</span>
                                <button
                                  type="button"
                                  className={`anbieter-check${weiterleitenV3Tools.zuschuesseVorsorgeChecked ? '' : ' anbieter-check--unchecked'}`}
                                  onClick={toggleWeiterleitenV3ZuschuesseVorsorge}
                                  aria-pressed={weiterleitenV3Tools.zuschuesseVorsorgeChecked}
                                  aria-label="Zuschüsse & Vorsorge in die E-Mail-Auswahl aufnehmen"
                                >
                                  {weiterleitenV3Tools.zuschuesseVorsorgeChecked ? '✓' : ''}
                                </button>
                              </div>
                            </div>
                          )}
                          {(!istV3Popup2 || weiterleitenV3Tools.showMoreTools) && (
                          <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                            <div className="anbieter-head">
                              <span className="anbieter-name">Barrierefreies Zuhause</span>
                              {weiterleitenZeigtTools ? (
                                <button
                                  type="button"
                                  className={`anbieter-check${weiterleitenV3Tools.pflegegradChecked ? '' : ' anbieter-check--unchecked'}`}
                                  onClick={toggleWeiterleitenV3Pflegegrad}
                                  aria-pressed={weiterleitenV3Tools.pflegegradChecked}
                                  aria-label="Barrierefreies Zuhause in die E-Mail-Auswahl aufnehmen"
                                >
                                  {weiterleitenV3Tools.pflegegradChecked ? '✓' : ''}
                                </button>
                              ) : (
                                <span className="anbieter-check" aria-hidden="true">✓</span>
                              )}
                            </div>
                          </div>
                          )}
                          {appVariant !== 1 && !istV3Popup2 && (
                            <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                              <div className="anbieter-head">
                                <span className="anbieter-name">Hilfsmittel & Mobilität</span>
                                <button
                                  type="button"
                                  className={`anbieter-check${weiterleitenV3Tools.hilfsmittelMobilitaetChecked ? '' : ' anbieter-check--unchecked'}`}
                                  onClick={toggleWeiterleitenV3HilfsmittelMobilitaet}
                                  aria-pressed={weiterleitenV3Tools.hilfsmittelMobilitaetChecked}
                                  aria-label="Hilfsmittel & Mobilität in die E-Mail-Auswahl aufnehmen"
                                >
                                  {weiterleitenV3Tools.hilfsmittelMobilitaetChecked ? '✓' : ''}
                                </button>
                              </div>
                            </div>
                          )}
                          {!weiterleitenV3Tools.showMoreTools && (
                            <div className="weiterleiten-anbieter-card weiterleiten-weitere-card">
                              <button
                                type="button"
                                className="btn-blue weiterleiten-weitere-button"
                                onClick={handleWeiterleitenWeitereClick}
                                aria-label="Weitere Informationsbroschüren anzeigen"
                              >
                                Weitere
                              </button>
                            </div>
                          )}
                          {weiterleitenV3Tools.showMoreTools && (
                            <>
                              <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                                <div className="anbieter-head">
                                  <span className="anbieter-name">Pflege & Wohnen</span>
                                  <button
                                    type="button"
                                    className={`anbieter-check${weiterleitenV3Tools.pflegeWohnenChecked ? '' : ' anbieter-check--unchecked'}`}
                                    onClick={toggleWeiterleitenV3PflegeWohnen}
                                    aria-pressed={weiterleitenV3Tools.pflegeWohnenChecked}
                                    aria-label="Pflege & Wohnen in die E-Mail-Auswahl aufnehmen"
                                  >
                                    {weiterleitenV3Tools.pflegeWohnenChecked ? '✓' : ''}
                                  </button>
                                </div>
                              </div>
                              {(appVariant === 1 || istV3Popup2) && (
                              <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                                <div className="anbieter-head">
                                  <span className="anbieter-name">Hilfsmittel & Mobilität</span>
                                  <button
                                    type="button"
                                    className={`anbieter-check${weiterleitenV3Tools.hilfsmittelMobilitaetChecked ? '' : ' anbieter-check--unchecked'}`}
                                    onClick={toggleWeiterleitenV3HilfsmittelMobilitaet}
                                    aria-pressed={weiterleitenV3Tools.hilfsmittelMobilitaetChecked}
                                    aria-label="Hilfsmittel & Mobilität in die E-Mail-Auswahl aufnehmen"
                                  >
                                    {weiterleitenV3Tools.hilfsmittelMobilitaetChecked ? '✓' : ''}
                                  </button>
                                </div>
                              </div>
                              )}
                              {!istV3Popup2 && (
                              <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card">
                                <div className="anbieter-head">
                                  <span className="anbieter-name">Zuschüsse & Vorsorge</span>
                                  <button
                                    type="button"
                                    className={`anbieter-check${weiterleitenV3Tools.zuschuesseVorsorgeChecked ? '' : ' anbieter-check--unchecked'}`}
                                    onClick={toggleWeiterleitenV3ZuschuesseVorsorge}
                                    aria-pressed={weiterleitenV3Tools.zuschuesseVorsorgeChecked}
                                    aria-label="Zuschüsse & Vorsorge in die E-Mail-Auswahl aufnehmen"
                                  >
                                    {weiterleitenV3Tools.zuschuesseVorsorgeChecked ? '✓' : ''}
                                  </button>
                                </div>
                              </div>
                              )}
                            </>
                          )}
                          {weiterleitenV2EmailStreckeSichtbar && (
                            <div className="weiterleiten-column-title weiterleiten-column-title--tools weiterleiten-column-title--sonstiges">
                              <span className="weiterleiten-tools-heading">Sonstiges</span>
                              <p className="weiterleiten-tools-subhint">Dem Klienten wird eine E-Mail zugesendet.</p>
                            </div>
                          )}
                          {weiterleitenV2EmailStreckeSichtbar && (
                            <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card weiterleiten-kontakt-praeferenzen-box">
                              <div className="anbieter-head">
                                <span className="anbieter-name">Kein akuter Bedarf</span>
                                <button
                                  type="button"
                                  className={`anbieter-check${weiterleitenV3Tools.kontaktPraeferenzenChecked ? ' anbieter-check--unchecked' : ''}`}
                                  onClick={selectWeiterleitenV3EmailStrecke}
                                  aria-pressed={!weiterleitenV3Tools.kontaktPraeferenzenChecked}
                                  aria-label="Kein akuter Bedarf auswählen"
                                >
                                  {weiterleitenV3Tools.kontaktPraeferenzenChecked ? '' : '✓'}
                                </button>
                              </div>
                            </div>
                          )}
                          {weiterleitenV2EmailStreckeSichtbar && (
                            <div className="weiterleiten-anbieter-card selected weiterleiten-tool-card weiterleiten-v3-kontakt-praeferenzen-kachel">
                              <div className="anbieter-head">
                                <span className="anbieter-name">Kontakt-Einstellungen</span>
                                <button
                                  type="button"
                                  className={`anbieter-check${weiterleitenV3Tools.kontaktPraeferenzenChecked ? '' : ' anbieter-check--unchecked'}`}
                                  onClick={toggleWeiterleitenV3KontaktPraeferenzen}
                                  aria-pressed={weiterleitenV3Tools.kontaktPraeferenzenChecked}
                                  aria-label="Kontakt-Einstellungen in die E-Mail-Auswahl aufnehmen"
                                >
                                  {weiterleitenV3Tools.kontaktPraeferenzenChecked ? '✓' : ''}
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="weiterleiten-klient-block">
                      {weiterleitenPopupVersion === 1 && (
                        <div className="weiterleiten-klient-erreichbarkeit">
                          <div className="weiterleiten-options-title">Beste telefonische Erreichbarkeit</div>
                          <div className="weiterleiten-options">
                            <label className={!erreichbarkeit.ganztägig ? 'weiterleiten-option-unchecked' : ''}>
                              <input
                                type="checkbox"
                                checked={erreichbarkeit.ganztägig}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setErreichbarkeit((prev) => ({
                                    ...prev,
                                    ganztägig: checked,
                                    ...(checked ? { vormittags: true, nachmittags: true, abends: true } : {})
                                  }));
                                }}
                              />
                              Ganztägig
                            </label>
                            <span className="weiterleiten-option-separator" aria-hidden="true" />
                            <label className={!erreichbarkeit.vormittags ? 'weiterleiten-option-unchecked' : ''}>
                              <input
                                type="checkbox"
                                checked={erreichbarkeit.vormittags}
                                onChange={(e) => setErreichbarkeit((prev) => ({ ...prev, vormittags: e.target.checked }))}
                              />
                              Vormittags
                            </label>
                            <label className={!erreichbarkeit.nachmittags ? 'weiterleiten-option-unchecked' : ''}>
                              <input
                                type="checkbox"
                                checked={erreichbarkeit.nachmittags}
                                onChange={(e) => setErreichbarkeit((prev) => ({ ...prev, nachmittags: e.target.checked }))}
                              />
                              Nachmittags
                            </label>
                            <label className={!erreichbarkeit.abends ? 'weiterleiten-option-unchecked' : ''}>
                              <input
                                type="checkbox"
                                checked={erreichbarkeit.abends}
                                onChange={(e) => setErreichbarkeit((prev) => ({ ...prev, abends: e.target.checked }))}
                              />
                              Abends
                            </label>
                          </div>
                        </div>
                      )}
                      {(weiterleitenPopupVersion === 1 ||
                        nachgespraechConsentSichtbar) && (
                        <div className="weiterleiten-klient-zustimmung">
                          {weiterleitenPopupVersion === 1 && (
                            <label className={`weiterleiten-consent ${!zustimmungKontaktweitergabe ? 'weiterleiten-option-unchecked' : ''}`}>
                              <input
                                type="checkbox"
                                checked={zustimmungKontaktweitergabe}
                                onChange={(e) => setZustimmungKontaktweitergabe(e.target.checked)}
                              />
                              Wir geben Ihre Kontaktinformationen an die genannten Anbieter weiter und diese melden sich telefonisch bei Ihnen.
                            </label>
                          )}
                          {nachgespraechConsentSichtbar && (
                            <label
                              className={`weiterleiten-consent ${!zustimmungNachgespraechBeratung ? 'weiterleiten-option-unchecked' : ''}${weiterleitenZeigtTools && !weiterleitenV2V3NachgespraechZustimmungErforderlich ? ' weiterleiten-consent--optional' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={zustimmungNachgespraechBeratung}
                                onChange={(e) => setZustimmungNachgespraechBeratung(e.target.checked)}
                                aria-required={
                                  weiterleitenPopupVersion === 1 ||
                                  (weiterleitenZeigtTools && weiterleitenV2V3NachgespraechZustimmungErforderlich)
                                }
                              />
                              Wir werden uns in Zukunft wieder bei Ihnen melden (schriftlich & telefonisch).
                            </label>
                          )}
                        </div>
                      )}
                      {keinAkuterBedarfGewaehlt && (
                        <label className="weiterleiten-consent weiterleiten-consent--email-deaktivieren">
                          <input
                            type="checkbox"
                            checked={keinBedarfEmailVersandDeaktiviert}
                            onChange={(e) => setKeinBedarfEmailVersandDeaktiviert(e.target.checked)}
                          />
                          E-Mail-Versand deaktivieren
                        </label>
                      )}
                    </div>

                    <div className="weiterleiten-bottom-grid">
                      <div className="weiterleiten-followup-block">
                        <div className="weiterleiten-followup-fields weiterleiten-followup-stacked">
                          <div className="weiterleiten-followup-field">
                            <div className="weiterleiten-followup-field-label">Nachbetreuung am</div>
                            <input type="text" defaultValue="04.03.26" aria-label="Nachbetreuung am" />
                          </div>
                          <div className="weiterleiten-followup-field">
                            <div className="weiterleiten-followup-field-label">Uhrzeit</div>
                            <input type="text" defaultValue="16:18" aria-label="Uhrzeit" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="weiterleiten-footer weiterleiten-footer--stacked">
                      <div className="weiterleiten-footer-trailing">
                        {weiterleitenPopupVersion === 1 && (
                          <div className="weiterleiten-note">
                            Super - die umsatzstärkste Anbieterauswahl wurde ausgewählt!
                          </div>
                        )}
                        {weiterleitenBonusHinweisSichtbar && (
                          <div className="weiterleiten-bonus-hinweis" role="alert">
                            Deine Erfolgsquote sinkt.
                          </div>
                        )}
                        {weiterleitenPopupVersion !== 1 && !weiterleitenBonusHinweisSichtbar && (
                          <div className="weiterleiten-erfolg-hinweis">
                            Deine Erfolgsquote steigt.
                          </div>
                        )}
                        <div className="weiterleiten-actions">
                          <button
                            type="button"
                            className="btn-blue"
                            disabled={!weiterleitenAbschickenEnabled}
                            onClick={() => {
                              showAppToast('email');
                              setIsWeiterleitenModalOpen(false);
                            }}
                          >
                            Abschicken
                          </button>
                          <button type="button" className="btn-orange" onClick={() => setIsWeiterleitenModalOpen(false)}>
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="main-content">
          {/* Header (sticky bis zur Trennlinie über „Pflegehilfe+ gebucht“) */}
          <div className="main-content-sticky-top">
          <div className="content-header">
            {appVariant !== 1 ? (
              <div className="nachbetreuung-einstieg">
                <h1 className="nachbetreuung-einstieg__title">
                  <span className="nachbetreuung-einstieg__icon" aria-hidden="true">🕐</span>
                  {appVariant === 4 || appVariant === 5 || appVariant === 6 ? 'Lifetime Nachbetreuung' : 'Nachbetreuung'}
                </h1>
                <p className="nachbetreuung-einstieg__meta">
                  <a
                    href="#"
                    className="nachbetreuung-einstieg__link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Zuletzt weitergeleitet
                  </a>
                  {appVariant !== 6 && <>{' '}am 15. Juni 2026 14:09</>}
                </p>
                <div className="nachbetreuung-einstieg__cols">
                  <div className={`nachbetreuung-einstieg__col${appVariant === 6 ? ' nachbetreuung-einstieg__col--single' : ''}`}>
                    <div className="nachbetreuung-einstieg__col-head">
                      {appVariant === 6 ? ' ' : 'Anbieterkontakt'}
                    </div>
                    <div className="nachbetreuung-einstieg__col-body">
                      {appVariant === 6 ? (
                        <span className="nachbetreuung-einstieg__empty">Bisher keine Weiterleitung erfolgt</span>
                      ) : istWieVariante3 ? (
                        <span className="nachbetreuung-einstieg__empty">Nichts</span>
                      ) : (
                        <>
                          <a href="#" onClick={(e) => e.preventDefault()}>Hausnotruf</a>
                          <a href="#" onClick={(e) => e.preventDefault()}>Sitzlift</a>
                        </>
                      )}
                    </div>
                  </div>
                  {appVariant !== 6 && (
                    <div className="nachbetreuung-einstieg__col">
                      <div className="nachbetreuung-einstieg__col-head">Informationsbroschüren</div>
                      <div className="nachbetreuung-einstieg__col-body">
                        {appVariant === 3 || appVariant === 5 ? (
                          <span className="nachbetreuung-einstieg__broschuere-gruen">Barrierefreies Zuhause</span>
                        ) : (
                          <span className="nachbetreuung-einstieg__empty">Nichts</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <h1>Anfrage zu Sitzlift in Erstellt: 19. Januar 2026 13:54</h1>
            )}
            <div className="header-actions-column">
            <div
              className="header-actions"
              onMouseEnter={() => setFormData((prev) => ({ ...prev, activeGuidanceSection: 'abschluss' }))}
            >
              <div className="header-actions-group">
              <button type="button" className="btn-grey">
                Speichern
              </button>
              <div className="aktionen-dropdown-wrap" ref={aktionenDropdownRef}>
                <button
                  type="button"
                  className="btn-dropdown"
                  aria-haspopup="menu"
                  aria-expanded={isAktionenDropdownOpen}
                  onClick={() => setIsAktionenDropdownOpen((o) => !o)}
                >
                  <span>Aktionen</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                {isAktionenDropdownOpen && (
                  <div className="aktionen-dropdown-menu" role="menu">
                    <div className="aktionen-dropdown-section" role="none">
                      <button type="button" className="aktionen-dropdown-item" role="menuitem" onClick={() => setIsAktionenDropdownOpen(false)}>
                        <span className="aktionen-dropdown-icon" aria-hidden="true">📞</span>
                        Telefonnummer suchen
                      </button>
                    </div>
                    <div className="aktionen-dropdown-divider" role="separator" />
                    <div className="aktionen-dropdown-section" role="none">
                      <button type="button" className="aktionen-dropdown-item" role="menuitem" onClick={() => setIsAktionenDropdownOpen(false)}>
                        <span className="aktionen-dropdown-icon" aria-hidden="true">📊</span>
                        Terminhistorie
                      </button>
                      <button type="button" className="aktionen-dropdown-item" role="menuitem" onClick={() => setIsAktionenDropdownOpen(false)}>
                        <span className="aktionen-dropdown-icon" aria-hidden="true">🔀</span>
                        Historie
                      </button>
                    </div>
                    <div className="aktionen-dropdown-divider" role="separator" />
                    <div className="aktionen-dropdown-section" role="none">
                      <button
                        type="button"
                        className="aktionen-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          void navigator.clipboard
                            .writeText(`${window.location.origin}${window.location.pathname}`)
                            .then(() => {
                              showAppToast('copy');
                              setIsAktionenDropdownOpen(false);
                            })
                            .catch(() => {
                              setIsAktionenDropdownOpen(false);
                            });
                        }}
                      >
                        <span className="aktionen-dropdown-icon" aria-hidden="true">📋</span>
                        CRM-Link kopieren
                      </button>
                      <button type="button" className="aktionen-dropdown-item" role="menuitem" onClick={() => setIsAktionenDropdownOpen(false)}>
                        <span className="aktionen-dropdown-icon" aria-hidden="true">✅</span>
                        Adresse validieren
                      </button>
                      <button
                        type="button"
                        className="aktionen-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          handleDsgvoAuskunftDownload();
                          setIsAktionenDropdownOpen(false);
                        }}
                      >
                        <span className="aktionen-dropdown-icon" aria-hidden="true">📄</span>
                        DSGVO Auskunft
                      </button>
                    </div>
                    <div className="aktionen-dropdown-divider" role="separator" />
                    <div className="aktionen-dropdown-section" role="none">
                      <button
                        type="button"
                        className="aktionen-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          setIsAktionenDropdownOpen(false);
                          setIsKontaktEinstellungenModalOpen(true);
                        }}
                      >
                        <span className="aktionen-dropdown-icon" aria-hidden="true">⚙️</span>
                        Kontakt-Einstellungen
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
              <div className="header-actions-group">
              <button type="button" className="btn-blue">
                Freigeben
              </button>
              </div>
              <div className="header-actions-divider" role="presentation" aria-hidden="true" />
              <div
                className={`header-actions-group${
                  headerUiVersion === 2
                    ? ' header-actions-group--bewertung-collapsed'
                    : headerUiVersion === 3
                      ? ' header-actions-group--bewertung-placeholder'
                      : ''
                }`}
              >
              <button
                type="button"
                className={`btn-yellow header-btn-bewertung header-btn-emphasis${bewertungAusgeblendet ? ' header-btn-bewertung--hidden' : ''}`}
                aria-hidden={bewertungAusgeblendet}
                tabIndex={bewertungAusgeblendet ? -1 : undefined}
              >
                <span className="icon star-icon">★</span>
                <span>Bewertung</span>
              </button>
              <button
                type="button"
                className="btn-green btn-header-cta header-btn-emphasis"
                onClick={() => setIsWeiterleitenModalOpen(true)}
                disabled={!alleProduktKriterienVollstaendig}
                title={
                  !alleProduktKriterienVollstaendig
                    ? 'Bitte zuerst alle Produktkriterien der ausgewählten Produkte anhaken.'
                    : undefined
                }
              >
                <span className="icon" aria-hidden="true">
                  ✓
                </span>
                <span>Anfrage abschließen</span>
              </button>
              </div>
            </div>
            <div className="header-actions-meta">
              <p className="promo-toolbar-responsible-line">
                <span className="promo-toolbar-responsible-line__label">Verantwortlicher:</span>{' '}
                <span className="promo-toolbar-responsible-line__email">hannah.venohr@pflegehilfe.de</span>
              </p>
              <button
                type="button"
                className="icon-btn header-actions-refresh"
                aria-label="Aktualisieren"
                title="Aktualisieren"
              >
                🔄
              </button>
            </div>
          </div>
          </div>
          </div>

          {/* Klient / Interessent (Persönliche Daten + Kontakt in zweiter Zeile) */}
          <div
            id="klient-persoenliche-daten"
            className="section klient-section"
            onMouseEnter={() => setFormData(prev => ({ ...prev, activeGuidanceSection: 'klient' }))}
          >
            <div className="section-header green">
              <h2>Klient / Interessent</h2>
              <div className="section-actions">
                <button type="button" className="icon-btn">🏠</button>
              </div>
            </div>
            <div className="form-grid">
              <div className="klient-persoenlich-container">
                <div className="klient-col1-row1">
                  <div className="form-group">
                    <label>Anrede</label>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="anrede" value="Frau" checked={formData.anrede === 'Frau'} onChange={handleChange} />
                        Frau
                      </label>
                      <label>
                        <input type="radio" name="anrede" value="Herr" checked={formData.anrede === 'Herr'} onChange={handleChange} />
                        Herr
                      </label>
                    </div>
                  </div>
                  <div className="form-group klient-akadem-field">
                    <label>Akadem.</label>
                    <input
                      type="text"
                      name="akademGrad"
                      value={formData.akademGrad}
                      onChange={handleChange}
                      placeholder="Akademischer Grad angeben"
                    />
                  </div>
                </div>
                <div className="klient-col2-row1">
                  <div className="form-group klient-small-field">
                    <label>Vorname</label>
                    <input type="text" name="vorname" value={formData.vorname} onChange={handleChange} placeholder="Vorname angeben" />
                  </div>
                  <div className="form-group klient-small-field">
                    <label>Nachname</label>
                    <input type="text" name="nachname" value={formData.nachname} onChange={handleChange} placeholder="Nachname angeben" />
                  </div>
                </div>
                <div className="klient-comment-column">
                  <div className="form-group klient-comment-field klient-comment-field--single-line">
                    <label>Interner Kommentar (Klient)</label>
                    <input
                      type="text"
                      name="internerKommentar"
                      value={formData.internerKommentar}
                      onChange={handleChange}
                      placeholder="Internes bitte hier eintragen"
                    />
                  </div>
                  <div className="form-group klient-versichertennummer-field">
                    <label>Versichertennummer</label>
                    <input
                      type="text"
                      name="versichertennummer"
                      value={formData.versichertennummer}
                      onChange={handleChange}
                      placeholder="Versichertennummer angeben"
                      autoComplete="off"
                    />
                  </div>
                </div>
                {/* Zweite Zeile: Kontaktinformationen */}
                <div className="klient-row2-kontakt">
                  <div className="form-group klient-email-field">
                    <label>E-Mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-Mail angeben"
                    />
                  </div>
                  <div className="form-group phone-group">
                    <label>Telefonnummer</label>
                    <div className="phone-input-wrapper">
                      <button type="button" className="btn-blue" onClick={() => openPhoneModal()}>+ Neue Nummer</button>
                      {phoneNumbers.length === 0 && (
                        <span className="error-message">Eine Telefonnummer ist erforderlich.</span>
                      )}
                      {phoneNumbers.length > 0 && (
                        <div className="phone-numbers-list">
                          {phoneNumbers.map(phone => (
                            <div key={phone.id} className="phone-number-item">
                              {getCountryFlag(phone.countryCode) && (
                                <span className="country-flag-display">{getCountryFlag(phone.countryCode)}</span>
                              )}
                              <span className="phone-type">{phone.type}:</span>
                              <span className="phone-number">{phone.countryCode} {phone.number}</span>
                              <div className="phone-actions">
                                <button type="button" className="phone-call-btn" onClick={() => callPhoneNumber(phone)} title="Anrufen">
                                  <span className="phone-icon">📞</span>
                                  <span>Anrufen</span>
                                </button>
                                <button type="button" className="phone-edit-btn" onClick={() => openPhoneModal(phone.id)} title="Bearbeiten">
                                  <span className="edit-icon">⚙️</span>
                                </button>
                                <button type="button" className="phone-delete-btn" onClick={() => deletePhoneNumber(phone.id)} title="Löschen">
                                  <span className="delete-icon">🗑️</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Senior Section */}
          <div 
            className="section senior-section"
            onMouseEnter={() => setFormData(prev => ({ ...prev, activeGuidanceSection: 'senior' }))}
          >
            <div className="section-header green">
              <h2>Senior</h2>
              <div className="section-actions">
                <button type="button" className="btn-grey">Todesfall hinterlegen</button>
                <button type="button" className="btn-green">
                  <span className="icon">+</span>
                  <span>Senior hinzufügen</span>
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-row four-columns">
                <SelectField
                  name="beziehung"
                  value={formData.beziehung}
                  onChange={handleSelectChange}
                  label="Beziehung"
                  placeholder="Auswählen"
                  multiple={false}
                  options={[
                    { value: 'Mutter', label: 'Mutter' },
                    { value: 'Vater', label: 'Vater' },
                    { value: 'Ehepartner', label: 'Ehepartner' },
                    { value: 'Kind', label: 'Kind' },
                    { value: 'Tochter', label: 'Tochter' },
                    { value: 'Sohn', label: 'Sohn' },
                    { value: 'Schwester', label: 'Schwester' },
                    { value: 'Bruder', label: 'Bruder' },
                    { value: 'Andere', label: 'Andere' }
                  ]}
                />
                <div className="form-group">
                  <SelectField
                    name="pflegegrad"
                    value={formData.pflegegrad}
                    onChange={handleSelectChange}
                    label="Pflegegrad/-stufe"
                    placeholder="Auswählen"
                    multiple={false}
                    options={[
                      { value: 'Pflegegrad 1', label: 'Pflegegrad 1' },
                      { value: 'Pflegegrad 2', label: 'Pflegegrad 2' },
                      { value: 'Pflegegrad 3', label: 'Pflegegrad 3' },
                      { value: 'Pflegegrad 4', label: 'Pflegegrad 4' },
                      { value: 'Pflegegrad 5', label: 'Pflegegrad 5' }
                    ]}
                  />
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="erhoehungBeantragt"
                      checked={formData.erhoehungBeantragt}
                      onChange={handleChange}
                    />
                    Erhöhung beantragt
                  </label>
                </div>
                <SelectField
                  name="medizinischerHintergrund"
                  value={formData.medizinischerHintergrund}
                  onChange={handleSelectChange}
                  label="Medizinischer Hintergrund"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Körperlich eingeschränkt', label: 'Körperlich eingeschränkt' },
                    { value: 'Altersschwäche', label: 'Altersschwäche' },
                    { value: 'Demenz', label: 'Demenz' },
                    { value: 'Herz-Kreislauf-Erkrankung', label: 'Herz-Kreislauf-Erkrankung' },
                    { value: 'Diabetes', label: 'Diabetes' },
                    { value: 'Arthrose', label: 'Arthrose' },
                    { value: 'Schlaganfall', label: 'Schlaganfall' },
                    { value: 'Parkinson', label: 'Parkinson' },
                    { value: 'Andere', label: 'Andere' }
                  ]}
                />
                <SelectField
                  name="mobilitaet"
                  value={formData.mobilitaet}
                  onChange={handleSelectChange}
                  label="Mobilität"
                  placeholder="Auswählen"
                  multiple={false}
                  options={[
                    { value: 'Vollständig mobil', label: 'Vollständig mobil' },
                    { value: 'Eingeschränkt mobil', label: 'Eingeschränkt mobil' },
                    { value: 'Rollstuhl', label: 'Rollstuhl' },
                    { value: 'Gehhilfe', label: 'Gehhilfe' },
                    { value: 'Rollator', label: 'Rollator' },
                    { value: 'Bettlägerig', label: 'Bettlägerig' },
                    { value: 'Treppensteigen möglich', label: 'Treppensteigen möglich' },
                    { value: 'Treppensteigen nicht möglich', label: 'Treppensteigen nicht möglich' }
                  ]}
                />
              </div>
              <div className="form-row">
                <SelectField
                  name="barrierefreiheit"
                  value={formData.barrierefreiheit}
                  onChange={handleSelectChange}
                  label="Barrierefreiheit"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Rollstuhlgerecht', label: 'Rollstuhlgerecht' },
                    { value: 'Treppenlift', label: 'Treppenlift' },
                    { value: 'Aufzug', label: 'Aufzug' },
                    { value: 'Barrierefreies Bad', label: 'Barrierefreies Bad' },
                    { value: 'Keine Barrieren', label: 'Keine Barrieren' }
                  ]}
                />
                <SelectField
                  name="wohnsituation"
                  value={formData.wohnsituation}
                  onChange={handleSelectChange}
                  label="Wohnsituation"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Eigene Wohnung', label: 'Eigene Wohnung' },
                    { value: 'Bei Angehörigen', label: 'Bei Angehörigen' },
                    { value: 'Pflegeheim', label: 'Pflegeheim' },
                    { value: 'Betreutes Wohnen', label: 'Betreutes Wohnen' },
                    { value: 'Wohngemeinschaft', label: 'Wohngemeinschaft' },
                    { value: 'Eigentumswohnung', label: 'Eigentumswohnung' },
                    { value: 'Mietwohnung', label: 'Mietwohnung' }
                  ]}
                />
                <SelectField
                  name="aktuelleVersorgung"
                  value={formData.aktuelleVersorgung}
                  onChange={handleSelectChange}
                  label="Aktuelle Versorgung"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Pflegedienst', label: 'Pflegedienst' },
                    { value: 'Angehörige', label: 'Angehörige' },
                    { value: 'Tagespflege', label: 'Tagespflege' },
                    { value: 'Kurzzeitpflege', label: 'Kurzzeitpflege' },
                    { value: 'Keine', label: 'Keine' }
                  ]}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Anrede</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="seniorAnrede" 
                        value="Frau" 
                        checked={formData.seniorAnrede === 'Frau'}
                        onChange={handleChange}
                      />
                      Frau
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="seniorAnrede" 
                        value="Herr" 
                        checked={formData.seniorAnrede === 'Herr'}
                        onChange={handleChange}
                      />
                      Herr
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Akadem.</label>
                  <input 
                    type="text" 
                    name="seniorAkademGrad"
                    value={formData.seniorAkademGrad}
                    onChange={handleChange}
                    placeholder="Akademischer Grad angeben"
                  />
                </div>
                <div className="form-group">
                  <label>Vorname des Seniors</label>
                  <input 
                    type="text" 
                    name="seniorVorname"
                    value={formData.seniorVorname}
                    onChange={handleChange}
                    placeholder="Vorname angeben"
                  />
                </div>
                <div className="form-group">
                  <label>Nachname des Seniors</label>
                  <input 
                    type="text" 
                    name="seniorNachname"
                    value={formData.seniorNachname}
                    onChange={handleChange}
                    placeholder="Nachname angeben"
                  />
                </div>
                <div className="form-group">
                  <label>Alter</label>
                  <input 
                    type="text" 
                    name="alter"
                    value={formData.alter}
                    onChange={handleChange}
                    placeholder="Alter angeben"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weiterleitung Section (grüne Überschrift, enthält Tools, PLZ, Collapsible, Actions) */}
          <div 
            className="section weiterleitung-section"
            onMouseEnter={() => setFormData(prev => ({ ...prev, activeGuidanceSection: 'weiterleitung' }))}
          >
            <div className="section-header green">
              <h2>Produkte zusammenstellen</h2>
            </div>
            <div className="form-grid">

              {/* Reiter-Container: Tab-Leiste + Inhalt als klassische Reiter */}
              <div className="produkt-reiter-container">
                <div className="produkt-reiter-leiste" ref={produktDropdownRef}>
                  {produktTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`produkt-reiter ${activeProduktTabId === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveProduktTabId(tab.id)}
                    >
                      <span className="produkt-reiter-check">✓</span>
                      <span className="produkt-reiter-label">
                        {tab.label} ({tab.count} von {tab.maxAN} AN)
                      </span>
                      <span
                        className="produkt-reiter-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProduktTab(tab.id);
                        }}
                        aria-label="Reiter entfernen"
                      >
                        ×
                      </span>
                    </button>
                  ))}
                  <div className="produkt-reiter-dropdown-wrap">
                    <button
                      type="button"
                      className="produkt-reiter-dropdown-btn"
                      onClick={() => setProduktDropdownOpen(!produktDropdownOpen)}
                      aria-expanded={produktDropdownOpen}
                    >
                      <span>{produktTabs.length} ausgewählt</span>
                      <span className="dropdown-arrow">▼</span>
                    </button>
                    {produktDropdownOpen && (
                      <div className="produkt-reiter-dropdown-menu">
                        {availableProdukte.map((p) => {
                          const alreadyAdded = produktTabs.some((t) => t.id === p.value || t.label === p.label);
                          return (
                            <button
                              key={p.value}
                              type="button"
                              className="produkt-reiter-dropdown-option"
                              disabled={alreadyAdded}
                              onClick={() => addProduktTab(p.value, p.label, p.maxAN)}
                            >
                              {p.label} ({p.maxAN})
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {!activeProduktTabId && (
                  <div className="produkt-inhalt-leer">
                    Kein Produkt geöffnet. Über die Auswahl oben ein Produkt hinzufügen.
                  </div>
                )}
                <div className={`produkt-inhalt-bereich${!activeProduktTabId ? ' produkt-inhalt-bereich--hidden' : ''}`}>
                  <div className="produkt-tab-content">
                    {/* Oben: Postleitzahl und Region (beziehen sich auf das ausgewählte Produkt) */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Postleitzahl</label>
                        <div className="plz-input-group">
                          <select className="country-code">
                            <option>DE</option>
                          </select>
                          <input 
                            type="text" 
                            name="postleitzahl"
                            value={formData.postleitzahl}
                            onChange={handleChange}
                            placeholder="Postleitzahl angeben"
                          />
                          <button className="btn-search">Suchen</button>
                        </div>
                        {!formData.postleitzahl && (
                          <span className="error-message">Region *benötigt valide Postleitzahl</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Region</label>
                        <input 
                          type="text" 
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          placeholder="Region angeben"
                        />
                      </div>
                    </div>

                    {/* Accordions: Generelle Kriterien, Produktkriterien */}
                    <div className="accordion-section">
                      {/* Generelle Kriterien Accordion */}
                      <div className="accordion-item">
                        <button 
                          type="button" 
                          className="reiter-unter-plz-header accordion-header"
                          onClick={() => setGenerelleKriterienExpanded(!generelleKriterienExpanded)}
                        >
                          <span className="reiter-unter-plz-text">Generelle Kriterien</span>
                          <span className={`reiter-unter-plz-chevron ${generelleKriterienExpanded ? 'expanded' : ''}`}>
                            {generelleKriterienExpanded ? '▼' : '›'}
                          </span>
                        </button>
                        {generelleKriterienExpanded && (
                          <div className="accordion-content">
                            {/* Inhalt für Generelle Kriterien - später ergänzen */}
                            <p>Inhalte für Generelle Kriterien folgen.</p>
                          </div>
                        )}
                      </div>


                    {/* Produktkriterien: graue Überschrift wie „Informationen“, alle Kriterien fix darunter */}
                      <div className="accordion-item">
                        <button 
                          type="button" 
                          className="reiter-unter-plz-header accordion-header produktkriterien-header"
                          onClick={() => setProduktkriterienExpanded(!produktkriterienExpanded)}
                        >
                          <span className="reiter-unter-plz-text">Produktkriterien:</span>
                          <span className={`reiter-unter-plz-chevron ${produktkriterienExpanded ? 'expanded' : ''}`}>
                            {produktkriterienExpanded ? '▼' : '›'}
                          </span>
                        </button>
                        {produktkriterienExpanded && (
                          <div className="accordion-content produktkriterien-content">
                            {/* Karten nebeneinander - Bedingt basierend auf aktivem Produkt */}
                            <div className="produktkriterien-cards">
                              {(() => {
                                const activeTab = produktTabs.find(tab => tab.id === activeProduktTabId);
                                const isSitzlift = activeTab?.label === 'Sitzlift' || activeTab?.id === 'sitzlift';
                                const isPflegekurseAngehoerige = activeTab?.label === 'Pflegekurse für Angehörige' || activeTab?.id === 'pflegekurse-angehoerige';
                                
                                if (isPflegekurseAngehoerige) {
                                  // Produktkriterien für Pflegekurse für Angehörige
                                  return (
                                    <>
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Einsatzdetails & Haushalt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Krankenkasse Kursteilnehmer*in</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <p className="produktkriterien-description">Die Krankenkasse des Kursteilnehmers ist gefragt, nicht der pflegebedürftigen Person.</p>
                                            <div className="form-group">
                                              <input
                                                type="text"
                                                placeholder="Krankenkasse auswählen"
                                                className="form-input-with-dropdown"
                                              />
                                              <span className="input-dropdown-arrow">▼</span>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Verfügbarkeit Versichertennummer</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="verfuegbarkeitVersichertennummer" value="vor" /> Versichertennummer liegt vor (0)</label>
                                              <label><input type="radio" name="verfuegbarkeitVersichertennummer" value="nicht_vor" /> Versichertennummer liegt nicht vor (0)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Beratungsart</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="checkbox-group">
                                              <label><input type="checkbox" name="beratungsartPflegekurse" value="video" /> Beratung per Video (0)</label>
                                              <label><input type="checkbox" name="beratungsartPflegekurse" value="vor_ort" /> Beratung vor Ort (0)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                } else if (isSitzlift) {
                                  // Sitzlift-Kriterien
                                  return (
                                    <>
                              {/* Karte 1: Haushalt */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Haushalt</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Einverständnis des Seniors</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="einverstaendnisSenior" value="vorhanden" checked={sitzliftKriterien.einverstaendnisSenior === 'vorhanden'} onChange={(e) => handleSitzliftKriterienChange('einverstaendnisSenior', e.target.value)} /> Liegt vor (10)</label>
                                      <label><input type="radio" name="einverstaendnisSenior" value="nicht_vorhanden" checked={sitzliftKriterien.einverstaendnisSenior === 'nicht_vorhanden'} onChange={(e) => handleSitzliftKriterienChange('einverstaendnisSenior', e.target.value)} /> Liegt nicht vor (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Pflegegrad/-stufe</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="pflegegradSitzlift" value="vorhanden" checked={sitzliftKriterien.pflegegradSitzlift === 'vorhanden'} onChange={(e) => handleSitzliftKriterienChange('pflegegradSitzlift', e.target.value)} /> Vorhanden (10)</label>
                                      <label><input type="radio" name="pflegegradSitzlift" value="beantragt" checked={sitzliftKriterien.pflegegradSitzlift === 'beantragt'} onChange={(e) => handleSitzliftKriterienChange('pflegegradSitzlift', e.target.value)} /> Beantragt (10)</label>
                                      <label><input type="radio" name="pflegegradSitzlift" value="nicht_vorhanden" checked={sitzliftKriterien.pflegegradSitzlift === 'nicht_vorhanden'} onChange={(e) => handleSitzliftKriterienChange('pflegegradSitzlift', e.target.value)} /> Nicht vorhanden (10)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Hausart</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="hausart" value="einfamilienhaus" checked={sitzliftKriterien.hausart === 'einfamilienhaus'} onChange={(e) => handleSitzliftKriterienChange('hausart', e.target.value)} /> Einfamilienhaus (19)</label>
                                      <label><input type="radio" name="hausart" value="zweifamilienhaus" checked={sitzliftKriterien.hausart === 'zweifamilienhaus'} onChange={(e) => handleSitzliftKriterienChange('hausart', e.target.value)} /> Zweifamilienhaus (18)</label>
                                      <label><input type="radio" name="hausart" value="mehrfamilienhaus" checked={sitzliftKriterien.hausart === 'mehrfamilienhaus'} onChange={(e) => handleSitzliftKriterienChange('hausart', e.target.value)} /> Mehrfamilienhaus (0)</label>
                                      <label><input type="radio" name="hausart" value="maisonette" checked={sitzliftKriterien.hausart === 'maisonette'} onChange={(e) => handleSitzliftKriterienChange('hausart', e.target.value)} /> Maisonette-Wohnung (10)</label>
                                      <label><input type="radio" name="hausart" value="gewerbe" checked={sitzliftKriterien.hausart === 'gewerbe'} onChange={(e) => handleSitzliftKriterienChange('hausart', e.target.value)} /> Gewerbe (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Immobilie</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="immobilie" value="eigentum" checked={sitzliftKriterien.immobilie === 'eigentum'} onChange={(e) => handleSitzliftKriterienChange('immobilie', e.target.value)} /> Eigentum (10)</label>
                                      <label><input type="radio" name="immobilie" value="miete" checked={sitzliftKriterien.immobilie === 'miete'} onChange={(e) => handleSitzliftKriterienChange('immobilie', e.target.value)} /> Miete (14)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Einverständnis des Vermieters</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="einverstaendnisVermieter" value="vorhanden" checked={sitzliftKriterien.einverstaendnisVermieter === 'vorhanden'} onChange={(e) => handleSitzliftKriterienChange('einverstaendnisVermieter', e.target.value)} /> Vorhanden/Eigentümer (10)</label>
                                      <label><input type="radio" name="einverstaendnisVermieter" value="angefragt" checked={sitzliftKriterien.einverstaendnisVermieter === 'angefragt'} onChange={(e) => handleSitzliftKriterienChange('einverstaendnisVermieter', e.target.value)} /> Angefragt/In Klärung (5)</label>
                                      <label><input type="radio" name="einverstaendnisVermieter" value="nicht_vorhanden" checked={sitzliftKriterien.einverstaendnisVermieter === 'nicht_vorhanden'} onChange={(e) => handleSitzliftKriterienChange('einverstaendnisVermieter', e.target.value)} /> Nicht vorhanden (3)</label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Karte 2: Anforderungen */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Anforderungen</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Treppenform + Standort</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="treppenform" value="gerade_innen" checked={sitzliftKriterien.treppenform === 'gerade_innen'} onChange={(e) => handleSitzliftKriterienChange('treppenform', e.target.value)} /> Gerade Treppe im Innenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="gerade_aussen" checked={sitzliftKriterien.treppenform === 'gerade_aussen'} onChange={(e) => handleSitzliftKriterienChange('treppenform', e.target.value)} /> Gerade Treppe im Außenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="kurvig_innen" checked={sitzliftKriterien.treppenform === 'kurvig_innen'} onChange={(e) => handleSitzliftKriterienChange('treppenform', e.target.value)} /> Kurvige Treppe im Innenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="kurvig_aussen" checked={sitzliftKriterien.treppenform === 'kurvig_aussen'} onChange={(e) => handleSitzliftKriterienChange('treppenform', e.target.value)} /> Kurvige Treppe im Außenbereich (16)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Etagen</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="etagen" value="1" checked={sitzliftKriterien.etagen === '1'} onChange={(e) => handleSitzliftKriterienChange('etagen', e.target.value)} /> 1 (10)</label>
                                      <label><input type="radio" name="etagen" value="2" checked={sitzliftKriterien.etagen === '2'} onChange={(e) => handleSitzliftKriterienChange('etagen', e.target.value)} /> 2 (18)</label>
                                      <label><input type="radio" name="etagen" value="3" checked={sitzliftKriterien.etagen === '3'} onChange={(e) => handleSitzliftKriterienChange('etagen', e.target.value)} /> 3 (18)</label>
                                      <label><input type="radio" name="etagen" value="4" checked={sitzliftKriterien.etagen === '4'} onChange={(e) => handleSitzliftKriterienChange('etagen', e.target.value)} /> 4 (18)</label>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
                                      Ab 2 Etagen: NUR kurvig und innen möglich
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Treppenbreite</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>8</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="treppenbreite" 
                                        min="70" 
                                        max="150" 
                                        value={sitzliftKriterien.treppenbreite}
                                        onChange={(e) => handleSitzliftKriterienChange('treppenbreite', e.target.value)}
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>70 cm</span>
                                        <span>150 cm</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Körpergewicht des Nutzers</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>10</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="koerpergewicht" 
                                        min="10" 
                                        max="200" 
                                        value={sitzliftKriterien.koerpergewicht}
                                        onChange={(e) => handleSitzliftKriterienChange('koerpergewicht', e.target.value)}
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>10 kg</span>
                                        <span>200 kg</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Zustand</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="checkbox-group">
                                      <label><input type="checkbox" name="zustand" value="neu" checked={sitzliftKriterien.zustand.includes('neu')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('zustand', sitzliftKriterien.zustand.includes(v) ? sitzliftKriterien.zustand.filter((x) => x !== v) : [...sitzliftKriterien.zustand, v]); }} /> Neu (10)</label>
                                      <label><input type="checkbox" name="zustand" value="gebraucht" checked={sitzliftKriterien.zustand.includes('gebraucht')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('zustand', sitzliftKriterien.zustand.includes(v) ? sitzliftKriterien.zustand.filter((x) => x !== v) : [...sitzliftKriterien.zustand, v]); }} /> Gebraucht (8)</label>
                                      <label><input type="checkbox" name="zustand" value="miete" checked={sitzliftKriterien.zustand.includes('miete')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('zustand', sitzliftKriterien.zustand.includes(v) ? sitzliftKriterien.zustand.filter((x) => x !== v) : [...sitzliftKriterien.zustand, v]); }} /> Miete (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Budgetrahmen</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>9</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="budgetrahmen" 
                                        min="4000" 
                                        max="25000" 
                                        step="1000"
                                        value={sitzliftKriterien.budgetrahmen}
                                        onChange={(e) => handleSitzliftKriterienChange('budgetrahmen', e.target.value)}
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>4000 €</span>
                                        <span>25000 €</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Karte 3: Zeitpunkt */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Zeitpunkt</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Vor-Ort-Termin</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="checkbox-group">
                                      <label><input type="checkbox" name="vorOrtTermin" value="vormittags" checked={sitzliftKriterien.vorOrtTermin.includes('vormittags')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('vorOrtTermin', sitzliftKriterien.vorOrtTermin.includes(v) ? sitzliftKriterien.vorOrtTermin.filter((x) => x !== v) : [...sitzliftKriterien.vorOrtTermin, v]); }} /> Ja - Vormittags (10)</label>
                                      <label><input type="checkbox" name="vorOrtTermin" value="nachmittags" checked={sitzliftKriterien.vorOrtTermin.includes('nachmittags')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('vorOrtTermin', sitzliftKriterien.vorOrtTermin.includes(v) ? sitzliftKriterien.vorOrtTermin.filter((x) => x !== v) : [...sitzliftKriterien.vorOrtTermin, v]); }} /> Ja - Nachmittags (10)</label>
                                      <label><input type="checkbox" name="vorOrtTermin" value="nein" checked={sitzliftKriterien.vorOrtTermin.includes('nein')} onChange={(e) => { const v = e.target.value; handleSitzliftKriterienChange('vorOrtTermin', sitzliftKriterien.vorOrtTermin.includes(v) ? sitzliftKriterien.vorOrtTermin.filter((x) => x !== v) : [...sitzliftKriterien.vorOrtTermin, v]); }} /> Nein (3)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Bedarf</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="bedarfSitzlift" value="schnell" checked={sitzliftKriterien.bedarfSitzlift === 'schnell'} onChange={(e) => handleSitzliftKriterienChange('bedarfSitzlift', e.target.value)} /> Schnellstmöglich (10)</label>
                                      <label><input type="radio" name="bedarfSitzlift" value="wochen" checked={sitzliftKriterien.bedarfSitzlift === 'wochen'} onChange={(e) => handleSitzliftKriterienChange('bedarfSitzlift', e.target.value)} /> In Wochen (7)</label>
                                      <label><input type="radio" name="bedarfSitzlift" value="monate" checked={sitzliftKriterien.bedarfSitzlift === 'monate'} onChange={(e) => handleSitzliftKriterienChange('bedarfSitzlift', e.target.value)} /> In Monaten (1)</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                                    </>
                                  );
                                } else {
                                  // Alte Kriterien für andere Produkte (z.B. Hausnotruf)
                                  return (
                                    <>
                                      {/* Karte 1: Nachfrage */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Nachfrage</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Art des Notrufsystems</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="artNotruf" value="zuhause" /> Nur zu Hause (17)</label>
                                              <label><input type="radio" name="artNotruf" value="unterwegs" /> Nur unterwegs (16)</label>
                                              <label><input type="radio" name="artNotruf" value="beides" /> Zu Hause und unterwegs (16)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Kontaktperson</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="kontaktperson" value="angehoerige" /> Nur Angehörige (17)</label>
                                              <label><input type="radio" name="kontaktperson" value="notrufzentrale" /> Nur Notrufzentrale (17)</label>
                                              <label><input type="radio" name="kontaktperson" value="beides" /> Angehörige und Notrufzentrale (18)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Wohnsituation</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="wohnsituationNotruf" value="alleine" /> Lebt alleine (18)</label>
                                              <label><input type="radio" name="wohnsituationNotruf" value="nicht_alleine" /> Lebt nicht alleine (18)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Karte 2: Einsatzdetails & Haushalt */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Einsatzdetails & Haushalt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Pflegegrad/-stufe</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="pflegegrad" value="vorhanden" /> Vorhanden (18)</label>
                                              <label><input type="radio" name="pflegegrad" value="beantragt" /> Beantragt (16)</label>
                                              <label><input type="radio" name="pflegegrad" value="nicht_vorhanden" /> Nicht vorhanden (14)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Karte 3: Zeitpunkt */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Zeitpunkt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Bedarf</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="bedarf" value="schnell" /> Schnellstmöglich (18)</label>
                                              <label><input type="radio" name="bedarf" value="wochen" /> In Wochen (15)</label>
                                              <label><input type="radio" name="bedarf" value="monate" /> In Monaten (11)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Box unter Produktkriterien: nur bei Pflegekurse für Angehörige */}
                        {(() => {
                          const activeTab = produktTabs.find(tab => tab.id === activeProduktTabId);
                          const isPflegekurseAngehoerige = activeTab?.label === 'Pflegekurse für Angehörige' || activeTab?.id === 'pflegekurse-angehoerige';
                          return isPflegekurseAngehoerige ? (
                            <div className="versichertennummer-box-unter-produktkriterien">
                              <div className="produktkriterien-card produktkriterien-card-versichertennummer">
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <label className="label-with-info">
                                      <span>Versichertennummer</span>
                                      <span className="info-icon-circle" title="Information">i</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="versichertennummerKursteilnehmer"
                                      placeholder="Versichertennummer Kursteilnehmer*in eintragen"
                                      className="versichertennummer-input"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )}
</div>

      {/* Klienten löschen Modal */}
      {isKlientLoeschenModalOpen && (
        <div className="modal-overlay" onClick={() => setIsKlientLoeschenModalOpen(false)}>
          <div className="modal-content klient-loeschen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="einstellungen-modal-kopfzeile">
              <h2 className="klient-loeschen-title einstellungen-modal-title">Klienten löschen?</h2>
              <div className="einstellungen-demo-segment" title="Darstellung wechseln (nur Demo)">
                <span className="einstellungen-demo-toggle-label">Demo</span>
                <div className="einstellungen-demo-segment-buttons" role="group" aria-label="Demo-Ansicht Klient löschen">
                  <button
                    type="button"
                    className={klientLoeschenDemoModus === 'berater' ? 'is-active' : ''}
                    onClick={() => setKlientLoeschenDemoModus('berater')}
                  >
                    Berater
                  </button>
                  <button
                    type="button"
                    className={klientLoeschenDemoModus === 'admin' ? 'is-active' : ''}
                    onClick={() => setKlientLoeschenDemoModus('admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            <div className="klient-loeschen-grund">
              <span className="klient-loeschen-grund-label">Grund</span>
              <div className="klient-loeschen-grund-line" aria-hidden="true" />
            </div>

            <div className="klient-loeschen-sections">
              <div className="klient-loeschen-row">
                <div className="klient-loeschen-row-label">Klient fordert Löschung seiner Daten:</div>
                <div className="klient-loeschen-row-body">
                  Der Klient muss die <strong>vollständige Datenlöschung bestätigen.</strong> Sende dem Klienten dazu die{' '}
                  <strong>E-Mail zur Datenlöschung.</strong> Weise den Klienten darauf hin, den Anweisungen in der E-Mail zu folgen, um die Löschung abzuschließen.
                </div>
              </div>
              <div className="klient-loeschen-row">
                <div className="klient-loeschen-row-label">Dublette löschen:</div>
                <div className="klient-loeschen-row-body">
                  Wenn es sich bei diesem Klienten um eine <strong>Dublette</strong> handelt, <strong>kopiere den Link</strong> & leite ihn an deinen <strong>Teamleiter</strong> weiter. Dieser wird die Dublette umgehend löschen.
                </div>
              </div>
            </div>

            <p className="klient-loeschen-hinweis">
              <strong>Hinweis:</strong> Die Anfrage wird mit Versenden der E-Mail bzw. kopieren des Links geschlossen.
            </p>

            <div className="klient-loeschen-grund-line klient-loeschen-footer-line" aria-hidden="true" />

            {klientLoeschenDemoModus === 'admin' && (
              <div className="klient-loeschen-admin-hinweise">
                <div className="newsletter-admin-abmelden klient-loeschen-admin-block">
                  <p className="newsletter-admin-abmelden-text">
                    <strong>Admin:</strong> Endgültige Löschung des Klienten und aller personenbezogenen Daten? Dem
                    Klienten wird eine Löschbestätigung zugesendet.
                  </p>
                  <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                    <input
                      type="checkbox"
                      checked={klientLoeschenAdminKlientBestaetigt}
                      onChange={(e) => setKlientLoeschenAdminKlientBestaetigt(e.target.checked)}
                    />
                    <span>Ich bestätige die endgültige Löschung dieses Klienten.</span>
                  </label>
                  <button
                    type="button"
                    className="btn-red klient-loeschen-action-btn"
                    disabled={!klientLoeschenAdminKlientBestaetigt}
                    onClick={() => {
                      showAppToast('email', 'Klient wurde gelöscht.', { instant: true });
                      setIsKlientLoeschenModalOpen(false);
                      setCrmMainView('dashboard');
                    }}
                  >
                    Klient löschen
                  </button>
                </div>
                <div className="newsletter-admin-abmelden klient-loeschen-admin-block klient-loeschen-admin-block--duplikat">
                  <p className="newsletter-admin-abmelden-text">
                    <strong>Admin:</strong> Endgültige Löschung dieses mehrfach angelegten Klienten (Dublette)?
                  </p>
                  <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                    <input
                      type="checkbox"
                      checked={klientLoeschenAdminDuplikatBestaetigt}
                      onChange={(e) => setKlientLoeschenAdminDuplikatBestaetigt(e.target.checked)}
                    />
                    <span>Ich bestätige die Löschung dieser Dublette.</span>
                  </label>
                  <button
                    type="button"
                    className="btn-blue klient-loeschen-action-btn"
                    disabled={!klientLoeschenAdminDuplikatBestaetigt}
                    onClick={() => {
                      showAppToast('email', 'Dublette wurde gelöscht.', { instant: true });
                      setIsKlientLoeschenModalOpen(false);
                      setCrmMainView('dashboard');
                    }}
                  >
                    Dublette löschen
                  </button>
                </div>
              </div>
            )}

            <div className="klient-loeschen-actions">
              <button
                type="button"
                className="btn-red klient-loeschen-action-btn"
                onClick={() => {
                  showAppToast('email');
                  setIsKlientLoeschenModalOpen(false);
                  setCrmMainView('dashboard');
                }}
              >
                E-Mail zur Datenlöschung auslösen
              </button>
              <button
                type="button"
                className="btn-blue klient-loeschen-action-btn"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(`${window.location.origin}${window.location.pathname}`)
                    .then(() => {
                      showAppToast('copy');
                      setIsKlientLoeschenModalOpen(false);
                      setCrmMainView('dashboard');
                    })
                    .catch(() => {
                      setIsKlientLoeschenModalOpen(false);
                      setCrmMainView('dashboard');
                    });
                }}
              >
                Link der Dublette kopieren
              </button>
              <button
                type="button"
                className="btn-orange klient-loeschen-action-btn"
                onClick={() => setIsKlientLoeschenModalOpen(false)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kontakt-Einstellungen Modal (kombiniert, aus dem Aktionen-Menü) */}
      {isKontaktEinstellungenModalOpen && (
        <div className="modal-overlay" onClick={() => setIsKontaktEinstellungenModalOpen(false)}>
          <div
            className="modal-content klient-loeschen-modal kontakt-einstellungen-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="einstellungen-modal-kopfzeile">
              <h2 className="klient-loeschen-title einstellungen-modal-title">Kontakt-Einstellungen</h2>
            </div>

            <div className="klient-loeschen-sections">
              <div className="klient-loeschen-row">
                <div className="klient-loeschen-row-label">Kontakt-Einstellungen anpassen:</div>
                <div className="klient-loeschen-row-body">
                  Der Klient kann seine <strong>Kontakt-Einstellungen</strong> über eine <strong>Landingpage</strong>{' '}
                  anpassen. Bitte E-Mail mit Link zur Landingpage versenden.
                </div>
              </div>
            </div>

            <p className="klient-loeschen-hinweis">
              <strong>Hinweis:</strong> Die Anfrage wird mit Versenden der E-Mail geschlossen.
            </p>

            {/* Löschen */}
            <h3 className="kontakt-einstellungen-section-title">Löschen</h3>
            <div className="klient-loeschen-admin-hinweise">
              <div className="newsletter-admin-abmelden klient-loeschen-admin-block">
                <p className="newsletter-admin-abmelden-text">
                  <strong>Admin:</strong> Endgültige Löschung des Klienten und aller personenbezogenen Daten? Dem
                  Klienten wird eine Löschbestätigung zugesendet.
                </p>
                <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                  <input
                    type="checkbox"
                    checked={kontaktLoeschenKlientBestaetigt}
                    onChange={(e) => setKontaktLoeschenKlientBestaetigt(e.target.checked)}
                  />
                  <span>Ich bestätige die endgültige Löschung dieses Klienten.</span>
                </label>
                <button
                  type="button"
                  className="btn-red klient-loeschen-action-btn"
                  disabled={!kontaktLoeschenKlientBestaetigt}
                  onClick={() => {
                    showAppToast('email', 'Klient wurde gelöscht.', { instant: true });
                    setIsKontaktEinstellungenModalOpen(false);
                    setCrmMainView('dashboard');
                  }}
                >
                  Klient löschen
                </button>
              </div>
              <div className="newsletter-admin-abmelden klient-loeschen-admin-block klient-loeschen-admin-block--duplikat">
                <p className="newsletter-admin-abmelden-text">
                  <strong>Admin:</strong> Endgültige Löschung dieses mehrfach angelegten Klienten (Dublette)?
                </p>
                <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                  <input
                    type="checkbox"
                    checked={kontaktLoeschenDubletteBestaetigt}
                    onChange={(e) => setKontaktLoeschenDubletteBestaetigt(e.target.checked)}
                  />
                  <span>Ich bestätige die Löschung dieser Dublette.</span>
                </label>
                <button
                  type="button"
                  className="btn-blue klient-loeschen-action-btn"
                  disabled={!kontaktLoeschenDubletteBestaetigt}
                  onClick={() => {
                    showAppToast('email', 'Dublette wurde gelöscht.', { instant: true });
                    setIsKontaktEinstellungenModalOpen(false);
                    setCrmMainView('dashboard');
                  }}
                >
                  Dublette löschen
                </button>
              </div>
            </div>

            {/* Anruf-Einstellungen */}
            <h3 className="kontakt-einstellungen-section-title">Anruf-Einstellungen</h3>
            <p className="einstellungen-status-kopf">
              Der Klient ist aktuell <strong>zur Telefonie angemeldet</strong> und wird angerufen.
            </p>
            <div className="newsletter-admin-abmelden klient-loeschen-admin-block">
              <p className="newsletter-admin-abmelden-text">
                <strong>Admin:</strong> Fordert der Klient von der Telefonie abgemeldet zu werden? Hinweis: Es werden
                alle geplanten Nachbetreuungstermine für diesen Klienten gelöscht.
              </p>
              <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                <input
                  type="checkbox"
                  checked={kontaktTelefonieAbmeldenBestaetigt}
                  onChange={(e) => setKontaktTelefonieAbmeldenBestaetigt(e.target.checked)}
                />
                <span>Ich bestätige die Abmeldung des Klienten von der Telefonie.</span>
              </label>
              <button
                type="button"
                className="btn-blue klient-loeschen-action-btn"
                disabled={!kontaktTelefonieAbmeldenBestaetigt}
                onClick={() => {
                  showAppToast('email', 'Klient wurde von der Telefonie abgemeldet.', { instant: true });
                  setKontaktTelefonieAbmeldenBestaetigt(false);
                }}
              >
                Klient abmelden
              </button>
            </div>

            {/* Newsletter-Einstellungen */}
            <h3 className="kontakt-einstellungen-section-title">Newsletter-Einstellungen</h3>
            <p className="einstellungen-status-kopf">
              Der Klient war <strong>noch nie zum Newsletter angemeldet</strong>.
            </p>
            <div className="newsletter-admin-newsletter-anmeldung klient-loeschen-admin-block">
              <p className="newsletter-admin-newsletter-anmeldung-text">
                <strong>Admin:</strong> Soll der Klient zum Newsletter angemeldet werden?
              </p>
              <label className="newsletter-wahl-checkbox newsletter-admin-newsletter-anmeldung-checkbox">
                <input
                  type="checkbox"
                  checked={kontaktNewsletterAnmeldenBestaetigt}
                  onChange={(e) => setKontaktNewsletterAnmeldenBestaetigt(e.target.checked)}
                />
                <span>Ich bestätige die Anmeldung des Klienten zum Newsletter.</span>
              </label>
              <button
                type="button"
                className="btn-green klient-loeschen-action-btn"
                disabled={!kontaktNewsletterAnmeldenBestaetigt}
                onClick={() => {
                  showAppToast('email', 'Klient wurde zum Newsletter angemeldet.', { instant: true });
                  setKontaktNewsletterAnmeldenBestaetigt(false);
                }}
              >
                Klient anmelden
              </button>
            </div>

            {/* Automation-Einstellungen */}
            <h3 className="kontakt-einstellungen-section-title">Automation-Einstellungen</h3>
            <p className="einstellungen-status-kopf">
              Der Klient ist aktuell <strong>für Automations angemeldet</strong>.
            </p>
            <div className="newsletter-admin-abmelden klient-loeschen-admin-block">
              <p className="newsletter-admin-abmelden-text">
                <strong>Admin:</strong> Fordert der Klient von der Automation abgemeldet zu werden?
              </p>
              <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                <input
                  type="checkbox"
                  checked={kontaktAutomationAbmeldenBestaetigt}
                  onChange={(e) => setKontaktAutomationAbmeldenBestaetigt(e.target.checked)}
                />
                <span>Ich bestätige die Abmeldung des Klienten von Automations.</span>
              </label>
              <button
                type="button"
                className="btn-blue klient-loeschen-action-btn"
                disabled={!kontaktAutomationAbmeldenBestaetigt}
                onClick={() => {
                  showAppToast('email', 'Klient wurde von Automations abgemeldet.', { instant: true });
                  setKontaktAutomationAbmeldenBestaetigt(false);
                }}
              >
                Klient abmelden
              </button>
            </div>

            <div className="klient-loeschen-grund-line klient-loeschen-footer-line" aria-hidden="true" />

            <div className="klient-loeschen-actions">
              <button
                type="button"
                className="btn-blue klient-loeschen-action-btn"
                onClick={() => {
                  showAppToast('email');
                  setIsKontaktEinstellungenModalOpen(false);
                }}
              >
                E-Mail mit Link zur Landingpage versenden
              </button>
              <button
                type="button"
                className="btn-orange klient-loeschen-action-btn"
                onClick={() => setIsKontaktEinstellungenModalOpen(false)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anruf-Einstellungen Modal */}
      {isAnrufEinstellungenModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAnrufEinstellungenModalOpen(false)}>
          <div
            className={`modal-content klient-loeschen-modal anruf-einstellungen-modal${
              anrufDemoModus === 'admin' ? ' anruf-einstellungen-modal--wide' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="einstellungen-modal-kopfzeile">
              <h2 className="klient-loeschen-title einstellungen-modal-title">Anruf-Einstellungen</h2>
              <div className="einstellungen-demo-segment" title="Darstellung wechseln (nur Demo)">
                <span className="einstellungen-demo-toggle-label">Demo</span>
                <div className="einstellungen-demo-segment-buttons" role="group" aria-label="Demo-Ansicht Telefonie">
                  <button
                    type="button"
                    className={anrufDemoModus === 'telefonie-aktiv' ? 'is-active' : ''}
                    onClick={() => setAnrufDemoModus('telefonie-aktiv')}
                  >
                    Telefonie aktiv
                  </button>
                  <button
                    type="button"
                    className={anrufDemoModus === 'abgemeldet' ? 'is-active' : ''}
                    onClick={() => setAnrufDemoModus('abgemeldet')}
                  >
                    abgemeldet
                  </button>
                  <button
                    type="button"
                    className={anrufDemoModus === 'admin' ? 'is-active' : ''}
                    onClick={() => setAnrufDemoModus('admin')}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    className={anrufDemoModus === 'admin-anmelden' ? 'is-active' : ''}
                    onClick={() => setAnrufDemoModus('admin-anmelden')}
                    title="Nur für CRM-Admins: Klient zur Telefonie anmelden"
                  >
                    Admin Anmeldung
                  </button>
                </div>
              </div>
            </div>
            <p className="einstellungen-status-kopf">
              {(anrufDemoModus === 'telefonie-aktiv' || anrufDemoModus === 'admin') && (
                <>
                  Der Klient ist aktuell <strong>zur Telefonie angemeldet</strong>.
                </>
              )}
              {(anrufDemoModus === 'abgemeldet' || anrufDemoModus === 'admin-anmelden') && (
                <>
                  Der Klient ist aktuell <strong>von der Telefonie abgemeldet</strong> und wird nicht angerufen.
                </>
              )}
            </p>

            {anrufDemoModus !== 'abgemeldet' && (
              <div className="klient-loeschen-sections">
                {(anrufDemoModus === 'telefonie-aktiv' || anrufDemoModus === 'admin') && (
                  <div className="klient-loeschen-row">
                    <div className="klient-loeschen-row-label">Klient möchte nicht mehr angerufen werden:</div>
                    <div className="klient-loeschen-row-body">
                      Der Klient kann seine <strong>Anrufeinstellungen</strong> über eine <strong>Landingpage</strong>{' '}
                      anpassen. Bitte E-Mail mit Link zur Landingpage versenden.
                    </div>
                  </div>
                )}
                {isCrmAdminUser() && anrufDemoModus === 'admin' && (
                  <div className="anruf-admin-lp-panel" onClick={(e) => e.stopPropagation()}>
                    <h3 className="anruf-admin-lp-panel-title">
                      Ihre Anruf-Einstellungen <span className="anruf-admin-lp-badge">Admin</span>
                    </h3>
                    <p className="anruf-admin-lp-lead">
                      Entspricht Schritt 3 der Kontaktpräferenzen-Landingpage – nur für berechtigte CRM-Admins
                      bearbeitbar.
                    </p>

                    <fieldset className="anruf-admin-lp-fieldset">
                      <legend className="anruf-admin-lp-legend">Regelmäßigkeit unserer Anrufe</legend>
                      <div className="anruf-admin-lp-radio-col">
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-reg"
                            checked={anrufLandingEinstellungen.regelmaessigkeit === 'regelmaessig'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, regelmaessigkeit: 'regelmaessig' }))
                            }
                          />
                          <span>Wie bisher (regelmäßig)</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-reg"
                            checked={anrufLandingEinstellungen.regelmaessigkeit === 'halbjaehrlich'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, regelmaessigkeit: 'halbjaehrlich' }))
                            }
                          />
                          <span>Nur einmal halbjährlich</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-reg"
                            checked={anrufLandingEinstellungen.regelmaessigkeit === 'jaehrlich'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, regelmaessigkeit: 'jaehrlich' }))
                            }
                          />
                          <span>Nur einmal jährlich</span>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset className="anruf-admin-lp-fieldset">
                      <legend className="anruf-admin-lp-legend">Pausierung</legend>
                      <p className="anruf-admin-lp-hint">
                        Während der Pause erhalten Sie keine Anrufe. Danach melden wir uns wieder bei Ihnen.
                      </p>
                      <div className="anruf-admin-lp-radio-col">
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-pause"
                            checked={anrufLandingEinstellungen.pausierung === 'keine'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, pausierung: 'keine' }))
                            }
                          />
                          <span>Keine Pausierung</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-pause"
                            checked={anrufLandingEinstellungen.pausierung === '3monate'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, pausierung: '3monate' }))
                            }
                          />
                          <span>Anrufe für 3 Monate pausieren</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-pause"
                            checked={anrufLandingEinstellungen.pausierung === '6monate'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, pausierung: '6monate' }))
                            }
                          />
                          <span>Anrufe für 6 Monate pausieren</span>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset className="anruf-admin-lp-fieldset">
                      <legend className="anruf-admin-lp-legend">Bevorzugte Anrufzeit</legend>
                      <p className="anruf-admin-lp-hint">Wir rufen Sie nur in diesem Zeitraum an.</p>
                      <div className="anruf-admin-lp-radio-col">
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-zeit"
                            checked={anrufLandingEinstellungen.anrufzeit === 'keine'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, anrufzeit: 'keine' }))
                            }
                          />
                          <span>Keine Präferenz</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-zeit"
                            checked={anrufLandingEinstellungen.anrufzeit === 'vormittags'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, anrufzeit: 'vormittags' }))
                            }
                          />
                          <span>Vormittags</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-zeit"
                            checked={anrufLandingEinstellungen.anrufzeit === 'nachmittags'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, anrufzeit: 'nachmittags' }))
                            }
                          />
                          <span>Nachmittags</span>
                        </label>
                        <label className="anruf-admin-lp-radio">
                          <input
                            type="radio"
                            name="anruf-lp-zeit"
                            checked={anrufLandingEinstellungen.anrufzeit === 'abends'}
                            onChange={() =>
                              setAnrufLandingEinstellungen((p) => ({ ...p, anrufzeit: 'abends' }))
                            }
                          />
                          <span>Abends</span>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset className="anruf-admin-lp-fieldset">
                      <legend className="anruf-admin-lp-legend">Anrufe nur an folgenden Wochentagen</legend>
                      <p className="anruf-admin-lp-hint">
                        Nur an den angekreuzten Tagen anrufen. Keine Auswahl = Anrufe an allen Tagen möglich.
                      </p>
                      <div className="anruf-admin-lp-wochentage">
                        {ANRUF_LANDING_WOCHENTAGE.map(({ id, label }) => (
                          <label key={id} className="anruf-admin-lp-tag">
                            <input
                              type="checkbox"
                              checked={anrufLandingEinstellungen.wochentage.includes(id)}
                              onChange={() => toggleAnrufLandingWochentag(id)}
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="anruf-admin-lp-fieldset anruf-admin-lp-fieldset--flat">
                      <label className="anruf-admin-lp-legend anruf-admin-lp-legend--block" htmlFor="anruf-lp-tel">
                        Nur unter dieser Telefonnummer anrufen
                      </label>
                      <p className="anruf-admin-lp-hint">
                        Wenn ausgefüllt, rufen wir Sie nur unter dieser Nummer an.
                      </p>
                      <input
                        id="anruf-lp-tel"
                        type="tel"
                        className="anruf-admin-lp-input"
                        placeholder="z. B. 0151 23456789"
                        value={anrufLandingEinstellungen.telefonnummer}
                        onChange={(e) =>
                          setAnrufLandingEinstellungen((p) => ({ ...p, telefonnummer: e.target.value }))
                        }
                      />
                    </div>

                    <div className="anruf-admin-lp-panel-actions">
                      <button
                        type="button"
                        className="btn-grey klient-loeschen-action-btn"
                        onClick={handleAnrufLandingEinstellungenZuruecksetzen}
                      >
                        Alle Einstellungen auf Standard zurücksetzen
                      </button>
                      <button
                        type="button"
                        className="btn-blue klient-loeschen-action-btn"
                        onClick={handleAnrufLandingEinstellungenSpeichern}
                      >
                        Einstellungen speichern
                      </button>
                    </div>
                  </div>
                )}
                {anrufDemoModus === 'admin' && (
                  <div className="newsletter-admin-abmelden" onClick={(e) => e.stopPropagation()}>
                    <p className="newsletter-admin-abmelden-text">
                      <strong>Admin:</strong> Fordert der Klient von der Telefonie abgemeldet zu werden? Hinweis: Es werden
                      alle geplanten Nachbetreuungstermine für diesen Klienten gelöscht.
                    </p>
                    <label className="newsletter-wahl-checkbox newsletter-admin-abmelden-checkbox">
                      <input
                        type="checkbox"
                        checked={anrufAdminTelefonieAbmeldungBestaetigt}
                        onChange={(e) => setAnrufAdminTelefonieAbmeldungBestaetigt(e.target.checked)}
                      />
                      <span>Ich bestätige die Abmeldung des Klienten von der Telefonie.</span>
                    </label>
                  </div>
                )}
                {anrufDemoModus === 'admin-anmelden' && (
                  <div
                    className="newsletter-admin-newsletter-anmeldung klient-loeschen-admin-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="newsletter-admin-newsletter-anmeldung-text">
                      <strong>Admin:</strong> Soll der Klient zur Telefonie angemeldet werden?
                    </p>
                    <label className="newsletter-wahl-checkbox newsletter-admin-newsletter-anmeldung-checkbox">
                      <input
                        type="checkbox"
                        checked={anrufAdminTelefonieAnmeldungBestaetigt}
                        onChange={(e) => setAnrufAdminTelefonieAnmeldungBestaetigt(e.target.checked)}
                      />
                      <span>Ich bestätige die Anmeldung des Klienten zur Telefonie.</span>
                    </label>
                    <button
                      type="button"
                      className="btn-green klient-loeschen-action-btn"
                      disabled={!anrufAdminTelefonieAnmeldungBestaetigt}
                      onClick={handleAnrufEinstellungenSpeichernAdminTelefonieAnmeldung}
                    >
                      Speichern
                    </button>
                  </div>
                )}
              </div>
            )}

            {anrufDemoModus === 'telefonie-aktiv' && (
              <p className="klient-loeschen-hinweis">
                <strong>Hinweis:</strong> Die Anfrage wird mit Versenden der E-Mail geschlossen.
              </p>
            )}

            {anrufDemoModus !== 'abgemeldet' && (
              <div className="klient-loeschen-grund-line klient-loeschen-footer-line" aria-hidden="true" />
            )}

            <div className="klient-loeschen-actions">
              {anrufDemoModus === 'telefonie-aktiv' && (
                <button
                  type="button"
                  className="btn-blue klient-loeschen-action-btn"
                  onClick={() => {
                    showAppToast('email');
                    setIsAnrufEinstellungenModalOpen(false);
                  }}
                >
                  E-Mail mit Link zur Landingpage versenden
                </button>
              )}
              {anrufDemoModus === 'admin' && (
                <button
                  type="button"
                  className="btn-blue klient-loeschen-action-btn"
                  disabled={!anrufAdminTelefonieAbmeldungBestaetigt}
                  onClick={handleAnrufEinstellungenSpeichernAdminAbmeldung}
                >
                  Speichern
                </button>
              )}
              <button
                type="button"
                className="btn-orange klient-loeschen-action-btn"
                onClick={() => setIsAnrufEinstellungenModalOpen(false)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telefonnummer Modal */}
      {isPhoneModalOpen && (
        <div className="modal-overlay" onClick={closePhoneModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingPhoneId ? 'Telefon bearbeiten' : 'Telefon'}</h2>
            <div className="modal-form">
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <select
                    className="phone-type-select"
                    value={phoneModalData.type}
                    onChange={(e) => handlePhoneModalChange('type', e.target.value)}
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Festnetz">Festnetz</option>
                    <option value="Geschäftlich">Geschäftlich</option>
                  </select>
                </div>
                <div className="modal-form-group phone-number-group">
                  <div className="country-selector">
                    <span className="country-flag">🇩🇪</span>
                    <select
                      className="country-code-select"
                      value={phoneModalData.countryCode}
                      onChange={(e) => handlePhoneModalChange('countryCode', e.target.value)}
                    >
                      <option value="+49">+49</option>
                      <option value="+43">+43</option>
                      <option value="+41">+41</option>
                      <option value="+33">+33</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    className={`phone-number-input ${phoneValidationError ? 'error' : ''}`}
                    value={phoneModalData.number}
                    onChange={(e) => handlePhoneModalChange('number', e.target.value)}
                    placeholder="01512 3456789"
                  />
                </div>
              </div>
              {phoneValidationError && (
                <div className="modal-error-message">{phoneValidationError}</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-orange" onClick={closePhoneModal}>Abbrechen</button>
              <button className="btn-blue" onClick={savePhoneNumber}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {appToast && (
        <div
          className={`app-toast app-toast--${appToast.variant} app-toast--visible${appToast.instant ? ' app-toast--instant' : ''}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span key={appToast.tick} className={`app-toast-icon app-toast-icon--${appToast.variant}`} aria-hidden="true">
            {appToast.variant === 'copy' ? '✓' : '✉'}
          </span>
          <span>
            {appToast.variant === 'copy'
              ? 'Erfolgreich in die Zwischenablage kopiert'
              : appToast.message ?? 'E-Mail wurde versendet'}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnfrageSitzlift;
