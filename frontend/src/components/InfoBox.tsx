import React from 'react';
import styled from 'styled-components';
import { Canton, CantonInfo } from './cantons';
import { Moment } from 'moment';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Colors } from './colors';
import { InfectionApiResponse, InfectionData } from '../services/service';

interface InfoBoxProps {
  activeCanton: Canton | undefined;
  displayedDate: Moment;
  data?: InfectionData;
}

const InfoBox: React.FC<InfoBoxProps> = ({ activeCanton, displayedDate, data }) => {
  if (!activeCanton || !data) {
    return (
      <InfoBoxContainer>
        <InfoBoxElement>
          <div style={{ textAlign: 'center' }}>Hover Canton to see details</div>
        </InfoBoxElement>
      </InfoBoxContainer>
    );
  }

  const {
    confirmed_1delta,
    confirmed_7delta,
    confirmed_total,
    deceased_1delta,
    deceased_7delta,
    deceased_total,
    released_1delta,
    released_7delta,
    released_total,
    corona_score
  } = data[activeCanton];

  return (
    <InfoBoxContainer>
      <InfoBoxElement className="full">
        <TitleBox>
          <CantonName>{CantonInfo[activeCanton].name}</CantonName>
          <div>Data at {displayedDate.format('DD-MM-YYYY')}:</div>
        </TitleBox>
        <Card>
          <Statistic
            title="Population"
            value={CantonInfo[activeCanton].population}
            precision={0}
            valueStyle={{ color: Colors.LIGHT_GREY }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total cases"
            value={confirmed_total}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Active cases"
            value={released_total ? confirmed_total - released_total - deceased_total : '-'}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Fatal cases"
            value={deceased_total}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Corona scare score"
            value={1}
            precision={2}
            valueStyle={{ color: Colors.GREEN }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Corona cases score"
            value={corona_score}
            precision={2}
            valueStyle={{ color: Colors.GREEN }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </InfoBoxElement>
    </InfoBoxContainer>
  );
};

const TitleBox = styled.div`
  padding-bottom: 10px;
  text-align: center;
`;

const CantonName = styled.div`
  font-weight: 700;
  font-size: 22px;
`;

const InfoBoxContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const InfoBoxElement = styled.div`
  pointer-events: auto;
  background-color: #282828;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 10px;
  display: block;
  font-size: 16px;
  width: 200px;
  height: auto;
  transition: max-height 0.5s;
  max-height: 75px;
  overflow-y: hidden;
  &.full {
    max-height: 1500px;
  }
`;

export default InfoBox;
