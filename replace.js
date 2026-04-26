const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/lang === 'es' \? apt\.title_es : apt\.title_en/g, "apt['title_' + lang]");
code = code.replace(/lang === 'es' \? apt\.short_es : apt\.short_en/g, "apt['short_' + lang]");
code = code.replace(/lang === 'es' \? apt\.long_es : apt\.long_en/g, "apt['long_' + lang]");
code = code.replace(/lang === 'es' \? a\.title_es : a\.title_en/g, "a['title_' + lang]");
code = code.replace(/lang === 'es' \? a\.desc_es : a\.desc_en/g, "a['desc_' + lang]");
code = code.replace(/lang === 'es' \? 'Empresas recomendadas:' : 'Recommended companies:'/g, "lang === 'es' ? 'Empresas recomendadas:' : lang === 'ca' ? 'Empreses recomanades:' : lang === 'eu' ? 'Gomendatutako enpresak:' : 'Recommended companies:'");
code = code.replace(/WhatsApp \/ \{lang === 'es' \? 'Teléfono' : 'Phone'\}/g, "{lang === 'es' ? 'WhatsApp / Teléfono' : lang === 'ca' ? 'WhatsApp / Telèfon' : lang === 'eu' ? 'WhatsApp / Telefonoa' : 'WhatsApp / Phone'}");
code = code.replace(/\{lang === 'es' \? 'Mensaje' : 'Message'\}/g, "{lang === 'es' ? 'Mensaje' : lang === 'ca' ? 'Missatge' : lang === 'eu' ? 'Mezua' : 'Message'}");
code = code.replace(/🚗 \{lang === 'es' \? 'Acceso en vehículo propio' : 'Access by private vehicle'\}/g, "🚗 {lang === 'es' ? 'Acceso en vehículo propio' : lang === 'ca' ? 'Accés amb vehicle propi' : lang === 'eu' ? 'Sarbidea ibilgailu propioarekin' : 'Access by private vehicle'}");
code = code.replace(/\{lang === 'es' \? 'Abrir ubicación exacta en Google Maps' : 'Open exact location on Google Maps'\}/g, "{lang === 'es' ? 'Abrir ubicación exacta en Google Maps' : lang === 'ca' ? 'Obrir ubicació exacta a Google Maps' : lang === 'eu' ? 'Ireki kokapen zehatza Google Maps-en' : 'Open exact location on Google Maps'}");
code = code.replace(/lang === 'es' \? 'Hola, quiero reservar' : 'Hello, I want to book'/g, "lang === 'es' ? 'Hola, quiero reservar' : lang === 'ca' ? 'Hola, vull reservar' : lang === 'eu' ? 'Kaixo, erreserbatu nahi dut' : 'Hello, I want to book'");
code = code.replace(/lang === 'es' \? 'Fechas' : 'Dates'/g, "lang === 'es' ? 'Fechas' : lang === 'ca' ? 'Dates' : lang === 'eu' ? 'Datak' : 'Dates'");
code = code.replace(/lang === 'es' \? 'Nombre' : 'Name'/g, "lang === 'es' ? 'Nombre' : lang === 'ca' ? 'Nom' : lang === 'eu' ? 'Izena' : 'Name'");
code = code.replace(/lang === 'es' \? 'Hola, tengo una duda antes de reservar' : 'Hello, I have a question before booking'/g, "lang === 'es' ? 'Hola, tengo una duda antes de reservar' : lang === 'ca' ? 'Hola, tinc un dubte abans de reservar' : lang === 'eu' ? 'Kaixo, galdera bat dut erreserbatu aurretik' : 'Hello, I have a question before booking'");

// And the long paragraph for HowTo
code = code.replace(/\{lang === 'es'[\s\S]*?Solo se puede llegar en vehículo propio[\s\S]*?condición de este camino no es muy bueno y estrecho\.'[\s\S]*?:\s*'Access is only possible by private vehicle[\s\S]*?it is narrow\.'\}/, 
\`{lang === 'es' 
  ? 'Solo se puede llegar en vehículo propio. Salir de la A-8 en la estación de servicio "Aldea de Bricia", pasar Posada de Llanes en dirección a Picos de Europa, y pasado Vibaño seguir las indicaciones del Hotel Montaña Mágica. En la subida, tras dejar la primera casa (no cuadra) a mano izquierda, hay que coger un pequeño camino a mano derecha para acceder al barrio de "El Combral". Estamos trabajando en mejorar el acceso, pero por el momento el estado de este camino no es muy bueno y es estrecho.'
  : lang === 'ca'
  ? 'Només es pot arribar amb vehicle propi. Sortir de la A-8 a l\\'estació de servei "Aldea de Bricia", passar Posada de Llanes en direcció a Picos de Europa, i passat Vibaño seguir les indicacions de l\\'Hotel Montaña Mágica. A la pujada, després de deixar la primera casa (no quadra) a mà esquerra, cal agafar un petit camí a mà dreta per accedir al barri de "El Combral". Estem treballant per millorar l\\'accés, però de moment l\\'estat d\\'aquest camí no és gaire bo i és estret.'
  : lang === 'eu'
  ? 'Ibilgailu propioarekin bakarrik irits daiteke. A-8tik irten "Aldea de Bricia" zerbitzugunean, Posada de Llanes igaro Europako Mendietarantz, eta Vibaño igarota Hotel Montaña Mágica-ren seinaleak jarraitu. Igoeran, ezkerrean dagoen lehen etxea (ez ukuilua) pasatu ondoren, eskuinera doan bide txiki bat hartu behar da "El Combral" auzora sartzeko. Sarbidea hobetzen ari gara, baina oraingoz bide horren egoera ez da oso ona eta estua da.'
  : 'Access is only possible by private vehicle. Exit the A-8 at the "Aldea de Bricia" service station, pass Posada de Llanes towards Picos de Europa, and after Vibaño follow the signs for Hotel Montaña Mágica. On the way up, after passing the first house on the left, take a small path to the right to access the "El Combral" neighborhood. We are working on improving the access, but currently, the condition of this path is not very good and it is narrow.'}\`
);

fs.writeFileSync('src/App.jsx', code);
