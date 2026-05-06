import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/auth');
        }
    }, [isLoading, isAuthenticated]);
    
    if (isLoading) return <div className="min-h-screen bg-[#0a0a0f]" />
    if (!isAuthenticated) return null;
    return <>{children}</>;
}