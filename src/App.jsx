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
    img: "/images/camion0.jpg",
    photoCount: 3,
    short_es: "Cabaña de cedro y cristal entre montaña y mar.",
    short_en: "Cedar and glass cabin between mountain and sea.",
    long_es: `Situada en un acantilado, esta pequeña cabaña de cedro y cristal equilibra la montaña y el mar. Picos de granito se alzan detrás; el océano se extiende delante. Dentro, esperan una acogedora estufa de leña y una cama alta. Explora senderos de montaña y pozas de marea.`,
    long_en: `Nestled on a bluff, this cedar and glass tiny lodge balances the mountains and sea. Granite peaks rise behind it; the ocean stretches before it. Inside, a cozy wood stove and loft bed await.`
  },
  {
    id: "apartamento",
    key: "El apartamento",
    title_es: "El Apartamento",
    title_en: "The Apartment",
    img: "/images/apartamento0.jpg",
    photoCount: 3,
    short_es: "Céntrico, luminoso y con todas las comodidades.",
    short_en: "Central, bright, and fully equipped.",
    long_es: `Apartamento céntrico, luminoso y con todas las comodidades para estancias urbanas. Espacio para 4 personas, cocina completa y transporte cercano. Ideal para disfrutar de la ciudad con total confort.`,
    long_en: `Central, bright apartment with all comforts for urban stays. Space for 4 guests, full kitchen and nearby transport. Ideal for enjoying the city in total comfort.`
  },
  {
    id: "aula",
    key: "El aula",
    title_es: "El Aula",
    title_en: "The Classroom",
    img: "/images/aula0.jpg",
    photoCount: 2,
    isUnavailable: true,
    short_es: "No disponible actualmente - en reformas.",
    short_en: "Currently unavailable - under renovation.",
    long_es: `Este espacio está actualmente en proceso de renovación para ofrecerte una mejor experiencia muy pronto. Disculpa las molestias.`,
    long_en: `This space is currently undergoing renovations to provide a better experience soon. We apologize for the inconvenience.`
  },
];

const CARS = [
  {
    id: "corolla",
    key: "Toyota Corolla",
    title_es: "Toyota Corolla Económico",
    title_en: "Budget Toyota Corolla",
    img: "/images/corolla0.jpg",
    photoCount: 3,
    short_es: "Toyota Corolla antiguo, fiable y sin preocupaciones.",
    short_en: "Old, reliable Toyota Corolla, worry-free rental.",
    long_es: `Un Toyota Corolla clásico que nunca falla. Es ideal para quienes buscan algo económico y funcional. No te preocupes por pequeños arañazos o daños cosméticos; este coche está hecho para disfrutar de la isla sin estrés.`,
    long_en: `A classic Toyota Corolla that never fails. Ideal for those looking for something budget-friendly and functional. Don't worry about minor scratches or cosmetic damage; this car is meant for enjoying the island stress-free.`
  }
];

const ACTIVITIES = [
  { id: 'surf', title_es: 'Clases de surf', title_en: 'Surf lessons', desc_es: 'Aprende a surfear en las mejores playas de la zona.', desc_en: 'Learn to surf at the best local beaches.' },
  { id: 'kayak', title_es: 'Rutas en Kayak', title_en: 'Kayak Tours', desc_es: 'Descubre la costa desde el mar con guías expertos.', desc_en: 'Discover the coast from the sea with expert guides.' },
  { id: 'gastronomia', title_es: 'Gastronomía Local', title_en: 'Local Gastronomy', desc_es: 'Disfruta de los sabores auténticos de la región.', desc_en: 'Enjoy the authentic flavors of the region.' },
];

const TEXT = {
  es: {
    appTitle: "Apartamentos Rental",
    home: "Inicio",
    activities: "Actividades",
    contact: "Contacto",
    howto: "Cómo llegar",
    car: "Alquiler de Coche",
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
    footer: "© 2026 Apartamentos Rental. Todos los derechos reservados.",
    underRenovation: "No disponible actualmente - en reformas"
  },
  en: {
    appTitle: "Apartment Rentals",
    home: "Home",
    activities: "Activities",
    contact: "Contact",
    howto: "Location",
    car: "Rental Car",
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
    footer: "© 2026 Apartment Rentals. All rights reserved.",
    underRenovation: "Currently unavailable - under renovation"
  }
};

