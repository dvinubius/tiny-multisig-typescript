import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal, Spin } from 'antd';
import React, { FC, SyntheticEvent, useContext, useState } from 'react';
import { AddressInput } from '~~/eth-components/ant';
import Asterisk from '../Shared/Asterisk';
import FormError from '../Shared/FormError';
import CreateModalSentOverlay from '../Shared/CreateModalSentOverlay';
import createModalFooter from '../Shared/createModalFooter';
import { IEthersContext } from 'eth-hooks/models';
import { useEthersContext } from 'eth-hooks/context';
import { useAppContracts } from '~~/config/contractContext';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import IntegerStep from './IntegerStep';
import { InnerAppContext } from '~~/MainPage';
import { ethers } from 'ethers';

const CreateMultiSig: FC = () => {
  const ethersContext: IEthersContext = useEthersContext();
  const { tx } = useContext(InnerAppContext);

  const msFactory = useAppContracts('MSFactory', ethersContext.chainId);

  const [visibleModal, setVisibleModal] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [txSent, setTxSent] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const [name, setName] = useState('');
  const [owners, setOwners] = useState(['', '']);
  const [numConfs, setNumConfs] = useState<number | undefined>(1);

  const [nameError, setNameError] = useState('');
  const [ownersErrors, setOwnersErrors] = useState(['', '']);

  const validateFields = () => {
    let ret = true;
    if (!name) {
      setNameError('Please input a name');
      ret = false;
    }
    const newOwnersErrors = [...ownersErrors.map((e) => '')]; // reset all
    owners.forEach((owner, idx) => {
      let err;
      if (!owner) {
        err = 'Required Input';
      } else if (owners.slice(0, idx).some((o) => o === owner)) {
        err = 'Duplicate Owner';
      } else if (!ethers.utils.isAddress(owner)) {
        err = 'Bad format';
      }

      if (err) {
        newOwnersErrors.splice(idx, 1, err);
        setOwnersErrors(newOwnersErrors);
        ret = false;
      }
    });
    return ret;
  };

  const updateName = (ev: SyntheticEvent) => {
    const inputEl = ev.target as HTMLInputElement;
    setName(inputEl.value);
    if (inputEl.value) {
      setNameError('');
    }
  };

  const addOwnerField = () => {
    const newOwners = [...owners, ''];
    setOwners(newOwners);
    setOwnersErrors(newOwners.map((o) => ''));
  };

  const removeOwnerField = (idx: number) => {
    const newOwners = [...owners];
    newOwners.splice(idx, 1);
    setOwners(newOwners);
    setOwnersErrors(newOwners.map((o) => ''));
  };

  const updateOwner = (value: string, idx: number) => {
    const newOwners = [...owners];
    newOwners[idx] = value;
    setOwners(newOwners);
    const newOwnersErrors = [...ownersErrors];
    newOwnersErrors.splice(idx, 1, '');
    setOwnersErrors(newOwnersErrors);
  };

  const resetMeself = () => {
    setPendingCreate(false);
    setTxSent(false);
    setTxError(false);
    setTxSuccess(false);
    setName('');
    setNameError('');
    setOwners(['', '']);
    setOwnersErrors(['', '']);
    setNumConfs(undefined);
  };

  const handleSubmit = async () => {
    try {
      const canGo = validateFields() && !!msFactory && !!numConfs && !!tx;

      if (!canGo) {
        return;
      }
      setPendingCreate(true);
      const transaction = msFactory.createMultiSigVault(name, owners, numConfs);
      setTxError(false);
      tx(transaction, (update) => {
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

  const labelWidthRem = 5;
  const inputWidthRem = 18;
  const labelFontSize = '0.875rem';

  const modalFooter = createModalFooter({
    txSent: txSent,
    txError: txError,
    txSuccess: txSuccess,
    pendingCreate: pendingCreate,
    handleCancel: handleCancel,
    handleRetry: handleRetry,
    handleSubmit: handleSubmit,
  });

  const scaffoldAppProviders = useScaffoldAppProviders();

  return (
    <div>
      <Button type="primary" size="large" className="inline-flex-center-imp" onClick={() => setVisibleModal(true)}>
        <PlusOutlined />
        Create Vault
      </Button>

      <Modal
        destroyOnClose={true}
        title="Create MultiSig Vault"
        style={{ top: 120 }}
        visible={visibleModal}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width="30rem"
        footer={modalFooter}>
        {txSent && (
          <CreateModalSentOverlay
            txError={txError}
            txSuccess={txSuccess}
            pendingText="Creating Vault"
            successText="MultiSig Vault Created"
            errorText="Transaction Failed"
          />
        )}
        <div
          style={{
            pointerEvents: txSent ? 'none' : 'all',
          }}>
          <div style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: labelFontSize, width: `${labelWidthRem}rem`, textAlign: 'right' }}>
              Name:
              <Asterisk />
            </div>
            <Input
              type="text"
              placeholder="Name your contract"
              style={{ width: `${inputWidthRem}rem` }}
              value={name}
              onChange={updateName}
            />
          </div>
          {nameError && (
            <div style={{ marginLeft: `${labelWidthRem + 1}rem` }}>
              <FormError text={nameError} />
            </div>
          )}

          <Divider orientation="left">Owners</Divider>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {owners.map((owner, idx) => (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: labelFontSize, width: `${labelWidthRem}rem`, textAlign: 'right' }}>
                    {`Owner ${idx + 1}:`}
                    <Asterisk />
                  </div>
                  <AddressInput
                    placeholder={`Input address`}
                    address={owner}
                    ensProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
                    onChange={(v) => updateOwner(v.toString(), idx)}
                    wrapperStyle={{ width: `${inputWidthRem}rem` }}
                  />
                  {idx > 1 && (
                    <Button
                      style={{ padding: '0 0.5rem' }}
                      className="flex-center-imp"
                      danger
                      onClick={() => removeOwnerField(idx)}>
                      <DeleteOutlined />
                    </Button>
                  )}
                </div>
                {ownersErrors[idx] && (
                  <div style={{ marginLeft: `${labelWidthRem + 1}rem` }}>
                    <FormError text={ownersErrors[idx]} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              width: `${labelWidthRem + inputWidthRem + 1}rem`,
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}>
            <Button onClick={addOwnerField} className="flex-center-imp">
              <PlusOutlined />
              Add
            </Button>
          </div>

          <Divider orientation="left">Confirmations</Divider>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignSelf: 'stretch',
              paddingLeft: `${labelWidthRem + 1}rem`,
            }}>
            <IntegerStep mi={1} ma={owners.length} update={setNumConfs} sliderWidth={`13rem`} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateMultiSig;
