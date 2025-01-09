import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  ClickAwayListener,
  Input,
  inputClasses,
  Modal,
} from '@mui/base';
import MainLayout from '@src/layouts/MainLayout';
import Select, { components, SingleValue } from 'react-select';
import { CgSwap } from 'react-icons/cg';
import { StyledButtonBase, StyledButtonSubmit } from '@src/components/Button';
import styled from 'styled-components';
import { validatePositiveNumber } from '@src/utils/validateNumber';
import { SwapKey } from '@src/constants/swap';
import { formatDecimal } from '@src/utils/format';
import { priceService } from '@src/services/priceService';
import { PriceModel } from '@src/models/price.model';
import { IMAGE_URL } from '@src/constants/image';
import { BiInfoCircle } from 'react-icons/bi';
import LoadingComponent, {
  LoadingComponentWrapper,
} from '@src/components/LoadingComponent';
import loader from '@src/assets/images/loader.json';
import moment from 'moment';
import success from '@src/assets/images/success.json';
import { Player } from '@lottiefiles/react-lottie-player';

function App() {
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [popupAnchor, setPopupAnchor] = useState<boolean>(false);
  const [currencyData, setCurrencyData] = useState<PriceModel[]>([]);
  const [isCurrencyDataLoading, setIsCurrencyDataLoading] = useState(false);
  const [currencyDataError, setCurrencyDataError] = useState<Error | null>(
    null
  );
  const [isConfirmSwapLoading, setIsConfirmSwapLoading] = useState(false);
  const [isConfirmSwapSuccess, setIsConfirmSwapSuccess] = useState(false);
  const [confirmSwapError, setConfirmSwapError] = useState<{
    from: string;
    to: string;
  }>({ from: '', to: '' });
  const [isSwapButtonRotated, setIsSwapButtonRotated] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<{
    from: { value: number; label: string; date: string };
    to: { value: number; label: string; date: string };
  }>({
    from: { value: 0, label: '', date: '' },
    to: { value: 0, label: '', date: '' },
  });
  const [conversionResult, setConversionResult] = useState<{
    from: number;
    to: number;
  }>({ from: 0, to: 0 });

  const _onCloseModalConfirm = () => {
    setIsOpenModalConfirm(false);
  };

  const _onOpenModalConfirm = () => {
    setIsOpenModalConfirm(true);
  };

  const _fetchCurrencyData = async () => {
    try {
      setIsCurrencyDataLoading(true);
      const response = await priceService.getPrices();
      if (response.data) {
        setCurrencyData(response.data);
        return response.data;
      }
    } catch (error) {
      setCurrencyDataError(error as Error);
    } finally {
      // Fake loading
      // setTimeout(() => {
      setIsCurrencyDataLoading(false);
      // }, 1000);
    }
  };

  useEffect(() => {
    _fetchCurrencyData();
  }, []);

  const currencyOptions = useMemo(() => {
    return currencyData.map(
      (item) => ({
        value: item.price,
        label: item.currency,
        date: moment(item.date).format('DD/MM/YYYY'),
      }),
      [currencyData]
    );
  }, [currencyData]);

  useEffect(() => {
    if (currencyData.length > 0) {
      setSelectedCurrencies({
        from: {
          value: currencyData[0].price,
          label: currencyData[0].currency,
          date: moment(currencyData[0].date).format('DD/MM/YYYY'),
        },
        to: {
          value: currencyData[1].price,
          label: currencyData[1].currency,
          date: moment(currencyData[1].date).format('DD/MM/YYYY'),
        },
      });
    }
  }, [currencyData]);

  const _handlePopupToggle = () => {
    setPopupAnchor((prev) => !prev);
  };

  const _handleCurrencySelect = (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => {
    setSelectedCurrencies((prev) => ({
      ...prev,
      [key]: value,
    }));
    _convertCurrency(
      conversionResult[key === SwapKey.FROM ? SwapKey.TO : SwapKey.FROM],
      key === SwapKey.FROM ? SwapKey.TO : SwapKey.FROM,
      key === SwapKey.FROM ? value?.value || 0 : selectedCurrencies.from.value,
      key === SwapKey.TO ? value?.value || 0 : selectedCurrencies.to.value
    );
  };

  const _handleSwap = () => {
    setIsSwapButtonRotated((prev) => !prev);
    setSelectedCurrencies((prev) => ({
      from: prev.to,
      to: prev.from,
    }));
    _convertCurrency(
      conversionResult.from,
      SwapKey.FROM,
      selectedCurrencies.to.value,
      selectedCurrencies.from.value
    );
  };

  const _convertCurrency = (
    amount: number,
    key: SwapKey,
    fromPrice: number,
    toPrice: number
  ) => {
    if (key === SwapKey.FROM) {
      setConversionResult({
        from: amount,
        to: (amount * fromPrice) / toPrice,
      });
    } else {
      setConversionResult({
        from: (amount * toPrice) / fromPrice,
        to: amount,
      });
    }
  };

  const _handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: SwapKey
  ) => {
    const amountValue = e.target.value;
    if (validatePositiveNumber(amountValue)) {
      _convertCurrency(
        Number(amountValue),
        key,
        selectedCurrencies.from.value,
        selectedCurrencies.to.value
      );
    }
    setConfirmSwapError({
      from: '',
      to: '',
    });
  };

  const _onValidateSwapResult = (conversionResult: {
    from: number;
    to: number;
  }) => {
    if (conversionResult.from === 0 || conversionResult.to === 0) {
      setConfirmSwapError({
        from: "This can't be empty",
        to: "This can't be empty",
      });
      return false;
    }
    return true;
  };

  const _handleConfirmSwap = () => {
    try {
      setIsConfirmSwapLoading(true);
      // Call API
      console.log(`Data: ${conversionResult}`);
      if (!_onValidateSwapResult(conversionResult)) {
        _onCloseModalConfirm();
        return;
      }
      // Fake loading
      setTimeout(() => {
        setIsConfirmSwapSuccess(true);
      }, 2000);
    } catch (error) {
      setConfirmSwapError({
        from: (error as Error).message || 'Something went wrong',
        to: (error as Error).message || 'Something went wrong',
      });
    } finally {
      // Fake loading
      setTimeout(() => {
        setIsConfirmSwapLoading(false);
      }, 2000);
      setTimeout(() => {
        setIsConfirmSwapSuccess(false);
        _onCloseModalConfirm();
      }, 4000);
    }
  };

  // Function to prevent not allowed characters
  const _preventNotAllowedCharacters = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const notAllowedKeys = ['-'];
    if (notAllowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const calculateExchangeRate = (fromValue: number, toValue: number) => {
    const exchangeRateFrom = formatDecimal(fromValue / fromValue);
    const exchangeRateTo = formatDecimal(fromValue / toValue);
    return {
      from: exchangeRateFrom,
      to: exchangeRateTo,
    };
  };

  const exchangeRate = calculateExchangeRate(
    Number(selectedCurrencies.from.value),
    Number(selectedCurrencies.to.value)
  );
  return (
    <MainLayout>
      <LoadingComponent loading={isCurrencyDataLoading} />
      <div className="container">
        <StyledSwapForm className="swap-form">
          <StyledSwapFormTitle className="swap-form__title">
            <h2 className="swap-form__title-text">Swap</h2>
          </StyledSwapFormTitle>
          <StyledSwapFormCards className="swap-form__cards">
            <StyledCard className="swap-form__cards-item">
              <div className="swap-form__cards-item-title">
                <h3 className="title">Amount to send</h3>
              </div>
              <StyledFormGroup
                className="form-group"
                $error={confirmSwapError.from}
              >
                <Select
                  onChange={(value) =>
                    _handleCurrencySelect(value, SwapKey.FROM)
                  }
                  value={selectedCurrencies.from}
                  isSearchable={true}
                  styles={{
                    option: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }),
                    input: (base) => ({
                      ...base,
                      minWidth: '50px',
                      maxWidth: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }),
                  }}
                  components={{
                    Option: ({ children, ...props }) => {
                      return (
                        <components.Option {...props}>
                          <img
                            src={`${IMAGE_URL}/${props.data.label}.svg`}
                            alt={props.data.label}
                            width={20}
                            height={20}
                          />
                          {children}
                        </components.Option>
                      );
                    },
                    SingleValue: ({ children, ...props }) => {
                      return (
                        <components.SingleValue {...props}>
                          <img
                            src={`${IMAGE_URL}/${props.data.label}.svg`}
                            alt={props.data.label}
                            width={20}
                            height={20}
                          />
                          {children}
                        </components.SingleValue>
                      );
                    },
                  }}
                  options={currencyOptions}
                />
                <Input
                  className="form-group__input"
                  onChange={(e) => _handleAmountChange(e, SwapKey.FROM)}
                  value={conversionResult.from}
                  onKeyDown={_preventNotAllowedCharacters}
                  type="number"
                  inputMode="decimal"
                />
                <p className="form-group__error">{confirmSwapError.from}</p>
              </StyledFormGroup>
            </StyledCard>
            <StyledButtonSwap
              className={`btn btn-swap --circle ${
                isSwapButtonRotated ? 'rotated' : ''
              }`}
              onClick={_handleSwap}
            >
              <CgSwap />
            </StyledButtonSwap>
            <StyledCard className="swap-form__cards-item">
              <div className="swap-form__cards-item-title">
                <h3 className="title">Amount to receive</h3>
              </div>
              <StyledFormGroup
                className="form-group"
                $error={confirmSwapError.to}
              >
                <Select
                  onChange={(value) => _handleCurrencySelect(value, SwapKey.TO)}
                  isSearchable={true}
                  value={selectedCurrencies.to}
                  styles={{
                    option: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }),
                    input: (base) => ({
                      ...base,
                      minWidth: '50px',
                      maxWidth: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }),
                  }}
                  components={{
                    Option: ({ children, ...props }) => {
                      return (
                        <components.Option {...props}>
                          <img
                            src={`${IMAGE_URL}/${props.data.label}.svg`}
                            alt={props.data.label}
                            width={20}
                            height={20}
                          />
                          {children}
                        </components.Option>
                      );
                    },
                    SingleValue: ({ children, ...props }) => {
                      return (
                        <components.SingleValue {...props}>
                          <img
                            src={`${IMAGE_URL}/${props.data.label}.svg`}
                            alt={props.data.label}
                            width={20}
                            height={20}
                          />
                          {children}
                        </components.SingleValue>
                      );
                    },
                  }}
                  options={currencyOptions}
                />
                <Input
                  className="form-group__input"
                  onChange={(e) => _handleAmountChange(e, SwapKey.TO)}
                  value={conversionResult.to}
                  onKeyDown={_preventNotAllowedCharacters}
                  type="number"
                  inputMode="decimal"
                />
                <p className="form-group__error">{confirmSwapError.to}</p>
              </StyledFormGroup>
            </StyledCard>
          </StyledSwapFormCards>
          <StyledSubmitContainer className="swap-form__submit">
            <StyledButtonSubmit
              className="btn btn-submit"
              onClick={_onOpenModalConfirm}
            >
              Confirm swap
            </StyledButtonSubmit>
            <StyledSwapFormInfo className="swap-form__submit-info">
              <ClickAwayListener onClickAway={() => setPopupAnchor(false)}>
                <StyledPopup>
                  <StyledSwapFormInfoButton
                    onMouseEnter={_handlePopupToggle}
                    onMouseLeave={_handlePopupToggle}
                  >
                    <BiInfoCircle />
                  </StyledSwapFormInfoButton>
                  {popupAnchor && (
                    <StyledPopupBody>
                      <p>
                        Exchange rate of {selectedCurrencies.from.label} is
                        based on the date of {selectedCurrencies.from.date}
                      </p>
                      <p>
                        Exchange rate of {selectedCurrencies.to.label} is based
                        on the date of {selectedCurrencies.to.date}
                      </p>
                    </StyledPopupBody>
                  )}
                </StyledPopup>
              </ClickAwayListener>

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
      <StyledModal open={isOpenModalConfirm} onClose={_onCloseModalConfirm}>
        <StyledModalContent className="modal-content">
          <StyledModalHeader className="modal-content__header">
            <h2>Confirm swap</h2>
          </StyledModalHeader>
          <StyledModalBody className="modal-content__body">
            <div className="modal-content__body-text">
              <p>Are you sure you want to swap:</p>
              <p>
                {conversionResult.from}{' '}
                <span>{selectedCurrencies.from.label}</span> to{' '}
                {conversionResult.to} <span>{selectedCurrencies.to.label}</span>
              </p>
            </div>
          </StyledModalBody>
          <StyledModalFooter className="modal-content__footer">
            <StyledButtonBase onClick={_onCloseModalConfirm}>
              Cancel
            </StyledButtonBase>
            <StyledButtonBase onClick={_handleConfirmSwap}>
              Confirm
            </StyledButtonBase>
          </StyledModalFooter>
          {isConfirmSwapSuccess && (
            <StyledSuccessWrapper>
              <StyledSuccess autoplay src={success} />
            </StyledSuccessWrapper>
          )}
          {isConfirmSwapLoading && (
            <StyledLoadingComponent>
              <Loader autoplay loop src={loader} />
            </StyledLoadingComponent>
          )}
        </StyledModalContent>
      </StyledModal>
    </MainLayout>
  );
}

