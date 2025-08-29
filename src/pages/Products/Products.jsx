import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Products.css'

// Funções auxiliares para persistir o carrinho no localStorage
function loadCart() {
  try {
    const raw = localStorage.getItem('shopcart_cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem('shopcart_cart', JSON.stringify(cart))
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState(loadCart())

  const navigate = useNavigate()

  // Efeito para buscar os produtos da API na primeira renderização
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const res = await fetch('https://fakestoreapi.com/products')
        if (!res.ok) throw new Error('Falha ao carregar produtos')
        const data = await res.json()
        setProducts(data)
        setError('')
      } catch (err) {
        setError(err.message || 'Erro inesperado')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Efeito para salvar o carrinho no localStorage sempre que ele for alterado
  useEffect(() => {
    saveCart(cart)
  }, [cart])

  // Memoiza a lista de categorias para evitar recálculos
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  // Memoiza a lista de produtos visíveis com base no filtro de categoria
  const visibleProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory)
  }, [products, selectedCategory])
  
  // Memoiza o cálculo do valor total do carrinho
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  // Função para ADICIONAR um item novo ou INCREMENTAR um existente
  function handleAddToCart(product) {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Função para DECREMENTAR a quantidade ou REMOVER o item
  function handleRemoveFromCart(productId) {
    setCart(prev => {
      const itemInCart = prev.find(item => item.id === productId);

      if (itemInCart?.quantity === 1) {
        return prev.filter(item => item.id !== productId);
      }

      return prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }

  if (loading) return <div className="centered-container">Carregando...</div>
  if (error) return <div className="centered-container">Erro: {error}</div>

  return (
    <div className='products-page'>
        <header className='products-header'>
            <h1>Nossos Produtos</h1>
            <div className='header-cart-info'>
                <span>Total: R$ {total.toFixed(2)}</span>
                <button 
                    onClick={() => navigate('/checkout')}
                    disabled={cart.length === 0}
                >
                    Ir para o Checkout ({cart.reduce((acc, item) => acc + item.quantity, 0)} itens)
                </button>
            </div>
        </header>

      <div className='category-filters'>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className='products-grid'>
        {visibleProducts.map(p => {
          const cartItem = cart.find(item => item.id === p.id);
          const quantityInCart = cartItem?.quantity || 0;

          return (
            <div key={p.id} className='product-card'>
              <div className='card-image-container' onClick={() => navigate(`/products/${p.id}`)}>
                <img src={p.image} alt={p.title} className='product-image' />
              </div>
              <div className='product-info'>
                  <h3 className='product-title'>{p.title}</h3>
                  <p className='product-price'>R$ {p.price.toFixed(2)}</p>
              </div>
              
              <div className="card-actions">
                {quantityInCart === 0 ? (
                  <button className='add-to-cart-button' onClick={() => handleAddToCart(p)}>
                    Adicionar ao carrinho
                  </button>
                ) : (
                  <div className='quantity-control'>
                    <button onClick={() => handleRemoveFromCart(p.id)}>-</button>
                    <span>{quantityInCart}</span>
                    <button onClick={() => handleAddToCart(p)}>+</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}