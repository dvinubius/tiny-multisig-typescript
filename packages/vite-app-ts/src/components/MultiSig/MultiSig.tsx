import { Card, Divider, Spin, Tabs, Descriptions } from 'antd';
import { useBalance, useContractLoader, useContractReader } from 'eth-hooks';
import './MultiSig.css';
import React, { useContext, useEffect, useState, createContext, FC } from 'react';
import {
  cardGradient,
  softBorder,
  mainColWidthRem,
  softBorder2,
  primaryColor,
  cardGradientVert,
  breakPointMsFit,
  msSafeColWidthRem,
  msSafeColGapRem,
} from '~~/styles/styles';
import QR from 'qrcode.react';
import { useMultiSigTransactions } from './useMultiSigTransactions';
import Owners from './Owners';
import UserStatus from '../Shared/UserStatus';
import { InnerAppContext, LayoutContext } from '../../MainPage';
import { BaseContract } from 'ethers';
import { asEthersAdaptor } from 'eth-hooks/functions';
import { useEthersContext } from 'eth-hooks/context';
import { MSSafeEntity } from '~~/models/contractFactory/ms-safe-entity.model';
import { Address, Balance } from '~~/eth-components/ant';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { BigNumber } from '@ethersproject/bignumber';
import Requirements from './Requirements';
import { MSTransactionModel } from './models/ms-transaction.model';
import MSTransactionsSection from './MSTransactionsSection';
import { remToPx } from '~~/helpers/layoutCalc';

export const MsSafeContext = createContext<{
  multiSigSafe?: any;
  owners?: string[];
  confirmationsRequired?: number;
  msTransactions?: { pending: MSTransactionModel[]; executed: MSTransactionModel[] };
  balance?: BigNumber;
}>({});

export interface IMultiSigProps {
  contract: MSSafeEntity | undefined;
}

