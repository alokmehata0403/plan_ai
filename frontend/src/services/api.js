/**
 * API Service for Multi-Agent AI Travel Planner
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return null;
  }
}

export async function fetchDestinations() {
  try {
    const res = await fetch(`${BASE_URL}/api/destinations`);
    if (!res.ok) throw new Error(`Failed to fetch destinations: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Using fallback destinations:', err);
    return getFallbackDestinations();
  }
}

export async function fetchFlights(destination) {
  const res = await fetch(`${BASE_URL}/api/flights?destination=${encodeURIComponent(destination)}`);
  if (!res.ok) throw new Error('Failed to fetch flights');
  return await res.json();
}

export async function fetchHotels(destination) {
  const res = await fetch(`${BASE_URL}/api/hotels?destination=${encodeURIComponent(destination)}`);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return await res.json();
}

export async function fetchActivities(destination) {
  const res = await fetch(`${BASE_URL}/api/activities?destination=${encodeURIComponent(destination)}`);
  if (!res.ok) throw new Error('Failed to fetch activities');
  return await res.json();
}

export async function fetchRestaurants(destination) {
  const res = await fetch(`${BASE_URL}/api/restaurants?destination=${encodeURIComponent(destination)}`);
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  return await res.json();
}

export async function generateTripPlan(planRequest) {
  const res = await fetch(`${BASE_URL}/api/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planRequest)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Trip generation failed: ${errorText || res.statusText}`);
  }
  return await res.json();
}

export async function sendChatMessage(message, threadId, destination) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      thread_id: threadId,
      destination
    })
  });
  if (!res.ok) throw new Error('Chat failed');
  return await res.json();
}

/**
 * Stream real-time agent execution events via Server-Sent Events (SSE)
 */
export async function streamPlanGeneration(planRequest, onEvent, onError, onComplete) {
  try {
    const response = await fetch(`${BASE_URL}/api/plan/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(planRequest)
    });

    if (!response.ok) {
      throw new Error(`Stream request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.substring(6));
            if (data.type === 'done') {
              if (onComplete) onComplete();
              return;
            }
            if (onEvent) onEvent(data);
          } catch (e) {
            console.error('SSE JSON parse error:', e, trimmed);
          }
        }
      }
    }

    if (onComplete) onComplete();
  } catch (error) {
    console.error('SSE streaming error:', error);
    if (onError) onError(error);
  }
}

export function getFallbackDestinations() {
  return [
    {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      tagline: "Neon Metropolises & Timeless Shrines",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
      currency: "JPY",
      price_level: "$$$",
      best_season: "Spring & Autumn",
      rating: 4.9,
      popular_tags: ["Culture", "Sushi", "Temples", "Anime"],
      base_flight_est: 780,
      base_hotel_est: 180,
    },
    {
      id: "paris",
      name: "Paris",
      country: "France",
      tagline: "The City of Lights, Art & Romance",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
      currency: "EUR",
      price_level: "$$$",
      best_season: "May - September",
      rating: 4.8,
      popular_tags: ["Romance", "Louvre", "Pastries", "Fashion"],
      base_flight_est: 650,
      base_hotel_est: 220,
    },
    {
      id: "rome",
      name: "Rome",
      country: "Italy",
      tagline: "The Eternal City of Empires & Pasta",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80",
      currency: "EUR",
      price_level: "$$",
      best_season: "April - June",
      rating: 4.8,
      popular_tags: ["History", "Colosseum", "Pasta", "Vatican"],
      base_flight_est: 620,
      base_hotel_est: 160,
    },
    {
      id: "bali",
      name: "Bali",
      country: "Indonesia",
      tagline: "Island of Gods & Tropical Zen",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
      currency: "IDR",
      price_level: "$",
      best_season: "May - September",
      rating: 4.9,
      popular_tags: ["Beaches", "Surfing", "Temples", "Villas"],
      base_flight_est: 890,
      base_hotel_est: 95,
    },
    {
      id: "new york",
      name: "New York",
      country: "United States",
      tagline: "The City That Never Sleeps",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80",
      currency: "USD",
      price_level: "$$$$",
      best_season: "Autumn & Holidays",
      rating: 4.7,
      popular_tags: ["Broadway", "Skylines", "Museums", "Central Park"],
      base_flight_est: 380,
      base_hotel_est: 280,
    }
  ];
}
