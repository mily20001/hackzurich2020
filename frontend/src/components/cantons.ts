import cantons from './swissCantons.json';

export enum Canton {
  ZH = 'ZH',
  BE = 'BE',
  LU = 'LU',
  UR = 'UR',
  SZ = 'SZ',
  OW = 'OW',
  NW = 'NW',
  GL = 'GL',
  ZG = 'ZG',
  FR = 'FR',
  SO = 'SO',
  BS = 'BS',
  BL = 'BL',
  SH = 'SH',
  AR = 'AR',
  AI = 'AI',
  SG = 'SG',
  GR = 'GR',
  AG = 'AG',
  TG = 'TG',
  TI = 'TI',
  VD = 'VD',
  VS = 'VS',
  NE = 'NE',
  GE = 'GE',
  JU = 'JU',
}

export const CantonInfo: { [key in Canton]: { name: string; population: number } } = {
  [Canton.AG]: { name: 'Aargau', population: 685424 },
  [Canton.AI]: { name: 'Appenzell Innerrhoden', population: 16145 },
  [Canton.AR]: { name: 'Appenzell Ausserrhoden', population: 55234 },
  [Canton.BE]: { name: 'Bern', population: 1034977 },
  [Canton.BL]: { name: 'Basel-Landschaft', population: 288132 },
  [Canton.BS]: { name: 'Basel-Stadt', population: 194766 },
  [Canton.FR]: { name: 'Freiburg', population: 318714 },
  [Canton.GE]: { name: 'Genf', population: 499480 },
  [Canton.GL]: { name: 'Glarus', population: 40403 },
  [Canton.GR]: { name: 'Graubünden', population: 198379 },
  [Canton.JU]: { name: 'Jura', population: 73419 },
  [Canton.LU]: { name: 'Luzern', population: 409557 },
  [Canton.NE]: { name: 'Neuenburg', population: 176850 },
  [Canton.NW]: { name: 'Nidwalden', population: 43223 },
  [Canton.OW]: { name: 'Obwalden', population: 37841 },
  [Canton.SG]: { name: 'St. Gallen', population: 507697 },
  [Canton.SH]: { name: 'Schaffhausen', population: 81991 },
  [Canton.SO]: { name: 'Solothurn', population: 273194 },
  [Canton.SZ]: { name: 'Schwyz', population: 159165 },
  [Canton.TG]: { name: 'Thurgau', population: 276472 },
  [Canton.TI]: { name: 'Tessin', population: 353343 },
  [Canton.UR]: { name: 'Uri', population: 36433 },
  [Canton.VD]: { name: 'Waadt', population: 799145 },
  [Canton.VS]: { name: 'Wallis', population: 343955 },
  [Canton.ZG]: { name: 'Zug', population: 126837 },
  [Canton.ZH]: { name: 'Zürich', population: 1520968 },
};

export interface CantonGeoJson {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    id: Canton;
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][];
    };
    properties: {
      name: string;
      stroke?: string;
      fill?: string;
      strokeWidth?: number;
      strokeOpacity?: number;
      fillOpacity?: number;
    };
  }[];
}

export default (cantons as unknown) as CantonGeoJson;
