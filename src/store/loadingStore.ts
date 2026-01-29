import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  activeRequests: number;
  startLoading: () => void;
  stopLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  activeRequests: 0,

  startLoading: () => set((state) => {
    const newActiveRequests = state.activeRequests + 1;
    return {
      activeRequests: newActiveRequests,
      isLoading: newActiveRequests > 0,
    };
  }),

  stopLoading: () => set((state) => {
    const newActiveRequests = Math.max(0, state.activeRequests - 1);
    return {
      activeRequests: newActiveRequests,
      isLoading: newActiveRequests > 0,
    };
  }),
}));

export default useLoadingStore;
