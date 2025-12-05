import { describe, it, expect } from 'vitest';
import {
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  getDistricts,
  getSectors,
  getCells,
  getVillages,
} from '../rwanda';

describe('Data Integrity', () => {
  describe('Hierarchical structure completeness', () => {
    it('every province should have at least one district', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        expect(
          districts.length,
          `Province "${province}" should have at least one district`
        ).toBeGreaterThan(0);
      });
    });

    it('every district should have at least one sector', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          expect(
            sectors.length,
            `District "${district}" in "${province}" should have at least one sector`
          ).toBeGreaterThan(0);
        });
      });
    });

    it('every sector should have at least one cell', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            const cells = getCellsBySector(province, district, sector);
            expect(
              cells.length,
              `Sector "${sector}" in "${district}", "${province}" should have at least one cell`
            ).toBeGreaterThan(0);
          });
        });
      });
    });

    it('every cell should have at least one village', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            const cells = getCellsBySector(province, district, sector);
            cells.forEach((cell) => {
              const villages = getVillagesByCell(province, district, sector, cell);
              expect(
                villages.length,
                `Cell "${cell}" in "${sector}", "${district}", "${province}" should have at least one village`
              ).toBeGreaterThan(0);
            });
          });
        });
      });
    });
  });

  describe('No empty strings in data', () => {
    it('no province name should be empty', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        expect(province.trim().length, 'Province name should not be empty').toBeGreaterThan(0);
      });
    });

    it('no district name should be empty', () => {
      const districts = getDistricts();
      districts.forEach((district) => {
        expect(district.trim().length, 'District name should not be empty').toBeGreaterThan(0);
      });
    });

    it('no sector name should be empty', () => {
      const sectors = getSectors();
      sectors.forEach((sector) => {
        expect(sector.trim().length, 'Sector name should not be empty').toBeGreaterThan(0);
      });
    });

    it('no cell name should be empty', () => {
      const cells = getCells();
      cells.forEach((cell) => {
        expect(cell.trim().length, 'Cell name should not be empty').toBeGreaterThan(0);
      });
    });

    it('no village name should be empty', () => {
      const villages = getVillages();
      villages.forEach((village) => {
        expect(village.trim().length, 'Village name should not be empty').toBeGreaterThan(0);
      });
    });
  });

  describe('No duplicate entries', () => {
    it('province names should be unique', () => {
      const provinces = getProvinces();
      const uniqueProvinces = new Set(provinces);
      expect(uniqueProvinces.size).toBe(provinces.length);
    });

    it('district names within each province should be unique', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        const uniqueDistricts = new Set(districts);
        expect(
          uniqueDistricts.size,
          `Districts in "${province}" should be unique`
        ).toBe(districts.length);
      });
    });

    it('sector names within each district should be unique', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          const uniqueSectors = new Set(sectors);
          expect(
            uniqueSectors.size,
            `Sectors in "${district}", "${province}" should be unique`
          ).toBe(sectors.length);
        });
      });
    });

    it('cell names within each sector should be unique', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            const cells = getCellsBySector(province, district, sector);
            const uniqueCells = new Set(cells);
            expect(
              uniqueCells.size,
              `Cells in "${sector}", "${district}", "${province}" should be unique`
            ).toBe(cells.length);
          });
        });
      });
    });

    it('village names within each cell should be unique', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            const cells = getCellsBySector(province, district, sector);
            cells.forEach((cell) => {
              const villages = getVillagesByCell(province, district, sector, cell);
              const uniqueVillages = new Set(villages);
              expect(
                uniqueVillages.size,
                `Villages in "${cell}", "${sector}", "${district}", "${province}" should be unique`
              ).toBe(villages.length);
            });
          });
        });
      });
    });
  });

  describe('Data type validation', () => {
    it('all province names should be strings', () => {
      const provinces = getProvinces();
      provinces.forEach((province) => {
        expect(typeof province).toBe('string');
      });
    });

    it('all district names should be strings', () => {
      const districts = getDistricts();
      districts.forEach((district) => {
        expect(typeof district).toBe('string');
      });
    });

    it('all sector names should be strings', () => {
      const sectors = getSectors();
      sectors.forEach((sector) => {
        expect(typeof sector).toBe('string');
      });
    });

    it('all cell names should be strings', () => {
      const cells = getCells();
      cells.forEach((cell) => {
        expect(typeof cell).toBe('string');
      });
    });

    it('all village names should be strings', () => {
      const villages = getVillages();
      villages.forEach((village) => {
        expect(typeof village).toBe('string');
      });
    });
  });

  describe('Consistent counts', () => {
    it('sum of districts per province should equal total districts', () => {
      const provinces = getProvinces();
      let totalDistricts = 0;
      provinces.forEach((province) => {
        totalDistricts += getDistrictsByProvince(province).length;
      });
      expect(totalDistricts).toBe(getDistricts().length);
    });

    it('sum of sectors per district should equal total sectors', () => {
      const provinces = getProvinces();
      let totalSectors = 0;
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          totalSectors += getSectorsByDistrict(province, district).length;
        });
      });
      expect(totalSectors).toBe(getSectors().length);
    });

    it('sum of cells per sector should equal total cells', () => {
      const provinces = getProvinces();
      let totalCells = 0;
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            totalCells += getCellsBySector(province, district, sector).length;
          });
        });
      });
      expect(totalCells).toBe(getCells().length);
    });

    it('sum of villages per cell should equal total villages', () => {
      const provinces = getProvinces();
      let totalVillages = 0;
      provinces.forEach((province) => {
        const districts = getDistrictsByProvince(province);
        districts.forEach((district) => {
          const sectors = getSectorsByDistrict(province, district);
          sectors.forEach((sector) => {
            const cells = getCellsBySector(province, district, sector);
            cells.forEach((cell) => {
              totalVillages += getVillagesByCell(province, district, sector, cell).length;
            });
          });
        });
      });
      expect(totalVillages).toBe(getVillages().length);
    });
  });
});
