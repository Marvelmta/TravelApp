# Travel Explorer App

A modern and responsive **Travel App** built with **React** and **TypeScript**.  
The app lets users explore countries around the world, see the weather in the capital, read short descriptions from Wikipedia, and view images from Unsplash.

---

## Functions

**Search for countries** – A search bar on the homepage to find specific countries.  
- **Filter by continent** – Buttons to filter between continents (Africa, Europe, Asia, etc).  
- **Pagination** – 12 countries per page.  
- **Country detail page** – Each country page shows:
  - Population  
  - Capital  
  - Currency  
  - Language  
  - Region  
  - Short description from Wikipedia  
  - Current weather in the capital (OpenWeatherMap)  
  - Background image from Unsplash

---

## APIs

| API | Purpose | Link |
|-----|---------|------|
| **REST Countries** | Country information (name, capital, population, language, currency, region) | [https://restcountries.com](https://restcountries.com) |
| **OpenWeatherMap** | Current weather in the country's capital | [https://openweathermap.org/api](https://openweathermap.org/api) |
| **Wikipedia REST API** | Short description of the country | [https://www.mediawiki.org/wiki/API:REST_API](https://www.mediawiki.org/wiki/API:REST_API) |
| **Unsplash API** | Background images from the country | [https://unsplash.com/developers](https://unsplash.com/developers) |

---

## Tech Stack

**Built with:**
- React   
- TypeScript  
- Tailwind CSS
- ShadCN 
- Fetch API for API requests  

---

## Installation

```bash
# Clone the project
git clone https://github.com/<your-username>/TravelApp.git

# Go into the project folder
cd TravelApp

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following keys:

```bash
VITE_OPENWEATHER_API_KEY=<your_api_key>
VITE_UNSPLASH_ACCESS_KEY=<your_api_key>
```

---

## Project Structure 

```
/src
├── components/
│   ├── CountryCard.tsx
│   ├── CountryDetail.tsx
│   ├── CountryList.tsx
│   ├── LoadingSpinner.tsx
│   ├── SearchBar.tsx
│   ├── ErrorMessage.tsx
│   └── ContinentFilter.tsx
├── lib/
│   ├── utils.ts
├── styles/
│   ├── globals.css
├── App.tsx
└── index.css
└── main.tsx
```
---

## Screenshots

### Home Page
![Home Page](/src/assets/homepage.png)

### Country Page
![Country Page](/src/assets/countrypage.png)

### Country Page Details
![Country Page Details](/src/assets/countrypage2.png)

