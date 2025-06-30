import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import ProductCard from '../../components/ProductCard';

function CategoryPage() {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get(`/products?category=${categoryName}`)
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load category products'));
  }, [categoryName]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 capitalize">{categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showActions={true}
            />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
