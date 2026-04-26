const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace APARTMENTS
code = code.replace(/const APARTMENTS = \[([\s\S]*?)\];/, `const APARTMENTS = [
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
    long_es: \`Un antiguo camión frigorifico que ha visto mucho mundo y terminó siendo una casita al lado del huerto y con una terraza acogedora. Txikitin, para dos personas\`,
    long_en: \`An old refrigerated truck that has seen much of the world and ended up as a little house next to the orchard with a cozy terrace. Txikitin, for two people\`,
    long_eu: \`Mundu asko ikusi duen kamioi frigorifiko zaharra, baratze ondoan eta terraza eroso batekin etxetxo bat bihurtuta. Txikitin, bi pertsonentzat.\`,
    long_ca: \`Un antic camió frigorífic que ha vist molt món i ha acabat sent una caseta al costat de l'hort i amb una terrassa acollidora. Txikitin, per a dues persones.\`
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
    long_es: \`Apartamento espacioso, con bonitas vistas al macizo central de Picos. Dos habitaciones y opción de buardilla para niños.\`,
    long_en: \`Spacious apartment, with beautiful views of the central massif of Picos. Two bedrooms and option of an attic for children.\`,
    long_eu: \`Apartamentu zabala, Europako Mendien erdiguneko bista ederrekin. Bi logela eta umeentzako ganbara aukera.\`,
    long_ca: \`Apartament espaiós, amb maques vistes al massís central de Picos. Dues habitacions i opció de golfes per a nens.\`
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
    long_es: \`Este espacio está actualmente en proceso de renovación para ofrecerte una mejor experiencia muy pronto. Disculpa las molestias.\`,
    long_en: \`This space is currently undergoing renovations to provide a better experience soon. We apologize for the inconvenience.\`,
    long_eu: \`Espazio hau berritzen ari da laster esperientzia hobea eskaintzeko. Barkatu eragozpenak.\`,
    long_ca: \`Aquest espai està actualment en procés de renovació per oferir-te una millor experiència molt aviat. Disculpa les molèsties.\`
  }
];`);

// Replace ACTIVITIES
code = code.replace(/const ACTIVITIES = \[([\s\S]*?)\];/, `const ACTIVITIES = [
  {
    id: 'playa',
    title_es: 'El Mar y la Playa',
    title_en: 'Sea and Beach',
    title_eu: 'Itsasoa eta Hondartza',
    title_ca: 'El Mar i la Platja',
    desc_es: 'Snorkel, stand-up paddle y surf; pídenos consejo para saber dónde ir y cuándo.',
    desc_en: 'Snorkeling, stand-up paddle, and surfing; ask us for advice on where and when to go.',
    desc_eu: 'Snorkel, stand-up paddle eta surfa; eskatu iezaguzu aholkua nora eta noiz joan jakiteko.',
    desc_ca: 'Snorkel, stand-up paddle i surf; demana\\'ns consell per saber on anar i quan.',
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
];`);

// Replace TEXT
code = code.replace(/const TEXT = \{([\s\S]*?)\};\n\n\/\/ ---- UTILS ----/, `const TEXT = {
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

// ---- UTILS ----`);

