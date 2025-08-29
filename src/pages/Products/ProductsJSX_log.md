```javascript
// ARQUIVO: Products.jsx
// Este componente representa a página principal de listagem de produtos do e-commerce.
// Ele é responsável por:
// - Buscar e exibir produtos da API.
// - Implementar filtros por categoria.
// - Gerenciar o carrinho de compras (adição, remoção, ajuste de quantidade) de forma persistente.
// - Redirecionar para a página de detalhes do produto.

// Importa hooks essenciais do React para gerenciar estado, efeitos colaterais e otimização.
import { useEffect, useMemo, useState } from 'react'
// Importa o hook useNavigate do React Router para navegação programática.
import { useNavigate } from 'react-router-dom'
// Importa o arquivo de estilo CSS específico para esta página.
import './Products.css'

// Bloco de funções auxiliares para persistir o carrinho no localStorage.

// Função para carregar o carrinho do localStorage.
// Tenta obter os dados salvos e os converte de JSON para um objeto JavaScript.
function loadCart() {
  try {
    const raw = localStorage.getItem('shopcart_cart')
    return raw ? JSON.parse(raw) : [] // Retorna o carrinho ou um array vazio se não houver dados.
  } catch {
    return [] // Em caso de erro (ex: dados corrompidos), retorna um carrinho vazio.
  }
}

// Função para salvar o carrinho no localStorage.
// Converte o objeto do carrinho para uma string JSON antes de salvar.
function saveCart(cart) {
  localStorage.setItem('shopcart_cart', JSON.stringify(cart))
}

// Definição do componente funcional Products.
export default function Products() {
  // Bloco de estados locais para gerenciar a UI e os dados da página.

  // Estado para armazenar a lista de todos os produtos obtidos da API.
  const [products, setProducts] = useState([])
  // Estado para indicar se os produtos estão sendo carregados da API.
  const [loading, setLoading] = useState(true)
  // Estado para armazenar mensagens de erro, se ocorrerem durante a requisição.
  const [error, setError] = useState('')
  // Estado para controlar a categoria de produto atualmente selecionada para filtro.
  const [selectedCategory, setSelectedCategory] = useState('all')
  // Estado para armazenar os itens do carrinho, inicializado com os dados do localStorage.
  const [cart, setCart] = useState(loadCart())

  // Hook do React Router para permitir a navegação entre as rotas.
  const navigate = useNavigate()

  // Bloco de efeitos colaterais (useEffect) para buscar dados e persistir o estado.

  // Efeito para buscar os produtos da API na primeira renderização do componente.
  useEffect(() => {
    // Função assíncrona para realizar a requisição HTTP.
    async function fetchProducts() {
      try {
        setLoading(true) // Define o estado de carregamento como verdadeiro.
        // Faz a requisição para a API de todos os produtos.
        const res = await fetch('https://fakestoreapi.com/products')
        // Verifica se a resposta da requisição foi bem-sucedida.
        if (!res.ok) throw new Error('Falha ao carregar produtos')
        // Converte a resposta para JSON.
        const data = await res.json()
        setProducts(data) // Atualiza o estado com os produtos recebidos.
        setError('') // Limpa qualquer erro anterior.
      } catch (err) {
        // Captura e define mensagens de erro em caso de falha na requisição.
        setError(err.message || 'Erro inesperado')
      } finally {
        setLoading(false) // Define o estado de carregamento como falso, independentemente do sucesso ou falha.
      }
    }
    fetchProducts() // Chama a função para buscar os produtos.
  }, []) // O array vazio indica que este efeito roda apenas uma vez após a montagem inicial.

  // Efeito para salvar o carrinho no localStorage sempre que o estado 'cart' for alterado.
  useEffect(() => {
    saveCart(cart) // Chama a função auxiliar para salvar o carrinho.
  }, [cart]) // Este efeito é re-executado sempre que o valor de 'cart' muda.

  // Bloco de funções e valores memoizados (useMemo) para otimização de performance.

  // Memoiza a lista de categorias únicas disponíveis nos produtos.
  // Isso evita recriar a lista de categorias em cada renderização desnecessária.
  const categories = useMemo(() => {
    // Cria um Set para obter categorias únicas e adiciona 'all' como opção de filtro.
    const set = new Set(products.map(p => p.category))
    return ['all', ...Array.from(set)]
  }, [products]) // Recalcula apenas quando a lista de 'products' muda.

  // Memoiza a lista de produtos visíveis com base no filtro de categoria.
  // Filtra os produtos para exibir apenas os da categoria escolhida.
  const visibleProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? products // Se 'all' estiver selecionado, mostra todos os produtos.
      : products.filter(p => p.category === selectedCategory) // Caso contrário, filtra pela categoria.
  }, [products, selectedCategory]) // Recalcula quando 'products' ou 'selectedCategory' muda.
  
  // Memoiza o cálculo do valor total atual do carrinho.
  // Soma o preço de cada item multiplicado pela sua quantidade.
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart]) // Recalcula apenas quando o 'cart' muda.

  // Bloco de funções para manipular o carrinho.

  // Função para ADICIONAR um novo item ao carrinho ou INCREMENTAR a quantidade de um item existente.
  function handleAddToCart(product) {
    setCart(prev => {
      // Verifica se o produto já existe no carrinho.
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        // Se existe, retorna um novo array com a quantidade do item incrementada.
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      // Se não existe, adiciona o produto ao carrinho com quantidade 1.
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Função para DECREMENTAR a quantidade de um item no carrinho ou REMOVER o item se a quantidade for 1.
  function handleRemoveFromCart(productId) {
    setCart(prev => {
      // Encontra o item específico no carrinho.
      const itemInCart = prev.find(item => item.id === productId);

      // Se a quantidade do item for 1, remove o item completamente do carrinho.
      if (itemInCart?.quantity === 1) {
        return prev.filter(item => item.id !== productId);
      }

      // Caso contrário (quantidade > 1), decrementa a quantidade do item.
      return prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }

  // Bloco de renderização condicional baseado nos estados de carregamento/erro.

  // Exibe uma mensagem de carregamento enquanto os produtos estão sendo buscados.
  if (loading) return <div className="centered-container">Carregando...</div>
  // Exibe uma mensagem de erro se a requisição de produtos falhar.
  if (error) return <div className="centered-container">Erro: {error}</div>

  // Bloco de renderização JSX do componente Products.
  return (
    <div className='products-page'>
        {/* Cabeçalho da página de produtos */}
        <header className='products-header'>
            <h1>Nossos Produtos</h1> {/* Título da página */}
            {/* Informações do carrinho no cabeçalho */}
            <div className='header-cart-info'>
                <span>Total: R$ {total.toFixed(2)}</span> {/* Exibe o total atual do carrinho */}
                {/* Botão para ir para a página de Checkout */}
                <button 
                    onClick={() => navigate('/checkout')} // Redireciona para /checkout ao clicar.
                    disabled={cart.length === 0} // Desabilita o botão se o carrinho estiver vazio.
                >
                    Ir para o Checkout ({cart.reduce((acc, item) => acc + item.quantity, 0)} itens) {/* Mostra a quantidade total de itens */}
                </button>
            </div>
        </header>

      {/* Seção de filtros de categoria */}
      <div className='category-filters'>
        {/* Mapeia as categorias para criar botões de filtro */}
        {categories.map(cat => (
          <button
            key={cat} // Chave única para cada botão na lista.
            onClick={() => setSelectedCategory(cat)} // Define a categoria selecionada ao clicar.
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`} // Adiciona classe 'active' se a categoria estiver selecionada.
          >
            {cat} {/* Texto do botão (nome da categoria) */}
          </button>
        ))}
      </div>

      {/* Grade de exibição dos produtos */}
      <div className='products-grid'>
        {/* Mapeia os produtos visíveis para criar cards individuais */}
        {visibleProducts.map(p => {
          // Encontra o item correspondente no carrinho para saber a quantidade atual.
          const cartItem = cart.find(item => item.id === p.id);
          // Obtém a quantidade do item no carrinho (ou 0 se não estiver no carrinho).
          const quantityInCart = cartItem?.quantity || 0;

          return (
            // Card individual de cada produto.
            <div key={p.id} className='product-card'>
              {/* Contêiner da imagem do produto, clicável para ir aos detalhes. */}
              <div className='card-image-container' onClick={() => navigate(`/products/${p.id}`)}>
                <img src={p.image} alt={p.title} className='product-image' /> {/* Imagem do produto */}
              </div>
              {/* Informações básicas do produto (título e preço). */}
              <div className='product-info'>
                  <h3 className='product-title'>{p.title}</h3> {/* Título do produto */}
                  <p className='product-price'>R$ {p.price.toFixed(2)}</p> {/* Preço do produto */}
              </div>
              
              {/* Seção de ações do card (botões de adicionar/controlar quantidade). */}
              <div className=\"card-actions\">
                {quantityInCart === 0 ? (
                  // Se o item não está no carrinho, mostra o botão "Adicionar ao carrinho".
                  <button className=\'add-to-cart-button\' onClick={() => handleAddToCart(p)}>
                    Adicionar ao carrinho
                  </button>
                ) : (
                  // Se o item está no carrinho, mostra o controle de quantidade (+ / -).
                  <div className=\'quantity-control\'>
                    <button onClick={() => handleRemoveFromCart(p.id)}>-</button> {/* Botão para decrementar/remover */}
                    <span>{quantityInCart}</span> {/* Exibe a quantidade atual no carrinho */}
                    <button onClick={() => handleAddToCart(p)}>+</button> {/* Botão para incrementar */}
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