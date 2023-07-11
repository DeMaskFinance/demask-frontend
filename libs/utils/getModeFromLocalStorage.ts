export const getModeFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('MODE_DEMASK') || '';
    }
    return '';
  };