export interface Activity {
  time: string;
  icon: string;
  title: string;
  description: string;
  cost?: string;
  tip?: string;
}

export interface Day {
  date: string;
  weekday: string;
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  countryCode: string;
  icon: string;
  dates: string;
  nights: number;
  color: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  days: Day[];
  transport?: string;
  heroImage?: string;
}

export interface Flight {
  label: string;
  route: string;
  time: string;
  details: string;
}

export interface Traveler {
  name: string;
  emoji: string;
  email?: string;
  color: string;
}

export interface TripData {
  title: string;
  version: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCountries: number;
  travelers: Traveler[];
  flightDomesticOut: Flight;
  flightOut: Flight;
  flightBack: Flight;
  flightDomesticBack: Flight;
  cities: City[];
  bookingAlerts: string[];
}

export const tripData: TripData = {
  title: "Eurotrip 2026",
  version: "v7",
  startDate: "21 de Setembro",
  endDate: "14 de Outubro",
  totalDays: 24,
  totalCountries: 6,
  travelers: [
    { name: "Lidia", emoji: "👩", color: "#e74c3c" },
    { name: "Pedro", emoji: "👨", email: "pedroignacio16@gmail.com", color: "#3498db" },
    { name: "Joquebede", emoji: "👩", email: "joquebetedias@gmail.com", color: "#2ecc71" },
    { name: "Thiago", emoji: "👨", email: "ths.pereira@gmail.com", color: "#8e44ad" },
  ],
  flightDomesticOut: {
    label: "DOMÉSTICO IDA",
    route: "BSB → GRU",
    time: "22/set",
    details: "Voo doméstico — chegar com antecedência para conexão internacional",
  },
  flightOut: {
    label: "INTERNACIONAL IDA",
    route: "GRU → MAD",
    time: "23/set 14:10 → 24/set 05:35",
    details: "IB0268 Iberia Direto | Duração 11h25 | 31.250 Avios × 4 = 125.000 Avios",
  },
  flightBack: {
    label: "INTERNACIONAL VOLTA",
    route: "MAD → GRU",
    time: "14/out",
    details: "Iberia (Avios)",
  },
  flightDomesticBack: {
    label: "DOMÉSTICO VOLTA",
    route: "GRU → BSB",
    time: "14/out",
    details: "Voo doméstico — chegada em casa!",
  },
  bookingAlerts: [
    "Prado (grátis 18h-20h)",
    "Louvre (fecha terças)",
    "Disneyland Paris (ingresso tarde)",
    "Jungfraujoch (site oficial)",
    "Última Ceia de Da Vinci (meses antes!)",
    "Uffizi (fecha segundas)",
    "Coliseu + Foro + Palatino",
    "Vaticano + Sistina",
  ],
  cities: [
    {
      id: "brasil-ida",
      name: "Brasil (Partida)",
      country: "Brasil",
      flag: "🇧🇷",
      countryCode: "BR",
      icon: "✈",
      dates: "21-23/set",
      nights: 2,
      color: "#009c3b",
      colorBg: "bg-green-950/30",
      colorBorder: "border-green-500/30",
      colorText: "text-green-400",
      transport: "BSB → GRU → MAD",
      heroImage: "https://images.unsplash.com/photo-1532009877282-3340270e0529?w=1920&q=80",
      days: [
        {
          date: "21/set",
          weekday: "Segunda",
          dayNumber: 1,
          title: "Brasília → São Paulo",
          activities: [
            {
              time: "Manhã",
              icon: "luggage",
              title: "Preparação e check final",
              description:
                "Conferir documentos, passaportes, malas despachadas. Última revisão da checklist!",
            },
            {
              time: "Tarde",
              icon: "plane",
              title: "Voo BSB → GRU",
              description:
                "Voo doméstico Brasília → São Paulo Guarulhos.",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Pernoite em São Paulo",
              description:
                "Descansar perto do aeroporto de Guarulhos para o voo internacional do dia seguinte.",
              tip: "Durma cedo — o voo internacional é longo e sai à noite!",
            },
          ],
        },
        {
          date: "22/set",
          weekday: "Terça",
          dayNumber: 2,
          title: "Dia livre em São Paulo",
          activities: [
            {
              time: "Dia",
              icon: "footprints",
              title: "Dia livre em São Paulo",
              description:
                "Aproveite para descansar, passear ou fazer compras. Último dia no Brasil!",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Pernoite em São Paulo",
              description:
                "Descansar para o voo internacional de amanhã.",
            },
          ],
        },
        {
          date: "23/set",
          weekday: "Quarta",
          dayNumber: 3,
          title: "São Paulo → Madrid",
          activities: [
            {
              time: "Manhã",
              icon: "luggage",
              title: "Check-in Aeroporto de Guarulhos (GRU)",
              description:
                "Terminal internacional. Chegar com 3h de antecedência. Aproveite o duty free.",
            },
            {
              time: "14:10",
              icon: "plane",
              title: "Voo GRU → MAD (Iberia IB0268)",
              description:
                "Voo direto São Paulo → Madrid. Duração 11h25. 31.250 Avios por pessoa. Chegada 05:35 do dia seguinte.",
              tip: "Voo longo — leve travesseiro de pescoço, fone e entretenimento!",
            },
          ],
        },
      ],
    },
    {
      id: "madrid",
      name: "Madrid",
      country: "Espanha",
      flag: "🇪🇸",
      countryCode: "ES",
      icon: "◉",
      dates: "24-25/set",
      nights: 2,
      color: "#e74c3c",
      colorBg: "bg-red-950/30",
      colorBorder: "border-red-500/30",
      colorText: "text-red-400",
      transport: "31.250 Avios por pessoa",
      heroImage: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80",
      days: [
        {
          date: "24/set",
          weekday: "Quinta",
          dayNumber: 4,
          title: "Chegada 05:35 + Centro + Prado",
          activities: [
            {
              time: "05:35",
              icon: "plane",
              title: "Pouso em Barajas 05:35 (IB0268)",
              description:
                "Imigração + bagagem (~1h). Hotel perto de Sol/Gran Vía/La Latina. Descanse um pouco antes de sair!",
            },
            {
              time: "Almoço",
              icon: "utensils-crossed",
              title: "Mercado de San Miguel",
              description:
                "Jamón ibérico, queijos, croquetas, vinho.",
            },
            {
              time: "Tarde",
              icon: "footprints",
              title: "Passeio leve pelo centro",
              description:
                "Puerta del Sol, Plaza Mayor, La Latina.",
            },
            {
              time: "Final da tarde",
              icon: "palette",
              title: "Museu do Prado (grátis 18h-20h!)",
              description:
                "Las Meninas, Goya, Bosch.",
              tip: "Prado grátis 18h-20h (seg-sáb). Reina Sofía grátis seg/qua-sáb 19h-21h.",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Tapas em La Latina",
              description:
                "Jantar 21h+. Durma cedo — jet lag!",
            },
          ],
        },
        {
          date: "25/set",
          weekday: "Sexta",
          dayNumber: 5,
          title: "Palácio Real + Retiro + Flamenco",
          activities: [
            {
              time: "Manhã",
              icon: "crown",
              title: "Palácio Real",
              description: "Aberto 10h.",
              cost: "14 EUR/pessoa = 56 EUR",
            },
            {
              time: "Manhã",
              icon: "palette",
              title: "Reina Sofía",
              description: "Guernica de Picasso.",
            },
            {
              time: "Tarde",
              icon: "tree-pine",
              title: "Parque do Retiro",
              description:
                "Lago, barquinhos, Palácio de Cristal. Templo de Debod ao pôr do sol.",
            },
            {
              time: "Noite",
              icon: "music",
              title: "Flamenco + Drinks",
              description:
                "Essential Flamenco. Drinks no Salmon Guru. Arrume malas!",
            },
          ],
        },
      ],
    },
    {
      id: "paris",
      name: "Paris + Disney",
      country: "França",
      flag: "🇫🇷",
      countryCode: "FR",
      icon: "★",
      dates: "26-28/set",
      nights: 3,
      color: "#3498db",
      colorBg: "bg-blue-950/30",
      colorBorder: "border-blue-500/30",
      colorText: "text-blue-400",
      transport: "Voo MAD-CDG ~2h",
      heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
      days: [
        {
          date: "26/set",
          weekday: "Sábado",
          dayNumber: 6,
          title: "Torre Eiffel + Orsay + Cruzeiro Sena",
          activities: [
            {
              time: "Manhã",
              icon: "landmark",
              title: "Chegada em Paris",
              description:
                "Hotel no Marais ou Latin Quarter. Trocadéro: foto clássica com Torre Eiffel.",
            },
            {
              time: "Tarde",
              icon: "palette",
              title: "Musée d'Orsay",
              description: "Monet, Renoir, Van Gogh, Degas. Fecha segundas!",
              cost: "~16 EUR/pessoa",
            },
            {
              time: "Noite",
              icon: "ship",
              title: "Cruzeiro pelo Sena ao pôr do sol",
              description: "Jantar num bistrô clássico.",
              cost: "~15-18 EUR/pessoa",
            },
          ],
        },
        {
          date: "27/set",
          weekday: "Domingo",
          dayNumber: 7,
          title: "Louvre (manhã) + Disneyland (tarde/noite)",
          activities: [
            {
              time: "Manhã (9h-13h)",
              icon: "palette",
              title: "Louvre",
              description:
                "Chegue às 9h. Mona Lisa, Vênus de Milo, Vitória de Samotrácia. 3-4 horas. Fecha terças!",
              cost: "~22 EUR/pessoa = 88 EUR",
            },
            {
              time: "Almoço (~13h)",
              icon: "utensils-crossed",
              title: "Lanche perto do Louvre",
              description: "Almoço rápido antes de Disney.",
            },
            {
              time: "Tarde/Noite (14h30-22h+)",
              icon: "castle",
              title: "DISNEYLAND PARIS",
              description:
                "RER A do centro até Marne-la-Vallée (~40 min). Castelo da Bela Adormecida, Main Street USA, Fantasyland, Adventureland. Show noturno de luzes no castelo!",
              cost: "~55-70 EUR/pessoa × 4 = ~220-280 EUR",
              tip: "Compre antecipado no site oficial. App Disneyland Paris para horários de shows.",
            },
          ],
        },
        {
          date: "28/set",
          weekday: "Segunda",
          dayNumber: 8,
          title: "Notre-Dame à Montmartre",
          activities: [
            {
              time: "Manhã",
              icon: "church",
              title: "Notre-Dame (restaurada!)",
              description:
                "Ingresso gratuito com reserva. Sainte-Chapelle. Shakespeare & Company.",
              cost: "Sainte-Chapelle ~11 EUR/pessoa",
            },
            {
              time: "Tarde",
              icon: "drama",
              title: "Montmartre",
              description:
                "Sacré-Cœur (vista panorâmica grátis), Place du Tertre. Arco do Triunfo (vista 360°).",
              cost: "Arco ~13 EUR/pessoa",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Último jantar parisiense!",
              description: "Amanhã trem pra Suíça.",
            },
          ],
        },
      ],
    },
    {
      id: "suica",
      name: "Suíça",
      country: "Suíça",
      flag: "🇨🇭",
      countryCode: "CH",
      icon: "▲",
      dates: "29/set-02/out",
      nights: 4,
      color: "#e74c3c",
      colorBg: "bg-emerald-950/30",
      colorBorder: "border-emerald-500/30",
      colorText: "text-emerald-400",
      transport: "TGV Paris-Berna ~4h30 + trem ~50min",
      heroImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80",
      days: [
        {
          date: "29/set",
          weekday: "Terça",
          dayNumber: 9,
          title: "Paris → Interlaken de trem",
          activities: [
            {
              time: "Manhã",
              icon: "train-front",
              title: "TGV Paris → Berna",
              description: "~4h30.",
              cost: "~50-80 EUR/pessoa",
            },
            {
              time: "Tarde",
              icon: "mountain-snow",
              title: "Berna → Interlaken Ost",
              description: "~50 min (Swiss Pass). Check-in. Lagos.",
            },
            {
              time: "Noite",
              icon: "utensils",
              title: "Fondue/raclette",
              description: "Pernoite Interlaken.",
            },
          ],
        },
        {
          date: "30/set",
          weekday: "Quarta",
          dayNumber: 10,
          title: "Lauterbrunnen + Mürren",
          activities: [
            {
              time: "Manhã",
              icon: "droplets",
              title: "Lauterbrunnen",
              description:
                "Trem ~20 min. Vale das 72 Cachoeiras! Staubbach Falls 300m. Trümmelbach Falls.",
              cost: "Trümmelbach ~11 CHF/pessoa",
            },
            {
              time: "Tarde",
              icon: "mountain-snow",
              title: "Teleférico → Mürren",
              description:
                "Vilarejo sem carros. Vista: Eiger, Mönch, Jungfrau. Trilhas e fotos.",
            },
          ],
        },
        {
          date: "01/out",
          weekday: "Quinta",
          dayNumber: 11,
          title: "Jungfraujoch Top of Europe",
          activities: [
            {
              time: "Manhã (7h!)",
              icon: "snowflake",
              title: "Jungfraujoch 'Top of Europe' 3.454m",
              description:
                "Glaciar Aletsch, Palácio de Gelo, Esfinge 360°. Parta 7h!",
              cost: "~105 CHF/pessoa (Swiss Pass 50%) = ~420 CHF total",
              tip: "Reserve antecipado no site oficial!",
            },
            {
              time: "Tarde",
              icon: "wind",
              title: "Grindelwald ou Paragliding",
              description: "Paragliding tandem opcional.",
              cost: "Paragliding ~180 CHF/pessoa",
            },
            {
              time: "Noite",
              icon: "sunset",
              title: "Harder Kulm ao entardecer",
              description: "Vista dos lagos e Alpes.",
            },
          ],
        },
        {
          date: "02/out",
          weekday: "Sexta",
          dayNumber: 12,
          title: "Trem cênico → Lucerna → Milão",
          activities: [
            {
              time: "Manhã",
              icon: "train-front",
              title: "Interlaken-Lucerna Express",
              description: "~2h. 5 lagos! Sente do lado direito. Swiss Pass.",
            },
            {
              time: "Meio-dia",
              icon: "building-2",
              title: "Lucerna (~2-3h)",
              description:
                "Lockers na estação. Kapellbrücke, cidade velha, Leão, Lago.",
            },
            {
              time: "Tarde",
              icon: "train-front",
              title: "Lucerna → Milano Centrale",
              description: "~3h (Gotthard). Chegada ~16-17h.",
            },
            {
              time: "Noite",
              icon: "utensils",
              title: "Risotto alla milanese!",
              description: "Aperitivo nos Navigli.",
            },
          ],
        },
      ],
    },
    {
      id: "italia",
      name: "Itália",
      country: "Itália",
      flag: "🇮🇹",
      countryCode: "IT",
      icon: "✠",
      dates: "03-08/out",
      nights: 6,
      color: "#27ae60",
      colorBg: "bg-green-950/30",
      colorBorder: "border-green-500/30",
      colorText: "text-green-400",
      transport: "Trem via Lucerna",
      heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80",
      days: [
        {
          date: "03/out",
          weekday: "Sábado",
          dayNumber: 13,
          title: "Milão Completa",
          activities: [
            {
              time: "Manhã",
              icon: "church",
              title: "Duomo di Milano",
              description: "Terraço com vista dos Alpes.",
              cost: "~14-17 EUR/pessoa",
            },
            {
              time: "Tarde",
              icon: "palette",
              title: "Galleria + Última Ceia",
              description:
                "Galleria Vittorio Emanuele II. Última Ceia de Da Vinci. Brera.",
              cost: "Última Ceia ~15 EUR/pessoa",
              tip: "Reserve meses antes!",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Navigli",
              description: "Canais e restaurantes.",
            },
          ],
        },
        {
          date: "04/out",
          weekday: "Domingo",
          dayNumber: 14,
          title: "Trem → Florença",
          activities: [
            {
              time: "Manhã",
              icon: "train-front",
              title: "Italo Treno Milão-Florença",
              description: "~2h.",
              cost: "~25 EUR/pessoa (1ª classe)",
            },
            {
              time: "Tarde",
              icon: "landmark",
              title: "Centro de Florença",
              description:
                "Piazza della Signoria, Palazzo Vecchio, Ponte Vecchio. Gelato!",
            },
            {
              time: "Noite",
              icon: "utensils-crossed",
              title: "Bistecca alla fiorentina",
              description: "Chianti em Santo Spirito!",
            },
          ],
        },
        {
          date: "05/out",
          weekday: "Segunda",
          dayNumber: 15,
          title: "Florença Renascimento",
          activities: [
            {
              time: "Manhã",
              icon: "palette",
              title: "Uffizi",
              description: "Botticelli, Leonardo, Michelangelo. 3h. Antecipado!",
              cost: "~20-25 EUR/pessoa",
            },
            {
              time: "Tarde",
              icon: "church",
              title: "Cúpula de Brunelleschi",
              description: "463 degraus. Vista 360°. Campanário de Giotto.",
              cost: "~30 EUR/pessoa combo",
            },
            {
              time: "Noite",
              icon: "sunset",
              title: "Piazzale Michelangelo ao pôr do sol",
              description: "Oltrarno.",
            },
          ],
        },
        {
          date: "06/out",
          weekday: "Terça",
          dayNumber: 16,
          title: "Florença + Trem Roma",
          activities: [
            {
              time: "Manhã",
              icon: "palette",
              title: "Accademia — David!",
              description: "San Lorenzo. Mercato Centrale.",
              cost: "~16 EUR/pessoa",
            },
            {
              time: "Tarde",
              icon: "train-front",
              title: "Trem Florença → Roma",
              description: "~1h30.",
              cost: "~25-50 EUR/pessoa",
            },
            {
              time: "Noite",
              icon: "droplets",
              title: "Fontana di Trevi iluminada",
              description: "Piazza di Spagna. Gelato!",
            },
          ],
        },
        {
          date: "07/out",
          weekday: "Quarta",
          dayNumber: 17,
          title: "Roma Antiga",
          activities: [
            {
              time: "Manhã",
              icon: "landmark",
              title: "Coliseu + Foro + Palatino",
              description: "3-4h.",
              cost: "~18 EUR/pessoa × 4 = 72 EUR",
            },
            {
              time: "Tarde",
              icon: "landmark",
              title: "Panteão + Praças",
              description:
                "Panteão (grátis). Piazza Navona. Spagna ao entardecer.",
            },
            {
              time: "Noite",
              icon: "utensils",
              title: "Trastevere!",
              description: "Cacio e pepe, carbonara, amatriciana.",
            },
          ],
        },
        {
          date: "08/out",
          weekday: "Quinta",
          dayNumber: 18,
          title: "Vaticano",
          activities: [
            {
              time: "Manhã (8h)",
              icon: "church",
              title: "Vaticano + Capela Sistina",
              description: "Chegue 8h. Basílica (grátis).",
              cost: "~17 EUR/pessoa × 4 = 68 EUR",
            },
            {
              time: "Tarde",
              icon: "castle",
              title: "Cúpula + Castel Sant'Angelo",
              description: "Cúpula da Basílica.",
              cost: "Cúpula ~8 EUR/pessoa",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Último jantar romano!",
              description: "Monumentos iluminados. Último gelato!",
            },
          ],
        },
      ],
    },
    {
      id: "londres",
      name: "Londres",
      country: "Inglaterra",
      flag: "🇬🇧",
      countryCode: "GB",
      icon: "♛",
      dates: "09-12/out",
      nights: 4,
      color: "#8e44ad",
      colorBg: "bg-purple-950/30",
      colorBorder: "border-purple-500/30",
      colorText: "text-purple-400",
      transport: "Voo FCO-LHR ~2h30",
      heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80",
      days: [
        {
          date: "09/out",
          weekday: "Sexta",
          dayNumber: 19,
          title: "Chegada + Westminster",
          activities: [
            {
              time: "Manhã",
              icon: "plane",
              title: "Chegada em Londres",
              description: "Big Ben, Parlamento.",
            },
            {
              time: "Manhã",
              icon: "church",
              title: "Abadia de Westminster",
              description: "",
              cost: "~29 GBP/pessoa",
            },
            {
              time: "Tarde",
              icon: "ferris-wheel",
              title: "London Eye + Tate Modern",
              description: "Tate Modern (grátis!). St Paul's.",
              cost: "London Eye ~30-37 GBP/pessoa",
            },
            {
              time: "Noite",
              icon: "beer",
              title: "Borough Market + Pub",
              description: "Fish & chips. Pub!",
            },
          ],
        },
        {
          date: "10/out",
          weekday: "Sábado",
          dayNumber: 20,
          title: "Realeza + Museus + Teatro",
          activities: [
            {
              time: "Manhã",
              icon: "crown",
              title: "Buckingham Palace",
              description: "Troca da guarda. Hyde Park.",
            },
            {
              time: "Tarde",
              icon: "palette",
              title: "British Museum + Natural History",
              description: "Ambos grátis!",
            },
            {
              time: "Noite",
              icon: "drama",
              title: "West End Musical!",
              description: "Covent Garden.",
              cost: "~30-80 GBP no TKTS",
            },
          ],
        },
        {
          date: "11/out",
          weekday: "Domingo",
          dayNumber: 21,
          title: "Tower + Mercados",
          activities: [
            {
              time: "Manhã",
              icon: "castle",
              title: "Tower of London + Tower Bridge",
              description: "",
              cost: "Tower ~33 GBP/pessoa. Bridge ~12 GBP",
            },
            {
              time: "Tarde",
              icon: "shopping-bag",
              title: "Shoreditch + Brick Lane",
              description: "Ou Notting Hill + Portobello.",
            },
            {
              time: "Noite",
              icon: "moon",
              title: "Camden ou Soho",
              description: "",
            },
          ],
        },
        {
          date: "12/out",
          weekday: "Segunda",
          dayNumber: 22,
          title: "Dia Livre + Despedida",
          activities: [
            {
              time: "Manhã",
              icon: "building-2",
              title: "Sky Garden (grátis!)",
              description: "Ou barco Greenwich, ou Kensington + Harrods.",
            },
            {
              time: "Tarde",
              icon: "shopping-bag",
              title: "Compras Oxford St",
              description: "Afternoon tea!",
              cost: "Afternoon tea ~30-50 GBP/pessoa",
            },
            {
              time: "Noite",
              icon: "beer",
              title: "Pub de despedida",
              description: "Arrume malas!",
            },
          ],
        },
      ],
    },
    {
      id: "madrid-volta",
      name: "Madrid (Folga)",
      country: "Espanha",
      flag: "🇪🇸",
      countryCode: "ES",
      icon: "☀",
      dates: "13/out",
      nights: 1,
      color: "#f39c12",
      colorBg: "bg-amber-950/30",
      colorBorder: "border-amber-500/30",
      colorText: "text-amber-400",
      transport: "Voo LHR-MAD ~2h",
      heroImage: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80",
      days: [
        {
          date: "13/out",
          weekday: "Terça",
          dayNumber: 23,
          title: "Dia Livre em Madrid",
          activities: [
            {
              time: "Manhã",
              icon: "flag",
              title: "Dia tranquilo em Madrid",
              description:
                "Malasaña, brunch, revisitar favoritos. Último dia na Europa!",
            },
            {
              time: "Tarde",
              icon: "shopping-bag",
              title: "Compras finais",
              description:
                "Jamón ibérico a vácuo, azeite, vinhos. El Corte Inglés. Chaveirinhos!",
              tip: "El Corte Inglés é boa opção para compras de última hora!",
            },
            {
              time: "Noite",
              icon: "heart",
              title: "Último jantar da Eurotrip!",
              description: "Tapas de despedida.",
            },
          ],
        },
      ],
    },
    {
      id: "brasil-volta",
      name: "Brasil (Chegada)",
      country: "Brasil",
      flag: "🇧🇷",
      countryCode: "BR",
      icon: "🏠",
      dates: "14/out",
      nights: 0,
      color: "#009c3b",
      colorBg: "bg-green-950/30",
      colorBorder: "border-green-500/30",
      colorText: "text-green-400",
      transport: "MAD → GRU → BSB",
      heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80",
      days: [
        {
          date: "14/out",
          weekday: "Quarta",
          dayNumber: 24,
          title: "Volta ao Brasil — Madrid → Guarulhos → Brasília",
          activities: [
            {
              time: "Manhã",
              icon: "shopping-bag",
              title: "Duty Free Aeroporto de Barajas",
              description:
                "Últimas compras antes de embarcar. 24 dias, 6 países, 8 cidades!",
            },
            {
              time: "Dia",
              icon: "plane",
              title: "Voo MAD → GRU (Iberia/Avios)",
              description:
                "Voo internacional Madrid → São Paulo Guarulhos. Despedida da Europa!",
            },
            {
              time: "Noite",
              icon: "clock",
              title: "Chegada em Guarulhos (GRU)",
              description:
                "Imigração, retirada de bagagem e conexão para voo doméstico.",
            },
            {
              time: "Noite",
              icon: "plane",
              title: "Voo GRU → BSB",
              description:
                "Último trecho! São Paulo Guarulhos → Brasília. De volta pra casa com memórias pra vida toda!",
            },
            {
              time: "Noite",
              icon: "home",
              title: "Chegada em Brasília!",
              description:
                "Fim da Eurotrip 2026! 🏠 De volta ao lar.",
            },
          ],
        },
      ],
    },
  ],
};

