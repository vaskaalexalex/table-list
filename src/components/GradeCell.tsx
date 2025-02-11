import { FC, memo } from 'react';
import styled, { css } from 'styled-components';

enum GradeTypes {
  good = 'good',
  great = 'great',
  bad = 'bad',
}


const GRADE_BY_TYPE = {
  [GradeTypes.bad]: {
    title: 'Плохо',
    fontColor: '#EA1A4F',
    backgroundColor: '#FEE9EF',
    borderColor: '#EA1A4F',
  },
  [GradeTypes.good]: {
    title: 'Хорошо',
    fontColor: '#122945',
    backgroundColor: '#D8E4FB',
    borderColor: '#ADBFDF',
  },
  [GradeTypes.great]: {
    title: 'Отлично',
    fontColor: '#00A775',
    backgroundColor: '#DBF8EF',
    borderColor: '#28A879',
  },
};

const GradeWrapper = styled.div<{ type: GradeTypes }>(
  ({ type }) => css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: max-content;
      height: 24px;
      padding: 0 4px;
      font-size: 14px;
      color: ${GRADE_BY_TYPE[type].fontColor};
      background: ${GRADE_BY_TYPE[type].backgroundColor};
      border: 1px solid ${GRADE_BY_TYPE[type].borderColor};
      border-radius: 4px;
  `);

const GradeCell: FC = memo(() => {
  const gradeTypes = Object.values(GradeTypes);
  const randomType = gradeTypes[Math.floor(Math.random() * gradeTypes.length)];

  return (
    <GradeWrapper type={randomType}>
      {GRADE_BY_TYPE[randomType].title}
    </GradeWrapper>
  );
});


export { GradeCell };