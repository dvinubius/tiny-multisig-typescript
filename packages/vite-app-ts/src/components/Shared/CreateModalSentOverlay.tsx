import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { FC } from 'react';
import { dialogOverlayGradient, errorColor, primaryColor } from '~~/styles/styles';

export interface ICreateModalSendOverlay {
  txError: boolean;
  txSuccess: boolean;
  pendingText: string;
  successText: string;
  errorText: string;
}
const CreateModalSentOverlay: FC<ICreateModalSendOverlay> = (props) => (
  <div
    style={{
      position: 'absolute',
      zIndex: 10,
      top: 55,
      bottom: 53,
      left: 0,
      width: '100%',
      pointerEvents: 'none',
      background: dialogOverlayGradient,
      backdropFilter: 'blur(2px)',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
    }}>
    {props.txError && (
      <>
        <div style={{ fontSize: '1.5rem' }}>{props.errorText}</div>
        <StopOutlined style={{ color: errorColor, fontSize: '4rem' }} />
      </>
    )}
    {props.txSuccess && (
      <>
        <div style={{ fontSize: '1.5rem' }}>{props.successText}</div>
        <CheckCircleOutlined style={{ color: primaryColor, fontSize: '4rem' }} />
      </>
    )}
    {!props.txError && !props.txSuccess && (
      <>
        <div style={{ fontSize: '1.5rem' }}>{props.pendingText}</div>
        <div style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" style={{ transform: 'scale(1.5)' }} />
        </div>
      </>
    )}
  </div>
);

export default CreateModalSentOverlay;
