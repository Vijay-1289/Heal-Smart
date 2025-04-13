import React, { useState, useContext } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import AIConsult from "./AIConsult";
import { notes } from "../../utils/Icons";
import { FilterContext } from "../../context/FilterContext";
import { AIContext } from "../../context/AIContext";
import { FaSearch, FaStethoscope, FaPrescription, FaExclamationTriangle } from 'react-icons/fa';

let DiseaseMapping = {
  Psoriasis: "Dermatologist",

  Impetigo: "Dermatologist",

  "Heart Attack": "Cardiologist",

  Hypertension: "Cardiologist",

  Diabetes: "Endocrinologist",

  Hypothyroidism: "Endocrinologist",

  Gastroenteritis: "Gastroenterologist",

  Jaundice: "Gastroenterologist",

  Osteoarthristis: "Rheumatologist",

  "Cervical spondylosis": "Neurologist",

  "(vertigo) Paroymsal  Positional Vertigo": "Neurologist",

  "Bronchial Asthma": "Pulmonologist",
};

// Database of symptoms, diseases, and medications
const medicalDatabase = {
    symptoms: [
        "Fever",
        "Cough",
        "Headache",
        "Fatigue",
        "Sore Throat",
        "Body Aches",
        "Runny Nose",
        "Shortness of Breath",
        "Nausea",
        "Diarrhea",
        "Chest Pain",
        "Dizziness",
        "Loss of Taste/Smell",
        "Joint Pain",
        "Skin Rash",
        "Abdominal Pain",
        "Vomiting",
        "Chills",
        "Loss of Appetite",
        "Muscle Weakness"
    ],
    diseases: {
        "Common Cold": {
            symptoms: ["Runny Nose", "Cough", "Sore Throat", "Fatigue"],
            medications: [
                {
                    name: "Acetaminophen",
                    dosage: "500-1000mg every 4-6 hours",
                    purpose: "Pain and fever relief"
                },
                {
                    name: "Antihistamines",
                    dosage: "As directed on package",
                    purpose: "Reduce runny nose and sneezing"
                }
            ],
            severity: "Mild",
            duration: "7-10 days",
            precautions: ["Rest", "Stay hydrated", "Avoid cold exposure"]
        },
        "Flu": {
            symptoms: ["Fever", "Body Aches", "Fatigue", "Cough", "Headache"],
            medications: [
                {
                    name: "Oseltamivir (Tamiflu)",
                    dosage: "75mg twice daily for 5 days",
                    purpose: "Antiviral medication"
                },
                {
                    name: "Ibuprofen",
                    dosage: "400-600mg every 6-8 hours",
                    purpose: "Pain and fever relief"
                }
            ],
            severity: "Moderate",
            duration: "1-2 weeks",
            precautions: ["Rest", "Isolate", "Monitor temperature"]
        },
        "COVID-19": {
            symptoms: ["Fever", "Cough", "Loss of Taste/Smell", "Fatigue", "Shortness of Breath"],
            medications: [
                {
                    name: "Paracetamol",
                    dosage: "500-1000mg every 6 hours",
                    purpose: "Fever and pain management"
                }
            ],
            severity: "Varies",
            duration: "10-14 days",
            precautions: ["Isolate", "Monitor oxygen levels", "Seek immediate care if breathing difficulty"]
        },
        "Migraine": {
            symptoms: ["Headache", "Nausea", "Dizziness", "Fatigue"],
            medications: [
                {
                    name: "Sumatriptan",
                    dosage: "50-100mg at onset",
                    purpose: "Migraine relief"
                },
                {
                    name: "Ibuprofen",
                    dosage: "400mg as needed",
                    purpose: "Pain relief"
                }
            ],
            severity: "Moderate",
            duration: "4-72 hours",
            precautions: ["Rest in dark room", "Avoid triggers", "Stay hydrated"]
        },
        "Gastroenteritis": {
            symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain"],
            medications: [
                {
                    name: "Oral Rehydration Solution",
                    dosage: "As needed",
                    purpose: "Prevent dehydration"
                },
                {
                    name: "Loperamide",
                    dosage: "Initial 4mg, then 2mg after each loose stool",
                    purpose: "Control diarrhea"
                }
            ],
            severity: "Moderate",
            duration: "2-5 days",
            precautions: ["Stay hydrated", "Bland diet", "Hand hygiene"]
        }
    }
};

