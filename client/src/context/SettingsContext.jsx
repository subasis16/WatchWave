import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SettingsContext = createContext();

const defaultSettings = {
  autoplay: true,
  audioDesc: false,
  rating: 2, // 0: G, 1: PG, 2: PG-13, 3: R, 4: NC-17
  pinEnabled: true,
  dailyLimit: 120,
  highContrast: false,
  motionReduction: false,
  volume: 80,
  captions: true
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('watchwave_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().settings) {
                    setSettings(prev => ({ ...prev, ...userDoc.data().settings }));
                }
            } catch (err) {
                console.error("Failed to load cloud settings", err);
            }
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('watchwave_settings', JSON.stringify(settings));
    if (auth.currentUser) {
        setDoc(doc(db, 'users', auth.currentUser.uid), { settings }, { merge: true })
            .catch(err => console.error("Cloud settings sync failed:", err));
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{
      ...settings,
      updateSetting,
      toggleSetting,
      resetSettings
    }}>
      <div className={settings.highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
