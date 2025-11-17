import { ShoppingCart, UtensilsCrossed } from 'lucide-react'

function Header({ cartCount, onOpenCart }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SwiftEats</h1>
            <p className="text-xs text-gray-500">Fast. Fresh. Delivered.</p>
          </div>
        </div>
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
        >
          <ShoppingCart size={18} />
          <span className="text-sm font-semibold">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
