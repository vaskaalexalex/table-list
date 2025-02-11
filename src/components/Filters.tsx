/// <reference types="vite-plugin-svgr/client" />

import { FC, useState } from 'react';
import styled from 'styled-components';
import ArrowUpIcon from '@icons/arrow-up.svg?react';
import ArrowDownIcon from '@icons/arrow-down.svg?react';
import ArrowLeftIcon from '@icons/arrow-left.svg?react';
import ArrowRightIcon from '@icons/arrow-right.svg?react';
import CalendarIcon from '@icons/calendar.svg?react';

import { IFilters } from '../types.ts';

const dateOptions = ['3 дня', 'Неделя', 'Месяц', 'Год'];
const typeOptions = ['Все типы', 'Входящие', 'Исходящие'];

const FilterContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const Dropdown = styled.div`
    position: relative;
    cursor: pointer;
`;

const SelectedOption = styled.div`
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const Options = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-width: 100px;
    padding: 8px 0;
    z-index: 10;
`;

const Option = styled.div`
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
        background: #e8efff;
    }
`;

const CallFilters: FC<{ onFilterChange: (filters: IFilters) => void }> = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState('3 дня');
  const [callType, setCallType] = useState('Все типы');
  const [dateOpen, setDateOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const getDateRangeValues = (range: string) => {
    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case '3 дня':
        startDate.setDate(now.getDate() - 3);
        break;
      case 'Неделя':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Месяц':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'Год':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return { dateStart: undefined, dateEnd: undefined };
    }

    return {
      dateStart: startDate.toISOString().split('T')[0],
      dateEnd: now.toISOString().split('T')[0],
    };
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setDateOpen(false);

    if (range !== 'Указать даты') {
      const { dateStart, dateEnd } = getDateRangeValues(range);
      onFilterChange({ dateStart, dateEnd });
    }
  };

  const handleCallTypeChange = (type: string, index: number) => {
    setCallType(type);
    setTypeOpen(false);
    const inOut = index === 0 ? undefined : index - 1;
    onFilterChange({ inOut });
  };

  return (
    <FilterContainer>
      <Dropdown>
        <SelectedOption onClick={() => setTypeOpen(!typeOpen)}>
          {callType} {typeOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </SelectedOption>
        {typeOpen && (
          <Options>
            {typeOptions.map((option, index) => (
              <Option key={option} onClick={() => handleCallTypeChange(option, index)}>
                {option}
              </Option>
            ))}
          </Options>
        )}
      </Dropdown>
      <Dropdown>
        <SelectedOption>
          <ArrowLeftIcon
            onClick={() =>
              handleDateRangeChange(
                dateOptions[
                  Math.max(
                    0,
                    dateOptions.findIndex((opt) => opt === dateRange) - 1,
                  )
                  ],
              )
            }
          />
          <SelectedOption onClick={() => setDateOpen(!dateOpen)}>
            {dateRange} <CalendarIcon />
          </SelectedOption>
          <ArrowRightIcon
            onClick={() =>
              handleDateRangeChange(
                dateOptions[
                  Math.min(
                    dateOptions.length - 1,
                    dateOptions.findIndex((opt) => opt === dateRange) + 1,
                  )
                  ],
              )
            }
          />
        </SelectedOption>
        {dateOpen && (
          <Options>
            {dateOptions.map((option) => (
              <Option key={option} onClick={() => handleDateRangeChange(option)}>
                {option}
              </Option>
            ))}
          </Options>
        )}
      </Dropdown>
    </FilterContainer>
  );
};

export { CallFilters };