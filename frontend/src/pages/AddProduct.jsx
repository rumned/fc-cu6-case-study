import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [inStock, setInStock] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        if (!name || !price) {
            setError('Name and price are required');
            return;
        }

        if (price <= 0) {
            setError('Price must be a positive number');
            return;
        }

        setLoading(true);
        try {
            await api.post('/products', {
                name,
                description,
                price: parseFloat(price),
                category,
                inStock,
                imageUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Product created successfully!');
            setLoading(false);
            setTimeout(() => navigate('/products'), 700);
        } catch (err) {
            setLoading(false);
            if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError(`${err.response.status}: ${err.response.data.error || 'Something went wrong'}`);
            }
        }
    };

    return (
        <div className='container'>
            <h1>Add New Product</h1>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className='form-items'>
                    <label>Name (required)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='form-items'>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className='form-items'>
                    <label>Price (required)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className='form-items'>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className='form-items'>
                    <label>Image URL</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className='form-items-checkbox'>
                    <label>In Stock</label>
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                </div>
                <div className='button-row'>
                    <button type="submit" className='btn-add' disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                    <button type="button" className='btn-secondary' onClick={() => navigate('/products')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;