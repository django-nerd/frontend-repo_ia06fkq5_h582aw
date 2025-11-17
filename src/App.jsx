import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'
import MenuGrid from './components/MenuGrid'
import CartDrawer from './components/CartDrawer'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch demo data; if DB empty, seed a couple items via API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/restaurants`)
        if (res.ok) {
          const data = await res.json()
          if (data.length === 0) {
            // Seed
            const demo = [
              {
                name: 'Sunset Pizza',
                description: 'Crispy crust, melty cheese',
                cuisine: 'Pizza',
                image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop',
                rating: 4.7,
                delivery_time: '20-30 min',
              },
              {
                name: 'Green Bowl',
                description: 'Healthy bowls & salads',
                cuisine: 'Healthy',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop',
                rating: 4.6,
                delivery_time: '25-35 min',
              },
            ]
            for (const r of demo) await fetch(`${API_BASE}/restaurants`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
            const newRes = await fetch(`${API_BASE}/restaurants`).then((r) => r.json())
            setRestaurants(newRes)
          } else {
            setRestaurants(data)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loadMenu = async () => {
      if (!selectedRestaurant) return
      const res = await fetch(`${API_BASE}/menu?restaurant_id=${encodeURIComponent(selectedRestaurant._id || selectedRestaurant.id || selectedRestaurant.name)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.length === 0) {
          // seed few menu items tied by restaurant_id as name fallback
          const rid = selectedRestaurant._id || selectedRestaurant.id || selectedRestaurant.name
          const demoMenu = [
            {
              restaurant_id: rid,
              name: 'Margherita',
              description: 'Fresh mozzarella, basil & tomato',
              price: 11.99,
              image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxNYXJnaGVyaXRhfGVufDB8MHx8fDE3NjMzNDE4NDZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
            },
            {
              restaurant_id: rid,
              name: 'Pepperoni',
              description: 'Classic with premium pepperoni',
              price: 13.49,
              image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxQZXBwZXJvbml8ZW58MHwwfHx8MTc2MzM0MTg0Nnww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
            },
            {
              restaurant_id: rid,
              name: 'Garden Bowl',
              description: 'Greens, quinoa, chickpeas & avocado',
              price: 12.25,
              image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
            },
          ]
          for (const m of demoMenu) await fetch(`${API_BASE}/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) })
          const newMenu = await fetch(`${API_BASE}/menu?restaurant_id=${encodeURIComponent(rid)}`).then((r) => r.json())
          setMenu(newMenu)
        } else {
          setMenu(data)
        }
      }
    }
    loadMenu()
  }, [selectedRestaurant])

  const addToCart = (item) => {
    setCart((prev) => {
      const id = item._id || item.id || item.name
      const existing = prev.find((p) => p.id === id)
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
      }
      return [...prev, { id, name: item.name, price: item.price, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
  }

  const checkout = async () => {
    if (!selectedRestaurant) return
    const body = {
      customer_name: 'Guest',
      address: '123 Main St',
      phone: '123-456-7890',
      restaurant_id: selectedRestaurant._id || selectedRestaurant.id || selectedRestaurant.name,
      items: cart.map((c) => ({ menu_item_id: c.id, quantity: c.quantity })),
    }
    const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setCart([])
      alert('Order placed!')
      setCartOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">
      <Header cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setCartOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular nearby</h2>
          <p className="text-gray-600">Pick a place to see the menu</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id || r.name} restaurant={r} onSelect={setSelectedRestaurant} />
            ))}
          </div>
        )}

        {selectedRestaurant && (
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selectedRestaurant.name} Menu</h3>
              <button onClick={() => setSelectedRestaurant(null)} className="text-sm text-gray-600 hover:underline">
                Back to restaurants
              </button>
            </div>
            <MenuGrid items={menu} onAdd={addToCart} />
          </div>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onCheckout={checkout}
        onUpdateQty={updateQty}
      />
    </div>
  )
}

export default App
