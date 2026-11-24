"""
Mock Travel Data

Realistic travel data for demonstration and production fallback.
Provides comprehensive information for flights, hotels, activities, and dining across top destinations:
- Tokyo
- Paris
- Rome
- Bali
- New York
"""

# =============================================================================
# DESTINATIONS CATALOG
# =============================================================================

DESTINATIONS_META = [
    {
        "id": "tokyo",
        "name": "Tokyo",
        "country": "Japan",
        "tagline": "Neon Metropolises & Timeless Shrines",
        "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "thumbnail": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
        "currency": "JPY",
        "price_level": "$$$",
        "best_season": "Spring (Cherry Blossoms) & Autumn",
        "rating": 4.9,
        "popular_tags": ["Culture", "Sushi", "Temples", "Anime", "Modernity"],
        "base_flight_est": 780,
        "base_hotel_est": 180,
    },
    {
        "id": "paris",
        "name": "Paris",
        "country": "France",
        "tagline": "The City of Lights, Art & Romance",
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        "thumbnail": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
        "currency": "EUR",
        "price_level": "$$$",
        "best_season": "May - September",
        "rating": 4.8,
        "popular_tags": ["Romance", "Louvre", "Pastries", "Architecture", "Fashion"],
        "base_flight_est": 650,
        "base_hotel_est": 220,
    },
    {
        "id": "rome",
        "name": "Rome",
        "country": "Italy",
        "tagline": "The Eternal City of Empires & Pasta",
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
        "thumbnail": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80",
        "currency": "EUR",
        "price_level": "$$",
        "best_season": "April - June & October",
        "rating": 4.8,
        "popular_tags": ["History", "Colosseum", "Pasta", "Vatican", "Gelato"],
        "base_flight_est": 620,
        "base_hotel_est": 160,
    },
    {
        "id": "bali",
        "name": "Bali",
        "country": "Indonesia",
        "tagline": "Island of Gods, Waterfalls & Tropical Zen",
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "thumbnail": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
        "currency": "IDR",
        "price_level": "$",
        "best_season": "May - September (Dry Season)",
        "rating": 4.9,
        "popular_tags": ["Beaches", "Surfing", "Temples", "Villas", "Nature"],
        "base_flight_est": 890,
        "base_hotel_est": 95,
    },
    {
        "id": "new york",
        "name": "New York",
        "country": "United States",
        "tagline": "The City That Never Sleeps",
        "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
        "thumbnail": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80",
        "currency": "USD",
        "price_level": "$$$$",
        "best_season": "Autumn & Festive Winter",
        "rating": 4.7,
        "popular_tags": ["Broadway", "Skylines", "Museums", "Dining", "Central Park"],
        "base_flight_est": 380,
        "base_hotel_est": 280,
    },
]

# =============================================================================
# FLIGHT DATA
# =============================================================================

