import React, { useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface WalletBalanceRowData extends FormattedWalletBalance {
  usdValue: number;
}

interface Price {
  [key: string]: number;
}

type Props = {
  children?: React.ReactNode;
  classes: {
    row: string;
  };
} & BoxProps;

const priorityMap = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as { [key: string]: number };

const WalletPage = ({ children, classes, ...rest }: Props) => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Price = usePrices();
  const getPriority = (blockchain: string) => {
    return priorityMap[blockchain] || -99;
  };
  const filteredBalances = useMemo(() => {
    return balances.filter((balance) => {
      const balancePriority = getPriority(balance.currency);
      return balancePriority > -99 && balance.amount <= 0 ? true : false;
    });
  }, [balances]);

  const filteredBalancesCopy = [...filteredBalances];
  const sortedBalances = useMemo(() => {
    return filteredBalancesCopy.sort((lhs, rhs) => {
      const leftPriority = getPriority(lhs.currency);
      const rightPriority = getPriority(rhs.currency);
      if (leftPriority == rightPriority) return 0;
      return leftPriority > rightPriority ? -1 : 1;
    });
  }, [filteredBalancesCopy]);

  const balancesDataFinal: WalletBalanceRowData[] = sortedBalances.map(
    (balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue,
      };
    }
  );
  return (
    <div {...rest}>
      {balancesDataFinal &&
        balancesDataFinal.map((balance, index) => {
          return (
            <WalletRow
              className={classes.row}
              key={balance.currency}
              amount={balance.amount}
              usdValue={balance.usdValue}
              formattedAmount={balance.formatted}
            />
          );
        })}
    </div>
  );
};

export default WalletPage;
