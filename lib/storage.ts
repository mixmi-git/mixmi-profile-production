import { STORAGE_KEYS } from "@/types";

// Add validation helpers
const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const StorageService = {
  getItem: <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      if (!isValidJSON(item)) return fallback;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return fallback;
    }
  },
  
  setItem: <T,>(key: string, value: T): boolean => {
    if (typeof window === "undefined") return false;
    
    try {
      const valueStr = JSON.stringify(value);
      localStorage.setItem(key, valueStr);
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }
}; 