import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import { listenToNotifications } from '../services/firebase-services';
import { useSettings } from './SettingsContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { isIntroFinished } = useSettings();

    useEffect(() => {
        let unsubscribe = null;

        const authUnsub = auth.onAuthStateChanged((user) => {
            if (user) {
                unsubscribe = listenToNotifications(user.uid, (notifs) => {
                    setNotifications(notifs);
                    
                    // Show toast for any unread notifications only if intro is finished
                    if (isIntroFinished) {
                        notifs.filter(n => !n.read).slice(0, 1).forEach(n => {
                            toast(n.message, {
                                icon: '🔔',
                                id: n.id, // prevent duplicates
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
                    }
                });
            } else {
                if (unsubscribe) unsubscribe();
                setNotifications([]);
            }
        });

        return () => {
            authUnsub();
            if (unsubscribe) unsubscribe();
        };
    }, [isIntroFinished]);

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
