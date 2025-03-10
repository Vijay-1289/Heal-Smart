import React, { useContext } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import send_icon from '../../img/send_icon.png'
import user_icon from '../../img/user_icon.png'
import { Context } from '../../context/Context';
import DoctorLoader from './DoctorLoader';
import StethoscopeIcon from './StethoscopeIcon';

function MentalWellness() {
  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSent();
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSent();
    }
  };

  return (
    <MentStyled>
      <InnerLayout className='main'>
        <div className='nav'>
          <h2>Mind-Bot</h2>
        </div>
        <div className="main-container">
          {!showResult
          ?<>
            <div className='greet'>
            <p><span>Hi, there!</span></p>
            <p>How are you feeling today?</p>
            </div>
          </>
          :<div className='result'>
              <div className='result-title'>
                <img src={user_icon} alt="User"/>
                <p>{recentPrompt}</p>
              </div>
              <div className='result-data'>
                <div className="ai-icon">
                  <StethoscopeIcon />
                </div>
                {loading
                ? <DoctorLoader />
                : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                }
              </div>
            </div>
          }
          <div className='main-bottom'>
            <div className='search-box'>
              <input 
                onChange={(e)=>setInput(e.target.value)} 
                value={input} 
                type="text" 
                placeholder='Share your thoughts here'
                onKeyPress={handleKeyPress}
              />
              <div>
                <img onClick={handleSend} src={send_icon} alt="Send"/>
              </div>
            </div>
            <p className='bottom-info'>
              Mind-Bot cannot replace professional help. If you need it, it will guide you towards qualified mental health resources.
            </p>
          </div>
        </div>
      </InnerLayout>
    </MentStyled>  
  )
}

const MentStyled = styled.nav`
  .nav h2{
    color: darkviolet;
    font-size: 25px;
    font-weight: 605;
    margin: 11px 12px;
  }
  .main{
    flex: 1;
    min-height: 100vh;
    padding-bottom: 15vh;
    position: relative;
  }

  .main .nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    padding: 20px;
  }

  .main-container{
    max-width: 900px;
    margin: -15px 88px;
    color: black;
  }

  .main .greet{
    margin: 50px 0px;
    font-size: 40px;
    color: #928989;
    font-weight: 540;
    padding: 20px;
  }

  .main .greet span{
    background: -webkit-linear-gradient(16deg, #4b90ff, #ff5546);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main-bottom{
    position: absolute;
    bottom: 0;
    width: 100%;
    max-width: 900px;
    padding: 0px 20px;
    margin: 70px -48px;
  }

  .search-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background-color: #f0f4f9;
    margin: 10px 40px;
    padding: 7px 17px;
    border-radius: 50px;
  }

  .search-box img{
    width: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .search-box input{
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px;
    font-size: 18px;
    color: #333;

    &::placeholder {
      color: #666;
      opacity: 0.7;
    }
  }

  .search-box div{
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .main .bottom-info{
    font-size: 13px;
    margin: 15px;
    text-align: center;
    font-style: italic;
    color: #666;
  }

  .result{
    padding: 0px 5%;
    max-height: 70vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(147, 51, 234, 0.2) rgba(0, 0, 0, 0.05);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(147, 51, 234, 0.2);
      border-radius: 10px;

      &:hover {
        background-color: rgba(147, 51, 234, 0.4);
      }
    }
  }

  .result-title{
    margin: 40px 0px;
    display: flex;
    align-items: center;
    gap: 20px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      opacity: 0.8;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }

    p {
      color: #333;
      font-weight: 500;
    }
  }

  .result-data{
    display: flex;
    align-items: start;
    gap: 20px;

    .ai-icon {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    p {
      font-size: 17px;
      font-weight: 300;
      line-height: 1.8;
      color: #444;
    }
  }
`;

export default MentalWellness;