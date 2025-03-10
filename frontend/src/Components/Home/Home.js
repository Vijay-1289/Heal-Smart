import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import hero from '../../img/hero.png'

function Home() {
  const navigate = useNavigate();

  const handleComponentClick = (route) => {
    navigate(route);
  };

  return (
    <HomeStyled>
      <HeroSection>
        <div className='hero'>
          <div className='des'>
            <h3>Heal Smart:</h3>
            <h1>Take Charge of Your Health, Mind & Body</h1>
            <p>Feeling under the weather and not sure what's wrong? Don't worry, HealSmart is here to be your friendly health detective!</p>
          </div>
          <div className='des'>
            <img src={hero} alt='Healthcare illustration'></img>
          </div>
        </div>
      </HeroSection>
      <CardContainer>
        <Card onClick={() => handleComponentClick('/symptom-analysis')}>
          <h2>Symptom Analysis</h2>
          <br/>
          <p>Analyze your symptoms and get assistance powered by AI</p>
        </Card>
        <Card onClick={() => handleComponentClick('/mental-wellness')}>
          <h2>Mind-Bot</h2>
          <br/>
          <p>Your AI Companion for Mental Wellness and guidance</p>
        </Card>
        <Card onClick={() => handleComponentClick('/consult-doctor')}>
          <h2>Consult Doctor</h2>
          <br/>
          <p>Explore specialists and book appointments hassle-free</p>
        </Card>
      </CardContainer>
    </HomeStyled>
  );
}

const HomeStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const HeroSection = styled.div`
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: purple;
  text-align: center;

  .hero{
    height: 300px;
    margin: 50px 80px;
    display: flex;
    justify-content: space-between;
  }
  
  .des{
    flex: 1;
    margin-right: 20px;
    margin-top: 50px;
  }

  .des h3{
    font-size: 30px;
    font-weight: 700;
    color: darkviolet;
  }

  .des h1{
    align-items: start;
    font-weight: 700;
    font-size: 40px;
    color: darkviolet;
  }

  .des p{
    align-items: start;
    color: #222260;
    font-weight: 500;
  }

  .des img{
    width: 320px;
    margin-left: 110px;
    margin-top: -45px;
  }

  @media (max-width: 768px) {
    height: auto;
    
    .hero {
      flex-direction: column;
      height: auto;
      margin: 20px;
      text-align: center;
    }

    .des {
      margin-right: 0;
      margin-top: 20px;
    }

    .des img {
      width: 80%;
      margin: 20px auto;
    }

    .des h1 {
      font-size: 32px;
    }

    .des h3 {
      font-size: 24px;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 120px 50px;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 40px 20px;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: calc(33.33% - 20px);
  transition: all 0.3s ease;
  color: #4b0082;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    color: darkViolet;
  }

  h2 {
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    font-size: 17px;
    color: #666;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

export default Home;
