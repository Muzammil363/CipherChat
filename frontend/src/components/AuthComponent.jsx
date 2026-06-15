import React, { useState } from 'react';
import styles from '../styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authActions } from '../store/index.js';
import { privateKeyActions } from '../store/index.js';
import { getECDHKeyPairFromPIN } from '../services/Encryption.js';
import { apiRequest } from '../services/api.js';

const AuthComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        pin:'',
        confirmPin:''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.pin || formData.pin.length<2) {
            toast.error('Please provide a valid pin');
            return ;
        }
        const keys=getECDHKeyPairFromPIN(formData.pin);
        if (isLogin) {
            try {
                await apiRequest('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    })
                });
                dispatch(privateKeyActions.setPrivateKey({privateKey:keys.privateKey}));
                toast.success("Logged in Successfully");
                dispatch(authActions.login());
                navigate("/u/home");
            } catch (error) {
                toast.error(error.message);
            }

        } else {
            if (formData.pin != formData.confirmPin) {
                toast.error("Security PINS did not match");
                return;
            }
            try {
                const data = await apiRequest('/api/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        fullName: formData.fullName,
                        password: formData.password,
                        publicKey:keys.publicKeyHex
                    })
                });
                toast.success(data.message);
                dispatch(privateKeyActions.setPrivateKey({privateKey:keys.privateKey}))
                dispatch(authActions.login());
                navigate('/u/home');
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            fullName: '',
            pin:'',
            confirmPin:''
        });
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>💬</div>
                        <h2 className={styles.brandName}>ChatApp</h2>
                    </div>
                    <h1 className={styles.authTitle}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className={styles.authSubtitle}>
                        {isLogin
                            ? 'Sign in to continue your conversations'
                            : 'Join millions of users worldwide'
                        }
                    </p>
                </div>

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName" className={styles.inputLabel}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                placeholder="Enter your full name"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={styles.inputField}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={styles.inputField}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="pin" className={styles.inputLabel}>
                            Your SECRET PIN ( User must remember this)
                        </label>
                        <input
                            type="password"
                            id="pin"
                            name="pin"
                            value={formData.pin}
                            onChange={handleInputChange}
                            className={styles.inputField}
                            placeholder="Enter a SECRET PIN"
                            required={true}
                        />
                    </div>

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPIN" className={styles.inputLabel}>
                                Confirm SECRET PIN
                            </label>
                            <input
                                type="password"
                                id="confirmPin"
                                name="confirmPin"
                                value={formData.confirmPin}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                placeholder="Confirm your SECRET PIN"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className={styles.forgotPassword}>
                            <a href="#" className={styles.forgotLink}>
                                Forgot your password?
                            </a>
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <div className={styles.authSwitch}>
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={toggleForm}
                            className={styles.switchBtn}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            <div className={styles.authBackground}>
                <div className={styles.floatingShape}></div>
                <div className={styles.floatingShape}></div>
                <div className={styles.floatingShape}></div>
            </div>
        </div>
    );
};

export default AuthComponent;
