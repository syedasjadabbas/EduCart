import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, []);

    const login = async (email, password, rememberMe = false) => {
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                if (rememberMe) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                } else {
                    sessionStorage.setItem('userInfo', JSON.stringify(data));
                }
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password, isStudentVerified) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, isStudentVerified })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
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
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
