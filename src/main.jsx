//FILE: /src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Renderiza o aplicativo React no DOM (Document Object Model)
createRoot(document.getElementById('root')).render(
  // Ativa o modo estrito para verificações adicionais no desenvolvimento
  <StrictMode>
    {/* Configura o roteamento para toda a aplicação */}
    <BrowserRouter>
      {/* Componente principal do aplicativo */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// DOM: Pense nele como uma representação estruturada de uma página da web. Quando um navegador carrega uma página HTML, ele cria essa representação em forma de "árvore" hierárquica na memória do seu computador.
