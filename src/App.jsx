// App: Apartamentos para alquiler — Spanish / English
// Single-file React component (default export) + Tailwind CSS classes.
// Usage: paste into a React project (Vite/CRA) or drop into a CodeSandbox.
// Dependencies: none required beyond React and Tailwind. Uses browser fetch to read a CSV from Google Sheets (published as CSV).

/*
README (short):
1) Create a Google Sheet with columns: date (YYYY-MM-DD), apartment (El camion|El apartamento|El aula), price (numeric), available (TRUE/FALSE)
2) File > Publish to the web > choose sheet > Comma-separated values (.csv) > publish. Copy the CSV URL.
3) In the code below, set SHEET_CSV_URL to your published CSV URL.
4) Add apartment photos to /public/images/ following the pattern: camion0.jpg, camion1.jpg, ... apartamento0.jpg, etc. Set photoCount for each apartment below.
5) Deploy to Vercel / Netlify (drag & drop) — it's static.

Notes: The app fetches the CSV on load and every 60s (configurable). The homepage cards now include a small photo carousel; detailed view hides images as requested. The calendar always shows numerical prices when present.
*/

import React, { useEffect, useMemo, useState } from "react";
import useGoogleSheet from "./components/useGoogleSheet";

// ---- CONFIG ----
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoXmH3uHC7Ezw17NKLFWaVJzF2kRveW4xquJGGr3VYckc1lGqMOW62QeTyhCDiUPu4vYkxYTEInOXf/pub?output=csv";
const REFRESH_SECONDS = 60; // how often to re-fetch the sheet

// Each apartment includes photoCount to indicate how many images exist following the pattern id0,id1,...
const APARTMENTS = [
  {
    id: "camion",
    key: "El camion",
    title_es: "El camión",
    title_en: "El Camión",
    img: "/images/camion0.jpg",
    photoCount: 3, // expects camion0.jpg .. camion2.jpg
    short_es: "Pequeño y acogedor, ideal para 2 personas.",
    short_en: "Small & cozy, great for 2 guests.",
    long_es: `Situada en un acantilado, esta pequeña cabaña de cedro y cristal equilibra la montaña y el mar. Picos de granito se alzan detrás; el océano se extiende delante. Dentro, esperan una acogedora estufa de leña y una cama alta. Explora senderos de montaña y pozas de marea. Es el escape perfecto, combinando picos escarpados y olas tranquilas.`,
    long_en: `Nestled on a bluff, this cedar and glass tiny lodge balances the mountains and sea. Granite peaks rise behind it; the ocean stretches before it. Inside, a cozy wood stove and loft bed await. Explore mountain trails and ocean tide pools. It is the perfect escape, combining rugged peaks and the calming surf.`
  },
  {
    id: "apartamento",
    key: "El apartamento",
    title_es: "El Apartamento",
    title_en: "The Apartment",
    img: "/images/apartamento0.jpg",
    photoCount: 3,
    short_es: "Céntrico, con todas las comodidades.",
    short_en: "Central, all comforts included.",
    long_es: `Apartamento céntrico, luminoso y con todas las comodidades para estancias urbanas. Espacio para 4 personas, cocina completa y transporte cercano.`,
    long_en: `Central, bright apartment with all comforts for urban stays. Space for 4 guests, full kitchen and nearby transport.`
  },
  {
    id: "aula",
    key: "El aula",
    title_es: "El Aula",
    title_en: "The Classroom",
    img: "/images/aula0.jpg",
    photoCount: 2,
    short_es: "Espacioso, perfecto para grupos.",
    short_en: "Spacious — perfect for groups.",
    long_es: `Espacio amplio pensado para grupos y talleres. Dispone de una sala diáfana y equipada para actividades.`,
    long_en: `Large space designed for groups and workshops. It includes an open, well-equipped room for activities.`
  },
];

