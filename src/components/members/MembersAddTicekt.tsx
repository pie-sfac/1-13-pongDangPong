import React, { useEffect, useState, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { styled } from 'styled-components';

import { Button } from '@components/common/Button';
import { Modal, ModalButton } from '@components/common/Modal';
import { useRequests } from '@hooks/apis/useRequests';

import { useSwrData } from '@hooks/apis/useSwrData';
import { SC } from '@styles/styles';
import theme from '@styles/theme';

export const MembersAddTicekt = ({ id, members, tickets, staffsDatas }) => {
  const navigate = useNavigate();

  const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);

  const [submitTicketData, setSubmitTicketData] = useState({
    memberIds: [id],
    serviceCount: 0,
    privateTutorId: 0,
    startAt: '',
    endAt: '',
  });

  const [ticketId, setTicketId] = useState(0);

  const { request } = useRequests();

  useEffect(() => {
    console.log(ticketId);
  }, [ticketId]);

  const addTicket = useCallback(async () => {
    try {
      await request({
        url: `tickets/${ticketId}/issue`,
        method: 'post',
        body: submitTicketData,
      });

      alert('부여완료');
    } catch (error) {
      console.error(error);
    }
  }, [ticketId, submitTicketData]);

  return (
    <S.addTicketContainer>
      <h2 className="main-title">수강권 부여</h2>
      <p className="add-ticket-username">
        수강권 부여할 회원 <span> {members?.filter(el => el.id === id)[0]?.name || '선택된 회원이 없습니다'}</span>
      </p>
      <div className="ticket-wrap wrap">
        <h3>
          수강권 선택 <span>*</span>
        </h3>
        <SC.Select
          id="ticketId"
          name="ticketId"
          onChange={e => {
            setTicketId(+e.target.value);
          }}
        >
          {tickets?.map(({ id, title }) => {
            return <option key={id} value={id}>{`${title}`}</option>;
          })}
        </SC.Select>
        {staffModalIsOpen && (
          <Modal setIsOpen={setStaffModalIsOpen}>
            {staffsDatas?.map(({ id, memberCount, memo, name, phone, rating }) => {
              return (
                <div key={id}>
                  <input
                    id={id}
                    name="privateTutorId"
                    type="radio"
                    onChange={e => {
                      e.stopPropagation();

                      setSubmitTicketData({
                        ...submitTicketData,
                        [e.target.name]: +e.target.id,
                      });
                    }}
                  />
                  <label
                    htmlFor={id}
                  >{`id :${id} 이름: ${name} 전화번호:${phone} 회원 수:${memberCount} 메모:${memo} 평가: ${rating}`}</label>
                </div>
              );
            })}
            <ModalButton onCanPlay={() => {}}>취소</ModalButton>
            <ModalButton
              $isPrimary={true}
              onClick={() => {
                setStaffModalIsOpen(false);
              }}
            >
              확인
            </ModalButton>
          </Modal>
        )}
      </div>
      <p>
        담당강사 선택 <span>*</span>
      </p>
      <div className="tutor-wrap wrap">
        <S.selectButton
          size="md"
          type="button"
          onClick={() => {
            setStaffModalIsOpen(true);
          }}
        >
          선택하기 +
        </S.selectButton>
        {staffsDatas?.filter(el => el.id === submitTicketData['privateTutorId'])[0]?.name || ''}
      </div>
      <p>
        유효기간 <span>*</span>
      </p>
      <div className="date-wrap wrap">
        <label htmlFor="startAt"></label>
        <SC.InputField
          id="startAt"
          name="startAt"
          type="date"
          onChange={({ target }) => {
            setSubmitTicketData({ ...submitTicketData, [target.name]: target.value });
          }}
        />
        <label htmlFor="endAt"></label>
        <SC.InputField
          id="endAt"
          name="endAt"
          type="date"
          onChange={({ target }) => {
            setSubmitTicketData({ ...submitTicketData, [target.name]: target.value });
          }}
        />
      </div>
      {/* 수강권 부여완료 : 선택하신 수강권의 부여가 완료되었습니다. */}
      <Button
        size="full"
        onClick={() => {
          addTicket();
        }}
      >
        완료
      </Button>
      <Button
        isPri={false}
        size="full"
        onClick={() => {
          navigate(-1);
        }}
      >
        취소
      </Button>
    </S.addTicketContainer>
  );
};

const S = {
  addTicketContainer: styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 420px;

    .wrap {
      margin-bottom: 24px;
    }

    .date-wrap {
      display: flex;
    }

    .main-title {
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 14px;
    }
    .add-ticket-username {
      text-align: center;

      & > span {
        font-weight: 700;
      }
    }
  `,
  selectButton: styled.button`
    font-size: 12px;
    padding: 5px 10px;
    background-color: ${theme.colors.White};
    color: ${theme.colors.pri[500]};
    border: 1px solid ${theme.colors.pri[500]};
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;
    outline: none;
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.pri[900]};
      color: ${theme.colors.pri[400]};
    }

    &:disabled {
      background-color: ${theme.colors.gray[800]};
      cursor: not-allowed;
      color: ${theme.colors.gray[500]};
      border: 1px solid ${theme.colors.gray[500]};
    }
  `,
};
