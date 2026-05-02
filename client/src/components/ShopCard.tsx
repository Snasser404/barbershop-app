import { Link } from 'react-router-dom'
import { BarberShop } from '../types'
import StarRating from './StarRating'

interface Props {
  shop: BarberShop
}

export default function ShopCard({ shop }: Props) {
  const minPrice = shop.services?.length
    ? Math.min(...shop.services.map((s) => s.price))
    : null

  return (
    <Link to={`/shops/${shop.id}`} className="card hover:shadow-md transition-shadow block group">
      <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
        {shop.coverImage ? (
          <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <span className="text-5xl text-primary/30">✂</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{shop.name}</h3>
          {shop.offers && shop.offers.length > 0 && (
            <span className="badge bg-accent/20 text-amber-800 shrink-0">
              {shop.offers.length} offer{shop.offers.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <span>📍</span> {shop.address}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(shop.rating)} size="sm" />
            <span className="text-sm text-gray-500">({shop.reviewCount})</span>
          </div>
          <div className="text-right">
            {minPrice !== null && (
              <span className="text-sm font-medium text-gray-700">from <span className="text-primary font-semibold">${minPrice}</span></span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{shop.openingTime} – {shop.closingTime}</p>
      </div>
    </Link>
  )
}
