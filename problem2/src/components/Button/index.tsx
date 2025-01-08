import { Button, ButtonOwnProps } from '@mui/base';
import React from 'react';
import styled from 'styled-components';

type RippleButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disableRipple?: boolean;
} & ButtonOwnProps;

const RippleButton: React.FC<RippleButtonProps> = ({
  onClick,
  children,
  className,
  disableRipple = false,
  ...props
}) => {
  const _onRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disableRipple) {
      onClick();
      return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    // Add event listener for animation end
    circle.addEventListener('animationend', onClick);
  };

  return (
    <Button {...props} className={className} onClick={_onRippleEffect}>
      {children}
    </Button>
  );
};

export const StyledButtonBase = styled(RippleButton)`
  position: relative;
  overflow: hidden;
  border-radius: var(--btn-border-radius);
  height: var(--btn-height);
  padding: var(--btn-padding);
  font-size: var(--btn-font-size);
  cursor: pointer;

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: var(--btn-ripple-color);
    transform: scale(0);
    animation: ripple-animation 600ms linear;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(5);
      opacity: 0;
    }
  }
`;

export const StyledButtonSubmit = styled(StyledButtonBase)`
  background-color: black;
  color: var(--btn-text-color);
`;

export default RippleButton;
