export function renderPatientEncounter(container, navigateTo, { patient, gameState }) {
    const patientEncounter = document.createElement('div');
    patientEncounter.innerHTML = `
      <h2>Patient Encounter</h2>
      <div class="status">
        <p>Time Remaining: <span id="timeRemaining">${formatTime(gameState.timeRemaining)}</span></p>
      </div>
      <p>Visiting ${patient.name}</p>
      <p>Symptom: ${patient.condition}</p>
      <div class="tabs">
        <button class="tab" data-tab="interview">Interview Questions</button>
        <button class="tab" data-tab="exam">Exam Maneuvers</button>
        <button class="tab" data-tab="order">Order Tests</button>
        <button class="tab" data-tab="referral">Specialty Referrals</button>
        <button class="tab" data-tab="diagnosis">Diagnosis</button>
      </div>
      <div id="tabContent" class="tab-content"></div>
      <div id="responseBox" class="response-box"></div>
      <button id="toOrderResults">Order Results</button>
      <button id="toHospitalFloor">Back to Hospital Floor</button>
    `;
    container.appendChild(patientEncounter);

    const tabContent = document.getElementById('tabContent');
    const responseBox = document.getElementById('responseBox');
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const selectedTab = event.target.getAttribute('data-tab');
        renderTabContent(selectedTab, tabContent, patient, responseBox, gameState, navigateTo);
      });
    });

    document.getElementById('toOrderResults').addEventListener('click', () => {
      navigateTo('orderResults', { gameState });
    });

    document.getElementById('toHospitalFloor').addEventListener('click', () => {
      navigateTo('hospitalFloor', { gameState });
    });

    // Initialize with the first tab
    renderTabContent('interview', tabContent, patient, responseBox, gameState, navigateTo);
  }

  function renderTabContent(tab, container, patient, responseBox, gameState, navigateTo) {
    let content = '';
    switch (tab) {
      case 'interview':
        content = `
          <ul>
            <li><button class="option" data-action="askHistory">Ask about medical history</button></li>
            <li><button class="option" data-action="askMedications">Inquire about current medications</button></li>
            <li><button class="option" data-action="askLifestyle">Discuss lifestyle habits</button></li>
          </ul>
        `;
        break;
      case 'exam':
        content = `
          <ul>
            <li><button class="option" data-action="checkBP">Check blood pressure</button></li>
            <li><button class="option" data-action="listenHeart">Listen to heart and lungs</button></li>
            <li><button class="option" data-action="examineReflexes">Examine reflexes</button></li>
          </ul>
        `;
        break;
      case 'order':
        content = `
          <ul>
            <li><button class="option" data-action="orderBloodTest">Order Blood Test</button></li>
            <li><button class="option" data-action="orderXRay">Order X-Ray</button></li>
            <li><button class="option" data-action="orderMRI">Order MRI</button></li>
          </ul>
        `;
        break;
      case 'referral':
        content = `
          <ul>
            <li><button class="option" data-action="referCardiology">Refer to Cardiology</button></li>
            <li><button class="option" data-action="referNeurology">Refer to Neurology</button></li>
            <li><button class="option" data-action="referOrthopedics">Refer to Orthopedics</button></li>
            <li><button class="option" data-action="referGastroenterology">Refer to Gastroenterology</button></li>
            <li><button class="option" data-action="referDermatology">Refer to Dermatology</button></li>
            <li><button class="option" data-action="referPsychiatry">Refer to Psychiatry</button></li>
          </ul>
        `;
        break;
      case 'diagnosis':
        content = `
          <ul>
            <li><button class="option" data-action="diagnoseFlu">Diagnose Flu</button></li>
            <li><button class="option" data-action="diagnoseBrokenLeg">Diagnose Broken Leg</button></li>
            <li><button class="option" data-action="diagnosePneumonia">Diagnose Pneumonia</button></li>
            <li><button class="option" data-action="diagnoseMigraine">Diagnose Migraine</button></li>
            <li><button class="option" data-action="diagnoseAppendicitis">Diagnose Appendicitis</button></li>
          </ul>
          <button id="submitDiagnosis">Submit Diagnosis</button>
        `;
        break;
      default:
        content = '<p>Select a tab to view options.</p>';
    }
    container.innerHTML = content;

    document.querySelectorAll('.option').forEach(button => {
      button.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        handleAction(action, patient, responseBox, gameState, navigateTo);
      });
    });

    const submitButton = document.getElementById('submitDiagnosis');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        submitDiagnosis(patient, gameState, navigateTo);
      });
    }
  }

  function handleAction(action, patient, responseBox, gameState, navigateTo) {
    let response = '';
    switch (action) {
      case 'askHistory':
      case 'askMedications':
      case 'askLifestyle':
        gameState.timeRemaining -= 1;
        response = `Patient ${patient.personality}ly responds: "I have had ${patient.diagnosis} before."`;
        break;
      case 'checkBP':
      case 'listenHeart':
      case 'examineReflexes':
        gameState.timeRemaining -= 2;
        response = `The blood pressure is normal for someone with ${patient.diagnosis}.`;
        break;
      case 'orderBloodTest':
      case 'orderXRay':
      case 'orderMRI':
        response = `Test ordered for ${patient.name}. Results will be available shortly.`;
        setTimeout(() => {
          gameState.testResults = `Results for ${action.replace('order', '')}: Normal.`;
        }, 4000);
        break;
      case 'referCardiology':
      case 'referNeurology':
      case 'referOrthopedics':
      case 'referGastroenterology':
      case 'referDermatology':
      case 'referPsychiatry':
        const relatedConditions = {
          'Cardiology': ['Flu', 'Pneumonia'],
          'Neurology': ['Migraine'],
          'Orthopedics': ['Broken Leg'],
          'Gastroenterology': ['Appendicitis'],
          'Dermatology': ['Flu'],
          'Psychiatry': ['Anxiety']
        };
        const referralSpecialty = action.replace('refer', '');
        if (relatedConditions[referralSpecialty].includes(patient.condition)) {
          gameState.reputation += 5; // Bonus for related condition
          response = `Referred ${patient.name} to ${referralSpecialty}. Reputation increased!`;
        } else {
          gameState.reputation -= 10; // Penalty for unrelated condition
          response = `Referred ${patient.name} to ${referralSpecialty}. Reputation decreased!`;
        }
        break;
      case 'diagnoseFlu':
      case 'diagnoseBrokenLeg':
      case 'diagnosePneumonia':
      case 'diagnoseMigraine':
      case 'diagnoseAppendicitis':
        gameState.selectedDiagnosis = action.replace('diagnose', '');
        response = `Selected diagnosis: ${gameState.selectedDiagnosis}`;
        break;
      default:
        response = 'No response available.';
    }
    responseBox.innerHTML = `<p>${response}</p>`;
  }

  function submitDiagnosis(patient, gameState, navigateTo) {
    const correctDiagnosis = patient.diagnosis.replace(' ', '');
    if (gameState.selectedDiagnosis === correctDiagnosis) {
      const earnings = Math.floor(gameState.reputation);
      alert(`Correct diagnosis! You earn $${earnings}.`);
      gameState.money += earnings;
    } else {
      alert('Incorrect diagnosis. You lose 10 reputation.');
      gameState.reputation -= 10;
    }
    patient.discharged = true;
    navigateTo('hospitalFloor', { gameState });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
