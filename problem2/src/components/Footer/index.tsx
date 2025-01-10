import styled from 'styled-components';

type FooterPropsType = {};

const Footer = ({}: FooterPropsType) => {
  return (
    <StyledFooter className="container-fluid">
      <p>
        <span>© 2025 - </span>
        <span>Nguyen Anh Nhat (Tommy Nguyen)</span>
      </p>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  p {
    text-align: center;
    span {
      font-family: var(--ff-medium);
    }
  }
`;

export default Footer;
