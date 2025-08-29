import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

// Reutilizamos as mesmas funções do localStorage
function loadCart() {
  try {
    const raw = localStorage.getItem('shopcart_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('shopcart_cart', JSON.stringify(cart));
}

export default function Checkout() {
  const [cart, setCart] = useState(loadCart());
  const navigate = useNavigate();

  // Salva o carrinho no localStorage sempre que ele muda
  useEffect(() => {
    saveCart(cart);
  }, [cart]);
  
  // Calcula o total geral
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Funções para manipular a quantidade (idênticas às do Products.jsx)
  function handleIncrement(productId) {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function handleDecrement(productId) {
    setCart(prev => {
      const item = prev.find(i => i.id === productId);
      if (item?.quantity === 1) {
        return prev.filter(i => i.id !== productId);
      }
      return prev.map(i =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function handleRemoveItem(productId) {
      setCart(prev => prev.filter(item => item.id !== productId));
  }

  function handleFinalizePurchase() {
      // Limpa o carrinho
      setCart([]);
      // Exibe uma mensagem de sucesso
      alert('Compra realizada com sucesso! Obrigado por comprar conosco.');
      // Redireciona para a página inicial
      navigate('/');
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h1>Seu carrinho está vazio</h1>
        <Link to="/products" className="back-to-products-link">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Resumo da Compra</h1>
      <div className="cart-items-list">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="item-image" />
            <div className="item-details">
              <h2 className="item-title">{item.title}</h2>
              <p className="item-price">
                Preço Unitário: R$ {item.price.toFixed(2)}
              </p>
              <div className="item-quantity-control">
                <span>Quantidade:</span>
                <div className="quantity-buttons">
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
              </div>
            </div>
            <div className="item-subtotal">
              <p>Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.id)} className="remove-item-btn">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-summary">
        <h2 className="summary-total">Total Geral: R$ {total.toFixed(2)}</h2>
        <button onClick={handleFinalizePurchase} className="finalize-purchase-btn">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}