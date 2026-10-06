/* EUROPEAN CHRISTMAS MARKETS 2026 — the guide behind /christmas-markets.
 *
 * Built Oct 6 2026 from the research run
 * internal/research/european-christmas-markets/2026-10-06T15-15/ after two
 * verification passes (175 findings: 107 confirmed, 61 corrected, 1 refuted,
 * 6 unverifiable). ONLY confirmed findings, or the verifier's corrected
 * wording for weakened ones, appear here. Unverifiable findings (Dresden's
 * 2026 dates, Kraków's, Rothenburg's, Zurich's Polarzauber) are left out on
 * purpose, not forgotten.
 *
 * Researched, not visited: the founders have not been to these markets, so
 * nothing here is gold except the Dublin Christmas trip, which they made.
 * Money follows the house rule: ranges with a source and a season, never a
 * single price from us. Official fixed fees are left out until the founders
 * rule on them (open question from the Pictured Rocks pilot).
 *
 * Re-check in mid-November: Strasbourg's closing date, Colmar's car-free
 * dates and every hour below can change when organisers publish final plans.
 */

export const CHECKED_ON = '2026-10-06'

/* tags: classic (the big famous squares), small (small towns and villages),
 * family (rides, rinks or a park). "Open after Christmas" is computed from end. */
