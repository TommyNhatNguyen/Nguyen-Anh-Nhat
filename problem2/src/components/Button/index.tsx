import { Button, ButtonOwnProps, buttonClasses } from '@mui/base';
import LoadingIcon from '@src/components/LoadingIcon';
import React from 'react';
import styled from 'styled-components';

type RippleButtonProps = {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & ButtonOwnProps;

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className,
  loading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={loading || disabled}
      className={`${className} ${loading ? 'loading' : ''}`}
      onClick={onClick}
    >
      {loading && <LoadingIcon />}
      {children}
    </Button>
  );
};

export const StyledButtonBase = styled(RippleButton)`
  position: relative;
  overflow: hidden;
  border-radius: var(--btn-border-radius);
  border-width: 1px;
  border-style: solid;
  border-color: var(--btn-border-color);
  height: var(--btn-height);
  padding: var(--btn-padding);
  font-size: var(--btn-font-size);
  background-color: var(--btn-bg-color);
  color: var(--btn-text-color);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: var(--btn-hover-bg-color);
  }
  &.loading {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &.${buttonClasses.disabled} {
    background-color: var(--btn-disabled-bg-color);
    color: var(--btn-disabled-text-color);
    border-color: var(--btn-disabled-border-color);
    cursor: not-allowed;
  }
`;

export const StyledButtonSecondary = styled(StyledButtonBase)`
  background-color: var(--btn-secondary-bg-color);
  color: var(--btn-secondary-text-color);
  &:hover {
    background-color: var(--btn-secondary-hover-bg-color);
  }
`;

export const StyledButtonOutline = styled(StyledButtonBase)`
  background-color: transparent;
  color: var(--text-color);
  border-color: var(--btn-border-color);
  &:hover {
    color: var(--btn-text-color);
  }
`;

export default RippleButton;
