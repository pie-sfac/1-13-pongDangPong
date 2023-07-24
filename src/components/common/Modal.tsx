import x from '@assets/icon/x.svg';
import { Dispatch, FC, SetStateAction, memo, useCallback } from 'react';
import { css, keyframes, styled } from 'styled-components';

interface ModalProps {
  modalValues: ModalValueState;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

export interface ModalValueState {
  title: string;
  desc: string;
  button: { id: number; title: string; color: boolean }[];
}

const ModalComponent: FC<ModalProps> = ({ modalValues, setIsOpen, isOpen }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.target === event.currentTarget) setIsOpen(false);
    },
    [setIsOpen]
  );

  return (
    <>
      <S.ModalBackground $isOpen={isOpen} onClick={handleClose}>
        <S.ModalContent onClick={e => e.stopPropagation()}>
          <S.CloseButton onClick={() => setIsOpen(false)}>
            <img alt="close" src={x} />
          </S.CloseButton>
          <S.Title>{modalValues.title}</S.Title>
          <S.Description>{modalValues.desc}</S.Description>
          <S.ButtonWrapper>
            {modalValues.button.map(v => (
              <S.ModalButton key={v.id} $isPrimary={v.color} onClick={() => setIsOpen(false)}>
                {v.title}
              </S.ModalButton>
            ))}
          </S.ButtonWrapper>
        </S.ModalContent>
      </S.ModalBackground>
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const S = {
  ModalBackground: styled.div<{ $isOpen: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    animation: ${props =>
      props.$isOpen
        ? css`
            ${fadeIn} 0.5s
          `
        : css`
            ${fadeOut} 0.5s
          `};
    transition: opacity 0.5s;
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  `,

  ModalContent: styled.div`
    position: relative;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors['Gray-600']};
    max-height: 100%;
    width: 100%;
    max-width: 28rem;
    overflow-y: auto;
    border-radius: 0.5rem;
    padding: 3rem 2.5rem 2.5rem 2.5rem;
  `,

  CloseButton: styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
  `,

  Title: styled.p`
    ${({ theme }) => {
      const { colors, fontSizeRem } = theme;
      return `
        margin-bottom: 1rem;
        font-size: ${fontSizeRem.subTitle};
        font-weight: 800;
        color: ${colors['Gray-50']};
      `;
    }}
  `,

  Description: styled.p`
    color: ${({ theme }) => theme.colors['Gray-50']};
    white-space: pre-wrap;
    margin-bottom: 1.5rem;
    font-size: ${({ theme }) => theme.fontSizeRem.bodyText};
  `,

  ButtonWrapper: styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  `,

  ModalButton: styled.button<{ $isPrimary: boolean }>`
    ${({ theme, $isPrimary }) => {
      const { colors, fontSizeRem } = theme;
      const bgColor = $isPrimary ? colors['Pri-500'] : colors['Gray-800'];
      const hoverColor = $isPrimary ? colors['Pri-400'] : colors['Gray-700'];
      const ringColor = $isPrimary ? colors['Pri-800'] : colors['Gray-800'];
      const textColor = $isPrimary ? colors['White'] : colors['Gray-50'];

      return `
      max-width: 10rem;
      padding: 0.75rem;
      background-color: ${bgColor};
      &:hover {
        background-color: ${hoverColor};
      }
      color: ${textColor};
      border-radius: 0.375rem;
      width: 100%;
      transition: background-color 0.2s ease-in-out;
      outline: none;
      &:focus {
        ring: 2px;
        ring-offset: 2px;
        ring-color: ${ringColor};
      }
      font-size: ${fontSizeRem.details};
    `;
    }}
  `,
};

export const Modal = memo(ModalComponent);
