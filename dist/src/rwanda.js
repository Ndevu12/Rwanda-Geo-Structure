// file location: src/data/Rwanda.ts
import rwandaData from '../rwanda.json';
import SearchEngine from './search';
// data import
var data = rwandaData;
var engine = new SearchEngine(data);
// functions
export var search = function (query) {
    return engine.search(query);
};
export var getCountry = function () {
    return 'Rwanda';
};
export var getProvinces = function () {
    return Object.keys(data.rwanda);
};
export var getDistricts = function () {
    return Object.values(data.rwanda).flatMap(function (province) { return Object.keys(province); });
};
export var getDistrictsByProvince = function (province) {
    return Object.keys(data.rwanda[province] || {});
};
export var getSectors = function () {
    return Object.values(data.rwanda).flatMap(function (province) {
        return Object.values(province).flatMap(function (district) { return Object.keys(district); });
    });
};
export var getSectorsByDistrict = function (province, district) {
    var _a;
    return Object.keys(((_a = data.rwanda[province]) === null || _a === void 0 ? void 0 : _a[district]) || {});
};
export var getCells = function () {
    return Object.values(data.rwanda).flatMap(function (province) {
        return Object.values(province).flatMap(function (district) {
            return Object.values(district).flatMap(function (sector) { return Object.keys(sector); });
        });
    });
};
export var getCellsBySector = function (province, district, sector) {
    var _a, _b;
    return Object.keys(((_b = (_a = data.rwanda[province]) === null || _a === void 0 ? void 0 : _a[district]) === null || _b === void 0 ? void 0 : _b[sector]) || {});
};
export var getVillages = function () {
    return Object.values(data.rwanda).flatMap(function (province) {
        return Object.values(province).flatMap(function (district) {
            return Object.values(district).flatMap(function (sector) {
                return Object.values(sector).flatMap(function (cell) { return cell; });
            });
        });
    });
};
export var getVillagesByCell = function (province, district, sector, cell) {
    var _a, _b, _c;
    return ((_c = (_b = (_a = data.rwanda[province]) === null || _a === void 0 ? void 0 : _a[district]) === null || _b === void 0 ? void 0 : _b[sector]) === null || _c === void 0 ? void 0 : _c[cell]) || [];
};
export var getRandomLocation = function () {
    var provinces = Object.keys(data.rwanda);
    var province = provinces[Math.floor(Math.random() * provinces.length)];
    var districts = Object.keys(data.rwanda[province]);
    var district = districts[Math.floor(Math.random() * districts.length)];
    var sectors = Object.keys(data.rwanda[province][district]);
    var sector = sectors[Math.floor(Math.random() * sectors.length)];
    var cells = Object.keys(data.rwanda[province][district][sector]);
    var cell = cells[Math.floor(Math.random() * cells.length)];
    var villages = data.rwanda[province][district][sector][cell];
    var village = villages[Math.floor(Math.random() * villages.length)];
    return {
        province: province,
        district: district,
        sector: sector,
        cell: cell,
        village: village
    };
};
export var countLocations = function () {
    var provinces = Object.keys(data.rwanda).length;
    var districts = 0;
    var sectors = 0;
    var cells = 0;
    var villages = 0;
    Object.values(data.rwanda).forEach(function (province) {
        districts += Object.keys(province).length;
        Object.values(province).forEach(function (district) {
            sectors += Object.keys(district).length;
            Object.values(district).forEach(function (sector) {
                cells += Object.keys(sector).length;
                Object.values(sector).forEach(function (cell) {
                    villages += cell.length;
                });
            });
        });
    });
    return { provinces: provinces, districts: districts, sectors: sectors, cells: cells, villages: villages };
};
