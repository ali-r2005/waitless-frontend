"use client";
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';


export default function Profile() {
    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user'],
        queryFn: () => authApi.me(),
    });
    console.log(user);
    return (
        <div>
            <h1>Profile</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error.message}</p>}
            {user && <p>{user.email}</p>}
            {user && <p>{user.name}</p>}
            {user && <p>{user.phone}</p>}
            {user && <p>{user.role}</p>}
        </div>
    );
}