import { List, Spin } from 'antd';
import React, { FC, useContext, useState } from 'react';

import './MultiSig.css';
import { MsSafeContext } from './MultiSig';
import { CheckCircleOutlined } from '@ant-design/icons';
import { primaryColor } from '~~/styles/styles';
import { Address } from '~~/eth-components/ant/Address';
import OwnerMark from '../Shared/OwnerMark';
import { useEthersContext } from 'eth-hooks/context';

export interface IOwnersProps {
  confirmations?: boolean[];
}

const Owners: FC<IOwnersProps> = (props) => {
  const { account } = useEthersContext();
  let { owners } = useContext(MsSafeContext);

  const singleColumn = (
    <>
      {owners && owners.length && (
        <>
          <div>
            <List size="small">
              {owners.map((owner) => (
                <List.Item style={{ padding: '0.25rem 2rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Address address={owner} fontSize={14} />
                    <div style={{ position: 'absolute', right: '-2rem', top: 0 }}>
                      {owner === account ? <OwnerMark /> : ''}
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>
        </>
      )}
    </>
  );

  const twoColumns = (
    <>
      {owners && owners.length && props.confirmations && (
        <>
          <div>
            <List size="small">
              {owners.map((owner, idx) => (
                <List.Item style={{ padding: '0.25rem 2rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <Address address={owner} fontSize={14} />
                      {owner === account ? <OwnerMark /> : ''}
                    </div>
                    <div style={{ opacity: props.confirmations && props.confirmations[idx] ? 1 : 0.5 }}>
                      {
                        <CheckCircleOutlined
                          style={{ color: props.confirmations && props.confirmations[idx] ? primaryColor : '#bebebe' }}
                        />
                      }
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>
        </>
      )}
    </>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className="OwnersCard">
      {(!owners || !owners.length) && (
        <div style={{ height: '8rem', display: 'flex', alignItems: 'center' }}>
          <Spin></Spin>
        </div>
      )}
      <div
        style={{
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column',
        }}>
        {props.confirmations ? twoColumns : singleColumn}
      </div>
    </div>
  );
};

export default Owners;