export const MARKETS = [
  {
    id: 'schonbrunn',
    city: 'Vienna',
    country: 'Austria',
    name: 'Schönbrunn Palace',
    start: '2026-11-06',
    end: '2027-01-06',
    tags: [],
    note: 'In the palace forecourt under a new operator. The old one left after 2023 and many guides still say the market closed. It did not.',
    src: [
      'https://www.wien.info/de/aktuell/veranstaltungen/weihnachtsmarkt-schloss-schoenbrunn-1133662',
    ],
  },
  {
    id: 'rathausplatz',
    city: 'Vienna',
    country: 'Austria',
    name: 'Christkindlmarkt, Rathausplatz',
    start: '2026-11-13',
    end: '2026-12-26',
    tags: ['classic', 'family'],
    note: 'The city’s most popular market, in front of City Hall: more than 100 stalls, open daily 10:00–22:00 (18:30 on Christmas Eve), with an ice rink beside it until Jan 6.',
    src: [
      'https://www.christkindlmarkt.at/',
      'https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe',
    ],
  },
  {
    id: 'spittelberg',
    city: 'Vienna',
    country: 'Austria',
    name: 'Spittelberg',
    start: '2026-11-13',
    end: '2026-12-23',
    tags: [],
    note: 'Spread through the narrow lanes of the 7th district rather than one square, beside the MuseumsQuartier.',
    src: ['https://www.spittelberg.at/'],
  },
  {
    id: 'belvedere',
    city: 'Vienna',
    country: 'Austria',
    name: 'Belvedere Palace',
    start: '2026-11-20',
    end: '2026-12-31',
    tags: [],
    note: 'Listed by the Vienna Tourist Board as the K&K Christmas Market at Belvedere Palace. Older guides link an organiser site that now belongs to someone else.',
    src: ['https://www.wien.info/en/shopping-wining-dining/markets/christmas-markets'],
  },
  {
    id: 'bazilika',
    city: 'Budapest',
    country: 'Hungary',
    name: 'Advent Bazilika',
    start: '2026-11-13',
    end: '2027-01-01',
    tags: [],
    note: 'On Szent István tér in front of St Stephen’s Basilica. Open Christmas Day and Boxing Day, until 03:00 on New Year’s Eve, and still running on New Year’s Day.',
    src: ['https://adventbazilika.hu/en/opening-hours/'],
  },
  {
    id: 'tivoli',
    city: 'Copenhagen',
    country: 'Denmark',
    name: 'Christmas in Tivoli',
    start: '2026-11-13',
    end: '2027-01-03',
    tags: ['family'],
    note: 'A ticketed Christmas park rather than an open square: rides, nightly tree-lighting, glögg and æbleskiver. Guides report it closed on Christmas Eve.',
    src: ['https://www.tivoli.dk/en/praktisk/aabningstider', 'https://www.tivoli.dk/en/jul'],
  },
  {
    id: 'cologne',
    city: 'Cologne',
    country: 'Germany',
    name: 'Cathedral market, Roncalliplatz',
    start: '2026-11-16',
    end: '2026-12-23',
    tags: ['classic'],
    note: 'Under the cathedral. Closed Sunday Nov 22 (Totensonntag) and over on Dec 23, with no Christmas Eve opening.',
    src: ['https://www.koelnerweihnachtsmarkt.com/'],
  },
  {
    id: 'salzburg',
    city: 'Salzburg',
    country: 'Austria',
    name: 'Christkindlmarkt, Domplatz',
    start: '2026-11-19',
    end: '2027-01-01',
    tags: ['classic'],
    note: 'Fills the Domplatz and Residenzplatz. Open Christmas Day and Boxing Day 11:00–18:00, and through to New Year’s Day.',
    src: ['https://www.christkindlmarkt.co.at/'],
  },
  {
    id: 'munich',
    city: 'Munich',
    country: 'Germany',
    name: 'Christkindlmarkt, Marienplatz',
    start: '2026-11-20',
    end: '2026-12-24',
    tags: ['classic'],
    note: 'New for 2026: it opens on the Friday before Totensonntag, so guides using the old rule give a late date. Includes the Kripperlmarkt for nativity figures by the Alter Peter church. Closes 14:00 on Christmas Eve.',
    src: ['https://www.muenchen.de/christkindlmarkt', 'https://www.christkindlmarkt-muenchen.de/'],
  },
  {
    id: 'aachen',
    city: 'Aachen',
    country: 'Germany',
    name: 'Around the cathedral and town hall',
    start: '2026-11-20',
    end: '2026-12-23',
    tags: [],
    note: 'Between the Carolingian cathedral and the medieval town hall, known for Aachener Printen, a hard spiced gingerbread. Time Out ranked it 12th in Europe for 2025.',
    src: ['https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe'],
  },
  {
    id: 'montreux',
    city: 'Montreux',
    country: 'Switzerland',
    name: 'Montreux Noël',
    start: '2026-11-20',
    end: '2026-12-24',
    tags: ['small'],
    note: 'Along the quays of Lake Geneva rather than a town square. Stalls stay open until 21:00–22:00 most evenings; 11:00–17:00 on Christmas Eve.',
    src: ['https://www.montreuxnoel.com/en/'],
  },
  {
    id: 'bruges',
    city: 'Bruges',
    country: 'Belgium',
    name: 'Winter Glow, the Markt',
    start: '2026-11-20',
    end: '2027-02-14',
    tags: ['small'],
    note: 'The market sits inside the city’s wider Winter Glow season, which runs to Feb 14. The tourism site does not publish separate dates for the stalls.',
    src: ['https://www.visitbruges.be/en/winter-glow'],
  },
  {
    id: 'colmar',
    city: 'Colmar',
    country: 'France',
    name: 'Six old-town markets',
    start: '2026-11-23',
    end: '2026-12-29',
    tags: ['small', 'family'],
    note: 'Six small markets through half-timbered streets and the canal quarter called Little Venice. Open on Christmas Day; the gourmet market and Ferris wheel run to Jan 3.',
    src: [
      'https://www.noel-colmar.com/',
      'https://www.noel-colmar.com/en/colmar-the-magic-of-christmas/practical',
    ],
  },
  {
    id: 'basel',
    city: 'Basel',
    country: 'Switzerland',
    name: 'Barfüsserplatz and Münsterplatz',
    start: '2026-11-26',
    end: '2026-12-23',
    tags: [],
    note: 'Daily 11:00–20:30. Over on Dec 23, with no Christmas Eve opening.',
    src: ['https://www.bs.ch/weihnachtsmarkt'],
  },
  {
    id: 'nuremberg',
    city: 'Nuremberg',
    country: 'Germany',
    name: 'Christkindlesmarkt, Hauptmarkt',
    start: '2026-11-27',
    end: '2026-12-24',
    tags: ['classic'],
    note: 'Time Out’s number one in Europe for 2025. Opens with the Prolog on Nov 27 at 17:30; 10:00–21:00 daily; closes 14:00 on Christmas Eve.',
    src: [
      'https://www.christkindlesmarkt.de/en/',
      'https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe',
    ],
  },
  {
    id: 'strasbourg',
    city: 'Strasbourg',
    country: 'France',
    name: 'Christkindelsmärik',
    start: '2026-11-27',
    end: null,
    tags: ['classic'],
    note: 'Opening confirmed for Friday Nov 27, across about eight old-town squares. The city has not published the 2026 closing date or hours yet.',
    src: ['https://noel.strasbourg.eu/'],
  },
  {
    id: 'riquewihr',
    city: 'Riquewihr',
    country: 'France',
    name: 'Village market',
    start: '2026-11-27',
    end: '2026-12-20',
    tags: ['small'],
    note: 'One of the best-known Alsace village markets near Colmar. It ends on Dec 20, so a late-December trip misses it.',
    src: ['https://www.noel-colmar.com/'],
  },
  {
    id: 'kaysersberg',
    city: 'Kaysersberg',
    country: 'France',
    name: 'Village market',
    start: '2026-11-27',
    end: '2026-12-20',
    tags: ['small'],
    note: 'Friday to Sunday only, and finished by Dec 20.',
    src: ['https://www.noel-colmar.com/'],
  },
  {
    id: 'brussels',
    city: 'Brussels',
    country: 'Belgium',
    name: 'Winter Wonders',
    start: '2026-11-27',
    end: '2027-01-03',
    tags: ['classic'],
    note: 'About 238 chalets across eight sites, plus a sound and light show on the Grand-Place. Daily 12:00–22:00; 18:00 on Dec 24, Dec 31 and Jan 3.',
    src: ['https://www.plaisirsdhiver.be/en/practical-info'],
  },
  {
    id: 'prague-old',
    city: 'Prague',
    country: 'Czechia',
    name: 'Old Town Square',
    start: '2026-11-28',
    end: '2027-01-06',
    tags: ['classic'],
    note: 'The city’s headline market, a short walk from the second one on Wenceslas Square. Both run into January.',
    src: ['https://www.kudyznudy.cz/akce/vanocni-trhy-v-praze-staromestske-namesti-a-vacl'],
  },
  {
    id: 'prague-wenceslas',
    city: 'Prague',
    country: 'Czechia',
    name: 'Wenceslas Square',
    start: '2026-11-28',
    end: '2027-01-06',
    tags: [],
    note: 'Same organiser as Old Town Square. The square is about 750 m long, so the stalls are spread out.',
    src: ['https://prague.eu/cs/akce/vanocni-trhy-vaclavske-namesti/'],
  },
  {
    id: 'zagreb',
    city: 'Zagreb',
    country: 'Croatia',
    name: 'Advent in Zagreb',
    start: '2026-11-28',
    end: '2027-01-07',
    tags: [],
    note: 'A city-wide programme of markets at many locations rather than one square. The latest-running on this list.',
    src: [
      'https://www.tportal.hr/vijesti/clanak/tko-ce-sudjelovati-na-adventu-u-zagrebu-raspisan-drugi-krug-natjecaja-20260727',
    ],
  },
  {
    id: 'vilnius',
    city: 'Vilnius',
    country: 'Lithuania',
    name: 'Cathedral Square',
    start: '2026-11-28',
    end: '2026-12-27',
    tags: [],
    note: 'Called underrated and postcard-pretty by Time Out, with wooden handicrafts and fewer tourists than the Central European giants.',
    src: [
      'https://www.govilnius.lt/christmas-2026-starts-early-in-vilnius-festive-dates-announced',
    ],
  },
]

