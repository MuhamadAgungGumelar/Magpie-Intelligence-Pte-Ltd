import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article } from '@/lib/types/article';
import { DateRange } from '@/lib/types/common';
import { subDays } from 'date-fns';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  // Dashboard date range
  dashboardDateRange: DateRange;
  setDashboardDateRange: (range: DateRange) => void;

  // Management filters
  managementFilters: {
    search: string;
    categories: string[];
    source: string | null;
    author: string | null;
    dateRange: DateRange | null;
  };
  setManagementFilters: (filters: Partial<UIState['managementFilters']>) => void;
  clearManagementFilters: () => void;

  // Article form dialog
  articleFormDialog: {
    open: boolean;
    article: Article | null;
  };
  openArticleForm: (article?: Article) => void;
  closeArticleForm: () => void;

  // Delete confirm dialog
  deleteConfirmDialog: {
    open: boolean;
    article: Article | null;
  };
  openDeleteConfirm: (article: Article) => void;
  closeDeleteConfirm: () => void;

  // Last sync timestamp
  lastSyncAt: string | null;
  setLastSyncAt: (timestamp: string) => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Dark mode
  darkMode: false,
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    // Apply dark mode to document
    if (typeof window !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { darkMode: newDarkMode };
  }),
  setDarkMode: (enabled) => set(() => {
    // Apply dark mode to document
    if (typeof window !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { darkMode: enabled };
  }),

  // Dashboard date range (default: last 30 days)
  dashboardDateRange: {
    from: subDays(new Date(), 30),
    to: new Date(),
  },
  setDashboardDateRange: (range) => set({ dashboardDateRange: range }),

  // Management filters
  managementFilters: {
    search: '',
    categories: [],
    source: null,
    author: null,
    dateRange: null,
  },
  setManagementFilters: (filters) => set((state) => ({
    managementFilters: { ...state.managementFilters, ...filters }
  })),
  clearManagementFilters: () => set({
    managementFilters: {
      search: '',
      categories: [],
      source: null,
      author: null,
      dateRange: null,
    }
  }),

  // Article form dialog
  articleFormDialog: {
    open: false,
    article: null,
  },
  openArticleForm: (article) => set({
    articleFormDialog: { open: true, article: article || null }
  }),
  closeArticleForm: () => set({
    articleFormDialog: { open: false, article: null }
  }),

  // Delete confirm dialog
  deleteConfirmDialog: {
    open: false,
    article: null,
  },
  openDeleteConfirm: (article) => set({
    deleteConfirmDialog: { open: true, article }
  }),
  closeDeleteConfirm: () => set({
    deleteConfirmDialog: { open: false, article: null }
  }),

  // Last sync
  lastSyncAt: null,
  setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'news-ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);

export default useUIStore;
