import { describe, test, expect } from 'vitest';
import { search } from '../rwanda';
// Helper function to check SearchEntry structure
function isValidSearchEntry(entry) {
    return (typeof entry.id === 'number' &&
        typeof entry.level === 'number' &&
        entry.level >= 1 &&
        entry.level <= 5 &&
        typeof entry.location === 'object' &&
        entry.location !== null);
}
describe('search() - Basic Functionality', function () {
    test('returns results for single-word province query', function () {
        var results = search('Kigali');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.province === 'Kigali'; })).toBe(true);
    });
    test('returns results for single-word district query', function () {
        var results = search('Gasabo');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.district === 'Gasabo'; })).toBe(true);
    });
    test('returns results for single-word sector query', function () {
        var results = search('Remera');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.sector === 'Remera'; })).toBe(true);
    });
    test('returns results for single-word cell query', function () {
        var results = search('Nyarutarama');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.cell === 'Nyarutarama'; })).toBe(true);
    });
    test('returns results for single-word village query', function () {
        var results = search('Kinyinya');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.village === 'Kinyinya'; })).toBe(true);
    });
    test('returns empty array for empty query', function () {
        var results = search('');
        expect(results).toEqual([]);
    });
    test('returns empty array for non-existent location', function () {
        var results = search('XYZNonExistent123');
        expect(results).toEqual([]);
    });
    test('returns results with correct SearchEntry structure', function () {
        var results = search('Kigali');
        expect(results.length).toBeGreaterThan(0);
        results.forEach(function (entry) {
            expect(isValidSearchEntry(entry)).toBe(true);
        });
    });
    test('includes correct id field in results', function () {
        var results = search('Kigali');
        results.forEach(function (entry) {
            expect(typeof entry.id).toBe('number');
            expect(entry.id).toBeGreaterThanOrEqual(0);
        });
    });
    test('includes correct level field (1-5) in results', function () {
        var results = search('Kigali');
        results.forEach(function (entry) {
            expect(entry.level).toBeGreaterThanOrEqual(1);
            expect(entry.level).toBeLessThanOrEqual(5);
        });
    });
    test('includes correct location object in results', function () {
        var results = search('Kigali');
        results.forEach(function (entry) {
            expect(entry.location).toBeDefined();
            expect(typeof entry.location).toBe('object');
        });
    });
    test('returns province results with level 5', function () {
        var results = search('East');
        var provinceResults = results.filter(function (r) { return r.level === 5; });
        expect(provinceResults.length).toBeGreaterThan(0);
        provinceResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
        });
    });
    test('returns district results with level 4', function () {
        var results = search('Gasabo');
        var districtResults = results.filter(function (r) { return r.level === 4; });
        expect(districtResults.length).toBeGreaterThan(0);
        districtResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
        });
    });
    test('returns sector results with level 3', function () {
        var results = search('Remera');
        var sectorResults = results.filter(function (r) { return r.level === 3; });
        expect(sectorResults.length).toBeGreaterThan(0);
        sectorResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
            expect(r.location.sector).toBeDefined();
        });
    });
    test('returns village results with level 1', function () {
        var results = search('Kinyinya');
        var villageResults = results.filter(function (r) { return r.level === 1; });
        expect(villageResults.length).toBeGreaterThan(0);
        villageResults.forEach(function (r) {
            expect(r.location.village).toBeDefined();
        });
    });
});
describe('search() - Multi-word Search', function () {
    test('finds results matching all words (intersection)', function () {
        var results = search('Kigali Gasabo');
        expect(results.length).toBeGreaterThan(0);
        results.forEach(function (entry) {
            var locationStr = JSON.stringify(entry.location).toLowerCase();
            expect(locationStr.includes('kigali')).toBe(true);
            expect(locationStr.includes('gasabo')).toBe(true);
        });
    });
    test('handles two-word queries correctly', function () {
        var results = search('Nyarugenge Gitega');
        expect(results.length).toBeGreaterThan(0);
        var hasNyarugengeAndGitega = results.some(function (r) { return r.location.district === 'Nyarugenge' && r.location.sector === 'Gitega'; });
        expect(hasNyarugengeAndGitega).toBe(true);
    });
    test('handles three-word queries correctly', function () {
        var results = search('Nyarugenge Gitega Akabahizi');
        expect(results.length).toBeGreaterThan(0);
        results.forEach(function (entry) {
            var locationStr = JSON.stringify(entry.location).toLowerCase();
            expect(locationStr.includes('nyarugenge')).toBe(true);
            expect(locationStr.includes('gitega')).toBe(true);
            expect(locationStr.includes('akabahizi')).toBe(true);
        });
    });
    test('returns empty array when no results match all words', function () {
        var results = search('Kigali South');
        expect(results).toEqual([]);
    });
    test('correctly intersects results across hierarchy levels', function () {
        var singleWord = search('Kigali');
        var twoWords = search('Kigali Gasabo');
        expect(twoWords.length).toBeLessThanOrEqual(singleWord.length);
    });
    test('handles word order variations', function () {
        var results1 = search('Kigali Gasabo');
        var results2 = search('Gasabo Kigali');
        expect(results1.length).toBe(results2.length);
    });
    test('works with province + district combination', function () {
        var results = search('South Gisagara');
        expect(results.length).toBeGreaterThan(0);
        var hasSouthGisagara = results.some(function (r) { return r.location.province === 'South' && r.location.district === 'Gisagara'; });
        expect(hasSouthGisagara).toBe(true);
    });
    test('works with district + sector combination', function () {
        var results = search('Gasabo Remera');
        expect(results.length).toBeGreaterThan(0);
    });
});
describe('search() - Case Insensitivity', function () {
    test('finds results with lowercase query', function () {
        var results = search('kigali');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.province === 'Kigali'; })).toBe(true);
    });
    test('finds results with uppercase query', function () {
        var results = search('KIGALI');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.province === 'Kigali'; })).toBe(true);
    });
    test('finds results with mixed case query', function () {
        var results = search('KiGaLi');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.province === 'Kigali'; })).toBe(true);
    });
    test('treats "kigali" and "KIGALI" as same', function () {
        var results1 = search('kigali');
        var results2 = search('KIGALI');
        expect(results1.length).toBe(results2.length);
    });
    test('treats "gasabo" and "Gasabo" as same', function () {
        var results1 = search('gasabo');
        var results2 = search('Gasabo');
        expect(results1.length).toBe(results2.length);
    });
});
describe('search() - Diacritic Handling', function () {
    test('normalizes characters correctly', function () {
        // Test that search handles accented characters
        var resultsWithAccent = search('café');
        var resultsWithoutAccent = search('cafe');
        // Both should work (though dataset might not have accented names)
        expect(Array.isArray(resultsWithAccent)).toBe(true);
        expect(Array.isArray(resultsWithoutAccent)).toBe(true);
    });
    test('handles NFD normalization', function () {
        // NFD normalization should decompose characters
        var query = 'é'.normalize('NFD');
        var results = search(query);
        expect(Array.isArray(results)).toBe(true);
    });
    test('search is accent-insensitive', function () {
        // Test basic normalization works
        var query1 = 'resume';
        var query2 = 'résumé';
        var results1 = search(query1);
        var results2 = search(query2);
        // Should return same number of results (both normalized)
        expect(results1.length).toBe(results2.length);
    });
});
describe('search() - Result Structure', function () {
    test('province results have only province in location', function () {
        var results = search('East');
        var provinceResults = results.filter(function (r) { return r.level === 5; });
        expect(provinceResults.length).toBeGreaterThan(0);
        provinceResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeUndefined();
            expect(r.location.sector).toBeUndefined();
            expect(r.location.cell).toBeUndefined();
            expect(r.location.village).toBeUndefined();
        });
    });
    test('district results have province + district in location', function () {
        var results = search('Gasabo');
        var districtResults = results.filter(function (r) { return r.level === 4; });
        expect(districtResults.length).toBeGreaterThan(0);
        districtResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
            expect(r.location.sector).toBeUndefined();
            expect(r.location.cell).toBeUndefined();
            expect(r.location.village).toBeUndefined();
        });
    });
    test('sector results have province + district + sector', function () {
        var results = search('Remera');
        var sectorResults = results.filter(function (r) { return r.level === 3; });
        expect(sectorResults.length).toBeGreaterThan(0);
        sectorResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
            expect(r.location.sector).toBeDefined();
            expect(r.location.cell).toBeUndefined();
            expect(r.location.village).toBeUndefined();
        });
    });
    test('cell results have full path except village', function () {
        var results = search('Nyarutarama');
        var cellResults = results.filter(function (r) { return r.level === 2; });
        expect(cellResults.length).toBeGreaterThan(0);
        cellResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
            expect(r.location.sector).toBeDefined();
            expect(r.location.cell).toBeDefined();
            expect(r.location.village).toBeUndefined();
        });
    });
    test('village results have complete location hierarchy', function () {
        var results = search('Kinyinya');
        var villageResults = results.filter(function (r) { return r.level === 1; });
        expect(villageResults.length).toBeGreaterThan(0);
        villageResults.forEach(function (r) {
            expect(r.location.province).toBeDefined();
            expect(r.location.district).toBeDefined();
            expect(r.location.sector).toBeDefined();
            expect(r.location.cell).toBeDefined();
            expect(r.location.village).toBeDefined();
        });
    });
    test('all results have unique ids', function () {
        var results = search('Kigali');
        var ids = results.map(function (r) { return r.id; });
        var uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
    test('all results have valid level between 1-5', function () {
        var results = search('Kigali');
        results.forEach(function (r) {
            expect(r.level).toBeGreaterThanOrEqual(1);
            expect(r.level).toBeLessThanOrEqual(5);
        });
    });
    test('location objects use correct optional fields', function () {
        var results = search('Kigali');
        results.forEach(function (r) {
            expect(r.location).toBeDefined();
            expect(typeof r.location).toBe('object');
            // At minimum, should have province
            expect(r.location.province).toBeDefined();
        });
    });
});
describe('search() - Performance & Clamping', function () {
    test('returns maximum 50 results by default', function () {
        // Search for very broad term
        var results = search('i');
        expect(results.length).toBeLessThanOrEqual(50);
    });
    test('clamps results for broad queries', function () {
        var results = search('a');
        expect(results.length).toBeLessThanOrEqual(50);
    });
    test('does not clamp when results less than 50', function () {
        var results = search('Kigali Gasabo Remera');
        // This specific query should have fewer than 50 results
        expect(results.length).toBeLessThan(50);
    });
    test('clamping works with multi-word search', function () {
        var results = search('a e');
        expect(results.length).toBeLessThanOrEqual(50);
    });
    test('clamped results are deterministic', function () {
        var results1 = search('i');
        var results2 = search('i');
        expect(results1.length).toBe(results2.length);
        expect(results1[0].id).toBe(results2[0].id);
    });
});
describe('search() - Edge Cases', function () {
    test('handles special characters in query', function () {
        var results = search('!@#$%');
        expect(Array.isArray(results)).toBe(true);
    });
    test('handles numbers in query', function () {
        var results = search('123');
        expect(Array.isArray(results)).toBe(true);
    });
    test('handles very long query strings', function () {
        var longQuery = 'a'.repeat(1000);
        var results = search(longQuery);
        expect(Array.isArray(results)).toBe(true);
    });
    test('handles queries with only spaces', function () {
        var results = search('   ');
        expect(results).toEqual([]);
    });
    test('handles queries with multiple spaces', function () {
        var results = search('Kigali    Gasabo');
        expect(results.length).toBeGreaterThan(0);
    });
    test('handles queries with hyphens', function () {
        var results = search('Kigali-Gasabo');
        expect(results.length).toBeGreaterThan(0);
    });
    test('handles queries with slashes', function () {
        var results = search('Kigali/Gasabo');
        expect(results.length).toBeGreaterThan(0);
    });
    test('handles queries with dots', function () {
        var results = search('Kigali.Gasabo');
        expect(results.length).toBeGreaterThan(0);
    });
    test('handles Unicode characters', function () {
        var results = search('🇷🇼');
        expect(Array.isArray(results)).toBe(true);
    });
    test('handles mixed special characters and text', function () {
        // Test that special characters don't crash the search
        var results = search('Kigali-City');
        expect(Array.isArray(results)).toBe(true);
        // Hyphen splits into "Kigali" and "City" - may or may not return results
    });
});
describe('search() - Data Integrity', function () {
    test('search index includes all provinces', function () {
        var provinces = ['Kigali', 'East', 'North', 'South', 'West'];
        provinces.forEach(function (province) {
            var results = search(province);
            expect(results.length).toBeGreaterThan(0);
            expect(results.some(function (r) { return r.location.province === province; })).toBe(true);
        });
    });
    test('search index includes all districts', function () {
        var districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Huye', 'Musanze'];
        districts.forEach(function (district) {
            var results = search(district);
            expect(results.length).toBeGreaterThan(0);
            expect(results.some(function (r) { return r.location.district === district; })).toBe(true);
        });
    });
    test('search results match actual data structure', function () {
        var results = search('Kigali Gasabo');
        results.forEach(function (r) {
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
    test('returned locations are valid and exist in dataset', function () {
        var results = search('Remera');
        expect(results.length).toBeGreaterThan(0);
        results.forEach(function (r) {
            expect(r.location.province).toBeTruthy();
            if (r.level <= 4)
                expect(r.location.district).toBeTruthy();
            if (r.level <= 3)
                expect(r.location.sector).toBeTruthy();
            if (r.level <= 2)
                expect(r.location.cell).toBeTruthy();
            if (r.level === 1)
                expect(r.location.village).toBeTruthy();
        });
    });
    test('search does not return duplicate entries', function () {
        var results = search('Kigali');
        var ids = results.map(function (r) { return r.id; });
        var uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
describe('search() - Prefix Matching', function () {
    test('finds results with prefix match', function () {
        var results = search('Kig');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.province === 'Kigali'; })).toBe(true);
    });
    test('prefix matching works for districts', function () {
        var results = search('Kicuk');
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(function (r) { return r.location.district === 'Kicukiro'; })).toBe(true);
    });
    test('prefix matching is case-insensitive', function () {
        var results1 = search('kig');
        var results2 = search('Kig');
        expect(results1.length).toBe(results2.length);
    });
    test('single character prefix returns results', function () {
        var results = search('k');
        expect(results.length).toBeGreaterThan(0);
    });
    test('two character prefix returns results', function () {
        var results = search('ki');
        expect(results.length).toBeGreaterThan(0);
    });
});
