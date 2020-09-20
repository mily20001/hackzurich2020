import React from 'react';
import { Radio } from 'antd';
import isMobile from 'is-mobile';

export enum ColoringMode {
  TOTAL_CASES = 'Total cases',
  SCARE_SCORE = 'Covid scare score',
  CASES_SCORE = 'Covid cases score',
}

interface ColoringSwitchProps {
  mode: ColoringMode;
  setMode: (newMode: ColoringMode) => void;
}

const ColoringSwitch: React.FC<ColoringSwitchProps> = ({ setMode, mode }) => {
  if (isMobile()) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ flexGrow: 1 }} />
        <Radio.Group
          options={
            Object.values(ColoringMode).map((mode) => ({ label: mode, value: mode })) as {
              value: ColoringMode;
              label: ColoringMode;
            }[]
          }
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          optionType="button"
          buttonStyle="solid"
          size="large"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            pointerEvents: 'auto',
            flexDirection: 'column',
          }}
        />
      </div>
    );
  }

  return (
    <Radio.Group
      options={
        Object.values(ColoringMode).map((mode) => ({ label: mode, value: mode })) as {
          value: ColoringMode;
          label: ColoringMode;
        }[]
      }
      onChange={(e) => setMode(e.target.value)}
      value={mode}
      optionType="button"
      buttonStyle="solid"
      size="large"
      style={{
        pointerEvents: 'auto',
      }}
    />
  );
};

export default ColoringSwitch;