// Sample activities (you can edit later)
const ACTIVITIES = [
  { id: 'surf', title_es: 'Clases de surf', title_en: 'Surf lessons', desc_es: 'Sesiones para todos los niveles cerca de la playa.', desc_en: 'Lessons for all levels near the beach.' },
  { id: 'kayak', title_es: 'Kayak', title_en: 'Kayaking', desc_es: 'Rutas guiadas en kayak al atardecer.', desc_en: 'Guided kayak routes at sunset.' },
  { id: 'gastronomia', title_es: 'Ruta gastronómica', title_en: 'Food tour', desc_es: 'Degustación de productos locales.', desc_en: 'Tasting of local products.' },
];

// ---- TRANSLATIONS ----
const TEXT = {
  es: {
    appTitle: "Alquiler de Apartamentos",
    selectLang: "ES | EN",
    nights: "noches",
    people: "personas",
    checkAvailability: "Ver disponibilidad",
    book: "Reservar",
    sendWhatsApp: "Enviar por WhatsApp",
    name: "Nombre",
    guests: "Número de huéspedes",
    startDate: "Fecha inicio",
    endDate: "Fecha fin",
    priceTotal: "Precio total",
    available: "Disponible",
    notAvailable: "No disponible",
    price: "Precio",
    loading: "Cargando...",
    back: "Volver",
    home: 'Inicio',
    activities: 'Actividades',
    contact: 'Contacto',
    contactIntro: 'Contáctanos por WhatsApp o email',
    email: 'Correo',
    phone: 'Teléfono',
    message: 'Mensaje',
    send: 'Enviar',
    howto: 'Cómo llegar'
  },
  en: {
    appTitle: "Apartment Rentals",
    selectLang: "ES | EN",
    nights: "nights",
    people: "guests",
    checkAvailability: "Check availability",
    book: "Book",
    sendWhatsApp: "Send via WhatsApp",
    name: "Name",
    guests: "Number of guests",
    startDate: "Start date",
    endDate: "End date",
    priceTotal: "Total price",
    available: "Available",
    notAvailable: "Not available",
    price: "Price",
    loading: "Loading...",
    back: "Back",
    home: 'Home',
    activities: 'Activities',
    contact: 'Contact',
    contactIntro: 'Contact us via WhatsApp or email',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    send: 'Send',
    howto: 'How to get here'
  }
};

// ---- UTILITIES ----
function parseCSV(csvText) {
  // simple CSV parser: expects header row, comma-separated, no fancy quoting
  const lines = csvText.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] ?? "");
    return obj;
  });
  return rows;
}

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function dateRange(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  const arr = [];
  for (let d = new Date(a); d <= b; d.setDate(d.getDate()+1)) arr.push(formatDate(new Date(d)));
  return arr;
}

function buildImagesForApartment(apartment){
  const imgs = [];
  for(let i=0;i<(apartment.photoCount||0);i++) imgs.push(`/images/${apartment.id}${i}.jpg`);
  return imgs;
}

