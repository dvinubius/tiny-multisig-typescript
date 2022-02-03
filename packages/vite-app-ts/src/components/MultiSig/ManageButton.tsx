import { softBg, softTextColor } from '~~/styles/styles';
import React, { FC } from 'react';
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export interface IManageButtonProps {
  text: string;
  onClick: () => {};
  collapsed: boolean;
  reverse: boolean;
  wrapperStyle: any;
}

const ManageButton: FC<IManageButtonProps> = (props) => (
  <div
    style={{
      ...props.wrapperStyle,
      display: 'flex',
      alignItems: 'center',
      flexDirection: props.reverse ? 'row-reverse' : 'row',
      width: '8rem',
      color: softTextColor,
      borderRadius: '0.25rem',
      background: softBg,
    }}>
    <div
      style={{
        textAlign: 'center',
        flexGrow: 1,
        height: 'calc(100% - 2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `1px solid #dedede}`,
        borderLeft: `1px solid #dedede}`,
        borderBottom: `1px solid #dedede}`,
      }}>
      {props.text}
    </div>
    <Button
      type="default"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: softTextColor,
        padding: '0.5rem',
      }}
      onClick={props.onClick}>
      <div
        style={{
          transition: 'all 0.3s ease-out',
          transform: props.collapsed ? 'translateY(0.05rem)' : 'rotateX(180deg) translateY(0.05rem)',
        }}>
        <DownOutlined />
      </div>
    </Button>
  </div>
);

export default ManageButton;
