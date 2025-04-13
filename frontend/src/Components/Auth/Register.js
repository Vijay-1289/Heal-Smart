import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/Context';

const RegisterStyled = styled.div`
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    h2 {
        text-align: center;
        color: ${({ theme }) => theme.colors.primary};
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: ${({ theme }) => theme.colors.text};
        }

        input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;

            &:focus {
                outline: none;
                border-color: ${({ theme }) => theme.colors.primary};
            }
        }
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: ${({ theme }) => theme.colors.primary};
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background: ${({ theme }) => theme.colors.secondary};
        }
    }

    .login-link {
        text-align: center;
        margin-top: 1rem;

        a {
            color: ${({ theme }) => theme.colors.primary};
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
`;

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to register the user
        // For now, we'll just simulate a successful registration
        login();
        navigate('/dashboard');
    };

    return (
        <RegisterStyled>
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <div className="login-link">
                Already have an account? <a href="/login">Login</a>
            </div>
        </RegisterStyled>
    );
}

export default Register; 