// ---- MAIN COMPONENT ----
export default function AppRent() {
  const [lang, setLang] = useState('es');
  const t = TEXT[lang];

  const [tab, setTab] = useState('home'); // 'home' | 'activities' | 'contact' | 'howto'
  const [showMobileNav, setShowMobileNav] = useState(false);

  // sheet data is fetched via useGoogleSheet (PapaParse)
  const { data: sheetData, loading: loadingSheet, error: sheetError } = useGoogleSheet(SHEET_CSV_URL, REFRESH_SECONDS);
  const [selectedApt, setSelectedApt] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  // calendar base month (used for CalendarMonth rendering/navigation)
  const [calendarBase, setCalendarBase] = useState(() => new Date());
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);

  // photo index per apartment for the homepage carousels
  const [photoIndexByApt, setPhotoIndexByApt] = useState(() => {
    const obj = {};
    APARTMENTS.forEach(a => obj[a.key] = 0);
    return obj;
  });

  // lightbox / modal for viewing images larger
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  function openLightbox(images, index = 0){
    setLightboxImages(images);
    setLightboxIndex(index || 0);
    setLightboxOpen(true);
  }
  function closeLightbox(){ setLightboxOpen(false); }
  function prevLightbox(){ setLightboxIndex(i => (i-1+lightboxImages.length) % lightboxImages.length); }
  function nextLightbox(){ setLightboxIndex(i => (i+1) % lightboxImages.length); }

  // loading flag mapped from hook
  const loading = loadingSheet;

  // whenever the selected start date changes, focus the calendar on that month
  useEffect(()=>{
    if (start) {
      const d = new Date(start);
      setCalendarBase(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  },[start]);

  // build availability map: { apartmentKey: { 'YYYY-MM-DD': {price, available} } }
  const availability = useMemo(()=>{
    // tolerant mapping: accept sheet apartment values matching either apartment.key or apartment.id (case-insensitive)
    const nameToKey = {};
    APARTMENTS.forEach(a=>{
      if (a.key) nameToKey[a.key] = a.key;
      if (a.id) nameToKey[a.id] = a.key;
      nameToKey[a.key?.toLowerCase()] = a.key;
      nameToKey[a.id?.toLowerCase()] = a.key;
    });

    const map = {};
    APARTMENTS.forEach(a=>map[a.key]={});
    for (const r of sheetData || []){
      const date = r.date ?? r.Date ?? '';
      const rawApartment = (r.apartment ?? r.Apartment ?? r.apartmentName ?? '').toString();
      const apartmentKey = nameToKey[rawApartment] ?? nameToKey[rawApartment.toLowerCase()] ?? null;
      const price = Number(r.price ?? r.Price ?? '');
      const available = (String(r.available ?? r.Available ?? '').toLowerCase() === 'true') || (String(r.available ?? '').toLowerCase() === 'yes') || String(r.available ?? '').trim() === '1';
      if (apartmentKey) map[apartmentKey][date] = { price: isNaN(price) ? null : price, available };
    }
    return map;
  },[sheetData]);

  function apartmentByKey(key){ return APARTMENTS.find(a=>a.key===key); }

  function calcTotal(apartmentKey, startDate, endDate){
    if(!startDate || !endDate) return 0;
    const days = dateRange(startDate, endDate);
    let total = 0;
    for(const d of days){
      const info = availability[apartmentKey]?.[d];
      if (info && typeof info.price === 'number') total += info.price; else return null; // missing day or price
    }
    return total;
  }

  function allDaysAvailable(apartmentKey, startDate, endDate){
    const days = dateRange(startDate, endDate);
    for(const d of days){
      const info = availability[apartmentKey]?.[d];
      if (!info || !info.available) return false;
    }
    return true;
  }

  function createWhatsAppLink(apartmentKey, startDate, endDate, nameVal, guestsVal){
    const apt = apartmentKey;
    const total = calcTotal(apartmentKey, startDate, endDate);
    const nights = Math.round((new Date(endDate) - new Date(startDate)) / (1000*60*60*24)) + 1;
    const aptTitle = apartmentByKey(apt)?.[`title_${lang}`] ?? apt;

    const message = `${lang==='es' ? 'Reserva' : 'Booking'}:
${apt} - ${aptTitle}
${lang==='es'?'Fechas':'Dates'}: ${startDate} → ${endDate} (${nights} ${t.nights})
${lang==='es'?'Nombre':'Name'}: ${nameVal}
${t.people}: ${guestsVal}
${t.priceTotal}: ${total ?? 'N/A'}`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/34611044315?text=${encoded}`;
  }

  // Contact form state
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  function sendContactViaWhatsApp(){
    const msg = `${lang==='es'?'Contacto':'Contact'}:%0A${t.email}: ${contactEmail}%0A${t.phone}: ${contactPhone}%0A${t.message}: ${contactMessage}`;
    window.open(`https://wa.me/34611033315?text=${encodeURIComponent(decodeURIComponent(msg))}`, '_blank');
  }

  function sendContactViaEmail(){
    const subject = (lang==='es' ? 'Contacto' : 'Contact');
    const body = `${lang==='es'? 'Contacto' : 'Contact'}%0A%0A${t.email}: ${contactEmail}%0A${t.phone}: ${contactPhone}%0A${t.message}: ${contactMessage}`;
    // opens user's default mail client
    window.open(`mailto:youremail@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(decodeURIComponent(body))}`, '_blank');
  }

  // carousel helpers for homepage per-apartment
  function nextImageForApt(apartmentKey){
    const apartment = apartmentByKey(apartmentKey);
    const count = apartment?.photoCount || 0;
    setPhotoIndexByApt(prev => ({ ...prev, [apartmentKey]: (prev[apartmentKey] + 1) % Math.max(1, count) }));
  }
  function prevImageForApt(apartmentKey){
    const apartment = apartmentByKey(apartmentKey);
    const count = apartment?.photoCount || 0;
    setPhotoIndexByApt(prev => ({ ...prev, [apartmentKey]: (prev[apartmentKey] - 1 + Math.max(1,count)) % Math.max(1,count) }));
  }

  return (
  <div className="min-h-screen p-6" style={{ backgroundImage: "url('/images/imagenfondo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t.appTitle}</h1>
          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav className="hidden sm:flex gap-2">
              <button onClick={()=>setTab('home')} className={`px-3 py-1 rounded ${tab==='home'? 'bg-blue-600 text-white':'border'}`}>{t.home}</button>
              <button onClick={()=>setTab('activities')} className={`px-3 py-1 rounded ${tab==='activities'? 'bg-blue-600 text-white':'border'}`}>{t.activities}</button>
              <button onClick={()=>setTab('contact')} className={`px-3 py-1 rounded ${tab==='contact'? 'bg-blue-600 text-white':'border'}`}>{t.contact}</button>
              <button onClick={()=>setTab('howto')} className={`px-3 py-1 rounded ${tab==='howto'? 'bg-blue-600 text-white':'border'}`}>{t.howto}</button>
            </nav>
            {/* Mobile nav: hamburger */}
            <div className="sm:hidden relative">
              <button onClick={()=>setShowMobileNav(s=>!s)} className="px-3 py-1 border rounded" aria-label="Menú">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              {showMobileNav && (
                <div className="absolute right-0 mt-2 bg-white rounded shadow-lg z-10 flex flex-col min-w-[140px]">
                  <button onClick={()=>{setTab('home');setShowMobileNav(false);}} className={`px-3 py-2 text-left ${tab==='home'? 'bg-blue-600 text-white':'border-b'}`}>{t.home}</button>
                  <button onClick={()=>{setTab('activities');setShowMobileNav(false);}} className={`px-3 py-2 text-left ${tab==='activities'? 'bg-blue-600 text-white':'border-b'}`}>{t.activities}</button>
                  <button onClick={()=>{setTab('contact');setShowMobileNav(false);}} className={`px-3 py-2 text-left ${tab==='contact'? 'bg-blue-600 text-white':'border-b'}`}>{t.contact}</button>
                  <button onClick={()=>{setTab('howto');setShowMobileNav(false);}} className={`px-3 py-2 text-left ${tab==='howto'? 'bg-blue-600 text-white':'border-b'}`}>{t.howto}</button>
                </div>
              )}
            </div>
            <button onClick={()=>setLang(l=>l==='es'?'en':'es')} className="px-3 py-1 border rounded">{t.selectLang}</button>
          </div>
        </header>

        <main>
          {tab==='home' && (
            <section>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {APARTMENTS.map(a=> {
                  const imgs = buildImagesForApartment(a);
                  const idx = photoIndexByApt[a.key] || 0;
                  const src = imgs[idx] || a.img;
                  return (
                    <article key={a.id} className="bg-white p-3 rounded shadow-sm">
                      <div className="relative h-36 w-full overflow-hidden rounded">
                        <img src={src} alt={a.title_es} className="h-full w-full object-cover cursor-pointer" onClick={()=>openLightbox(imgs, idx)} />
                        <button onClick={()=>prevImageForApt(a.key)} className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 p-1 rounded">‹</button>
                        <button onClick={()=>nextImageForApt(a.key)} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 p-1 rounded">›</button>
                      </div>

                      <h3 className="mt-2 font-semibold">{lang==='es'?a.title_es:a.title_en}</h3>
                      <p className="text-sm text-gray-600">{lang==='es'?a.short_es:a.short_en}</p>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs text-gray-500">{a.photoCount} {lang==='es'? 'fotos':'photos'}</div>
                        <button onClick={()=>{ setSelectedApt(a.key); setStart(''); setEnd(''); setTab('apartment'); }} className="px-3 py-1 bg-blue-600 text-white rounded">{t.checkAvailability}</button>
                      </div>
                    </article>
                  );
                })}
              </section>

              {loading && <div className="text-sm text-gray-500">{t.loading}</div>}

              {/* selectedApt detailed view moved to its own page/tab (see tab==='apartment') */}
            </section>
          )}

          {tab==='activities' && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">{t.activities}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {ACTIVITIES.map(a=> (
                  <div key={a.id} className="p-3 border rounded">
                    <h3 className="font-semibold">{lang==='es'?a.title_es:a.title_en}</h3>
                    <p className="text-sm text-gray-600">{lang==='es'?a.desc_es:a.desc_en}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab==='contact' && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">{t.contact}</h2>
              <p className="text-sm text-gray-600 mb-4">{t.contactIntro}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">{t.email}</label>
                  <input value={contactEmail} onChange={e=>setContactEmail(e.target.value)} className="mt-1 p-2 border rounded w-full" />

                  <label className="block text-sm mt-2">{t.phone}</label>
                  <input value={contactPhone} onChange={e=>setContactPhone(e.target.value)} className="mt-1 p-2 border rounded w-full" />

                  <label className="block text-sm mt-2">{t.message}</label>
                  <textarea value={contactMessage} onChange={e=>setContactMessage(e.target.value)} className="mt-1 p-2 border rounded w-full" rows={4}></textarea>

                  <div className="mt-3 flex gap-2">
                    <button onClick={sendContactViaEmail} className="px-3 py-2 bg-blue-600 text-white rounded">{t.send}</button>
                    <button onClick={sendContactViaWhatsApp} className="px-3 py-2 bg-green-600 text-white rounded">{t.sendWhatsApp}</button>
                    <a href={`mailto:youremail@example.com?subject=${encodeURIComponent(lang==='es'?'Contacto':'Contact')}`} className="px-3 py-2 border rounded">{t.email}</a>
                  </div>
                </div>

                {/* Removed 'Where we are' column per user request */}
              </div>
            </section>
          )}

          {tab==='howto' && (
            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">{t.howto}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">{lang==='es'?'En coche':'By car'}</h3>
                  <p className="text-sm text-gray-600">{lang==='es'?`Sigue la carretera principal hasta el desvío hacia la costa. Aparcamiento limitado cerca de El Camión.`:`Follow the main road to the coastal turnoff. Limited parking near El Camión.`}</p>

                  <h3 className="font-semibold mt-3">{lang==='es'?'Transporte público':'Public transport'}</h3>
                  <p className="text-sm text-gray-600">{lang==='es'?`Autobús desde la estación central cada 2 horas. Parada más cercana a 1.2 km.`:`Bus from the central station every 2 hours. Closest stop 1.2 km away.`}</p>

                  <h3 className="font-semibold mt-3">{lang==='es'?'Consejos':'Tips'}</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>{lang==='es'?'Trae calzado cómodo para senderos.':'Bring sturdy shoes for trails.'}</li>
                    <li>{lang==='es'?'Se recomienda GPS para llegar al acantilado.':'GPS recommended for reaching the bluff.'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">{lang==='es'?'Mapa':'Map'}</h3>
                  <div className="mt-2">
                    <a href="https://maps.app.goo.gl/TQJrgqLmhEHTLW4i8" target="_blank" rel="noreferrer" className="px-3 py-2 bg-blue-600 text-white rounded inline-block">{lang==='es'? 'Abrir en Google Maps' : 'Open in Google Maps'}</a>
                  </div>
                  {/* map preview removed per user request; kept the 'Abrir en Google Maps' link above */}
                </div>
              </div>
            </section>
          )}
          {tab==='apartment' && selectedApt && (
            <section className="bg-white p-6 rounded shadow max-w-4xl mx-auto mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button onClick={()=>{ setSelectedApt(null); setTab('home'); }} className="text-sm text-blue-600">{t.back}</button>
                  <div className="text-2xl font-bold mt-1">{lang==='es'?apartmentByKey(selectedApt).title_es:apartmentByKey(selectedApt).title_en}</div>
                  <div className="text-sm text-gray-600 mt-1">{lang==='es'?apartmentByKey(selectedApt).short_es:apartmentByKey(selectedApt).short_en}</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">{lang==='es'?'Descripción':'Description'}</h3>
                <p className="text-sm text-gray-700">{lang==='es'?apartmentByKey(selectedApt).long_es:apartmentByKey(selectedApt).long_en}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">{lang==='es'?'Calendario':'Calendar'}</h4>
                <div className="mb-2 flex items-center gap-2">
                  <button onClick={()=>setCalendarBase(b => new Date(b.getFullYear(), b.getMonth()-1, 1))} className="px-2 py-1 border rounded">‹</button>
                  <button onClick={()=>setCalendarBase(b => new Date(b.getFullYear(), b.getMonth()+1, 1))} className="px-2 py-1 border rounded">›</button>
                  <select value={calendarBase.getMonth()} onChange={e=>setCalendarBase(b=> new Date(b.getFullYear(), Number(e.target.value), 1))} className="p-1 border rounded text-sm">
                    {Array.from({length:12}).map((_,i)=> <option key={i} value={i}>{new Date(0,i).toLocaleString(lang==='es'?'es-ES':'en-US',{month:'long'})}</option>)}
                  </select>
                  <input type="number" value={calendarBase.getFullYear()} onChange={e=>setCalendarBase(b=> new Date(Number(e.target.value)||b.getFullYear(), b.getMonth(), 1))} className="w-24 p-1 border rounded text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0,1].map(monthOffset => (
                    <CalendarMonth key={monthOffset}
                                   monthOffset={monthOffset}
                                   apartmentKey={selectedApt}
                                   availability={availability[selectedApt]||{}}
                                   lang={lang}
                                   baseDate={calendarBase}
                                   selectedStart={start}
                                   selectedEnd={end}
                                   onDayClick={(d)=>{
                                     if(!start){ setStart(d); setEnd(''); return; }
                                     if(start && !end){
                                       if(d >= start){
                                         setEnd(d);
                                         const endDateObj = new Date(d);
                                         const baseMonth = calendarBase.getMonth();
                                         const baseYear = calendarBase.getFullYear();
                                         if (endDateObj.getFullYear() > baseYear || (endDateObj.getFullYear() === baseYear && endDateObj.getMonth() > baseMonth+1)) {
                                           setCalendarBase(new Date(endDateObj.getFullYear(), endDateObj.getMonth()-1, 1));
                                         }
                                         return;
                                       }
                                       setStart(d); setEnd(''); return;
                                     }
                                     setStart(d); setEnd('');
                                   }} />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2">
                    <label className="block text-sm">{t.startDate} / {t.endDate}</label>
                    <div className="mt-1 text-sm text-gray-700">{start || '—'} {start && end ? `→ ${end}` : ''}</div>
                    <div className="text-xs text-gray-500 mt-1">{lang==='es'?'Selecciona fechas en el calendario':'Select dates using the calendar'}</div>
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm">{t.name}</label>
                    <input placeholder={lang==='es'?'Tu nombre':'Your name'} value={name} onChange={e=>setName(e.target.value)} className="mt-1 p-2 border rounded w-full" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm">{t.guests}</label>
                    <input type="number" min={1} value={guests} onChange={e=>setGuests(e.target.value)} className="mt-1 p-2 border rounded w-full" />
                  </div>

                  <div className="mb-2">
                    <strong>{t.priceTotal}:</strong> {start && end ? (calcTotal(selectedApt, start, end) ?? '—') : '—'}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a className={`px-3 py-2 rounded ${start && end && allDaysAvailable(selectedApt,start,end) ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700 pointer-events-none'}`} href={start && end ? createWhatsAppLink(selectedApt,start,end,name,guests) : '#'} target="_blank" rel="noreferrer">{t.sendWhatsApp}</a>
                    <button className="px-3 py-2 rounded border" onClick={()=>{ setStart(''); setEnd(''); setName(''); setGuests(2); }}>{t.back}</button>
                  </div>
                </div>

                <div>
                  {/* Right column left for future info or photos */}
                </div>
              </div>
            </section>
          )}

        </main>

        <footer className="mt-6 text-center text-sm text-gray-500"></footer>

        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeLightbox}>
            <div className="relative max-w-4xl w-full mx-4" onClick={e=>e.stopPropagation()}>
              <button onClick={closeLightbox} className="absolute right-2 top-2 z-50 bg-white/80 rounded-full p-2">✕</button>
              <button onClick={prevLightbox} className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white/80 rounded-full p-2">‹</button>
              <button onClick={nextLightbox} className="absolute right-12 top-1/2 -translate-y-1/2 z-50 bg-white/80 rounded-full p-2">›</button>
              <img src={lightboxImages[lightboxIndex]} alt="preview" className="w-full h-[70vh] object-contain rounded shadow-lg bg-white" />
              <div className="text-center text-sm text-white mt-2">{lightboxIndex+1} / {lightboxImages.length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarMonth({ monthOffset=0, apartmentKey, availability, lang, baseDate, selectedStart, selectedEnd, onDayClick }){
  const base = baseDate ? new Date(baseDate) : new Date();
  const first = new Date(base.getFullYear(), base.getMonth()+monthOffset, 1);
  const month = first.getMonth();
  const year = first.getFullYear();

  // days in month
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const startWeekday = first.getDay(); // 0 Sun..6 Sat

  const cells = [];
  for (let i=0;i<startWeekday;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="bg-white p-2 rounded shadow-sm">
      <div className="font-semibold mb-2">{first.toLocaleString(lang==='es'?'es-ES':'en-US',{month:'long', year:'numeric'})}</div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["D","L","M","X","J","V","S"].map(d=> <div key={d} className="text-center">{d}</div>)}
        {cells.map((c, i)=>{
          if (!c) return <div key={i} className="h-14 p-1 bg-gray-50"></div>;
          const key = `${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,'0')}-${String(c.getDate()).padStart(2,'0')}`;
          const info = availability?.[key];
          const available = info?.available;
          const price = info?.price;
          const priceText = (price !== null && price !== undefined && !isNaN(price)) ? `${price}€` : '—';

          const isStart = selectedStart === key;
          const isEnd = selectedEnd === key;
          const inRange = selectedStart && selectedEnd && (key > selectedStart && key < selectedEnd);

          const bgClass = isStart || isEnd ? 'bg-blue-200' : inRange ? 'bg-blue-50' : (available ? 'bg-green-50' : 'bg-red-50');

          return (
            <button key={i} onClick={()=>onDayClick && onDayClick(key)} className={`h-14 p-1 border rounded text-xs flex flex-col justify-between text-left ${bgClass}`}>
              <div className="text-right pr-1">{c.getDate()}</div>
              <div className="text-center w-full">{priceText}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
