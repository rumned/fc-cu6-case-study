import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        // redirect to login if no token
        if (!token || token === '') {
            navigate('/');
            return;
        }

        // fetch products
        api.get('/products', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setProducts(response.data);
        })
        .catch(err => {
            // handle 401/403 errors
            if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <div>
                <h1>Products</h1>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => navigate('/products/new')}>Add New Product</button>
            </div>
            <div>
                {products.map(product => (
                    <div key={product._id}>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} width="200" />}
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.price.toFixed(2)}</p>
                        <p>Category: {product.category}</p>
                        <p>Status: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                        <button onClick={() => navigate(`/products/edit/${product._id}`)}>Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;