MOCK_FLIGHTS = {
    "tokyo": [
        {
            "id": "FL001",
            "airline": "Japan Airlines",
            "flight_number": "JL005",
            "departure_city": "Los Angeles",
            "arrival_city": "Tokyo Narita (NRT)",
            "departure_time": "11:30 AM",
            "arrival_time": "03:30 PM+1",
            "duration": "12h 00m",
            "stops": 0,
            "class": "Economy",
            "price": 850,
            "currency": "USD",
        },
        {
            "id": "FL002",
            "airline": "ANA (All Nippon Airways)",
            "flight_number": "NH105",
            "departure_city": "Los Angeles",
            "arrival_city": "Tokyo Haneda (HND)",
            "departure_time": "01:45 PM",
            "arrival_time": "05:45 PM+1",
            "duration": "12h 00m",
            "stops": 0,
            "class": "Economy",
            "price": 920,
            "currency": "USD",
        },
        {
            "id": "FL003",
            "airline": "United Airlines",
            "flight_number": "UA839",
            "departure_city": "Los Angeles",
            "arrival_city": "Tokyo Narita (NRT)",
            "departure_time": "10:00 AM",
            "arrival_time": "02:15 PM+1",
            "duration": "12h 15m",
            "stops": 0,
            "class": "Economy",
            "price": 780,
            "currency": "USD",
        },
        {
            "id": "FL004",
            "airline": "Korean Air",
            "flight_number": "KE012",
            "departure_city": "Los Angeles",
            "arrival_city": "Tokyo Narita (NRT)",
            "departure_time": "09:30 AM",
            "arrival_time": "06:45 PM+1",
            "duration": "17h 15m",
            "stops": 1,
            "layover": "Seoul ICN (2h 30m)",
            "class": "Economy",
            "price": 650,
            "currency": "USD",
        },
    ],
    "paris": [
        {
            "id": "FL005",
            "airline": "Air France",
            "flight_number": "AF065",
            "departure_city": "New York JFK",
            "arrival_city": "Paris CDG",
            "departure_time": "07:00 PM",
            "arrival_time": "08:30 AM+1",
            "duration": "7h 30m",
            "stops": 0,
            "class": "Economy",
            "price": 650,
            "currency": "USD",
        },
        {
            "id": "FL006",
            "airline": "Delta Air Lines",
            "flight_number": "DL264",
            "departure_city": "New York JFK",
            "arrival_city": "Paris CDG",
            "departure_time": "10:30 PM",
            "arrival_time": "12:00 PM+1",
            "duration": "7h 30m",
            "stops": 0,
            "class": "Economy",
            "price": 580,
            "currency": "USD",
        },
        {
            "id": "FL007",
            "airline": "Norse Atlantic",
            "flight_number": "N0301",
            "departure_city": "New York JFK",
            "arrival_city": "Paris CDG",
            "departure_time": "11:55 PM",
            "arrival_time": "01:15 PM+1",
            "duration": "7h 20m",
            "stops": 0,
            "class": "Economy",
            "price": 490,
            "currency": "USD",
        },
    ],
    "rome": [
        {
            "id": "FL008",
            "airline": "ITA Airways",
            "flight_number": "AZ609",
            "departure_city": "New York JFK",
            "arrival_city": "Rome FCO",
            "departure_time": "05:30 PM",
            "arrival_time": "08:00 AM+1",
            "duration": "8h 30m",
            "stops": 0,
            "class": "Economy",
            "price": 620,
            "currency": "USD",
        },
        {
            "id": "FL009",
            "airline": "Lufthansa",
            "flight_number": "LH401",
            "departure_city": "New York JFK",
            "arrival_city": "Rome FCO",
            "departure_time": "03:45 PM",
            "arrival_time": "09:30 AM+1",
            "duration": "11h 45m",
            "stops": 1,
            "layover": "Frankfurt (2h 10m)",
            "class": "Economy",
            "price": 540,
            "currency": "USD",
        },
    ],
    "bali": [
        {
            "id": "FL010",
            "airline": "Singapore Airlines",
            "flight_number": "SQ037",
            "departure_city": "San Francisco",
            "arrival_city": "Bali DPS",
            "departure_time": "11:15 PM",
            "arrival_time": "11:50 AM+2",
            "duration": "21h 35m",
            "stops": 1,
            "layover": "Singapore Changi (2h 15m)",
            "class": "Economy",
            "price": 890,
            "currency": "USD",
        },
        {
            "id": "FL011",
            "airline": "Qatar Airways",
            "flight_number": "QR740",
            "departure_city": "San Francisco",
            "arrival_city": "Bali DPS",
            "departure_time": "04:10 PM",
            "arrival_time": "05:30 AM+2",
            "duration": "24h 20m",
            "stops": 1,
            "layover": "Doha (3h 05m)",
            "class": "Economy",
            "price": 940,
            "currency": "USD",
        },
    ],
    "new york": [
        {
            "id": "FL012",
            "airline": "JetBlue",
            "flight_number": "B6624",
            "departure_city": "Los Angeles LAX",
            "arrival_city": "New York JFK",
            "departure_time": "08:15 AM",
            "arrival_time": "04:45 PM",
            "duration": "5h 30m",
            "stops": 0,
            "class": "Economy",
            "price": 320,
            "currency": "USD",
        },
        {
            "id": "FL013",
            "airline": "Delta Air Lines",
            "flight_number": "DL470",
            "departure_city": "Los Angeles LAX",
            "arrival_city": "New York JFK",
            "departure_time": "11:30 AM",
            "arrival_time": "08:00 PM",
            "duration": "5h 30m",
            "stops": 0,
            "class": "Comfort+",
            "price": 410,
            "currency": "USD",
        },
    ]
}

# =============================================================================
# HOTEL DATA
# =============================================================================

