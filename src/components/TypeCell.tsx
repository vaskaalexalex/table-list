/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react';
import IncomingIcon from '@icons/incoming.svg?react';
import OutgoingIcon from '@icons/outgoing.svg?react';


const TypeCell: FC<{ isIncoming: boolean }> = ({ isIncoming }) => {

  if (isIncoming) {
    return <IncomingIcon />;
  }

  return (
    <OutgoingIcon />
  );
};

export { TypeCell };