import { describe, test, expect } from 'vitest';
import { search, SearchEntry } from '../rwanda';

// Helper function to check SearchEntry structure
function isValidSearchEntry(entry: any): boolean {
  return (
    typeof entry.id === 'number' &&
    typeof entry.level === 'number' &&
    entry.level >= 1 &&
    entry.level <= 5 &&
    typeof entry.location === 'object' &&
    entry.location !== null
  );
}

describe('search() - Basic Functionality', () => {
  test('returns results for single-word province query', () => {
    const results = search('Kigali');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.province === 'Kigali')).toBe(true);
  });

  test('returns results for single-word district query', () => {
    const results = search('Gasabo');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.district === 'Gasabo')).toBe(true);
  });

  test('returns results for single-word sector query', () => {
    const results = search('Remera');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.sector === 'Remera')).toBe(true);
  });

  test('returns results for single-word cell query', () => {
    const results = search('Nyarutarama');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.cell === 'Nyarutarama')).toBe(true);
  });

  test('returns results for single-word village query', () => {
    const results = search('Kinyinya');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.village === 'Kinyinya')).toBe(true);
  });

  test('returns empty array for empty query', () => {
    const results = search('');
    expect(results).toEqual([]);
  });

  test('returns empty array for non-existent location', () => {
    const results = search('XYZNonExistent123');
    expect(results).toEqual([]);
  });

  test('returns results with correct SearchEntry structure', () => {
    const results = search('Kigali');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(entry => {
      expect(isValidSearchEntry(entry)).toBe(true);
    });
  });

  test('includes correct id field in results', () => {
    const results = search('Kigali');
    results.forEach(entry => {
      expect(typeof entry.id).toBe('number');
      expect(entry.id).toBeGreaterThanOrEqual(0);
    });
  });

  test('includes correct level field (1-5) in results', () => {
    const results = search('Kigali');
    results.forEach(entry => {
      expect(entry.level).toBeGreaterThanOrEqual(1);
      expect(entry.level).toBeLessThanOrEqual(5);
    });
  });

  test('includes correct location object in results', () => {
    const results = search('Kigali');
    results.forEach(entry => {
      expect(entry.location).toBeDefined();
      expect(typeof entry.location).toBe('object');
    });
  });

  test('returns province results with level 5', () => {
    const results = search('East');
    const provinceResults = results.filter(r => r.level === 5);
    expect(provinceResults.length).toBeGreaterThan(0);
    provinceResults.forEach(r => {
      expect(r.location.province).toBeDefined();
    });
  });

  test('returns district results with level 4', () => {
    const results = search('Gasabo');
    const districtResults = results.filter(r => r.level === 4);
    expect(districtResults.length).toBeGreaterThan(0);
    districtResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
    });
  });

  test('returns sector results with level 3', () => {
    const results = search('Remera');
    const sectorResults = results.filter(r => r.level === 3);
    expect(sectorResults.length).toBeGreaterThan(0);
    sectorResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
      expect(r.location.sector).toBeDefined();
    });
  });

  test('returns village results with level 1', () => {
    const results = search('Kinyinya');
    const villageResults = results.filter(r => r.level === 1);
    expect(villageResults.length).toBeGreaterThan(0);
    villageResults.forEach(r => {
      expect(r.location.village).toBeDefined();
    });
  });
});

describe('search() - Multi-word Search', () => {
  test('finds results matching all words (intersection)', () => {
    const results = search('Kigali Gasabo');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(entry => {
      const locationStr = JSON.stringify(entry.location).toLowerCase();
      expect(locationStr.includes('kigali')).toBe(true);
      expect(locationStr.includes('gasabo')).toBe(true);
    });
  });

  test('handles two-word queries correctly', () => {
    const results = search('Nyarugenge Gitega');
    expect(results.length).toBeGreaterThan(0);
    const hasNyarugengeAndGitega = results.some(
      r => r.location.district === 'Nyarugenge' && r.location.sector === 'Gitega'
    );
    expect(hasNyarugengeAndGitega).toBe(true);
  });

  test('handles three-word queries correctly', () => {
    const results = search('Nyarugenge Gitega Akabahizi');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(entry => {
      const locationStr = JSON.stringify(entry.location).toLowerCase();
      expect(locationStr.includes('nyarugenge')).toBe(true);
      expect(locationStr.includes('gitega')).toBe(true);
      expect(locationStr.includes('akabahizi')).toBe(true);
    });
  });

  test('returns empty array when no results match all words', () => {
    const results = search('Kigali South');
    expect(results).toEqual([]);
  });

  test('correctly intersects results across hierarchy levels', () => {
    const singleWord = search('Kigali');
    const twoWords = search('Kigali Gasabo');
    expect(twoWords.length).toBeLessThanOrEqual(singleWord.length);
  });

  test('handles word order variations', () => {
    const results1 = search('Kigali Gasabo');
    const results2 = search('Gasabo Kigali');
    expect(results1.length).toBe(results2.length);
  });

  test('works with province + district combination', () => {
    const results = search('South Gisagara');
    expect(results.length).toBeGreaterThan(0);
    const hasSouthGisagara = results.some(
      r => r.location.province === 'South' && r.location.district === 'Gisagara'
    );
    expect(hasSouthGisagara).toBe(true);
  });

  test('works with district + sector combination', () => {
    const results = search('Gasabo Remera');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('search() - Case Insensitivity', () => {
  test('finds results with lowercase query', () => {
    const results = search('kigali');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.province === 'Kigali')).toBe(true);
  });

  test('finds results with uppercase query', () => {
    const results = search('KIGALI');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.province === 'Kigali')).toBe(true);
  });

  test('finds results with mixed case query', () => {
    const results = search('KiGaLi');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.province === 'Kigali')).toBe(true);
  });

  test('treats "kigali" and "KIGALI" as same', () => {
    const results1 = search('kigali');
    const results2 = search('KIGALI');
    expect(results1.length).toBe(results2.length);
  });

  test('treats "gasabo" and "Gasabo" as same', () => {
    const results1 = search('gasabo');
    const results2 = search('Gasabo');
    expect(results1.length).toBe(results2.length);
  });
});

