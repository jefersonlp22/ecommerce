import styled from "styled-components";

const desktop = '200px';
const tablet = '250px';
const mobile = 'calc(100vh - 130px)';

const NavContainer = styled.div<{ open: boolean }>`
  @media ${({ theme }) => theme.media.mobileS} {
    height: ${({ open }) => (open ? "100%" : '')};
    max-height: ${({ open }) => (open ? mobile : 0)};
  }

  @media ${({ theme }) => theme.media.tablet} {
    max-height: ${({ open }) => (open ? tablet : 0)};
  }

  @media ${({ theme }) => theme.media.laptop} {
    max-height: ${({ open }) => (open ? desktop : 0)};
  }
`;

const NavContent = styled.div`
  background-color: var(--color-secondary);

  @media ${({ theme }) => theme.media.mobileS} {
    min-height: ${mobile};
  }

  @media ${({ theme }) => theme.media.tablet} {
    min-height: auto;
    height: ${tablet};
  }

  @media ${({ theme }) => theme.media.laptop} {
    height: ${desktop};
  }
`;

export { NavContainer, NavContent };