/* City guides: what it is known for, the catch, where to stay, and reasons to
 * go beyond the stalls. Every line traces to a verified finding. */
export const CITIES = [
  {
    id: 'vienna',
    name: 'Vienna',
    markets: ['schonbrunn', 'rathausplatz', 'spittelberg', 'belvedere'],
    photo: 'schonbrunn',
    lede: 'The longest season of the big cities: four markets, two of them in palace grounds, the first opening Nov 6.',
    known:
      'Rathausplatz is the showpiece. Spittelberg trades the big square for lanes in the 7th district, and the palaces at Schönbrunn and Belvedere make the most of their settings.',
    beyond:
      'The Wien Museum’s permanent exhibition on the city’s history has no admission charge for anyone. The ice rink at Rathausplatz runs until Jan 6.',
    trap: 'The S-Bahn line through the city centre is closed all season. The airport train (S7) stops at Wien St. Marx, and the City Airport Train runs as a nonstop coach to Wien Mitte in about 21 minutes instead. Guides telling you to take the train to Wien Mitte are out of date.',
    stay: 'The Innere Stadt (1st district) puts every evening on foot but is the busiest base. Neubau (7th) sits by Spittelberg, with Rathausplatz a walk away. Whole-flat rentals over 90 days a year need a city exception, so a listing open all season may be breaking the rules.',
    drinks:
      'Punch and mulled wine cost about EUR 4.50–10.50 a mug in 2024, plus a refundable mug deposit. Prices have risen every recent season.',
    src: [
      'https://www.oebb.at/de/fahrplan/baustelleninformation/bauarbeiten-stammstrecke/bauphase2',
      'https://www.cityairporttrain.com/en/',
      'https://www.derstandard.at/story/3000000191326/freier-eintritt-im-neuen-wienmuseum',
      'https://www.vienna.at/big-punch-test-vienna-christmas-markets-in-price-comparison/9098179',
      'https://shorttermrentalz.com/news/vienna-tighter-rules-july-2024/',
    ],
  },
  {
    id: 'nuremberg',
    name: 'Nuremberg',
    markets: ['nuremberg'],
    photo: null,
    lede: 'The market the lists put first: one square, one fountain spire, and the city’s own gingerbread and sausages.',
    known:
      'Nuremberg gingerbread, small Nuremberg bratwurst, glühwein and smoked beer, on the Hauptmarkt under its ornate fountain. The 2026 season opens with the Prolog ceremony on Nov 27 at 17:30.',
    beyond:
      'The mugs are dated collector pieces printed with the year: keep one and you have bought it.',
    trap: 'It closes for good at 14:00 on Christmas Eve. A Christmas-week room in the old town puts you beside a square being dismantled.',
    stay: 'The walled Altstadt for walking to everything. Gostenhof, just outside the walls, is the quieter, more local base.',
    drinks:
      'Glühwein ran about EUR 4.50–5.00 in 2025, plus the mug deposit. Cash still matters here; the market added its own token alongside cash and cards in 2024.',
    src: [
      'https://www.christkindlesmarkt.de/en/',
      'https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe',
      'https://web.de/magazine/reise/weihnachtsmaerkte-2025-gluehwein-guenstigsten-41574688',
    ],
  },
  {
    id: 'munich',
    name: 'Munich',
    markets: ['munich'],
    photo: 'munichMarienplatz',
    lede: 'A big-city market around Marienplatz, and the natural first stop on a train route east to Salzburg and Vienna.',
    known:
      'The city-run market fills Marienplatz, with a Christmas pyramid on the Rindermarkt and the Kripperlmarkt for nativity figures, which the city calls probably the largest of its kind in Germany.',
    beyond:
      'Many Bavarian state museums, including the Alte Pinakothek and Museum Brandhorst, drop to a token charge on Sundays, and the market spans five Sundays.',
    trap: 'Munich moved its opening rule for 2026. Guides using the old pattern give a start date a week late.',
    stay: 'Near Marienplatz to walk in. The S8 from the airport stops there, in roughly 40–45 minutes.',
    drinks:
      'Glühwein at Marienplatz ran about EUR 5.00–6.00 in 2025, plus a mug deposit at the low end of the regional range.',
    src: [
      'https://www.muenchen.de/christkindlmarkt',
      'https://muenchen.de/sehenswuerdigkeiten/museen/guenstige-und-kostenlose-museen-muenchen',
      'https://thebettervacation.com/munich/getting-around-munich/',
    ],
  },
  {
    id: 'prague',
    name: 'Prague',
    markets: ['prague-old', 'prague-wenceslas'],
    photo: 'pragueOldTown',
    lede: 'Two markets a short walk apart, both running to Jan 6, where a pub beer costs less than a cup of market mulled wine.',
    known:
      'Old Town Square is the postcard; Wenceslas Square is the long second act. Both run into January.',
    beyond:
      'Smaller neighbourhood markets such as náměstí Míru are cheaper than the two headline squares, and a pub beer costs well under a cup of market mulled wine.',
    trap: 'Prague ham is sold by weight. Ask for a set amount (about 100 g for a snack) before it is carved, or the bill can land well above the board price.',
    stay: 'The Old Town puts the market at the door but is loud at night. Vinohrady, east of Wenceslas Square, is quieter, residential and a short ride in.',
    drinks:
      'Mulled wine (svařák) ran CZK 60–100 a cup in December 2025, highest on the main squares; street food about CZK 80–240.',
    src: [
      'https://www.seznamzpravy.cz/clanek/domaci-zivot-v-cesku-klobasa-za-160-svarak-za-stovku-kolik-zaplatite-na-vanocnich-trzich-293192',
      'https://livingprague.com/festivals-holidays/prague-christmas-markets-eight-things-know/',
      'https://esim.holafly.com/trip-planning/where-not-stay-prague/',
    ],
  },
  {
    id: 'alsace',
    name: 'Strasbourg and Colmar',
    markets: ['strasbourg', 'colmar', 'riquewihr', 'kaysersberg'],
    photo: null,
    lede: 'Strasbourg calls itself the Capital of Christmas. Colmar and the wine villages around it are the small, half-timbered version.',
    known:
      'Strasbourg’s market spreads across about eight squares of the river-ringed old centre. Colmar is six small markets through half-timbered streets and Little Venice.',
    beyond:
      'Strasbourg’s one-day museums pass pays for itself from about three museums. The village markets of Riquewihr and Kaysersberg are the reason to hire a car for a day.',
    trap: 'Strasbourg is busiest Wednesday afternoons, Friday evenings and weekends, and quietest on Monday and Tuesday mornings. Cars are banned from the old centre in market hours, so park at the edge and take the tram. Riquewihr and Kaysersberg close on Dec 20.',
    stay: 'The Grande Île books out early in market season. Kehl, across the Rhine in Germany, is the overflow base on tram line D.',
    drinks: 'No verified 2025–26 drink prices for Alsace yet.',
    src: [
      'https://noel.strasbourg.eu/en/frequently-asked-questions',
      'https://www.noel-colmar.com/',
      'https://www.strasbourg.eu/web/musees/tarifs-musees-de-strasbourg',
    ],
  },
  {
    id: 'salzburg',
    name: 'Salzburg',
    markets: ['salzburg'],
    photo: null,
    lede: 'A cathedral-square market between Munich and Vienna that stays open through New Year.',
    known: 'The Christkindlmarkt fills the Domplatz and Residenzplatz in the old town.',
    beyond:
      'It is one of the few classics still open on Christmas Day and Boxing Day, which makes it the anchor for a late-December route.',
    trap: 'On Christmas Eve it closes at 15:00.',
    stay: 'The old town around the two squares, about 1h40 by Railjet from Munich and 2h20 from Vienna.',
    drinks: 'Austrian markets add a refundable mug deposit of about EUR 3–5 to your first drink.',
    src: [
      'https://www.christkindlmarkt.co.at/',
      'https://www.seat61.com/trains-and-routes/munich-to-salzburg-by-train.htm',
    ],
  },
  {
    id: 'budapest',
    name: 'Budapest',
    markets: ['bazilika'],
    photo: null,
    lede: 'Two markets 300 m apart, live music every night, and open on New Year’s Day.',
    known:
      'Advent Bazilika in front of St Stephen’s Basilica, and Vörösmarty tér nearby, described as the city’s oldest and most traditional market, with jazz, folk and blues every evening, goulash and strudel.',
    beyond:
      'Advent Bazilika stays open until 03:00 on New Year’s Eve and reopens on New Year’s Day.',
    trap: 'Since Jan 1, 2026, District VI (Terézváros) bans Airbnb-style short-stay flats. Check which district a flat is in before paying.',
    stay: 'District V puts you between both markets. District VII is the ruin-bar quarter: central, and noisy at weekends.',
    drinks: 'No verified 2025–26 market prices for Budapest yet.',
    src: [
      'https://adventbazilika.hu/en/opening-hours/',
      'https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe',
      'https://www.themayor.eu/en/a/view/budapest-is-the-latest-european-city-to-ban-short-term-rentals-12771',
    ],
  },
  {
    id: 'belgium',
    name: 'Brussels and Bruges',
    markets: ['brussels', 'bruges'],
    photo: null,
    lede: 'A capital-sized market and a medieval old town, both open into January.',
    known:
      'Brussels Winter Wonders spreads about 238 chalets over eight sites, with a sound and light show on the Grand-Place. Bruges sets its stalls on the Markt inside a winter season that runs to mid-February.',
    beyond:
      'In Bruges: crystal ornaments, hand-knitted woollens and jenever tastings, with mussels and Flemish stew nearby.',
    trap: 'In Brussels the light show is on the Grand-Place but the chalets are elsewhere, around the Bourse, De Brouckère, Sainte-Catherine and the Vismet.',
    stay: 'Central Brussels near the chalet sites; Bruges’ old town for the market.',
    drinks: 'No verified 2025–26 market prices for Belgium yet.',
    src: [
      'https://www.plaisirsdhiver.be/',
      'https://www.visitbruges.be/en/winter-glow',
      'https://www.timeout.com/europe/things-to-do/best-christmas-markets-in-europe',
    ],
  },
]