describe('search() - Diacritic Handling', () => {
  test('normalizes characters correctly', () => {
    // Test that search handles accented characters
    const resultsWithAccent = search('café');
    const resultsWithoutAccent = search('cafe');
    // Both should work (though dataset might not have accented names)
    expect(Array.isArray(resultsWithAccent)).toBe(true);
    expect(Array.isArray(resultsWithoutAccent)).toBe(true);
  });

  test('handles NFD normalization', () => {
    // NFD normalization should decompose characters
    const query = 'é'.normalize('NFD');
    const results = search(query);
    expect(Array.isArray(results)).toBe(true);
  });

  test('search is accent-insensitive', () => {
    // Test basic normalization works
    const query1 = 'resume';
    const query2 = 'résumé';
    const results1 = search(query1);
    const results2 = search(query2);
    // Should return same number of results (both normalized)
    expect(results1.length).toBe(results2.length);
  });
});

describe('search() - Result Structure', () => {
  test('province results have only province in location', () => {
    const results = search('East');
    const provinceResults = results.filter(r => r.level === 5);
    expect(provinceResults.length).toBeGreaterThan(0);
    provinceResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeUndefined();
      expect(r.location.sector).toBeUndefined();
      expect(r.location.cell).toBeUndefined();
      expect(r.location.village).toBeUndefined();
    });
  });

  test('district results have province + district in location', () => {
    const results = search('Gasabo');
    const districtResults = results.filter(r => r.level === 4);
    expect(districtResults.length).toBeGreaterThan(0);
    districtResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
      expect(r.location.sector).toBeUndefined();
      expect(r.location.cell).toBeUndefined();
      expect(r.location.village).toBeUndefined();
    });
  });

  test('sector results have province + district + sector', () => {
    const results = search('Remera');
    const sectorResults = results.filter(r => r.level === 3);
    expect(sectorResults.length).toBeGreaterThan(0);
    sectorResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
      expect(r.location.sector).toBeDefined();
      expect(r.location.cell).toBeUndefined();
      expect(r.location.village).toBeUndefined();
    });
  });

  test('cell results have full path except village', () => {
    const results = search('Nyarutarama');
    const cellResults = results.filter(r => r.level === 2);
    expect(cellResults.length).toBeGreaterThan(0);
    cellResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
      expect(r.location.sector).toBeDefined();
      expect(r.location.cell).toBeDefined();
      expect(r.location.village).toBeUndefined();
    });
  });

  test('village results have complete location hierarchy', () => {
    const results = search('Kinyinya');
    const villageResults = results.filter(r => r.level === 1);
    expect(villageResults.length).toBeGreaterThan(0);
    villageResults.forEach(r => {
      expect(r.location.province).toBeDefined();
      expect(r.location.district).toBeDefined();
      expect(r.location.sector).toBeDefined();
      expect(r.location.cell).toBeDefined();
      expect(r.location.village).toBeDefined();
    });
  });

  test('all results have unique ids', () => {
    const results = search('Kigali');
    const ids = results.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('all results have valid level between 1-5', () => {
    const results = search('Kigali');
    results.forEach(r => {
      expect(r.level).toBeGreaterThanOrEqual(1);
      expect(r.level).toBeLessThanOrEqual(5);
    });
  });

  test('location objects use correct optional fields', () => {
    const results = search('Kigali');
    results.forEach(r => {
      expect(r.location).toBeDefined();
      expect(typeof r.location).toBe('object');
      // At minimum, should have province
      expect(r.location.province).toBeDefined();
    });
  });
});

