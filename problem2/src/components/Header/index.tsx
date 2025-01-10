import Logo from '@src/components/Logo';
import React from 'react';
import styled from 'styled-components';

type HeaderPropsType = {};

const Header = ({}: HeaderPropsType) => {
  return (
    <StyledHeader className="container-fluid">
      <Logo className="header-logo" />
      <h1>Currency Swap</h1>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  .header-logo {
    margin-right: 10px;
  }
  h1 {
    background: #4a90e2;
    background: radial-gradient(
      circle farthest-side at top left,
      #4a90e2 20%,
      #50e3c2 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default Header;
