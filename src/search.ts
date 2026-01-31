import { RwandaData, SearchEntry } from './rwanda';

interface TrieNode {
  children: Map<string, TrieNode>;
  ids: number[] | Uint16Array;
}

export default class SearchEngine {
  private clamp: { active: boolean; max: number } = { active: true, max: 50 };
  private entries: SearchEntry[] = [];
  private root: TrieNode = {
    children: new Map(),
    ids: []
  };
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
  constructor(data: RwandaData, clamp?: { active: boolean; max: number }) {
    Object.entries(data.rwanda).forEach(([province, provinces]) => {
      this.addEntry({ level: 5, province });
      Object.entries(provinces).forEach(([district, districts]) => {
        this.addEntry({ level: 4, province, district });
        Object.entries(districts).forEach(([sector, sectors]) => {
          this.addEntry({ level: 3, province, district, sector });
          Object.entries(sectors).forEach(([cell, cells]) => {
            this.addEntry({ level: 2, province, district, sector, cell });
            cells.forEach(village => {
              this.addEntry({
                level: 1,
                province,
                district,
                sector,
                cell,
                village
              });
            });
          });
        });
      });
    });

    this.optimize();
    if (clamp) this.clamp = clamp;
  }

  private addEntry(location: any) {
    const id = this.entries.length;
    const entry: SearchEntry = {
      id,
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

    const context = [
      location.province,
      location.district,
      location.sector,
      location.cell,
      location.village
    ].filter(Boolean).join(" ");

    const tokens = this.tokenize(context);
    tokens.forEach(token => this.insert(token, id));
  }

  private tokenize(s: string): string[] {
    return this
      .normalize(s)
      .split(/[\s,./\\-]+/)
      .filter(Boolean);
  }

  private normalize(s: string): string {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  private insert(token: string, id: number) {
    let node = this.root;
    for (const c of token) {
      if (!node.children.has(c)) {
        node.children.set(c, {
          children: new Map(),
          ids: []
        });
      }
      node = node.children.get(c)!;
    }

    if (Array.isArray(node.ids)) {
      node.ids.push(id);
    } else {
      throw new Error("Cannot add to index after optimization");
    }
  }

  private optimize() {
    this.optimizeNode(this.root);
  }

  private optimizeNode(node: TrieNode) {
    if (Array.isArray(node.ids)) {
      if (node.ids.length > 0) {
        node.ids = new Uint16Array(node.ids);
      }
    }

    for (const child of Array.from(node.children.values())) {
      this.optimizeNode(child);
    }
  }

  public search(query: string): SearchEntry[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const matchingLists = queryTokens.map(token => {
      return this.getIdsForPrefix(token);
    });
    const resultIds = matchingLists.reduce((commonIds, list) => {
      return Array.from(commonIds).filter((id: number) => list.includes(id));
    });
    const uniqueIds = new Set(resultIds);

    return Array.from(uniqueIds).map(id => this.entries[id]);
  }

  private getIdsForPrefix(prefix: string): number[] {
    let node = this.root;
    for (const c of prefix) {
      const child = node.children.get(c);
      if (!child) return [];
      node = child;
    }

    return this.collectAllIds(node);
  }

  private collectAllIds(node: TrieNode): number[] {
    let results: number[] = [];
    if (node.ids instanceof Uint16Array) {
      results = Array.from(node.ids);
    } else {
      results = node.ids;
    }

    for (const child of Array.from(node.children.values())) {
      results = results.concat(this.collectAllIds(child));
    }

    return (this.clamp.active
      ? results.slice(0, this.clamp.max)
      : results);
  }
}
