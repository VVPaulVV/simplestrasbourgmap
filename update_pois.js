const fs = require('fs');

const path = '/home/spectra/Downloads/strasbourg-map/src/data/pois.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const translations = {
  "Wed–Mon 10:00–18:00 | Closed Tue": "Mer–Lun 10h00–18h00 | Fermé le mardi",
  "Mon–Sat 08:30–11:15 & 12:45–17:45 | Sun 14:00–17:15 | Free entry": "Lun–Sam 08h30–11h15 & 12h45–17h45 | Dim 14h00–17h15 | Entrée gratuite",
  "Daily 14:00–18:00 | Adult 14 €, Child (6–12) 8 €": "Tous les jours 14h00–18h00 | Adulte 14 €, Enfant (6–12 ans) 8 €",
  "09:00–19:00": "09h00–19h00",
  "Always accessible": "Toujours accessible",
  "Check website before visiting — closed for renovation": "Vérifiez le site avant de visiter — fermé pour rénovation",
  "Open during services | Free guided visits in July (Wed–Sun 13:00–18:30)": "Ouvert pendant les offices | Visites guidées gratuites en juillet (Mer–Dim 13h–18h30)",
  "Mon–Sat | Free entry | ID required | Closed Sun & public holidays": "Lun–Sam | Entrée gratuite | Pièce d'identité obligatoire | Fermé dim. & jours fériés",
  "Exterior only — not open to visitors": "Extérieur uniquement — non ouvert au public",
  "Closed until June 2028": "Fermé jusqu'en juin 2028"
};

const getHoursFR = (hours) => {
    if (!hours) return null;
    return translations[hours] || null;
}

const newData = data.map(poi => {
    // Override specific ones first
    if (poi.name_en === "Mineralogy Museum") {
        poi.opening_hours = "Check website before visiting — closed for renovation";
    } else if (poi.name_en === "Eglise St. Paul") {
        poi.opening_hours = "Open during services | Free guided visits in July (Wed–Sun 13:00–18:30)";
    } else if (poi.name_en === "European Parliament") {
        poi.opening_hours = "Mon–Sat | Free entry | ID required | Closed Sun & public holidays";
    } else if (poi.name_en === "Palais du Rhin") {
        poi.opening_hours = "Exterior only — not open to visitors";
    } else if (poi.name_en === "Jardin des Deux Rives" || poi.name_en === "Université de Strasbourg") {
        poi.opening_hours = "Always accessible";
    }
    
    // Create new object structure with opening_hours_fr right after opening_hours
    return {
        id: poi.id,
        category: poi.category,
        name_en: poi.name_en,
        name_fr: poi.name_fr,
        description_en: poi.description_en,
        description_fr: poi.description_fr,
        lat: poi.lat,
        lng: poi.lng,
        address: poi.address,
        image_url: poi.image_url,
        reserve_url: poi.reserve_url,
        phone: poi.phone,
        website: poi.website,
        opening_hours: poi.opening_hours,
        opening_hours_fr: getHoursFR(poi.opening_hours)
    };
});

fs.writeFileSync(path, JSON.stringify(newData, null, 2) + "\n");
