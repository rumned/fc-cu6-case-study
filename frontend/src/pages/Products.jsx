import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        axios.get('http://localhost:3000/products', {
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
            </div>
            <div>
                {products.map(product => (
                    <div key={product._id}>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} width="200" />}
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Category: {product.category}</p>
                        <p>Status: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;