import React from 'react';
import styled from 'styled-components';
import { Canton, CantonInfo } from './cantons';
import { Moment } from 'moment';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

interface InfoBoxProps {
  activeCanton: Canton | undefined;
  displayedDate: Moment;
}

const InfoBox: React.FC<InfoBoxProps> = ({ activeCanton, displayedDate }) => {
  return <InfoBoxContainer>
    <InfoBoxElement className={!!activeCanton ? 'full' : ''}> {activeCanton ? <>
      <TitleBox>
        <CantonName>{CantonInfo[activeCanton].name}</CantonName>
        <div>Data at {displayedDate.format('DD-MM-YYYY')}:</div>
      </TitleBox>
      <Card>
        <Statistic
          title="Population"
          value={CantonInfo[activeCanton].population}
          precision={0}
        />
      </Card>
      <Card>
        <Statistic
          title="Active cases"
          value={Math.round(Math.random() * 1000)}
          precision={0}
          valueStyle={{ color: '#c00' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Recovered cases"
          value={Math.round(Math.random() * 5000)}
          precision={0}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Fatal cases"
          value={Math.round(Math.random() * 500)}
          precision={0}
          valueStyle={{ color: '#c00' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Corona scare score"
          value={Math.round(Math.random() * 1000) / 100}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Corona cases score"
          value={Math.round(Math.random() * 1000) / 100}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card></> : 'Hover Canton to see details'}</InfoBoxElement>
  </InfoBoxContainer>;
};

const TitleBox = styled.div`
  padding-bottom: 10px;
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
  background-color: #333;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 10px;
  display: block;
  font-size: 16px;
  width: 200px;
  height: auto;
  transition: max-height 0.50s;
  max-height: 75px;
  overflow-y: hidden;
  &.full {
    max-height: 1500px;
  }
`;

export default InfoBox;