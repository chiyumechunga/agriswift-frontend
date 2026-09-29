import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const role = localStorage.getItem('agriswift_role');
        const id = localStorage.getItem('agriswift_id');
        return role ? { role, id, name: role === 'farmer' ? 'Mutale Banda' : 'Officer' } : null;
    });

    const login = (role, id) => {
        localStorage.setItem('agriswift_role', role);
        localStorage.setItem('agriswift_id', id);
        setUser({ role, id, name: role === 'farmer' ? 'Mutale Banda' : 'Officer' });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);