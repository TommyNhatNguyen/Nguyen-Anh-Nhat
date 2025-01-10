import { Player } from '@lottiefiles/react-lottie-player';
import styled from 'styled-components';
import success from '@src/assets/images/success.json';
type Props = {
  autoplay?: boolean;
  loop?: boolean;
};

const SuccessIcon = ({ autoplay = false, loop = false }: Props) => {
  return (
    <StyledSuccessWrapper>
      <StyledSuccess src={success} autoplay={autoplay} loop={loop} />
    </StyledSuccessWrapper>
  );
};

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
`;

const StyledSuccess = styled(Player)`
  width: 20%;
  height: 20%;
`;

export default SuccessIcon;