MOCK_HOTELS = {
    "tokyo": [
        {
            "id": "HT001",
            "name": "Park Hyatt Tokyo",
            "neighborhood": "Shinjuku",
            "rating": 4.8,
            "reviews": 2847,
            "price_per_night": 450,
            "currency": "USD",
            "amenities": ["Spa", "Sky Pool", "Gym", "New York Grill", "Floor-to-Ceiling Views"],
            "description": "Legendary luxury tower hotel overlooking Mount Fuji and the glittering Shinjuku skyline.",
            "traveler_type": ["couples", "luxury", "romantic", "business"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT002",
            "name": "Shinjuku Granbell Hotel",
            "neighborhood": "Shinjuku / Kabukicho",
            "rating": 4.3,
            "reviews": 1523,
            "price_per_night": 120,
            "currency": "USD",
            "amenities": ["Rooftop Bar", "Restaurant", "Free High-Speed WiFi", "Art Interiors"],
            "description": "Stylish designer boutique hotel situated minutes from Shinjuku station and dining alleys.",
            "traveler_type": ["solo", "couples", "budget", "friends"],
            "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT003",
            "name": "Hilton Tokyo Bay",
            "neighborhood": "Maihama (Disney Resort Area)",
            "rating": 4.4,
            "reviews": 3201,
            "price_per_night": 200,
            "currency": "USD",
            "amenities": ["Lagoon Pool", "Disney Shuttles", "Kids Club", "Family Suites"],
            "description": "Magical waterfront family resort with theme rooms and easy monorail access to Tokyo Disney.",
            "traveler_type": ["families", "kids", "groups"],
            "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT004",
            "name": "The Peninsula Tokyo",
            "neighborhood": "Marunouchi / Ginza",
            "rating": 4.9,
            "reviews": 1876,
            "price_per_night": 600,
            "currency": "USD",
            "amenities": ["World-Class Spa", "Indoor Pool", "Rolls-Royce Chauffeur", "Fine Dining"],
            "description": "Ultra-opulent beacon opposite the Imperial Palace gardens with peerless Japanese hospitality.",
            "traveler_type": ["luxury", "couples", "executive"],
            "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT005",
            "name": "MIMARU Tokyo Shinjuku West",
            "neighborhood": "Nishi-Shinjuku",
            "rating": 4.6,
            "reviews": 920,
            "price_per_night": 180,
            "currency": "USD",
            "amenities": ["Full Kitchen", "Washer/Dryer", "Dining Area", "Family Bunk Beds"],
            "description": "Spacious apartment-hotel created specifically for families and groups who want homely convenience.",
            "traveler_type": ["families", "groups", "long-stay"],
            "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
        },
    ],
    "paris": [
        {
            "id": "HT006",
            "name": "Le Meurice - Dorchester Collection",
            "neighborhood": "1st Arrondissement",
            "rating": 4.9,
            "reviews": 1245,
            "price_per_night": 800,
            "currency": "USD",
            "amenities": ["2-Michelin Star Dining", "Valmont Spa", "Tuileries Views", "Butler Service"],
            "description": "Iconic 18th-century palace hotel inspired by Versailles, overlooking the Tuileries Garden and Louvre.",
            "traveler_type": ["luxury", "couples", "honeymoon"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT007",
            "name": "Hotel Fabric Paris",
            "neighborhood": "11th Arrondissement (Oberkampf)",
            "rating": 4.6,
            "reviews": 987,
            "price_per_night": 170,
            "currency": "USD",
            "amenities": ["Boutique Spa & Hammam", "Honesty Bar", "Industrial Chic Design", "Breakfast Buffet"],
            "description": "Chic converted textile workshop with vibrant pop colors, minutes from trendy bistros and Marais.",
            "traveler_type": ["couples", "solo", "cultural"],
            "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT008",
            "name": "Novotel Paris Les Halles",
            "neighborhood": "Châtelet / Les Halles",
            "rating": 4.4,
            "reviews": 2100,
            "price_per_night": 210,
            "currency": "USD",
            "amenities": ["Family Rooms", "Garden Terrace", "Direct RER to CDG", "Kids Corner"],
            "description": "Prime central location walking distance to Notre Dame, Pompidou, and Louvre with family-sized rooms.",
            "traveler_type": ["families", "sightseeing", "moderate"],
            "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
        }
    ],
    "rome": [
        {
            "id": "HT009",
            "name": "Hotel Artemide",
            "neighborhood": "Via Nazionale / Repubblica",
            "rating": 4.8,
            "reviews": 2400,
            "price_per_night": 190,
            "currency": "USD",
            "amenities": ["Panoramic Rooftop Lounge", "Artemis Spa", "Complimentary Minibar", "Breakfast included"],
            "description": "Celebrated boutique hotel known for world-class hospitality and easy stroll to Colosseum and Trevi.",
            "traveler_type": ["couples", "solo", "sightseeing"],
            "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT010",
            "name": "Hotel de Russie",
            "neighborhood": "Piazza del Popolo",
            "rating": 4.9,
            "reviews": 1420,
            "price_per_night": 650,
            "currency": "USD",
            "amenities": ["Secret Garden Courtyard", "De Russie Spa", "Jardin de Russie Dining"],
            "description": "Historic Roman palace nestled between Spanish Steps and Piazza del Popolo with enchanting terraced gardens.",
            "traveler_type": ["luxury", "couples", "honeymoon"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
    ],
    "bali": [
        {
            "id": "HT011",
            "name": "Maya Ubud Resort & Spa",
            "neighborhood": "Petanu River Valley, Ubud",
            "rating": 4.9,
            "reviews": 3100,
            "price_per_night": 160,
            "currency": "USD",
            "amenities": ["River Valley Infinity Pools", "Ayurvedic Spa", "Yoga Pavilions", "Private Villas"],
            "description": "Secluded paradise surrounded by tropical rainforest and rice terraces along the gentle Petanu River.",
            "traveler_type": ["couples", "relaxation", "nature", "honeymoon"],
            "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT012",
            "name": "The Seminyak Beach Resort & Spa",
            "neighborhood": "Seminyak Beach",
            "rating": 4.7,
            "reviews": 1890,
            "price_per_night": 230,
            "currency": "USD",
            "amenities": ["Oceanfront Infinity Pool", "Sunset Beach Bar", "Spa", "Private Plunge Pool Villas"],
            "description": "Beachfront oasis offering prime sunset views over the Indian Ocean with trendy beach club access.",
            "traveler_type": ["beach", "couples", "groups"],
            "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
        }
    ],
    "new york": [
        {
            "id": "HT013",
            "name": "1 Hotel Central Park",
            "neighborhood": "Midtown Manhattan",
            "rating": 4.7,
            "reviews": 1650,
            "price_per_night": 390,
            "currency": "USD",
            "amenities": ["Living Green Wall", "Jams Restaurant", "Field House Gym", "Central Park Views"],
            "description": "Eco-luxury sanctuary crafted with reclaimed woods, one block from Central Park and 5th Avenue.",
            "traveler_type": ["luxury", "couples", "lifestyle"],
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
            "id": "HT014",
            "name": "Arlo Midtown",
            "neighborhood": "Midtown West",
            "rating": 4.4,
            "reviews": 1280,
            "price_per_night": 210,
            "currency": "USD",
            "amenities": ["Rooftop Lounge", "Co-working spaces", "Free Barista Coffee", "Terrace Rooms"],
            "description": "Modern urban hub with smart micro-rooms and vibrant social scene near Times Square & Hudson Yards.",
            "traveler_type": ["solo", "couples", "business"],
            "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        }
    ]
}

# =============================================================================
# ACTIVITIES DATA
# =============================================================================

MOCK_ACTIVITIES = {
    "tokyo": [
        {
            "id": "AC001",
            "name": "Senso-ji Temple & Asakusa Walking Tour",
            "category": "Culture",
            "duration": "3 hours",
            "price": 45,
            "currency": "USD",
            "rating": 4.7,
            "description": "Explore Tokyo's oldest temple, incense rituals, and the lively Nakamise craft market with an expert guide.",
            "best_for": ["culture", "history", "photography"],
            "location": "Asakusa",
            "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC002",
            "name": "Meiji Shrine & Harajuku Fashion Alley",
            "category": "Culture",
            "duration": "2.5 hours",
            "price": 35,
            "currency": "USD",
            "rating": 4.6,
            "description": "Walk beneath towering cedar torii gates to Tokyo's serene Shinto shrine, then cross into colorful Takeshita Street.",
            "best_for": ["culture", "shopping", "youth"],
            "location": "Harajuku / Shibuya",
            "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC003",
            "name": "Imperial Palace East Gardens",
            "category": "Culture",
            "duration": "1.5 hours",
            "price": 0,
            "currency": "USD",
            "rating": 4.5,
            "description": "Free stroll across historical Edo Castle stone moats, pristine bamboo groves, and seasonal tea pavilions.",
            "best_for": ["culture", "nature", "budget"],
            "location": "Marunouchi",
            "image": "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC004",
            "name": "Tsukiji Outer Market Gourmet Tasting",
            "category": "Food",
            "duration": "3 hours",
            "price": 80,
            "currency": "USD",
            "rating": 4.9,
            "description": "Taste sea urchin, melt-in-your-mouth wagyu skewers, tamagoyaki, and ultra-fresh nigiri with an insider foodie.",
            "best_for": ["food", "morning", "culture"],
            "location": "Tsukiji",
            "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC005",
            "name": "teamLab Planets Immersive Digital Art",
            "category": "Entertainment",
            "duration": "2.5 hours",
            "price": 38,
            "currency": "USD",
            "rating": 4.8,
            "description": "Walk through water and mirror labyrinths surrounded by floating digital orchids and cosmic infinity rooms.",
            "best_for": ["art", "photography", "unique"],
            "location": "Toyosu",
            "image": "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC006",
            "name": "Tokyo Skytree Sunset Deck",
            "category": "Views",
            "duration": "2 hours",
            "price": 25,
            "currency": "USD",
            "rating": 4.6,
            "description": "Breathtaking 360-degree panorama of Greater Tokyo and Mount Fuji from 450 meters up in the sky.",
            "best_for": ["views", "sunset", "romantic"],
            "location": "Sumida",
            "image": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=500&q=80"
        },
    ],
    "paris": [
        {
            "id": "AC007",
            "name": "Louvre Museum VIP Guided Tour",
            "category": "Culture",
            "duration": "3 hours",
            "price": 75,
            "currency": "USD",
            "rating": 4.9,
            "description": "Skip lines to marvel at the Mona Lisa, Winged Victory of Samothrace, and French Crown Jewels with an art historian.",
            "best_for": ["art", "history", "culture"],
            "location": "1st Arrondissement",
            "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC008",
            "name": "Eiffel Tower Summit & Champagne",
            "category": "Views",
            "duration": "2 hours",
            "price": 55,
            "currency": "USD",
            "rating": 4.8,
            "description": "Ascend to the very top platform of the Iron Lady and toast with chilled champagne overlooking Parisian rooftops.",
            "best_for": ["romantic", "views", "bucket-list"],
            "location": "7th Arrondissement",
            "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC009",
            "name": "Seine River Evening Dinner Cruise",
            "category": "Food",
            "duration": "2.5 hours",
            "price": 110,
            "currency": "USD",
            "rating": 4.7,
            "description": "3-course gourmet French dinner with live violin music as you glide past illuminated landmarks.",
            "best_for": ["romantic", "couples", "dining"],
            "location": "Pont de l'Alma",
            "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80"
        }
    ],
    "rome": [
        {
            "id": "AC010",
            "name": "Colosseum Arena Floor & Roman Forum",
            "category": "Culture",
            "duration": "3 hours",
            "price": 68,
            "currency": "USD",
            "rating": 4.9,
            "description": "Walk through the Gladiator's gate onto the reconstructed arena floor, followed by Julius Caesar's Forum.",
            "best_for": ["history", "culture", "monuments"],
            "location": "Piazza del Colosseo",
            "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC011",
            "name": "Vatican Museums & Sistine Chapel",
            "category": "Culture",
            "duration": "3.5 hours",
            "price": 85,
            "currency": "USD",
            "rating": 4.8,
            "description": "Early morning entry to Michelangelo's iconic ceiling and Raphael's Rooms with zero crowds.",
            "best_for": ["art", "history", "spiritual"],
            "location": "Vatican City",
            "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=500&q=80"
        }
    ],
    "bali": [
        {
            "id": "AC012",
            "name": "Ubud Monkey Forest & Rice Terraces",
            "category": "Nature",
            "duration": "5 hours",
            "price": 40,
            "currency": "USD",
            "rating": 4.8,
            "description": "Meet holy macaques in mossy temple forests, then swing high above emerald Tegalalang rice fields.",
            "best_for": ["nature", "photography", "adventure"],
            "location": "Ubud",
            "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC013",
            "name": "Uluwatu Sunset Temple & Kecak Fire Dance",
            "category": "Culture",
            "duration": "4 hours",
            "price": 35,
            "currency": "USD",
            "rating": 4.9,
            "description": "Clifftop temple drama against golden hour waves, followed by the hypnotic 50-man Kecak chanting fire show.",
            "best_for": ["culture", "sunset", "spiritual"],
            "location": "Uluwatu",
            "image": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=500&q=80"
        }
    ],
    "new york": [
        {
            "id": "AC014",
            "name": "Summit One Vanderbilt Observation",
            "category": "Views",
            "duration": "2 hours",
            "price": 42,
            "currency": "USD",
            "rating": 4.8,
            "description": "Multi-sensory mirrored infinity decks suspended 1,000 feet above Grand Central Terminal.",
            "best_for": ["views", "modern", "photography"],
            "location": "Midtown",
            "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80"
        },
        {
            "id": "AC015",
            "name": "Broadway Musical Premium Seats",
            "category": "Entertainment",
            "duration": "3 hours",
            "price": 120,
            "currency": "USD",
            "rating": 4.9,
            "description": "Experience Tony-award winning performances in the historic theater district.",
            "best_for": ["entertainment", "music", "nightlife"],
            "location": "Theater District",
            "image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80"
        }
    ]
}

# =============================================================================
# RESTAURANTS DATA
# =============================================================================

MOCK_RESTAURANTS = {
    "tokyo": [
        {
            "id": "RS001",
            "name": "Sukiyabashi Jiro",
            "cuisine": "Sushi",
            "price_range": "$$$$",
            "rating": 4.9,
            "neighborhood": "Ginza",
            "description": "Legendary temple of Edomae sushi. 20 courses prepared with decades of obsessive mastery.",
            "best_for": ["once-in-a-lifetime", "sushi lovers", "luxury"],
        },
        {
            "id": "RS002",
            "name": "Ichiran Shibuya",
            "cuisine": "Tonkotsu Ramen",
            "price_range": "$",
            "rating": 4.5,
            "neighborhood": "Shibuya",
            "description": "World-famous single-diner ramen booths tailored to your exact noodle firmness and chili preference.",
            "best_for": ["solo dining", "late night", "budget"],
        },
        {
            "id": "RS003",
            "name": "Gonpachi Nishi-Azabu",
            "cuisine": "Izakaya / Yakitori",
            "price_range": "$$",
            "rating": 4.4,
            "neighborhood": "Roppongi",
            "description": "The rustic timber barn that inspired Tarantino's 'Kill Bill'. Charcoal skewers and lively beer halls.",
            "best_for": ["groups", "atmosphere", "cocktails"],
        },
        {
            "id": "RS004",
            "name": "Afuri Ebisu",
            "cuisine": "Yuzu Shio Ramen",
            "price_range": "$",
            "rating": 4.6,
            "neighborhood": "Ebisu",
            "description": "Crisp, fragrant chicken broth infused with Japanese yuzu citrus. Refreshing and light.",
            "best_for": ["quick meal", "lunch", "modern"],
        },
        {
            "id": "RS005",
            "name": "Narisawa",
            "cuisine": "Innovative Satoyama",
            "price_range": "$$$$",
            "rating": 4.8,
            "neighborhood": "Minami-Aoyama",
            "description": "2-Michelin starred culinary poetry honoring Japanese forest ecology and sustainable foraging.",
            "best_for": ["fine dining", "special occasion", "foodies"],
        },
    ],
    "paris": [
        {
            "id": "RS006",
            "name": "Le Comptoir du Relais",
            "cuisine": "French Bistronomy",
            "price_range": "$$",
            "rating": 4.6,
            "neighborhood": "Saint-Germain-des-Prés",
            "description": "Pioneering neo-bistro by Chef Yves Camdeborde serving duck confit, escargot, and artisanal cheeses.",
            "best_for": ["authentic", "lunch", "wine"],
        },
        {
            "id": "RS007",
            "name": "L'Arpège",
            "cuisine": "Vegetable Haute Cuisine",
            "price_range": "$$$$",
            "rating": 4.9,
            "neighborhood": "7th Arrondissement",
            "description": "Chef Alain Passard's 3-Michelin starred temple celebrating biodynamic estate garden produce.",
            "best_for": ["luxury", "foodies", "special occasion"],
        },
        {
            "id": "RS008",
            "name": "Pink Mamma",
            "cuisine": "Italian Trattoria",
            "price_range": "$$",
            "rating": 4.7,
            "neighborhood": "Pigalle",
            "description": "Stunning 4-floor glasshouse trattoria famous for truffle pasta and Florentine steaks.",
            "best_for": ["trendy", "romantic", "cocktails"],
        }
    ],
    "rome": [
        {
            "id": "RS009",
            "name": "Roscioli Salumeria con Cucina",
            "cuisine": "Roman Classic",
            "price_range": "$$$",
            "rating": 4.8,
            "neighborhood": "Campo de' Fiori",
            "description": "The definitive Roman Carbonara and Amatriciana, backed by an encyclopedic 2,800-label wine vault.",
            "best_for": ["pasta lovers", "wine", "foodies"],
        },
        {
            "id": "RS010",
            "name": "Da Enzo al 29",
            "cuisine": "Traditional Roman",
            "price_range": "$$",
            "rating": 4.7,
            "neighborhood": "Trastevere",
            "description": "Charming cobbled-alley trattoria with legendary cacio e pepe, fried artichokes, and tiramisu.",
            "best_for": ["authentic", "casual", "dinner"],
        }
    ],
    "bali": [
        {
            "id": "RS011",
            "name": "Locavore NXT",
            "cuisine": "Modern Indonesian",
            "price_range": "$$$$",
            "rating": 4.9,
            "neighborhood": "Ubud",
            "description": "Ranked among Asia's top restaurants; hyper-local sustainable Indonesian tasting menus.",
            "best_for": ["innovative", "foodies", "fine dining"],
        },
        {
            "id": "RS012",
            "name": "Warung Babi Guling Ibu Oka",
            "cuisine": "Balinese Roasted Pork",
            "price_range": "$",
            "rating": 4.5,
            "neighborhood": "Ubud Palace",
            "description": "Anthony Bourdain's favorite roast suckling pig with spiced sambal and crackling skin.",
            "best_for": ["street food", "lunch", "authentic"],
        }
    ],
    "new york": [
        {
            "id": "RS013",
            "name": "Gramercy Tavern",
            "cuisine": "Contemporary American",
            "price_range": "$$$",
            "rating": 4.8,
            "neighborhood": "Flatiron",
            "description": "Warm hospitality, seasonal wood-fired grilling, and Danny Meyer's legendary hospitality.",
            "best_for": ["comfort", "special occasion", "dinner"],
        },
        {
            "id": "RS014",
            "name": "Joe's Pizza",
            "cuisine": "New York Pizza",
            "price_range": "$",
            "rating": 4.7,
            "neighborhood": "Greenwich Village",
            "description": "The quintessential hot NYC slice with folding crust and sweet San Marzano tomato sauce.",
            "best_for": ["quick bite", "late night", "budget"],
        }
    ]
}


def get_destinations():
    """Return all featured destinations metadata"""
    return DESTINATIONS_META

def normalize_city(city: str) -> str:
    """Normalize city names and airport suffixes."""
    city = city.lower().strip()

    # Remove common airport codes
    city = city.split("(")[0].strip()

    # Handle airport names such as JFK, CDG, FCO, LAX
    airport_suffixes = [
        " jfk", " lax", " cdg", " fco", " nrt", " hnd", " dps"
    ]

    for suffix in airport_suffixes:
        if city.endswith(suffix):
            city = city[:-len(suffix)].strip()

    return city


def get_flights(destination: str, origin_city: str = None) -> list:
    """Get flights filtered by destination and optional departure city."""

    destination = normalize_city(destination)

    flights = []

    for city_flights in MOCK_FLIGHTS.values():
        for flight in city_flights:

            flight_destination = normalize_city(
                flight["arrival_city"]
            )

            flight_origin = normalize_city(
                flight["departure_city"]
            )

            if flight_destination != destination:
                continue

            if origin_city:
                if flight_origin != normalize_city(origin_city):
                    continue

            flights.append(flight)

    return flights


def get_hotels(destination: str) -> list:
    """Get available hotels for a destination"""
    return MOCK_HOTELS.get(destination.lower().strip(), [])

def get_activities(destination: str) -> list:
    """Get available activities for a destination"""
    return MOCK_ACTIVITIES.get(destination.lower().strip(), [])

def get_restaurants(destination: str) -> list:
    """Get restaurant recommendations for a destination"""
    return MOCK_RESTAURANTS.get(destination.lower().strip(), [])
