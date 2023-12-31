import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { MemberIcon } from '@assets/icons/indexIcons';
import { Button } from '@components/common/Button';
import { Modal } from '@components/common/Modal';
import { useRequests } from '@hooks/apis/useRequests';
import { useSwrData } from '@hooks/apis/useSwrData';
import { FormButtonGroup, FormGridContainer } from '@styles/common/FormStyle';
import { SC } from '@styles/common/inputsStyles';
import { FormContentWrap, TopTitleWrap } from '@styles/common/wrapStyle';
import { ModalList } from '@styles/modal/modalStyle';
import theme from '@styles/theme';

import { NameButton } from './CreateSchedule';

type FormInputs = {
  userId: number;
  memberId: number;
  clientName: string;
  clientPhone: string;
  memo: string;
  date: string;
  startTime: string;
  endTime: string;
  startAt: string;
  endAt: string;
};

const initialInputs: FormInputs = {
  userId: 0,
  memberId: 0,
  clientName: '',
  clientPhone: '',
  memo: '',
  date: '',
  startTime: '',
  endTime: '',
  startAt: '',
  endAt: '',
};

interface UserData {
  id: number;
  type: string;
  loginId: string;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginedAt: string;
}

export const CreateCounseling = () => {
  const [formInputs, setFormInputs] = useState<FormInputs>(initialInputs);
  const { data, isLoading, isError } = useSwrData('search?resource=USER');
  const navigate = useNavigate();
  const { request } = useRequests();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    switch (target.name) {
      case 'clientPhone':
        target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        break;
    }
    setFormInputs({ ...formInputs, [target.name]: target.value });
  };

  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
    console.log(data);
  };

  const handleUserSelect = (userId: number, userName: string) => {
    setFormInputs({ ...formInputs, userId });
    setSelectedUserName(userName);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const clientPhone = formInputs.clientPhone.replace(/-/g, '');
    const date = formInputs.date.replace(/\./g, '-');
    const startTime = formInputs.startTime;
    const endTime = formInputs.endTime;

    const startAt = new Date(`${date}T${startTime}:00`).toISOString();
    const endAt = new Date(`${date}T${endTime}:00`).toISOString();

    const payload = {
      userId: formInputs.userId,
      memberId: formInputs.memberId,
      clientName: formInputs.clientName,
      clientPhone: clientPhone,
      memo: formInputs.memo,
      startAt: startAt,
      endAt: endAt,
    };

    try {
      await request({
        url: 'schedules/counseling',
        method: 'post',
        body: payload,
      });
      console.log('등록 완료');
      navigate('/schedule');
      setFormInputs(initialInputs);
    } catch (error) {
      console.error(error);
    }
  };

  const isValid = () => {
    const { clientName, clientPhone, date, startTime, endTime } = formInputs;
    return clientName && clientPhone && date && startTime && endTime;
  };

  useEffect(() => {
    console.log(formInputs);
  }, [formInputs]);

  return (
    <FormContentWrap>
      <TopTitleWrap>
        <h3>상담 일정 생성</h3>
        <p>상담 일정을 생성합니다.</p>
      </TopTitleWrap>
      <FormGridContainer>
        <div>
          <SC.Label>
            담당 강사 선택 <span></span>
          </SC.Label>
          <div className="button-container">
            <SelectButton disabled={!!selectedUserName} onClick={handleSearchClick}>
              선택하기 +
            </SelectButton>

            {selectedUserName && (
              <NameButton onClick={() => setSelectedUserName('')}>
                <span className="user-name">{selectedUserName}</span>
                <span
                  className="close-button"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedUserName(null)}
                  onKeyDown={e => e.key === 'Enter' && setSelectedUserName(null)}
                >
                  x
                </span>
              </NameButton>
            )}
          </div>
          {isOpen && (
            <Modal maxWidth="43rem" setIsOpen={setIsOpen}>
              {isLoading ? (
                <div>데이터를 불러오는 중...</div>
              ) : isError ? (
                <div>오류가 발생했습니다.</div>
              ) : (
                <ul>
                  <ModalList>
                    <button className="table-title" type="button">
                      <p className="left">
                        <p>목록</p>
                        <p></p>
                        <p>이름/아이디</p>
                      </p>
                      <p>핸드폰 번호</p>
                    </button>
                  </ModalList>
                  {data?.users.map((user: UserData, index: number) => (
                    <ModalList key={index}>
                      <button type="button" onClick={() => handleUserSelect(user.id, user.name)}>
                        <p className="left">
                          <MemberIcon />
                          <p className="tag">{user.type === 'ADMIN' ? '관리자' : '직원'}</p>
                          <p className="info">
                            {user.name} <span>{user.loginId}</span>
                          </p>
                        </p>
                        <p>{user.phone}</p>
                      </button>
                    </ModalList>
                  ))}
                </ul>
              )}
            </Modal>
          )}
        </div>
        <div>
          <SC.Label>
            일자 선택 <span></span>
          </SC.Label>
          <SC.InputField
            maxLength={10}
            name="date"
            type="date"
            onChange={e => {
              handleInputChange(e);
            }}
          />
        </div>
        <div>
          <SC.Label>
            시간 선택 <span></span>
          </SC.Label>
          <div className="time-inputs">
            <SC.InputField
              maxLength={5}
              name="startTime"
              type="time"
              onChange={e => {
                handleInputChange(e);
              }}
            />
            ~
            <SC.InputField
              maxLength={5}
              name="endTime"
              type="time"
              onChange={e => {
                handleInputChange(e);
              }}
            />
          </div>
        </div>
        <div>
          <SC.Label>
            이름 <span></span>
          </SC.Label>
          <SC.InputField
            maxLength={10}
            name="clientName"
            placeholder="이름을 입력하세요."
            type="text"
            onChange={e => {
              handleInputChange(e);
            }}
          />
        </div>
        <div>
          <SC.Label>
            연락처 <span></span>
          </SC.Label>
          <SC.InputField
            maxLength={13}
            name="clientPhone"
            placeholder="000-0000-0000"
            type="tel"
            onChange={e => {
              handleInputChange(e);
            }}
          />
        </div>
        <div>
          <SC.Label>일정 메모</SC.Label>
          <SC.InputField
            maxLength={500}
            name="memo"
            placeholder="내용을 입력해주세요. (500자 이내)"
            type="text"
            onChange={e => {
              handleInputChange(e);
            }}
          />
        </div>
      </FormGridContainer>

      <FormButtonGroup>
        <Button isPri={false} size="full" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
        <Button
          disabled={!isValid()}
          size="full"
          onClick={e => {
            handleSubmit(e);
          }}
        >
          완료
        </Button>
      </FormButtonGroup>
    </FormContentWrap>
  );
};

