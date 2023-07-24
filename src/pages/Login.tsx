import { Modal, ModalValueState } from '@components/common/Modal';
import { useAuth } from '@hooks/apis/useAuth';
import useInput from '@hooks/utils/useInput';
import { useModal } from '@hooks/utils/useModal';

const initForm = {
  loginId: '',
  password: '',
};

const firstModalValues: ModalValueState = {
  title: '일정 확인 필요',
  desc: '취소를 진행하시겠습니까?\n취소는 차감된 횟수가 복구됩니다.\n주의 : 일정 내용 복구 불가',
  button: [
    {
      id: 0,
      title: '아니요',
      color: false,
    },
    {
      id: 1,
      title: '예',
      color: true,
    },
  ],
};

const secondModalValues: ModalValueState = {
  title: '권한 없음',
  desc: '삭제 권한이 없습니다.\n센터관리 > 직원관리에서 권한 설정을 변경해 주세요.',
  button: [
    {
      id: 0,
      title: '확인',
      color: false,
    },
  ],
};

export const Login = () => {
  const { login, isLoading, authError } = useAuth();
  const [inputValues, handleInputChange, inputReset] = useInput(initForm);
  const [isOpen, setIsOpen] = useModal();
  const [isOpen_, setIsOpen_] = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { loginId, password } = inputValues;
    await login(loginId, password);
    inputReset(true);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>첫번째 모달 열기</button>
      <Modal modalValues={firstModalValues} setIsOpen={setIsOpen} isOpen={isOpen} />
      <button onClick={() => setIsOpen_(true)}>두번째 모달 열기</button>
      <Modal modalValues={secondModalValues} setIsOpen={setIsOpen_} isOpen={isOpen_} />
      <h1>로그인</h1>
      {!isLoading ? (
        <form onSubmit={handleSubmit}>
          <input name="loginId" placeholder="id" type="text" value={inputValues.loginId} onChange={handleInputChange} />
          <input
            autoComplete="off"
            name="password"
            placeholder="password"
            type="password"
            value={inputValues.password}
            onChange={handleInputChange}
          />
          <input
            type="submit"
            value="로그인"
            className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded mr-2"
          />
        </form>
      ) : (
        <div>Loading...</div>
      )}

      {authError && <p>{String(authError)}</p>}
    </>
  );
};

export default Login;
