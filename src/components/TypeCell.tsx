/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react';
import IncomingIcon from '@icons/incoming.svg?react';
import OutgoingIcon from '@icons/outgoing.svg?react';
import styled from 'styled-components';

const TypeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center
`;


const TypeCell: FC<{ isIncoming: boolean }> = ({ isIncoming }) => {
  return (
    <TypeWrapper>
      {isIncoming ? <IncomingIcon /> : <OutgoingIcon />}
    </TypeWrapper>
  );
};

export { TypeCell };