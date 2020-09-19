import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'antd/dist/antd.dark.css';
import styled from 'styled-components';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';

import BackgroundMap from './components/BackgroundMap';

// https://github.com/PaulLeCam/react-leaflet/issues/255
import L from 'leaflet';
import { Canton } from './components/cantons';
import { Button, DatePicker, Modal, Slider } from 'antd';
import moment from 'moment';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const baseDate = moment('2020-03-13');
  const diffDays = moment().diff(baseDate, 'days');

  const [activeCanton, setActiveCanton] = useState<Canton | undefined>();
  const [sliderValue, setSliderValue] = useState(diffDays);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const displayedDate = moment(baseDate).add(sliderValue, 'days');

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
              <div style={{ width: '100%' }}>
                <InfoBoxContainer>
                  {activeCanton ? <InfoBox>
                      <div>Data at {displayedDate.format('DD-MM-YYYY')}:</div>
                      <div>Canton: {activeCanton}</div>
                      <div>Population: {Math.round(Math.random() * 100000)}</div>
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
                <CalendarButtonContainer>
                  <CalendarButton>
                    <Button icon={<CalendarOutlined />} shape='circle-outline' size='large'
                            onClick={() => setCalendarModalVisible(true)} />
                  </CalendarButton>
                </CalendarButtonContainer>

                <SliderWrapper>
                  <SliderLegendContainer>
                    <div>{baseDate.format('DD-MM-YYYY')}</div>
                    <div>{moment().format('DD-MM-YYYY')}</div>
                  </SliderLegendContainer>
                  <StyledSlider
                    value={sliderValue}
                    max={diffDays}
                    onChange={(value: number) => setSliderValue(value)}
                    tipFormatter={(value) => moment(baseDate).add(value, 'days').format('DD-MM-YYYY')}
                  />
                </SliderWrapper>
                <div style={{ flexGrow: 1 }} />
              </TimeSliderContainer>
              <Modal visible={calendarModalVisible} onCancel={() => setCalendarModalVisible(false)}
                     title='Select date of data to display'
                     footer={[<Button type="primary" onClick={() => setCalendarModalVisible(false)}>
                       OK
                     </Button>]}>
                <DatePicker value={displayedDate}
                            inputReadOnly
                            size='large'
                            allowClear={false}
                            onChange={value => value && setSliderValue(value.diff(baseDate, 'days'))}
                            disabledDate={date => !date.isBetween(baseDate, moment(), undefined, '[]')} />
              </Modal>
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
  padding-bottom: 15px;
`;

const SliderWrapper = styled.div`
  width: 80vw;
`;

const SliderLegendContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  
  & > div:first-of-type {
    transform: translateX(-40%);
  }
  
  & > div:last-of-type {
    transform: translateX(60%);
  }
`;

const StyledSlider = styled(Slider)`
  pointer-events: auto;
  width: 100%;
  & .ant-slider-track {
    opacity: 0;
  }
  
  .ant-slider-handle {
    transform: translateX(-50%) scale(2) !important;
    border-color: #177ddc;
  }
  
  .ant-slider-rail {
    background-color: #444;
  }
`;

const CalendarButton = styled.div`
  pointer-events: auto;
  position: absolute;
  right: 40px;
  top: -35px;
`;

const CalendarButtonContainer = styled.div`
  position: relative;
  flex-grow: 1;
  justify-content: flex-end;
`;

export default App;
