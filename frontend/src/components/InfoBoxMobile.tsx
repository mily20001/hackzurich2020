import React from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import { Button, Card, Statistic } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import { InfectionData } from '../service';

import { Canton, CantonInfo } from './cantons';
import { Colors, getScoreColorString } from './colors';

interface InfoBoxProps {
  activeCanton: Canton | undefined;
  displayedDate: Moment;
  data?: InfectionData;
  close: () => void;
  openArticleList: () => void;
}

const getSuffix = (value: number) => {
  if (!value) {
    return undefined;
  }

  return (
    <span style={{ paddingLeft: 5 }}>
      {value > 0 ? '+' : '-'}
      {value}
    </span>
  );
};

const InfoBoxMobile: React.FC<InfoBoxProps> = ({
  activeCanton,
  displayedDate,
  data,
  close,
  openArticleList,
}) => {
  if (!data || !activeCanton) {
    return null;
  }

  const {
    confirmed_1delta,
    confirmed_7delta,
    confirmed_total,
    deceased_1delta,
    deceased_total,
    corona_score,
    scare_score,
  } = data[activeCanton];

  return (
    <InfoBoxContainer>
      <InfoBoxElement>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            paddingBottom: 10,
          }}
        >
          <Button icon={<SolutionOutlined />} onClick={openArticleList} size="large">
            Go to document list
          </Button>
          <Button icon={<CloseOutlined />} onClick={close} size="large" />
        </div>
        <TitleBox>
          <CantonName>{CantonInfo[activeCanton].name}</CantonName>
          <div>Data at {displayedDate.format('DD-MM-YYYY')}:</div>
        </TitleBox>
        <StyledCard>
          <Statistic
            title="Population"
            value={CantonInfo[activeCanton].population}
            precision={0}
            valueStyle={{ color: Colors.LIGHT_GREY }}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="Total cases"
            value={confirmed_total}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            suffix={getSuffix(confirmed_1delta)}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="Average daily new"
            value={confirmed_7delta / 7}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            prefix={
              confirmed_7delta / 7 >= 0.5 ? (
                confirmed_1delta > confirmed_7delta / 7 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              ) : undefined
            }
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="Fatal cases"
            value={deceased_total}
            precision={0}
            valueStyle={{ color: Colors.RED }}
            suffix={getSuffix(deceased_1delta)}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="Corona scare score"
            value={scare_score}
            precision={2}
            valueStyle={{ color: getScoreColorString(scare_score) }}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="Corona cases score"
            value={corona_score}
            precision={2}
            valueStyle={{ color: getScoreColorString(corona_score) }}
          />
        </StyledCard>
      </InfoBoxElement>
    </InfoBoxContainer>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 15px;
`;

const TitleBox = styled.div`
  padding-bottom: 10px;
  text-align: center;
`;

const CantonName = styled.div`
  font-weight: 700;
  font-size: 22px;
`;

const InfoBoxContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const InfoBoxElement = styled.div`
  pointer-events: auto;
  background-color: #000;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 10px;
  display: block;
  font-size: 16px;
  width: 100%;
  height: 100%;
  transition: max-height 0.5s;
  overflow-y: auto;
`;

export default InfoBoxMobile;