/* Rail routes where every stop is open on the same dates. Times are typical
 * fastest services; the 2027 timetable starts mid-December and can shift them. */
export const ROUTES = [
  {
    id: 'danube',
    name: 'The Danube classic',
    stops: ['munich', 'salzburg', 'rathausplatz', 'bazilika'],
    legs: [
      'Munich → Salzburg: about 1h40',
      'Salzburg → Vienna: about 2h20–2h25, two Railjets an hour',
      'Vienna → Budapest: about 2h30–2h40 (optional fourth stop)',
    ],
    window: 'All four are open Nov 20 – Dec 24.',
    tip: 'Fly into Munich and home from Vienna (or the reverse) and you never backtrack.',
    src: [
      'https://www.seat61.com/trains-and-routes/munich-to-salzburg-by-train.htm',
      'https://www.seat61.com/trains-and-routes/vienna-to-salzburg-by-train.htm',
    ],
  },
  {
    id: 'bohemia',
    name: 'Bohemia to the Danube',
    stops: ['prague-old', 'rathausplatz', 'bazilika'],
    legs: ['Prague → Vienna: about 4h to 4h15 by Railjet', 'Vienna → Budapest: about 2h30–2h40'],
    window: 'All three are open Nov 28 – Dec 26.',
    tip: 'Prague’s markets run to Jan 6, so this route also works in reverse after Christmas.',
    src: ['https://www.seat61.com/international-trains/trains-from-Prague.htm'],
  },
  {
    id: 'after',
    name: 'After Christmas Day',
    stops: ['rathausplatz', 'salzburg', 'bazilika', 'prague-old', 'brussels'],
    legs: [
      'Vienna to Dec 26',
      'Colmar to Dec 29',
      'Salzburg and Budapest to Jan 1',
      'Brussels and Tivoli to Jan 3',
      'Prague to Jan 6',
    ],
    window: 'The German and Swiss headline markets are already shut.',
    tip: 'Bavarian school holidays run Dec 24 to Jan 8, so expect family crowds in the Alps.',
    src: [
      'https://www.christkindlmarkt.at/',
      'https://www.km.bayern.de/ministerium/termine/ferientermine.html',
    ],
  },
]

