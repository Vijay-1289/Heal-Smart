import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import doctorImg from '../../img/doctor.png';

const CLIENT_ID = "716171060715-uhqjdilis0d35u3ivbfgbn80mvf4q1qi.apps.googleusercontent.com";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleSuccess = async (response) => {
            try {
                console.log('Google response:', response);
                
                // Decode the JWT token from Google
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                console.log('Decoded token:', decodedToken);

                // Create user object from Google data
                const user = {
                    email: decodedToken.email,
                    name: decodedToken.name,
                    picture: decodedToken.picture,
                    given_name: decodedToken.given_name,
                    family_name: decodedToken.family_name
                };

                // Store the token and user data
                localStorage.setItem('token', response.credential);
                localStorage.setItem('user', JSON.stringify(user));
                
                toast.success('Login successful!');
                navigate('/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
                toast.error(`Login failed: ${error.message}`);
            }
        };

        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
            return;
        }

        // Load Google Sign-In script
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                if (window.google) {
                    console.log('Initializing Google Sign-In with origin:', window.location.origin);
                    window.google.accounts.id.initialize({
                        client_id: CLIENT_ID,
                        callback: handleGoogleSuccess,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                        scope: 'email profile'
                    });

                    console.log('Rendering Google Sign-In button');
                    window.google.accounts.id.renderButton(
                        document.getElementById("googleSignIn"),
                        {
                            type: 'standard',
                            theme: "outline",
                            size: "large",
                            text: "signin_with",
                            shape: "rectangular",
                            logo_alignment: "left",
                            width: 280
                        }
                    );
                }
            };

            return script;
        };

        const script = loadGoogleScript();
        return () => {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
            if (window.google) {
                window.google.accounts.id.cancel();
            }
        };
    }, [navigate]);

    return (
        <LoginStyled>
            <div className="login-container">
                <div className="left-side">
                    <img src={doctorImg} alt="Doctor illustration" />
                </div>
                <div className="right-side">
                    <div className="login-content">
                        <h1>Welcome to Heal Smart</h1>
                        <p className="subtitle">Your Personal Health Assistant</p>
                        
                        <div className="features">
                            <div className="feature">
                                <span className="icon">🤖</span>
                                <h3>AI Health Assistant</h3>
                                <p>Get instant health insights and guidance</p>
                            </div>
                            <div className="feature">
                                <span className="icon">📊</span>
                                <h3>Health Tracking</h3>
                                <p>Monitor your health progress</p>
                            </div>
                            <div className="feature">
                                <span className="icon">🏥</span>
                                <h3>Medical Resources</h3>
                                <p>Access reliable health information</p>
                            </div>
                        </div>

                        <div className="login-box">
                            <h2>Sign In</h2>
                            <p>Continue with your Google account</p>
                            <div id="googleSignIn"></div>
                        </div>
                    </div>
                </div>
            </div>
        </LoginStyled>
    );
}

const LoginStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
    padding: 2rem;

    .login-container {
        display: flex;
        background: white;
        border-radius: 20px;
        overflow: hidden;
        width: 100%;
        max-width: 1200px;
        min-height: 600px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

        .left-side {
            flex: 1;
            background: #f8f9ff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;

            img {
                max-width: 100%;
                height: auto;
            }
        }

        .right-side {
            flex: 1;
            padding: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }

    .login-content {
        text-align: center;
        max-width: 400px;
        margin: 0 auto;

        h1 {
            color: #2d3748;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .subtitle {
            color: #718096;
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
    }

    .features {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;

        .feature {
            text-align: center;
            padding: 1rem;

            .icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            h3 {
                color: #2d3748;
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }

            p {
                color: #718096;
                font-size: 0.875rem;
            }
        }
    }

    .login-box {
        background: #f7fafc;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;

        h2 {
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }

        p {
            color: #718096;
            margin-bottom: 1.5rem;
        }

        #googleSignIn {
            display: flex;
            justify-content: center;
        }
    }

    @media (max-width: 968px) {
        .login-container {
            flex-direction: column;
            max-width: 500px;

            .left-side {
                display: none;
            }
        }

        .features {
            grid-template-columns: 1fr;
        }
    }
`;

export default Login; 