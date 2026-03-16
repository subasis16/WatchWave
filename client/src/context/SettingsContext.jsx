import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('watchwave_settings');
    return saved ? JSON.parse(saved) : {
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
  });

  useEffect(() => {
    localStorage.setItem('watchwave_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings({
      autoplay: true,
      audioDesc: false,
      rating: 2,
      pinEnabled: true,
      dailyLimit: 120,
      highContrast: false,
      motionReduction: false,
      volume: 80,
      captions: true
    });
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
