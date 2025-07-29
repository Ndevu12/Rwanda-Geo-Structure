export interface RwandaData {
    rwanda: {
        [province: string]: Province;
    };
}
export interface Province {
    [district: string]: District;
}
export interface District {
    [sector: string]: Sector;
}
export interface Sector {
    [cell: string]: string[];
}
declare const RwandaGeoStructure: {
    getCountry: () => string;
    getProvinces: () => string[];
    getDistricts: () => string[];
    getDistrictsByProvince: (province: string) => string[];
    getSectors: () => string[];
    getSectorsByDistrict: (province: string, district: string) => string[];
    getCells: () => string[];
    getCellsBySector: (province: string, district: string, sector: string) => string[];
    getVillages: () => string[];
    getVillagesByCell: (province: string, district: string, sector: string, cell: string) => string[];
    getRandomLocation: () => {
        province: string;
        district: string;
        sector: string;
        cell: string;
        village: string;
    };
    countLocations: () => {
        provinces: number;
        districts: number;
        sectors: number;
        cells: number;
        villages: number;
    };
};
export default RwandaGeoStructure;
