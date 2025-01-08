import React, { useState } from 'react';
import {
  Dropdown,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  inputClasses,
} from '@mui/base';
import MainLayout from '@src/layouts/MainLayout';
import { BiCoin } from 'react-icons/bi';
import { CgSwap } from 'react-icons/cg';
import { StyledButtonBase, StyledButtonSubmit } from '@src/components/Button';
import styled from 'styled-components';

function App() {
  const [isRotated, setIsRotated] = useState(false);

  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
    };
  };

  const handleAfterRippleEffect = () => {
    console.log('Ripple effect completed');
    // Add your function logic here
  };
  const _onSwap = () => {
    console.log('Swap');
    setIsRotated((prevIsRotated) => !prevIsRotated);
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
                <Dropdown className="form-group__select">
                  <MenuButton className="btn btn-select">
                    <BiCoin />
                    <span>My account</span>
                  </MenuButton>
                  <Menu slots={{ listbox: 'ul' }}>
                    <MenuItem onClick={createHandleMenuClick('Profile')}>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={createHandleMenuClick('Language settings')}
                    >
                      Language settings
                    </MenuItem>
                    <MenuItem onClick={createHandleMenuClick('Log out')}>
                      Log out
                    </MenuItem>
                  </Menu>
                </Dropdown>
                <Input className="form-group__input" />
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
                <Dropdown className="form-group__select">
                  <MenuButton className="btn btn-select">
                    <BiCoin />
                    <span>My account</span>
                  </MenuButton>
                  <Menu slots={{ listbox: 'ul' }}>
                    <MenuItem onClick={createHandleMenuClick('Profile')}>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={createHandleMenuClick('Language settings')}
                    >
                      Language settings
                    </MenuItem>
                    <MenuItem onClick={createHandleMenuClick('Log out')}>
                      Log out
                    </MenuItem>
                  </Menu>
                </Dropdown>
                <Input className="form-group__input" />
              </StyledFormGroup>
            </StyledCard>
          </StyledSwapFormCards>
          <StyledSubmitContainer className="swap-form__submit">
            <div className="swap-form__submit-info">
              <p className="info">
                <span>1 ETH </span> = <span>1000 USD</span>
              </p>
            </div>
            <StyledButtonSubmit
              className="btn btn-submit"
              onClick={handleAfterRippleEffect}
            >
              Confirm swap
            </StyledButtonSubmit>
          </StyledSubmitContainer>
        </StyledSwapForm>
      </div>
    </MainLayout>
  );
}

const StyledSwapForm = styled.div`
  width: 100%;
  /* max-width: 500px; */
  margin: 0 auto;
  border: 1px solid black;
  padding: 20px;
  border-radius: 12px;
  position: relative;
  background-color: #ededed;
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
  overflow: hidden;
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

export default App;
