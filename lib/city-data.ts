export interface City {
  slug: string
  name: string
  population: number
  crimeRate: number
  propertyCrimeRate: number
  medianHomeValue: number
  description: string
}

export interface State {
  slug: string
  name: string
  abbreviation: string
  cities: City[]
}

export const states: State[] = [
  {
    slug: 'alabama', name: 'Alabama', abbreviation: 'AL',
    cities: [
      { slug: 'birmingham', name: 'Birmingham', population: 200733, crimeRate: 48.2, propertyCrimeRate: 30.1, medianHomeValue: 95000, description: 'Largest city in Alabama' },
      { slug: 'montgomery', name: 'Montgomery', population: 200603, crimeRate: 44.8, propertyCrimeRate: 28.5, medianHomeValue: 107000, description: 'State capital of Alabama' },
      { slug: 'huntsville', name: 'Huntsville', population: 215006, crimeRate: 28.3, propertyCrimeRate: 22.4, medianHomeValue: 218000, description: 'Fast-growing tech hub in North Alabama' },
      { slug: 'mobile', name: 'Mobile', population: 187041, crimeRate: 42.1, propertyCrimeRate: 27.8, medianHomeValue: 112000, description: 'Port city on the Gulf Coast' },
      { slug: 'tuscaloosa', name: 'Tuscaloosa', population: 101129, crimeRate: 37.5, propertyCrimeRate: 25.2, medianHomeValue: 175000, description: 'University of Alabama home city' },
    ],
  },
  {
    slug: 'alaska', name: 'Alaska', abbreviation: 'AK',
    cities: [
      { slug: 'anchorage', name: 'Anchorage', population: 291247, crimeRate: 45.8, propertyCrimeRate: 32.4, medianHomeValue: 315000, description: 'Largest city in Alaska' },
      { slug: 'fairbanks', name: 'Fairbanks', population: 32325, crimeRate: 43.2, propertyCrimeRate: 28.7, medianHomeValue: 235000, description: 'Interior Alaska hub' },
      { slug: 'juneau', name: 'Juneau', population: 32255, crimeRate: 29.5, propertyCrimeRate: 21.3, medianHomeValue: 368000, description: 'State capital' },
      { slug: 'sitka', name: 'Sitka', population: 8458, crimeRate: 22.1, propertyCrimeRate: 16.8, medianHomeValue: 325000, description: 'Coastal community in Southeast Alaska' },
      { slug: 'wasilla', name: 'Wasilla', population: 10529, crimeRate: 38.7, propertyCrimeRate: 26.4, medianHomeValue: 265000, description: 'Mat-Su Valley community' },
    ],
  },
  {
    slug: 'arizona', name: 'Arizona', abbreviation: 'AZ',
    cities: [
      { slug: 'phoenix', name: 'Phoenix', population: 1608139, crimeRate: 38.5, propertyCrimeRate: 26.3, medianHomeValue: 365000, description: 'State capital and largest city' },
      { slug: 'tucson', name: 'Tucson', population: 542629, crimeRate: 42.8, propertyCrimeRate: 29.1, medianHomeValue: 265000, description: 'Southern Arizona metro' },
      { slug: 'mesa', name: 'Mesa', population: 504258, crimeRate: 28.4, propertyCrimeRate: 21.2, medianHomeValue: 385000, description: 'East Valley suburb of Phoenix' },
      { slug: 'scottsdale', name: 'Scottsdale', population: 241361, crimeRate: 18.5, propertyCrimeRate: 16.4, medianHomeValue: 625000, description: 'Upscale Phoenix suburb' },
      { slug: 'chandler', name: 'Chandler', population: 275987, crimeRate: 16.2, propertyCrimeRate: 14.8, medianHomeValue: 465000, description: 'Tech corridor in Southeast Valley' },
      { slug: 'tempe', name: 'Tempe', population: 180587, crimeRate: 32.5, propertyCrimeRate: 24.7, medianHomeValue: 395000, description: 'Home of Arizona State University' },
      { slug: 'gilbert', name: 'Gilbert', population: 267918, crimeRate: 10.8, propertyCrimeRate: 9.5, medianHomeValue: 495000, description: 'Family-friendly Southeast Valley town' },
      { slug: 'glendale', name: 'Glendale', population: 248325, crimeRate: 34.2, propertyCrimeRate: 25.1, medianHomeValue: 345000, description: 'West Valley city' },
    ],
  },
  {
    slug: 'arkansas', name: 'Arkansas', abbreviation: 'AR',
    cities: [
      { slug: 'little-rock', name: 'Little Rock', population: 202591, crimeRate: 55.2, propertyCrimeRate: 35.8, medianHomeValue: 165000, description: 'State capital and largest city' },
      { slug: 'fort-smith', name: 'Fort Smith', population: 89142, crimeRate: 38.4, propertyCrimeRate: 26.1, medianHomeValue: 125000, description: 'Western Arkansas metro' },
      { slug: 'fayetteville', name: 'Fayetteville', population: 93949, crimeRate: 24.7, propertyCrimeRate: 19.5, medianHomeValue: 275000, description: 'University of Arkansas home' },
      { slug: 'springdale', name: 'Springdale', population: 80433, crimeRate: 27.3, propertyCrimeRate: 20.8, medianHomeValue: 225000, description: 'Northwest Arkansas metro' },
      { slug: 'jonesboro', name: 'Jonesboro', population: 78576, crimeRate: 35.6, propertyCrimeRate: 24.2, medianHomeValue: 155000, description: 'Northeast Arkansas hub' },
    ],
  },
  {
    slug: 'california', name: 'California', abbreviation: 'CA',
    cities: [
      { slug: 'los-angeles', name: 'Los Angeles', population: 3898747, crimeRate: 32.8, propertyCrimeRate: 24.5, medianHomeValue: 950000, description: 'Largest city in California' },
      { slug: 'san-francisco', name: 'San Francisco', population: 873965, crimeRate: 41.5, propertyCrimeRate: 35.2, medianHomeValue: 1350000, description: 'Bay Area tech hub' },
      { slug: 'san-diego', name: 'San Diego', population: 1386932, crimeRate: 22.8, propertyCrimeRate: 17.6, medianHomeValue: 850000, description: 'Southern California coastal city' },
      { slug: 'san-jose', name: 'San Jose', population: 1013240, crimeRate: 25.3, propertyCrimeRate: 20.8, medianHomeValue: 1250000, description: 'Silicon Valley capital' },
      { slug: 'sacramento', name: 'Sacramento', population: 524943, crimeRate: 38.2, propertyCrimeRate: 27.4, medianHomeValue: 425000, description: 'State capital' },
      { slug: 'fresno', name: 'Fresno', population: 542107, crimeRate: 44.6, propertyCrimeRate: 30.2, medianHomeValue: 325000, description: 'Central Valley hub' },
      { slug: 'oakland', name: 'Oakland', population: 433031, crimeRate: 51.2, propertyCrimeRate: 38.4, medianHomeValue: 825000, description: 'East Bay urban center' },
      { slug: 'riverside', name: 'Riverside', population: 314998, crimeRate: 30.5, propertyCrimeRate: 22.8, medianHomeValue: 525000, description: 'Inland Empire city' },
      { slug: 'irvine', name: 'Irvine', population: 307670, crimeRate: 8.5, propertyCrimeRate: 7.2, medianHomeValue: 1150000, description: 'Planned community in Orange County' },
      { slug: 'bakersfield', name: 'Bakersfield', population: 403455, crimeRate: 35.8, propertyCrimeRate: 25.1, medianHomeValue: 325000, description: 'Southern Central Valley city' },
    ],
  },
  {
    slug: 'colorado', name: 'Colorado', abbreviation: 'CO',
    cities: [
      { slug: 'denver', name: 'Denver', population: 715522, crimeRate: 36.4, propertyCrimeRate: 28.7, medianHomeValue: 575000, description: 'State capital and Mile High City' },
      { slug: 'colorado-springs', name: 'Colorado Springs', population: 478961, crimeRate: 32.8, propertyCrimeRate: 25.2, medianHomeValue: 425000, description: 'Second largest Colorado city' },
      { slug: 'aurora', name: 'Aurora', population: 386261, crimeRate: 34.5, propertyCrimeRate: 26.1, medianHomeValue: 445000, description: 'Denver metro suburb' },
      { slug: 'fort-collins', name: 'Fort Collins', population: 169810, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 495000, description: 'Northern Colorado university city' },
      { slug: 'lakewood', name: 'Lakewood', population: 155984, crimeRate: 28.7, propertyCrimeRate: 22.3, medianHomeValue: 485000, description: 'West Denver suburb' },
      { slug: 'boulder', name: 'Boulder', population: 105673, crimeRate: 24.2, propertyCrimeRate: 20.1, medianHomeValue: 850000, description: 'University city and tech hub' },
    ],
  },
  {
    slug: 'connecticut', name: 'Connecticut', abbreviation: 'CT',
    cities: [
      { slug: 'bridgeport', name: 'Bridgeport', population: 148529, crimeRate: 38.5, propertyCrimeRate: 24.8, medianHomeValue: 225000, description: 'Largest city in Connecticut' },
      { slug: 'new-haven', name: 'New Haven', population: 134023, crimeRate: 42.3, propertyCrimeRate: 28.5, medianHomeValue: 235000, description: 'Yale University home city' },
      { slug: 'hartford', name: 'Hartford', population: 121054, crimeRate: 44.8, propertyCrimeRate: 29.7, medianHomeValue: 175000, description: 'State capital' },
      { slug: 'stamford', name: 'Stamford', population: 135470, crimeRate: 14.8, propertyCrimeRate: 12.5, medianHomeValue: 575000, description: 'Financial hub in Fairfield County' },
      { slug: 'waterbury', name: 'Waterbury', population: 114403, crimeRate: 36.2, propertyCrimeRate: 24.1, medianHomeValue: 165000, description: 'Central Connecticut city' },
    ],
  },
  {
    slug: 'delaware', name: 'Delaware', abbreviation: 'DE',
    cities: [
      { slug: 'wilmington', name: 'Wilmington', population: 70898, crimeRate: 52.4, propertyCrimeRate: 32.5, medianHomeValue: 195000, description: 'Largest city in Delaware' },
      { slug: 'dover', name: 'Dover', population: 39403, crimeRate: 34.2, propertyCrimeRate: 25.8, medianHomeValue: 225000, description: 'State capital' },
      { slug: 'newark', name: 'Newark', population: 33042, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 285000, description: 'University of Delaware city' },
      { slug: 'middletown', name: 'Middletown', population: 22350, crimeRate: 14.5, propertyCrimeRate: 11.2, medianHomeValue: 345000, description: 'Fast-growing New Castle County town' },
      { slug: 'bear', name: 'Bear', population: 21190, crimeRate: 18.3, propertyCrimeRate: 14.7, medianHomeValue: 275000, description: 'New Castle County community' },
    ],
  },
  {
    slug: 'florida', name: 'Florida', abbreviation: 'FL',
    cities: [
      { slug: 'miami', name: 'Miami', population: 442241, crimeRate: 38.4, propertyCrimeRate: 28.2, medianHomeValue: 525000, description: 'South Florida cultural hub' },
      { slug: 'jacksonville', name: 'Jacksonville', population: 949611, crimeRate: 35.2, propertyCrimeRate: 24.8, medianHomeValue: 285000, description: 'Largest city by area in Florida' },
      { slug: 'tampa', name: 'Tampa', population: 384959, crimeRate: 32.8, propertyCrimeRate: 24.5, medianHomeValue: 395000, description: 'Gulf Coast metro center' },
      { slug: 'orlando', name: 'Orlando', population: 307573, crimeRate: 42.5, propertyCrimeRate: 30.8, medianHomeValue: 365000, description: 'Central Florida theme park capital' },
      { slug: 'st-petersburg', name: 'St. Petersburg', population: 258308, crimeRate: 28.4, propertyCrimeRate: 21.5, medianHomeValue: 345000, description: 'Tampa Bay waterfront city' },
      { slug: 'fort-lauderdale', name: 'Fort Lauderdale', population: 182760, crimeRate: 36.7, propertyCrimeRate: 26.3, medianHomeValue: 425000, description: 'Broward County seat' },
      { slug: 'tallahassee', name: 'Tallahassee', population: 196169, crimeRate: 38.2, propertyCrimeRate: 27.4, medianHomeValue: 235000, description: 'State capital and university city' },
      { slug: 'cape-coral', name: 'Cape Coral', population: 194016, crimeRate: 15.8, propertyCrimeRate: 12.4, medianHomeValue: 365000, description: 'Southwest Florida waterfront city' },
      { slug: 'naples', name: 'Naples', population: 19537, crimeRate: 12.5, propertyCrimeRate: 10.2, medianHomeValue: 625000, description: 'Affluent Gulf Coast community' },
    ],
  },
  {
    slug: 'georgia', name: 'Georgia', abbreviation: 'GA',
    cities: [
      { slug: 'atlanta', name: 'Atlanta', population: 498715, crimeRate: 42.6, propertyCrimeRate: 32.8, medianHomeValue: 415000, description: 'State capital and economic hub' },
      { slug: 'augusta', name: 'Augusta', population: 202081, crimeRate: 38.5, propertyCrimeRate: 25.4, medianHomeValue: 165000, description: 'Second largest Georgia city' },
      { slug: 'savannah', name: 'Savannah', population: 147780, crimeRate: 40.2, propertyCrimeRate: 28.7, medianHomeValue: 225000, description: 'Historic coastal city' },
      { slug: 'columbus', name: 'Columbus', population: 206922, crimeRate: 36.8, propertyCrimeRate: 24.5, medianHomeValue: 155000, description: 'Western Georgia city' },
      { slug: 'roswell', name: 'Roswell', population: 94034, crimeRate: 14.2, propertyCrimeRate: 12.1, medianHomeValue: 465000, description: 'North Atlanta suburb' },
      { slug: 'alpharetta', name: 'Alpharetta', population: 66566, crimeRate: 11.5, propertyCrimeRate: 9.8, medianHomeValue: 535000, description: 'Technology corridor suburb' },
    ],
  },
  {
    slug: 'hawaii', name: 'Hawaii', abbreviation: 'HI',
    cities: [
      { slug: 'honolulu', name: 'Honolulu', population: 350964, crimeRate: 22.8, propertyCrimeRate: 19.4, medianHomeValue: 875000, description: 'State capital on Oahu' },
      { slug: 'hilo', name: 'Hilo', population: 45703, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 385000, description: 'Big Island largest city' },
      { slug: 'kailua', name: 'Kailua', population: 40514, crimeRate: 14.2, propertyCrimeRate: 11.8, medianHomeValue: 1050000, description: 'Windward Oahu community' },
      { slug: 'kapolei', name: 'Kapolei', population: 21541, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 725000, description: 'West Oahu growing community' },
      { slug: 'kahului', name: 'Kahului', population: 29330, crimeRate: 24.8, propertyCrimeRate: 20.1, medianHomeValue: 785000, description: 'Maui commercial center' },
    ],
  },
  {
    slug: 'idaho', name: 'Idaho', abbreviation: 'ID',
    cities: [
      { slug: 'boise', name: 'Boise', population: 235684, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 435000, description: 'State capital and largest city' },
      { slug: 'meridian', name: 'Meridian', population: 117635, crimeRate: 12.8, propertyCrimeRate: 10.5, medianHomeValue: 465000, description: 'Fast-growing Boise suburb' },
      { slug: 'nampa', name: 'Nampa', population: 100200, crimeRate: 24.5, propertyCrimeRate: 19.2, medianHomeValue: 375000, description: 'Treasure Valley city' },
      { slug: 'idaho-falls', name: 'Idaho Falls', population: 64048, crimeRate: 18.7, propertyCrimeRate: 15.4, medianHomeValue: 295000, description: 'Eastern Idaho hub' },
      { slug: 'coeur-d-alene', name: "Coeur d'Alene", population: 54628, crimeRate: 20.1, propertyCrimeRate: 16.8, medianHomeValue: 525000, description: 'North Idaho lakeside city' },
    ],
  },
  {
    slug: 'illinois', name: 'Illinois', abbreviation: 'IL',
    cities: [
      { slug: 'chicago', name: 'Chicago', population: 2696555, crimeRate: 40.2, propertyCrimeRate: 27.8, medianHomeValue: 325000, description: 'Third largest US city' },
      { slug: 'aurora', name: 'Aurora', population: 200965, crimeRate: 24.5, propertyCrimeRate: 18.4, medianHomeValue: 245000, description: 'Second largest Illinois city' },
      { slug: 'naperville', name: 'Naperville', population: 149540, crimeRate: 8.5, propertyCrimeRate: 7.2, medianHomeValue: 465000, description: 'DuPage County suburb' },
      { slug: 'rockford', name: 'Rockford', population: 148655, crimeRate: 45.2, propertyCrimeRate: 30.4, medianHomeValue: 115000, description: 'Northern Illinois city' },
      { slug: 'springfield', name: 'Springfield', population: 114394, crimeRate: 42.8, propertyCrimeRate: 28.5, medianHomeValue: 125000, description: 'State capital' },
      { slug: 'peoria', name: 'Peoria', population: 113150, crimeRate: 38.4, propertyCrimeRate: 26.2, medianHomeValue: 105000, description: 'Central Illinois city' },
    ],
  },
  {
    slug: 'indiana', name: 'Indiana', abbreviation: 'IN',
    cities: [
      { slug: 'indianapolis', name: 'Indianapolis', population: 887642, crimeRate: 45.8, propertyCrimeRate: 32.4, medianHomeValue: 195000, description: 'State capital and largest city' },
      { slug: 'fort-wayne', name: 'Fort Wayne', population: 263886, crimeRate: 28.4, propertyCrimeRate: 21.5, medianHomeValue: 165000, description: 'Northeast Indiana hub' },
      { slug: 'evansville', name: 'Evansville', population: 117298, crimeRate: 38.2, propertyCrimeRate: 26.8, medianHomeValue: 125000, description: 'Southern Indiana city' },
      { slug: 'carmel', name: 'Carmel', population: 99757, crimeRate: 7.5, propertyCrimeRate: 6.8, medianHomeValue: 425000, description: 'Affluent Indianapolis suburb' },
      { slug: 'fishers', name: 'Fishers', population: 98977, crimeRate: 8.2, propertyCrimeRate: 7.1, medianHomeValue: 365000, description: 'Northeast Indianapolis suburb' },
    ],
  },
  {
    slug: 'iowa', name: 'Iowa', abbreviation: 'IA',
    cities: [
      { slug: 'des-moines', name: 'Des Moines', population: 214237, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 185000, description: 'State capital' },
      { slug: 'cedar-rapids', name: 'Cedar Rapids', population: 137710, crimeRate: 28.5, propertyCrimeRate: 22.1, medianHomeValue: 175000, description: 'Eastern Iowa hub' },
      { slug: 'davenport', name: 'Davenport', population: 101590, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 135000, description: 'Quad Cities metro' },
      { slug: 'iowa-city', name: 'Iowa City', population: 74828, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 265000, description: 'University of Iowa city' },
      { slug: 'sioux-city', name: 'Sioux City', population: 85797, crimeRate: 32.4, propertyCrimeRate: 24.5, medianHomeValue: 135000, description: 'Western Iowa tri-state city' },
    ],
  },
  {
    slug: 'kansas', name: 'Kansas', abbreviation: 'KS',
    cities: [
      { slug: 'wichita', name: 'Wichita', population: 397532, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 155000, description: 'Largest city in Kansas' },
      { slug: 'overland-park', name: 'Overland Park', population: 197238, crimeRate: 12.8, propertyCrimeRate: 10.5, medianHomeValue: 345000, description: 'KC metro suburb' },
      { slug: 'kansas-city', name: 'Kansas City', population: 156607, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 145000, description: 'Kansas side of KC metro' },
      { slug: 'olathe', name: 'Olathe', population: 141290, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 325000, description: 'Johnson County suburb' },
      { slug: 'topeka', name: 'Topeka', population: 126587, crimeRate: 38.2, propertyCrimeRate: 28.5, medianHomeValue: 115000, description: 'State capital' },
    ],
  },
  {
    slug: 'kentucky', name: 'Kentucky', abbreviation: 'KY',
    cities: [
      { slug: 'louisville', name: 'Louisville', population: 633045, crimeRate: 38.5, propertyCrimeRate: 26.4, medianHomeValue: 195000, description: 'Largest city in Kentucky' },
      { slug: 'lexington', name: 'Lexington', population: 322570, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 245000, description: 'Bluegrass Region hub' },
      { slug: 'bowling-green', name: 'Bowling Green', population: 72294, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 195000, description: 'South-central Kentucky city' },
      { slug: 'owensboro', name: 'Owensboro', population: 60183, crimeRate: 25.4, propertyCrimeRate: 20.1, medianHomeValue: 155000, description: 'Western Kentucky city' },
      { slug: 'covington', name: 'Covington', population: 40640, crimeRate: 34.8, propertyCrimeRate: 25.2, medianHomeValue: 165000, description: 'Northern Kentucky city' },
    ],
  },
  {
    slug: 'louisiana', name: 'Louisiana', abbreviation: 'LA',
    cities: [
      { slug: 'new-orleans', name: 'New Orleans', population: 383997, crimeRate: 55.8, propertyCrimeRate: 35.4, medianHomeValue: 265000, description: 'Cultural capital and largest city' },
      { slug: 'baton-rouge', name: 'Baton Rouge', population: 227470, crimeRate: 52.4, propertyCrimeRate: 34.2, medianHomeValue: 195000, description: 'State capital' },
      { slug: 'shreveport', name: 'Shreveport', population: 187593, crimeRate: 48.5, propertyCrimeRate: 32.8, medianHomeValue: 135000, description: 'Northwest Louisiana city' },
      { slug: 'lafayette', name: 'Lafayette', population: 126185, crimeRate: 35.8, propertyCrimeRate: 25.4, medianHomeValue: 195000, description: 'Cajun Country hub' },
      { slug: 'lake-charles', name: 'Lake Charles', population: 82157, crimeRate: 38.2, propertyCrimeRate: 26.5, medianHomeValue: 165000, description: 'Southwest Louisiana city' },
    ],
  },
  {
    slug: 'maine', name: 'Maine', abbreviation: 'ME',
    cities: [
      { slug: 'portland', name: 'Portland', population: 68408, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 385000, description: 'Largest city in Maine' },
      { slug: 'lewiston', name: 'Lewiston', population: 37121, crimeRate: 24.8, propertyCrimeRate: 19.4, medianHomeValue: 175000, description: 'Second largest city' },
      { slug: 'bangor', name: 'Bangor', population: 32029, crimeRate: 28.5, propertyCrimeRate: 22.1, medianHomeValue: 185000, description: 'Eastern Maine hub' },
      { slug: 'south-portland', name: 'South Portland', population: 25002, crimeRate: 14.2, propertyCrimeRate: 11.5, medianHomeValue: 365000, description: 'Portland metro suburb' },
      { slug: 'auburn', name: 'Auburn', population: 24061, crimeRate: 22.4, propertyCrimeRate: 18.2, medianHomeValue: 195000, description: 'Twin city to Lewiston' },
    ],
  },
  {
    slug: 'maryland', name: 'Maryland', abbreviation: 'MD',
    cities: [
      { slug: 'baltimore', name: 'Baltimore', population: 585708, crimeRate: 58.2, propertyCrimeRate: 34.5, medianHomeValue: 195000, description: 'Largest city in Maryland' },
      { slug: 'columbia', name: 'Columbia', population: 104681, crimeRate: 14.5, propertyCrimeRate: 12.1, medianHomeValue: 425000, description: 'Planned community in Howard County' },
      { slug: 'germantown', name: 'Germantown', population: 90676, crimeRate: 12.8, propertyCrimeRate: 10.4, medianHomeValue: 385000, description: 'Montgomery County community' },
      { slug: 'silver-spring', name: 'Silver Spring', population: 81015, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 445000, description: 'DC suburb in Montgomery County' },
      { slug: 'frederick', name: 'Frederick', population: 78171, crimeRate: 16.8, propertyCrimeRate: 13.5, medianHomeValue: 365000, description: 'Western Maryland city' },
    ],
  },
  {
    slug: 'massachusetts', name: 'Massachusetts', abbreviation: 'MA',
    cities: [
      { slug: 'boston', name: 'Boston', population: 675647, crimeRate: 28.5, propertyCrimeRate: 18.4, medianHomeValue: 725000, description: 'State capital and largest city' },
      { slug: 'worcester', name: 'Worcester', population: 206518, crimeRate: 32.4, propertyCrimeRate: 22.8, medianHomeValue: 335000, description: 'Central Massachusetts city' },
      { slug: 'springfield', name: 'Springfield', population: 155929, crimeRate: 45.8, propertyCrimeRate: 28.5, medianHomeValue: 215000, description: 'Western Massachusetts city' },
      { slug: 'cambridge', name: 'Cambridge', population: 118403, crimeRate: 14.2, propertyCrimeRate: 12.5, medianHomeValue: 975000, description: 'Home of MIT and Harvard' },
      { slug: 'lowell', name: 'Lowell', population: 115554, crimeRate: 28.4, propertyCrimeRate: 20.5, medianHomeValue: 385000, description: 'Merrimack Valley city' },
    ],
  },
  {
    slug: 'michigan', name: 'Michigan', abbreviation: 'MI',
    cities: [
      { slug: 'detroit', name: 'Detroit', population: 639111, crimeRate: 58.4, propertyCrimeRate: 35.2, medianHomeValue: 65000, description: 'Largest city in Michigan' },
      { slug: 'grand-rapids', name: 'Grand Rapids', population: 198917, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 265000, description: 'West Michigan hub' },
      { slug: 'ann-arbor', name: 'Ann Arbor', population: 123851, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 425000, description: 'University of Michigan city' },
      { slug: 'lansing', name: 'Lansing', population: 112644, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 135000, description: 'State capital' },
      { slug: 'sterling-heights', name: 'Sterling Heights', population: 134346, crimeRate: 12.8, propertyCrimeRate: 10.5, medianHomeValue: 235000, description: 'Macomb County suburb' },
    ],
  },
  {
    slug: 'minnesota', name: 'Minnesota', abbreviation: 'MN',
    cities: [
      { slug: 'minneapolis', name: 'Minneapolis', population: 429954, crimeRate: 42.5, propertyCrimeRate: 32.8, medianHomeValue: 325000, description: 'Largest city in Minnesota' },
      { slug: 'st-paul', name: 'St. Paul', population: 311527, crimeRate: 34.2, propertyCrimeRate: 26.4, medianHomeValue: 265000, description: 'State capital and twin city' },
      { slug: 'rochester', name: 'Rochester', population: 121395, crimeRate: 16.5, propertyCrimeRate: 13.2, medianHomeValue: 285000, description: 'Mayo Clinic home city' },
      { slug: 'bloomington', name: 'Bloomington', population: 89987, crimeRate: 18.4, propertyCrimeRate: 15.8, medianHomeValue: 305000, description: 'Mall of America city' },
      { slug: 'duluth', name: 'Duluth', population: 90884, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 215000, description: 'Lake Superior port city' },
    ],
  },
  {
    slug: 'mississippi', name: 'Mississippi', abbreviation: 'MS',
    cities: [
      { slug: 'jackson', name: 'Jackson', population: 153701, crimeRate: 62.5, propertyCrimeRate: 38.4, medianHomeValue: 95000, description: 'State capital and largest city' },
      { slug: 'gulfport', name: 'Gulfport', population: 72926, crimeRate: 38.5, propertyCrimeRate: 26.4, medianHomeValue: 155000, description: 'Gulf Coast city' },
      { slug: 'southaven', name: 'Southaven', population: 54944, crimeRate: 22.4, propertyCrimeRate: 18.5, medianHomeValue: 195000, description: 'Memphis metro suburb' },
      { slug: 'hattiesburg', name: 'Hattiesburg', population: 48985, crimeRate: 35.8, propertyCrimeRate: 24.2, medianHomeValue: 145000, description: 'Pine Belt hub' },
      { slug: 'biloxi', name: 'Biloxi', population: 46212, crimeRate: 42.5, propertyCrimeRate: 28.5, medianHomeValue: 175000, description: 'Gulf Coast resort city' },
    ],
  },
  {
    slug: 'missouri', name: 'Missouri', abbreviation: 'MO',
    cities: [
      { slug: 'kansas-city', name: 'Kansas City', population: 508090, crimeRate: 52.4, propertyCrimeRate: 35.8, medianHomeValue: 195000, description: 'Largest city in Missouri' },
      { slug: 'st-louis', name: 'St. Louis', population: 293310, crimeRate: 58.8, propertyCrimeRate: 36.2, medianHomeValue: 165000, description: 'Gateway to the West' },
      { slug: 'springfield', name: 'Springfield', population: 169176, crimeRate: 45.2, propertyCrimeRate: 30.8, medianHomeValue: 165000, description: 'Southwest Missouri hub' },
      { slug: 'columbia', name: 'Columbia', population: 126254, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 225000, description: 'University of Missouri city' },
      { slug: 'independence', name: 'Independence', population: 123011, crimeRate: 38.4, propertyCrimeRate: 28.5, medianHomeValue: 155000, description: 'Eastern KC metro' },
    ],
  },
  {
    slug: 'montana', name: 'Montana', abbreviation: 'MT',
    cities: [
      { slug: 'billings', name: 'Billings', population: 119116, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 315000, description: 'Largest city in Montana' },
      { slug: 'missoula', name: 'Missoula', population: 75516, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 425000, description: 'Western Montana university city' },
      { slug: 'great-falls', name: 'Great Falls', population: 60442, crimeRate: 38.4, propertyCrimeRate: 28.5, medianHomeValue: 225000, description: 'North-central Montana city' },
      { slug: 'bozeman', name: 'Bozeman', population: 53293, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 625000, description: 'Fast-growing college town' },
      { slug: 'helena', name: 'Helena', population: 32091, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 345000, description: 'State capital' },
    ],
  },
  {
    slug: 'nebraska', name: 'Nebraska', abbreviation: 'NE',
    cities: [
      { slug: 'omaha', name: 'Omaha', population: 486051, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 225000, description: 'Largest city in Nebraska' },
      { slug: 'lincoln', name: 'Lincoln', population: 291082, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 235000, description: 'State capital and university city' },
      { slug: 'bellevue', name: 'Bellevue', population: 64176, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 225000, description: 'Omaha metro suburb' },
      { slug: 'grand-island', name: 'Grand Island', population: 53131, crimeRate: 32.4, propertyCrimeRate: 24.5, medianHomeValue: 175000, description: 'Central Nebraska hub' },
      { slug: 'kearney', name: 'Kearney', population: 33464, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 215000, description: 'South-central Nebraska city' },
    ],
  },
  {
    slug: 'nevada', name: 'Nevada', abbreviation: 'NV',
    cities: [
      { slug: 'las-vegas', name: 'Las Vegas', population: 641903, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 425000, description: 'Entertainment capital' },
      { slug: 'henderson', name: 'Henderson', population: 320189, crimeRate: 14.5, propertyCrimeRate: 12.2, medianHomeValue: 465000, description: 'Las Vegas suburb' },
      { slug: 'reno', name: 'Reno', population: 264165, crimeRate: 32.5, propertyCrimeRate: 25.8, medianHomeValue: 525000, description: 'Biggest Little City' },
      { slug: 'north-las-vegas', name: 'North Las Vegas', population: 262527, crimeRate: 32.8, propertyCrimeRate: 24.5, medianHomeValue: 395000, description: 'Northern Vegas metro' },
      { slug: 'sparks', name: 'Sparks', population: 108445, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 475000, description: 'Reno metro suburb' },
    ],
  },
  {
    slug: 'new-hampshire', name: 'New Hampshire', abbreviation: 'NH',
    cities: [
      { slug: 'manchester', name: 'Manchester', population: 115644, crimeRate: 28.5, propertyCrimeRate: 20.4, medianHomeValue: 325000, description: 'Largest city in NH' },
      { slug: 'nashua', name: 'Nashua', population: 91322, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 385000, description: 'Southern NH city' },
      { slug: 'concord', name: 'Concord', population: 44503, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 315000, description: 'State capital' },
      { slug: 'dover', name: 'Dover', population: 32741, crimeRate: 16.2, propertyCrimeRate: 13.5, medianHomeValue: 345000, description: 'Seacoast region city' },
      { slug: 'rochester', name: 'Rochester', population: 31752, crimeRate: 22.4, propertyCrimeRate: 18.2, medianHomeValue: 295000, description: 'Strafford County seat' },
    ],
  },
  {
    slug: 'new-jersey', name: 'New Jersey', abbreviation: 'NJ',
    cities: [
      { slug: 'newark', name: 'Newark', population: 311549, crimeRate: 42.5, propertyCrimeRate: 28.4, medianHomeValue: 325000, description: 'Largest city in NJ' },
      { slug: 'jersey-city', name: 'Jersey City', population: 292449, crimeRate: 22.5, propertyCrimeRate: 16.8, medianHomeValue: 525000, description: 'Hudson County waterfront city' },
      { slug: 'paterson', name: 'Paterson', population: 159732, crimeRate: 38.4, propertyCrimeRate: 24.5, medianHomeValue: 365000, description: 'Passaic County city' },
      { slug: 'elizabeth', name: 'Elizabeth', population: 137298, crimeRate: 28.5, propertyCrimeRate: 20.4, medianHomeValue: 385000, description: 'Union County city' },
      { slug: 'trenton', name: 'Trenton', population: 90457, crimeRate: 48.5, propertyCrimeRate: 32.4, medianHomeValue: 145000, description: 'State capital' },
    ],
  },
  {
    slug: 'new-mexico', name: 'New Mexico', abbreviation: 'NM',
    cities: [
      { slug: 'albuquerque', name: 'Albuquerque', population: 564559, crimeRate: 58.5, propertyCrimeRate: 38.4, medianHomeValue: 275000, description: 'Largest city in NM' },
      { slug: 'las-cruces', name: 'Las Cruces', population: 111385, crimeRate: 42.5, propertyCrimeRate: 28.4, medianHomeValue: 225000, description: 'Southern NM city' },
      { slug: 'rio-rancho', name: 'Rio Rancho', population: 104046, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 285000, description: 'ABQ metro suburb' },
      { slug: 'santa-fe', name: 'Santa Fe', population: 87505, crimeRate: 32.5, propertyCrimeRate: 25.8, medianHomeValue: 475000, description: 'State capital' },
      { slug: 'roswell', name: 'Roswell', population: 48422, crimeRate: 45.2, propertyCrimeRate: 30.5, medianHomeValue: 145000, description: 'Southeast NM city' },
    ],
  },
  {
    slug: 'new-york', name: 'New York', abbreviation: 'NY',
    cities: [
      { slug: 'new-york-city', name: 'New York City', population: 8336817, crimeRate: 22.5, propertyCrimeRate: 14.8, medianHomeValue: 750000, description: 'Largest US city' },
      { slug: 'buffalo', name: 'Buffalo', population: 278349, crimeRate: 42.5, propertyCrimeRate: 28.4, medianHomeValue: 155000, description: 'Western NY city' },
      { slug: 'rochester', name: 'Rochester', population: 211328, crimeRate: 45.8, propertyCrimeRate: 30.2, medianHomeValue: 115000, description: 'Finger Lakes metro' },
      { slug: 'yonkers', name: 'Yonkers', population: 211569, crimeRate: 18.5, propertyCrimeRate: 12.8, medianHomeValue: 525000, description: 'NYC suburb in Westchester' },
      { slug: 'syracuse', name: 'Syracuse', population: 148620, crimeRate: 42.5, propertyCrimeRate: 28.5, medianHomeValue: 105000, description: 'Central NY city' },
      { slug: 'albany', name: 'Albany', population: 99224, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 195000, description: 'State capital' },
    ],
  },
  {
    slug: 'north-carolina', name: 'North Carolina', abbreviation: 'NC',
    cities: [
      { slug: 'charlotte', name: 'Charlotte', population: 874579, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 365000, description: 'Largest NC city and banking hub' },
      { slug: 'raleigh', name: 'Raleigh', population: 467665, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 415000, description: 'State capital and tech hub' },
      { slug: 'greensboro', name: 'Greensboro', population: 299035, crimeRate: 38.4, propertyCrimeRate: 28.5, medianHomeValue: 215000, description: 'Piedmont Triad city' },
      { slug: 'durham', name: 'Durham', population: 283506, crimeRate: 42.5, propertyCrimeRate: 30.8, medianHomeValue: 345000, description: 'Research Triangle city' },
      { slug: 'winston-salem', name: 'Winston-Salem', population: 249545, crimeRate: 35.2, propertyCrimeRate: 26.8, medianHomeValue: 195000, description: 'Piedmont Triad hub' },
      { slug: 'cary', name: 'Cary', population: 174721, crimeRate: 8.5, propertyCrimeRate: 7.2, medianHomeValue: 495000, description: 'Raleigh suburb' },
    ],
  },
  {
    slug: 'north-dakota', name: 'North Dakota', abbreviation: 'ND',
    cities: [
      { slug: 'fargo', name: 'Fargo', population: 125990, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 265000, description: 'Largest city in ND' },
      { slug: 'bismarck', name: 'Bismarck', population: 73529, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 275000, description: 'State capital' },
      { slug: 'grand-forks', name: 'Grand Forks', population: 55838, crimeRate: 32.4, propertyCrimeRate: 25.4, medianHomeValue: 225000, description: 'UND home city' },
      { slug: 'minot', name: 'Minot', population: 48639, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 235000, description: 'North-central ND city' },
      { slug: 'west-fargo', name: 'West Fargo', population: 38626, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 295000, description: 'Fargo metro suburb' },
    ],
  },
  {
    slug: 'ohio', name: 'Ohio', abbreviation: 'OH',
    cities: [
      { slug: 'columbus', name: 'Columbus', population: 905748, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 225000, description: 'State capital and largest city' },
      { slug: 'cleveland', name: 'Cleveland', population: 372624, crimeRate: 52.4, propertyCrimeRate: 35.8, medianHomeValue: 95000, description: 'Northeast Ohio metro' },
      { slug: 'cincinnati', name: 'Cincinnati', population: 309317, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 195000, description: 'Southwest Ohio city' },
      { slug: 'toledo', name: 'Toledo', population: 270871, crimeRate: 45.8, propertyCrimeRate: 32.4, medianHomeValue: 95000, description: 'Northwest Ohio city' },
      { slug: 'akron', name: 'Akron', population: 190469, crimeRate: 42.5, propertyCrimeRate: 28.5, medianHomeValue: 95000, description: 'Summit County city' },
      { slug: 'dayton', name: 'Dayton', population: 137644, crimeRate: 48.5, propertyCrimeRate: 34.2, medianHomeValue: 85000, description: 'Miami Valley city' },
    ],
  },
  {
    slug: 'oklahoma', name: 'Oklahoma', abbreviation: 'OK',
    cities: [
      { slug: 'oklahoma-city', name: 'Oklahoma City', population: 681054, crimeRate: 42.5, propertyCrimeRate: 32.8, medianHomeValue: 195000, description: 'State capital and largest city' },
      { slug: 'tulsa', name: 'Tulsa', population: 413066, crimeRate: 45.8, propertyCrimeRate: 34.2, medianHomeValue: 175000, description: 'Second largest OK city' },
      { slug: 'norman', name: 'Norman', population: 128026, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 215000, description: 'University of Oklahoma city' },
      { slug: 'broken-arrow', name: 'Broken Arrow', population: 113540, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 225000, description: 'Tulsa suburb' },
      { slug: 'edmond', name: 'Edmond', population: 99350, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 275000, description: 'OKC metro suburb' },
    ],
  },
  {
    slug: 'oregon', name: 'Oregon', abbreviation: 'OR',
    cities: [
      { slug: 'portland', name: 'Portland', population: 652503, crimeRate: 42.5, propertyCrimeRate: 35.8, medianHomeValue: 525000, description: 'Largest city in Oregon' },
      { slug: 'salem', name: 'Salem', population: 175535, crimeRate: 38.4, propertyCrimeRate: 28.5, medianHomeValue: 365000, description: 'State capital' },
      { slug: 'eugene', name: 'Eugene', population: 176654, crimeRate: 35.8, propertyCrimeRate: 28.4, medianHomeValue: 395000, description: 'University of Oregon city' },
      { slug: 'bend', name: 'Bend', population: 102059, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 625000, description: 'Central Oregon outdoor hub' },
      { slug: 'medford', name: 'Medford', population: 85824, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 385000, description: 'Southern Oregon city' },
    ],
  },
  {
    slug: 'pennsylvania', name: 'Pennsylvania', abbreviation: 'PA',
    cities: [
      { slug: 'philadelphia', name: 'Philadelphia', population: 1603797, crimeRate: 42.5, propertyCrimeRate: 28.4, medianHomeValue: 225000, description: 'Largest PA city' },
      { slug: 'pittsburgh', name: 'Pittsburgh', population: 302971, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 225000, description: 'Steel City metro' },
      { slug: 'allentown', name: 'Allentown', population: 126092, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 185000, description: 'Lehigh Valley city' },
      { slug: 'reading', name: 'Reading', population: 95112, crimeRate: 45.8, propertyCrimeRate: 30.2, medianHomeValue: 95000, description: 'Berks County seat' },
      { slug: 'erie', name: 'Erie', population: 94831, crimeRate: 38.5, propertyCrimeRate: 26.4, medianHomeValue: 105000, description: 'Lake Erie port city' },
      { slug: 'harrisburg', name: 'Harrisburg', population: 50099, crimeRate: 48.5, propertyCrimeRate: 32.4, medianHomeValue: 105000, description: 'State capital' },
    ],
  },
  {
    slug: 'rhode-island', name: 'Rhode Island', abbreviation: 'RI',
    cities: [
      { slug: 'providence', name: 'Providence', population: 190934, crimeRate: 32.5, propertyCrimeRate: 22.4, medianHomeValue: 325000, description: 'State capital and largest city' },
      { slug: 'warwick', name: 'Warwick', population: 82823, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 305000, description: 'Kent County city' },
      { slug: 'cranston', name: 'Cranston', population: 82934, crimeRate: 16.2, propertyCrimeRate: 13.5, medianHomeValue: 325000, description: 'Providence metro suburb' },
      { slug: 'pawtucket', name: 'Pawtucket', population: 75604, crimeRate: 28.5, propertyCrimeRate: 20.4, medianHomeValue: 285000, description: 'Blackstone Valley city' },
      { slug: 'east-providence', name: 'East Providence', population: 47442, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 315000, description: 'Providence metro suburb' },
    ],
  },
  {
    slug: 'south-carolina', name: 'South Carolina', abbreviation: 'SC',
    cities: [
      { slug: 'charleston', name: 'Charleston', population: 150227, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 425000, description: 'Historic coastal city' },
      { slug: 'columbia', name: 'Columbia', population: 136632, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 195000, description: 'State capital' },
      { slug: 'greenville', name: 'Greenville', population: 72095, crimeRate: 38.4, propertyCrimeRate: 26.8, medianHomeValue: 275000, description: 'Upstate SC hub' },
      { slug: 'myrtle-beach', name: 'Myrtle Beach', population: 35682, crimeRate: 55.8, propertyCrimeRate: 38.4, medianHomeValue: 245000, description: 'Grand Strand resort city' },
      { slug: 'mount-pleasant', name: 'Mount Pleasant', population: 96946, crimeRate: 10.5, propertyCrimeRate: 8.8, medianHomeValue: 575000, description: 'Charleston suburb' },
    ],
  },
  {
    slug: 'south-dakota', name: 'South Dakota', abbreviation: 'SD',
    cities: [
      { slug: 'sioux-falls', name: 'Sioux Falls', population: 192517, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 265000, description: 'Largest city in SD' },
      { slug: 'rapid-city', name: 'Rapid City', population: 77503, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 265000, description: 'Black Hills gateway' },
      { slug: 'aberdeen', name: 'Aberdeen', population: 28324, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 195000, description: 'Northeast SD hub' },
      { slug: 'brookings', name: 'Brookings', population: 24914, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 245000, description: 'SDSU home city' },
      { slug: 'watertown', name: 'Watertown', population: 22655, crimeRate: 25.4, propertyCrimeRate: 20.1, medianHomeValue: 215000, description: 'Northeast SD city' },
    ],
  },
  {
    slug: 'tennessee', name: 'Tennessee', abbreviation: 'TN',
    cities: [
      { slug: 'memphis', name: 'Memphis', population: 633104, crimeRate: 62.5, propertyCrimeRate: 38.4, medianHomeValue: 125000, description: 'Largest city in Tennessee' },
      { slug: 'nashville', name: 'Nashville', population: 689447, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 395000, description: 'State capital and music city' },
      { slug: 'knoxville', name: 'Knoxville', population: 190740, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 225000, description: 'East Tennessee metro' },
      { slug: 'chattanooga', name: 'Chattanooga', population: 181099, crimeRate: 45.8, propertyCrimeRate: 32.4, medianHomeValue: 225000, description: 'Scenic City' },
      { slug: 'clarksville', name: 'Clarksville', population: 166722, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 265000, description: 'Fort Campbell area' },
      { slug: 'murfreesboro', name: 'Murfreesboro', population: 152769, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 345000, description: 'Nashville suburb' },
    ],
  },
  {
    slug: 'texas', name: 'Texas', abbreviation: 'TX',
    cities: [
      { slug: 'houston', name: 'Houston', population: 2304580, crimeRate: 42.5, propertyCrimeRate: 32.8, medianHomeValue: 265000, description: 'Largest city in Texas' },
      { slug: 'san-antonio', name: 'San Antonio', population: 1547253, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 245000, description: 'Alamo City' },
      { slug: 'dallas', name: 'Dallas', population: 1304379, crimeRate: 38.4, propertyCrimeRate: 30.2, medianHomeValue: 325000, description: 'North Texas metro hub' },
      { slug: 'austin', name: 'Austin', population: 978908, crimeRate: 28.5, propertyCrimeRate: 24.8, medianHomeValue: 525000, description: 'State capital and tech hub' },
      { slug: 'fort-worth', name: 'Fort Worth', population: 918915, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 285000, description: 'DFW Metroplex west side' },
      { slug: 'el-paso', name: 'El Paso', population: 678815, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 195000, description: 'West Texas border city' },
      { slug: 'arlington', name: 'Arlington', population: 394266, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 265000, description: 'DFW Metroplex city' },
      { slug: 'plano', name: 'Plano', population: 285494, crimeRate: 12.5, propertyCrimeRate: 10.8, medianHomeValue: 445000, description: 'North Dallas suburb' },
      { slug: 'frisco', name: 'Frisco', population: 200509, crimeRate: 8.5, propertyCrimeRate: 7.2, medianHomeValue: 525000, description: 'Fast-growing Collin County city' },
      { slug: 'mckinney', name: 'McKinney', population: 199177, crimeRate: 12.8, propertyCrimeRate: 10.5, medianHomeValue: 445000, description: 'Collin County seat' },
    ],
  },
  {
    slug: 'utah', name: 'Utah', abbreviation: 'UT',
    cities: [
      { slug: 'salt-lake-city', name: 'Salt Lake City', population: 199723, crimeRate: 42.5, propertyCrimeRate: 35.8, medianHomeValue: 525000, description: 'State capital' },
      { slug: 'west-valley-city', name: 'West Valley City', population: 140230, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 425000, description: 'Salt Lake suburb' },
      { slug: 'provo', name: 'Provo', population: 115162, crimeRate: 18.5, propertyCrimeRate: 15.2, medianHomeValue: 445000, description: 'BYU home city' },
      { slug: 'west-jordan', name: 'West Jordan', population: 116961, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 465000, description: 'South Salt Lake Valley' },
      { slug: 'orem', name: 'Orem', population: 97499, crimeRate: 16.5, propertyCrimeRate: 13.8, medianHomeValue: 425000, description: 'Utah County city' },
      { slug: 'st-george', name: 'St. George', population: 95342, crimeRate: 14.8, propertyCrimeRate: 12.5, medianHomeValue: 495000, description: 'Southern Utah growing city' },
    ],
  },
  {
    slug: 'vermont', name: 'Vermont', abbreviation: 'VT',
    cities: [
      { slug: 'burlington', name: 'Burlington', population: 44743, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 425000, description: 'Largest city in Vermont' },
      { slug: 'south-burlington', name: 'South Burlington', population: 20292, crimeRate: 12.5, propertyCrimeRate: 10.2, medianHomeValue: 445000, description: 'Burlington suburb' },
      { slug: 'rutland', name: 'Rutland', population: 15807, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 195000, description: 'Central Vermont city' },
      { slug: 'montpelier', name: 'Montpelier', population: 8074, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 325000, description: 'State capital' },
      { slug: 'barre', name: 'Barre', population: 8491, crimeRate: 25.4, propertyCrimeRate: 20.1, medianHomeValue: 185000, description: 'Granite City' },
    ],
  },
  {
    slug: 'virginia', name: 'Virginia', abbreviation: 'VA',
    cities: [
      { slug: 'virginia-beach', name: 'Virginia Beach', population: 459470, crimeRate: 18.5, propertyCrimeRate: 14.8, medianHomeValue: 345000, description: 'Largest VA city' },
      { slug: 'norfolk', name: 'Norfolk', population: 238005, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 245000, description: 'Hampton Roads naval city' },
      { slug: 'richmond', name: 'Richmond', population: 226610, crimeRate: 38.5, propertyCrimeRate: 28.4, medianHomeValue: 315000, description: 'State capital' },
      { slug: 'chesapeake', name: 'Chesapeake', population: 249422, crimeRate: 14.5, propertyCrimeRate: 11.8, medianHomeValue: 345000, description: 'Hampton Roads city' },
      { slug: 'arlington', name: 'Arlington', population: 238643, crimeRate: 12.5, propertyCrimeRate: 10.8, medianHomeValue: 725000, description: 'DC suburb' },
      { slug: 'alexandria', name: 'Alexandria', population: 159467, crimeRate: 16.8, propertyCrimeRate: 13.5, medianHomeValue: 625000, description: 'Historic DC suburb' },
    ],
  },
  {
    slug: 'washington', name: 'Washington', abbreviation: 'WA',
    cities: [
      { slug: 'seattle', name: 'Seattle', population: 737015, crimeRate: 38.5, propertyCrimeRate: 32.4, medianHomeValue: 875000, description: 'Largest WA city and tech hub' },
      { slug: 'spokane', name: 'Spokane', population: 228989, crimeRate: 48.5, propertyCrimeRate: 35.8, medianHomeValue: 325000, description: 'Eastern WA hub' },
      { slug: 'tacoma', name: 'Tacoma', population: 219346, crimeRate: 42.5, propertyCrimeRate: 32.8, medianHomeValue: 425000, description: 'Puget Sound city' },
      { slug: 'vancouver', name: 'Vancouver', population: 190915, crimeRate: 32.5, propertyCrimeRate: 26.4, medianHomeValue: 445000, description: 'SW Washington city' },
      { slug: 'bellevue', name: 'Bellevue', population: 151854, crimeRate: 14.5, propertyCrimeRate: 12.8, medianHomeValue: 1250000, description: 'Eastside tech hub' },
      { slug: 'kent', name: 'Kent', population: 136588, crimeRate: 32.5, propertyCrimeRate: 26.4, medianHomeValue: 485000, description: 'South King County city' },
    ],
  },
  {
    slug: 'west-virginia', name: 'West Virginia', abbreviation: 'WV',
    cities: [
      { slug: 'charleston', name: 'Charleston', population: 48006, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 125000, description: 'State capital' },
      { slug: 'huntington', name: 'Huntington', population: 46842, crimeRate: 45.8, propertyCrimeRate: 32.4, medianHomeValue: 95000, description: 'SW West Virginia city' },
      { slug: 'morgantown', name: 'Morgantown', population: 30955, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 245000, description: 'WVU home city' },
      { slug: 'parkersburg', name: 'Parkersburg', population: 29675, crimeRate: 38.4, propertyCrimeRate: 28.5, medianHomeValue: 95000, description: 'Ohio River city' },
      { slug: 'wheeling', name: 'Wheeling', population: 27062, crimeRate: 35.8, propertyCrimeRate: 26.4, medianHomeValue: 85000, description: 'Northern Panhandle city' },
    ],
  },
  {
    slug: 'wisconsin', name: 'Wisconsin', abbreviation: 'WI',
    cities: [
      { slug: 'milwaukee', name: 'Milwaukee', population: 577222, crimeRate: 52.4, propertyCrimeRate: 35.8, medianHomeValue: 145000, description: 'Largest WI city' },
      { slug: 'madison', name: 'Madison', population: 269840, crimeRate: 22.5, propertyCrimeRate: 18.4, medianHomeValue: 365000, description: 'State capital and university city' },
      { slug: 'green-bay', name: 'Green Bay', population: 107395, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 195000, description: 'Packers home city' },
      { slug: 'kenosha', name: 'Kenosha', population: 99889, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 195000, description: 'SE Wisconsin city' },
      { slug: 'racine', name: 'Racine', population: 77816, crimeRate: 42.5, propertyCrimeRate: 30.2, medianHomeValue: 135000, description: 'Lake Michigan city' },
    ],
  },
  {
    slug: 'wyoming', name: 'Wyoming', abbreviation: 'WY',
    cities: [
      { slug: 'cheyenne', name: 'Cheyenne', population: 65132, crimeRate: 28.5, propertyCrimeRate: 22.4, medianHomeValue: 295000, description: 'State capital and largest city' },
      { slug: 'casper', name: 'Casper', population: 58610, crimeRate: 32.5, propertyCrimeRate: 24.8, medianHomeValue: 265000, description: 'Central Wyoming city' },
      { slug: 'laramie', name: 'Laramie', population: 32711, crimeRate: 24.5, propertyCrimeRate: 20.1, medianHomeValue: 275000, description: 'University of Wyoming city' },
      { slug: 'gillette', name: 'Gillette', population: 33403, crimeRate: 28.4, propertyCrimeRate: 22.5, medianHomeValue: 245000, description: 'Energy capital of the nation' },
      { slug: 'rock-springs', name: 'Rock Springs', population: 23036, crimeRate: 25.4, propertyCrimeRate: 20.8, medianHomeValue: 225000, description: 'SW Wyoming city' },
    ],
  },
]

