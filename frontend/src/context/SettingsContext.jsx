import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '../services/api.js';

const defaultSettings = { crmName: 'KD CRM', logo: '' };

const SettingsContext = createContext({ settings: defaultSettings, refreshSettings: () => {} });

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);

    const refreshSettings = async () => {
        const response = await getSettings();
        if (response && response.data) {
            setSettings(response.data);
        }
    }

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
