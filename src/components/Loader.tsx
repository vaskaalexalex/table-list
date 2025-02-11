import {
  useState,
  useEffect,
  FC,
  PropsWithChildren,
  Fragment,
} from 'react';

import styled, { css, keyframes } from 'styled-components';

import SpinnerIcon from '@icons/spinner.svg?react';

const spinning = keyframes`
    from {
        transform: rotate(0deg)
    }
    to {
        transform: rotate(360deg)
    }
`;

const LoaderWrapper = styled.th<{ fullScreen?: boolean }>(
  ({ fullScreen }) => css`
      display: flex;
      width: 100%;
      height: ${fullScreen ? '100vh' : '100%'};
      justify-content: center;
      align-items: center;

      & svg {
          height: ${fullScreen ? '50px' : '20px'};
          width: ${fullScreen ? '50px' : '20px'};
          color: #122945;
          animation: ${spinning} 1.1s infinite linear;
      }
  `,
);


interface ISpinnerProps {
  loading?: boolean;
  fullScreen?: boolean;
  delay?: number;
}

const Loader: FC<
  ISpinnerProps &
  PropsWithChildren
> = ({
       fullScreen = true,
       loading = true,
       children = null,
     }) => {
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeoutId);
  }, [setShow]);

  if (!isShow && loading) return null;

  if (loading) {
    return (
      <LoaderWrapper fullScreen={fullScreen}>
        <SpinnerIcon />
      </LoaderWrapper>
    );
  }

  return <Fragment>{children}</Fragment>;
};

export { Loader };
