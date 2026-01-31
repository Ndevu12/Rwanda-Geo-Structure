import { describe, it, expect } from 'vitest';
import { getCountry, getProvinces, getDistricts, getDistrictsByProvince, getSectors, getSectorsByDistrict, getCells, getCellsBySector, getVillages, getVillagesByCell, getRandomLocation, countLocations, } from '../rwanda';
describe('Rwanda Geo Structure', function () {
    describe('getCountry', function () {
        it('should return "Rwanda"', function () {
            expect(getCountry()).toBe('Rwanda');
        });
        it('should return a string', function () {
            expect(typeof getCountry()).toBe('string');
        });
    });
    describe('getProvinces', function () {
        it('should return an array of provinces', function () {
            var provinces = getProvinces();
            expect(Array.isArray(provinces)).toBe(true);
        });
        it('should return exactly 5 provinces', function () {
            var provinces = getProvinces();
            expect(provinces).toHaveLength(5);
        });
        it('should contain known province names', function () {
            var provinces = getProvinces();
            expect(provinces).toContain('East');
            expect(provinces).toContain('West');
            expect(provinces).toContain('North');
            expect(provinces).toContain('South');
            expect(provinces).toContain('Kigali');
        });
        it('should return all strings', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                expect(typeof province).toBe('string');
            });
        });
    });
    describe('getDistricts', function () {
        it('should return an array of districts', function () {
            var districts = getDistricts();
            expect(Array.isArray(districts)).toBe(true);
        });
        it('should return exactly 30 districts', function () {
            var districts = getDistricts();
            expect(districts).toHaveLength(30);
        });
        it('should return all strings', function () {
            var districts = getDistricts();
            districts.forEach(function (district) {
                expect(typeof district).toBe('string');
            });
        });
        it('should contain known district names', function () {
            var districts = getDistricts();
            expect(districts).toContain('Gasabo');
            expect(districts).toContain('Kicukiro');
            expect(districts).toContain('Nyarugenge');
        });
    });
    describe('getDistrictsByProvince', function () {
        it('should return districts for Kigali province', function () {
            var districts = getDistrictsByProvince('Kigali');
            expect(Array.isArray(districts)).toBe(true);
            expect(districts.length).toBeGreaterThan(0);
        });
        it('should return 3 districts for Kigali', function () {
            var districts = getDistrictsByProvince('Kigali');
            expect(districts).toHaveLength(3);
            expect(districts).toContain('Gasabo');
            expect(districts).toContain('Kicukiro');
            expect(districts).toContain('Nyarugenge');
        });
        it('should return districts for East province', function () {
            var districts = getDistrictsByProvince('East');
            expect(districts.length).toBeGreaterThan(0);
        });
        it('should return districts for West province', function () {
            var districts = getDistrictsByProvince('West');
            expect(districts.length).toBeGreaterThan(0);
        });
        it('should return districts for North province', function () {
            var districts = getDistrictsByProvince('North');
            expect(districts.length).toBeGreaterThan(0);
        });
        it('should return districts for South province', function () {
            var districts = getDistrictsByProvince('South');
            expect(districts.length).toBeGreaterThan(0);
        });
    });
    describe('getSectors', function () {
        it('should return an array of sectors', function () {
            var sectors = getSectors();
            expect(Array.isArray(sectors)).toBe(true);
        });
        it('should return 416 sectors', function () {
            var sectors = getSectors();
            expect(sectors).toHaveLength(416);
        });
        it('should return all strings', function () {
            var sectors = getSectors();
            sectors.forEach(function (sector) {
                expect(typeof sector).toBe('string');
            });
        });
    });
    describe('getSectorsByDistrict', function () {
        it('should return sectors for Gasabo district', function () {
            var sectors = getSectorsByDistrict('Kigali', 'Gasabo');
            expect(Array.isArray(sectors)).toBe(true);
            expect(sectors.length).toBeGreaterThan(0);
        });
        it('should return 15 sectors for Gasabo', function () {
            var sectors = getSectorsByDistrict('Kigali', 'Gasabo');
            expect(sectors).toHaveLength(15);
        });
        it('should contain known sector names in Gasabo', function () {
            var sectors = getSectorsByDistrict('Kigali', 'Gasabo');
            expect(sectors).toContain('Remera');
            expect(sectors).toContain('Kimironko');
            expect(sectors).toContain('Kacyiru');
        });
    });
    describe('getCells', function () {
        it('should return an array of cells', function () {
            var cells = getCells();
            expect(Array.isArray(cells)).toBe(true);
        });
        it('should return 2149 cells', function () {
            var cells = getCells();
            expect(cells).toHaveLength(2149);
        });
        it('should return all strings', function () {
            var cells = getCells();
            cells.forEach(function (cell) {
                expect(typeof cell).toBe('string');
            });
        });
    });
    describe('getCellsBySector', function () {
        it('should return cells for Remera sector', function () {
            var cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
            expect(Array.isArray(cells)).toBe(true);
            expect(cells.length).toBeGreaterThan(0);
        });
        it('should return all strings', function () {
            var cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
            cells.forEach(function (cell) {
                expect(typeof cell).toBe('string');
            });
        });
    });
    describe('getVillages', function () {
        it('should return an array of villages', function () {
            var villages = getVillages();
            expect(Array.isArray(villages)).toBe(true);
        });
        it('should return 14837 villages', function () {
            var villages = getVillages();
            expect(villages).toHaveLength(14837);
        });
        it('should return all strings', function () {
            var villages = getVillages();
            villages.forEach(function (village) {
                expect(typeof village).toBe('string');
            });
        });
    });
    describe('getVillagesByCell', function () {
        it('should return villages for a valid cell', function () {
            var cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
            if (cells.length > 0) {
                var villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', cells[0]);
                expect(Array.isArray(villages)).toBe(true);
                expect(villages.length).toBeGreaterThan(0);
            }
        });
        it('should return all strings', function () {
            var cells = getCellsBySector('Kigali', 'Gasabo', 'Remera');
            if (cells.length > 0) {
                var villages = getVillagesByCell('Kigali', 'Gasabo', 'Remera', cells[0]);
                villages.forEach(function (village) {
                    expect(typeof village).toBe('string');
                });
            }
        });
    });
    describe('getRandomLocation', function () {
        it('should return an object with all location properties', function () {
            var location = getRandomLocation();
            expect(location).toHaveProperty('province');
            expect(location).toHaveProperty('district');
            expect(location).toHaveProperty('sector');
            expect(location).toHaveProperty('cell');
            expect(location).toHaveProperty('village');
        });
        it('should return valid province', function () {
            var location = getRandomLocation();
            var provinces = getProvinces();
            expect(provinces).toContain(location.province);
        });
        it('should return valid district within the province', function () {
            var location = getRandomLocation();
            var districts = getDistrictsByProvince(location.province);
            expect(districts).toContain(location.district);
        });
        it('should return valid sector within the district', function () {
            var location = getRandomLocation();
            var sectors = getSectorsByDistrict(location.province, location.district);
            expect(sectors).toContain(location.sector);
        });
        it('should return valid cell within the sector', function () {
            var location = getRandomLocation();
            var cells = getCellsBySector(location.province, location.district, location.sector);
            expect(cells).toContain(location.cell);
        });
        it('should return valid village within the cell', function () {
            var location = getRandomLocation();
            var villages = getVillagesByCell(location.province, location.district, location.sector, location.cell);
            expect(villages).toContain(location.village);
        });
        it('should return different locations on multiple calls (randomness test)', function () {
            var locations = new Set();
            for (var i = 0; i < 10; i++) {
                var location_1 = getRandomLocation();
                locations.add(JSON.stringify(location_1));
            }
            // With 14837 villages, getting same location 10 times is extremely unlikely
            expect(locations.size).toBeGreaterThan(1);
        });
    });
    describe('countLocations', function () {
        it('should return an object with all count properties', function () {
            var counts = countLocations();
            expect(counts).toHaveProperty('provinces');
            expect(counts).toHaveProperty('districts');
            expect(counts).toHaveProperty('sectors');
            expect(counts).toHaveProperty('cells');
            expect(counts).toHaveProperty('villages');
        });
        it('should return correct province count', function () {
            var counts = countLocations();
            expect(counts.provinces).toBe(5);
        });
        it('should return correct district count', function () {
            var counts = countLocations();
            expect(counts.districts).toBe(30);
        });
        it('should return correct sector count', function () {
            var counts = countLocations();
            expect(counts.sectors).toBe(416);
        });
        it('should return correct cell count', function () {
            var counts = countLocations();
            expect(counts.cells).toBe(2149);
        });
        it('should return correct village count', function () {
            var counts = countLocations();
            expect(counts.villages).toBe(14837);
        });
        it('should return numbers for all counts', function () {
            var counts = countLocations();
            expect(typeof counts.provinces).toBe('number');
            expect(typeof counts.districts).toBe('number');
            expect(typeof counts.sectors).toBe('number');
            expect(typeof counts.cells).toBe('number');
            expect(typeof counts.villages).toBe('number');
        });
    });
});
