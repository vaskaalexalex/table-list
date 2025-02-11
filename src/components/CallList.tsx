import { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getCalls } from '../api';
import { PlayerCell } from './PlayerCell.tsx';
import { CallFilters } from './Filters.tsx';
import { TypeCell } from './TypeCell.tsx';
import { GradeCell } from './GradeCell.tsx';
import { TableHeader } from './TableHeader.tsx';
import { Loader } from './Loader.tsx';
import { IFilters } from '../types.ts';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
`;

const TableContainer = styled.div`
    background: #ffff;
    min-height: 100vh;
    padding: 0 16px 16px;
    border-radius: 8px;
`;

const Table = styled.table`
    width: 100%;
    max-width: 1440px;
    height: 100%;
    table-layout: auto;
    border-collapse: collapse;
`;

export const TableRow = styled.tr`
    height: 65px;
    border-bottom: 1px solid #EAF0FA;

    > td {
        font-size: 15px;
        color: #122945;

        &:last-child {
            text-align: right;
        }
    }

    &:hover td {
        background: #D4DFF3;
    }
`;

const CallList = () => {
  const [filters, setFilters] = useState<IFilters>({});
  const [sortConfig, setSortConfig] = useState<{ key: string | undefined; direction: 'ASC' | 'DESC' | undefined }>({
    key: undefined,
    direction: undefined,
  });
  const [hoveredCallId, setHoveredCallId] = useState<number | null>(null);

  const { data: calls, isLoading, error } = useQuery({
    queryKey: ['calls', filters, sortConfig],
    queryFn: () =>
      getCalls(
        filters.dateStart,
        filters.dateEnd,
        filters.inOut,
        sortConfig.key,
        sortConfig.direction,
      ),
  });

  const handleFilterChange = (newFilters: IFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // Показывается загрузка только при первом рендере
  if (isLoading && Object.values(sortConfig).filter(Boolean).length === 0 && Object.values(filters).length === 0) {
    return <Loader />;
  }

  if (error) return <p>Ошибка загрузки данных</p>;


  return (
    <MainContainer>
      <CallFilters onFilterChange={handleFilterChange} />
      <TableContainer>
        <Table>
          <thead>
          <TableRow>
            <TableHeader onSort={handleSort} sortConfig={sortConfig} />
          </TableRow>
          </thead>
          <tbody>
          {Object.values(filters).length > 0 && calls?.length === 0 ? (
              <p>Ничего не найдено</p>)
            : (
              <Fragment>
                {calls?.map((call) => (
                  <TableRow
                    key={call.id}
                    onMouseEnter={() => setHoveredCallId(call.id)}
                    onMouseLeave={() => setHoveredCallId(null)}
                  >
                    <td><TypeCell isIncoming={Boolean(call.in_out)} /></td>
                    <td>{new Date(call.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><img style={{ borderRadius: '50%' }} alt="Фото сотрудника" src={call.person_avatar} /></td>
                    <td>{call.from_number}</td>
                    <td>{call.source}</td>
                    <td><GradeCell /></td>
                    <td>{<PlayerCell isHovered={hoveredCallId === call.id} call={call} />}</td>
                  </TableRow>
                ))}
              </Fragment>)}
          </tbody>
        </Table>
      </TableContainer>
    </MainContainer>
  );
};

export { CallList };
