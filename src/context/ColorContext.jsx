import { createContext, useContext, useEffect, useState } from 'react';

const ColorContext = createContext();

export function ColorProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    // También puedes actualizar --primary-dark (un tono más oscuro automático)
    const darker = adjustColor(primaryColor, -20);
    document.documentElement.style.setProperty('--primary-dark', darker);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  // Función para oscurecer un color (simplificada)
  const adjustColor = (hex, percent) => {
    // implementación simple (puedes usar librería o hacerlo manual)
    // Por simplicidad, devolvemos el mismo color; luego lo mejoramos
    return hex;
  };

  return (
    <ColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  return useContext(ColorContext);
}