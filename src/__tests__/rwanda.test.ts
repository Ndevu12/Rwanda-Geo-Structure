import { describe, it, expect } from 'vitest';
import {
  getCountry,
  getProvinces,
  getDistricts,
  getDistrictsByProvince,
  getSectors,
  getSectorsByDistrict,
  getCells,
  getCellsBySector,
  getVillages,
  getVillagesByCell,
  getRandomLocation,
  countLocations,
} from '../rwanda';

describe('Rwanda Geo Structure', () => {
  describe('getCountry', () => {
    it('should return "Rwanda"', () => {
      expect(getCountry()).toBe('Rwanda');
    });

    it('should return a string', () => {
      expect(typeof getCountry()).toBe('string');
    });
  });

  describe('getProvinces', () => {
    it('should return an array of provinces', () => {
      const provinces = getProvinces();
      expect(Array.isArray(provinces)).toBe(true);
    });

    it('should return exactly 5 provinces', () => {
      const provinces = getProvinces();
      expect(provinces).toHaveLength(5);
    });

    it('should contain known province names', () => {
      const provinces = getProvinces();
      expect(provinces).toContain('East');
      expect(provinces).toContain('West');
      expect(provinces).toContain('North');
      expect(provinces).toContain('South');
      expect(provinces).toContain('Kigali');
    });

    it('should return all strings', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        expect(typeof province).toBe('string');
      });
    });
  });

  describe('getDistricts', () => {
    it('should return an array of districts', () => {
      const districts = getDistricts();
      expect(Array.isArray(districts)).toBe(true);
    });

    it('should return exactly 30 districts', () => {
      const districts = getDistricts();
      expect(districts).toHaveLength(30);
    });

    it('should return all strings', () => {
      const districts = getDistricts();
      districts.forEach((district) => {
        expect(typeof district).toBe('string');
      });
    });

    it('should contain known district names', () => {
      const districts = getDistricts();
      expect(districts).toContain('Gasabo');
      expect(districts).toContain('Kicukiro');
      expect(districts).toContain('Nyarugenge');
    });
  });

  describe('getDistrictsByProvince', () => {
    it('should return districts for Kigali province', () => {
      const districts = getDistrictsByProvince('Kigali');
      expect(Array.isArray(districts)).toBe(true);
      expect(districts.length).toBeGreaterThan(0);
    });

    it('should return 3 districts for Kigali', () => {
      const districts = getDistrictsByProvince('Kigali');
      expect(districts).toHaveLength(3);
      expect(districts).toContain('Gasabo');
      expect(districts).toContain('Kicukiro');
      expect(districts).toContain('Nyarugenge');
    });

    it('should return districts for East province', () => {
      const districts = getDistrictsByProvince('East');
      expect(districts.length).toBeGreaterThan(0);
    });

    it('should return districts for West province', () => {
      const districts = getDistrictsByProvince('West');
      expect(districts.length).toBeGreaterThan(0);
    });

    it('should return districts for North province', () => {
      const districts = getDistrictsByProvince('North');
      expect(districts.length).toBeGreaterThan(0);
    });

    it('should return districts for South province', () => {
      const districts = getDistrictsByProvince('South');
      expect(districts.length).toBeGreaterThan(0);
    });
  });

  describe('getSectors', () => {
    it('should return an array of sectors', () => {
      const sectors = getSectors();
      expect(Array.isArray(sectors)).toBe(true);
    });

    it('should return 416 sectors', () => {
      const sectors = getSectors();
      expect(sectors).toHaveLength(416);
    });

    it('should return all strings', () => {
      const sectors = getSectors();
      sectors.forEach((sector) => {
        expect(typeof sector).toBe('string');
      });
    });
  });

  describe('getSectorsByDistrict', () => {
    it('should return sectors for Gasabo district', () => {
      const sectors = getSectorsByDistrict('Kigali', 'Gasabo');
      expect(Array.isArray(sectors)).toBe(true);
      expect(sectors.length).toBeGreaterThan(0);
    });

    it('should return 15 sectors for Gasabo', () => {
      const sectors = getSectorsByDistrict('Kigali', 'Gasabo');
      expect(sectors).toHaveLength(15);
    });

    it('should contain known sector names in Gasabo', () => {
      const sectors = getSectorsByDistrict('Kigali', 'Gasabo');
      expect(sectors).toContain('Remera');
      expect(sectors).toContain('Kimironko');
      expect(sectors).toContain('Kacyiru');
    });
  });

  describe('getCells', () => {
    it('should return an array of cells', () => {
      const cells = getCells();
      expect(Array.isArray(cells)).toBe(true);
    });

    it('should return 2149 cells', () => {
      const cells = getCells();
      expect(cells).toHaveLength(2149);
    });

    it('should return all strings', () => {
      const cells = getCells();
      cells.forEach((cell) => {
        expect(typeof cell).toBe('string');
      });
    });
  });

  describe('getCellsBySector', () => {
    it('should return cells for Remera sector', () => {
      const cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
      expect(Array.isArray(cells)).toBe(true);
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should return all strings', () => {
      const cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
      cells.forEach((cell) => {
        expect(typeof cell).toBe('string');
      });
    });
  });

  describe('getVillages', () => {
    it('should return an array of villages', () => {
      const villages = getVillages();
      expect(Array.isArray(villages)).toBe(true);
    });

    it('should return 14837 villages', () => {
      const villages = getVillages();
      expect(villages).toHaveLength(14837);
    });

    it('should return all strings', () => {
      const villages = getVillages();
      villages.forEach((village) => {
        expect(typeof village).toBe('string');
      });
    });
  });

  describe('getVillagesByCell', () => {
    it('should return villages for a valid cell', () => {
      const cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
      if (cells.length > 0) {
        const villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', cells[0]);
        expect(Array.isArray(villages)).toBe(true);
        expect(villages.length).toBeGreaterThan(0);
      }
    });

    it('should return all strings', () => {
      const cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
      if (cells.length > 0) {
        const villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', cells[0]);
        villages.forEach((village) => {
          expect(typeof village).toBe('string');
        });
      }
    });
  });

  describe('getRandomLocation', () => {
    it('should return an object with all location properties', () => {
      const location = getRandomLocation();
      expect(location).toHaveProperty('province');
      expect(location).toHaveProperty('district');
      expect(location).toHaveProperty('sector');
      expect(location).toHaveProperty('cell');
      expect(location).toHaveProperty('village');
    });

    it('should return valid province', () => {
      const location = getRandomLocation();
      const provinces = getProvinces();
      expect(provinces).toContain(location.province);
    });

    it('should return valid district within the province', () => {
      const location = getRandomLocation();
      const districts = getDistrictsByProvince(location.province);
      expect(districts).toContain(location.district);
    });

    it('should return valid sector within the district', () => {
      const location = getRandomLocation();
      const sectors = getSectorsByDistrict(location.province, location.district);
      expect(sectors).toContain(location.sector);
    });

    it('should return valid cell within the sector', () => {
      const location = getRandomLocation();
      const cells = getCellsBySector(location.province, location.district, location.sector);
      expect(cells).toContain(location.cell);
    });

    it('should return valid village within the cell', () => {
      const location = getRandomLocation();
      const villages = getVillagesByCell(
        location.province,
        location.district,
        location.sector,
        location.cell
      );
      expect(villages).toContain(location.village);
    });

    it('should return different locations on multiple calls (randomness test)', () => {
      const locations = new Set<string>();
      for (let i = 0; i < 10; i++) {
        const location = getRandomLocation();
        locations.add(JSON.stringify(location));
      }
      // With 14837 villages, getting same location 10 times is extremely unlikely
      expect(locations.size).toBeGreaterThan(1);
    });
  });

  describe('countLocations', () => {
    it('should return an object with all count properties', () => {
      const counts = countLocations();
      expect(counts).toHaveProperty('provinces');
      expect(counts).toHaveProperty('districts');
      expect(counts).toHaveProperty('sectors');
      expect(counts).toHaveProperty('cells');
      expect(counts).toHaveProperty('villages');
    });

    it('should return correct province count', () => {
      const counts = countLocations();
      expect(counts.provinces).toBe(5);
    });

    it('should return correct district count', () => {
      const counts = countLocations();
      expect(counts.districts).toBe(30);
    });

    it('should return correct sector count', () => {
      const counts = countLocations();
      expect(counts.sectors).toBe(416);
    });

    it('should return correct cell count', () => {
      const counts = countLocations();
      expect(counts.cells).toBe(2149);
    });

    it('should return correct village count', () => {
      const counts = countLocations();
      expect(counts.villages).toBe(14837);
    });

    it('should return numbers for all counts', () => {
      const counts = countLocations();
      expect(typeof counts.provinces).toBe('number');
      expect(typeof counts.districts).toBe('number');
      expect(typeof counts.sectors).toBe('number');
      expect(typeof counts.cells).toBe('number');
      expect(typeof counts.villages).toBe('number');
    });
  });
});
