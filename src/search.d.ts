import { RwandaData, SearchEntry } from './rwanda';
export default class SearchEngine {
    private clamp;
    private entries;
    private root;
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
    constructor(data: RwandaData, clamp?: {
        active: boolean;
        max: number;
    });
    private addEntry;
    private tokenize;
    private normalize;
    private insert;
    private optimize;
    private optimizeNode;
    search(query: string): SearchEntry[];
    private getIdsForPrefix;
    private collectAllIds;
}
