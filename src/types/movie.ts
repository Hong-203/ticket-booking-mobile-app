export interface Director {
  movie_id: string
  director: string
  created_at: string
  updated_at: string
}

export interface Genre {
  movie_id: string
  genre: string
  created_at: string
  updated_at: string
}

export interface Movie {
  id: string
  name: string
  slug: string
  image_path: string
  language: string
  synopsis: string
  rating: string
  duration: string
  top_cast: string
  release_date: string
  trailer_url: string
  created_at: string
  updated_at: string
  directors: Director[]
  genres: Genre[]
}

export interface Seat {
  id: string
  name: string
  description: string
  status: 'empty' | 'booked' | 'pending'
  created_at: string
  updated_at: string
  user_id: string | null
}
