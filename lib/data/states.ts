// For countries without states, we'll use a special "N/A" state
export const NO_STATE = "N/A";

export const statesByCountry: Record<string, string[]> = {
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ],
  'Australia': [
    'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
    'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
  ],
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ],
  'France': [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
    'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
    'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
  ],
  'Germany': [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
    'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
    'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
  ],
  'Italy': [
    'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
    'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont',
    'Sardinia', 'Sicily', 'Trentino-South Tyrol', 'Tuscany', 'Umbria', 'Veneto'
  ],
  'Spain': [
    'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands',
    'Cantabria', 'Castile and León', 'Castile-La Mancha', 'Catalonia', 'Extremadura', 'Galicia',
    'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencia'
  ],
  'Portugal': [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro',
    'Guarda', 'Leiria', 'Lisbon', 'Portalegre', 'Porto', 'Santarém', 'Setúbal',
    'Viana do Castelo', 'Vila Real', 'Viseu'
  ],
  'Belgium': [
    'Brussels-Capital Region', 'Flemish Region', 'Walloon Region'
  ],
  'Netherlands': [
    'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg', 'North Brabant',
    'North Holland', 'Overijssel', 'South Holland', 'Utrecht', 'Zeeland'
  ],
  'Switzerland': [
    'Aargau', 'Appenzell Innerrhoden', 'Appenzell Ausserrhoden', 'Basel-Landschaft', 'Basel-Stadt',
    'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 'Lucerne', 'Neuchâtel',
    'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Thurgau',
    'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zürich'
  ],
  'Austria': [
    'Burgenland', 'Carinthia', 'Lower Austria', 'Salzburg', 'Styria', 'Tyrol', 'Upper Austria',
    'Vienna', 'Vorarlberg'
  ],
  'Japan': [
    'Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu'
  ],
  'China': [
    'Beijing', 'Shanghai', 'Guangdong', 'Sichuan', 'Hubei', 'Henan', 'Zhejiang', 'Hunan',
    'Anhui', 'Jiangsu', 'Chongqing', 'Shandong', 'Fujian', 'Guangxi', 'Yunnan', 'Jiangxi',
    'Guizhou', 'Shanxi', 'Shaanxi', 'Hainan', 'Tianjin', 'Hebei', 'Liaoning', 'Jilin',
    'Heilongjiang', 'Inner Mongolia', 'Xinjiang', 'Tibet', 'Qinghai', 'Gansu', 'Ningxia'
  ],
  'Brazil': [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo',
    'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba',
    'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
    'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ],
  'Russia': [
    'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Nizhny Novgorod', 'Kazan',
    'Chelyabinsk', 'Omsk', 'Samara', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Voronezh',
    'Perm', 'Volgograd'
  ],
  'South Korea': [
    'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Sejong',
    'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk',
    'Gyeongnam', 'Jeju'
  ],
  'Singapore': [NO_STATE],
  'Malta': [NO_STATE],
  'Luxembourg': [NO_STATE],
  'Monaco': [NO_STATE],
  'Andorra': [NO_STATE],
  'Liechtenstein': [NO_STATE],
  'San Marino': [NO_STATE],
  'Vatican City': [NO_STATE],
  'Iceland': [NO_STATE],
  'Cyprus': [NO_STATE],
  'Bahrain': [NO_STATE],
  'Qatar': [NO_STATE],
  'Kuwait': [NO_STATE],
  'United Arab Emirates': [NO_STATE],
  'Oman': [NO_STATE],
  'Maldives': [NO_STATE],
  'Seychelles': [NO_STATE],
  'Mauritius': [NO_STATE],
  'Barbados': [NO_STATE],
  'Grenada': [NO_STATE],
  'Saint Lucia': [NO_STATE],
  'Saint Vincent and the Grenadines': [NO_STATE],
  'Antigua and Barbuda': [NO_STATE],
  'Dominica': [NO_STATE],
  'Saint Kitts and Nevis': [NO_STATE],
  'Tuvalu': [NO_STATE],
  'Nauru': [NO_STATE],
  'Palau': [NO_STATE],
  'Marshall Islands': [NO_STATE],
  'Kiribati': [NO_STATE],
  'Micronesia': [NO_STATE],
  'Samoa': [NO_STATE],
  'Tonga': [NO_STATE],
  'Vanuatu': [NO_STATE],
  'Solomon Islands': [NO_STATE],
  'Fiji': [NO_STATE],
  'Comoros': [NO_STATE],
  'São Tomé and Príncipe': [NO_STATE],
  'Cabo Verde': [NO_STATE],
  'Djibouti': [NO_STATE],
  'Equatorial Guinea': [NO_STATE],
  'Eswatini': [NO_STATE],
  'Gambia': [NO_STATE],
  'Guinea-Bissau': [NO_STATE],
  'Lesotho': [NO_STATE],
  'Malawi': [NO_STATE],
  'Rwanda': [NO_STATE],
  'Burundi': [NO_STATE],
  'Togo': [NO_STATE],
  'Benin': [NO_STATE],
  'Liberia': [NO_STATE],
  'Sierra Leone': [NO_STATE],
  'Central African Republic': [NO_STATE],
  'Republic of the Congo': [NO_STATE],
  'Gabon': [NO_STATE],
  'Chad': [NO_STATE],
  'Niger': [NO_STATE],
  'Mali': [NO_STATE],
  'Burkina Faso': [NO_STATE],
  'Guinea': [NO_STATE],
  'Senegal': [NO_STATE],
  'Eritrea': [NO_STATE],
  'South Sudan': [NO_STATE],
  'Namibia': [NO_STATE],
  'Botswana': [NO_STATE],
  'Zambia': [NO_STATE],
  'Zimbabwe': [NO_STATE],
  'Mozambique': [NO_STATE],
  'Madagascar': [NO_STATE],
  'Mauritania': [NO_STATE],
  'Algeria': [NO_STATE],
  'Tunisia': [NO_STATE],
  'Libya': [NO_STATE],
  'Egypt': [NO_STATE],
  'Sudan': [NO_STATE],
  'Ethiopia': [NO_STATE],
  'Somalia': [NO_STATE],
  'Kenya': [NO_STATE],
  'Uganda': [NO_STATE],
  'Tanzania': [NO_STATE],
  'Angola': [NO_STATE],
  'Cameroon': [NO_STATE],
  'Nigeria': [NO_STATE],
  'Ghana': [NO_STATE],
  'Côte d\'Ivoire': [NO_STATE],
  'South Africa': [NO_STATE],
  'Western Sahara': [NO_STATE]
}; 