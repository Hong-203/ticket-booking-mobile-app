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
}

export interface Showtime {
  id: string
  movie_start_time: string
  show_type: string
  showtime_date: string
  price_per_seat: number
  created_at: string
  updated_at: string
}

export interface Theatre {
  id: string
  name: string
  slug_name: string
  location: string
  slug_location: string
  locationDetails: string
  created_at: string
  updated_at: string
}

export interface Hall {
  id: string
  name: string
  totalSeats: number
  created_at: string
  updated_at: string
  theatre: Theatre
}

export interface ShownIn {
  movie_id: string
  showtime_id: string
  hall_id: string
  movie: Movie
  showtime: Showtime
  hall: Hall
  created_at: string
  updated_at: string
}

export interface ShownInState {
  shownInList: ShownIn[]
  shownInDetails: ShownIn | null
  loading: boolean
  error: string | null
  response: string | null
}
