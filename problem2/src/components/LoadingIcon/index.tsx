import React from 'react';
import { VscLoading } from 'react-icons/vsc';
import styled from 'styled-components';

type Props = {};

const LoadingIcon = (props: Props) => {
  return (
    <StyledLoadingIcon>
      <VscLoading />
    </StyledLoadingIcon>
  );
};

const StyledLoadingIcon = styled.div`
  animation: spin 1s linear infinite;
  aspect-ratio: 1/1;
  svg {
    font-size: 1.6rem;
  }
`;

export default LoadingIcon;
