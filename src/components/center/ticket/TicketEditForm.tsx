import { useNavigate, useParams } from 'react-router-dom';

import { TicketListResponse } from '@apis/types/ticketsTypes';
import { TicketFormComponent, TicketFormDataType } from '@components/center/ticket/TicketFormComponent';
import { NoticeModal } from '@components/common/NoticeModal';
import { useRequests } from '@hooks/apis/useRequests';
import { useSwrData } from '@hooks/apis/useSwrData';
import { useErrorModal } from '@hooks/utils/useErrorModal';

export const TicketEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useSwrData<TicketListResponse>(`tickets/${id}`);
  const { request } = useRequests();
  const { closeErrorModal, errorModal, handleAxiosError, isErrorModalOpen } = useErrorModal();

  if (isLoading) {
    return null;
  }

  const onSubmit = async (data: TicketFormDataType) => {
    try {
      await request({ url: 'tickets', method: 'put', path: `/${id}`, body: data });
      navigate('/center/tickets');
    } catch (error) {
      handleAxiosError(error, `티켓 수정 오류`);
    }
  };

  return (
    <>
      {data && (
        <TicketFormComponent
          isEditMode
          initialData={{
            ...data,
            duration: data.duration || data.bookableLessons[0].duration,
            defaultCount: data.defaultCount || 0,
            defaultTerm: data.defaultTerm || 0,
            maxServiceCount: data.maxServiceCount || 0,
          }}
          onSubmit={onSubmit}
        />
      )}
      {isErrorModalOpen && <NoticeModal innerNotice={errorModal} setIsOpen={closeErrorModal} />}
    </>
  );
};
