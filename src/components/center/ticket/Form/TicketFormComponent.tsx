import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { LessonTypeEnum, TermUnitEnum, Ticket_put_body, Tickets_request, tickets_create } from '@apis/ticketsAPIs';
import { Button } from '@components/common/Button';
import useInput from '@hooks/utils/useInput';
import {
  FormButtonGroup,
  FormGridContainer,
  FormToggleWrap,
  InputCountStyle,
  LabelNotice,
} from '@styles/center/ticketFormStyle';
import { FormContentWrap, SC, TopTitleWrap } from '@styles/styles';

import { InputField, Unit } from './InputField';
import { SelectField } from './SelectField';

export type TicketFormDataType = Tickets_request | Ticket_put_body;

export interface TicketFormProps {
  initialData?: Tickets_request;
  onSubmit: (data: TicketFormDataType) => Promise<void> | void;
  isEditMode?: boolean;
}

export interface ValidationErrors {
  [key: string]: boolean;
}

export const TicketFormComponent: React.FC<TicketFormProps> = ({
  initialData = tickets_create.body,
  onSubmit,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const [inputValues, onChange, inputReset] = useInput({ ...initialData });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [count, setCount] = useState(0);
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({ termToggle: true, countToggle: true });

  useEffect(() => {
    inputReset(initialData);
    setToggles({
      termToggle: isEditMode ? !initialData.defaultTerm : false,
      countToggle: isEditMode ? !initialData.defaultCount : false,
    });
    setCount(0);
  }, [initialData, inputReset, setToggles, isEditMode]);

  const toggleHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    setToggles(prev => ({
      ...prev,
      termToggle: name === 'termToggle' ? !prev.termToggle : false,
      countToggle: name === 'countToggle' ? !prev.countToggle : false,
    }));
  };

  // 에러 체크
  const checkForErrors = () => {
    const errors: ValidationErrors = {};
    if (inputValues.title === '') errors['title'] = true;
    if (!toggles.termToggle && Number(inputValues.defaultTerm) === 0) errors['defaultTerm'] = true;
    if (Number(inputValues.duration) === 0) errors['duration'] = true;
    if (!toggles.countToggle && Number(inputValues.defaultCount) === 0) errors['defaultCount'] = true;

    return errors;
  };

  // 에러 상태 업데이트
  const validateInputs = () => {
    const errors = checkForErrors();
    setValidationErrors(errors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateInputs();
    const errors = checkForErrors();
    const isError = Object.keys(errors).length !== 0;

    if (!isError) {
      // 소진시까지, 무제한 클릭 시
      let valuesCopy;

      if (isEditMode) {
        valuesCopy = {
          defaultCount: inputValues.defaultCount,
          defaultTerm: inputValues.defaultTerm,
          defaultTermUnit: inputValues.defaultTermUnit,
          maxServiceCount: inputValues.maxServiceCount,
        } as Ticket_put_body;
      } else {
        valuesCopy = { ...inputValues } as Tickets_request;
      }

      const { termToggle, countToggle } = toggles;
      if (termToggle) {
        delete valuesCopy.defaultTerm;
        delete valuesCopy.defaultTermUnit;
      } else if (countToggle) {
        delete valuesCopy.defaultCount;
      }

      try {
        onSubmit(valuesCopy);
        navigate('/center/tickets');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <FormContentWrap>
      <TopTitleWrap>
        <h3>{isEditMode ? '수강권 정보 설정' : '수강권 생성'}</h3>
        <p>{isEditMode ? '센터의 수강권을 수정하세요' : '센터의 수강권을 생성하세요'}</p>
      </TopTitleWrap>
      <form method="post" onSubmit={handleSubmit}>
        <FormGridContainer>
          <div>
            <SelectField
              className="required"
              disabled={isEditMode}
              label="수업 유형"
              name="lessonType"
              options={[{ value: 'SINGLE', label: LessonTypeEnum['SINGLE'] }]}
              value={inputValues.lessonType}
              onChange={onChange}
            />
          </div>
          <div>
            <InputField
              className="required"
              disabled={isEditMode}
              error={validationErrors.title}
              label="수강권명"
              name="title"
              placeholder="수강권명"
              type="text"
              value={inputValues.title}
              onChange={onChange}
            />
          </div>
          <div>
            <SC.Label className="required" htmlFor="defaultTerm">
              수강권 기간
            </SC.Label>
            <div className="row-input">
              <InputField
                disabled={toggles.termToggle}
                error={validationErrors.defaultTerm}
                name="defaultTerm"
                placeholder="0"
                type="text"
                value={inputValues.defaultTerm}
                onChange={onChange}
              />
              <SelectField
                disabled={toggles.termToggle}
                name="defaultTermUnit"
                value={inputValues.defaultTermUnit || 'DAY'}
                options={[
                  { value: 'DAY', label: TermUnitEnum['DAY'] },
                  { value: 'WEEK', label: TermUnitEnum['WEEK'] },
                  { value: 'MONTH', label: TermUnitEnum['MONTH'] },
                  { value: 'YEAR', label: TermUnitEnum['YEAR'] },
                ]}
                onChange={onChange}
              />
            </div>
            <FormToggleWrap>
              <p>소진시까지</p>
              <button className="toggle-box" name="termToggle" type="button" onClick={toggleHandler}>
                <div className={`toggle-container ${toggles.termToggle ? 'toggle--checked' : null}`} />
                <div className={`toggle-circle ${toggles.termToggle ? 'toggle--checked' : null}`} />
              </button>
            </FormToggleWrap>
          </div>
          <div>
            <InputField
              className="required"
              disabled={isEditMode}
              error={validationErrors.duration}
              label="시간"
              name="duration"
              placeholder="0"
              type="text"
              unit="분"
              value={inputValues.duration}
              onChange={onChange}
            />
          </div>
          <div>
            <InputField
              className="required"
              disabled={toggles.countToggle}
              error={validationErrors.defaultCount}
              label="기본횟수"
              name="defaultCount"
              placeholder="0"
              type="text"
              unit="회"
              value={inputValues.defaultCount}
              onChange={onChange}
            />
            <FormToggleWrap>
              <p>무제한</p>
              <button className="toggle-box" name="countToggle" type="button" onClick={toggleHandler}>
                <div className={`toggle-container ${toggles.countToggle ? 'toggle--checked' : null}`} />
                <div className={`toggle-circle ${toggles.countToggle ? 'toggle--checked' : null}`} />
              </button>
            </FormToggleWrap>
          </div>
          <div>
            <SC.Label htmlFor="maxServiceCount">
              서비스 횟수<LabelNotice>서비스로 부여되는 횟수를 제한하여 설정할 수 있습니다.</LabelNotice>
            </SC.Label>
            <InputCountStyle>
              <button
                type="button"
                onClick={() => {
                  if (count > 0 && !toggles.countToggle) setCount(prev => prev - 1);
                }}
              >
                -
              </button>
              <Unit>
                <SC.InputField
                  readOnly
                  disabled={toggles.countToggle}
                  id="maxServiceCount"
                  name="maxServiceCount"
                  style={{ textAlign: 'center' }}
                  value={count + ' 회'}
                  onChange={onChange}
                />
              </Unit>
              <button
                type="button"
                onClick={() => {
                  if (!toggles.countToggle) setCount(prev => prev + 1);
                }}
              >
                +
              </button>
            </InputCountStyle>
          </div>
        </FormGridContainer>
        <FormButtonGroup>
          <Button isPri={false} size="full" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
          <Button size="full" type="submit">
            완료
          </Button>
        </FormButtonGroup>
      </form>
    </FormContentWrap>
  );
};