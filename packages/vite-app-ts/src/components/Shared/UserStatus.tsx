import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Popover, Typography } from 'antd';
import { FC, useState } from 'react';
import { APP_URL } from '~~/config/appConfig';

import { primaryColor, softBorder, softTextColor, swapGradient } from '~~/styles/styles';
import OwnerMark from './OwnerMark';

export interface IUserStatusProps {
  isSelfOwner?: boolean;
  isSelfCreator?: boolean;
  idx?: number;
}

const UserStatus: FC<IUserStatusProps> = (props) => {
  const onCopy = () => {
    navigator.clipboard.writeText(`${APP_URL}/vault/${props.idx}`);
    setTimeout(() => setCopyVisible(false), 1500);
  };
  const handleVisibleChange = (v: boolean) => setCopyVisible(v);

  const [copyVisible, setCopyVisible] = useState<boolean>(false);
  const copyLink = props.isSelfCreator && (
    <Popover
      content="Copied!"
      trigger="click"
      placement="left"
      visible={copyVisible}
      onVisibleChange={handleVisibleChange}>
      <Button size="small" onClick={onCopy} className="inline-flex-center-imp">
        Copy Link <ShareAltOutlined style={{ width: '1.25rem', margin: 0 }} />
      </Button>
    </Popover>
  );

  const keywordColor = 'deeppink';
  const ownerText = props.isSelfOwner && (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <span>
        You <span style={{ color: keywordColor }}>co-own</span> this vault.
      </span>
      <div style={{ marginLeft: '0.5rem' }}>
        <OwnerMark />
      </div>
    </div>
  );

  const creatorText = props.isSelfCreator && (
    <span>
      You <span style={{ color: keywordColor }}>created</span> this vault.
    </span>
  );

  const viewerText = !props.isSelfOwner && !props.isSelfCreator && <>You are not an owner of this vault.</>;

  const message = (
    <div
      style={{
        fontWeight: 400,
        fontSize: '1rem',
        color: softTextColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
      {creatorText}
      {ownerText}
      {viewerText}
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        minHeight: 40,

        display: 'flex',
        alignItems: 'center',
        // justifyContent: "flex-start",
        // justifyContent: "center",
        justifyContent: 'space-between',
        background: swapGradient,
        gap: '1rem',
        padding: '0.5rem 1rem',
        border: softBorder,
      }}>
      {message}
      {copyLink}
    </div>
  );
};
export default UserStatus;
