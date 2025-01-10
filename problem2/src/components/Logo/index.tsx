import React from 'react';
import logo from '../../../public/logo.png';
import styled from 'styled-components';
type Props = {
  height?: number;
  width?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Logo = ({ height = 100, width = 100, className, ...props }: Props) => {
  return (
    <StyledLogo $height={height} $width={width} className={`${className} logo`} {...props}>
      <img src={logo} alt="logo" />
    </StyledLogo>
  );
};

const StyledLogo = styled.div<{ $height?: number; $width?: number }>`
  img {
    width: ${({ $width }) => $width}px;
    height: ${({ $height }) => $height}px;
  }
`;

export default Logo;
