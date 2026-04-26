import React, { useEffect, useMemo, useState, useRef } from "react";
import Papa from "papaparse";

// ---- CONFIG ----
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoXmH3uHC7Ezw17NKLFWaVJzF2kRveW4xquJGGr3VYckc1lGqMOW62QeTyhCDiUPu4vYkxYTEInOXf/pub?output=csv";
const REFRESH_SECONDS = 60;

// Apartment Data
const APARTMENTS = [
  {
    id: "camion",
    key: "El camion",
    title_es: "El Camión",
    title_en: "El Camión",
    title_eu: "Kamioia",
    title_ca: "El Camió",
    img: "/images/camion0.jpg",
    photoCount: 3,
    short_es: "Un antiguo camión frigorifico que ha visto mucho mundo y terminó siendo una casita al lado del huerto y con una terraza acogedora. Txikitin, para dos personas",
    short_en: "An old refrigerated truck that has seen much of the world and ended up as a little house next to the orchard with a cozy terrace. Txikitin, for two people",
    short_eu: "Mundu asko ikusi duen kamioi frigorifiko zaharra, baratze ondoan eta terraza eroso batekin etxetxo bat bihurtuta. Txikitin, bi pertsonentzat.",
    short_ca: "Un antic camió frigorífic que ha vist molt món i ha acabat sent una caseta al costat de l'hort i amb una terrassa acollidora. Txikitin, per a dues persones.",
    long_es: `Un antiguo camión frigorifico que ha visto mucho mundo y terminó siendo una casita al lado del huerto y con una terraza acogedora. Txikitin, para dos personas`,
    long_en: `An old refrigerated truck that has seen much of the world and ended up as a little house next to the orchard with a cozy terrace. Txikitin, for two people`,
    long_eu: `Mundu asko ikusi duen kamioi frigorifiko zaharra, baratze ondoan eta terraza eroso batekin etxetxo bat bihurtuta. Txikitin, bi pertsonentzat.`,
    long_ca: `Un antic camió frigorífic que ha vist molt món i ha acabat sent una caseta al costat de l'hort i amb una terrassa acollidora. Txikitin, per a dues persones.`
  },
  {
    id: "apartamento",
    key: "El apartamento",
    title_es: "El Apartamento",
    title_en: "The Apartment",
    title_eu: "Apartamentua",
    title_ca: "L'Apartament",
    img: "/images/apartamento0.jpg",
    photoCount: 3,
    short_es: "Apartamento espacioso, con bonitas vistas al macizo central de Picos. Dos habitaciones y opción de buardilla para niños.",
    short_en: "Spacious apartment, with beautiful views of the central massif of Picos. Two bedrooms and option of an attic for children.",
    short_eu: "Apartamentu zabala, Europako Mendien erdiguneko bista ederrekin. Bi logela eta umeentzako ganbara aukera.",
    short_ca: "Apartament espaiós, amb maques vistes al massís central de Picos. Dues habitacions i opció de golfes per a nens.",
    long_es: `Apartamento espacioso, con bonitas vistas al macizo central de Picos. Dos habitaciones y opción de buardilla para niños.`,
    long_en: `Spacious apartment, with beautiful views of the central massif of Picos. Two bedrooms and option of an attic for children.`,
    long_eu: `Apartamentu zabala, Europako Mendien erdiguneko bista ederrekin. Bi logela eta umeentzako ganbara aukera.`,
    long_ca: `Apartament espaiós, amb maques vistes al massís central de Picos. Dues habitacions i opció de golfes per a nens.`
  },
  {
    id: "aula",
    key: "El aula",
    title_es: "El Aula",
    title_en: "The Classroom",
    title_eu: "Ikasgela",
    title_ca: "L'Aula",
    img: "/images/aula0.jpg",
    photoCount: 2,
    isUnavailable: true,
    short_es: "No disponible actualmente - en reformas.",
    short_en: "Currently unavailable - under renovation.",
    short_eu: "Une honetan ez dago erabilgarri - berritzen.",
    short_ca: "Actualment no disponible - en reformes.",
    long_es: `Este espacio está actualmente en proceso de renovación para ofrecerte una mejor experiencia muy pronto. Disculpa las molestias.`,
    long_en: `This space is currently undergoing renovations to provide a better experience soon. We apologize for the inconvenience.`,
    long_eu: `Espazio hau berritzen ari da laster esperientzia hobea eskaintzeko. Barkatu eragozpenak.`,
    long_ca: `Aquest espai està actualment en procés de renovació per oferir-te una millor experiència molt aviat. Disculpa les molèsties.`
  }
];

