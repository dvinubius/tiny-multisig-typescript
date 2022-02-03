import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin } from 'antd';
import React, { FC, useContext, useState } from 'react';
import { AddressInput, EtherInput } from '~~/eth-components/ant';
import { InnerAppContext } from '~~/MainPage';
import Asterisk from '../Shared/Asterisk';
import createModalFooter from '../Shared/createModalFooter';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import CreateModalSentOverlay from '../Shared/CreateModalSentOverlay';
import './CreateMsTx.css';
import { MsSafeContext } from './MultiSig';
import BytesInput from '../Shared/BytesInput';
import { ethers } from 'ethers';

const CreateMsTx: FC = () => {
  const { multiSigSafe } = useContext(MsSafeContext);
  const { ethPrice, tx } = useContext(InnerAppContext);
  const scaffoldAppProviders = useScaffoldAppProviders();

  const [visibleModal, setVisibleModal] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [txSent, setTxSent] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const resetMeself = () => {
    setPendingCreate(false);
    setTxSent(false);
    setTxError(false);
    setTxSuccess(false);
    form.resetFields();
  };

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setPendingCreate(true);
      const to = form.getFieldValue('to');
      const value = ethers.utils.parseEther(form.getFieldValue('value'));
      const data = form.getFieldValue('data') ?? '0x';
      const transaction = multiSigSafe?.submitTransaction(to, value, data);
      setTxError(false);
      tx?.(transaction, (update) => {
        if (update && (update.error || update.reason)) {
          setPendingCreate(false);
          setTxError(true);
        }
        if (update && (update.status === 'confirmed' || update.status === 1)) {
          setPendingCreate(false);
          setTxSuccess(true);
        }
        if (update && update.code) {
          // metamask error
          // may be that user denied transaction, but also actual errors
          // handle them particularly if you need to
          // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
          setPendingCreate(false);
          setTxSent(false);
        }
      });
      setTxSent(true);
    } catch (e) {
      // error messages will appear in form
      console.log('SUBMIT FAILED: ', e);
    }
  };

  const handleCancel = () => {
    setVisibleModal(false);
    resetMeself();
  };

  const handleRetry = () => {
    setTxError(false);
    setTxSent(false);
  };

  const formSize = 'middle';
  const labelWidthRem = 5;
  const inputWidthRem = 18;
  const labelFontSize = '0.875rem';

  return (
    <div>
      <Button
        type="primary"
        size="large"
        className="flex-center-imp"
        onClick={() => setVisibleModal(true)}
        style={{ width: '7rem' }}>
        <PlusOutlined />
        New
      </Button>

      <Modal
        destroyOnClose={true}
        title="Create a MultiSig Transaction"
        style={{ top: 120 }}
        width="30rem"
        visible={visibleModal}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={createModalFooter({
          txSent,
          txError,
          txSuccess,
          pendingCreate,
          handleCancel,
          handleRetry,
          handleSubmit,
        })}>
        {txSent && (
          <CreateModalSentOverlay
            txError={txError}
            txSuccess={txSuccess}
            pendingText="Creating Transaction"
            successText="Transaction Created!"
            errorText="Failed"
          />
        )}
        <Form
          size={formSize}
          form={form}
          style={{
            pointerEvents: txSent ? 'none' : 'all',
          }}
          className="CreateMsTx">
          <Form.Item
            label={
              <span style={{ fontSize: labelFontSize, width: `${labelWidthRem}rem` }}>
                To
                <Asterisk />
              </span>
            }
            name="to"
            rules={[
              { required: true, message: 'Please input a recipient' },
              {
                validator: (_, value) =>
                  ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject(new Error('Bad format')),
              },
            ]}>
            <AddressInput
              ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              placeholder="Enter recipient"
              address={form.getFieldValue('to')}
              wrapperStyle={{ width: `${inputWidthRem}rem` }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontSize: labelFontSize, width: `${labelWidthRem}rem` }}>
                Value
                <Asterisk />
              </span>
            }
            name="value"
            rules={[{ required: true, message: 'Please enter a value' }]}>
            <EtherInput
              etherMode
              price={ethPrice}
              wrapperStyle={{ width: `${inputWidthRem}rem` }}
              placeholder="Enter value"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: labelFontSize, width: `${labelWidthRem}rem` }}>Data 0x</span>}
            name="data"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length <= 2) {
                    return Promise.resolve();
                  }

                  let noPrefix = value.toString().substr(2);
                  if (noPrefix.length % 2 !== 0) {
                    return Promise.reject(new Error('Bad format - odd number of characters'));
                  }

                  const regexp = /^[0-9a-fA-F]+$/;
                  if (regexp.test(noPrefix)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('Bad format - invalid characters'));
                  }
                },
              },
            ]}>
            <BytesInput
              wrapperStyle={{ width: `${inputWidthRem}rem`, fontSize: '0.75rem' }}
              placeholder="Enter transaction data"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateMsTx;
