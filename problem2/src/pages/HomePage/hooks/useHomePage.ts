import { SwapKey } from '@src/constants/swap';
import { PriceModel, SelectedCurrencyType } from '@src/models/price.model';
import { priceService } from '@src/services/priceService';
import { formatDecimal } from '@src/utils/format';
import { validatePositiveNumber } from '@src/utils/validateNumber';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { SingleValue } from 'react-select';

export const useHomePage = () => {
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
  const [conversionResult, setConversionResult] = useState<{
    from: number;
    to: number;
  }>({ from: 0, to: 0 });
  const [selectedCurrencies, setSelectedCurrencies] = useState<{
    from: SelectedCurrencyType;
    to: SelectedCurrencyType;
  }>({
    from: { value: 0, label: '', date: '' },
    to: { value: 0, label: '', date: '' },
  });

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

  const handleResetConversionResult = () => {
    setConversionResult({ from: 0, to: 0 });
    setConfirmSwapError({ from: '', to: '' });
  };

  const fetchCurrencyData = async () => {
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
      setTimeout(() => {
        setIsCurrencyDataLoading(false);
      }, 1000);
    }
  };

  const handleConvertCurrency = (
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

  const handleSwapConversionResult = () => {
    setSelectedCurrencies((prev) => ({
      from: prev.to,
      to: prev.from,
    }));
    handleConvertCurrency(
      conversionResult.from,
      SwapKey.FROM,
      selectedCurrencies.to.value,
      selectedCurrencies.from.value
    );
  };

  const handleCurrencySelect = (
    value: SingleValue<SelectedCurrencyType>,
    key: SwapKey
  ) => {
    setSelectedCurrencies((prev) => ({
      ...prev,
      [key]: value,
    }));
    handleConvertCurrency(
      conversionResult[key === SwapKey.FROM ? SwapKey.TO : SwapKey.FROM],
      key === SwapKey.FROM ? SwapKey.TO : SwapKey.FROM,
      key === SwapKey.FROM ? value?.value || 0 : selectedCurrencies.from.value,
      key === SwapKey.TO ? value?.value || 0 : selectedCurrencies.to.value
    );
  };

  const handleAmountChange = (amountValue: string, key: SwapKey) => {
    if (validatePositiveNumber(amountValue)) {
      handleConvertCurrency(
        Number(amountValue),
        key,
        selectedCurrencies.from.value,
        selectedCurrencies.to.value
      );
      setConfirmSwapError({
        from: '',
        to: '',
      });
    }
  };

  const handleValidateSwapResult = (conversionResult: {
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

  const handleConfirmSwap = (callback: () => void) => {
    try {
      // Call API
      console.log(`Data: ${conversionResult}`);
      // Fake loading
      setIsConfirmSwapLoading(true);
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
        handleResetConversionResult();
      }, 4000);
      callback();
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

  useEffect(() => {
    fetchCurrencyData();
  }, []);

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

  return {
    currencyData,
    currencyOptions,
    isCurrencyDataLoading,
    currencyDataError,
    conversionResult,
    selectedCurrencies,
    handleSwapConversionResult,
    handleCurrencySelect,
    handleAmountChange,
    handleValidateSwapResult,
    handleConfirmSwap,
    isConfirmSwapLoading,
    isConfirmSwapSuccess,
    confirmSwapError,
    exchangeRate,
  };
};
