export interface Seat {
  id: string
  seat: {
    id: string
    name: string
    description: string
    status: string
    created_at: string
    updated_at: string
  }
  status: string
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
}

export interface Hall {
  id: string
  name: string
  totalSeats: number
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

export interface ConcessionItem {
  id: string
  name: string
  description: string
  price: string
  image_url: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface Concession {
  item: ConcessionItem
  quantity: number
  total_price: string
}

export interface TicketData {
  id: string
  user_id: string
  seat_total_price: string
  concession_total_price: string
  total_price: string
  movie_id: string
  hall_id: string
  showtime_id: string
  seats: Seat[]
  movie: Movie
  hall: Hall
  showtime: Showtime
  concessions: Concession[]
}
