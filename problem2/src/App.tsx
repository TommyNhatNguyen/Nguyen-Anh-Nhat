import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, inputClasses } from '@mui/base';
import MainLayout from '@src/layouts/MainLayout';
import Select, {
  components,
  SingleValue,
  SingleValueProps,
} from 'react-select';

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
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

  const [priceData, setPriceData] = useState<PriceModel[]>([]);
  const [priceDataLoading, setPriceDataLoading] = useState(false);
  const [priceDataError, setPriceDataError] = useState<Error | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [ammount, setAmmount] = useState<{
    from: {
      value: number;
      label: string;
    };
    to: {
      value: number;
      label: string;
    };
  }>({
    from: {
      value: 0,
      label: '',
    },
    to: {
      value: 0,
      label: '',
    },
  });
  const priceDataFinal = useMemo(() => {
    return priceData.map(
      (item) => ({
        value: item.price,
        label: item.currency,
      }),
      [priceData]
    );
  }, [priceData]);
  const getPricesData = async () => {
    try {
      setPriceDataLoading(true);
      const res = await priceService.getPrices();
      if (res.data) {
        setPriceData(res.data);
        return res.data;
      }
    } catch (error) {
      setPriceDataError(error as Error);
    } finally {
      setPriceDataLoading(false);
    }
  };

  useEffect(() => {
    getPricesData();
  }, []);

  useEffect(() => {
    if (priceData.length > 0) {
      setAmmount({
        from: {
          value: priceData[0].price,
          label: priceData[0].currency,
        },
        to: {
          value: priceData[1].price,
          label: priceData[1].currency,
        },
      });
    }
  }, [priceData]);

  const _onSelectCurrency = (
    value: SingleValue<{ value: number; label: string }>,
    key: SwapKey
  ) => {
    console.log(value);
    setAmmount((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const _onSwap = () => {
    setIsRotated((prevIsRotated) => !prevIsRotated);
    setAmmount((prev) => ({
      from: prev.to,
      to: prev.from,
    }));
  };

  const _onChangeAmmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: SwapKey
  ) => {
    const amountValue = e.target.value;
    if (validatePositiveNumber(amountValue)) {
      console.log(Number(amountValue));
      setAmmount((prev) => ({
        ...prev,
        [key]: {
          value: Number(amountValue),
          label: prev[key].label,
        },
      }));
    }
  };

  const _onConfirmSwap = () => {
    console.log('Ripple effect completed');
    // Add your function logic here
  };
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
                  onChange={(value) => _onSelectCurrency(value, SwapKey.FROM)}
                  value={ammount.from}
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
                  options={priceDataFinal}
                />
                <Input
                  className="form-group__input"
                  onChange={(e) => _onChangeAmmount(e, SwapKey.FROM)}
                  value={ammount.from.value}
                  onKeyDown={(e) => {
                    if (e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  type="number"
                  inputMode="decimal"
                />
              </StyledFormGroup>
            </StyledCard>
            <StyledButtonSwap
              className={`btn btn-swap --circle ${isRotated ? 'rotated' : ''}`}
              onClick={_onSwap}
            >
              <CgSwap />
            </StyledButtonSwap>
            <StyledCard className="swap-form__cards-item">
              <div className="swap-form__cards-item-title">
                <h3 className="title">Amount to receive</h3>
              </div>
              <StyledFormGroup className="form-group">
                <Select
                  onChange={(value) => _onSelectCurrency(value, SwapKey.TO)}
                  isSearchable={true}
                  value={ammount.to}
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
                  options={priceDataFinal}
                />
                <Input
                  className="form-group__input"
                  onChange={(e) => _onChangeAmmount(e, SwapKey.TO)}
                  value={ammount.to.value}
                  onKeyDown={(e) => {
                    if (e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  type="number"
                  inputMode="decimal"
                />
              </StyledFormGroup>
            </StyledCard>
          </StyledSwapFormCards>
          <StyledSubmitContainer className="swap-form__submit">
            <StyledButtonSubmit
              className="btn btn-submit"
              onClick={_onConfirmSwap}
            >
              Confirm swap
            </StyledButtonSubmit>
            <StyledSwapFormInfo className="swap-form__submit-info">
              <StyledSwapFormInfoButton
                aria-describedby={id}
                onClick={handleClick}
              >
                <BiInfoCircle />
              </StyledSwapFormInfoButton>
              <Popup open={open} anchor={anchor} id={id}>
                <p>Test</p>
              </Popup>
              <p className="info">
                <span>
                  {ammount.from.label}/{ammount.to.label}:{' '}
                </span>
                <span>
                  {formatDecimal(Number(ammount.from.value))}{' '}
                  {ammount.from.label} ={' '}
                  {formatDecimal(Number(ammount.to.value))} {ammount.to.label}
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
