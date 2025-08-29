//FILE: /src/App.jsx

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Products from './pages/Products/Products.jsx'
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx'
import Checkout from './pages/Checkout/Checkout.jsx'

// Componente principal da aplicação que gerencia as rotas.
export default function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      {/* Rota para a página de Login. */}
      <Route path="/" element={<Login />} />
      {/* Rota para a página de listagem de Produtos. */}
      <Route path="/products" element={<Products />} />
      {/* Rota para os detalhes de um Produto específico, usando um ID dinâmico. */}
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      {/* Rota curinga que redireciona qualquer URL não reconhecida para a página de Login. */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
