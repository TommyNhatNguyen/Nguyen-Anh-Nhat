import { Input, inputClasses } from '@mui/base';
import { IMAGE_URL } from '@src/constants/image';
import { SwapKey } from '@src/constants/swap';
import CurrencySelect from '@src/pages/HomePage/components/CurrencySelect';
import { preventNotAllowedCharacters } from '@src/utils/preventCharecters';
import React, { useCallback } from 'react';
import Select, { components, SingleValue } from 'react-select';
import styled from 'styled-components';

type Props = {
  error: string;
  handleSelectCurrency: (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => void;
  conversionResult: { from: number; to: number };
  selectedCurrencies: {
    from: { value: number; label: string; date: string };
    to: { value: number; label: string; date: string };
  };
  currencyOptions: { value: number; label: string; date: string }[];
  handleAmountChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: SwapKey
  ) => void;
  swapKey: SwapKey;
  title: string;
};

const ExchangeCard = ({
  error,
  handleSelectCurrency,
  conversionResult,
  selectedCurrencies,
  currencyOptions,
  handleAmountChange,
  swapKey,
  title,
}: Props) => {
  const _onCurrencySelect = (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => {
    handleSelectCurrency(value, key);
  };
  const _onAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleAmountChange(e, swapKey);
  };
  return (
    <StyledCard className="swap-form__cards-item --shadow">
      <StyledCardTitle className="swap-form__cards-item-title">
        <h3 className="title">{title}</h3>
      </StyledCardTitle>
      <StyledFormGroup className="form-group" $error={error}>
        <CurrencySelect
          currencyOptions={currencyOptions}
          selectedCurrencies={selectedCurrencies}
          swapKey={swapKey}
          handleSelectCurrency={_onCurrencySelect}
        />
        <StyledInput
          className="form-group__input"
          onChange={(e) => _onAmountChange(e)}
          value={conversionResult[swapKey]}
          onKeyDown={preventNotAllowedCharacters}
          type="number"
          inputMode="decimal"
          placeholder="0.00"
        />
        <p className="form-group__error">{error}</p>
      </StyledFormGroup>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  width: 100%;
  border: 1px solid var(--card-border-color);
  padding: 12px 20px 24px 20px;
  border-radius: 12px;
  background-color: var(--card-background-color);
`;

const StyledCardTitle = styled.div`
  margin-bottom: 12px;
  padding-left: 3px;
`;

const StyledFormGroup = styled.div<{ $error: string }>`
  display: flex;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $error }) =>
    $error ? 'red' : 'var(--input-border-color)'};
  height: var(--input-height);
  border-radius: 12px;
  background-color: white;
  transition: border-color 0.3s ease-in-out;
  position: relative;
  .form-group__select {
    .react-select__control {
      border: none;
      background-color: transparent;
      box-shadow: none;
      &--is-focused,
      &--menu-is-open {
        border: none;
        background-color: transparent;
      }
    }
  }
  &:has(.${inputClasses.focused}),
  &:has(.react-select__control--is-focused) {
    border-color: var(--input-border-color-focus);
  }
  &:hover {
    border-color: var(--input-border-color-hover);
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
    color: var(--error-color);
    font-size: var(--fs-small);
    margin-top: 5px;
    position: absolute;
    top: 100%;
    left: 2px;
    display: ${({ $error }) => ($error ? 'block' : 'none')};
  }
`;

const StyledInput = styled(Input)`
  background-color: transparent;
  border: none;
  .${inputClasses.input} {
    background-color: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  }
`;
export default ExchangeCard;