// Lookup functions
export function getState(slug: string): State | undefined {
  return states.find((s) => s.slug === slug)
}

export function getCity(stateSlug: string, citySlug: string): City | undefined {
  const state = getState(stateSlug)
  if (!state) return undefined
  return state.cities.find((c) => c.slug === citySlug)
}

export function getAllCityPages(): { state: string; city: string }[] {
  const pages: { state: string; city: string }[] = []
  for (const state of states) {
    for (const city of state.cities) {
      pages.push({ state: state.slug, city: city.slug })
    }
  }
  return pages
}

// Dynamic content generators
export function getCityDescription(state: State, city: City): string {
  const crimeLevel = city.crimeRate > 40 ? 'above-average crime rate' : city.crimeRate > 25 ? 'moderate crime rate' : 'relatively low crime rate'

  return `${city.name}, ${state.abbreviation} is home to ${city.population.toLocaleString()} residents and has a ${crimeLevel} of ${city.crimeRate} incidents per 1,000 people. Property crime specifically occurs at a rate of ${city.propertyCrimeRate} per 1,000 residents. With a median home value of $${(city.medianHomeValue / 1000).toFixed(0)}K, protecting your investment with a reliable security system is a smart decision for ${city.name} homeowners.

Vivint Smart Home offers full professional installation in ${city.name} and throughout the ${state.name} area. Local Vivint technicians can typically complete your installation within 24-48 hours of your initial consultation. Every system includes 24/7 professional monitoring from Vivint's dedicated monitoring centers, ensuring rapid response if an alarm is triggered at your ${city.name} home.

${city.crimeRate > 35 ? `Given ${city.name}'s higher-than-average crime rate, a professionally monitored security system is particularly important. Studies show that homes with visible security systems are 300% less likely to be burglarized. Vivint's AI-powered cameras with Smart Sentry technology provide an extra layer of deterrence, alerting you to potential threats before they become emergencies.` : `While ${city.name} enjoys a ${crimeLevel} compared to national averages, property crime can affect any neighborhood. A Vivint smart security system provides peace of mind with 24/7 monitoring, AI-powered cameras, and instant mobile alerts — so you always know your ${city.name} home is protected, whether you're at work, on vacation, or just upstairs.`}`
}

