import React, { FC, useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import '~~/styles/main-page.css';
import { useContractReader, useEthersAdaptorFromProviderOrSigners, useGasPrice } from 'eth-hooks';
import { useDexEthPrice } from 'eth-hooks/dapps';

import { useEventListener } from 'eth-hooks';
import { MainPageContracts, MainPageFooter, MainPageHeader } from './components/main';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useEthersContext } from 'eth-hooks/context';
import { useAppContracts, useConnectAppContracts, useLoadAppContracts } from '~~/config/contractContext';
import { asEthersAdaptor } from 'eth-hooks/functions';
import { MSVaultEntity } from './models/contractFactory/ms-vault-entity.model';
import { loadNonDeployedContractAbi } from './functions/loadNonDeployedAbis';
import { InjectableAbis } from './generated/injectable-abis/injectable-abis.type';
import { useWindowWidth } from '@react-hook/window-size';

export interface InnerAppContext {
  injectableAbis?: InjectableAbis;
  createdContracts?: MSVaultEntity[];
  numCreatedContracts?: number;
  ethPrice?: number;
  gasPrice?: number;
  tx?: TTransactorFunc;
}
export const InnerAppContext = createContext<InnerAppContext>({});

export interface ILayoutContext {
  windowWidth: number | undefined;
  widthAboveMsFit: boolean | undefined;
  widthAboveMsTxDetailsFit: boolean | undefined;
  widthAboveUserStatusDisplayFit: boolean | undefined;
}

export const LayoutContext = createContext<ILayoutContext>({
  windowWidth: 0,
  widthAboveMsFit: false,
  widthAboveMsTxDetailsFit: false,
  widthAboveUserStatusDisplayFit: false,
});

import { transactor } from '~~/eth-components/functions';
import { EthComponentsSettingsContext } from '~~/eth-components/models';
import {
  breakPointMsFit,
  breakPointMsTxDetailsFit,
  breakPointUserStatusDisplayFit,
  softTextColor,
} from './styles/styles';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import MultiSigsPage from './components/pages/ContractFactory/MultiSigsPage';
import SingleMultiSigPage from './components/pages/ContractFactory/SingleMultiSigPage';
import { BigNumber } from '@ethersproject/bignumber';
import { TTransactorFunc } from './eth-components/functions/transactor';
import { USE_BURNER_FALLBACK, MAINNET_PROVIDER } from '~~/config/appConfig';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See config/appConfig.ts for configuration, such as TARGET_NETWORK
 * See MainPageContracts.tsx for your contracts component
 * See contractsConnectorConfig.ts for how to configure your contracts
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * For more
 */

/**
 * The main component
 * @returns
 */
export const Main: FC = () => {
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, USE_BURNER_FALLBACK);

  // -----------------------------
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersContext));

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  // init contracts
  const factory = useAppContracts('MSFactory', ethersContext.chainId);

  // ** 📟 Listen for broadcast events
  const [createMultiSigVaultEvents] = useEventListener(factory, 'CreateMultiSigVault', 0);
  console.log('📟 CreateMultiSigVault events:', createMultiSigVaultEvents);
  const [createdContracts, setCreatedContracts] = useState<MSVaultEntity[]>();
  const account = ethersContext.account;
  useEffect(() => {
    if (!createdContracts || createdContracts.length !== createMultiSigVaultEvents.length) {
      setCreatedContracts(
        createMultiSigVaultEvents
          .map((event) => ({
            idx: event.args[0].toNumber(),
            address: event.args[1],
            creator: event.args[2],
            name: event.args[3],
            time: new Date(event.args[4].toNumber() * 1000),
            owners: event.args[5],
            confirmationsRequired: event.args[6].toNumber(),
          }))
          .reverse() // most recent first
      );
    }
  }, [createMultiSigVaultEvents, account]);

  const [numCreated] = useContractReader(
    factory,
    factory?.numberOfContracts,
    [],
    factory?.filters.CreateMultiSigVault()
  );

  const [injectableAbis, setInjectableAbis] = useState<InjectableAbis>();
  useEffect(() => {
    const load = async () => {
      const MultiSigVault = await loadNonDeployedContractAbi('MultiSigVault');
      if (MultiSigVault) {
        setInjectableAbis({ MultiSigVault });
      } else {
        console.error(`Could not find injectable abi for MultiSigVault`);
      }
    };
    load();
  }, []);

  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const innerAppContext = {
    injectableAbis,
    createdContracts,
    numCreatedContracts: numCreated?.toNumber(),
    tx,
    gasPrice,
    ethPrice,
  };
  const windowWidth = useWindowWidth();
  const layoutContext = {
    windowWidth,
    widthAboveMsFit: windowWidth >= breakPointMsFit,
    widthAboveMsTxDetailsFit: windowWidth >= breakPointMsTxDetailsFit,
    widthAboveUserStatusDisplayFit: windowWidth >= breakPointUserStatusDisplayFit,
  };

  console.log('test');

  return (
    <LayoutContext.Provider value={layoutContext}>
      <InnerAppContext.Provider value={innerAppContext}>
        <div className="App">
          <BrowserRouter>
            <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />

            {/* Routes should be added between the <Switch> </Switch> as seen below */}

            <Link to="/contracts">
              <Button
                type="default"
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  boxShadow: '0 3px 5px 1px #eaeaea',
                  zIndex: 10,
                }}>
                <div style={{ fontSize: '1rem', color: softTextColor }}>
                  <span style={{ marginRight: '0.75rem', fontSize: '0.875rem' }}>🛠</span>Debug
                </div>
              </Button>
            </Link>

            <div className="AppScroller">
              <Routes>
                <Route
                  path="/myvaults/:idx"
                  element={
                    <div className="AppCenteredCol">
                      <MultiSigsPage />
                    </div>
                  }
                />
                <Route
                  path="/myvaults"
                  element={
                    <div className="AppCenteredCol">
                      <MultiSigsPage />
                    </div>
                  }
                />
                <Route path="/" element={<Navigate replace to="/myvaults" />} />
                <Route path="/vault/:idx" element={<SingleMultiSigPage />} />
                <Route
                  path="/contracts"
                  element={
                    <div className="AppCenteredCol">
                      <MainPageContracts scaffoldAppProviders={scaffoldAppProviders} />
                    </div>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>

          <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
        </div>
      </InnerAppContext.Provider>
    </LayoutContext.Provider>
  );
};