export const MultiSig: FC<IMultiSigProps> = (props) => {
  const { injectableAbis } = useContext(InnerAppContext);

  const ethersContext = useEthersContext();
  const signer = ethersContext.signer;
  const userAddress = ethersContext.account ?? '';
  const abi = injectableAbis?.MultiSigSafe;

  const multiSigSafeRaw: any | undefined =
    abi &&
    props.contract &&
    (new BaseContract(props.contract.address, abi, asEthersAdaptor(ethersContext).provider) as any);
  const multiSigSafe = signer ? multiSigSafeRaw?.connect(signer) : multiSigSafeRaw;

  const { transactions: multiSigTxs, initializing: initializingTxs } = useMultiSigTransactions(multiSigSafe);

  const scaffoldAppProviders = useScaffoldAppProviders();
  const injectedProvider = scaffoldAppProviders.localAdaptor;

  const owners = props.contract?.owners;
  const confirmationsRequired = props.contract?.confirmationsRequired;
  const [balance] = useBalance(props.contract?.address);

  const isSelfOwnerOfContract = !!props.contract && !!userAddress && props.contract.owners.includes(userAddress);
  const isSelfCreatorOfContract = props.contract?.creator === userAddress;
  const uncertain = !!injectedProvider ? !(props.contract && userAddress) : !props.contract;
  const userStatusDisplay = !uncertain && (
    <UserStatus isSelfCreator={isSelfCreatorOfContract} isSelfOwner={isSelfOwnerOfContract} idx={props.contract?.idx} />
  );

  const msWalletContext = {
    multiSigSafe,
    owners,
    confirmationsRequired,
    msTransactions: multiSigTxs,
    balance,
  };

  const ready = !!props.contract && multiSigSafe && owners && confirmationsRequired && !initializingTxs && multiSigTxs;

  return ready ? (
    <MsSafeContext.Provider value={msWalletContext}>
      <MultiSigDisplay userStatusDisplay={userStatusDisplay} />
    </MsSafeContext.Provider>
  ) : (
    <div style={{ margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
      <Spin size="large" />
    </div>
  );
};

export interface IMultiSigDisplayProps {
  userStatusDisplay: any;
}

const MultiSigDisplay: FC<IMultiSigDisplayProps> = (props) => {
  const { ethPrice } = useContext(InnerAppContext);
  const { owners, confirmationsRequired, balance, multiSigSafe } = useContext(MsSafeContext);
  const { widthAboveMsTxDetailsFit, widthAboveUserStatusDisplayFit } = useContext(LayoutContext);
  const labelStyle = {
    fontSize: '0.875rem',
    // color: 'hsl(0, 0%, 40%)',
    flexShrink: 0,
    color: '#111111',
  };
  const balanceWrapperStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    height: '1.875rem',
    alignItems: 'center',
  };

  return (
    <div style={{ maxWidth: '100%', height: '100%' }} className="MultiSig">
      <div
        style={{
          margin: '0 auto',
          height: '100%',
          overflow: 'auto',
          background: cardGradientVert,
          padding: '1rem 1rem 6rem',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'space-between',
            }}>
            <div
              style={{
                width: '100%',
                maxWidth: widthAboveUserStatusDisplayFit ? `${msSafeColWidthRem * 2 + msSafeColGapRem}rem` : '100%',
                margin: '0 auto 2rem',
              }}>
              {props.userStatusDisplay}
            </div>
            <div
              style={{
                display: 'flex',
                gap: `${msSafeColGapRem}rem`,
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: '0 0 2rem',
              }}
              className="WalletOverview">
              <div
                style={{
                  width: `${msSafeColWidthRem}rem`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '1rem',
                }}>
                <Descriptions bordered size="small" style={{ width: '100%' }}>
                  <Descriptions.Item label={<span style={labelStyle}>{'Balance'}</span>} span={6}>
                    <div style={{ ...balanceWrapperStyle, opacity: 0.8 }}>
                      <Balance
                        balance={balance}
                        etherMode
                        padding={0}
                        customColor={primaryColor}
                        price={ethPrice}
                        fontSize={remToPx(1.25)}
                      />
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <div
                  style={{
                    height: 38,
                    border: softBorder,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Address fontSize={18} address={multiSigSafe?.address} />
                </div>

                <div
                  style={{
                    // flex: 1,
                    alignSelf: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: softBorder,
                  }}>
                  <QR
                    value={multiSigSafe ? multiSigSafe.address : ''}
                    size={180}
                    level="H"
                    includeMargin
                    renderAs="svg"
                    imageSettings={{ excavate: false, src: '' }}
                  />
                </div>
              </div>
              <div
                style={{
                  width: `${msSafeColWidthRem}rem`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '1rem',
                }}>
                <Descriptions bordered size="small" style={{ width: '100%' }}>
                  <Descriptions.Item
                    label={<div style={{ ...labelStyle, width: '6rem' }}>{'Confirmations'}</div>}
                    span={6}>
                    <div style={{ ...balanceWrapperStyle, justifyContent: 'center' }}>
                      <Requirements />
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <Descriptions bordered size="small" style={{ width: '100%' }}>
                  <Descriptions.Item label={<div style={{ ...labelStyle, width: '6rem' }}>{'Owners'}</div>} span={6}>
                    <div
                      style={{ ...balanceWrapperStyle, justifyContent: 'flex-end', fontSize: '1rem' }}
                      className="mono-nice">
                      {owners?.length}
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                <div
                  style={{
                    flex: 1,
                    maxHeight: '16rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    border: softBorder2,
                    // background: swapGradient,
                    background: cardGradient,
                    padding: '0.5rem 0',
                  }}>
                  <div style={{ height: '100%' }}>
                    <Owners />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: widthAboveMsTxDetailsFit ? `${mainColWidthRem}rem` : '100%',
                margin: 'auto',
              }}>
              <Divider>TRANSACTIONS</Divider>
            </div>
            <MSTransactionsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
