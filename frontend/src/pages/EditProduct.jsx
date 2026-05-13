import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

function EditProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [inStock, setInStock] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        api.get(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const product = response.data;
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price);
            setCategory(product.category || '');
            setInStock(product.inStock);
            setImageUrl(product.imageUrl || '');
            setLoading(false);
        })
        .catch(err => {
            if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError('Product not found');
                setLoading(false);
            }
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        const token = localStorage.getItem('token');

        if (price <= 0) {
            setError('Price must be a positive number');
            setUpdating(false);
            return;
        }

        try {
            await api.patch(`/products/${id}`, {
                name,
                description,
                price: parseFloat(price),
                category,
                inStock,
                imageUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Product updated successfully!');
            setUpdating(false);
            setTimeout(() => navigate('/products'), 700);
        } catch (err) {
            setUpdating(false);
            if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError(`${err.response.status}: ${err.response.data.error || 'Something went wrong'}`);
            }
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        setDeleting(true);
        try {
            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Product deleted successfully!');
            setDeleting(false);
            setTimeout(() => navigate('/products'), 700);
        } catch (err) {
            setDeleting(false);
            if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                setError(`${err.response.status}: ${err.response.data.error || 'Something went wrong'}`);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Edit Product</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label>In Stock</label>
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                </div>
                <div>
                    <label>Image URL</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={updating}>
                    {updating ? 'Updating...' : 'Update Product'}
                </button>
                <button type="button" onClick={() => navigate('/products')}>Cancel</button>
                <button type="button" onClick={() => setShowConfirm(true)} disabled={deleting} style={{ color: 'red' }}>
                    Delete Product
                </button>
            </form>

            {showConfirm && (
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <button onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default EditProduct;