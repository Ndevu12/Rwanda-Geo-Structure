import { describe, it, expect } from 'vitest';
import { getProvinces, getDistrictsByProvince, getSectorsByDistrict, getCellsBySector, getVillagesByCell, getDistricts, getSectors, getCells, getVillages, } from '../rwanda';
describe('Data Integrity', function () {
    describe('Hierarchical structure completeness', function () {
        it('every province should have at least one district', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                expect(districts.length, "Province \"".concat(province, "\" should have at least one district")).toBeGreaterThan(0);
            });
        });
        it('every district should have at least one sector', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    expect(sectors.length, "District \"".concat(district, "\" in \"").concat(province, "\" should have at least one sector")).toBeGreaterThan(0);
                });
            });
        });
        it('every sector should have at least one cell', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        var cells = getCellsBySector(province, district, sector);
                        expect(cells.length, "Sector \"".concat(sector, "\" in \"").concat(district, "\", \"").concat(province, "\" should have at least one cell")).toBeGreaterThan(0);
                    });
                });
            });
        });
        it('every cell should have at least one village', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        var cells = getCellsBySector(province, district, sector);
                        cells.forEach(function (cell) {
                            var villages = getVillagesByCell(province, district, sector, cell);
                            expect(villages.length, "Cell \"".concat(cell, "\" in \"").concat(sector, "\", \"").concat(district, "\", \"").concat(province, "\" should have at least one village")).toBeGreaterThan(0);
                        });
                    });
                });
            });
        });
    });
    describe('No empty strings in data', function () {
        it('no province name should be empty', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                expect(province.trim().length, 'Province name should not be empty').toBeGreaterThan(0);
            });
        });
        it('no district name should be empty', function () {
            var districts = getDistricts();
            districts.forEach(function (district) {
                expect(district.trim().length, 'District name should not be empty').toBeGreaterThan(0);
            });
        });
        it('no sector name should be empty', function () {
            var sectors = getSectors();
            sectors.forEach(function (sector) {
                expect(sector.trim().length, 'Sector name should not be empty').toBeGreaterThan(0);
            });
        });
        it('no cell name should be empty', function () {
            var cells = getCells();
            cells.forEach(function (cell) {
                expect(cell.trim().length, 'Cell name should not be empty').toBeGreaterThan(0);
            });
        });
        it('no village name should be empty', function () {
            var villages = getVillages();
            villages.forEach(function (village) {
                expect(village.trim().length, 'Village name should not be empty').toBeGreaterThan(0);
            });
        });
    });
    describe('No duplicate entries', function () {
        it('province names should be unique', function () {
            var provinces = getProvinces();
            var uniqueProvinces = new Set(provinces);
            expect(uniqueProvinces.size).toBe(provinces.length);
        });
        it('district names within each province should be unique', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                var uniqueDistricts = new Set(districts);
                expect(uniqueDistricts.size, "Districts in \"".concat(province, "\" should be unique")).toBe(districts.length);
            });
        });
        it('sector names within each district should be unique', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    var uniqueSectors = new Set(sectors);
                    expect(uniqueSectors.size, "Sectors in \"".concat(district, "\", \"").concat(province, "\" should be unique")).toBe(sectors.length);
                });
            });
        });
        it('cell names within each sector should be unique', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        var cells = getCellsBySector(province, district, sector);
                        var uniqueCells = new Set(cells);
                        expect(uniqueCells.size, "Cells in \"".concat(sector, "\", \"").concat(district, "\", \"").concat(province, "\" should be unique")).toBe(cells.length);
                    });
                });
            });
        });
        it('village names within each cell should be unique', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        var cells = getCellsBySector(province, district, sector);
                        cells.forEach(function (cell) {
                            var villages = getVillagesByCell(province, district, sector, cell);
                            var uniqueVillages = new Set(villages);
                            expect(uniqueVillages.size, "Villages in \"".concat(cell, "\", \"").concat(sector, "\", \"").concat(district, "\", \"").concat(province, "\" should be unique")).toBe(villages.length);
                        });
                    });
                });
            });
        });
    });
    describe('Data type validation', function () {
        it('all province names should be strings', function () {
            var provinces = getProvinces();
            provinces.forEach(function (province) {
                expect(typeof province).toBe('string');
            });
        });
        it('all district names should be strings', function () {
            var districts = getDistricts();
            districts.forEach(function (district) {
                expect(typeof district).toBe('string');
            });
        });
        it('all sector names should be strings', function () {
            var sectors = getSectors();
            sectors.forEach(function (sector) {
                expect(typeof sector).toBe('string');
            });
        });
        it('all cell names should be strings', function () {
            var cells = getCells();
            cells.forEach(function (cell) {
                expect(typeof cell).toBe('string');
            });
        });
        it('all village names should be strings', function () {
            var villages = getVillages();
            villages.forEach(function (village) {
                expect(typeof village).toBe('string');
            });
        });
    });
    describe('Consistent counts', function () {
        it('sum of districts per province should equal total districts', function () {
            var provinces = getProvinces();
            var totalDistricts = 0;
            provinces.forEach(function (province) {
                totalDistricts += getDistrictsByProvince(province).length;
            });
            expect(totalDistricts).toBe(getDistricts().length);
        });
        it('sum of sectors per district should equal total sectors', function () {
            var provinces = getProvinces();
            var totalSectors = 0;
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    totalSectors += getSectorsByDistrict(province, district).length;
                });
            });
            expect(totalSectors).toBe(getSectors().length);
        });
        it('sum of cells per sector should equal total cells', function () {
            var provinces = getProvinces();
            var totalCells = 0;
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        totalCells += getCellsBySector(province, district, sector).length;
                    });
                });
            });
            expect(totalCells).toBe(getCells().length);
        });
        it('sum of villages per cell should equal total villages', function () {
            var provinces = getProvinces();
            var totalVillages = 0;
            provinces.forEach(function (province) {
                var districts = getDistrictsByProvince(province);
                districts.forEach(function (district) {
                    var sectors = getSectorsByDistrict(province, district);
                    sectors.forEach(function (sector) {
                        var cells = getCellsBySector(province, district, sector);
                        cells.forEach(function (cell) {
                            totalVillages += getVillagesByCell(province, district, sector, cell).length;
                        });
                    });
                });
            });
            expect(totalVillages).toBe(getVillages().length);
        });
    });
});
