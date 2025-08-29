import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetails.css';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); // Pega o 'id' da URL (ex: /products/1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error('Produto não encontrado');
        const data = await res.json();
        setProduct(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Erro ao buscar detalhes do produto');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]); // O useEffect roda novamente se o 'id' na URL mudar

  if (loading) return <div className="details-container centered">Carregando...</div>;
  if (error) return <div className="details-container centered">Erro: {error}</div>;
  if (!product) return null; // Não renderiza nada se o produto ainda não foi carregado

  return (
    <div className="details-page">
      <Link to="/products" className="back-link">← Voltar para todos os produtos</Link>
      <div className="details-container">
        <div className="details-image-container">
          <img src={product.image} alt={product.title} className="details-image" />
        </div>
        <div className="details-info">
          <h1 className="details-title">{product.title}</h1>
          <p className="details-category">{product.category}</p>
          <div className="details-rating">
            <span>Avaliação: {product.rating.rate} ★</span>
            <span>({product.rating.count} avaliações)</span>
          </div>
          <p className="details-description">{product.description}</p>
          <p className="details-price">R$ {product.price.toFixed(2)}</p>
          {/* Opcional: Adicionar um botão "Adicionar ao Carrinho" aqui depois */}
        </div>
      </div>
    </div>
  );
}