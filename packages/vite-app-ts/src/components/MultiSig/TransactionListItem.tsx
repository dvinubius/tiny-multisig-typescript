import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import MSTransactionOverview from './MSTransactionOverview';
import { MsSafeContext } from './MultiSig';
import {
  detailsHeightLarge,
  detailsHeightNarrow,
  mediumBorder,
  mediumButtonMinWidth,
  pinkAccentBorder,
  swapGradientSimple,
} from '~~/styles/styles';
import { ArrowsAltOutlined, LoginOutlined } from '@ant-design/icons';
import { useEthersContext } from 'eth-hooks/context';
import { LayoutContext } from '~~/MainPage';
import { MSTransactionModel } from './models/ms-transaction.model';
import MSTransactionDetails from './MSTransactionDetails';

export interface ITransactionListItemProps {
  transaction: MSTransactionModel;
  onExpand?: () => void;
  expanded: boolean;
}

const TransactionListItem: FC<ITransactionListItemProps> = function (props) {
  const ethersContext = useEthersContext();
  const userAddress = ethersContext.account;
  const { owners } = useContext(MsSafeContext);
  const { widthAboveMsTxDetailsFit } = useContext(LayoutContext);

  const detailsHeight = widthAboveMsTxDetailsFit ? detailsHeightNarrow : detailsHeightLarge;

  const isSelfOwner = !!userAddress && owners?.includes(userAddress);

  return (
    <div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          // backgroundColor: "white",
          background: swapGradientSimple,
          borderRadius: '.25rem',
          padding: '1rem',

          // border: pinkAccentBorder,
          border: mediumBorder,
        }}
        className="MultiSigTxItem">
        <MSTransactionOverview transaction={props.transaction} />
        {!props.transaction.executed && (
          <>
            {!props.expanded && (
              <Button
                size="large"
                className="flex-center-imp"
                onClick={() => props.onExpand?.()}
                style={{ width: mediumButtonMinWidth, alignSelf: 'flex-end', marginTop: '1rem' }}>
                {/* {isSelfOwner ? "Manage" : "Details"} <ArrowsAltOutlined /> */}
                {isSelfOwner ? 'Manage' : 'Details'} <LoginOutlined />
              </Button>
            )}

            <div
              style={{
                maxHeight: detailsHeight,
                overflow: 'hidden',
                transition: 'all 0.3s ease-out',
              }}>
              {props.expanded && (
                <>
                  <Divider style={{ margin: '1rem 0' }} />
                  <MSTransactionDetails transaction={props.transaction} isSelfOwner={isSelfOwner ?? false} />
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Divider />
    </div>
  );
};
export default TransactionListItem;
