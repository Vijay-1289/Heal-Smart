import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import doctorAvatar from '../../img/doctor-avatar.png';

const AIVideoConsult = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [userSymptoms, setUserSymptoms] = useState('');
  const [doctorResponse, setDoctorResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const startCall = async () => {
    try {
      setIsCallActive(true);
      // Request user's camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your permissions.');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const analyzeSymptoms = async () => {
    if (!userSymptoms) return;
    
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyANSiPoBX4gzgk9JyNqF_GUjt4ZzNyvHgw");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `As an AI doctor, please analyze the following symptoms and provide a preliminary assessment with possible conditions and recommendations: ${userSymptoms}. Please format the response in a conversational way as if speaking directly to the patient.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setDoctorResponse(response.text());
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setDoctorResponse('I apologize, but I am having trouble analyzing your symptoms at the moment. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <VideoConsultStyled>
      <InnerLayout>
        <div className="consultation-container">
          <h2>AI Doctor Consultation</h2>
          
          <div className="video-section">
            <div className="video-feeds">
              <div className="doctor-feed">
                <img src={doctorAvatar} alt="AI Doctor" className={isCallActive ? 'active' : ''} />
              </div>
              <div className="patient-feed">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className={isCallActive ? 'active' : ''}
                />
              </div>
            </div>

            <div className="controls">
              {!isCallActive ? (
                <button className="start-call" onClick={startCall}>
                  Start Consultation
                </button>
              ) : (
                <button className="end-call" onClick={endCall}>
                  End Consultation
                </button>
              )}
            </div>
          </div>

          <div className="interaction-section">
            <div className="symptoms-input">
              <textarea
                value={userSymptoms}
                onChange={(e) => setUserSymptoms(e.target.value)}
                placeholder="Please describe your symptoms in detail..."
                rows={4}
              />
              <button 
                onClick={analyzeSymptoms}
                disabled={!userSymptoms || isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </button>
            </div>

            {doctorResponse && (
              <div className="doctor-response">
                <h3>Doctor's Assessment:</h3>
                <p>{doctorResponse}</p>
              </div>
            )}
          </div>
        </div>
      </InnerLayout>
    </VideoConsultStyled>
  );
};

const VideoConsultStyled = styled.div`
  .consultation-container {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h2 {
      color: var(--color-primary);
      margin-bottom: 2rem;
      text-align: center;
    }
  }

  .video-section {
    margin-bottom: 2rem;

    .video-feeds {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 1rem;

      .doctor-feed, .patient-feed {
        aspect-ratio: 16/9;
        background: #f5f5f5;
        border-radius: 10px;
        overflow: hidden;
        position: relative;

        img, video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
          transition: opacity 0.3s ease;

          &.active {
            opacity: 1;
          }
        }
      }
    }

    .controls {
      display: flex;
      justify-content: center;
      gap: 1rem;

      button {
        padding: 0.8rem 2rem;
        border-radius: 25px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;

        &.start-call {
          background: var(--color-primary);
          color: white;

          &:hover {
            background: var(--color-primary-dark);
          }
        }

        &.end-call {
          background: #ff4444;
          color: white;

          &:hover {
            background: #cc0000;
          }
        }
      }
    }
  }

  .interaction-section {
    .symptoms-input {
      margin-bottom: 2rem;

      textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-bottom: 1rem;
        font-size: 1rem;
        resize: vertical;
      }

      button {
        background: var(--color-primary);
        color: white;
        padding: 0.8rem 2rem;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s ease;

        &:hover {
          background: var(--color-primary-dark);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }

    .doctor-response {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 10px;
      border-left: 4px solid var(--color-primary);

      h3 {
        color: var(--color-primary);
        margin-bottom: 1rem;
      }

      p {
        line-height: 1.6;
      }
    }
  }
`;

export default AIVideoConsult; 