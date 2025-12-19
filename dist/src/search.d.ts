import { RwandaData, SearchEntry } from './rwanda';
export default class SearchEngine {
    private entries;
    private root;
    constructor(data: RwandaData);
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
