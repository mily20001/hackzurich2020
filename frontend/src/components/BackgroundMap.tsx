import React, { useMemo } from 'react';
import { GeoJSON, Map as LeafletMap, TileLayer } from 'react-leaflet';
import styled from 'styled-components';
import color from 'color';

import cantons, { Canton } from './cantons';
import { InfectionData } from '../services/service';
import { ColoringMode } from './ColoringSwitch';

const colors = ['#ff0000', '#00ff00', '#0000ff', '#00e0ff', '#ffe600'];

interface BackgroundMapProps {
  onActiveCantonChange: (canton: Canton | undefined) => void;
  activeCanton: Canton | undefined;
  setClickedCanton: (canton: Canton | undefined) => void;
  clickedCanton: Canton | undefined;
  rightSpace?: number;
  infectionData?: InfectionData;
  coloringMode: ColoringMode;
}

const BackgroundMap: React.FC<BackgroundMapProps> = ({
  onActiveCantonChange,
  activeCanton,
  rightSpace = 0,
  clickedCanton,
  setClickedCanton,
  infectionData,
  coloringMode,
}) => {
  const position: [number, number] = [46.823, 8.1165];
  const coloredCantons = useMemo(
    () => ({
      ...cantons,
      features: cantons.features.map((canton, idx) => ({
        ...canton,
        properties: {
          ...canton.properties,
          strokeWidth: 1,
          fillColor: colors[idx % 5],
          fillOpacity: 0.2,
        },
      })),
    }),
    []
  );

  return (
    <StyledLeafletMap center={position} zoom={8} right={rightSpace}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      />
      <GeoJSON
        key={clickedCanton}
        data={coloredCantons}
        onmouseout={() => onActiveCantonChange(clickedCanton)}
        style={(entry) => {
          const id: Canton = entry?.id as Canton;
          let targetColor = '#aaa';
          let opacity = 0.5;
          if (coloringMode === ColoringMode.TOTAL_CASES) {
            targetColor = '#f00';
            opacity = (infectionData ? infectionData[id].confirmed_total : 0) / 19000;
          } else if (coloringMode === ColoringMode.CASES_SCORE) {
            const clippedValue = Math.min((infectionData?.[id].corona_score || 0), 10);
            targetColor = `hsl(${120 - clippedValue * 12}, 100%, 50%)`;
            opacity = entry?.id === clickedCanton ? 0.8 : entry?.id === activeCanton ? 0.45 : 0.3;
          }

          return {
            weight: id === clickedCanton ? 5 : entry?.id === activeCanton ? 3 : 1,
            color: '#ddd',
            fillColor: targetColor,
            fillOpacity: opacity,
            // fillOpacity: entry?.id === clickedCanton ? 0.85 : entry?.id === activeCanton ? 0.45 : 0.2,
          };
        }}
        onEachFeature={(e, l) => {
          if (!clickedCanton) {
            l.on('mouseover', () => {
              onActiveCantonChange(e.id as Canton);
            });
          }

          l.on('click', () => {
            if (clickedCanton === (e.id as Canton)) {
              setClickedCanton(undefined);
            } else {
              setClickedCanton(e.id as Canton);
            }
            onActiveCantonChange(e.id as Canton);
          });
        }}
      />
    </StyledLeafletMap>
  );
};

const StyledLeafletMap = styled(LeafletMap)<{ right: number }>`
  height: 100vh;
  width: calc(100vw - ${({ right }) => right}px);
  background-color: #090909;
  position: absolute;
  z-index: 0;
  transition: width 0.4s;
`;

export default BackgroundMap;
