import { Player } from '@lottiefiles/react-lottie-player';
import loader from '@src/assets/images/loader.json';
import styled from 'styled-components';
type LoadingComponentPropsType = {
  loading: boolean;
  children?: React.ReactNode;
};

const LoadingComponent = ({
  loading = false,
  children,
}: LoadingComponentPropsType) => {
  return (
    <LoadingComponentWrapper $loading={loading}>
      {children ? children : <Loader autoplay loop src={loader} />}
    </LoadingComponentWrapper>
  );
};

export const LoadingComponentWrapper = styled.div<{ $loading: boolean }>`
  display: ${({ $loading }) => ($loading ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: var(--bg-white);
`;

const Loader = styled(Player)`
  height: 40%;
  width: 40%;
  min-width: 200px;
  min-height: 200px;
`;

export default LoadingComponent;