function SymptomAnalysis({ updateActive }) {
  const { doctorSpec, setDoctorSpec } = useContext(FilterContext);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [diagnosis, setDiagnosis] = useState("undefined");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [consultAI, setConsultAI] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // Function to handle selection of symptoms
  const handleSelectSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Function to handle removal of selected symptom
  const handleRemoveSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter(
      (symptom) => symptom !== symptomToRemove
    );
    setSelectedSymptoms(updatedSymptoms);
  };

  // Function to handle submission
  const handleSubmit = () => {
    console.log("Selected symptoms:", selectedSymptoms);

    const data = {
      symptoms: selectedSymptoms,
    };

    const url = "https://heal-smart-server.onrender.com/predict";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response:", data);
        setDiagnosis(data.prediction);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });

    setSubmitted(true);
  };

  const handleConsultDoctor = () => {
    console.log("diagnosis : ", diagnosis);
    if (diagnosis != "undefined" || diagnosis != undefined) {
      console.log(DiseaseMapping[diagnosis]);
      setDoctorSpec(DiseaseMapping[diagnosis]);
    }
    updateActive(4);
  };
  const handleConsultAI = () => {
    setConsultAI(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = medicalDatabase.symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSymptoms(filtered);
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length < 2) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    const possibleDiseases = [];
    
    Object.entries(medicalDatabase.diseases).forEach(([disease, data]) => {
      const matchingSymptoms = selectedSymptoms.filter(symptom => 
        data.symptoms.includes(symptom)
      );
      
      if (matchingSymptoms.length > 0) {
        const matchPercentage = (matchingSymptoms.length / data.symptoms.length) * 100;
        
        if (matchPercentage >= 40) {  // Show diseases with at least 40% symptom match
          possibleDiseases.push({
            name: disease,
            ...data,
            matchPercentage: Math.round(matchPercentage)
          });
        }
      }
    });

    setAnalysis({
      diseases: possibleDiseases.sort((a, b) => b.matchPercentage - a.matchPercentage)
    });
  };

  return (
    <>
      {!submitted && (
        <SymptomAnalysisStyled>
          <div className="heading">
            <h2>Symptom Analysis</h2>
          </div>
          <div className="desc">
            <p>
              Experience instant clarity with our Symptom Analysis feature. Just
              enter your symptoms, and within moments, receive precise
              recommendations and insights tailored to you.{" "}
            </p>
          </div>
          <div className="boxi">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search your symptoms"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            {showWarning && (
              <div className="warning">
                <FaExclamationTriangle />
                Please select at least 2 symptoms for accurate analysis
              </div>
            )}
            <SelectedSymptoms>
              {selectedSymptoms.map((symptom, index) => (
                <SelectedSymptom key={index}>
                  {symptom}
                  <RemoveButton onClick={() => handleRemoveSymptom(symptom)}>
                    X
                  </RemoveButton>
                </SelectedSymptom>
              ))}
            </SelectedSymptoms>
            <SubmitButton
              className="bg-purple-500 mt-2 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0}
            >
              Analyze
            </SubmitButton>
          </div>
        </SymptomAnalysisStyled>
      )}
      {submitted && !consultAI && (
        <Divv>
        <div className="head">
        Analysis report:
      </div>
        <Diagnosis>
          <Dig>
            <p>{notes}</p>
            {analysis && analysis.diseases.length > 0 ? (
              <>
                <p>
                  It seems like you may be experiencing symptoms of{" "}
                  <strong>{analysis.diseases[0].name}</strong>.
                </p>
                <p>Please consult a {DiseaseMapping[analysis.diseases[0].name]}.</p>
              </>
            ) : (
              "Your symptoms do not match any disease. Please consult a doctor."
            )}
          </Dig>
          <div className="consultation-options">
            <div className="consultation-option">
              <p>Would you like assistance in finding a doctor nearby?</p>
              <ConsultDoctorButton onClick={handleConsultDoctor}>
                Yes, please find me a doctor
              </ConsultDoctorButton>
            </div>
            <div className="consultation-option">
              <p>Would you like any AI assistance regarding your symptoms?</p>
              <ConsultAI onClick={handleConsultAI}>
                Yes, get me AI assistance
              </ConsultAI>
            </div>
          </div>
        </Diagnosis>
        </Divv>
      )}
      {consultAI && (
        <AIConsult
          symptoms={selectedSymptoms}
          diagnosis={analysis && analysis.diseases.length > 0 ? analysis.diseases[0].name : null}
        ></AIConsult>
      )}
    </>
  );
}

const Divv = styled.div`
  .head{
    color: darkviolet;
    font-size: 25px;
    font-weight: 605;
    margin: 50px 40px;
  }
`;


const SymptomAnalysisStyled = styled.div`
  .heading h2 {
    font-size: 29px;
    color: darkviolet;
    font-weight: 605;
    margin: 25px 20px;
    padding: 1rem 1.5rem;
    width: 100%;
  }

  .desc {
    margin: 45px 45px;
    display: flex;
    align-items: center;
    color: #222260;
    font-weight: 400;
    font-size: 20px;
  }
  .boxi{
    margin:50px 50px;
  }

  .search-box {
    position: relative;
    margin-bottom: 1.5rem;

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9333ea;
    }

    input {
      width: 100%;
      padding: 1rem 1rem 1rem 2.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #9333ea;
      }
    }
  }

  .warning {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ef4444;
    background: #fee2e2;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    svg {
      font-size: 1.2rem;
    }
  }
`;

const SelectedSymptoms = styled.div`
  min-height: 50px;
  margin: 5px;
  margin-top: 20px;
  color: purple;
  border: 1.3px solid rgb(168 85 247);
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.375rem;
  justify-content: flex-start;
  align-content: space-around;
  align-items: center;
`;

const SelectedSymptom = styled.span`
  margin: 5px;
  padding: 5px;
  font-size: 15px;
  font-weight: 400;
  border: 1px solid rgb(165 85 247);
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  margin-left: 5px;
  padding: 3px;
  /* background-color: green; */
  border: none;
  color: darkblue;
  border-radius: 999px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: block;
  margin: 50px auto;
`;

const Diagnosis = styled.div`
  margin: 4px 0px;
  text-align: center;
  color: #222260;
  font-weight: 400;
  font-size: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .consultation-options {
    margin: 60px 25px;
    display: flex;
    justify-content: space-between;
  }

  .consultation-option {
    flex: 1;
    margin-right: 18px; /* Adjust spacing between cards */
    cursor: pointer;
  }
`;

const Dig = styled.div`
  padding: 15px;
  color: white;
  border: 1px solid darkviolet;
  border-radius: 5px;
  font-size: 23px;
  // max-width: 10rem;
  background-color: darkviolet;
  margin: 38px auto;
`;

const ConsultDoctorButton = styled.button`
  padding: 10px 20px;
  background-color: #222260;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ConsultAI = styled.button`
  padding: 10px 20px;
  background-color: #222260;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 20px;
`;

export default SymptomAnalysis;
