import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Catch empty email or password fields
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await api.post('/user/login', {
                email,
                password
            });

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Redirect to products page
            navigate('/products');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className = "container">
            <h1>Login</h1>
            {error && <p className='error-message'>{error}</p>}
            {/* same as {error ? <p className='error-message}>{error}</p> : null} */}
            <form onSubmit={handleLogin}>
                <div className = "form-items">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className = "form-items">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='btn-primary' type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;