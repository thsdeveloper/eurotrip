export interface MapPOI {
  id: string;
  label: string;
  lat: number;
  lng: number;
  day?: number;
  time?: string;
  description?: string;
}

/**
 * Rota fixa de trem/metrô/teleférico entre dois POIs.
 * fromId → toId com waypoints intermediários seguindo a ferrovia real.
 * Se um segmento tem trainRoute definido, usa esses waypoints.
 * Se não tem, usa OSRM (foot) para calcular rota de caminhada.
 */
export interface TrainRoute {
  fromId: string;
  toId: string;
  waypoints: [number, number][]; // [lat, lng][] ao longo da ferrovia
  label?: string; // ex: "TGV", "RER A", "Italo", "Teleférico"
}

/**
 * Trajeto de chegada ou saída de um destino.
 * Waypoints completos da origem ao destino (ex: GRU → MAD).
 * O mapa NÃO faz zoom para incluir esses pontos — o avião/trem
 * entra e sai da área visível, criando efeito de chegada/partida.
 */
export interface TransportLink {
  label: string;                    // ex: "GRU → MAD"
  waypoints: [number, number][];    // rota completa [lat, lng][]
  type: "flight" | "train";
  from?: string;                    // ex: "Aeroporto de Guarulhos (GRU)"
  to?: string;                      // ex: "Aeroporto Barajas (MAD)"
  time?: string;                    // ex: "22/set 19:20 → 23/set 10:45"
  details?: string;                 // ex: "Iberia Direto | 31.250 Avios"
}

export interface Accommodation {
  id: string;
  label: string;                    // ex: "Airbnb Sol/Gran Vía"
  lat: number;
  lng: number;
  nights: number;
  checkIn: string;                  // ex: "23/set"
  checkOut: string;                 // ex: "25/set"
  type: "airbnb" | "hotel" | "hostel";
  neighborhood?: string;            // ex: "Sol / Gran Vía"
  pricePerNight?: string;           // ex: "~120 EUR"
  totalPrice?: string;              // ex: "~240 EUR"
  guests?: number;
  tip?: string;                     // ex: "Reservar com antecedência!"
  amenities?: string[];             // ex: ["Wi-Fi", "Cozinha", "Máquina de lavar"]
}

export interface CityMapData {
  center: [number, number];
  zoom: number;
  pois: MapPOI[];
  trainRoutes?: TrainRoute[];
  arrival?: TransportLink;
  departure?: TransportLink;
  accommodations?: Accommodation[];
}

