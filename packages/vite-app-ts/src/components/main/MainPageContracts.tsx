import React, { FC, useContext, useState } from 'react';
import { GenericContract } from '~~/eth-components/ant/generic-contract';
import { BaseContract, Contract } from 'ethers';
import { useContractLoader } from 'eth-hooks';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import { useAppContracts } from '~~/config/contractContext';
import { Button, Divider } from 'antd';
import { MSSafeEntity } from '../../models/contractFactory/ms-safe-entity.model';
import { LeftOutlined } from '@ant-design/icons';
import { mediumButtonMinWidth } from '~~/styles/styles';
import { InnerAppContext } from '~~/MainPage';
import ContractDebugHeader from '../common/ContractDebugHeader';
import { asEthersAdaptor } from 'eth-hooks/functions';
export interface IMainPageContractsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContractsProps> = (props) => {
  const ethersContext = useEthersContext();
  const multiSigFactory = useAppContracts('MSFactory', ethersContext.chainId);

  const signer = ethersContext.signer;

  const { injectableAbis, createdContracts } = useContext(InnerAppContext);
  const abi = injectableAbis?.MultiSigSafe;

  const [openedDebugContract, setOpenedDebugContract] = useState<{
    multiSigSafe: BaseContract;
    entity: MSSafeEntity;
  }>();
  const handleBack = () => setOpenedDebugContract(undefined);

  if (ethersContext.account == null) {
    return <></>;
  }

  return (
    <div
      style={{ width: '70vw', padding: '2rem 0 6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <GenericContract
        contractName="MSFactory"
        contract={multiSigFactory}
        mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
      />
      <Divider style={{ margin: '3rem 0 0' }}>
        <span style={{ fontSize: '1.5rem' }}>Created Contracts</span>
      </Divider>
      <div style={{ alignSelf: 'stretch' }}>
        {/* HEAD SECTION */}
        <div style={{ height: '14rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '6rem',
            }}>
            🏗
          </div>
          {openedDebugContract && (
            <Button className="flex-center-imp" style={{ minWidth: mediumButtonMinWidth }} onClick={handleBack}>
              <LeftOutlined /> Back
            </Button>
          )}
        </div>
      </div>

      {createdContracts && injectableAbis && (
        <>
          {/* OPENED ONE */}
          {openedDebugContract && (
            <div>
              <ContractDebugHeader contract={openedDebugContract.entity} />
              <GenericContract
                contractName="YourContract"
                contract={openedDebugContract.multiSigSafe}
                key={openedDebugContract.entity.address}
                mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
                blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
                padding={0}
              />
            </div>
          )}
          {/* LIST */}
          {!openedDebugContract && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {createdContracts.map((createdContract: MSSafeEntity) => {
                const multiSigSafeRaw: any | undefined =
                  abi &&
                  (new BaseContract(createdContract.address, abi, asEthersAdaptor(ethersContext).provider) as any);
                const multiSigSafe = signer ? multiSigSafeRaw?.connect(signer) : multiSigSafeRaw;

                const handleOpen = () =>
                  setOpenedDebugContract({
                    multiSigSafe,
                    entity: createdContract,
                  });
                return (
                  <div className="hoverableLight" key={createdContract.address} onClick={handleOpen}>
                    <ContractDebugHeader contract={createdContract} hoverable />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <>
        {/* **********
          ❓ this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
        ********** */}
        {/* <GenericContract
          contractName="YourContract"
          contract={yourContract}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        /> */}
        <GenericContract
          contractName="YourContractFactory"
          contract={multiSigFactory}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        />

        {/* **********
         * ❓ uncomment for a second contract:
         ********** */}
        {/*
          <GenericContract
            contractName="SecondContract"
            contract={contract={contractList?.['SecondContract']}
            mainnetProvider={props.appProviders.mainnetProvider}
            blockExplorer={props.appProviders.targetNetwork.blockExplorer}
            contractConfig={props.contractConfig}
          />
        */}

        {/***********
         *  ❓ Uncomment to display and interact with an external contract (DAI on mainnet):
         ********** */}
        {/* {
          <GenericContract
            contractName="DAI"
            contract={mainnetDai}
            mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
            blockExplorer={NETWORKS.mainnet.blockExplorer}
          />
        } */}
      </>
    </>
  );
};
