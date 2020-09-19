import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'antd/dist/antd.dark.css';
import styled from 'styled-components';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import BackgroundMap from './components/BackgroundMap';

// https://github.com/PaulLeCam/react-leaflet/issues/255
import L from 'leaflet';
import { Canton } from './components/cantons';
import { Slider } from 'antd';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [activeCanton, setActiveCanton] = useState<Canton | undefined>();

  return (
    <div className="App">
      <BackgroundMap activeCanton={activeCanton} onActiveCantonChange={setActiveCanton} />
      <Router>
        <Switch>
          {/*<Route exact path="/route">*/}
          {/*  <div*/}
          {/*    style={{ position: 'relative', pointerEvents: 'auto', display: 'inline-block' }}*/}
          {/*  >*/}
          {/*    <RoutePlanning*/}
          {/*      centerMap={centerMap}*/}
          {/*      data={airports}*/}
          {/*      onTrackChange={handleSetTrack}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</Route>*/}
          <Route exact path="/">
            <ModuleContainer>
              <div style={{ width: '100%', pointerEvents: 'auto' }}>
                <InfoBoxContainer>
                  {activeCanton ? <InfoBox>
                      <div>Canton: {activeCanton}</div>
                      <div>Active cases: {Math.round(Math.random() * 1000)}</div>
                      <div>Total cases: {Math.round(Math.random() * 5000)}</div>
                      <div>Fatal cases: {Math.round(Math.random() * 500)}</div>
                      <div>Corona scare score: {Math.round(Math.random() * 1000) / 100}</div>
                      <div>Corona cases score: {Math.round(Math.random() * 1000) / 100}</div>
                    </InfoBox> :
                    <InfoBox>Hover Canton to see details</InfoBox>}
                </InfoBoxContainer>
              </div>
            </ModuleContainer>
            <ModuleContainer>
              <TimeSliderContainer>
                <StyledSlider range defaultValue={[50, 50]} />
              </TimeSliderContainer>
            </ModuleContainer>
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

const ModuleContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
  padding: 10px;
`;

const InfoBoxContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const InfoBox = styled.div`
  background-color: #333;
  border: 1px solid #666;
  border-radius: 10px;
  padding: 10px;
  display: block;
  font-size: 16px;
`;

const TimeSliderContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const StyledSlider = styled(Slider)`
  pointer-events: auto;
  width: 80vw;
`

export default App;
