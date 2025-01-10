import { Button } from '@mui/base';
import React, { useState } from 'react'
import styled from 'styled-components';

type Props = {
  popupContent: () => React.ReactNode;
  children: React.ReactNode;
  trigger?: 'hover' | 'click';
};

const PopupComponent = ({ popupContent, children, trigger = 'hover' }: Props) => {
  const [popupAnchor, setPopupAnchor] = useState(false);
  const _handlePopupToggle = () => {
    setPopupAnchor((prev) => !prev);
  };
  return (
    <StyledPopup>
      <StyledSwapFormInfoButton
        onMouseEnter={trigger === 'hover' ? _handlePopupToggle : undefined}
        onMouseLeave={trigger === 'hover' ? _handlePopupToggle : undefined}
        onClick={trigger === 'click' ? _handlePopupToggle : undefined}
      >
        {children}
      </StyledSwapFormInfoButton>
      {popupAnchor && popupContent()}
    </StyledPopup>
  );
}

const StyledPopup = styled.div`
  position: relative;
`;

const StyledSwapFormInfoButton = styled(Button)`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: var(--fs-icon);
    color: var(--info-color);
  }
`;
export default PopupComponent