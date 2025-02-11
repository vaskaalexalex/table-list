/// <reference types="vite-plugin-svgr/client" />

import { FC, Fragment } from 'react';
import styled, { css } from 'styled-components';
import ArrowUpIcon from '@icons/arrow-up.svg?react';
import ArrowDownIcon from '@icons/arrow-down.svg?react';


const HEADER_CONFIG = [
  { title: 'Тип', size: 54 },
  { key: 'date', title: 'Время', size: 88 },
  { title: 'Сотрудник', size: 129 },
  { title: 'Звонок', size: 325 },
  { title: 'Источник', size: 214 },
  { title: 'Оценка', size: 230 },
  { key: 'duration', title: 'Длительность', size: 300 },
];

const HeaderContent = styled.div`
    display: flex;
    justify-content: start;
    gap: 6px;
`;

const HeaderCellWrapper = styled.th<{ size?: number }>(
  ({ size }) => css`
      height: 34px;
      min-width: ${size}px;
      white-space: nowrap;
      color: #5E7793;
      cursor: pointer;

      &:last-child {
          ${HeaderContent} {
              justify-content: end;
          }
      }
  `,
);


const TableHeader: FC<{
  onSort: (key: string) => void,
  sortConfig: { key: string | undefined; direction: 'ASC' | 'DESC' | undefined }
}> = ({ onSort, sortConfig }) => {

  return (
    <Fragment>
      {HEADER_CONFIG.map(({ key, title, size }) => (
        <HeaderCellWrapper
          key={title}
          size={size}
          onClick={key ? () => onSort(key) : undefined}
        >
          <HeaderContent>
            {title} {key && (
            <Fragment>
              {sortConfig.key === key ? (sortConfig.direction === 'ASC' ? <ArrowUpIcon /> : <ArrowDownIcon />) : ''}
            </Fragment>
          )}
          </HeaderContent>
        </HeaderCellWrapper>
      ))}
    </Fragment>
  );
};

export { TableHeader };