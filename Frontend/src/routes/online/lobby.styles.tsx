import styled from 'styled-components';

export const RoomContainer = styled.div`
  width: min(80%, 420px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 3rem;

  button {
    width: 100%;

    // Animation
    animation-name: fadeInUp;
    animation-duration: 1s;
    animation-delay: 0.8s;
    animation-fill-mode: backwards;
  }

  p {
    font-size: 1rem;
    color: hsl(217, 72%, 86%);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-align: center;

    &.invalid-name {
      animation-name: wobble;
      animation-duration: 1s;
      animation-fill-mode: backwards;
    }
  }

  @keyframes wobble {
    from {
      transform: translate3d(0, 0, 0);
    }

    15% {
      transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
    }

    30% {
      transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
    }

    45% {
      transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
    }

    60% {
      transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
    }

    75% {
      transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

export const FormInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  color: hsl(217, 72%, 86%);
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background-color: transparent;
  outline: 3px solid transparent;
  border: 2px solid white;
  border-radius: 10px;
  padding: 0.8rem;
  margin-block-end: 1rem;

  ::placeholder {
    font-size: 0.8rem;
  }

  // Animation
  animation-name: fadeInDown;
  animation-duration: 1s;
  animation-fill-mode: backwards;

  @-webkit-keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

export const TitleText = styled.h1`
  margin-top: 10rem;
  /* Define the gradient */
  background-image: linear-gradient(to right, #b9b9ff, #6141ff);

  /* Set the text color to transparent so the background shows through */
  color: transparent;

  /* Clip the background to the text */
  -webkit-background-clip: text;
  background-clip: text;
  text-transform: uppercase;
`;

export const SubtitleText = styled.h2`
  color: darkgrey;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
`;
export const NormalText = styled.h3`
  color: hsl(217, 72%, 86%);
  font-size: 1.5rem;
  text-align: center;
`;

export const Separator = styled.hr`
  width: 100%;
  border: 1px solid hsl(217, 16%, 45%);
  margin-block: 1.5rem;
`;

export const TwoCellContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  align-items: center;
`;

export const LeaderBoardContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  text-align: center;
`;
