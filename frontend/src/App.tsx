import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Button, DatePicker, Modal, Slider } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import isMobile from 'is-mobile';
import { useQuery } from 'react-query';
import L from 'leaflet';
import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import 'antd/dist/antd.dark.css';

import BackgroundMap from './components/BackgroundMap';
import { Canton } from './components/cantons';
import InfoBox from './components/InfoBox';
import ColoringSwitch, { ColoringMode } from './components/ColoringSwitch';
import ArticleList from './components/ArticleList';
import { getInfections, InfectionData } from './service';
import InfoBoxMobile from './components/InfoBoxMobile';
import './App.css';

// https://github.com/PaulLeCam/react-leaflet/issues/255
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const baseDate = moment('2020-02-27');
  const diffDays = moment().add(-1, 'days').diff(baseDate, 'days');

  const [coloringMode, setColoringMode] = useState<ColoringMode>(ColoringMode.SCARE_SCORE);
  const [activeCanton, setActiveCanton] = useState<Canton | undefined>();
  const [clickedCanton, setClickedCanton] = useState<Canton | undefined>();
  const [sliderValue, setSliderValue] = useState(moment('2020-06-01').diff(baseDate, 'days'));
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [queryCache, setCache] = useState<InfectionData | undefined>();
  const [mobileArticleVisible, setMobileArticleVisible] = useState(false);

  const displayedDate = moment(baseDate).add(sliderValue, 'days');

  const { data } = useQuery(['infectionData', displayedDate], getInfections);

  useEffect(() => {
    if (data) {
      setCache(data);
    }
  }, [data, setCache]);

  if (isMobile() && clickedCanton && mobileArticleVisible) {
    return (
      <ArticleList
        close={() => setMobileArticleVisible(false)}
        canton={clickedCanton}
        date={displayedDate}
      />
    );
  }

  if (isMobile() && clickedCanton) {
    return (
      <InfoBoxMobile
        activeCanton={activeCanton}
        displayedDate={displayedDate}
        data={data || queryCache}
        close={() => setClickedCanton(undefined)}
        openArticleList={() => setMobileArticleVisible(true)}
      />
    );
  }

  const right = !!clickedCanton && !isMobile() ? 400 : 0;
  return (
    <div className="App">
      {right !== 0 && clickedCanton && (
        <ArticleListContainer right={right}>
          <ArticleList
            close={() => {
              setClickedCanton(undefined);
              setActiveCanton(undefined);
            }}
            canton={clickedCanton}
            date={displayedDate}
          />
        </ArticleListContainer>
      )}
      <BackgroundMap
        activeCanton={isMobile() ? undefined : activeCanton}
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
            <ModuleContainer right={right} zIndex={isMobile() ? 2 : 1}>
              <div style={{ width: '100%' }}>
                {!isMobile() && (
                  <InfoBox
                    activeCanton={activeCanton}
                    displayedDate={displayedDate}
                    data={data || queryCache}
                  />
                )}
              </div>
            </ModuleContainer>
            <ModuleContainer right={right}>
              <div style={{ textAlign: 'center' }}>
                <ColoringSwitch mode={coloringMode} setMode={setColoringMode} />
              </div>
            </ModuleContainer>
            <ModuleContainer right={right}>
              <TimeSliderContainer>
                {!isMobile() && (
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
                )}
                {isMobile() && <div style={{ flexGrow: 1 }} />}
                <SliderWrapper>
                  <SliderLegendContainer>
                    <div>{baseDate.format('DD-MM-YYYY')}</div>
                    <div>{moment().add(-1, 'days').format('DD-MM-YYYY')}</div>
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
                  disabledDate={(date) =>
                    !date.isBetween(baseDate, moment().add(-1, 'days'), undefined, '[]')
                  }
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

const ModuleContainer = styled.div<{ right: number; zIndex?: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: ${({ right }) => right}px;
  z-index: ${({ zIndex = 1 }) => zIndex};
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
    transform: translateX(40%);
  }
`;

const StyledSlider = styled(Slider)`
  pointer-events: auto;
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