export interface BudgetItem {
  category: string;
  item: string;
  costPerPerson: string;
  totalCost: string;
  currency: string;
  city: string;
}

export const budgetItems: BudgetItem[] = [
  // Madrid
  { category: "Atração", item: "Palácio Real", costPerPerson: "14 EUR", totalCost: "56 EUR", currency: "EUR", city: "Madrid" },
  // Paris
  { category: "Museu", item: "Musée d'Orsay", costPerPerson: "16 EUR", totalCost: "64 EUR", currency: "EUR", city: "Paris" },
  { category: "Cruzeiro", item: "Cruzeiro Sena", costPerPerson: "15-18 EUR", totalCost: "60-72 EUR", currency: "EUR", city: "Paris" },
  { category: "Museu", item: "Louvre", costPerPerson: "22 EUR", totalCost: "88 EUR", currency: "EUR", city: "Paris" },
  { category: "Atração", item: "Disneyland Paris (tarde)", costPerPerson: "55-70 EUR", totalCost: "220-280 EUR", currency: "EUR", city: "Paris" },
  { category: "Atração", item: "Sainte-Chapelle", costPerPerson: "11 EUR", totalCost: "44 EUR", currency: "EUR", city: "Paris" },
  { category: "Atração", item: "Arco do Triunfo", costPerPerson: "13 EUR", totalCost: "52 EUR", currency: "EUR", city: "Paris" },
  { category: "Passe", item: "Paris Museum Pass (2 dias)", costPerPerson: "55 EUR", totalCost: "220 EUR", currency: "EUR", city: "Paris" },
  // Suíça
  { category: "Passe", item: "Swiss Travel Pass 4 dias", costPerPerson: "232 CHF", totalCost: "928 CHF", currency: "CHF", city: "Suíça" },
  { category: "Atração", item: "Trümmelbach Falls", costPerPerson: "11 CHF", totalCost: "44 CHF", currency: "CHF", city: "Suíça" },
  { category: "Atração", item: "Jungfraujoch", costPerPerson: "105 CHF", totalCost: "420 CHF", currency: "CHF", city: "Suíça" },
  { category: "Atividade", item: "Paragliding (opcional)", costPerPerson: "180 CHF", totalCost: "720 CHF", currency: "CHF", city: "Suíça" },
  // Itália
  { category: "Atração", item: "Duomo di Milano (terraço)", costPerPerson: "14-17 EUR", totalCost: "56-68 EUR", currency: "EUR", city: "Itália" },
  { category: "Atração", item: "Última Ceia", costPerPerson: "15 EUR", totalCost: "60 EUR", currency: "EUR", city: "Itália" },
  { category: "Trem", item: "Italo Milão-Florença", costPerPerson: "25 EUR", totalCost: "100 EUR", currency: "EUR", city: "Itália" },
  { category: "Museu", item: "Uffizi", costPerPerson: "20-25 EUR", totalCost: "80-100 EUR", currency: "EUR", city: "Itália" },
  { category: "Atração", item: "Cúpula Brunelleschi combo", costPerPerson: "30 EUR", totalCost: "120 EUR", currency: "EUR", city: "Itália" },
  { category: "Museu", item: "Accademia (David)", costPerPerson: "16 EUR", totalCost: "64 EUR", currency: "EUR", city: "Itália" },
  { category: "Trem", item: "Florença-Roma", costPerPerson: "25-50 EUR", totalCost: "100-200 EUR", currency: "EUR", city: "Itália" },
  { category: "Atração", item: "Coliseu + Foro + Palatino", costPerPerson: "18 EUR", totalCost: "72 EUR", currency: "EUR", city: "Itália" },
  { category: "Atração", item: "Vaticano + Sistina", costPerPerson: "17 EUR", totalCost: "68 EUR", currency: "EUR", city: "Itália" },
  { category: "Atração", item: "Cúpula Basílica", costPerPerson: "8 EUR", totalCost: "32 EUR", currency: "EUR", city: "Itália" },
  // Londres
  { category: "Atração", item: "Abadia de Westminster", costPerPerson: "29 GBP", totalCost: "116 GBP", currency: "GBP", city: "Londres" },
  { category: "Atração", item: "London Eye", costPerPerson: "30-37 GBP", totalCost: "120-148 GBP", currency: "GBP", city: "Londres" },
  { category: "Atração", item: "West End Musical", costPerPerson: "30-80 GBP", totalCost: "120-320 GBP", currency: "GBP", city: "Londres" },
  { category: "Atração", item: "Tower of London", costPerPerson: "33 GBP", totalCost: "132 GBP", currency: "GBP", city: "Londres" },
  { category: "Atração", item: "Tower Bridge", costPerPerson: "12 GBP", totalCost: "48 GBP", currency: "GBP", city: "Londres" },
  { category: "Experiência", item: "Afternoon tea", costPerPerson: "30-50 GBP", totalCost: "120-200 GBP", currency: "GBP", city: "Londres" },
];

