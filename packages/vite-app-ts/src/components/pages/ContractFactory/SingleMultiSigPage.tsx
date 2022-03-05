import { CodeSandboxOutlined, FileUnknownOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Spin, Typography } from 'antd';
import React, { FC, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import { MultiSig } from '~~/components/MultiSig/MultiSig';
import { InnerAppContext } from '~~/MainPage';
import { mediumButtonMinWidth, softTextColor } from '~~/styles/styles';
import NaviMultiSigs from './NaviMultiSigs';
const { Title } = Typography;

const SingleMultiSigPage: FC = () => {
  const { injectableAbis, createdContracts, numCreatedContracts } = useContext(InnerAppContext);
  const { idx } = useParams();

  const contract = createdContracts && createdContracts.find((c) => c.idx.toString() === idx);

  if (!contract) {
    const doesntExist =
      typeof numCreatedContracts !== 'undefined' && typeof idx !== 'undefined' && +idx >= numCreatedContracts;
    return (
      <div
        style={{
          height: '50vh',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}>
        {doesntExist && (
          <>
            <div style={{ color: softTextColor, fontSize: '1.25rem' }}>
              <FileUnknownOutlined /> This vault doesn't exist
            </div>
            <Link to="/">
              <Button style={{ minWidth: mediumButtonMinWidth }} size="large" className="flex-center-imp">
                <HomeOutlined />
                My Vaults
              </Button>
            </Link>
          </>
        )}
        {!doesntExist && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
            }}>
            <Spin size="large" />
            <div style={{ color: softTextColor, fontSize: '1.25rem' }}>Connecting to Vault Contract...</div>
          </div>
        )}
      </div>
    );
  }

  const naviItems = (
    <Link to="/">
      <Button style={{ minWidth: mediumButtonMinWidth }} size="large" className="flex-center-imp">
        <HomeOutlined />
        My Vaults
      </Button>
    </Link>
  );

  const pageTitle = <CodeSandboxOutlined />;

  const viewTitle = (
    <Title
      level={2}
      style={{
        fontWeight: 400,
        height: '2rem',
        transform: 'translateY(-3px)',
        color: softTextColor,
        margin: '0',
      }}>
      {contract.name}
    </Title>
  );

  const viewDivider = <Divider style={{ margin: '1rem 0 1rem' }}>{viewTitle ?? ''}</Divider>;

  const viewContent = contract && injectableAbis && (
    <div style={{ alignSelf: 'stretch', flex: 1, overflow: 'hidden' }}>
      <MultiSig contract={contract} />
    </div>
  );

  return (
    <NaviMultiSigs naviItems={naviItems} pageTitle={pageTitle} viewDivider={viewDivider} viewContent={viewContent} />
  );
};
export default SingleMultiSigPage;
