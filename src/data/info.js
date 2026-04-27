export const INFO_TOPICS = [
  {
    id: 'transport',
    icon: '🚊',
    title: { en: 'Public Transport', fr: 'Transports en commun' },
    sections: [
      {
        heading: { en: 'Overview', fr: 'Présentation' },
        content: {
          en: 'Strasbourg has an excellent public transport network (CTS) consisting of 6 tram lines, 2 express bus lines (G/H) and numerous other bus lines.',
          fr: 'Strasbourg dispose d\'un excellent réseau de transports en commun (CTS) composé de 6 lignes de tram, 2 lignes de bus express (G/H) et de nombreuses autres lignes de bus.',
        },
      },
      {
        heading: { en: 'Ticket Prices', fr: 'Tarifs' },
        table: [
          {
            label: { en: 'Single Ticket', fr: 'Ticket unitaire' },
            price: '1.90 €',
            note: { en: '+0.20 € for first paper ticket purchase', fr: '+0,20 € pour le premier achat d\'un ticket papier' },
          },
          {
            label: { en: '24h Individual', fr: '24h Individuel' },
            price: '4.60 €',
          },
          {
            label: { en: '24h Trio (2–3 people)', fr: '24h Trio (2–3 personnes)' },
            price: '10.20 €',
          },
          {
            label: { en: '72h Individual', fr: '72h Individuel' },
            price: '10.20 €',
          },
        ],
      },
      {
        heading: { en: 'Where to Buy', fr: 'Où acheter' },
        items: {
          en: [
            'Ticket machines at all tram stops and major bus stops.',
            'CTS Mobile App — purchase via smartphone (NFC compatible).',
            'Onboard the bus — emergency tickets from the driver (€2.50).',
            'Partner stores — newsagents and tobacco shops displaying the CTS sign.',
          ],
          fr: [
            'Distributeurs automatiques à tous les arrêts de tram et aux principaux arrêts de bus.',
            'Application mobile CTS — achat via smartphone (compatible NFC).',
            'Dans le bus — tickets de dépannage auprès du conducteur (2,50 €).',
            'Points de vente partenaires — tabacs-presse affichant le logo CTS.',
          ],
        },
      },
      {
        heading: { en: 'How to Validate', fr: 'Comment valider' },
        items: {
          en: [
            'Trams & BRT (G/H): Validate on the platform machine BEFORE boarding.',
            'Regular buses: Validate inside the bus using the red machines.',
            'Contactless: Hold your card or phone against the yellow area until it beeps.',
            'Validation is mandatory for every journey, including transfers.',
          ],
          fr: [
            'Trams & BRT (G/H) : Validez sur la borne du quai AVANT de monter.',
            'Bus classiques : Validez à bord du bus avec les machines rouges.',
            'Sans contact : Approchez votre carte ou téléphone de la zone jaune jusqu\'au bip.',
            'La validation est obligatoire pour chaque trajet, y compris les correspondances.',
          ],
        },
      },
      {
        heading: { en: 'Travel Tips', fr: 'Conseils pratiques' },
        items: {
          en: [
            '✈️ Airport: Shuttle train from Entzheim Airport to Strasbourg Station (9 min).',
            '👨👩👧 Groups: The 24h Trio ticket covers 2–3 people for unlimited travel — best value for small groups.',
            '👶 Children under 4 travel free.',
          ],
          fr: [
            '✈️ Aéroport : Navette depuis l\'aéroport d\'Entzheim jusqu\'à la gare de Strasbourg (9 min).',
            '👨👩👧 Groupes : Le ticket 24h Trio couvre 2–3 personnes pour des trajets illimités — idéal pour les petits groupes.',
            '👶 Les enfants de moins de 4 ans voyagent gratuitement.',
          ],
        },
      },
      {
        heading: { en: 'Useful Link', fr: 'Lien utile' },
        link: { label: { en: 'Visit CTS Website', fr: 'Site web CTS' }, url: 'https://www.cts-strasbourg.eu' },
      },
    ],
  },
  {
    id: 'velhop',
    icon: '🚲',
    title: { en: 'Vélhop Bike Rental', fr: 'Location Vélhop' },
    sections: [
      {
        heading: { en: 'Overview', fr: 'Présentation' },
        content: {
          en: 'Vélhop is Strasbourg\'s public bike rental service, available 24/7. Bikes can be rented without a subscription for short stays, or with a subscription for residents.',
          fr: 'Vélhop est le service de location de vélos de Strasbourg, disponible 24h/24. Les vélos peuvent être loués sans abonnement pour les courts séjours.',
        },
      },
      {
        heading: { en: 'Without subscription (tourists)', fr: 'Sans abonnement (touristes)' },
        table: [
          { label: { en: 'Per hour', fr: 'Par heure' }, price: '1.20 €/h' },
          { label: { en: 'Up to 24h', fr: "Jusqu'à 24h" }, price: '7 €' },
          { label: { en: 'Up to 48h', fr: "Jusqu'à 48h" }, price: '14 €' },
        ],
      },
      {
        heading: { en: 'Daily rates — standard bike (full price)', fr: 'Tarifs journaliers — vélo mécanique (tarif plein)' },
        table: [
          { label: { en: 'Adult bike — 1 day', fr: 'Vélo adulte — 1 jour' }, price: '7 €' },
          { label: { en: 'Child bike — 1 jour', fr: 'Vélo enfant — 1 jour' }, price: '6 €' },
          { label: { en: 'Folding bike — 1 day', fr: 'Vélo pliant — 1 jour' }, price: '7 €' },
          { label: { en: 'Tandem — 1 day', fr: 'Tandem — 1 jour' }, price: '14 €' },
          { label: { en: 'Electric bike (VAE) — 1 day', fr: 'Vélo électrique (VAE) — 1 jour' }, price: '14 €' },
          { label: { en: 'Cargo bike — 1 day', fr: 'Vélo cargo — 1 jour' }, price: '18 €' },
        ],
      },
      {
        heading: { en: 'Weekly rates — standard bike', fr: 'Tarifs hebdomadaires — vélo mécanique' },
        table: [
          { label: { en: 'Adult bike — 1 week', fr: 'Vélo adulte — 1 semaine' }, price: '21 €' },
          { label: { en: 'Child bike — 1 week', fr: 'Vélo enfant — 1 semaine' }, price: '10 €' },
          { label: { en: 'Electric bike (VAE) — 1 week', fr: 'Vélo électrique (VAE) — 1 semaine' }, price: '45 €' },
        ],
      },
      {
        heading: { en: 'How to rent', fr: 'Comment louer' },
        items: {
          en: [
            'Register at any Vélhop station (open 24/7) or online.',
            'A deposit of €150 is required (credit card hold).',
            'Monthly and annual subscriptions are reserved for Eurométropole residents, workers and students.',
            'Reduced "tarif solidaire" rates available for those with a tax reference income ≤ €7,500 per unit.',
            'Return the bike to any Vélhop station in the city.',
          ],
          fr: [
            'Inscrivez-vous dans n\'importe quelle station Vélhop (ouverte 24h/24) ou en ligne.',
            'Un dépôt de 150 € est requis (empreinte bancaire).',
            'Les abonnements mensuels et annuels sont réservés aux résidents, travailleurs et étudiants de l\'Eurométropole.',
            'Tarifs solidaires disponibles pour les personnes dont le revenu fiscal de référence est ≤ 7 500 € par part.',
            'Retournez le vélo dans n\'importe quelle station Vélhop de la ville.',
          ],
        },
      },
      {
        heading: { en: 'Security deposits', fr: 'Dépôts de garantie' },
        items: {
          en: [
            'Balance bike: 100 €',
            'Standard bike (adult/child): 200 €',
            'Electric bike / Tandem / Folding bike: 800 €',
            'Cargo bike / Adapted bike: 1 000 €',
            'The deposit is only charged in case of theft or non-return of the bike.',
          ],
          fr: [
            'Draisienne : 100 €',
            'Vélo mécanique (adulte/enfant) : 200 €',
            'Vélo électrique / Tandem / Pliant : 800 €',
            'Vélo cargo / Vélo adapté : 1 000 €',
            'Le dépôt n\'est encaissé qu\'en cas de vol ou de non-restitution du vélo.',
          ],
        },
      },
      {
        heading: { en: 'Return fees', fr: 'Frais de restitution' },
        items: {
          en: [
            '⚠️ Bikes must be returned to the station where they were rented.',
            'Return to original station: free',
            'Return to a different station: 25 €',
            'Non-return penalty (loss, theft, damage): 200 €',
            'Maximum rental duration: 48 consecutive hours. Overdue fees apply after that.',
          ],
          fr: [
            '⚠️ Les vélos doivent être restitués à la station où ils ont été loués.',
            'Restitution à la station d\'origine : gratuit',
            'Restitution hors station d\'origine : 25 €',
            'Pénalité de non-restitution (perte, vol, casse) : 200 €',
            'Durée maximale de location : 48 heures consécutives. Des frais supplémentaires s\'appliquent au-delà.',
          ],
        },
      },
      {
        heading: { en: 'Useful link', fr: 'Lien utile' },
        link: {
          label: { en: 'Vélhop Website', fr: 'Site Vélhop' },
          url: 'https://velhop.strasbourg.eu',
        },
      },
    ],
  },
  {
    id: 'numbers',
    icon: '📞',
    title: { en: 'Useful Numbers', fr: 'Numéros utiles' },
    sections: [
      {
        heading: { en: 'Emergency Services', fr: 'Services d\'urgence' },
        contacts: [
          { label: { en: 'Emergency (EU)', fr: 'Urgences (UE)' }, number: '112' },
          { label: { en: 'Police', fr: 'Police' }, number: '17' },
          { label: { en: 'Fire Brigade', fr: 'Pompiers' }, number: '18' },
          { label: { en: 'Medical Emergency (SAMU)', fr: 'SAMU' }, number: '15' },
        ],
      },
      {
        heading: { en: 'Tourist Services', fr: 'Services touristiques' },
        contacts: [
          { label: { en: 'Strasbourg Tourist Office', fr: 'Office de Tourisme' }, number: '+33 3 88 52 28 28' },
          { label: { en: 'CTS Transport Info', fr: 'Infos CTS' }, number: '+33 3 88 77 70 70' },
          { label: { en: 'Vélhop', fr: 'Vélhop' }, number: '+33 3 88 23 56 75' },
          { label: { en: 'Strasbourg Train Station', fr: 'Gare de Strasbourg' }, number: '36 35' },
        ],
      },
      {
        heading: { en: 'Health', fr: 'Santé' },
        contacts: [
          { label: { en: 'Strasbourg University Hospital', fr: 'CHU de Strasbourg' }, number: '+33 3 88 11 67 68' },
          { label: { en: 'Night Pharmacy Info', fr: 'Pharmacie de garde' }, number: '3237' },
        ],
      },
    ],
  },
  {
    id: 'touristtax',
    icon: '🏨',
    title: { en: 'Tourist Tax', fr: 'Taxe de séjour' },
    sections: [
      {
        heading: { en: 'What is it?', fr: 'Qu\'est-ce que c\'est ?' },
        content: {
          en: 'The tourist tax (taxe de séjour) is a small nightly fee collected by accommodation providers on behalf of the city. It applies to all visitors staying in hotels, B&Bs, hostels or rental apartments.',
          fr: 'La taxe de séjour est une petite contribution nocturne collectée par les hébergeurs pour le compte de la ville. Elle s\'applique à tous les visiteurs séjournant dans des hôtels, chambres d\'hôtes, auberges ou appartements en location.',
        },
      },
      {
        heading: { en: 'Rates per person per night (2026)', fr: 'Tarifs par personne par nuit (2026)' },
        table: [
          { label: { en: 'Palaces', fr: 'Palaces' }, price: '5.39 €' },
          { label: { en: '5-star hotels / residences', fr: 'Hôtels / résidences 5★' }, price: '3.96 €' },
          { label: { en: '4-star hotels / residences', fr: 'Hôtels / résidences 4★' }, price: '2.86 €' },
          { label: { en: '3-star hotels / residences', fr: 'Hôtels / résidences 3★' }, price: '1.87 €' },
          { label: { en: '2-star hotels / holiday villages 4–5★', fr: 'Hôtels 2★ / villages vacances 4–5★' }, price: '1.10 €' },
          { label: { en: '1-star hotels / B&Bs / hostels', fr: 'Hôtels 1★ / chambres d\'hôtes / auberges' }, price: '0.88 €' },
          { label: { en: 'Campsites 3–5★ / motorhome areas', fr: 'Campings 3–5★ / aires camping-cars' }, price: '0.66 €' },
          { label: { en: 'Campsites 1–2★ / marinas', fr: 'Campings 1–2★ / ports de plaisance' }, price: '0.22 €' },
          { label: { en: 'Unclassified accommodation', fr: 'Hébergements sans classement' }, price: '5% of nightly rate (max 5.39 €)' },
        ],
      },
      {
        heading: { en: 'Note', fr: 'Note' },
        content: {
          en: 'Children under 18 are exempt, as are seasonal workers employed in the Eurométropole, people in emergency housing, and those paying less than €1/night. The tax is added to your accommodation bill automatically. Rates include both the Eurométropole and the additional departmental share.',
          fr: 'Les mineurs de moins de 18 ans sont exonérés, ainsi que les travailleurs saisonniers de l\'Eurométropole, les personnes en hébergement d\'urgence et celles payant moins de 1 €/nuit. La taxe est automatiquement ajoutée à votre facture. Les tarifs incluent la part Eurométropole et la part départementale.',
        },
      },
      {
        heading: { en: 'More information', fr: 'Plus d\'informations' },
        link: {
          label: { en: 'Official Tourist Tax Website', fr: 'Site officiel taxe de séjour' },
          url: 'https://taxedesejourems.strasbourg.eu',
        },
      },
    ],
  },
];
