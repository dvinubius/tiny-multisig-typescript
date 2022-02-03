import { Typography } from 'antd';
import React, { FC, SyntheticEvent } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import './TxData.css';

const { Text } = Typography;

export interface ITxDataProps {
  data: string;
  width: number | string | undefined;
  fontSize: number | string | undefined;
  iconFontSize: number | string | undefined;
}

const TxData: FC<ITxDataProps> = (props) => {
  const { currentTheme } = useThemeSwitcher();

  const catchEvent = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', width: props.width }}
      onClick={catchEvent}
      className="TxData">
      <div
        style={{
          paddingLeft: 5,
          fontSize: props.fontSize ?? 28,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {props.data}
      </div>
      <span style={{ fontSize: props.iconFontSize ?? 28 }}>
        <Text copyable={{ text: props.data }}>
          <a
            style={{ color: currentTheme === 'light' ? '#222222' : '#ddd' }}
            target="_blank"
            href={''}
            rel="noopener noreferrer">
            {' '}
          </a>
        </Text>
      </span>
    </div>
  );
};

export default TxData;
