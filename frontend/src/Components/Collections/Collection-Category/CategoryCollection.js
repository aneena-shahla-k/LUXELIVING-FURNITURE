import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../../../Components/Collections/Collection-Category/ProductGrid';
import { API } from '../../../api';

const CategoryCollection = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API.products}?category=${categoryName}`);
        const data = await response.json();
        
        if (response.ok) {
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); 

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: '150px' }}>
        <p className="text-muted">Loading {categoryName} collection...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center" style={{ marginTop: '150px' }}>
        <h3 className="text-muted">No products found in "{categoryName}" collection</h3>
        <p className="text-muted">Please check if the category name matches exactly with MongoDB.</p>
        <a href="/collection" className="btn btn-dark mt-3" style={{ backgroundColor: '#3d5245', border: 'none' }}>
          Back to Collections
        </a>
      </div>
    );
  }

  const pageTitle = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Collection`;

  return (
    <ProductGrid products={products} title={pageTitle} />
  );
};

export default CategoryCollection;