export const WHEN = [
  {
    k: 'Best window',
    title: 'Weekdays, opening week to Dec 18',
    body: 'Every major market is open and weekday mornings are the quietest. Strasbourg’s own guidance names Monday and Tuesday mornings.',
    src: 'https://noel.strasbourg.eu/en/frequently-asked-questions',
  },
  {
    k: 'Busiest',
    title: 'Advent weekends',
    body: 'Nov 28–29, Dec 5–6, 12–13 and 19–20, especially Saturdays from late afternoon. Hotel prices are reported to rise on those weekends.',
    src: 'https://noel.strasbourg.eu/en/frequently-asked-questions',
  },
  {
    k: 'The trap',
    title: 'Christmas week itself',
    body: 'Cologne and Basel close Dec 23; Nuremberg and Munich at 14:00 on Christmas Eve. None reopen. Poland made Christmas Eve a statutory day off in 2025, so expect its markets to be closed or limited that day.',
    src: 'https://www.koelnerweihnachtsmarkt.com/',
  },
  {
    k: 'The weather',
    title: 'Cold, wet, dark early',
    body: 'Vienna and Salzburg average roughly −2 °C lows and 4 °C highs in December. The markets are best after dark anyway.',
    src: 'https://www.wien.info/en/climate-and-weather-in-vienna-709530',
  },
]

