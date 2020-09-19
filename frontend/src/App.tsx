import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'antd/dist/antd.dark.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';

import BackgroundMap from './components/BackgroundMap';

// https://github.com/PaulLeCam/react-leaflet/issues/255
import L from 'leaflet';
import { Canton } from './components/cantons';
import { Button, DatePicker, Modal, Slider } from 'antd';
import moment from 'moment';
import InfoBox from './components/InfoBox';
import ColoringSwitch, { ColoringMode } from './components/ColoringSwitch';
import ArticleList from './components/ArticleList';
import { useQuery } from 'react-query';
import { getInfections, InfectionApiResponse, InfectionData } from './services/service';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const baseDate = moment('2020-02-27');
  const diffDays = moment().diff(baseDate, 'days');

  const [coloringMode, setColoringMode] = useState<ColoringMode>(ColoringMode.TOTAL_CASES);
  const [activeCanton, setActiveCanton] = useState<Canton | undefined>();
  const [clickedCanton, setClickedCanton] = useState<Canton | undefined>();
  const [sliderValue, setSliderValue] = useState(diffDays);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [queryCache, setCache] = useState<InfectionData|undefined>();

  const displayedDate = moment(baseDate).add(sliderValue, 'days');

  const { data } = useQuery(['infectionData', displayedDate], getInfections, );

  useEffect(() => {
    if (data) {
      setCache(data);
    }
  }, [data, setCache])

  const right = !!clickedCanton ? 400 : 0;
  return (
    <div className="App">
      {right !== 0 && (
        <ArticleListContainer right={right}>
          <ArticleList close={() => setClickedCanton(undefined)} />
        </ArticleListContainer>
      )}
      <BackgroundMap
        activeCanton={activeCanton}
        onActiveCantonChange={setActiveCanton}
        rightSpace={right}
        clickedCanton={clickedCanton}
        setClickedCanton={setClickedCanton}
        coloringMode={coloringMode}
        infectionData={data || queryCache}
      />
      <Router>
        <Switch>
          <Route exact path="/">
            <ModuleContainer right={right}>
              <div style={{ width: '100%' }}>
                <InfoBox activeCanton={activeCanton} displayedDate={displayedDate} data={data || queryCache} />
              </div>
            </ModuleContainer>
            <ModuleContainer right={right}>
              <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
                <ColoringSwitch mode={coloringMode} setMode={setColoringMode} />
              </div>
            </ModuleContainer>
            <ModuleContainer right={right}>
              <TimeSliderContainer>
                <CalendarButtonContainer>
                  <CalendarButton>
                    <Button
                      icon={<CalendarOutlined />}
                      shape="circle-outline"
                      size="large"
                      onClick={() => setCalendarModalVisible(true)}
                    />
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
                    tipFormatter={(value) =>
                      moment(baseDate).add(value, 'days').format('DD-MM-YYYY')
                    }
                  />
                </SliderWrapper>
                <div style={{ flexGrow: 1 }} />
              </TimeSliderContainer>
              <Modal
                visible={calendarModalVisible}
                onCancel={() => setCalendarModalVisible(false)}
                title="Select date of data to display"
                footer={[
                  <Button type="primary" onClick={() => setCalendarModalVisible(false)}>
                    OK
                  </Button>,
                ]}
              >
                <DatePicker
                  value={displayedDate}
                  inputReadOnly
                  size="large"
                  allowClear={false}
                  onChange={(value) => value && setSliderValue(value.diff(baseDate, 'days'))}
                  disabledDate={(date) => !date.isBetween(baseDate, moment(), undefined, '[]')}
                />
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

const ArticleListContainer = styled.div<{ right: number }>`
  position: absolute;
  background-color: #282828;
  top: 0;
  bottom: 0;
  width: ${({ right }) => right}px;
  right: 0;
`;

const ModuleContainer = styled.div<{ right: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: ${({ right }) => right}px;
  z-index: 1;
  pointer-events: none;
  padding: 10px;
  transition: right 0.4s;
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
  width: 80%;
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
