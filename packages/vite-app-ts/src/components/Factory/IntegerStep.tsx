import { FC } from 'react';
import { Slider } from 'antd';
import { useState } from 'react';
import { softTextColor } from '~~/styles/styles';

export interface IIntegerStepProps {
  mi: number;
  ma: number;
  update: (v: any) => void;
  sliderWidth?: string;
}

const IntegerStep: FC<IIntegerStepProps> = (props) => {
  const [inputValue, setInputValue] = useState(props.mi);

  const onChange = (value: any) => {
    setInputValue(value);
    props.update(value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: props.sliderWidth ?? '12rem' }}>
        <Slider
          min={props.mi}
          max={props.ma}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: 500,
          padding: '0.125rem 0',
          width: '5rem',
          borderTop: '1px solid #d9d9d9',
          borderRight: '1px solid #d9d9d9',
          borderBottom: '1px solid #d9d9d9',
          textAlign: 'center',
          borderRadius: 4,
        }}>
        {inputValue} <span style={{ color: softTextColor }}>of {props.ma}</span>
      </div>
    </div>
  );
};

export default IntegerStep;
