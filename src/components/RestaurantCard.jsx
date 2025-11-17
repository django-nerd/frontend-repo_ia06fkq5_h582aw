function RestaurantCard({ restaurant, onSelect }) {
  return (
    <button
      onClick={() => onSelect(restaurant)}
      className="text-left bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border"
    >
      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
          <p className="text-sm text-gray-500">{restaurant.cuisine || 'Various cuisines'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{restaurant.delivery_time || '25-35 min'}</p>
          <p className="text-xs text-yellow-600">★ {restaurant.rating ?? 4.5}</p>
        </div>
      </div>
    </button>
  )
}

export default RestaurantCard
