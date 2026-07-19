import { createContext, useContext, useState } from 'react';
import { verifyOwnerPin } from '../services/api.js';

const OwnerLockContext = createContext({
    unlocked: false,
    dialogOpen: false,
    openDialog: () => {},
    closeDialog: () => {},
    unlock: async () => false,
    lock: () => {},
});

export const OwnerLockProvider = ({ children }) => {
    const [unlocked, setUnlocked] = useState(sessionStorage.getItem('ownerUnlocked') === 'true');
    const [dialogOpen, setDialogOpen] = useState(false);

    const unlock = async (pin) => {
        try {
            await verifyOwnerPin(pin);
            setUnlocked(true);
            sessionStorage.setItem('ownerUnlocked', 'true');
            setDialogOpen(false);
            return true;
        } catch (error) {
            throw error;
        }
    }

    const lock = () => {
        setUnlocked(false);
        sessionStorage.removeItem('ownerUnlocked');
    }

    return (
        <OwnerLockContext.Provider value={{
            unlocked,
            dialogOpen,
            openDialog: () => setDialogOpen(true),
            closeDialog: () => setDialogOpen(false),
            unlock,
            lock,
        }}>
            {children}
        </OwnerLockContext.Provider>
    );
}

export const useOwnerLock = () => useContext(OwnerLockContext);
