// Canonical service catalog for Star Cars Wuppertal.
// Mirrored to base44 Service entities via the Admin → Pakete page.
// Photos use the same Unsplash source for "before" (desaturated/blurred) and
// "after" so the gallery slider always pairs the same vehicle.

export const ADDON_POLISH_PRICE_EUR = 89;
export const ADDON_POLISH_NOTE = "Zusätzliche Politurgänge werden mit jeweils 89,00 € berechnet.";

export const SERVICE_PACKAGES = [
  {
    name: "BASIC",
    tagline: "Schneller Glanz, spürbare Frische",
    description:
      "Perfekt für die regelmäßige Pflege. Bringt das Fahrzeug in kürzester Zeit wieder in Bestform – gründlich, sanft und detailverliebt.",
    price_eur: 79,
    duration_minutes: 90,
    duration_label: "ca. 1–1,5 Std.",
    tier: 1,
    badge: "",
    features: [
      "Außen-Handwäsche mit hochwertigem Shampoo",
      "Sorgfältige Felgenreinigung",
      "Gründliches Saugen und Wischen des Innenraums",
      "Pflege von Cockpit & Kunststoffflächen",
      "Kristallklare Scheiben innen & außen",
    ],
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=85",
  },
  {
    name: "STANDARD",
    tagline: "Der Alltagsheld mit Premium-Glanz",
    description:
      "Verbindet intensive Innenraumpflege mit perfektem Außenfinish. Für alle, die ihr Fahrzeug nicht nur reinigen, sondern sichtbar aufwerten möchten.",
    price_eur: 159,
    duration_minutes: 180,
    duration_label: "ca. 2–3 Std.",
    tier: 2,
    badge: "",
    features: [
      "Gründliche Innenreinigung aller Flächen & Polster",
      "Hochwertige Handwäsche mit Glanzfinish",
      "Detailreinigung der Felgen & Türfalze",
      "Sprühversiegelung für langanhaltenden Glanzschutz",
      "Duftauffrischung für den Innenraum",
    ],
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=85",
  },
  {
    name: "DELUXE",
    tagline: "Wenn Pflege zur Leidenschaft wird",
    description:
      "Unser Bestseller – für Liebhaber, die das Besondere suchen. Tiefenglanz, Sauberkeit bis ins Detail und ein Finish, das begeistert.",
    price_eur: 269,
    duration_minutes: 300,
    duration_label: "ca. 4–5 Std.",
    tier: 3,
    badge: "Bestseller",
    features: [
      "Tiefenreinigung aller Polster, Teppiche & Lederflächen (Dampf & Spezialreiniger)",
      "Motorraumreinigung mit Glanzfinish",
      "Mehrstufige Handwäsche (inkl. Insektenentfernung & Felgenreinigung)",
      "Lackpflege mit Finishversiegelung für intensiven Glanz",
      "Innenraum-Desinfektion & Frischeduft",
    ],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85",
  },
  {
    name: "EXCLUSIVE",
    tagline: "Für den ultimativen Showroom-Effekt",
    description:
      "Pure Perfektion – für Fahrzeuge, die aussehen sollen, als kämen sie gerade vom Neuwagenband.",
    price_eur: 999,
    duration_minutes: 480,
    duration_label: "individuell – nach Fahrzeugzustand",
    tier: 4,
    badge: "Top-Tier",
    features: [
      "1- bis 2-stufige Lackpolitur zur Entfernung feiner Kratzer & Hologramme",
      "Hochglanz-Finish mit Tiefeneffekt",
      "Professionelle Keramikversiegelung (Langzeitschutz bis zu 24 Monate)",
      "Innenraum- & Außenfinish auf Concours-Niveau",
    ],
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=900&q=85",
  },
];
