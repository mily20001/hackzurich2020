import React from 'react';
import { Radio } from 'antd';

export enum ColoringMode {
  TOTAL_CASES = 'Total cases',
  CASES_SCORE = 'Covid cases score',
  SCARE_SCORE = 'Covid scare score',
}

interface ColoringSwitchProps {
  mode: ColoringMode;
  setMode: (newMode: ColoringMode) => void;
}

const ColoringSwitch: React.FC<ColoringSwitchProps> = ({ setMode, mode }) => {
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
    />
  );
};

export default ColoringSwitch;
