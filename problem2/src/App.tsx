import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, inputClasses } from '@mui/base';
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
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';

function App() {
  const [popupAnchor, setPopupAnchor] = React.useState<null | HTMLElement>(null);
  const [currencyData, setCurrencyData] = useState<PriceModel[]>([]);
  const [isCurrencyDataLoading, setIsCurrencyDataLoading] = useState(false);
  const [currencyDataError, setCurrencyDataError] = useState<Error | null>(null);
  const [isSwapButtonRotated, setIsSwapButtonRotated] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<{
    from: { value: number; label: string; };
    to: { value: number; label: string; };
  }>({ from: { value: 0, label: '' }, to: { value: 0, label: '' } });
  const [conversionResult, setConversionResult] = useState<{ from: number; to: number; }>({ from: 0, to: 0 });

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
      setIsCurrencyDataLoading(false);
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
        },
        to: {
          value: currencyData[1].price,
          label: currencyData[1].currency,
        },
      });
    }
  }, [currencyData]);

  const _handlePopupClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopupAnchor(popupAnchor ? null : event.currentTarget);
  };

  const _handleCurrencySelect = (
    value: SingleValue<{ value: number; label: string }>,
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
  };

  const _handleConfirmSwap = () => {
    console.log('Ripple effect completed');
    // Add your function logic here
  };

  // Function to prevent not allowed characters
  const _preventNotAllowedCharacters = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const notAllowedKeys = ['-'];
    if (notAllowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const open = Boolean(popupAnchor);
  const id = open ? 'simple-popper' : undefined;

  return (
    <MainLayout>
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
              <StyledFormGroup className="form-group">
                <Select
                  onChange={(value) => _handleCurrencySelect(value, SwapKey.FROM)}
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
              </StyledFormGroup>
            </StyledCard>
            <StyledButtonSwap
              className={`btn btn-swap --circle ${isSwapButtonRotated ? 'rotated' : ''}`}
              onClick={_handleSwap}
            >
              <CgSwap />
            </StyledButtonSwap>
            <StyledCard className="swap-form__cards-item">
              <div className="swap-form__cards-item-title">
                <h3 className="title">Amount to receive</h3>
              </div>
              <StyledFormGroup className="form-group">
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
              </StyledFormGroup>
            </StyledCard>
          </StyledSwapFormCards>
          <StyledSubmitContainer className="swap-form__submit">
            <StyledButtonSubmit
              className="btn btn-submit"
              onClick={_handleConfirmSwap}
            >
              Confirm swap
            </StyledButtonSubmit>
            <StyledSwapFormInfo className="swap-form__submit-info">
              <StyledSwapFormInfoButton
                aria-describedby={id}
                onClick={_handlePopupClick}
              >
                <BiInfoCircle />
              </StyledSwapFormInfoButton>
              <Popup open={open} anchor={popupAnchor} id={id}>
                <p>Test</p>
              </Popup>
              <p className="info">
                <span>
                  {selectedCurrencies.from.label}/{selectedCurrencies.to.label}:{' '}
                </span>
                <span>
                  {formatDecimal(
                    Number(selectedCurrencies.from.value) / Number(selectedCurrencies.from.value)
                  )}{' '}
                  {selectedCurrencies.from.label} ={' '}
                  {formatDecimal(
                    Number(selectedCurrencies.from.value) / Number(selectedCurrencies.to.value)
                  )}{' '}
                  {selectedCurrencies.to.label}
                </span>
              </p>
            </StyledSwapFormInfo>
          </StyledSubmitContainer>
        </StyledSwapForm>
      </div>
    </MainLayout>
  );
}

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
  padding-left: 5px;
  .swap-form__submit-info {
    flex: 1;
  }

  .btn-submit {
    flex: 1;
  }
`;

const StyledFormGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ededed;
  height: var(--input-height);
  border-radius: 12px;
  background-color: white;
  transition: border-color 0.3s ease-in-out;
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
`;

const StyledOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
`;

export default App;
