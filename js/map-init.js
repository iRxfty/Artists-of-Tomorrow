(function () {
  'use strict';

  var map = L.map('map', {
    center: [15, -75],
    zoom: 3,
    scrollWheelZoom: false,  // prevents page-scroll hijacking
    zoomControl: true
  });

  // Lighter, cleaner basemap so coral markers pop
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // ── Active pin — logo in a coral circle with animated pulse ring ──────────
  // Uses divIcon so we can layer the logo + ring via HTML/CSS
  var activeIcon = L.divIcon({
    className: 'aot-active-marker',
    html:
      '<span class="aot-active-marker__pulse" aria-hidden="true"></span>' +
      '<span class="aot-active-marker__ring" aria-hidden="true"></span>' +
      '<span class="aot-active-marker__dot">' +
      '<img src="images/logo-favicon.png" alt="" width="18" height="18">' +
      '</span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });

  function activePopupHTML(name, sectionId, imagePath) {
    var imgHTML = imagePath
      ? '<div class="map-popup-image"><img src="' + imagePath + '" alt="1st Place Artwork" loading="lazy"></div>'
      : '';
    return '<span class="map-popup-eyebrow">Active program</span>' +
      '<p class="map-popup-title">' + name + '</p>' +
      imgHTML +
      '<button class="map-popup-link" onclick="(function(){' +
      'var el=document.getElementById(\'' + sectionId + '\');' +
      'if(el){el.scrollIntoView({behavior:\'smooth\',block:\'start\'});}' +
      '})()">Explore this school <span aria-hidden="true">&rarr;</span></button>';
  }

  function soonPopupHTML(name, country) {
    var countryLine = country
      ? '<span class="map-popup-country">' + country + '</span>'
      : '';
    return countryLine +
      '<p class="map-popup-title">' + name + '</p>' +
      '<span class="map-popup-badge">Coming Soon</span>';
  }

  // ── Active pins — India (2) ────────────────────────────────────────────────
  // Slight lat/lng offset so icons don't fully stack (same campus)
  [
    { name: 'Government Senior Secondary School, Nathupur \u2014 Middle School', lat: 28.8451, lng: 77.1564, sectionId: 'middle-school', img: 'images/1stPlaceMiddleSchool.jpg' },
    { name: 'Government Senior Secondary School, Nathupur \u2014 High School', lat: 28.8458, lng: 77.1572, sectionId: 'high-school', img: 'images/1stPlaceHighSchool.jpeg' }
  ].forEach(function (s) {
    L.marker([s.lat, s.lng], { icon: activeIcon, riseOnHover: true, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(activePopupHTML(s.name, s.sectionId, s.img), { maxWidth: 260 });
  });

  // ── Coming-soon marker style — AOT coral ───────────────────────────────────
  var cs = {
    radius: 6,
    fillColor: '#E59D83',   // AOT coral
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.95
  };

  // Hover style: bump size + deepen coral
  var csHover = {
    radius: 8,
    fillColor: '#D38A70',   // coral-dark
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 1
  };

  // ── Coming-soon pins (59) ──────────────────────────────────────────────────
  var soonSites = [
    // Colombia (1)
    { name: 'Colegio Policarpa Salavarrieta', country: 'Colombia', lat: 4.6501, lng: -74.0854 },

    // Costa Rica (1)
    { name: 'Escuela Finca La Capri', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },

    // Dominican Republic (3)
    { name: 'Centro Educativo Los Alifonsos', country: 'Dominican Republic', lat: 18.5001, lng: -69.8500 },
    { name: 'Escuela Profesora Flora Toletino', country: 'Dominican Republic', lat: 18.4750, lng: -69.9100 },
    { name: 'Escuela B\u00e1sica El Valiente', country: 'Dominican Republic', lat: 19.2500, lng: -69.5000 },

    // El Salvador (18)
    { name: 'Centro Escolar Juan Ram\u00f3n Jim\u00e9nez', country: 'El Salvador', lat: 13.7046, lng: -89.2182 },
    { name: 'Complejo Educativo Walter A. Soundy', country: 'El Salvador', lat: 13.7100, lng: -89.2250 },
    { name: 'Centro Escolar Marcelino Garc\u00eda Flamenco', country: 'El Salvador', lat: 13.6950, lng: -89.2100 },
    { name: 'Centro Escolar Cat\u00f3lico Luisa de Marillac', country: 'El Salvador', lat: 13.7200, lng: -89.2300 },
    { name: 'Centro Escolar Colonia San Ram\u00f3n', country: 'El Salvador', lat: 13.7300, lng: -89.1950 },
    { name: 'Complejo Educativo Amalia Vda de Men\u00e9ndez', country: 'El Salvador', lat: 13.6800, lng: -89.2400 },
    { name: 'Centro Escolar Napole\u00f3n R\u00edos', country: 'El Salvador', lat: 13.7150, lng: -89.2050 },
    { name: 'Centro Escolar General Ram\u00f3n Belloso', country: 'El Salvador', lat: 13.7050, lng: -89.1900 },
    { name: 'Complejo Educativo Capit\u00e1n General Gerardo Barrios', country: 'El Salvador', lat: 13.7250, lng: -89.2200 },
    { name: 'Centro Escolar Rep\u00fablica de Canad\u00e1', country: 'El Salvador', lat: 13.7350, lng: -89.2100 },
    { name: 'Centro Escolar Alberto Guerra Trigueros', country: 'El Salvador', lat: 13.7000, lng: -89.2350 },
    { name: 'Centro Escolar San Francisco', country: 'El Salvador', lat: 13.6875, lng: -89.2050 },
    { name: 'Complejo Educativo Rep\u00fablica de Per\u00fa', country: 'El Salvador', lat: 13.7400, lng: -89.1850 },
    { name: 'Escuela Parroquial San Jos\u00e9 de la Monta\u00f1a', country: 'El Salvador', lat: 13.8500, lng: -89.0500 },
    { name: 'Centro Escolar Herbert De Sola', country: 'El Salvador', lat: 13.7100, lng: -89.2150 },
    { name: 'Centro Escolar Caser\u00edo Las Flores', country: 'El Salvador', lat: 13.7500, lng: -89.1700 },
    { name: 'Centro Escolar Margarita Dur\u00e1n', country: 'El Salvador', lat: 13.6700, lng: -89.2450 },
    { name: 'Centro Escolar Caser\u00edo Villa Esperanza', country: 'El Salvador', lat: 13.7600, lng: -89.1600 },

    // Guatemala (15)
    { name: 'INEB Oscar Berger', country: 'Guatemala', lat: 14.5400, lng: -90.7330 },
    { name: 'Escuela Oficial para Ni\u00f1as No. 26 (Jos\u00e9 Mar\u00eda Fuentes)', country: 'Guatemala', lat: 14.6300, lng: -90.5150 },
    { name: 'Escuela Oficial Urbana para Ni\u00f1as No. 44 (Juan de Francisco Mart\u00ed)', country: 'Guatemala', lat: 14.6200, lng: -90.5200 },
    { name: 'INEB Pablo Neruda', country: 'Guatemala', lat: 14.5600, lng: -90.7100 },
    { name: 'Escuela Oficial Urbana Mixta No. 598', country: 'Guatemala', lat: 14.6100, lng: -90.5300 },
    { name: 'INEB La Esperanza', country: 'Guatemala', lat: 14.5800, lng: -90.6800 },
    { name: 'Escuela Oficial Urbana Mixta El Mezquital JV', country: 'Guatemala', lat: 14.5050, lng: -90.6950 },
    { name: 'Escuela Oficial Rural Mixta No.843 (Bertha Herrera de Ruano J.V.)', country: 'Guatemala', lat: 14.4900, lng: -90.6900 },
    { name: 'Escuela Oficial Rural Mixta INEB Tierra Blanca', country: 'Guatemala', lat: 14.2000, lng: -91.0000 },
    { name: 'Escuela Oficial Urbana Mixta 594-B', country: 'Guatemala', lat: 14.5900, lng: -90.5400 },
    { name: 'Escuela Oficial Urbana Mixta El Mezquital JM', country: 'Guatemala', lat: 14.5100, lng: -90.6980 },
    { name: 'Escuela Oficial Urbana No. 32 (Rep\u00fablica Oriental del Uruguay)', country: 'Guatemala', lat: 14.6400, lng: -90.5100 },
    { name: 'Escuela Oficial Rural Mixta No. 843 (Bertha Herrera de Ruano J.M.)', country: 'Guatemala', lat: 14.4850, lng: -90.6850 },
    { name: 'Escuela Oficial Urbana Mixta Tierra Blanca', country: 'Guatemala', lat: 14.2050, lng: -90.9950 },
    { name: 'Escuela Oficial Urbana Mixta No. 146 (Lic. Eduardo C\u00e1ceres Lehnhoff)', country: 'Guatemala', lat: 14.6500, lng: -90.5050 },

    // Honduras (12)
    { name: 'CEB Jos\u00e9 Trinidad Caba\u00f1as (San Jos\u00e9 del Boquer\u00f3n)', country: 'Honduras', lat: 14.0600, lng: -87.2100 },
    { name: 'CEB Marcelino Pineda L\u00f3pez', country: 'Honduras', lat: 14.1050, lng: -87.2050 },
    { name: 'CEB Manuel Bonilla', country: 'Honduras', lat: 14.0990, lng: -87.2100 },
    { name: 'CEBG Las Am\u00e9ricas', country: 'Honduras', lat: 14.1150, lng: -87.2180 },
    { name: 'CEBG Dr. Ram\u00f3n Rosa N\u00b02', country: 'Honduras', lat: 14.1200, lng: -87.2230 },
    { name: 'CEB Jos\u00e9 Trinidad Caba\u00f1as (Villanueva)', country: 'Honduras', lat: 15.3200, lng: -88.0200 },
    { name: 'CEB Jos\u00e9 Castro L\u00f3pez', country: 'Honduras', lat: 14.0940, lng: -87.2000 },
    { name: 'CEBG Tim Hines', country: 'Honduras', lat: 14.1100, lng: -87.2120 },
    { name: 'CEBG Rep\u00fablica de China', country: 'Honduras', lat: 14.0880, lng: -87.1980 },
    { name: 'CEBG Rep\u00fablica de Honduras', country: 'Honduras', lat: 14.1300, lng: -87.2280 },
    { name: 'CEB Estado de Israel', country: 'Honduras', lat: 14.0820, lng: -87.1950 },
    { name: 'Escuela Dr. Modesto Rodas Alvarado', country: 'Honduras', lat: 14.1350, lng: -87.2350 },

    // Mexico (7)
    { name: 'Escuela Primaria Profesor Manuel Aguilar S\u00e1enz', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Escuela Secundaria Jos\u00e9 Natividad Mac\u00edas', country: 'Mexico', lat: 19.4100, lng: -99.1500 },
    { name: 'Escuela Primaria LIC. Gabriela Ramos Mill\u00e1n', country: 'Mexico', lat: 19.4500, lng: -99.1200 },
    { name: 'Escuela Primaria Vicente Guerrero', country: 'Mexico', lat: 18.9000, lng: -99.2300 },
    { name: 'Escuela Primaria 5 de Febrero', country: 'Mexico', lat: 19.4800, lng: -99.0800 },
    { name: 'Escuela Primaria Rafael Ar\u00e9valo Mart\u00ednez', country: 'Mexico', lat: 19.3800, lng: -99.1700 },
    { name: 'Escuela Primaria Marcos Enrique Becerra', country: 'Mexico', lat: 19.4200, lng: -99.1900 },

    // Panama (2)
    { name: 'Centro Educativo Juan B. Sosa', country: 'Panama', lat: 8.9936, lng: -79.5197 },
    { name: 'Centro Educativo Mar\u00eda Ossa de Amador', country: 'Panama', lat: 8.9870, lng: -79.5130 }
  ];

  // ── Country cluster halos — soft coral glow behind dense clusters ─────────
  // Rendered first so dots sit on top.
  var clusterHalos = [
    { lat: 13.72, lng: -89.22, radius: 28000, label: 'El Salvador' }, // 18 schools
    { lat: 14.55, lng: -90.60, radius: 28000, label: 'Guatemala' }, // 15 schools
    { lat: 14.10, lng: -87.21, radius: 22000, label: 'Honduras' }, // 12 schools
    { lat: 19.42, lng: -99.15, radius: 22000, label: 'Mexico' }  // 7 schools
  ];

  clusterHalos.forEach(function (h) {
    L.circle([h.lat, h.lng], {
      radius: h.radius,
      color: '#E59D83',
      weight: 0,
      fillColor: '#F4AE96',
      fillOpacity: 0.18,
      interactive: false,
      className: 'aot-cluster-halo'
    }).addTo(map);
  });

  // ── Render coming-soon pins ────────────────────────────────────────────────
  soonSites.forEach(function (s) {
    var m = L.circleMarker([s.lat, s.lng], cs)
      .addTo(map)
      .bindPopup(soonPopupHTML(s.name, s.country), { maxWidth: 240 });

    m.on('mouseover', function () { this.setStyle(csHover); });
    m.on('mouseout', function () { this.setStyle(cs); });
  });

})();