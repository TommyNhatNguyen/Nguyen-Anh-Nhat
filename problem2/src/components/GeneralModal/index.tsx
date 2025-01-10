import React from 'react';
import styled from 'styled-components';
import { Modal, ModalProps } from '@mui/base';
type GeneralModalPropsType = {
  handleCloseModal: () => void;
  renderHeader?: () => React.ReactNode;
  renderBody?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  className?: string;
  children?: React.ReactNode;
} & ModalProps;

const GeneralModal = ({
  handleCloseModal,
  renderHeader,
  renderBody,
  renderFooter,
  className,
  children,
  ...props
}: GeneralModalPropsType) => {
  const _onCloseModal = () => {
    handleCloseModal();
  };
  return (
    <StyledModal
      className={`modal --shadow ${className}`}
      onClose={_onCloseModal}
      {...props}
    >
      <StyledModalContent className="modal-content">
        <StyledModalHeader className="modal-content__header">
          {renderHeader && renderHeader()}
        </StyledModalHeader>
        <StyledModalBody className="modal-content__body">
          {children}
        </StyledModalBody>
        <StyledModalFooter className="modal-content__footer">
          {renderFooter && renderFooter()}
        </StyledModalFooter>
      </StyledModalContent>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--backdrop-color);
  padding: 10px;
`;

const StyledModalContent = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  max-height: fit-content;
  background-color: var(--modal-bg-color);
  border: 1px solid var(--modal-border-color);
  border-radius: 12px;
  overflow: hidden;
`;

const StyledModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--modal-border-color);
  color: var(--primary-color);
`;

const StyledModalBody = styled.div`
  padding: 20px;
  .modal-content__body-text {
    span {
      font-family: var(--ff-semibold);
    }
  }
  .modal-content__body-amount {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
`;

const StyledModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid var(--modal-border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export default GeneralModal;
