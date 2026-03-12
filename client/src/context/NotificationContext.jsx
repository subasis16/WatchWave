import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const socket = io('http://localhost:5000');

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on('receive-notification', (newNotification) => {
            const notifWithId = { ...newNotification, id: Date.now() + Math.random() };

            setNotifications((prev) => [notifWithId, ...prev]);

            toast(notifWithId.message, {
                icon: '🔔',
                style: {
                    borderRadius: '12px',
                    background: '#1C1D21',
                    color: '#fff',
                    border: '1px solid #E50914',
                    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                    fontSize: '14px',
                    fontWeight: '500'
                },
            });
        });

        return () => {
            socket.off('receive-notification');
        };
    }, []);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
