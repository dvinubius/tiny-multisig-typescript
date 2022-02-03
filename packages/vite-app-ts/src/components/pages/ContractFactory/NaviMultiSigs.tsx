import React, { FC } from 'react';
import { Divider, Typography } from 'antd';
const { Title } = Typography;

export interface INaviMultiSigsProps {
  naviItems: any;
  pageTitle: any;
  viewDivider: any;
  viewContent: any;
}
const NaviMultiSigs: FC<INaviMultiSigsProps> = (props) => {
  return (
    <div
      style={{
        height: '100%',
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 0 0',
      }}>
      {
        <div
          style={{
            alignSelf: 'stretch',
            margin: '0 1rem',
            display: 'flex',
            gap: '1rem',
            position: 'relative',
          }}>
          {props.naviItems ?? ''}
          <Title
            level={2}
            style={{
              fontWeight: 400,
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: -1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
            {props.pageTitle ?? ''}
          </Title>
        </div>
      }
      <div style={{ width: '100%', padding: '0 1rem' }}>{props.viewDivider}</div>
      {props.viewContent ?? ''}
    </div>
  );
};
export default NaviMultiSigs;