export const FLY = [
  {
    title: 'Fly into a gateway city',
    body: 'The big market cities have their own international airports, so fly straight into one rather than a market town. Munich and Vienna anchor the Danube route; Prague, Budapest and Brussels anchor theirs.',
    src: 'https://roame.travel/flightmap/ORD/VIE',
  },
  {
    title: 'In one city, home from another',
    body: 'Flying into Munich and home from Vienna (or the reverse) covers the whole Danube route by train with no backtracking. Check the price against a round trip.',
    src: 'https://www.airlineinformation.com/ORD-MUC',
  },
  {
    title: 'When to book',
    body: 'Google’s 2021–25 data on US departures puts the lowest Christmas fares about 51 days out (within 32–73 days), so mid-October to mid-November. Some booking sites say June to early October instead; treat late booking as the riskier bet.',
    src: 'https://blog.google/products/search/holiday-travel-trends-2025/',
  },
  {
    title: 'Watch the airport name',
    body: 'Low-cost airports borrow big-city names. Memmingen, sold as “Munich West”, is about two hours from Munich; Frankfurt-Hahn is about 120 km from Frankfurt. The transfer can eat the saving.',
    src: 'https://germanyhandbook.com/?p=5113',
  },
  {
    title: 'Basic economy and a winter bag',
    body: 'Basic fares often charge for checked bags, and cold-weather layers usually need one. Price the bag in before you compare.',
    src: 'https://www.going.com/guides/the-ultimate-guide-to-basic-economy-on-international-flights-from-the-us',
  },
  {
    title: 'Flying from the US Midwest',
    body: 'Chicago O’Hare has nonstops to Munich (about 8h30) and to Vienna 4–5 times a week this winter; Vienna pauses Jan 9 – Feb 7. No winter Detroit–Munich nonstop was found; KLM keeps Minneapolis–Amsterdam at three a week until Jan 4.',
    src: 'https://www.airlineinformation.com/ORD-MUC',
  },
]

