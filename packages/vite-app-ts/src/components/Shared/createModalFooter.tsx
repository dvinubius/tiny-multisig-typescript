import { Button } from 'antd';
import { mediumButtonMinWidth } from '~~/styles/styles';

export interface ICreateModalFooterArgs {
  txSent: boolean;
  txError: boolean;
  txSuccess: boolean;
  pendingCreate: boolean;
  handleCancel: () => void;
  handleRetry: () => void;
  handleSubmit: () => void;
}

const createModalFooter = (props: ICreateModalFooterArgs) => {
  return props.txSent
    ? [
        <Button key={1} type="default" style={{ minWidth: mediumButtonMinWidth }} onClick={props.handleCancel}>
          {props.txSuccess ? 'Thanks' : 'Close'}
        </Button>,
        props.txError && (
          <Button key={2} type="primary" style={{ minWidth: mediumButtonMinWidth }} onClick={props.handleRetry}>
            Retry
          </Button>
        ),
      ]
    : [
        <Button key={1} type="default" style={{ minWidth: mediumButtonMinWidth }} onClick={props.handleCancel}>
          Cancel
        </Button>,
        <Button
          key={2}
          type="primary"
          style={{ minWidth: mediumButtonMinWidth }}
          loading={props.pendingCreate}
          onClick={props.handleSubmit}>
          Submit
        </Button>,
      ];
};

export default createModalFooter;