const ACTIVITIES = [
  {
    id: 'playa',
    title_es: 'El Mar y la Playa',
    title_en: 'Sea and Beach',
    title_eu: 'Itsasoa eta Hondartza',
    title_ca: 'El Mar i la Platja',
    desc_es: 'Snorkel, stand-up paddle y surf; pídenos consejo para saber dónde ir y cuándo.',
    desc_en: 'Snorkeling, stand-up paddle, and surfing; ask us for advice on where and when to go.',
    desc_eu: 'Snorkel, stand-up paddle eta surfa; eskatu iezaguzu aholkua nora eta noiz joan jakiteko.',
    desc_ca: "Snorkel, stand-up paddle i surf; demana'ns consell per saber on anar i quan.",
    companies: ['Escuela Asturiana de Surf', 'Llanes Surf & Aventura']
  },
  {
    id: 'montana',
    title_es: 'Montaña y Picos',
    title_en: 'Mountains and Peaks',
    title_eu: 'Mendiak eta Tontorrak',
    title_ca: 'Muntanya i Picos',
    desc_es: 'Paseos, trekking, escalada y bajada de cañones en plena naturaleza.',
    desc_en: 'Walking, trekking, climbing, and canyoning surrounded by nature.',
    desc_eu: 'Ibilaldiak, trekkinga, eskalada eta arroil jaitsiera naturaren erdian.',
    desc_ca: 'Passejades, trekking, escalada i baixada de canons en plena natura.',
    companies: ['Frontera Verde', 'Montañas del Norte']
  },
  {
    id: 'caballos',
    title_es: 'Paseos a Caballo',
    title_en: 'Horseback Riding',
    title_eu: 'Zaldi Ibilaldiak',
    title_ca: 'Passejades a Cavall',
    desc_es: 'Descubre los paisajes a caballo. Recomendamos especialmente a nuestros amigos de "El Bosque", gente maravillosa que organiza paseos por la zona.',
    desc_en: 'Discover the landscapes on horseback. We highly recommend our friends from "El Bosque", wonderful people who organize rides in the area.',
    desc_eu: 'Ezagutu paisaiak zaldiz. Bereziki gomendatzen ditugu "El Bosque"ko gure lagunak, inguruan ibilaldiak antolatzen dituen jende zoragarria.',
    desc_ca: 'Descobreix els paisatges a cavall. Recomanem especialment als nostres amics d\\"El Bosque\\", gent meravellosa que organitza passejades per la zona.',
    companies: ['El Bosque']
  },
  {
    id: 'rios',
    title_es: 'Ríos: Kayak y Rafting',
    title_en: 'Rivers: Kayak & Rafting',
    title_eu: 'Ibaiak: Kayaka eta Raftinga',
    title_ca: 'Rius: Caiac i Ràfting',
    desc_es: 'Bajada de ríos en kayak (Descenso del Sella o Deva) y emocionantes rutas de rafting.',
    desc_en: 'River descent in kayaks (Descenso del Sella or Deva) and thrilling rafting routes.',
    desc_eu: 'Ibai jaitsiera kayakez (Sella edo Deva jaitsiera) eta rafting ibilbide zirraragarriak.',
    desc_ca: 'Baixada de rius en caiac (Descens del Sella o Deva) i emocionants rutes de ràfting.',
    companies: ['K-2 Aventura', 'Los Cauces MultiAventura', 'Jaire Aventura']
  }
];

