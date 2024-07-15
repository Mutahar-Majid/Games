import styled from 'styled-components';
import Button from '../../components/button/button.component';

export const ChoiceContainer = styled.div`
	width: min(80%, 560px);
	position: absolute;
	top: 30%;

	button {
		display: block;
		margin-block-start: 2rem;
		width: 100%;
		animation-duration: 1s;
		animation-fill-mode: backwards;
	}
`;

export const NameInput = styled.input`
    padding: 1rem 2rem;
    border: 1px solid #FFF;
    border-radius: 4px;
    font-size: 19px;
    color: #333;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
		text-align: center;
		animation-name: bounceInLeft;
		animation-duration: 1s;

	@keyframes bounceInLeft {
			from,
			60%,
			75%,
			90%,
			to {
					animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			}

			0% {
					opacity: 0;
					transform: translate3d(-100%, 0, 0) scaleX(1);
			}

			60% {
					opacity: 1;
					transform: translate3d(25px, 0, 0) scaleX(1);
			}

			75% {
					transform: translate3d(-10px, 0, 0) scaleX(0.98);
			}

			90% {
					transform: translate3d(5px, 0, 0) scaleX(0.995);
			}

			to {
					transform: translate3d(0, 0, 0);
			}
	}
`;

export const SubmitButton = styled(Button)`

    button {
        animation-name: bounceInRight;
    }

    @keyframes bounceInRight {
        from,
        60%,
        75%,
        90%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        from {
            opacity: 0;
            transform: translate3d(100%, 0, 0) scaleX(1);
        }

        60% {
            opacity: 1;
            transform: translate3d(-25px, 0, 0) scaleX(1);
        }

        75% {
            transform: translate3d(10px, 0, 0) scaleX(0.98);
        }

        90% {
            transform: translate3d(-5px, 0, 0) scaleX(0.995);
        }

        to {
            transform: translate3d(0, 0, 0);
        }
    }
`;