export function getCityFAQs(state: State, city: City): { q: string; a: string }[] {
  return [
    {
      q: `How much does Vivint cost in ${city.name}, ${state.abbreviation}?`,
      a: `Vivint pricing in ${city.name} starts at $29.99/month for 24/7 professional monitoring. Most ${city.name} homeowners qualify for $0 down equipment financing and free professional installation. The exact monthly cost depends on your home's size, number of entry points, and which smart features you choose. Take our free quiz to get a personalized quote for your ${city.name} home.`,
    },
    {
      q: `Is Vivint available in ${city.name}?`,
      a: `Yes! Vivint offers full service in ${city.name}, ${state.abbreviation}, including free professional installation by certified local technicians. Coverage extends throughout the ${city.name} metro area and across ${state.name}. Installation can typically be scheduled within 24-48 hours.`,
    },
    {
      q: `What is the crime rate in ${city.name}, ${state.abbreviation}?`,
      a: `${city.name} has a crime rate of approximately ${city.crimeRate} incidents per 1,000 residents, with property crime at ${city.propertyCrimeRate} per 1,000. ${city.crimeRate > 35 ? 'This is above the national average, making a home security system an important investment for local homeowners.' : 'While this is moderate, property crime can happen in any neighborhood. A monitored security system significantly reduces your risk.'} FBI data shows homes without security systems are 300% more likely to be burglarized.`,
    },
    {
      q: `How long does Vivint installation take in ${city.name}?`,
      a: `Vivint installation in ${city.name} typically takes 2-4 hours and is completed by a certified local technician at no cost to you. Most ${city.name} homeowners can schedule their installation within 24-48 hours of their initial consultation. The technician handles everything — mounting cameras, installing sensors, configuring the hub, and setting up your mobile app.`,
    },
    {
      q: `Does Vivint work with my smart home devices in ${city.name}?`,
      a: `Yes. Vivint systems in ${city.name} integrate with Google Assistant, Amazon Alexa, Nest thermostats, Kwikset and Yale smart locks, Philips Hue lights, and many other popular smart home devices. Your Vivint technician will connect compatible devices during your free installation. The Vivint app lets you control everything from one place.`,
    },
    {
      q: `What happens if I move from ${city.name}?`,
      a: `Vivint makes moving easy. If you relocate from ${city.name} to anywhere in the U.S. where Vivint operates, they'll send a technician to uninstall your equipment and reinstall it at your new home. Many ${city.name} customers use a move as an opportunity to upgrade their system with additional cameras or smart home features.`,
    },
  ]
}
