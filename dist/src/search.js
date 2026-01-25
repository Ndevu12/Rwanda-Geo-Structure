var SearchEngine = /** @class */ (function () {
    /**
      * Initializes the SearchEngine with geographic administrative data.
      *
      * @param {RwandaData} data - The raw RwandaData structure used to index locations.
      * @param {Object} [clamp] - Optional configuration to cap search results for performance.
      * @returns {SearchEngine} A new SearchEngine instance.
      *
      * _Note: It is recommended to keep clamping enabled in client-side applications to ensure
      * optimal UI responsiveness and prevent excessive memory usage._
      */
    function SearchEngine(data, clamp) {
        var _this = this;
        this.clamp = { active: true, max: 50 };
        this.entries = [];
        this.root = {
            children: new Map(),
            ids: []
        };
        Object.entries(data.rwanda).forEach(function (_a) {
            var province = _a[0], provinces = _a[1];
            _this.addEntry({ level: 5, province: province });
            Object.entries(provinces).forEach(function (_a) {
                var district = _a[0], districts = _a[1];
                _this.addEntry({ level: 4, province: province, district: district });
                Object.entries(districts).forEach(function (_a) {
                    var sector = _a[0], sectors = _a[1];
                    _this.addEntry({ level: 3, province: province, district: district, sector: sector });
                    Object.entries(sectors).forEach(function (_a) {
                        var cell = _a[0], cells = _a[1];
                        _this.addEntry({ level: 2, province: province, district: district, sector: sector, cell: cell });
                        cells.forEach(function (village) {
                            _this.addEntry({
                                level: 1,
                                province: province,
                                district: district,
                                sector: sector,
                                cell: cell,
                                village: village
                            });
                        });
                    });
                });
            });
        });
        this.optimize();
        if (clamp)
            this.clamp = clamp;
    }
    SearchEngine.prototype.addEntry = function (location) {
        var _this = this;
        var id = this.entries.length;
        var entry = {
            id: id,
            level: location.level,
            location: {
                province: location.province,
                district: location.district,
                sector: location.sector,
                cell: location.cell,
                village: location.village
            }
        };
        this.entries.push(entry);
        var context = [
            location.province,
            location.district,
            location.sector,
            location.cell,
            location.village
        ].filter(Boolean).join(" ");
        var tokens = this.tokenize(context);
        tokens.forEach(function (token) { return _this.insert(token, id); });
    };
    SearchEngine.prototype.tokenize = function (s) {
        return this
            .normalize(s)
            .split(/[\s,./\\-]+/)
            .filter(Boolean);
    };
    SearchEngine.prototype.normalize = function (s) {
        return s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };
    SearchEngine.prototype.insert = function (token, id) {
        var node = this.root;
        for (var _i = 0, token_1 = token; _i < token_1.length; _i++) {
            var c = token_1[_i];
            if (!node.children.has(c)) {
                node.children.set(c, {
                    children: new Map(),
                    ids: []
                });
            }
            node = node.children.get(c);
        }
        if (Array.isArray(node.ids)) {
            node.ids.push(id);
        }
        else {
            throw new Error("Cannot add to index after optimization");
        }
    };
    SearchEngine.prototype.optimize = function () {
        this.optimizeNode(this.root);
    };
    SearchEngine.prototype.optimizeNode = function (node) {
        if (Array.isArray(node.ids)) {
            if (node.ids.length > 0) {
                node.ids = new Uint16Array(node.ids);
            }
        }
        for (var _i = 0, _a = Array.from(node.children.values()); _i < _a.length; _i++) {
            var child = _a[_i];
            this.optimizeNode(child);
        }
    };
    SearchEngine.prototype.search = function (query) {
        var _this = this;
        var queryTokens = this.tokenize(query);
        if (queryTokens.length === 0)
            return [];
        var matchingLists = queryTokens.map(function (token) {
            return _this.getIdsForPrefix(token);
        });
        var resultIds = matchingLists.reduce(function (commonIds, list) {
            return Array.from(commonIds).filter(function (id) { return list.includes(id); });
        });
        var uniqueIds = new Set(resultIds);
        return Array.from(uniqueIds).map(function (id) { return _this.entries[id]; });
    };
    SearchEngine.prototype.getIdsForPrefix = function (prefix) {
        var node = this.root;
        for (var _i = 0, prefix_1 = prefix; _i < prefix_1.length; _i++) {
            var c = prefix_1[_i];
            var child = node.children.get(c);
            if (!child)
                return [];
            node = child;
        }
        return this.collectAllIds(node);
    };
    SearchEngine.prototype.collectAllIds = function (node) {
        var results = [];
        if (node.ids instanceof Uint16Array) {
            results = Array.from(node.ids);
        }
        else {
            results = node.ids;
        }
        for (var _i = 0, _a = Array.from(node.children.values()); _i < _a.length; _i++) {
            var child = _a[_i];
            results = results.concat(this.collectAllIds(child));
        }
        return (this.clamp.active
            ? results.slice(0, this.clamp.max)
            : results);
    };
    return SearchEngine;
}());
export default SearchEngine;
