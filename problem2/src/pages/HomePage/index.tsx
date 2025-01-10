import React, { useState } from 'react';
import { Button, ClickAwayListener } from '@mui/base';
import { SingleValue } from 'react-select';
import { CgSwap } from 'react-icons/cg';
import { StyledButtonBase, StyledButtonOutline } from '@src/components/Button';
import styled from 'styled-components';
import { SwapKey } from '@src/constants/swap';
import { BiInfoCircle } from 'react-icons/bi';
import LoadingComponent from '@src/components/LoadingComponent';
import GeneralModal from '@src/components/GeneralModal';
import SuccessIcon from '@src/components/SuccessIcon';
import ExchangeCard from '@src/pages/HomePage/components/ExchangeCard';
import { useHomePage } from '@src/pages/HomePage/hooks/useHomePage';
import PopupComponent from '@src/components/PopupComponent';
function HomePage() {
  const {
    isCurrencyDataLoading,
    handleSwapConversionResult,
    handleCurrencySelect,
    handleAmountChange,
    handleValidateSwapResult,
    handleConfirmSwap,
    isConfirmSwapLoading,
    isConfirmSwapSuccess,
    confirmSwapError,
    conversionResult,
    selectedCurrencies,
    currencyOptions,
    exchangeRate,
  } = useHomePage();
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [isSwapButtonRotated, setIsSwapButtonRotated] = useState(false);

  const _onCloseModalConfirm = () => {
    setIsOpenModalConfirm(false);
  };

  const _onOpenModalConfirm = () => {
    setIsOpenModalConfirm(true);
  };

  const _handleCurrencySelect = (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => {
    handleCurrencySelect(value, key);
  };

  const _handleSwap = () => {
    setIsSwapButtonRotated((prev) => !prev);
    handleSwapConversionResult();
  };

  const _handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: SwapKey
  ) => {
    const amountValue = e.target.value;
    handleAmountChange(amountValue, key);
  };

  const _handleConfirmSwap = () => {
    if (!handleValidateSwapResult(conversionResult)) {
      _onCloseModalConfirm();
      return;
    }
    handleConfirmSwap(() => {
      // Fake loading
      setTimeout(() => {
        _onCloseModalConfirm();
      }, 4000);
    });
  };

  return (
    <main id="home-page" className="home-page">
      <LoadingComponent loading={isCurrencyDataLoading} />
      <div className="container">
        <StyledSwapForm className="swap-form">
          <StyledSwapFormTitle className="swap-form__title">
            <h2 className="swap-form__title-text">Swap</h2>
          </StyledSwapFormTitle>

          <StyledSwapFormCards className="swap-form__cards">
            <ExchangeCard
              currencyOptions={currencyOptions}
              error={confirmSwapError.from}
              handleSelectCurrency={_handleCurrencySelect}
              conversionResult={conversionResult}
              selectedCurrencies={selectedCurrencies}
              handleAmountChange={_handleAmountChange}
              swapKey={SwapKey.FROM}
              title="Amount to send"
            />
            <StyledButtonSwap
              className={`btn btn-swap --circle ${
                isSwapButtonRotated ? 'rotated' : ''
              }`}
              onClick={_handleSwap}
            >
              <CgSwap />
            </StyledButtonSwap>
            <ExchangeCard
              currencyOptions={currencyOptions}
              error={confirmSwapError.to}
              handleSelectCurrency={_handleCurrencySelect}
              conversionResult={conversionResult}
              selectedCurrencies={selectedCurrencies}
              handleAmountChange={_handleAmountChange}
              swapKey={SwapKey.TO}
              title="Amount to receive"
            />
          </StyledSwapFormCards>

          <StyledSubmitContainer className="swap-form__submit">
            <StyledButtonBase
              className="btn btn-submit"
              onClick={_onOpenModalConfirm}
            >
              Confirm swap
            </StyledButtonBase>

            <StyledSwapFormInfo className="swap-form__submit-info">
              <PopupComponent
                popupContent={() => (
                  <StyledPopupBody className="popup-body --shadow">
                    <p>
                      Exchange rate of {selectedCurrencies.from.label} is based
                      on the date of {selectedCurrencies.from.date}
                    </p>
                    <p>
                      Exchange rate of {selectedCurrencies.to.label} is based on
                      the date of {selectedCurrencies.to.date}
                    </p>
                  </StyledPopupBody>
                )}
              >
                <BiInfoCircle />
              </PopupComponent>
              <p className="info">
                <span>
                  {selectedCurrencies.from.label}/{selectedCurrencies.to.label}:{' '}
                </span>
                <span>
                  {exchangeRate.from} {selectedCurrencies.from.label} ={' '}
                  {exchangeRate.to} {selectedCurrencies.to.label}
                </span>
              </p>
            </StyledSwapFormInfo>
          </StyledSubmitContainer>
        </StyledSwapForm>
      </div>
      <GeneralModal
        open={isOpenModalConfirm}
        handleCloseModal={_onCloseModalConfirm}
        renderHeader={() => <h2>Confirm swap</h2>}
        renderFooter={() => (
          <StyledModalFooter className="modal-content__footer">
            <StyledButtonOutline
              className="btn btn-cancel"
              onClick={_onCloseModalConfirm}
              loading={isConfirmSwapLoading || isConfirmSwapSuccess}
            >
              Cancel
            </StyledButtonOutline>
            <StyledButtonBase
              className="btn btn-confirm"
              onClick={_handleConfirmSwap}
              loading={isConfirmSwapLoading || isConfirmSwapSuccess}
            >
              Confirm
            </StyledButtonBase>
          </StyledModalFooter>
        )}
      >
        <StyledModalBody className="modal-content__body-text">
          <h3 className="title">Are you sure you want to swap:</h3>
          <p className="text">
            {conversionResult.from} <span>{selectedCurrencies.from.label}</span>{' '}
            to {conversionResult.to} <span>{selectedCurrencies.to.label}</span>
          </p>
          {isConfirmSwapSuccess && <SuccessIcon autoplay={true} />}
        </StyledModalBody>
      </GeneralModal>
    </main>
  );
}

const StyledModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const StyledModalBody = styled.div`
  .text {
    font-size: var(--fs-body);
    span {
      font-family: var(--ff-medium);
    }
  }
`;

const StyledSwapForm = styled.div`
  width: 100%;
  margin: 0 auto;
  border: 1px solid black;
  padding: 20px;
  border-radius: 12px;
  position: relative;
  background-color: #ededed;
`;

const StyledSwapFormInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledSwapFormTitle = styled.div`
  text-align: center;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 5px 20px;
  min-width: fit-content;
  width: 50%;
  border: 2px solid white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: linear-gradient(135deg, white, rgba(80, 227, 194, 0.3), white);
    background-size: 200%;
    animation: background-animation 2.5s linear infinite;
    /* animation-direction: alternate; */
    @keyframes background-animation {
      0% {
        background-position: -50% -50%;
      }
      100% {
        background-position: 150% 150%;
      }
    }
  }
  h2 {
    background: linear-gradient(135deg, #4a90e2, #50e3c2);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-animation 2.5s linear infinite;
    animation-direction: alternate;
    text-transform: uppercase;
    font-size: var(--fs-h2);
  }

  @keyframes gradient-animation {
    0% {
      background-position: 0%;
    }
    100% {
      background-position: 100%;
    }
  }
`;

const StyledSwapFormCards = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .btn-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const StyledButtonSwap = styled(StyledButtonOutline)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid #ededed;
  background-color: var(--card-background-color);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
  &:hover {
    background-color: var(--card-background-color);
  }
  &.rotated {
    transform: translate(-50%, -50%) rotate(180deg);
  }

  svg {
    font-size: 24px;
    color: var(--secondary-color);
  }
`;

const StyledSubmitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  .swap-form__submit-info {
    flex: 1;
  }

  .btn-submit {
    flex: 1;
  }
`;

const StyledPopupBody = styled.div`
  padding: 10px;
  background-color: var(--bg-white);
  white-space: nowrap;
  hyphens: auto;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
`;

export default HomePage;
