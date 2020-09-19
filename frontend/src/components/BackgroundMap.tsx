import React, { useMemo, useState } from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import styled from 'styled-components';

import cantons, { Canton } from './cantons';

const colors = ['#ff0000', '#00ff00', '#0000ff', '#00e0ff', '#ffe600'];

interface BackgroundMapProps {
  onActiveCantonChange: (canton: Canton | undefined) => void;
  activeCanton: Canton | undefined;
}

const BackgroundMap: React.FC<BackgroundMapProps> = ({ onActiveCantonChange, activeCanton }) => {
  const position: [number, number] = [46.823, 8.1165];
  const coloredCantons = useMemo(() => ({
    ...cantons, features: cantons.features.map((canton, idx) => ({
      ...canton,
      properties: {
        ...canton.properties,
        strokeWidth: 1,
        fillColor: colors[idx % 5],
        fillOpacity: 0.2,
      },
    })),
  }), []);

  const [clickedCanton, setClickedCanton] = useState<Canton | undefined>();

  return (
    <StyledLeafletMap center={position} zoom={8}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      />
      <GeoJSON
        key={clickedCanton}
        data={coloredCantons}
        onmouseout={() => onActiveCantonChange(clickedCanton)}
        style={(entry) => {
          const isClickedOnly = (!activeCanton && entry?.id === clickedCanton);
          return ({
            weight: entry?.id === activeCanton && entry?.id === clickedCanton ? 4 : 1,
            color: '#ddd',
            fillColor: entry?.properties.fillColor,
            fillOpacity: (entry?.id === activeCanton || isClickedOnly) ? (entry?.id === clickedCanton ? 0.55 : 0.85) : 0.2,
          });
        }}
        onEachFeature={(e, l) => {
          l.on('mouseover', () => {
            onActiveCantonChange(e.id as Canton);
          });
          l.on('click', () => {
            if (clickedCanton === e.id as Canton) {
              setClickedCanton(undefined);
            } else {
              setClickedCanton(e.id as Canton);
            }
            onActiveCantonChange(e.id as Canton);
          });
        }} />
    </StyledLeafletMap>
  );
};

const StyledLeafletMap = styled(LeafletMap)`
  height: 100vh;
  width: 100vw;
  background-color: #090909;
  position: absolute;
  z-index: 0;
`;

export default BackgroundMap;