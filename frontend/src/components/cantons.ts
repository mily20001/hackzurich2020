import cantons from './swissCantons.json';

export enum Canton {
  ZH,
  BE,
  LU,
  UR,
  SZ,
  OW,
  NW,
  GL,
  ZG,
  FR,
  SO,
  BS,
  BL,
  SH,
  AR,
  AI,
  SG,
  GR,
  AG,
  TG,
  TI,
  VD,
  VS,
  NE,
  GE,
  JU,
}

export interface CantonGeoJson {
  type: 'FeatureCollection',
  features: {
    type: 'Feature';
    id: Canton;
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][];
    };
    properties: {
      name: string;
      stroke?: string,
      fill?: string,
      'strokeWidth'?: number,
      'strokeOpacity'?: number,
      'fillOpacity'?: number
    }
  }[]
}

export default cantons as unknown as CantonGeoJson;