// ---- UTILS ----
function formatDate(d) {
  return d.toISOString().split('T')[0];
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
      Papa.parse(SHEET_CSV_URL, {
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
    CARS.forEach(c => map[c.key] = {});
    sheetData.forEach(row => {
      // row: date, apartment, price, available
      const aptKey = row.apartment;
      if (map[aptKey]) {
        const price = parseFloat(row.price);
        map[aptKey][row.date] = {
          price: isNaN(price) ? null : price,
          available: row.available === 'true' || row.available === 'TRUE' || row.available === true
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
    if (tab === 'car') {
      const corolla = CARS[0];
      return (
        <div className="animate-fade-in">
          <ApartmentDetail 
            apartmentId={corolla.id} 
            lang={lang} 
            t={t} 
            availability={availability[corolla.key]} 
            onClose={() => setTab('home')} 
            isCar={true}
          />
        </div>
      );
    }
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
            {['home', 'car', 'activities', 'contact', 'howto'].map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setSelectedApt(null); }}
                className={`transition-colors hover:text-blue-600 ${tab === key && !selectedApt ? 'text-blue-600' : 'text-slate-600'}`}
              >
                {t[key]}
              </button>
            ))}
            <button onClick={() => setLang(l => l === 'es' ? 'en' : 'es')} className="ml-4 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold transition">
              {lang.toUpperCase()}
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b absolute w-full px-6 py-4 flex flex-col gap-4 shadow-lg animate-fade-in">
            {['home', 'car', 'activities', 'contact', 'howto'].map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setSelectedApt(null); setMobileMenuOpen(false); }}
                className={`text-left text-lg font-medium ${tab === key ? 'text-blue-600' : 'text-slate-600'}`}
              >
                {t[key]}
              </button>
            ))}
            <button onClick={() => { setLang(l => l === 'es' ? 'en' : 'es'); setMobileMenuOpen(false); }} className="text-left text-sm font-bold text-slate-500">
              Cambiar indiona / Switch Language ({lang.toUpperCase()})
            </button>
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg leading-tight">
            {lang === 'es' ? 'Escápate a la Naturaleza' : 'Escape to Nature'}
          </h1>
          <p className="text-lg md:text-xl font-light text-shadow opacity-90 mb-8">
            {lang === 'es' ? 'Descansa, relájate y reconecta.' : 'Rest, relax, and reconnect.'}
          </p>
          <button onClick={() => document.getElementById('apartments').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-blue-50 transition shadow-lg">
            {t.checkAvailability}
          </button>
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
              <div key={apt.id} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${idx === 1 ? 'delay-100' : idx === 2 ? 'delay-200' : ''}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={images[currentIdx] || apt.img} alt={apt.title_es} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* Carousel Arrows on Home Card */}
                  {apt.photoCount > 1 && (
                    <>
                      <button onClick={(e) => prevPhoto(apt.id, apt.photoCount, e)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors z-20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={(e) => nextPhoto(apt.id, apt.photoCount, e)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors z-20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}

                  {apt.isUnavailable && (
                    <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4 text-center">
                      <span className="text-white font-bold text-lg">{t.underRenovation}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                    <button onClick={() => !apt.isUnavailable && onSelect(apt.id)} className={`w-full py-2 bg-white text-slate-900 font-medium rounded-lg shadow ${apt.isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {t.bookNow}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{lang === 'es' ? apt.title_es : apt.title_en}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {lang === 'es' ? apt.short_es : apt.short_en}
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

function ApartmentDetail({ apartmentId, lang, t, availability, onClose, isCar = false }) {
  const apt = isCar ? CARS.find(c => c.id === apartmentId) : APARTMENTS.find(a => a.id === apartmentId);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [calendarBase, setCalendarBase] = useState(() => new Date(2026, 0, 1)); // Start at Jan 2026 by default for this task
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
*${lang === 'es' ? apt.title_es : apt.title_en}*
${lang === 'es' ? 'Fechas' : 'Dates'}: ${start} -> ${end}
${t.guests}: ${guests}
${lang === 'es' ? 'Nombre' : 'Name'}: ${name}
${t.priceTotal}: ${totalPrice}€
${isCar ? (lang === 'es' ? 'Solicitud de Alquiler de Coche' : 'Car Rental Request') : ''}`;
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{lang === 'es' ? apt.title_es : apt.title_en}</h1>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">{lang === 'es' ? apt.long_es : apt.long_en}</p>

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
                <h2 className="text-xl font-bold mb-4 border-b pb-2">{t.bookNow} (2026)</h2>

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
          if (price < 90) bg = 'bg-green-50 text-green-700 hover:bg-green-100'; // Low
          else if (price < 130) bg = 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'; // Mid
          else bg = 'bg-orange-50 text-orange-700 hover:bg-orange-100'; // High
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
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">{t.activities}</h2>
      <div className="grid gap-6">
        {ACTIVITIES.map(a => (
          <div key={a.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{lang === 'es' ? a.title_es : a.title_en}</h3>
              <p className="text-slate-600">{lang === 'es' ? a.desc_es : a.desc_en}</p>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp / {lang === 'es' ? 'Teléfono' : 'Phone'}</label>
            <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{lang === 'es' ? 'Mensaje' : 'Message'}</label>
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">🚗 {lang === 'es' ? 'En Coche' : 'By Car'}</h3>
            <p className="text-slate-600 text-sm">
              {lang === 'es'
                ? 'Sigue la autovía A-8 hasta la salida 285. Toma la carretera comarcal AS-263 y sigue las indicaciones hacia la costa. Disponemos de aparcamiento gratuito.'
                : 'Follow the A-8 motorway to exit 285. Take the AS-263 road and follow signs to the coast. Free parking available.'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">🚌 {lang === 'es' ? 'Transporte Público' : 'Public Transport'}</h3>
            <p className="text-slate-600 text-sm">
              {lang === 'es'
                ? 'Autobuses ALSA con parada en el pueblo cada 2 horas (Línea Llanes-Ribadesella).'
                : 'ALSA buses stop in the village every 2 hours (Llanes-Ribadesella line).'}
            </p>
          </div>
        </div>
        <div className="bg-slate-200 rounded-xl h-64 md:h-auto flex items-center justify-center text-slate-500 font-medium">
          {/* Placeholder for map */}
          Google Maps Embed
        </div>
      </div>
    </div>
  );
}
