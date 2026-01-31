import { describe, it, expect } from 'vitest';
import { getDistrictsByProvince, getSectorsByDistrict, getCellsBySector, getVillagesByCell, } from '../rwanda';
describe('Edge Cases', function () {
    describe('getDistrictsByProvince - invalid inputs', function () {
        it('should return empty array for non-existent province', function () {
            var districts = getDistrictsByProvince('NonExistentProvince');
            expect(districts).toEqual([]);
        });
        it('should return empty array for empty string', function () {
            var districts = getDistrictsByProvince('');
            expect(districts).toEqual([]);
        });
        it('should be case-sensitive (lowercase should not match)', function () {
            var districts = getDistrictsByProvince('kigali');
            expect(districts).toEqual([]);
        });
        it('should be case-sensitive (uppercase should not match)', function () {
            var districts = getDistrictsByProvince('KIGALI');
            expect(districts).toEqual([]);
        });
        it('should return empty array for province with extra whitespace', function () {
            var districts = getDistrictsByProvince(' Kigali ');
            expect(districts).toEqual([]);
        });
        it('should return empty array for province with typo', function () {
            var districts = getDistrictsByProvince('Kigaly');
            expect(districts).toEqual([]);
        });
    });
    describe('getSectorsByDistrict - invalid inputs', function () {
        it('should return empty array for non-existent province', function () {
            var sectors = getSectorsByDistrict('NonExistent', 'Gasabo');
            expect(sectors).toEqual([]);
        });
        it('should return empty array for non-existent district', function () {
            var sectors = getSectorsByDistrict('Kigali', 'NonExistent');
            expect(sectors).toEqual([]);
        });
        it('should return empty array for both invalid inputs', function () {
            var sectors = getSectorsByDistrict('Invalid', 'Invalid');
            expect(sectors).toEqual([]);
        });
        it('should return empty array for empty strings', function () {
            var sectors = getSectorsByDistrict('', '');
            expect(sectors).toEqual([]);
        });
        it('should return empty array for valid province but empty district', function () {
            var sectors = getSectorsByDistrict('Kigali', '');
            expect(sectors).toEqual([]);
        });
        it('should return empty array for empty province but valid district', function () {
            var sectors = getSectorsByDistrict('', 'Gasabo');
            expect(sectors).toEqual([]);
        });
        it('should be case-sensitive for province', function () {
            var sectors = getSectorsByDistrict('kigali', 'Gasabo');
            expect(sectors).toEqual([]);
        });
        it('should be case-sensitive for district', function () {
            var sectors = getSectorsByDistrict('Kigali', 'gasabo');
            expect(sectors).toEqual([]);
        });
    });
    describe('getCellsBySector - invalid inputs', function () {
        it('should return empty array for non-existent province', function () {
            var cells = getCellsBySector('NonExistent', 'Gasabo', 'Remera');
            expect(cells).toEqual([]);
        });
        it('should return empty array for non-existent district', function () {
            var cells = getCellsBySector('Kigali', 'NonExistent', 'Remera');
            expect(cells).toEqual([]);
        });
        it('should return empty array for non-existent sector', function () {
            var cells = getCellsBySector('Kigali', 'Gasabo', 'NonExistent');
            expect(cells).toEqual([]);
        });
        it('should return empty array for all invalid inputs', function () {
            var cells = getCellsBySector('Invalid', 'Invalid', 'Invalid');
            expect(cells).toEqual([]);
        });
        it('should return empty array for empty strings', function () {
            var cells = getCellsBySector('', '', '');
            expect(cells).toEqual([]);
        });
        it('should be case-sensitive', function () {
            var cells = getCellsBySector('kigali', 'gasabo', 'remera');
            expect(cells).toEqual([]);
        });
    });
    describe('getVillagesByCell - invalid inputs', function () {
        it('should return empty array for non-existent province', function () {
            var villages = getVillagesByCell('NonExistent', 'Gasabo', 'Remera', 'SomeCell');
            expect(villages).toEqual([]);
        });
        it('should return empty array for non-existent district', function () {
            var villages = getVillagesByCell('Kigali', 'NonExistent', 'Remera', 'SomeCell');
            expect(villages).toEqual([]);
        });
        it('should return empty array for non-existent sector', function () {
            var villages = getVillagesByCell('Kigali', 'Gasabo', 'NonExistent', 'SomeCell');
            expect(villages).toEqual([]);
        });
        it('should return empty array for non-existent cell', function () {
            var villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', 'NonExistent');
            expect(villages).toEqual([]);
        });
        it('should return empty array for all invalid inputs', function () {
            var villages = getVillagesByCell('Invalid', 'Invalid', 'Invalid', 'Invalid');
            expect(villages).toEqual([]);
        });
        it('should return empty array for empty strings', function () {
            var villages = getVillagesByCell('', '', '', '');
            expect(villages).toEqual([]);
        });
        it('should be case-sensitive', function () {
            var villages = getVillagesByCell('kigali', 'gasabo', 'remera', 'somecell');
            expect(villages).toEqual([]);
        });
    });
    describe('Special characters and unusual inputs', function () {
        it('should handle special characters in province name', function () {
            var districts = getDistrictsByProvince('Kigali!@#$');
            expect(districts).toEqual([]);
        });
        it('should handle numbers in province name', function () {
            var districts = getDistrictsByProvince('Kigali123');
            expect(districts).toEqual([]);
        });
        it('should handle unicode characters', function () {
            var districts = getDistrictsByProvince('Kïgàlí');
            expect(districts).toEqual([]);
        });
        it('should handle newline characters', function () {
            var districts = getDistrictsByProvince('Kigali\n');
            expect(districts).toEqual([]);
        });
        it('should handle tab characters', function () {
            var districts = getDistrictsByProvince('Kigali\t');
            expect(districts).toEqual([]);
        });
    });
});
