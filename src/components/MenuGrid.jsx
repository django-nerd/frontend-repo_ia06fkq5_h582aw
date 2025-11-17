function MenuGrid({ items, onAdd }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item._id || item.name} className="bg-white rounded-xl border p-4">
          <div className="flex gap-3">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description || 'Tasty and fresh'}</p>
                </div>
                <div className="font-semibold text-gray-900">${(item.price ?? 0).toFixed(2)}</div>
              </div>
              <button
                onClick={() => onAdd(item)}
                className="mt-3 w-full text-sm bg-gray-900 text-white rounded-lg py-2 hover:bg-black transition"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenuGrid
