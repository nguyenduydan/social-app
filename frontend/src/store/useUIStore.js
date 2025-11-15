
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
    persist(
        (set) => ({
            enableAnimation: true,
            theme: {
                id: 'default',
                name: 'Mặc định',
                background: '#ffffff',
                messageSent: {
                    bg: '#0084ff',
                    text: '#ffffff'
                },
                messageReceived: {
                    bg: '#e4e6eb',
                    text: '#050505'
                }
            },
            customBackground: null,

            setEnableAnimation: (value) => set({ enableAnimation: value }),
            setTheme: (theme) => set({ theme }),
            setCustomBackground: (url) => set({ customBackground: url }),
            resetSettings: () => set({
                enableAnimation: true,
                theme: {
                    id: 'default',
                    name: 'Mặc định',
                    background: '#ffffff',
                    messageSent: {
                        bg: '#0084ff',
                        text: '#ffffff'
                    },
                    messageReceived: {
                        bg: '#e4e6eb',
                        text: '#050505'
                    }
                },
                customBackground: null
            })
        }),
        {
            name: 'ui-settings-storage'
        }
    )
);
