/**
 * searchEngine.js
 * Utilidad de búsqueda con ranking de relevancia y soporte para búsqueda estricta.
 */

const normalize = (str) => 
  str ? String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';

/**
 * Busca y rankea elementos según relevancia o coincidencia estricta.
 * 
 * @param {Array} items - Lista de objetos a filtrar.
 * @param {string} searchTerm - Término de búsqueda.
 * @param {Array} searchFields - Campos donde buscar (ej. ['nombre', 'codigo']).
 * @param {Object} options - Opciones de búsqueda.
 * @param {boolean} options.strict - Si es true, solo busca coincidencias exactas o que comiencen con el término.
 * @returns {Array} - Lista filtrada y ordenada.
 */
export const rankItems = (items, searchTerm, searchFields = ['nombre', 'codigo'], options = {}) => {
  if (!items || !Array.isArray(items)) return [];
  const term = normalize(searchTerm);
  if (!term) return items;

  const { strict = false } = options;
  const tokens = term.split(/\s+/).filter(t => t.length > 0);

  if (strict) {
    // MODO ESTRICTO: Solo exactos o que comiencen con el término (para códigos)
    return items.filter(item => {
      return searchFields.some(field => {
        const val = normalize(item[field]);
        return val === term || val.startsWith(term);
      });
    });
  }

  // MODO RELEVANCIA: Ranking ponderado
  return items
    .map(item => {
      let score = 0;
      let matched = false;

      searchFields.forEach(field => {
        const val = normalize(item[field]);
        if (!val) return;

        // 1. Coincidencia Exacta (Máxima prioridad)
        if (val === term) {
          score += 1000;
          matched = true;
        }

        // 2. Comienza con el término completo
        if (val.startsWith(term)) {
          score += 200;
          matched = true;
        }

        // 3. Coincidencia de todos los tokens (Palabras clave)
        const hasAllTokens = tokens.every(t => val.includes(t));
        if (hasAllTokens) {
          score += 500;
          matched = true;
          
          // Bonus si el primer token coincide con el inicio del nombre
          if (val.startsWith(tokens[0])) {
            score += 150;
          }
        }

        // 4. Coincidencia parcial (Fuzzy básico)
        if (!matched) {
          const matchedSomeTokens = tokens.filter(t => val.includes(t));
          if (matchedSomeTokens.length > 0) {
            score += matchedSomeTokens.length * 20; // 20 pts por cada palabra encontrada
            matched = true;
          }
        }
      });

      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Desempate por nombre (orden alfabético)
      const nameA = (a.item.nombre || '').toLowerCase();
      const nameB = (b.item.nombre || '').toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .map(result => result.item);
};
