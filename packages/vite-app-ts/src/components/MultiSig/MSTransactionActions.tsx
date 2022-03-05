import React, { FC, useContext, useState } from 'react';
import { RollbackOutlined, SendOutlined, SmileOutlined, WarningOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { MsVaultContext } from './MultiSig';
import { errorColor, softBorder, cardGradientGrey } from '~~/styles/styles';
import { MSTransactionModel } from './models/ms-transaction.model';
import { InnerAppContext } from '~~/MainPage';

export interface IMSTransactionActions {
  transaction: MSTransactionModel;
  canConfirm: boolean;
  canExecute: boolean;
  canRevoke: boolean;
  multiSigVault: any;
}

const MSTransactionActions: FC<IMSTransactionActions> = (props) => {
  const { tx } = useContext(InnerAppContext);
  const { balance, multiSigVault } = useContext(MsVaultContext);

  const [pendingActionConfirm, setPendingActionConfirm] = useState<boolean>(false);
  const [pendingActionRevoke, setPendingActionRevoke] = useState<boolean>(false);
  const [pendingActionExecute, setPendingActionExecute] = useState<boolean>(false);

  const confirmTx = () => {
    setPendingActionConfirm(true);
    const confTx = props.multiSigVault.confirmTransaction(props.transaction.idx);
    tx?.(confTx, (update) => {
      if (update && (update.error || update.reason)) {
        setPendingActionConfirm(false);
      }
      if (update && (update.status === 'confirmed' || update.status === 1)) {
        setPendingActionConfirm(false);
      }
      if (update && update.code) {
        // metamask error
        // may be that user denied transaction, but also actual errors
        // handle them particularly if you need to
        // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
        setPendingActionConfirm(false);
      }
    });
  };

  const executeTx = () => {
    setPendingActionExecute(true);
    const execTx = multiSigVault.executeTransaction(props.transaction.idx);
    tx?.(execTx, (update) => {
      if (update && (update.error || update.reason)) {
        setPendingActionExecute(false);
      }
      if (update && (update.status === 'confirmed' || update.status === 1)) {
        setPendingActionExecute(false);
      }
      if (update && update.code) {
        // metamask error
        // may be that user denied transaction, but also actual errors
        // handle them particularly if you need to
        // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
        setPendingActionExecute(false);
      }
    });
  };

  const revokeTx = () => {
    setPendingActionRevoke(true);
    const revokeTx = multiSigVault.revokeConfirmation(props.transaction.idx);
    tx?.(revokeTx, (update) => {
      if (update && (update.error || update.reason)) {
        setPendingActionRevoke(false);
      }
      if (update && (update.status === 'confirmed' || update.status === 1)) {
        setPendingActionRevoke(false);
      }
      if (update && update.code) {
        // metamask error
        // may be that user denied transaction, but also actual errors
        // handle them particularly if you need to
        // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
        setPendingActionRevoke(false);
      }
    });
  };

  const insufficientFunds = !!balance && props.transaction.value.gt(balance);

  const actionButtonWith = (
    text: string,
    action: () => void,
    icon: any,
    pendingAction: boolean,
    type: 'primary' | 'link' | 'text' | 'ghost' | 'default' | 'dashed' | undefined,
    disabled = false
  ) => (
    <Button
      size="large"
      className="inline-flex-center-imp"
      type={type}
      onClick={action}
      style={{ minWidth: '8rem' }}
      loading={pendingAction}
      disabled={disabled}>
      {text}
      {icon}
    </Button>
  );
  const positiveActionButton = props.canConfirm
    ? actionButtonWith('Confirm', confirmTx, <SmileOutlined />, pendingActionConfirm, 'primary')
    : props.canExecute
    ? actionButtonWith('Execute', executeTx, <SendOutlined />, pendingActionExecute, 'primary', insufficientFunds)
    : '';

  const revokeButton = props.canRevoke
    ? actionButtonWith('Revoke', revokeTx, <RollbackOutlined />, pendingActionRevoke, 'default')
    : '';

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
        <div style={{ flex: '1', display: 'flex', justifyContent: revokeButton ? 'space-between' : 'flex-end' }}>
          {revokeButton}
          {positiveActionButton}
        </div>
      </div>
      {insufficientFunds && (
        <div
          style={{
            marginTop: '1rem',
            // color: canExecute ? errorColor : softTextColor,
            color: errorColor,

            // background: dialogOverlayGradient,
            background: cardGradientGrey,
            padding: '0.5rem',
            border: softBorder,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
          <WarningOutlined /> Insufficient funds for the transaction
        </div>
      )}
    </div>
  );
};

export default MSTransactionActions;
