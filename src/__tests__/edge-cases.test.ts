import { describe, it, expect } from 'vitest';
import {
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from '../rwanda';

describe('Edge Cases', () => {
  describe('getDistrictsByProvince - invalid inputs', () => {
    it('should return empty array for non-existent province', () => {
      const districts = getDistrictsByProvince('NonExistentProvince');
      expect(districts).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      const districts = getDistrictsByProvince('');
      expect(districts).toEqual([]);
    });

    it('should be case-sensitive (lowercase should not match)', () => {
      const districts = getDistrictsByProvince('kigali');
      expect(districts).toEqual([]);
    });

    it('should be case-sensitive (uppercase should not match)', () => {
      const districts = getDistrictsByProvince('KIGALI');
      expect(districts).toEqual([]);
    });

    it('should return empty array for province with extra whitespace', () => {
      const districts = getDistrictsByProvince(' Kigali ');
      expect(districts).toEqual([]);
    });

    it('should return empty array for province with typo', () => {
      const districts = getDistrictsByProvince('Kigaly');
      expect(districts).toEqual([]);
    });
  });

  describe('getSectorsByDistrict - invalid inputs', () => {
    it('should return empty array for non-existent province', () => {
      const sectors = getSectorsByDistrict('NonExistent', 'Gasabo');
      expect(sectors).toEqual([]);
    });

    it('should return empty array for non-existent district', () => {
      const sectors = getSectorsByDistrict('Kigali', 'NonExistent');
      expect(sectors).toEqual([]);
    });

    it('should return empty array for both invalid inputs', () => {
      const sectors = getSectorsByDistrict('Invalid', 'Invalid');
      expect(sectors).toEqual([]);
    });

    it('should return empty array for empty strings', () => {
      const sectors = getSectorsByDistrict('', '');
      expect(sectors).toEqual([]);
    });

    it('should return empty array for valid province but empty district', () => {
      const sectors = getSectorsByDistrict('Kigali', '');
      expect(sectors).toEqual([]);
    });

    it('should return empty array for empty province but valid district', () => {
      const sectors = getSectorsByDistrict('', 'Gasabo');
      expect(sectors).toEqual([]);
    });

    it('should be case-sensitive for province', () => {
      const sectors = getSectorsByDistrict('kigali', 'Gasabo');
      expect(sectors).toEqual([]);
    });

    it('should be case-sensitive for district', () => {
      const sectors = getSectorsByDistrict('Kigali', 'gasabo');
      expect(sectors).toEqual([]);
    });
  });

  describe('getCellsBySector - invalid inputs', () => {
    it('should return empty array for non-existent province', () => {
      const cells = getCellsBySector('NonExistent', 'Gasabo', 'Remera');
      expect(cells).toEqual([]);
    });

    it('should return empty array for non-existent district', () => {
      const cells = getCellsBySector('Kigali', 'NonExistent', 'Remera');
      expect(cells).toEqual([]);
    });

    it('should return empty array for non-existent sector', () => {
      const cells = getCellsBySector('Kigali', 'Gasabo', 'NonExistent');
      expect(cells).toEqual([]);
    });

    it('should return empty array for all invalid inputs', () => {
      const cells = getCellsBySector('Invalid', 'Invalid', 'Invalid');
      expect(cells).toEqual([]);
    });

    it('should return empty array for empty strings', () => {
      const cells = getCellsBySector('', '', '');
      expect(cells).toEqual([]);
    });

    it('should be case-sensitive', () => {
      const cells = getCellsBySector('kigali', 'gasabo', 'remera');
      expect(cells).toEqual([]);
    });
  });

  describe('getVillagesByCell - invalid inputs', () => {
    it('should return empty array for non-existent province', () => {
      const villages = getVillagesByCell('NonExistent', 'Gasabo', 'Remera', 'SomeCell');
      expect(villages).toEqual([]);
    });

    it('should return empty array for non-existent district', () => {
      const villages = getVillagesByCell('Kigali', 'NonExistent', 'Remera', 'SomeCell');
      expect(villages).toEqual([]);
    });

    it('should return empty array for non-existent sector', () => {
      const villages = getVillagesByCell('Kigali', 'Gasabo', 'NonExistent', 'SomeCell');
      expect(villages).toEqual([]);
    });

    it('should return empty array for non-existent cell', () => {
      const villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', 'NonExistent');
      expect(villages).toEqual([]);
    });

    it('should return empty array for all invalid inputs', () => {
      const villages = getVillagesByCell('Invalid', 'Invalid', 'Invalid', 'Invalid');
      expect(villages).toEqual([]);
    });

    it('should return empty array for empty strings', () => {
      const villages = getVillagesByCell('', '', '', '');
      expect(villages).toEqual([]);
    });

    it('should be case-sensitive', () => {
      const villages = getVillagesByCell('kigali', 'gasabo', 'remera', 'somecell');
      expect(villages).toEqual([]);
    });
  });

  describe('Special characters and unusual inputs', () => {
    it('should handle special characters in province name', () => {
      const districts = getDistrictsByProvince('Kigali!@#$');
      expect(districts).toEqual([]);
    });

    it('should handle numbers in province name', () => {
      const districts = getDistrictsByProvince('Kigali123');
      expect(districts).toEqual([]);
    });

    it('should handle unicode characters', () => {
      const districts = getDistrictsByProvince('Kïgàlí');
      expect(districts).toEqual([]);
    });

    it('should handle newline characters', () => {
      const districts = getDistrictsByProvince('Kigali\n');
      expect(districts).toEqual([]);
    });

    it('should handle tab characters', () => {
      const districts = getDistrictsByProvince('Kigali\t');
      expect(districts).toEqual([]);
    });
  });
});
