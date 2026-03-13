import { createContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setAuthLoading(false);
    }, []);

    const login = async (email, password, rememberMe = false) => {
        try {
            const res = await fetchApi('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password })
            });

            // Debugging
            const text = await res.text();
            console.log('Login Response Status:', res.status);
            console.log('Login Response Body:', text);

            if (!text) {
                return { success: false, message: 'Server returned an empty response.' };
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                return { success: false, message: 'Server returned invalid JSON.' };
            }

            if (res.ok) {
                setUser(data);
                if (rememberMe) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                } else {
                    sessionStorage.setItem('userInfo', JSON.stringify(data));
                }
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password, isStudentVerified) => {
        try {
            const res = await fetchApi('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, isStudentVerified })
            });

            const text = await res.text();
            if (!text) {
                return { success: false, message: 'Server returned an empty response.' };
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                return { success: false, message: 'Server returned invalid JSON.' };
            }

            if (res.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration Error:', error);
            return { success: false, message: error.message };
        }
    };

    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData };
        setUser(merged);
        if (localStorage.getItem('userInfo')) {
            localStorage.setItem('userInfo', JSON.stringify(merged));
        } else if (sessionStorage.getItem('userInfo')) {
            sessionStorage.setItem('userInfo', JSON.stringify(merged));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
