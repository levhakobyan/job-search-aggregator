'use client';

import { create } from 'zustand';
import { Job } from '../types/Job';

interface FavoritesState {
    favorites: Job[];
    addFavorite: (job: Job) => void;
    removeFavorite: (jobId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
    favorites: [],
    addFavorite: (job) =>
        set((state) => ({
            favorites: [...state.favorites, job],
        })),
    removeFavorite: (jobId) =>
        set((state) => ({
            favorites: state.favorites.filter((job) => job.id !== jobId),
        })),
}));