export const MONEY = [
  {
    title: 'The mug deposit',
    body: 'Your first hot drink costs the drink plus a deposit of about EUR 3–5, refunded in cash when you return the mug. Keep the mug and you have bought it.',
    src: 'https://www.vienna.at/big-punch-test-vienna-christmas-markets-in-price-comparison/9098179',
  },
  {
    title: 'What a drink costs',
    body: 'Glühwein at German markets ran about EUR 3.50–6.00 in 2025; Vienna’s punch about EUR 4.50–10.50 in 2024; Prague’s svařák CZK 60–100 in 2025.',
    src: 'https://web.de/magazine/reise/weihnachtsmaerkte-2025-gluehwein-guenstigsten-41574688',
  },
  {
    title: 'Bring cash',
    body: 'Card acceptance is spreading stall by stall, but German markets are not cashless yet, and deposit refunds are the main reason.',
    src: 'https://www.heidelberg24.de/verbraucher/weihnachtsmarkt-ohne-bargeld-erster-cashless-markt-verhaengt-strafe-bei-barzahlung-zr-94035733.html',
  },
  {
    title: 'Always pay in the local currency',
    body: 'Card terminals and ATMs offer to charge your US card in dollars. Say no: it adds a conversion markup. Standalone ATMs at markets also charge an operator fee; a bank-branded machine usually does not.',
    src: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R0518',
  },
  {
    title: 'Tipping',
    body: 'About 10 percent, or rounding up, in Austrian and German restaurants and cafés.',
    src: 'https://vienna-unwrapped.com/tipping-in-austria/',
  },
  {
    title: 'A day at the markets in Vienna',
    body: 'Adding up sourced prices, not a published figure: about EUR 30–60 a person on a shoestring, EUR 63–127 mid-range and EUR 93–181 for comfort, before your room and paid sights.',
    src: 'https://www.numbeo.com/cost-of-living/in/Vienna',
  },
]

