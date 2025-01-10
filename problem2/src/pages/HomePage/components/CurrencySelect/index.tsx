import Select, { components, SingleValue } from 'react-select';
import { SwapKey } from '@src/constants/swap';
import React from 'react';
import { IMAGE_URL } from '@src/constants/image';

type Props = {
  currencyOptions: { value: number; label: string; date: string }[];
  selectedCurrencies: {
    from: { value: number; label: string; date: string };
    to: { value: number; label: string; date: string };
  };
  swapKey: SwapKey;
  handleSelectCurrency: (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => void;
};

const CurrencySelect = ({
  currencyOptions,
  selectedCurrencies,
  swapKey,
  handleSelectCurrency,
}: Props) => {
  const _onCurrencySelect = (
    value: SingleValue<{ value: number; label: string; date: string }>,
    key: SwapKey
  ) => {
    handleSelectCurrency(value, key);
  };
  return (
    <Select
      className="form-group__select"
      classNamePrefix="react-select"
      onChange={(value) => _onCurrencySelect(value, swapKey)}
      value={selectedCurrencies[swapKey]}
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
  );
};

export default CurrencySelect;
