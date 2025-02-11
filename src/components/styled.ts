import styled from 'styled-components';

export const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;

    svg {
        color: #ADBFDF;
    }

    &:hover {

        svg {
            color: #002CFB;
        }

        opacity: 0.7;
    }
`;