const Loader = styled(Player)`
  height: 40%;
  width: 40%;
  min-width: 200px;
  min-height: 200px;
`;

const StyledLoadingComponent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
`;

const StyledSuccessWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
`;

const StyledSuccess = styled(Player)`
  width: 10%;
  height: 10%;
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

const StyledSwapFormInfoButton = styled(Button)`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 24px;
    color: #4a90e2;
  }
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

const StyledCard = styled.div`
  width: 100%;
  border: 1px solid #ededed;
  padding: 24px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const StyledButtonSwap = styled(StyledButtonBase)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid #ededed;
  background-color: white;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
  &.rotated {
    transform: translate(-50%, -50%) rotate(180deg);
  }

  svg {
    font-size: 24px;
    color: #4a90e2;
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

const StyledFormGroup = styled.div<{ $error: string }>`
  display: flex;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $error }) => ($error ? 'red' : '#ededed')};
  height: var(--input-height);
  border-radius: 12px;
  background-color: white;
  transition: border-color 0.3s ease-in-out;
  position: relative;
  &:has(.${inputClasses.focused}) {
    border-color: #4a90e2;
  }
  &:hover {
    border-color: #4a90e2;
  }
  .btn-select {
    height: 100%;
    flex-shrink: 0;
    border: none;
    background-color: transparent;
  }
  .form-group__input {
    flex: 1;
    height: 100%;
    input {
      height: 100%;
      width: 100%;
      border: none;
      padding: 0px 10px;
      &:focus {
        outline: none;
      }
    }
  }
  .form-group__error {
    color: red;
    font-size: var(--fs-small);
    margin-top: 5px;
    position: absolute;
    top: 100%;
    left: 2px;
    display: ${({ $error }) => ($error ? 'block' : 'none')};
  }
`;

const StyledPopup = styled.div`
  position: relative;
`;

const StyledPopupBody = styled.div`
  padding: 10px;
  border: 1px solid #ededed;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  hyphens: auto;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
`;

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StyledModalContent = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  max-height: fit-content;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StyledModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ededed;
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
  border-top: 1px solid #ededed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export default App;
