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

export interface CityMapData {
  center: [number, number];
  zoom: number;
  pois: MapPOI[];
  trainRoutes?: TrainRoute[];
}

export const mapData: Record<string, CityMapData> = {
  madrid: {
    center: [40.4168, -3.7038],
    zoom: 14,
    pois: [
      { id: "mad-barajas", label: "Aeroporto Barajas", lat: 40.4719, lng: -3.5626, day: 1, time: "Manhã", description: "Pouso 10:45 — imigração + bagagem" },
      { id: "mad-san-miguel", label: "Mercado de San Miguel", lat: 40.4154, lng: -3.7089, day: 1, time: "Almoço", description: "Jamón ibérico, queijos, croquetas" },
      { id: "mad-sol", label: "Puerta del Sol", lat: 40.4168, lng: -3.7038, day: 1, time: "Tarde", description: "Passeio leve pelo centro" },
      { id: "mad-plaza-mayor", label: "Plaza Mayor", lat: 40.4155, lng: -3.7074, day: 1, time: "Tarde", description: "Passeio leve pelo centro" },
      { id: "mad-prado", label: "Museu do Prado", lat: 40.4138, lng: -3.6921, day: 1, time: "Final da tarde", description: "Grátis 18h-20h! Las Meninas, Goya, Bosch" },
      { id: "mad-la-latina", label: "La Latina", lat: 40.4110, lng: -3.7116, day: 1, time: "Noite", description: "Tapas — jantar 21h+" },
      { id: "mad-palacio", label: "Palácio Real", lat: 40.4180, lng: -3.7142, day: 2, time: "Manhã", description: "14 EUR/pessoa" },
      { id: "mad-reina-sofia", label: "Reina Sofía", lat: 40.4086, lng: -3.6943, day: 2, time: "Manhã", description: "Guernica de Picasso" },
      { id: "mad-retiro", label: "Parque do Retiro", lat: 40.4153, lng: -3.6845, day: 2, time: "Tarde", description: "Lago, barquinhos, Palácio de Cristal" },
      { id: "mad-debod", label: "Templo de Debod", lat: 40.4241, lng: -3.7178, day: 2, time: "Tarde", description: "Pôr do sol" },
      { id: "mad-flamenco", label: "Flamenco + Salmon Guru", lat: 40.4160, lng: -3.6990, day: 2, time: "Noite", description: "Essential Flamenco + drinks" },
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
    pois: [
      { id: "par-trocadero", label: "Trocadéro", lat: 48.8616, lng: 2.2886, day: 3, time: "Manhã", description: "Foto clássica com Torre Eiffel" },
      { id: "par-orsay", label: "Musée d'Orsay", lat: 48.8600, lng: 2.3266, day: 3, time: "Tarde", description: "Monet, Renoir, Van Gogh — ~16 EUR" },
      { id: "par-cruzeiro", label: "Cruzeiro pelo Sena", lat: 48.8584, lng: 2.2945, day: 3, time: "Noite", description: "Pôr do sol no rio" },
      { id: "par-louvre", label: "Louvre", lat: 48.8606, lng: 2.3376, day: 4, time: "Manhã", description: "Mona Lisa, Vênus de Milo — ~22 EUR" },
      { id: "par-disney", label: "Disneyland Paris", lat: 48.8674, lng: 2.7836, day: 4, time: "Tarde/Noite", description: "RER A ~40 min — show noturno!" },
      { id: "par-notre-dame", label: "Notre-Dame", lat: 48.8530, lng: 2.3499, day: 5, time: "Manhã", description: "Restaurada! Ingresso gratuito com reserva" },
      { id: "par-sainte-chapelle", label: "Sainte-Chapelle", lat: 48.8554, lng: 2.3450, day: 5, time: "Manhã", description: "Vitrais góticos — ~11 EUR" },
      { id: "par-montmartre", label: "Sacré-Cœur / Montmartre", lat: 48.8867, lng: 2.3431, day: 5, time: "Tarde", description: "Vista panorâmica grátis, Place du Tertre" },
      { id: "par-arc", label: "Arco do Triunfo", lat: 48.8738, lng: 2.2950, day: 5, time: "Tarde", description: "Vista 360° — ~13 EUR" },
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
    pois: [
      { id: "sui-berna", label: "Estação de Berna", lat: 46.9480, lng: 7.4400, day: 6, time: "Manhã", description: "Chegada TGV de Paris ~4h30" },
      { id: "sui-interlaken", label: "Interlaken Ost", lat: 46.6900, lng: 7.8700, day: 6, time: "Tarde", description: "Check-in — entre dois lagos" },
      { id: "sui-lauterbrunnen", label: "Lauterbrunnen", lat: 46.5936, lng: 7.9094, day: 7, time: "Manhã", description: "Vale das 72 cachoeiras! Staubbach Falls" },
      { id: "sui-murren", label: "Mürren", lat: 46.5592, lng: 7.8925, day: 7, time: "Tarde", description: "Vilarejo sem carros — Eiger, Mönch, Jungfrau" },
      { id: "sui-jungfraujoch", label: "Jungfraujoch (3.454m)", lat: 46.5472, lng: 7.9850, day: 8, time: "Manhã", description: "Top of Europe! Glaciar Aletsch" },
      { id: "sui-grindelwald", label: "Grindelwald", lat: 46.6241, lng: 8.0413, day: 8, time: "Tarde", description: "Paragliding opcional — 180 CHF" },
      { id: "sui-harder-kulm", label: "Harder Kulm", lat: 46.6960, lng: 7.8680, day: 8, time: "Noite", description: "Vista dos lagos e Alpes ao entardecer" },
      { id: "sui-lucerna", label: "Lucerna", lat: 47.0519, lng: 8.3074, day: 9, time: "Meio-dia", description: "Kapellbrücke, cidade velha, Leão" },
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
    pois: [
      // Milano (Day 10)
      { id: "ita-duomo", label: "Duomo di Milano", lat: 45.4642, lng: 9.1900, day: 10, time: "Manhã", description: "Terraço com vista dos Alpes" },
      { id: "ita-galleria", label: "Galleria Vittorio Emanuele", lat: 45.4659, lng: 9.1903, day: 10, time: "Tarde", description: "Shopping histórico" },
      { id: "ita-ultima-ceia", label: "Última Ceia (Santa Maria)", lat: 45.4660, lng: 9.1711, day: 10, time: "Tarde", description: "Da Vinci — reserve meses antes!" },
      { id: "ita-navigli", label: "Navigli", lat: 45.4488, lng: 9.1770, day: 10, time: "Noite", description: "Canais e restaurantes" },
      // Florença (Days 11-13)
      { id: "ita-signoria", label: "Piazza della Signoria", lat: 43.7696, lng: 11.2558, day: 11, time: "Tarde", description: "Palazzo Vecchio" },
      { id: "ita-ponte-vecchio", label: "Ponte Vecchio", lat: 43.7680, lng: 11.2531, day: 11, time: "Tarde", description: "Ponte medieval com joalherias" },
      { id: "ita-uffizi", label: "Uffizi", lat: 43.7677, lng: 11.2553, day: 12, time: "Manhã", description: "Botticelli, Leonardo, Michelangelo — 3h" },
      { id: "ita-brunelleschi", label: "Cúpula de Brunelleschi", lat: 43.7731, lng: 11.2560, day: 12, time: "Tarde", description: "463 degraus — vista 360°" },
      { id: "ita-piazzale", label: "Piazzale Michelangelo", lat: 43.7629, lng: 11.2650, day: 12, time: "Noite", description: "Pôr do sol sobre Florença" },
      { id: "ita-accademia", label: "Accademia — David", lat: 43.7769, lng: 11.2587, day: 13, time: "Manhã", description: "Michelangelo — 16 EUR" },
      { id: "ita-mercato", label: "Mercato Centrale", lat: 43.7762, lng: 11.2535, day: 13, time: "Manhã", description: "San Lorenzo" },
      // Roma (Days 13-15)
      { id: "ita-trevi", label: "Fontana di Trevi", lat: 41.9009, lng: 12.4833, day: 13, time: "Noite", description: "Iluminada à noite" },
      { id: "ita-spagna", label: "Piazza di Spagna", lat: 41.9057, lng: 12.4823, day: 13, time: "Noite", description: "Escadaria" },
      { id: "ita-coliseu", label: "Coliseu", lat: 41.8902, lng: 12.4922, day: 14, time: "Manhã", description: "Foro Romano + Palatino — 18 EUR" },
      { id: "ita-panteao", label: "Panteão", lat: 41.8986, lng: 12.4769, day: 14, time: "Tarde", description: "Grátis!" },
      { id: "ita-navona", label: "Piazza Navona", lat: 41.8992, lng: 12.4731, day: 14, time: "Tarde", description: "Fontes barrocas" },
      { id: "ita-trastevere", label: "Trastevere", lat: 41.8893, lng: 12.4695, day: 14, time: "Noite", description: "Cacio e pepe, carbonara" },
      { id: "ita-vaticano", label: "Vaticano + Sistina", lat: 41.9029, lng: 12.4534, day: 15, time: "Manhã", description: "Chegue 8h — 17 EUR" },
      { id: "ita-santangelo", label: "Castel Sant'Angelo", lat: 41.9031, lng: 12.4663, day: 15, time: "Tarde", description: "Vista do Tibre" },
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
    pois: [
      { id: "lon-westminster", label: "Big Ben / Westminster", lat: 51.5007, lng: -0.1246, day: 16, time: "Manhã", description: "Parlamento" },
      { id: "lon-abbey", label: "Abadia de Westminster", lat: 51.4993, lng: -0.1273, day: 16, time: "Manhã", description: "29 GBP/pessoa" },
      { id: "lon-eye", label: "London Eye", lat: 51.5033, lng: -0.1195, day: 16, time: "Tarde", description: "30-37 GBP/pessoa" },
      { id: "lon-tate", label: "Tate Modern", lat: 51.5076, lng: -0.0994, day: 16, time: "Tarde", description: "Grátis!" },
      { id: "lon-stpauls", label: "St Paul's Cathedral", lat: 51.5138, lng: -0.0984, day: 16, time: "Tarde", description: "Catedral icônica" },
      { id: "lon-borough", label: "Borough Market", lat: 51.5055, lng: -0.0910, day: 16, time: "Noite", description: "Fish & chips + pub" },
      { id: "lon-buckingham", label: "Buckingham Palace", lat: 51.5014, lng: -0.1419, day: 17, time: "Manhã", description: "Troca da guarda" },
      { id: "lon-hyde", label: "Hyde Park", lat: 51.5073, lng: -0.1657, day: 17, time: "Manhã", description: "Passeio" },
      { id: "lon-british", label: "British Museum", lat: 51.5194, lng: -0.1270, day: 17, time: "Tarde", description: "Grátis!" },
      { id: "lon-natural", label: "Natural History Museum", lat: 51.4966, lng: -0.1764, day: 17, time: "Tarde", description: "Grátis!" },
      { id: "lon-covent", label: "Covent Garden", lat: 51.5117, lng: -0.1240, day: 17, time: "Noite", description: "West End Musical" },
      { id: "lon-tower", label: "Tower of London", lat: 51.5081, lng: -0.0759, day: 18, time: "Manhã", description: "33 GBP/pessoa" },
      { id: "lon-bridge", label: "Tower Bridge", lat: 51.5055, lng: -0.0754, day: 18, time: "Manhã", description: "12 GBP/pessoa" },
      { id: "lon-shoreditch", label: "Shoreditch / Brick Lane", lat: 51.5235, lng: -0.0711, day: 18, time: "Tarde", description: "Street art e mercados" },
      { id: "lon-camden", label: "Camden Town", lat: 51.5392, lng: -0.1426, day: 18, time: "Noite", description: "Alternativo e vibrante" },
      { id: "lon-sky-garden", label: "Sky Garden", lat: 51.5114, lng: -0.0836, day: 19, time: "Manhã", description: "Vista grátis!" },
      { id: "lon-oxford", label: "Oxford Street", lat: 51.5145, lng: -0.1445, day: 19, time: "Tarde", description: "Compras + afternoon tea" },
    ],
  },

  "madrid-volta": {
    center: [40.4200, -3.7000],
    zoom: 14,
    pois: [
      { id: "madv-colon", label: "Plaza de Colón", lat: 40.4251, lng: -3.6903, day: 20, time: "Manhã", description: "Feriado! Desfile Día de la Hispanidad" },
      { id: "madv-malasana", label: "Malasaña", lat: 40.4266, lng: -3.7050, day: 20, time: "Manhã", description: "Brunch e café" },
      { id: "madv-corte-ingles", label: "El Corte Inglés (Sol)", lat: 40.4178, lng: -3.7035, day: 20, time: "Tarde", description: "Jamón, azeite, vinhos, lembrancinhas" },
      { id: "madv-tapas", label: "Tapas de Despedida", lat: 40.4130, lng: -3.7100, day: 20, time: "Noite", description: "Último jantar da Eurotrip!" },
      { id: "madv-barajas", label: "Aeroporto Barajas", lat: 40.4719, lng: -3.5626, day: 21, time: "Dia", description: "Voo MAD → GRU — Duty Free!" },
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
