import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ArrowIcon, BackIcon } from '@assets/icons/indexIcons';
import { useSwrData } from '@hooks/apis/useSwrData';
import { usePagination } from '@hooks/utils/usePagination';
import { BackButton } from '@styles/common/buttonStyle';
import { Pagination } from '@styles/common/paginaionStyle';
import { BasicContainer, SearchListWrap, TopContainer } from '@styles/common/wrapStyle';
import { MemberTopTitle } from '@styles/pages/memberStyle';

import { MemberItem, UserItem, SearchMemberType, SearchUserType } from './SearchItem';

type SearchResponse = {
  searchParam: {
    query: string;
    resources: string[];
  };
  members: {
    id: number;
    name: string;
    phone: string;
    sex: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
    visitedAt: string;
  }[];
  users: {
    id: number;
    type: string;
    loginId: string;
    name: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginedAt: string;
  }[];
  message: string;
};

export const SearchResult = () => {
  const { pathname, search } = useLocation();
  const newPathname = pathname.replace('/home', '');
  const requestPath = `${newPathname}${search}`;
  const { data, isLoading, isError } = useSwrData<SearchResponse>(requestPath);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const { currentPage, totalPages, pageRange, setCurrentPage, updatePageRange } = usePagination(
    totalCount,
    itemsPerPage,
    10
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const allItems = [...(data?.members || []), ...(data?.users || [])];
  const paginatedItems = allItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (data) {
      setTotalCount(allItems.length);
    }
  }, [data]);

  if (isError) return <div>에러가 발생했습니다.</div>;
  if (isLoading) return <div>로딩 중...</div>;
  if (!data || (data?.members.length === 0 && data?.users.length === 0)) return <div>검색 결과가 없습니다.</div>;

  return (
    <>
      <BasicContainer>
        <>
          <TopContainer>
            <MemberTopTitle>
              <h3>
                검색 결과 <span className="highlight">{totalCount}</span>
              </h3>
            </MemberTopTitle>
            <BackButton onClick={() => navigate(-1)}>
              <BackIcon />
              <p>뒤로가기</p>
            </BackButton>
          </TopContainer>
          <SearchListWrap>
            <div className="table">
              <div className="table-row title">
                <p>이름</p>
                <p>전화번호</p>
                <p>등록일</p>
              </div>
              {paginatedItems.map(item => {
                return 'loginId' in item ? (
                  <UserItem key={item.id} user={item as SearchUserType} />
                ) : (
                  <MemberItem key={item.id} member={item as SearchMemberType} />
                );
              })}
              {totalPages > 1 && (
                <Pagination>
                  {pageRange[0] > 1 && (
                    <button
                      className="pageBtn prev"
                      type="button"
                      onClick={() => {
                        updatePageRange('prev');
                        scrollToTop();
                      }}
                    >
                      <ArrowIcon />
                    </button>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => pageNum >= pageRange[0] && pageNum <= pageRange[1])
                    .map(pageNum => (
                      <button
                        key={pageNum}
                        className={`pageBtn ${currentPage === pageNum ? 'on' : ''}`}
                        disabled={currentPage === pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          scrollToTop();
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  {pageRange[1] < totalPages && (
                    <button
                      className="pageBtn next"
                      type="button"
                      onClick={() => {
                        updatePageRange('next');
                        scrollToTop();
                      }}
                    >
                      <ArrowIcon />
                    </button>
                  )}
                </Pagination>
              )}
            </div>
          </SearchListWrap>
        </>
      </BasicContainer>
    </>
  );
};