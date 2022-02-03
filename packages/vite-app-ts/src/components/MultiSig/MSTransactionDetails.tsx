import { Descriptions, Spin, Divider } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  breakPointMsTxDetailsFit,
  nestedCardBGLight,
  softBorder2,
  primaryColor,
  softTextColor,
  swapGradient,
  cardGradient,
} from '~~/styles/styles';
import MSTransactionActions from './MSTransactionActions';
import { contentWrapperStyle, labelStyle } from './MSTransactionStyles';
import { MsSafeContext } from './MultiSig';
import Owners from './Owners';
import { MSTransactionModel } from './models/ms-transaction.model';
import { useEthersContext } from 'eth-hooks/context';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { LayoutContext } from '~~/MainPage';
import { useBlockNumber } from 'eth-hooks';

export interface IMSTransactionDetailsProps {
  transaction: MSTransactionModel;
  isSelfOwner: boolean;
}

const MSTransactionDetails: FC<IMSTransactionDetailsProps> = (props) => {
  const { transaction } = props;

  const ethersContext = useEthersContext();
  const userAddress = ethersContext.account;
  const { widthAboveMsTxDetailsFit } = useContext(LayoutContext);

  const { owners, confirmationsRequired: totalConfsNeeded, multiSigSafe } = useContext(MsSafeContext);

  // CONFIRMATIONS

  const [confirmations, setConfirmations] = useState<boolean[]>();
  const [currentNumConfirmations, setCurrentNumConfirmations] = useState<number>();
  const updateConfirmations = async () => {
    if (!owners) return;
    const confProms = owners.map((o) => multiSigSafe.isConfirmed(transaction.idx, o));
    const confs = await Promise.all(confProms);
    setConfirmations(confs);
    setCurrentNumConfirmations(confs.filter((c) => c).length);
  };
  useEffect(() => {
    updateConfirmations();
  }, []);

  const scaffoldAppProviders = useScaffoldAppProviders();
  useBlockNumber(scaffoldAppProviders.localAdaptor?.provider, (blockNumber) => updateConfirmations());

  // POSSIBLE USER ACTIONS

  const canExecute =
    !transaction.executed &&
    !!currentNumConfirmations &&
    currentNumConfirmations.toString() === totalConfsNeeded?.toString();
  const [canConfirm, setCanConfirm] = useState<boolean>();
  const [canRevoke, setCanRevoke] = useState<boolean>();

  const updateActions = async () => {
    const hasConfirmedSelf = !props.isSelfOwner ? false : await multiSigSafe.isConfirmed(transaction.idx, userAddress);

    if (!props.isSelfOwner || transaction.executed) {
      setCanConfirm(false);
      setCanRevoke(false);
      return;
    }

    if (canExecute) {
      setCanConfirm(false); // possible but not necessary, so don't allow
      setCanRevoke(hasConfirmedSelf);
      return;
    }

    // !canExecute
    if (hasConfirmedSelf) {
      setCanConfirm(false);
      setCanRevoke(true);
    } else {
      setCanConfirm(true);
      setCanRevoke(false);
    }
  };
  useEffect(() => {
    updateActions();
  }, [transaction]);

  useBlockNumber(scaffoldAppProviders.localAdaptor?.provider, (blockNumber) => updateActions());

  const confsAvailable = typeof currentNumConfirmations !== 'undefined';

  const confirmationsItem = {
    label: 'Confirmations',
    content: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-end',
          gap: '1rem',
        }}>
        <div
          style={{
            fontSize: '1rem',
            padding: '0 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <div>
            {confsAvailable && (
              <span style={{ color: primaryColor, fontWeight: 500 }} className="mono-nice">
                {currentNumConfirmations}{' '}
              </span>
            )}
            {!confsAvailable && <Spin size="small"></Spin>}
            <span style={{ color: softTextColor }}>
              {' '}
              (requires <span className="mono-nice">{totalConfsNeeded}</span>){' '}
            </span>
          </div>
        </div>
      </div>
    ),
  };

  const ownersPart = (
    <div
      style={{
        flex: '1',
        minWidth: '21rem',
        maxHeight: '16rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowY: 'hidden',
        border: softBorder2,
        // background: swapGradient,
        background: cardGradient,
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '40px',
          minHeight: '40px',
          alignItems: 'center',
          // fontSize: "1rem",
          padding: '0 2rem',
        }}>
        <div style={{ marginTop: '0.5rem' }}>Owner </div>
        <div style={{ marginTop: '0.5rem' }}>Confirmed</div>
      </div>
      <Divider style={{ marginTop: 0, marginBottom: '0.5rem' }} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Owners confirmations={confirmations} />
      </div>
    </div>
  );

  const actionsPart = (
    <div style={{ flex: '1', minWidth: '21rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Descriptions bordered size="small" style={{ width: '100%' }}>
        <Descriptions.Item label={<span style={labelStyle}>{confirmationsItem.label}</span>} span={6}>
          <div style={{ ...contentWrapperStyle }}>{confirmationsItem.content}</div>
        </Descriptions.Item>
      </Descriptions>
      {props.isSelfOwner && (
        <MSTransactionActions
          transaction={transaction}
          multiSigSafe={multiSigSafe}
          canConfirm={canConfirm ?? false}
          canExecute={canExecute ?? false}
          canRevoke={canRevoke ?? false}
        />
      )}
    </div>
  );

  const children = widthAboveMsTxDetailsFit ? [ownersPart, actionsPart] : [actionsPart, ownersPart];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
      {children.map((c) => c)}
    </div>
  );
};
export default MSTransactionDetails;