// Update the flags in Header (Desktop)
code = code.replace(
  /<button onClick=\{\(\) => setLang\('es'\)\}.*?<\/button>\s*<button onClick=\{\(\) => setLang\('en'\)\}.*?<\/button>/,
  \`<button onClick={() => setLang('es')} className={\\\`text-xl transition-transform \${lang === 'es' ? 'scale-125 opacity-100 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110'}\\\`} title="Español">🇪🇸</button>
              <button onClick={() => setLang('en')} className={\\\`text-xl transition-transform \${lang === 'en' ? 'scale-125 opacity-100 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110'}\\\`} title="English">🇬🇧</button>
              <button onClick={() => setLang('eu')} className={\\\`text-xl font-bold transition-transform \${lang === 'eu' ? 'scale-125 opacity-100 text-red-600 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110 text-slate-400'}\\\`} title="Euskera">EU</button>
              <button onClick={() => setLang('ca')} className={\\\`text-xl font-bold transition-transform \${lang === 'ca' ? 'scale-125 opacity-100 text-yellow-500 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110 text-slate-400'}\\\`} title="Català">CA</button>\`
);

// Update the flags in Header (Mobile)
code = code.replace(
  /<button onClick=\{\(\) => \{ setLang\('es'\); setMobileMenuOpen\(false\); \}\}.*?<\/button>\s*<button onClick=\{\(\) => \{ setLang\('en'\); setMobileMenuOpen\(false\); \}\}.*?<\/button>/,
  \`<button onClick={() => { setLang('es'); setMobileMenuOpen(false); }} className={\\\`text-2xl transition-transform \${lang === 'es' ? 'scale-110 opacity-100' : 'opacity-50'}\\\`}>🇪🇸</button>
              <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={\\\`text-2xl transition-transform \${lang === 'en' ? 'scale-110 opacity-100' : 'opacity-50'}\\\`}>🇬🇧</button>
              <button onClick={() => { setLang('eu'); setMobileMenuOpen(false); }} className={\\\`text-2xl font-bold transition-transform \${lang === 'eu' ? 'scale-110 opacity-100 text-red-600' : 'opacity-50 text-slate-400'}\\\`}>EU</button>
              <button onClick={() => { setLang('ca'); setMobileMenuOpen(false); }} className={\\\`text-2xl font-bold transition-transform \${lang === 'ca' ? 'scale-110 opacity-100 text-yellow-500' : 'opacity-50 text-slate-400'}\\\`}>CA</button>\`
);

// Replace hardcoded inline translations
code = code.replace(/lang === 'es' \? apt\.title_es : apt\.title_en/g, "apt['title_' + lang]");
code = code.replace(/lang === 'es' \? apt\.short_es : apt\.short_en/g, "apt['short_' + lang]");
code = code.replace(/lang === 'es' \? apt\.long_es : apt\.long_en/g, "apt['long_' + lang]");
code = code.replace(/lang === 'es' \? a\.title_es : a\.title_en/g, "a['title_' + lang]");
code = code.replace(/lang === 'es' \? a\.desc_es : a\.desc_en/g, "a['desc_' + lang]");
code = code.replace(/lang === 'es' \? 'El Combral, mar y montaña\.' : 'El Combral, sea and mountain\.'/g, "t.appTitle");
code = code.replace(/lang === 'es' \? 'Empresas recomendadas:' : 'Recommended companies:'/g, "lang === 'es' ? 'Empresas recomendadas:' : lang === 'ca' ? 'Empreses recomanades:' : lang === 'eu' ? 'Gomendatutako enpresak:' : 'Recommended companies:'");

// Phone labels
code = code.replace(/WhatsApp \/ \{lang === 'es' \? 'Teléfono' : 'Phone'\}/g, "{lang === 'es' ? 'WhatsApp / Teléfono' : lang === 'ca' ? 'WhatsApp / Telèfon' : lang === 'eu' ? 'WhatsApp / Telefonoa' : 'WhatsApp / Phone'}");
code = code.replace(/\{lang === 'es' \? 'Mensaje' : 'Message'\}/g, "{lang === 'es' ? 'Mensaje' : lang === 'ca' ? 'Missatge' : lang === 'eu' ? 'Mezua' : 'Message'}");
code = code.replace(/🚗 \{lang === 'es' \? 'Acceso en vehículo propio' : 'Access by private vehicle'\}/g, "🚗 {lang === 'es' ? 'Acceso en vehículo propio' : lang === 'ca' ? 'Accés amb vehicle propi' : lang === 'eu' ? 'Sarbidea ibilgailu propioarekin' : 'Access by private vehicle'}");

code = code.replace(/\{lang === 'es'[\s\S]*?Solo se puede llegar en vehículo propio[\s\S]*?condición de este camino no es muy bueno y estrecho\.'[\s\S]*?:\s*'Access is only possible by private vehicle[\s\S]*?it is narrow\.'\}/, 
\`{lang === 'es' 
  ? 'Solo se puede llegar en vehículo propio. Salir de la A-8 en la estación de servicio "Aldea de Bricia", pasar Posada de Llanes en dirección a Picos de Europa, y pasado Vibaño seguir las indicaciones del Hotel Montaña Mágica. En la subida, tras dejar la primera casa (no cuadra) a mano izquierda, hay que coger un pequeño camino a mano derecha para acceder al barrio de "El Combral". Estamos trabajando en mejorar el acceso, pero por el momento el estado de este camino no es muy bueno y es estrecho.'
  : lang === 'ca'
  ? 'Només es pot arribar amb vehicle propi. Sortir de la A-8 a l\\'estació de servei "Aldea de Bricia", passar Posada de Llanes en direcció a Picos de Europa, i passat Vibaño seguir les indicacions de l\\'Hotel Montaña Mágica. A la pujada, després de deixar la primera casa (no quadra) a mà esquerra, cal agafar un petit camí a mà dreta per accedir al barri de "El Combral". Estem treballant per millorar l\\'accés, però de moment l\\'estat d\\'aquest camí no és gaire bo i és estret.'
  : lang === 'eu'
  ? 'Ibilgailu propioarekin bakarrik irits daiteke. A-8tik irten "Aldea de Bricia" zerbitzugunean, Posada de Llanes igaro Europako Mendietarantz, eta Vibaño igarota Hotel Montaña Mágica-ren seinaleak jarraitu. Igoeran, ezkerrean dagoen lehen etxea (ez ukuilua) pasatu ondoren, eskuinera doan bide txiki bat hartu behar da "El Combral" auzora sartzeko. Sarbidea hobetzen ari gara, baina oraingoz bide horren egoera ez da oso ona eta estua da.'
  : 'Access is only possible by private vehicle. Exit the A-8 at the "Aldea de Bricia" service station, pass Posada de Llanes towards Picos de Europa, and after Vibaño follow the signs for Hotel Montaña Mágica. On the way up, after passing the first house on the left, take a small path to the right to access the "El Combral" neighborhood. We are working on improving the access, but currently, the condition of this path is not very good and it is narrow.'}\`
);

code = code.replace(/\{lang === 'es' \? 'Abrir ubicación exacta en Google Maps' : 'Open exact location on Google Maps'\}/g, "{lang === 'es' ? 'Abrir ubicación exacta en Google Maps' : lang === 'ca' ? 'Obrir ubicació exacta a Google Maps' : lang === 'eu' ? 'Ireki kokapen zehatza Google Maps-en' : 'Open exact location on Google Maps'}");

// WhatsApp default texts
code = code.replace(/lang === 'es' \? 'Hola, quiero reservar' : 'Hello, I want to book'/g, "lang === 'es' ? 'Hola, quiero reservar' : lang === 'ca' ? 'Hola, vull reservar' : lang === 'eu' ? 'Kaixo, erreserbatu nahi dut' : 'Hello, I want to book'");
code = code.replace(/lang === 'es' \? 'Fechas' : 'Dates'/g, "lang === 'es' ? 'Fechas' : lang === 'ca' ? 'Dates' : lang === 'eu' ? 'Datak' : 'Dates'");
code = code.replace(/lang === 'es' \? 'Nombre' : 'Name'/g, "lang === 'es' ? 'Nombre' : lang === 'ca' ? 'Nom' : lang === 'eu' ? 'Izena' : 'Name'");
code = code.replace(/lang === 'es' \? 'Hola, tengo una duda antes de reservar' : 'Hello, I have a question before booking'/g, "lang === 'es' ? 'Hola, tengo una duda antes de reservar' : lang === 'ca' ? 'Hola, tinc un dubte abans de reservar' : lang === 'eu' ? 'Kaixo, galdera bat dut erreserbatu aurretik' : 'Hello, I have a question before booking'");

fs.writeFileSync('src/App.jsx', code);
console.log("Successfully updated App.jsx");
