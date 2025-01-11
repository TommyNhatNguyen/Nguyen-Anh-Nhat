**1. Problem 1: Anti-pattern**

- Some variables are not correctly typed, leads to property not found error (e.g. `prices`, `balances` are not typed)
- Some functions are not correctly typed, leads to type error (e.g. `getPriority` is not typed)
- `sortedBalances` is not typed, which doesn't provide which properties are available. In this case, we don't know `balance` variable has `FormattedWalletBalance` type or not.

```
sortedBalances.map(
    (balance: FormattedWalletBalance, index: number))
```

- **Solution**: Add correct types using type or interface for functions and variables

**2. Problem 2: Anti-pattern**

- `.sort` mutates the original array, which is not a good practice.
- **Solution**: Deep copy the filtered array before sorting

```
 /*** Previous code ***/

  .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });

```

**3. Problem 3: Anti-pattern**

- Should destructure `props` directly in functional components for better readability, and add type for `children`.
- **Solution**: Destructure props in functional components and add type for `children`.

```
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
}

/*** Correct code ***/

type Props = {children?: React.ReactNode} & BoxProps
const WalletPage = ({children, ...rest}: Props) => {
  /*** code ***/
}

```

**4. Problem 4: computational inefficiencies + anti-pattern**

- This conditional logic doesn't include all cases (`leftPriority` === `rightPriority`).
- **Solution**: Add `return 0` to the end of the function.
- We should use `leftPriority` to compare with `rightPriority` instead of `rightPriority` to compare with `leftPriority`. This helps to avoid confusion and improve readability.
- **Solution**: use `leftPriority < rightPriority` instead of `rightPriority > leftPriority`

```
   if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
```

**5. Problem 5: computational inefficiencies**

- `useMemo` depends on `balances` and `prices` variables, which means it will be re-computed when these variables change. However, the array doesn't need `prices` variable, so it may lead to unnecessary re-computation if `prices` change.
- **Solution**: remove `prices` from `useMemo` dependency array.

```
const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

```

**6. Problem 6: Anti-pattern**

- Since this function has hardcoded values and using switch statement, it's better for readability to use `object` with `key` as `blockchain` and `value` as `priority`. Then use `blockchain` as key to get `priority`.
- **Solution**: Use `object` with `key` as `blockchain` and `value` as `priority`. Then use `blockchain` as key to get `priority`.

```
const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

/*** Correct code ***/
const priorityMap = {
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
}
const priority = priorityMap['Osmosis']
```

**7. Problem 7: Anti-pattern + computational inefficiencies**

- It's bad to do computation in a `map` function when rendering a list of components because it will be re-computed when the component re-renders.
- **Solution**: Move the computation logic out of the `map` function, keeps the `map` function clean and only for rendering components.

```
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

```

**8. Problem 8: Anti-pattern**

- `formattedBalances` is not used anywhere in the code and it's not typed.
- **Solution**: Change `sortedBalances` to `formattedBalances` variable in `rows` and add type for `formattedBalances`.

```
   const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );


/*** Correct code ***/
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );
```

**9. Problem 9: Anti-pattern**
- This condition can be simplified to `balancePriority > -99 && balance.amount <= 0 ? true : false`
- **Solution**: Simplify the condition to `balancePriority > -99 && balance.amount <= 0 ? true : false`

```
 if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
```

**10. Problem 10: Anti-pattern + computational inefficiencies**
- `index` should not be used as `key` because the order of items may change, may causes performance issues.
- `classes` is not defined in the code.
- **Solution**: Use `balance.currency` as `key` instead of `index`, extract `classes` from `props` and add type for `classes`.

```
 <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
```