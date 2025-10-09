import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserProfile, Subject, ChatMessage } from '@/types';

interface AppState {
  user: User | null;
  currentProfile: UserProfile | null;
  subjects: Subject[];
  recentChats: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_USER' };

const initialState: AppState = {
  user: null,
  currentProfile: null,
  subjects: [],
  recentChats: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PROFILE':
      return { ...state, currentProfile: action.payload };
    case 'SET_SUBJECTS':
      return { ...state, subjects: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        recentChats: [action.payload, ...state.recentChats].slice(0, 50)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_USER':
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setProfile: (profile: UserProfile) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lawgen-user');
    const savedProfile = localStorage.getItem('lawgen-profile');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }

    if (savedProfile) {
      dispatch({ type: 'SET_PROFILE', payload: savedProfile as UserProfile });
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('lawgen-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('lawgen-user');
    }
  }, [state.user]);

  useEffect(() => {
    if (state.currentProfile) {
      localStorage.setItem('lawgen-profile', state.currentProfile);
    } else {
      localStorage.removeItem('lawgen-profile');
    }
  }, [state.currentProfile]);

  const setProfile = (profile: UserProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  };

  const addChatMessage = (message: ChatMessage) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      setProfile, 
      addChatMessage, 
      clearError 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}