export const mapData: Record<string, CityMapData> = {
  "brasil-ida": {
    center: [-20.0, -47.0],
    zoom: 5,
    pois: [
      { id: "bsb-aeroporto", label: "Aeroporto de Brasília (BSB)", lat: -15.8711, lng: -47.9186, day: 1, time: "Manhã", description: "Check-in e embarque doméstico" },
      { id: "gru-aeroporto", label: "Aeroporto de Guarulhos (GRU)", lat: -23.4356, lng: -46.4731, day: 1, time: "Dia", description: "Conexão doméstico → internacional" },
    ],
    trainRoutes: [
      {
        fromId: "bsb-aeroporto",
        toId: "gru-aeroporto",
        label: "Voo BSB → GRU",
        waypoints: [
          [-15.8711, -47.9186],
          [-19.0, -47.5],
          [-23.4356, -46.4731],
        ],
      },
    ],
  },

  "brasil-volta": {
    center: [-20.0, -47.0],
    zoom: 5,
    pois: [
      { id: "gru-chegada", label: "Aeroporto de Guarulhos (GRU)", lat: -23.4356, lng: -46.4731, day: 22, time: "Noite", description: "Chegada do voo internacional MAD → GRU" },
      { id: "bsb-chegada", label: "Aeroporto de Brasília (BSB)", lat: -15.8711, lng: -47.9186, day: 22, time: "Noite", description: "Último trecho! Chegada em casa!" },
    ],
    trainRoutes: [
      {
        fromId: "gru-chegada",
        toId: "bsb-chegada",
        label: "Voo GRU → BSB",
        waypoints: [
          [-23.4356, -46.4731],
          [-19.0, -47.5],
          [-15.8711, -47.9186],
        ],
      },
    ],
  },

  madrid: {
    center: [40.4168, -3.7038],
    zoom: 14,
    arrival: {
      label: "GRU → MAD",
      type: "flight",
      from: "Aeroporto de Guarulhos (GRU)",
      to: "Aeroporto Barajas T4 (MAD)",
      time: "22/set 19:20 → 23/set 10:45",
      details: "Iberia Direto · 31.250 Avios/pessoa · Voo noturno ~10h",
      waypoints: [
        [-23.4356, -46.4731], // GRU — Guarulhos
        [-10.0, -35.0],       // Nordeste brasileiro
        [10.0, -25.0],        // Atlântico equatorial
        [28.0, -15.0],        // Canárias
        [36.0, -8.0],         // Sul de Portugal
        [40.4719, -3.5626],   // MAD — Barajas T4
      ],
    },
    departure: {
      label: "MAD → CDG",
      type: "flight",
      from: "Aeroporto Barajas T4 (MAD)",
      to: "Aeroporto Charles de Gaulle (CDG)",
      time: "24/set · ~2h de voo",
      details: "Iberia/Vueling · Voo curto Madrid → Paris",
      waypoints: [
        [40.4719, -3.5626],   // MAD — Barajas T4
        [42.0, -1.5],         // Norte da Espanha
        [44.0, 0.5],          // Sul da França
        [47.0, 1.8],          // Centro da França
        [49.0097, 2.5479],    // CDG — Paris
      ],
    },
    pois: [
      { id: "mad-barajas", label: "Aeroporto Barajas", lat: 40.4719, lng: -3.5626, day: 2, time: "Manhã", description: "Pouso 10:45 — imigração + bagagem" },
      { id: "mad-san-miguel", label: "Mercado de San Miguel", lat: 40.4154, lng: -3.7089, day: 2, time: "Almoço", description: "Jamón ibérico, queijos, croquetas" },
      { id: "mad-sol", label: "Puerta del Sol", lat: 40.4168, lng: -3.7038, day: 2, time: "Tarde", description: "Passeio leve pelo centro" },
      { id: "mad-plaza-mayor", label: "Plaza Mayor", lat: 40.4155, lng: -3.7074, day: 2, time: "Tarde", description: "Passeio leve pelo centro" },
      { id: "mad-prado", label: "Museu do Prado", lat: 40.4138, lng: -3.6921, day: 2, time: "Final da tarde", description: "Grátis 18h-20h! Las Meninas, Goya, Bosch" },
      { id: "mad-la-latina", label: "La Latina", lat: 40.4110, lng: -3.7116, day: 2, time: "Noite", description: "Tapas — jantar 21h+" },
      { id: "mad-palacio", label: "Palácio Real", lat: 40.4180, lng: -3.7142, day: 3, time: "Manhã", description: "14 EUR/pessoa" },
      { id: "mad-reina-sofia", label: "Reina Sofía", lat: 40.4086, lng: -3.6943, day: 3, time: "Manhã", description: "Guernica de Picasso" },
      { id: "mad-retiro", label: "Parque do Retiro", lat: 40.4153, lng: -3.6845, day: 3, time: "Tarde", description: "Lago, barquinhos, Palácio de Cristal" },
      { id: "mad-debod", label: "Templo de Debod", lat: 40.4241, lng: -3.7178, day: 3, time: "Tarde", description: "Pôr do sol" },
      { id: "mad-flamenco", label: "Flamenco + Salmon Guru", lat: 40.4160, lng: -3.6990, day: 3, time: "Noite", description: "Essential Flamenco + drinks" },
    ],
    accommodations: [
      {
        id: "acc-madrid",
        label: "Airbnb Madrid Centro",
        lat: 40.4180,
        lng: -3.7050,
        nights: 2,
        checkIn: "23/set",
        checkOut: "25/set",
        type: "airbnb",
        neighborhood: "Sol / Gran Vía",
        pricePerNight: "~150 EUR",
        totalPrice: "~300 EUR",
        guests: 4,
        tip: "Região central — tudo a pé! Perto do metrô Sol.",
        amenities: ["Wi-Fi", "Cozinha", "Ar condicionado", "Máquina de lavar"],
      },
    ],
    trainRoutes: [
      // Metro L8 Barajas → Nuevos Ministerios, depois L1 até Sol/centro
      {
        fromId: "mad-barajas",
        toId: "mad-san-miguel",
        label: "Metrô L8 + L1",
        waypoints: [
          [40.4719, -3.5626], // Barajas T4
          [40.4672, -3.5705], // Barajas T1-T2-T3
          [40.4580, -3.5900], // Campo de las Naciones
          [40.4510, -3.6150], // Mar de Cristal
          [40.4470, -3.6350], // Pinar del Rey
          [40.4440, -3.6600], // Colombia
          [40.4380, -3.6850], // Nuevos Ministerios (troca L8→L1)
          [40.4280, -3.6920], // Gran Vía
          [40.4168, -3.7038], // Sol
          [40.4154, -3.7089], // San Miguel
        ],
      },
    ],
  },

  paris: {
    center: [48.8606, 2.3376],
    zoom: 12,
    arrival: {
      label: "MAD → CDG",
      type: "flight",
      from: "Aeroporto Barajas (MAD)",
      to: "Aeroporto Charles de Gaulle (CDG)",
      time: "24/set · ~2h de voo",
      details: "Iberia/Vueling · RER B do aeroporto ao centro",
      waypoints: [
        [40.4719, -3.5626],   // MAD — Barajas
        [42.0, -1.5],         // Norte da Espanha
        [44.0, 0.5],          // Sul da França
        [47.0, 1.8],          // Centro da França
        [49.0097, 2.5479],    // CDG — Charles de Gaulle
        [48.8616, 2.2886],    // Trocadéro (primeiro POI)
      ],
    },
    departure: {
      label: "Paris → Berna",
      type: "train",
      from: "Gare de Lyon (Paris)",
      to: "Estação de Berna (Bern Hbf)",
      time: "28/set · ~4h30 de viagem",
      details: "TGV Lyria · ~50-80 EUR/pessoa",
      waypoints: [
        [48.8443, 2.3735],    // Gare de Lyon
        [48.3, 3.0],          // Sens
        [47.3, 5.0],          // Dijon
        [46.9, 6.6],          // Frasne / fronteira
        [46.8031, 7.1510],    // Fribourg
        [46.9480, 7.4400],    // Berna Hbf (primeiro POI Suíça)
      ],
    },
    pois: [
      { id: "par-trocadero", label: "Trocadéro", lat: 48.8616, lng: 2.2886, day: 4, time: "Manhã", description: "Foto clássica com Torre Eiffel" },
      { id: "par-orsay", label: "Musée d'Orsay", lat: 48.8600, lng: 2.3266, day: 4, time: "Tarde", description: "Monet, Renoir, Van Gogh — ~16 EUR" },
      { id: "par-cruzeiro", label: "Cruzeiro pelo Sena", lat: 48.8584, lng: 2.2945, day: 4, time: "Noite", description: "Pôr do sol no rio" },
      { id: "par-louvre", label: "Louvre", lat: 48.8606, lng: 2.3376, day: 5, time: "Manhã", description: "Mona Lisa, Vênus de Milo — ~22 EUR" },
      { id: "par-disney", label: "Disneyland Paris", lat: 48.8674, lng: 2.7836, day: 5, time: "Tarde/Noite", description: "RER A ~40 min — show noturno!" },
      { id: "par-notre-dame", label: "Notre-Dame", lat: 48.8530, lng: 2.3499, day: 6, time: "Manhã", description: "Restaurada! Ingresso gratuito com reserva" },
      { id: "par-sainte-chapelle", label: "Sainte-Chapelle", lat: 48.8554, lng: 2.3450, day: 6, time: "Manhã", description: "Vitrais góticos — ~11 EUR" },
      { id: "par-montmartre", label: "Sacré-Cœur / Montmartre", lat: 48.8867, lng: 2.3431, day: 6, time: "Tarde", description: "Vista panorâmica grátis, Place du Tertre" },
      { id: "par-arc", label: "Arco do Triunfo", lat: 48.8738, lng: 2.2950, day: 6, time: "Tarde", description: "Vista 360° — ~13 EUR" },
    ],
    accommodations: [
      {
        id: "acc-paris",
        label: "Airbnb Paris Le Marais",
        lat: 48.8566,
        lng: 2.3622,
        nights: 3,
        checkIn: "25/set",
        checkOut: "28/set",
        type: "airbnb",
        neighborhood: "Le Marais / Bastille",
        pricePerNight: "~180 EUR",
        totalPrice: "~540 EUR",
        guests: 4,
        tip: "Bairro charmoso e central. Perto do metrô e da Gare de Lyon para o TGV.",
        amenities: ["Wi-Fi", "Cozinha", "Máquina de lavar", "Aquecimento"],
      },
    ],
    trainRoutes: [
      // RER A: Louvre → Disneyland (Marne-la-Vallée)
      {
        fromId: "par-louvre",
        toId: "par-disney",
        label: "RER A",
        waypoints: [
          [48.8606, 2.3376], // Châtelet (Louvre)
          [48.8490, 2.3600], // Gare de Lyon
          [48.8440, 2.3740], // Nation
          [48.8460, 2.4210], // Vincennes
          [48.8430, 2.4780], // Fontenay-sous-Bois
          [48.8480, 2.5400], // Noisy-le-Grand
          [48.8530, 2.6100], // Torcy
          [48.8600, 2.6700], // Lognes
          [48.8674, 2.7836], // Marne-la-Vallée/Disneyland
        ],
      },
    ],
  },

  suica: {
    center: [46.75, 7.9],
    zoom: 9,
    arrival: {
      label: "Paris → Berna",
      type: "train",
      from: "Gare de Lyon (Paris)",
      to: "Estação de Berna (Bern Hbf)",
      time: "28/set · ~4h30 de viagem",
      details: "TGV Lyria · ~50-80 EUR/pessoa",
      waypoints: [
        [48.8443, 2.3735],    // Gare de Lyon — Paris
        [47.3, 5.0],          // Dijon
        [46.9, 6.6],          // Frasne
        [46.8031, 7.1510],    // Fribourg
        [46.9480, 7.4400],    // Berna Hbf
      ],
    },
    departure: {
      label: "Lucerna → Milão",
      type: "train",
      from: "Estação de Lucerna (Luzern Hbf)",
      to: "Milano Centrale",
      time: "01/out · ~3h (Túnel Gotthard)",
      details: "SBB/Trenitalia · Trem cênico pelos Alpes",
      waypoints: [
        [47.0519, 8.3074],    // Lucerna
        [47.0486, 8.5450],    // Arth-Goldau
        [46.8800, 8.6400],    // Erstfeld
        [46.6641, 8.5879],    // Göschenen (Gotthard norte)
        [46.5284, 8.6129],    // Airolo (Gotthard sul)
        [46.1913, 9.0227],    // Bellinzona
        [45.4847, 9.2045],    // Milano Centrale
      ],
    },
    pois: [
      { id: "sui-berna", label: "Estação de Berna", lat: 46.9480, lng: 7.4400, day: 7, time: "Manhã", description: "Chegada TGV de Paris ~4h30" },
      { id: "sui-interlaken", label: "Interlaken Ost", lat: 46.6900, lng: 7.8700, day: 7, time: "Tarde", description: "Check-in — entre dois lagos" },
      { id: "sui-lauterbrunnen", label: "Lauterbrunnen", lat: 46.5936, lng: 7.9094, day: 8, time: "Manhã", description: "Vale das 72 cachoeiras! Staubbach Falls" },
      { id: "sui-murren", label: "Mürren", lat: 46.5592, lng: 7.8925, day: 8, time: "Tarde", description: "Vilarejo sem carros — Eiger, Mönch, Jungfrau" },
      { id: "sui-jungfraujoch", label: "Jungfraujoch (3.454m)", lat: 46.5472, lng: 7.9850, day: 9, time: "Manhã", description: "Top of Europe! Glaciar Aletsch" },
      { id: "sui-grindelwald", label: "Grindelwald", lat: 46.6241, lng: 8.0413, day: 9, time: "Tarde", description: "Paragliding opcional — 180 CHF" },
      { id: "sui-harder-kulm", label: "Harder Kulm", lat: 46.6960, lng: 7.8680, day: 9, time: "Noite", description: "Vista dos lagos e Alpes ao entardecer" },
      { id: "sui-lucerna", label: "Lucerna", lat: 47.0519, lng: 8.3074, day: 10, time: "Meio-dia", description: "Kapellbrücke, cidade velha, Leão" },
    ],
    accommodations: [
      {
        id: "acc-interlaken",
        label: "Hotel/Airbnb Interlaken",
        lat: 46.6860,
        lng: 7.8530,
        nights: 4,
        checkIn: "28/set",
        checkOut: "02/out",
        type: "airbnb",
        neighborhood: "Interlaken (entre os lagos)",
        pricePerNight: "~160 CHF",
        totalPrice: "~640 CHF",
        guests: 4,
        tip: "Base perfeita para explorar Jungfrau, Lauterbrunnen e Grindelwald.",
        amenities: ["Wi-Fi", "Cozinha", "Vista dos Alpes", "Estacionamento"],
      },
    ],
    trainRoutes: [
      // Trem Berna → Interlaken Ost (via Thun)
      {
        fromId: "sui-berna",
        toId: "sui-interlaken",
        label: "Trem IC Berna→Interlaken",
        waypoints: [
          [46.9480, 7.4400], // Berna
          [46.9200, 7.4700], // Münsingen
          [46.8600, 7.5100], // Spiez approach
          [46.7570, 7.6320], // Thun
          [46.7200, 7.6600], // Spiez
          [46.6900, 7.8700], // Interlaken Ost
        ],
      },
      // Trem Interlaken → Lauterbrunnen
      {
        fromId: "sui-interlaken",
        toId: "sui-lauterbrunnen",
        label: "BOB Interlaken→Lauterbrunnen",
        waypoints: [
          [46.6900, 7.8700], // Interlaken Ost
          [46.6700, 7.8750], // Wilderswil
          [46.6350, 7.8900], // Zweilütschinen
          [46.5936, 7.9094], // Lauterbrunnen
        ],
      },
      // Teleférico Lauterbrunnen → Mürren
      {
        fromId: "sui-lauterbrunnen",
        toId: "sui-murren",
        label: "Teleférico + trem",
        waypoints: [
          [46.5936, 7.9094], // Lauterbrunnen
          [46.5800, 7.9000], // Grütschalp (teleférico)
          [46.5680, 7.8950], // Winteregg
          [46.5592, 7.8925], // Mürren
        ],
      },
      // Trem Interlaken → Jungfraujoch (via Grindelwald/Kleine Scheidegg)
      {
        fromId: "sui-murren",
        toId: "sui-jungfraujoch",
        label: "Trem WAB + Jungfraubahn",
        waypoints: [
          [46.5592, 7.8925], // Mürren
          [46.5936, 7.9094], // Lauterbrunnen (volta)
          [46.5960, 7.9100], // Wengen approach
          [46.6060, 7.9220], // Wengen
          [46.5850, 7.9610], // Kleine Scheidegg
          [46.5650, 7.9720], // Eigergletscher
          [46.5472, 7.9850], // Jungfraujoch Top of Europe
        ],
      },
      // Jungfraujoch → Grindelwald (descida lado Grindelwald)
      {
        fromId: "sui-jungfraujoch",
        toId: "sui-grindelwald",
        label: "Jungfraubahn + WAB",
        waypoints: [
          [46.5472, 7.9850], // Jungfraujoch
          [46.5650, 7.9720], // Eigergletscher
          [46.5850, 7.9610], // Kleine Scheidegg
          [46.6100, 7.9900], // Grund (Grindelwald)
          [46.6241, 8.0413], // Grindelwald
        ],
      },
      // Grindelwald → Harder Kulm (volta a Interlaken + funicular)
      {
        fromId: "sui-grindelwald",
        toId: "sui-harder-kulm",
        label: "Trem + Funicular",
        waypoints: [
          [46.6241, 8.0413], // Grindelwald
          [46.6350, 7.8900], // Zweilütschinen
          [46.6700, 7.8750], // Wilderswil
          [46.6900, 7.8700], // Interlaken Ost
          [46.6960, 7.8680], // Harder Kulm (funicular)
        ],
      },
      // Interlaken → Lucerna Express (trem cênico)
      {
        fromId: "sui-harder-kulm",
        toId: "sui-lucerna",
        label: "Interlaken–Lucerna Express",
        waypoints: [
          [46.6960, 7.8680], // Harder Kulm/Interlaken
          [46.6900, 7.8700], // Interlaken Ost
          [46.7570, 7.6320], // Brienz area
          [46.7800, 7.8600], // Brünig-Hasliberg
          [46.8800, 8.1700], // Sarnen
          [46.9500, 8.2200], // Alpnachstad
          [47.0000, 8.2700], // Hergiswil
          [47.0519, 8.3074], // Lucerna
        ],
      },
    ],
  },

  italia: {
    center: [43.0, 11.5],
    zoom: 6,
    arrival: {
      label: "Lucerna → Milão",
      type: "train",
      from: "Estação de Lucerna (Luzern Hbf)",
      to: "Milano Centrale",
      time: "01/out · ~3h (Túnel Gotthard)",
      details: "SBB/Trenitalia · Trem cênico pelos Alpes",
      waypoints: [
        [47.0519, 8.3074],    // Lucerna
        [46.6641, 8.5879],    // Göschenen
        [46.5284, 8.6129],    // Airolo
        [46.1913, 9.0227],    // Bellinzona
        [45.8340, 9.0285],    // Chiasso (fronteira)
        [45.4847, 9.2045],    // Milano Centrale
        [45.4642, 9.1900],    // Duomo di Milano (primeiro POI)
      ],
    },
    departure: {
      label: "FCO → LHR",
      type: "flight",
      from: "Aeroporto Fiumicino (FCO)",
      to: "Aeroporto Heathrow (LHR)",
      time: "07/out · ~2h30 de voo",
      details: "Voo Roma → Londres · Transfer ao centro via Heathrow Express",
      waypoints: [
        [41.8003, 12.2514],   // FCO — Fiumicino
        [43.5, 10.0],         // Sobre a Toscana
        [46.0, 7.0],          // Alpes
        [48.5, 2.5],          // Norte da França
        [51.4713, -0.4524],   // LHR — Heathrow T2
      ],
    },
    pois: [
      // Milano (Day 10)
      { id: "ita-duomo", label: "Duomo di Milano", lat: 45.4642, lng: 9.1900, day: 11, time: "Manhã", description: "Terraço com vista dos Alpes" },
      { id: "ita-galleria", label: "Galleria Vittorio Emanuele", lat: 45.4659, lng: 9.1903, day: 11, time: "Tarde", description: "Shopping histórico" },
      { id: "ita-ultima-ceia", label: "Última Ceia (Santa Maria)", lat: 45.4660, lng: 9.1711, day: 11, time: "Tarde", description: "Da Vinci — reserve meses antes!" },
      { id: "ita-navigli", label: "Navigli", lat: 45.4488, lng: 9.1770, day: 11, time: "Noite", description: "Canais e restaurantes" },
      // Florença (Days 11-13)
      { id: "ita-signoria", label: "Piazza della Signoria", lat: 43.7696, lng: 11.2558, day: 12, time: "Tarde", description: "Palazzo Vecchio" },
      { id: "ita-ponte-vecchio", label: "Ponte Vecchio", lat: 43.7680, lng: 11.2531, day: 12, time: "Tarde", description: "Ponte medieval com joalherias" },
      { id: "ita-uffizi", label: "Uffizi", lat: 43.7677, lng: 11.2553, day: 13, time: "Manhã", description: "Botticelli, Leonardo, Michelangelo — 3h" },
      { id: "ita-brunelleschi", label: "Cúpula de Brunelleschi", lat: 43.7731, lng: 11.2560, day: 13, time: "Tarde", description: "463 degraus — vista 360°" },
      { id: "ita-piazzale", label: "Piazzale Michelangelo", lat: 43.7629, lng: 11.2650, day: 13, time: "Noite", description: "Pôr do sol sobre Florença" },
      { id: "ita-accademia", label: "Accademia — David", lat: 43.7769, lng: 11.2587, day: 14, time: "Manhã", description: "Michelangelo — 16 EUR" },
      { id: "ita-mercato", label: "Mercato Centrale", lat: 43.7762, lng: 11.2535, day: 14, time: "Manhã", description: "San Lorenzo" },
      // Roma (Days 13-15)
      { id: "ita-trevi", label: "Fontana di Trevi", lat: 41.9009, lng: 12.4833, day: 14, time: "Noite", description: "Iluminada à noite" },
      { id: "ita-spagna", label: "Piazza di Spagna", lat: 41.9057, lng: 12.4823, day: 14, time: "Noite", description: "Escadaria" },
      { id: "ita-coliseu", label: "Coliseu", lat: 41.8902, lng: 12.4922, day: 15, time: "Manhã", description: "Foro Romano + Palatino — 18 EUR" },
      { id: "ita-panteao", label: "Panteão", lat: 41.8986, lng: 12.4769, day: 15, time: "Tarde", description: "Grátis!" },
      { id: "ita-navona", label: "Piazza Navona", lat: 41.8992, lng: 12.4731, day: 15, time: "Tarde", description: "Fontes barrocas" },
      { id: "ita-trastevere", label: "Trastevere", lat: 41.8893, lng: 12.4695, day: 15, time: "Noite", description: "Cacio e pepe, carbonara" },
      { id: "ita-vaticano", label: "Vaticano + Sistina", lat: 41.9029, lng: 12.4534, day: 16, time: "Manhã", description: "Chegue 8h — 17 EUR" },
      { id: "ita-santangelo", label: "Castel Sant'Angelo", lat: 41.9031, lng: 12.4663, day: 16, time: "Tarde", description: "Vista do Tibre" },
    ],
    accommodations: [
      {
        id: "acc-milao",
        label: "Hotel Milão Centro",
        lat: 45.4620,
        lng: 9.1850,
        nights: 1,
        checkIn: "02/out",
        checkOut: "03/out",
        type: "hotel",
        neighborhood: "Centro / Duomo",
        pricePerNight: "~130 EUR",
        totalPrice: "~130 EUR",
        guests: 4,
        tip: "Só 1 noite — priorize localização central perto da estação.",
        amenities: ["Wi-Fi", "Café da manhã", "Ar condicionado"],
      },
      {
        id: "acc-florenca",
        label: "Airbnb Florença",
        lat: 43.7710,
        lng: 11.2530,
        nights: 2,
        checkIn: "03/out",
        checkOut: "05/out",
        type: "airbnb",
        neighborhood: "Santa Maria Novella / San Lorenzo",
        pricePerNight: "~140 EUR",
        totalPrice: "~280 EUR",
        guests: 4,
        tip: "Perto da estação SMN e do Mercato Centrale. Centro histórico a pé.",
        amenities: ["Wi-Fi", "Cozinha", "Ar condicionado", "Vista"],
      },
      {
        id: "acc-roma",
        label: "Airbnb Roma",
        lat: 41.8960,
        lng: 12.4770,
        nights: 3,
        checkIn: "05/out",
        checkOut: "08/out",
        type: "airbnb",
        neighborhood: "Centro Storico / Trastevere",
        pricePerNight: "~160 EUR",
        totalPrice: "~480 EUR",
        guests: 4,
        tip: "Tudo a pé! Coliseu, Trevi, Panteão e Vaticano acessíveis.",
        amenities: ["Wi-Fi", "Cozinha", "Ar condicionado", "Máquina de lavar"],
      },
    ],
    trainRoutes: [
      // Italo Treno Milano Centrale → Firenze SMN
      {
        fromId: "ita-navigli",
        toId: "ita-signoria",
        label: "Italo Treno Milano→Firenze",
        waypoints: [
          [45.4488, 9.1770], // Navigli (→ Milano Centrale)
          [45.4847, 9.2045], // Milano Centrale
          [45.3200, 9.2800], // Lodi
          [45.0500, 9.7000], // Piacenza
          [44.8000, 10.3300], // Parma
          [44.6500, 10.9300], // Modena
          [44.5000, 11.3400], // Bologna Centrale
          [44.2500, 11.3200], // Prato area
          [43.7762, 11.2480], // Firenze SMN
          [43.7696, 11.2558], // Piazza della Signoria
        ],
      },
      // Trem Firenze SMN → Roma Termini
      {
        fromId: "ita-mercato",
        toId: "ita-trevi",
        label: "Trem Firenze→Roma",
        waypoints: [
          [43.7762, 11.2535], // Mercato/SMN
          [43.7762, 11.2480], // Firenze SMN
          [43.4600, 11.4400], // Chiusi area
          [43.1000, 11.8000], // Orvieto area
          [42.6500, 12.1000], // Orte
          [42.2200, 12.3800], // Settebagni
          [41.9010, 12.5020], // Roma Termini
          [41.9009, 12.4833], // Fontana di Trevi
        ],
      },
    ],
  },

  londres: {
    center: [51.5074, -0.1278],
    zoom: 13,
    arrival: {
      label: "FCO → LHR",
      type: "flight",
      from: "Aeroporto Fiumicino (FCO)",
      to: "Aeroporto Heathrow (LHR)",
      time: "07/out · ~2h30 de voo",
      details: "Voo Roma → Londres · Heathrow Express ~15min ao centro",
      waypoints: [
        [41.8003, 12.2514],   // FCO — Fiumicino
        [43.5, 10.0],         // Toscana
        [46.0, 7.0],          // Alpes
        [48.5, 2.5],          // Norte da França
        [51.4713, -0.4524],   // LHR — Heathrow
        [51.5007, -0.1246],   // Westminster (primeiro POI)
      ],
    },
    departure: {
      label: "LHR → MAD",
      type: "flight",
      from: "Aeroporto Heathrow T5 (LHR)",
      to: "Aeroporto Barajas (MAD)",
      time: "11/out · ~2h de voo",
      details: "Voo Londres → Madrid · Última etapa antes de voltar",
      waypoints: [
        [51.4723, -0.4889],   // LHR — Heathrow T5
        [49.0, -1.0],         // Canal da Mancha
        [46.0, -1.5],         // Oeste da França
        [43.0, -2.0],         // Norte da Espanha
        [40.4719, -3.5626],   // MAD — Barajas
      ],
    },
    pois: [
      { id: "lon-westminster", label: "Big Ben / Westminster", lat: 51.5007, lng: -0.1246, day: 17, time: "Manhã", description: "Parlamento" },
      { id: "lon-abbey", label: "Abadia de Westminster", lat: 51.4993, lng: -0.1273, day: 17, time: "Manhã", description: "29 GBP/pessoa" },
      { id: "lon-eye", label: "London Eye", lat: 51.5033, lng: -0.1195, day: 17, time: "Tarde", description: "30-37 GBP/pessoa" },
      { id: "lon-tate", label: "Tate Modern", lat: 51.5076, lng: -0.0994, day: 17, time: "Tarde", description: "Grátis!" },
      { id: "lon-stpauls", label: "St Paul's Cathedral", lat: 51.5138, lng: -0.0984, day: 17, time: "Tarde", description: "Catedral icônica" },
      { id: "lon-borough", label: "Borough Market", lat: 51.5055, lng: -0.0910, day: 17, time: "Noite", description: "Fish & chips + pub" },
      { id: "lon-buckingham", label: "Buckingham Palace", lat: 51.5014, lng: -0.1419, day: 18, time: "Manhã", description: "Troca da guarda" },
      { id: "lon-hyde", label: "Hyde Park", lat: 51.5073, lng: -0.1657, day: 18, time: "Manhã", description: "Passeio" },
      { id: "lon-british", label: "British Museum", lat: 51.5194, lng: -0.1270, day: 18, time: "Tarde", description: "Grátis!" },
      { id: "lon-natural", label: "Natural History Museum", lat: 51.4966, lng: -0.1764, day: 18, time: "Tarde", description: "Grátis!" },
      { id: "lon-covent", label: "Covent Garden", lat: 51.5117, lng: -0.1240, day: 18, time: "Noite", description: "West End Musical" },
      { id: "lon-tower", label: "Tower of London", lat: 51.5081, lng: -0.0759, day: 19, time: "Manhã", description: "33 GBP/pessoa" },
      { id: "lon-bridge", label: "Tower Bridge", lat: 51.5055, lng: -0.0754, day: 19, time: "Manhã", description: "12 GBP/pessoa" },
      { id: "lon-shoreditch", label: "Shoreditch / Brick Lane", lat: 51.5235, lng: -0.0711, day: 19, time: "Tarde", description: "Street art e mercados" },
      { id: "lon-camden", label: "Camden Town", lat: 51.5392, lng: -0.1426, day: 19, time: "Noite", description: "Alternativo e vibrante" },
      { id: "lon-sky-garden", label: "Sky Garden", lat: 51.5114, lng: -0.0836, day: 20, time: "Manhã", description: "Vista grátis!" },
      { id: "lon-oxford", label: "Oxford Street", lat: 51.5145, lng: -0.1445, day: 20, time: "Tarde", description: "Compras + afternoon tea" },
    ],
    accommodations: [
      {
        id: "acc-londres",
        label: "Hotel Londres",
        lat: 51.5120,
        lng: -0.1300,
        nights: 4,
        checkIn: "07/out",
        checkOut: "11/out",
        type: "hotel",
        neighborhood: "Covent Garden / West End",
        pricePerNight: "~180 GBP",
        totalPrice: "~720 GBP",
        guests: 4,
        tip: "Região central com acesso fácil ao metrô. Perto de teatros e restaurantes.",
        amenities: ["Wi-Fi", "Café da manhã", "Ar condicionado"],
      },
    ],
  },

  "madrid-volta": {
    center: [40.4200, -3.7000],
    zoom: 14,
    arrival: {
      label: "LHR → MAD",
      type: "flight",
      from: "Aeroporto Heathrow (LHR)",
      to: "Aeroporto Barajas (MAD)",
      time: "11/out · ~2h de voo",
      details: "Voo Londres → Madrid · Metrô L8 ao centro",
      waypoints: [
        [51.4713, -0.4524],   // LHR — Heathrow
        [49.0, -1.0],         // Canal da Mancha
        [46.0, -1.5],         // Oeste da França
        [43.0, -2.0],         // Norte da Espanha
        [40.4719, -3.5626],   // MAD — Barajas
        [40.4251, -3.6903],   // Plaza de Colón (primeiro POI)
      ],
    },
    departure: {
      label: "MAD → GRU",
      type: "flight",
      from: "Aeroporto Barajas (MAD)",
      to: "Aeroporto de Guarulhos (GRU)",
      time: "13/out · Voo diurno ~10h",
      details: "Iberia (Avios) · Despedida da Europa!",
      waypoints: [
        [40.4719, -3.5626],   // MAD — Barajas
        [36.0, -8.0],         // Sul de Portugal
        [28.0, -15.0],        // Canárias
        [10.0, -25.0],        // Atlântico equatorial
        [-10.0, -35.0],       // Nordeste brasileiro
        [-23.4356, -46.4731], // GRU — Guarulhos
      ],
    },
    pois: [
      { id: "madv-colon", label: "Plaza de Colón", lat: 40.4251, lng: -3.6903, day: 21, time: "Manhã", description: "Feriado! Desfile Día de la Hispanidad" },
      { id: "madv-malasana", label: "Malasaña", lat: 40.4266, lng: -3.7050, day: 21, time: "Manhã", description: "Brunch e café" },
      { id: "madv-corte-ingles", label: "El Corte Inglés (Sol)", lat: 40.4178, lng: -3.7035, day: 21, time: "Tarde", description: "Jamón, azeite, vinhos, lembrancinhas" },
      { id: "madv-tapas", label: "Tapas de Despedida", lat: 40.4130, lng: -3.7100, day: 21, time: "Noite", description: "Último jantar da Eurotrip!" },
      { id: "madv-barajas", label: "Aeroporto Barajas", lat: 40.4719, lng: -3.5626, day: 22, time: "Dia", description: "Voo MAD → GRU — Duty Free!" },
    ],
    accommodations: [
      {
        id: "acc-madrid-volta",
        label: "Hotel Madrid (volta)",
        lat: 40.4200,
        lng: -3.7020,
        nights: 1,
        checkIn: "11/out",
        checkOut: "12/out",
        type: "hotel",
        neighborhood: "Sol / Gran Vía",
        pricePerNight: "~120 EUR",
        totalPrice: "~120 EUR",
        guests: 4,
        tip: "Última noite! Perto do centro para aproveitar o último dia.",
        amenities: ["Wi-Fi", "Ar condicionado"],
      },
    ],
    trainRoutes: [
      // Metrô centro → Barajas
      {
        fromId: "madv-tapas",
        toId: "madv-barajas",
        label: "Metrô L1 + L8",
        waypoints: [
          [40.4130, -3.7100], // La Latina area
          [40.4168, -3.7038], // Sol
          [40.4280, -3.6920], // Gran Vía
          [40.4380, -3.6850], // Nuevos Ministerios
          [40.4440, -3.6600], // Colombia
          [40.4470, -3.6350], // Pinar del Rey
          [40.4510, -3.6150], // Mar de Cristal
          [40.4580, -3.5900], // Campo de las Naciones
          [40.4672, -3.5705], // Barajas T1-T2-T3
          [40.4719, -3.5626], // Barajas T4
        ],
      },
    ],
  },
};