export const checklist = [
  { id: "passaporte", label: "Passaportes válidos (6+ meses)", category: "Documentos" },
  { id: "seguro", label: "Seguro viagem Europa", category: "Documentos" },
  { id: "voo-bsb-gru", label: "Voo BSB → GRU (ida)", category: "Voos" },
  { id: "avios-ida", label: "Reservar voo IDA com Avios (125.000)", category: "Voos" },
  { id: "avios-volta", label: "Reservar voo VOLTA com Avios", category: "Voos" },
  { id: "voo-mad-cdg", label: "Voo Madrid → Paris", category: "Voos" },
  { id: "voo-fco-lhr", label: "Voo Roma → Londres", category: "Voos" },
  { id: "voo-lhr-mad", label: "Voo Londres → Madrid", category: "Voos" },
  { id: "voo-gru-bsb", label: "Voo GRU → BSB (volta)", category: "Voos" },
  { id: "hotel-madrid", label: "Hotel Madrid (2 noites)", category: "Hospedagem" },
  { id: "hotel-paris", label: "Hotel Paris (3 noites)", category: "Hospedagem" },
  { id: "hotel-interlaken", label: "Hotel Interlaken (4 noites)", category: "Hospedagem" },
  { id: "hotel-milao", label: "Hotel Milão (1 noite)", category: "Hospedagem" },
  { id: "hotel-florenca", label: "Hotel Florença (2 noites)", category: "Hospedagem" },
  { id: "hotel-roma", label: "Hotel Roma (3 noites)", category: "Hospedagem" },
  { id: "hotel-londres", label: "Hotel Londres (4 noites)", category: "Hospedagem" },
  { id: "hotel-madrid2", label: "Hotel Madrid volta (1 noite)", category: "Hospedagem" },
  { id: "tgv-paris-berna", label: "TGV Paris → Berna", category: "Trens" },
  { id: "trem-milao-florenca", label: "Italo Milão → Florença", category: "Trens" },
  { id: "trem-florenca-roma", label: "Trem Florença → Roma", category: "Trens" },
  { id: "swiss-pass", label: "Swiss Travel Pass 4 dias", category: "Passes" },
  { id: "paris-museum", label: "Paris Museum Pass 2 dias", category: "Passes" },
  { id: "oyster", label: "Oyster Card / Contactless Londres", category: "Passes" },
  { id: "prado", label: "Prado (grátis 18h-20h)", category: "Reservas" },
  { id: "louvre", label: "Louvre (ingresso antecipado)", category: "Reservas" },
  { id: "disney", label: "Disneyland Paris (ingresso tarde)", category: "Reservas" },
  { id: "jungfraujoch", label: "Jungfraujoch (site oficial)", category: "Reservas" },
  { id: "ultima-ceia", label: "Última Ceia de Da Vinci", category: "Reservas" },
  { id: "uffizi", label: "Uffizi (fecha segundas!)", category: "Reservas" },
  { id: "coliseu", label: "Coliseu + Foro + Palatino", category: "Reservas" },
  { id: "vaticano", label: "Vaticano + Sistina", category: "Reservas" },
  { id: "flamenco", label: "Flamenco Madrid", category: "Reservas" },
  { id: "westend", label: "Musical West End", category: "Reservas" },
];
