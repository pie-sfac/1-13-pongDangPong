import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { TicketListResponse } from '@apis/types/ticketsTypes';
import { TicketIcon } from '@assets/icons/indexIcons';
import { Button } from '@components/common/Button';
import { useRequests } from '@hooks/apis/useRequests';
import { useSwrData } from '@hooks/apis/useSwrData';
import { NoneDisplay, TicketContainer, TicketWrap, Top } from '@styles/common/ticketsStyle';

import { TicketItem } from './TicketItem';

export const TicketList = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useSwrData<{ tickets: TicketListResponse[] }>('tickets');
  const [searchParams, setSearchParams] = useSearchParams();
  const isActivePath = searchParams.get('isActive') === 'true' || searchParams.get('isActive') === null;
  const [tickets, setTickets] = useState<TicketListResponse[]>([]);
  const { request } = useRequests();

  useEffect(() => {
    setTickets(data?.tickets || []);
  }, [data]);

  // 판매중, 판매종료로 받는 API가 없어 직접 데이터 조작
  const activeList = useMemo(() => tickets?.filter((v: TicketListResponse) => v.isActive === true) || [], [tickets]);
  const noneActiveList = useMemo(() => tickets.filter((v: TicketListResponse) => v.isActive !== true) || [], [tickets]);
  const displayedList = useMemo(() => {
    if (isActivePath === false) return noneActiveList;
    else return activeList;
  }, [isActivePath, activeList, noneActiveList]);

  const activateTicket = async (ticketId: number) => {
    try {
      await request({
        url: `tickets/${ticketId}/activate`,
        method: 'post',
      });
    } catch (error) {
      console.error('판매 가능 요청 실패:', error);
    }
  };

  const deactivateTicket = async (ticketId: number) => {
    try {
      await request({
        url: `tickets/${ticketId}/deactivate`,
        method: 'post',
      });
    } catch (error) {
      console.error('판매 종료 요청 실패:', error);
    }
  };

  const ticketStatus = async (id: number) => {
    const ticket = tickets.find((ticket: TicketListResponse) => ticket.id === id);
    if (ticket?.isActive) {
      await deactivateTicket(id);
    } else {
      await activateTicket(id);
    }

    const updatedTickets = tickets.map((ticket: TicketListResponse) => {
      if (ticket.id === id) {
        return {
          ...ticket,
          isActive: !ticket.isActive,
        };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  const deleteTicket = async (ticketId: number) => {
    try {
      await request({
        url: `tickets/${ticketId}`,
        method: 'delete',
      });
      const updatedTickets = tickets.filter((ticket: TicketListResponse) => ticket.id !== ticketId);
      setTickets(updatedTickets);
    } catch (error) {
      console.error('티켓 삭제 요청 실패:', error);
    }
  };

  return (
    <>
      <TicketContainer>
        <Top>
          <div className="ticket-active">
            <Link className={isActivePath ? 'on' : ''} to="?isActive=true">{`판매중(${activeList.length})`}</Link>
            <Link
              className={!isActivePath ? 'on' : ''}
              to="?isActive=false"
            >{`판매종료(${noneActiveList.length})`}</Link>
          </div>
          <Button
            onClick={() => {
              navigate('new');
            }}
          >
            + 수강권 추가
          </Button>
        </Top>

        {!isLoading && (
          <TicketWrap>
            {Array.from({ length: displayedList.length }, (_, i) => displayedList[displayedList.length - 1 - i]).map(
              (ticket: TicketListResponse) => {
                return (
                  <TicketItem key={ticket.id} deleteTicket={deleteTicket} ticket={ticket} ticketStatus={ticketStatus} />
                );
              }
            )}
          </TicketWrap>
        )}

        {isError && <p>{isError.response?.data.message}</p>}
      </TicketContainer>

      {displayedList.length === 0 && (
        <>
          <NoneDisplay>
            <div className="none-d-icon">
              <TicketIcon />
            </div>
            <div className="text">{isActivePath ? '판매 중인' : '판매 종료된'} 수강권이 없습니다!</div>
          </NoneDisplay>
        </>
      )}
    </>
  );
};