export const MOVE = [
  {
    title: 'Eurail is now Interrail',
    body: 'Since September 2026 US travellers buy an Interrail Pass, the same product under a new name. Youth fares cover anyone 27 or under on the start date. High-speed and night trains usually need a paid seat reservation on top.',
    src: 'https://www.interrail.com/en-int/interrail-passes/global-pass',
  },
  {
    title: 'Book Austrian trains early',
    body: 'ÖBB opens booking six months ahead and sells limited cheaper advance fares, so December trains are already on sale. Seat reservations are optional on Austrian domestic trains.',
    src: 'https://www.seat61.com/international-trains/trains-from-Vienna.htm',
  },
  {
    title: 'Germany’s monthly transit ticket',
    body: 'The Deutschland-Ticket covers local transport and regional trains nationwide, not ICE trains. It is a subscription: cancel by the 10th of the month or you pay for the next one too.',
    src: 'https://int.bahn.de/en/faq/deutschlandticket-conditions',
  },
  {
    title: 'Skip the car',
    body: 'Strasbourg and Colmar close their centres to cars in market hours, Austria requires a motorway vignette and winter tyres in wintry conditions, and the big market cities are 1.5–4 hours apart by direct train. A car only earns its keep for the Alsace villages.',
    src: 'https://noel.strasbourg.eu/en/frequently-asked-questions',
  },
]

/* The one gold block: a Christmas trip the founders made. Text is the Dublin
 * framework's own Christmas window verdict, verbatim. */
export const VALIDATED = {
  title: 'Dublin and Galway at Christmas',
  quote:
    'Christmas. Every time. The pubs are full of people who actually live there. Seventy percent local crowd, fire-lit snugs, and the best trad music sessions of any window.',
  href: '/dublin',
}