const TEXT = {
  es: {
    appTitle: "El Combral, mar y montaña.",
    home: "Inicio",
    activities: "Actividades",
    contact: "Contacto",
    howto: "Cómo llegar",
    checkAvailability: "Ver Disponibilidad",
    bookNow: "Reservar Ahora",
    night: "noche",
    nights: "noches",
    priceTotal: "Precio Total",
    selectDates: "Selecciona fechas para ver precio",
    guests: "Huéspedes",
    yourName: "Tu Nombre",
    sendWhatsApp: "Solicitar Reserva por WhatsApp",
    available: "Disponible",
    unavailable: "No disponible",
    loading: "Cargando disponibilidad...",
    description: "Descripción",
    gallery: "Galería",
    contactIntro: "Estamos aquí para ayudarte. Contáctanos por WhatsApp o correo.",
    send: "Enviar Mensaje",
    footer: "© 2026 El Combral, mar y montaña. Todos los derechos reservados.",
    underRenovation: "No disponible actualmente - en reformas"
  },
  en: {
    appTitle: "El Combral, sea and mountain.",
    home: "Home",
    activities: "Activities",
    contact: "Contact",
    howto: "Location",
    checkAvailability: "Check Availability",
    bookNow: "Book Now",
    night: "night",
    nights: "nights",
    priceTotal: "Total Price",
    selectDates: "Select dates to see price",
    guests: "Guests",
    yourName: "Your Name",
    sendWhatsApp: "Request Booking via WhatsApp",
    available: "Available",
    unavailable: "Unavailable",
    loading: "Loading availability...",
    description: "Description",
    gallery: "Gallery",
    contactIntro: "We are here to help. Contact us via WhatsApp or email.",
    send: "Send Message",
    footer: "© 2026 El Combral, sea and mountain. All rights reserved.",
    underRenovation: "Currently unavailable - under renovation"
  },
  eu: {
    appTitle: "El Combral, itsasoa eta mendia.",
    home: "Hasiera",
    activities: "Jarduerak",
    contact: "Harremanetarako",
    howto: "Nola iritsi",
    checkAvailability: "Erabilgarritasuna",
    bookNow: "Orain Erreserbatu",
    night: "gau",
    nights: "gauak",
    priceTotal: "Prezio Osoa",
    selectDates: "Hautatu datak",
    guests: "Haur/Heldu",
    yourName: "Zure Izena",
    sendWhatsApp: "Erreserba WhatsApp bidez eskatu",
    available: "Eskuragarri",
    unavailable: "Ez eskuragarri",
    loading: "Erabilgarritasuna kargatzen...",
    description: "Deskribapena",
    gallery: "Galeria",
    contactIntro: "Laguntzeko gaude. Jarri gurekin harremanetan WhatsApp edo posta elektronikoz.",
    send: "Mezua Bidali",
    footer: "© 2026 El Combral, itsasoa eta mendia. Eskubide guztiak erreserbatuta.",
    underRenovation: "Ez eskuragarri - berritzen"
  },
  ca: {
    appTitle: "El Combral, mar i muntanya.",
    home: "Inici",
    activities: "Activitats",
    contact: "Contacte",
    howto: "Com arribar",
    checkAvailability: "Veure Disponibilitat",
    bookNow: "Reservar Ara",
    night: "nit",
    nights: "nits",
    priceTotal: "Preu Total",
    selectDates: "Selecciona dates",
    guests: "Hostes",
    yourName: "El Teu Nom",
    sendWhatsApp: "Sol·licitar Reserva per WhatsApp",
    available: "Disponible",
    unavailable: "No disponible",
    loading: "Carregant disponibilitat...",
    description: "Descripció",
    gallery: "Galeria",
    contactIntro: "Som aquí per ajudar-te. Contacta'ns per WhatsApp o correu.",
    send: "Enviar Missatge",
    footer: "© 2026 El Combral, mar i muntanya. Tots els drets reservats.",
    underRenovation: "No disponible actualment - en reformes"
  }
};

// ---- UTILS ----
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function dateRange(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  const arr = [];
  for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) arr.push(formatDate(new Date(d)));
  return arr;
}

function buildImagesForApartment(apartment) {
  const imgs = [];
  for (let i = 0; i < (apartment.photoCount || 0); i++) imgs.push(`/images/${apartment.id}${i}.jpg`);
  return imgs;
}