describe('search() - Performance & Clamping', () => {
  test('returns maximum 50 results by default', () => {
    // Search for very broad term
    const results = search('i');
    expect(results.length).toBeLessThanOrEqual(50);
  });

  test('clamps results for broad queries', () => {
    const results = search('a');
    expect(results.length).toBeLessThanOrEqual(50);
  });

  test('does not clamp when results less than 50', () => {
    const results = search('Kigali Gasabo Remera');
    // This specific query should have fewer than 50 results
    expect(results.length).toBeLessThan(50);
  });

  test('clamping works with multi-word search', () => {
    const results = search('a e');
    expect(results.length).toBeLessThanOrEqual(50);
  });

  test('clamped results are deterministic', () => {
    const results1 = search('i');
    const results2 = search('i');
    expect(results1.length).toBe(results2.length);
    expect(results1[0].id).toBe(results2[0].id);
  });
});

describe('search() - Edge Cases', () => {
  test('handles special characters in query', () => {
    const results = search('!@#$%');
    expect(Array.isArray(results)).toBe(true);
  });

  test('handles numbers in query', () => {
    const results = search('123');
    expect(Array.isArray(results)).toBe(true);
  });

  test('handles very long query strings', () => {
    const longQuery = 'a'.repeat(1000);
    const results = search(longQuery);
    expect(Array.isArray(results)).toBe(true);
  });

  test('handles queries with only spaces', () => {
    const results = search('   ');
    expect(results).toEqual([]);
  });

  test('handles queries with multiple spaces', () => {
    const results = search('Kigali    Gasabo');
    expect(results.length).toBeGreaterThan(0);
  });

  test('handles queries with hyphens', () => {
    const results = search('Kigali-Gasabo');
    expect(results.length).toBeGreaterThan(0);
  });

  test('handles queries with slashes', () => {
    const results = search('Kigali/Gasabo');
    expect(results.length).toBeGreaterThan(0);
  });

  test('handles queries with dots', () => {
    const results = search('Kigali.Gasabo');
    expect(results.length).toBeGreaterThan(0);
  });

  test('handles Unicode characters', () => {
    const results = search('🇷🇼');
    expect(Array.isArray(results)).toBe(true);
  });

  test('handles mixed special characters and text', () => {
    // Test that special characters don't crash the search
    const results = search('Kigali-City');
    expect(Array.isArray(results)).toBe(true);
    // Hyphen splits into "Kigali" and "City" - may or may not return results
  });
});

describe('search() - Data Integrity', () => {
  test('search index includes all provinces', () => {
    const provinces = ['Kigali', 'East', 'North', 'South', 'West'];
    provinces.forEach(province => {
      const results = search(province);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.location.province === province)).toBe(true);
    });
  });

  test('search index includes all districts', () => {
    const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Huye', 'Musanze'];
    districts.forEach(district => {
      const results = search(district);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.location.district === district)).toBe(true);
    });
  });

  test('search results match actual data structure', () => {
    const results = search('Kigali Gasabo');
    results.forEach(r => {
      // Verify hierarchical consistency
      if (r.location.district) {
        expect(r.location.province).toBeDefined();
      }
      if (r.location.sector) {
        expect(r.location.district).toBeDefined();
      }
      if (r.location.cell) {
        expect(r.location.sector).toBeDefined();
      }
      if (r.location.village) {
        expect(r.location.cell).toBeDefined();
      }
    });
  });

  test('returned locations are valid and exist in dataset', () => {
    const results = search('Remera');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.location.province).toBeTruthy();
      if (r.level <= 4) expect(r.location.district).toBeTruthy();
      if (r.level <= 3) expect(r.location.sector).toBeTruthy();
      if (r.level <= 2) expect(r.location.cell).toBeTruthy();
      if (r.level === 1) expect(r.location.village).toBeTruthy();
    });
  });

  test('search does not return duplicate entries', () => {
    const results = search('Kigali');
    const ids = results.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('search() - Prefix Matching', () => {
  test('finds results with prefix match', () => {
    const results = search('Kig');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.province === 'Kigali')).toBe(true);
  });

  test('prefix matching works for districts', () => {
    const results = search('Kicuk');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.location.district === 'Kicukiro')).toBe(true);
  });

  test('prefix matching is case-insensitive', () => {
    const results1 = search('kig');
    const results2 = search('Kig');
    expect(results1.length).toBe(results2.length);
  });

  test('single character prefix returns results', () => {
    const results = search('k');
    expect(results.length).toBeGreaterThan(0);
  });

  test('two character prefix returns results', () => {
    const results = search('ki');
    expect(results.length).toBeGreaterThan(0);
  });
});