const SelectButton = styled.button`
  font-size: 14px;
  padding: 8px 16px;
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
`;

const S = {
  Container: styled.div`
    grid-template-rows: repeat(4, minmax(100px, 1fr));
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    grid-auto-flow: column;
    row-gap: 0.5rem;
    column-gap: 3rem;

    h2 {
      text-align: center;
      font-weight: 600;
      font-size: ${({ theme: { font } }) => font['main']};
    }
    p {
      margin-bottom: 62px;
      text-align: center;
    }
  `,
  wrap: styled.div`
    display: flex;
    max-width: 1024px;
    width: 100%;
    margin-top: 1rem;
    padding-inline: 1rem;
    gap: 3rem;

    span {
      color: ${({ theme: { colors } }) => colors['Pri-400']};
    }

    .button-wrap {
      margin-bottom: 30px;

      button[type='button'] {
        width: 70px;
        height: 36px;
        border: 1px solid #cfcfcf;
        border-radius: 4px;
        margin-right: 6px;

        &.on {
          background-color: blue;
        }
      }
    }
    .button-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .time-inputs {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .time-inputs > input {
      width: 45%;
    }

    .first-column,
    .second-column {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
    }
  `,

  BtnWrap: styled.div`
    margin-top: 2rem;
    display: flex;
    gap: 3rem;
    padding-inline: 1rem;
  `,
};

export default CreateCounseling;