// ---- APP COMPONENT ----
export default function AppRent() {
  const [lang, setLang] = useState('es');
  const t = TEXT[lang];
  const [tab, setTab] = useState('home');
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch Data (Google Sheets via PapaParse)
  useEffect(() => {
    function fetchData() {
      Papa.parse(`${SHEET_CSV_URL}&_t=${Date.now()}`, {
        download: true,
        header: true,
        complete: (results) => {
          setSheetData(results.data);
          setLoading(false);
        },
        error: (err) => {
          console.error("Error fetching data", err);
          setLoading(false);
        }
      });
    }
    fetchData();
    const interval = setInterval(fetchData, REFRESH_SECONDS * 1000);
    return () => clearInterval(interval);
  }, []);

  // Use availability map
  const availability = useMemo(() => {
    const map = {};
    APARTMENTS.forEach(a => map[a.key] = {});
    sheetData.forEach(row => {
      if (!row.apartment || !row.date) return;
      const aptKey = String(row.apartment).trim();
      const rowDate = String(row.date).trim();
      
      if (map[aptKey]) {
        const price = parseFloat(row.price);
        let available = false;
        if (row.available) {
          const val = String(row.available).trim().toUpperCase();
          available = val === 'TRUE';
        }

        map[aptKey][rowDate] = {
          price: isNaN(price) ? null : price,
          available: available
        };
      }
    });
    return map;
  }, [sheetData]);

  const CurrentView = () => {
    if (selectedApt) return <ApartmentDetail apartmentId={selectedApt} lang={lang} t={t} availability={availability[APARTMENTS.find(a => a.id === selectedApt)?.key]} onClose={() => setSelectedApt(null)} />;
    if (tab === 'activities') return <Activities lang={lang} t={t} />;
    if (tab === 'contact') return <Contact lang={lang} t={t} />;
    if (tab === 'howto') return <HowTo lang={lang} t={t} />;
    return <Home lang={lang} t={t} availability={availability} onSelect={setSelectedApt} loading={loading} />;
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-blue-900 cursor-pointer" onClick={() => { setTab('home'); setSelectedApt(null); }}>
            {t.appTitle}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {['home', 'activities', 'contact', 'howto'].map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setSelectedApt(null); }}
                className={`transition-colors hover:text-blue-600 ${tab === key && !selectedApt ? 'text-blue-600' : 'text-slate-600'}`}
              >
                {t[key]}
              </button>
            ))}
            <div className="ml-4 flex items-center gap-3">
              <button onClick={() => setLang('es')} className={`text-xl transition-transform ${lang === 'es' ? 'scale-125 opacity-100 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} title="Español">🇪🇸</button>
              <button onClick={() => setLang('en')} className={`text-xl transition-transform ${lang === 'en' ? 'scale-125 opacity-100 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110'}`} title="English">🇬🇧</button>
              <button onClick={() => setLang('eu')} className={`text-xl font-bold transition-transform ${lang === 'eu' ? 'scale-125 opacity-100 text-red-600 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110 text-slate-400'}`} title="Euskera">EU</button>
              <button onClick={() => setLang('ca')} className={`text-xl font-bold transition-transform ${lang === 'ca' ? 'scale-125 opacity-100 text-yellow-500 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110 text-slate-400'}`} title="Català">CA</button>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b absolute w-full px-6 py-4 flex flex-col gap-4 shadow-lg animate-fade-in">
            {['home', 'activities', 'contact', 'howto'].map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setSelectedApt(null); setMobileMenuOpen(false); }}
                className={`text-left text-lg font-medium ${tab === key ? 'text-blue-600' : 'text-slate-600'}`}
              >
                {t[key]}
              </button>
            ))}
            <div className="flex items-center gap-6 pt-2 mt-2 border-t border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Idioma:</span>
              <button onClick={() => { setLang('es'); setMobileMenuOpen(false); }} className={`text-2xl transition-transform ${lang === 'es' ? 'scale-110 opacity-100' : 'opacity-50'}`}>🇪🇸</button>
              <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={`text-2xl transition-transform ${lang === 'en' ? 'scale-110 opacity-100' : 'opacity-50'}`}>🇬🇧</button>
              <button onClick={() => { setLang('eu'); setMobileMenuOpen(false); }} className={`text-2xl font-bold transition-transform ${lang === 'eu' ? 'scale-110 opacity-100 text-red-600' : 'opacity-50 text-slate-400'}`}>EU</button>
              <button onClick={() => { setLang('ca'); setMobileMenuOpen(false); }} className={`text-2xl font-bold transition-transform ${lang === 'ca' ? 'scale-110 opacity-100 text-yellow-500' : 'opacity-50 text-slate-400'}`}>CA</button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-16">
        <CurrentView />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="max-w-6xl mx-auto px-6">
          <p>{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

// ---- SUB-COMPONENTS ----

function Home({ lang, t, onSelect, loading }) {
  const [photoIndices, setPhotoIndices] = useState(() => {
    const indices = {};
    APARTMENTS.forEach(apt => indices[apt.id] = 0);
    return indices;
  });

  const nextPhoto = (id, count, e) => {
    e.stopPropagation();
    setPhotoIndices(prev => ({ ...prev, [id]: (prev[id] + 1) % count }));
  };

  const prevPhoto = (id, count, e) => {
    e.stopPropagation();
    setPhotoIndices(prev => ({ ...prev, [id]: (prev[id] - 1 + count) % count }));
  };

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img src="/images/imagenfondo.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite] transform transition-transform duration-[20s] hover:scale-110" style={{ animation: 'none' }} />
        <div className="relative z-20 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-shadow-lg leading-tight">
            {t.appTitle}
          </h1>
        </div>
      </section>

      {/* LISTING */}
      <section id="apartments" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-slate-800">{t.home}</h2>
          {loading && <span className="text-sm text-blue-600 animate-pulse">{t.loading}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {APARTMENTS.map((apt, idx) => {
            const images = buildImagesForApartment(apt);
            const currentIdx = photoIndices[apt.id];
            return (
              <div key={apt.id} onClick={() => !apt.isUnavailable && onSelect(apt.id)} className={`group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${idx === 1 ? 'delay-100' : idx === 2 ? 'delay-200' : ''}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={images[currentIdx] || apt.img} alt={apt.title_es} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* Carousel Arrows on Home Card */}
                  {apt.photoCount > 1 && (
                    <>
                      <button onClick={(e) => prevPhoto(apt.id, apt.photoCount, e)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 p-3 rounded-full transition-colors z-30 cursor-pointer shadow-md">
                        <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={(e) => nextPhoto(apt.id, apt.photoCount, e)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 p-3 rounded-full transition-colors z-30 cursor-pointer shadow-md">
                        <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}

                  {apt.isUnavailable && (
                    <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4 text-center">
                      <span className="text-white font-bold text-lg">{t.underRenovation}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 pointer-events-none"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{apt['title_' + lang]}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {apt['short_' + lang]}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <span>{apt.photoCount} Photos</span>
                    {!apt.isUnavailable && (
                      <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => onSelect(apt.id)}>{t.checkAvailability} &rarr;</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ApartmentDetail({ apartmentId, lang, t, availability, onClose }) {
  const apt = APARTMENTS.find(a => a.id === apartmentId);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [calendarBase, setCalendarBase] = useState(() => new Date()); // Start at current month
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!apt) return null;

  // Pricing
  const calcTotal = () => {
    if (!start || !end) return null;
    const days = dateRange(start, end);
    let total = 0;
    for (let d of days) {
      const info = availability?.[d];
      if (!info || info.price === null) return null;
      total += info.price;
    }
    return total;
  };

  const totalPrice = calcTotal();
  const validDates = start && end && totalPrice !== null;

  const handleWhatsApp = () => {
    if (!validDates) return;
    const msg = `${lang === 'es' ? 'Hola, quiero reservar' : 'Hello, I want to book'}:
*${apt['title_' + lang]}*
${lang === 'es' ? 'Fechas' : 'Dates'}: ${start} -> ${end}
${t.guests}: ${guests}
${lang === 'es' ? 'Nombre' : 'Name'}: ${name}
${t.priceTotal}: ${totalPrice}€`;
    window.open(`https://wa.me/34611044315?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleContactFirst = () => {
    const msg = `${lang === 'es' ? 'Hola, tengo una duda antes de reservar' : 'Hello, I have a question before booking'}: *${apt['title_' + lang]}*`;
    window.open(`https://wa.me/34611044315?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Gallery
  const images = buildImagesForApartment(apt);

  const nextImg = () => setActiveImgIndex(prev => (prev + 1) % images.length);
  const prevImg = () => setActiveImgIndex(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-6 py-8">
      <button onClick={onClose} className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition">
        &larr; <span className="ml-2 font-medium">{t.home}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Info & Gallery */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{apt['title_' + lang]}</h1>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">{apt['long_' + lang]}</p>

          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-md aspect-video group">
              <img src={images[activeImgIndex] || apt.img} alt="Gallery view" className="w-full h-full object-cover transition-transform duration-500" />

              {/* Navigation arrows in Detail Gallery */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`cursor-pointer rounded-lg overflow-hidden aspect-square shadow-sm border-2 transition-all ${activeImgIndex === i ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img src={src} className="w-full h-full object-cover hover:scale-110 transition duration-500" alt={`Thumbnail ${i}`} />
                </div>
              ))}
              {/* Fallback to show at least placeholders if low count */}
              {[...Array(Math.max(0, 4 - images.length))].map((_, i) => (
                <div key={'p' + i} className="bg-slate-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Booking Card */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-24 border border-slate-100">
            {apt.isUnavailable ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full text-red-600 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">{t.underRenovation}</h2>
                <p className="text-slate-500">{lang === 'es' ? 'Por favor vuelve pronto.' : 'Please come back soon.'}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">{t.bookNow}</h2>

                {/* Calendar Controls */}
                <div className="flex justify-between items-center mb-4 bg-slate-50 p-2 rounded-lg">
                  <button onClick={() => setCalendarBase(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="p-1 hover:bg-white rounded shadow-sm">◀</button>
                  <div className="font-semibold text-slate-700">{calendarBase.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })}</div>
                  <button onClick={() => setCalendarBase(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="p-1 hover:bg-white rounded shadow-sm">▶</button>
                </div>

                {/* Calendar Grid */}
                <div className="mb-6">
                  <CalendarMonth
                    baseDate={calendarBase}
                    availability={availability}
                    start={start}
                    end={end}
                    onSelect={(d) => {
                      if (start && end) { setStart(d); setEnd(''); }
                      else if (start && d >= start) setEnd(d);
                      else setStart(d);
                    }}
                  />
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-bold text-slate-500 uppercase">{t.night}s</label>
                      <div className="text-sm font-medium">{start || '-'} &rarr; {end || '-'}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-bold text-slate-500 uppercase">{t.guests}</label>
                      <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium" />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase">{t.yourName}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium p-1" />
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{t.priceTotal}</span>
                    <span className="text-2xl font-bold text-blue-900">{validDates ? `${totalPrice}€` : '—'}</span>
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    disabled={!validDates}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${validDates ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    {t.sendWhatsApp}
                  </button>
                  <button
                    onClick={handleContactFirst}
                    className="w-full py-3 mt-3 rounded-xl font-bold text-md border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {lang === 'es' ? 'Consultar antes de reservar' : 'Ask before booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarMonth({ baseDate, availability, start, end, onSelect }) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0-6

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  return (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="font-bold text-slate-400 py-1">{d}</div>)}
      {days.map((d, i) => {
        if (!d) return <div key={i}></div>;
        const key = formatDate(d);
        const info = availability?.[key];
        const price = info?.price;
        const isAvail = info?.available;
        const isSelected = (start === key || end === key);
        const inRange = (start && end && key > start && key < end);

        let bg = 'bg-slate-50 text-slate-300'; // Default unavailable/unknown
        if (isAvail) {
          bg = 'bg-green-50 text-green-700 hover:bg-green-100'; // Available
        }
        if (inRange) bg = 'bg-blue-100 text-blue-800';
        if (isSelected) bg = 'bg-blue-600 text-white shadow-md transform scale-105 z-10';

        return (
          <button
            key={i}
            disabled={!isAvail}
            onClick={() => onSelect(key)}
            className={`p-1 h-10 rounded flex flex-col items-center justify-center transition-all ${bg}`}
          >
            <span className="font-bold">{d.getDate()}</span>
            {isAvail && !isSelected && !inRange && <span className="text-[9px] opacity-80">{price}€</span>}
          </button>
        )
      })}
    </div>
  );
}

function Activities({ lang, t }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-light mb-12 text-slate-800 tracking-tight border-b pb-4">{t.activities}</h2>
      <div className="space-y-12">
        {ACTIVITIES.map((a, i) => (
          <div key={a.id} className="flex flex-col md:flex-row gap-4 md:gap-12 group">
            <div className="md:w-1/3">
              <h3 className="text-2xl font-semibold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                {a['title_' + lang]}
              </h3>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-slate-600 font-light mb-4 leading-relaxed">
                {a['desc_' + lang]}
              </p>
              {a.companies && a.companies.length > 0 && (
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="block mb-2">{lang === 'es' ? 'Empresas recomendadas:' : lang === 'ca' ? 'Empreses recomanades:' : lang === 'eu' ? 'Gomendatutako enpresak:' : 'Recommended companies:'}</span>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {a.companies.map(c => (
                      <li key={c} className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                        &rarr; {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contact({ lang, t }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center">{t.contact}</h2>
      <p className="text-center text-slate-600 mb-8">{t.contactIntro}</p>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{lang === 'es' ? 'WhatsApp / Teléfono' : lang === 'ca' ? 'WhatsApp / Telèfon' : lang === 'eu' ? 'WhatsApp / Telefonoa' : 'WhatsApp / Phone'}</label>
            <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{lang === 'es' ? 'Mensaje' : lang === 'ca' ? 'Missatge' : lang === 'eu' ? 'Mezua' : 'Message'}</label>
            <textarea className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition h-32"></textarea>
          </div>
          <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">{t.send}</button>
        </div>
      </div>
    </div>
  );
}

function HowTo({ lang, t }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">{t.howto}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-xl mb-4 text-slate-800">🚗 {lang === 'es' ? 'Acceso en vehículo propio' : lang === 'ca' ? 'Accés amb vehicle propi' : lang === 'eu' ? 'Sarbidea ibilgailu propioarekin' : 'Access by private vehicle'}</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              {lang === 'es' 
  ? 'Solo se puede llegar en vehículo propio. Salir de la A-8 en la estación de servicio "Aldea de Bricia", pasar Posada de Llanes en dirección a Picos de Europa, y pasado Vibaño seguir las indicaciones del Hotel Montaña Mágica. En la subida, tras dejar la primera casa (no cuadra) a mano izquierda, hay que coger un pequeño camino a mano derecha para acceder al barrio de "El Combral". Estamos trabajando en mejorar el acceso, pero por el momento el estado de este camino no es muy bueno y es estrecho.'
  : lang === 'ca'
  ? 'Només es pot arribar amb vehicle propi. Sortir de la A-8 a l\\'estació de servei "Aldea de Bricia", passar Posada de Llanes en direcció a Picos de Europa, i passat Vibaño seguir les indicacions de l\\'Hotel Montaña Mágica. A la pujada, després de deixar la primera casa (no quadra) a mà esquerra, cal agafar un petit camí a mà dreta per accedir al barri de "El Combral". Estem treballant per millorar l\\'accés, però de moment l\\'estat d\\'aquest camí no és gaire bo i és estret.'
  : lang === 'eu'
  ? 'Ibilgailu propioarekin bakarrik irits daiteke. A-8tik irten "Aldea de Bricia" zerbitzugunean, Posada de Llanes igaro Europako Mendietarantz, eta Vibaño igarota Hotel Montaña Mágica-ren seinaleak jarraitu. Igoeran, ezkerrean dagoen lehen etxea (ez ukuilua) pasatu ondoren, eskuinera doan bide txiki bat hartu behar da "El Combral" auzora sartzeko. Sarbidea hobetzen ari gara, baina oraingoz bide horren egoera ez da oso ona eta estua da.'
  : 'Access is only possible by private vehicle. Exit the A-8 at the "Aldea de Bricia" service station, pass Posada de Llanes towards Picos de Europa, and after Vibaño follow the signs for Hotel Montaña Mágica. On the way up, after passing the first house on the left, take a small path to the right to access the "El Combral" neighborhood. We are working on improving the access, but currently, the condition of this path is not very good and it is narrow.'}
            </p>
            <a href="https://maps.app.goo.gl/XstKfGvLaXM4cpyM8" target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {lang === 'es' ? 'Abrir ubicación exacta en Google Maps' : lang === 'ca' ? 'Obrir ubicació exacta a Google Maps' : lang === 'eu' ? 'Ireki kokapen zehatza Google Maps-en' : 'Open exact location on Google Maps'}
            </a>
          </div>
        </div>
        <div className="bg-slate-200 rounded-xl overflow-hidden min-h-[300px] md:h-auto relative shadow-sm border border-slate-100">
          <iframe 
            src="https://maps.google.com/maps?q=Hotel+Montaña+Magica,+Llanes&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            className="absolute inset-0 w-full h-full"
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            aria-hidden="false" 
            tabIndex="0">
          </iframe>
        </div>
      </div>
    </div>
  );
}
