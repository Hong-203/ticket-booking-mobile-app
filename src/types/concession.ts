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

export interface ConcessionSelection {
  item: ConcessionItem
  quantity: number
  total_price: number
}
