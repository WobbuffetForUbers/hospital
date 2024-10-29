export function renderHospitalFloor(container, navigateTo, gameState) {
    const hospitalFloor = document.createElement('div');
    hospitalFloor.innerHTML = `
      <h2>Hospital Floor</h2>
      <div class="status">
        <p>Money: $${gameState.money}</p>
        <p>Reputation: ${gameState.reputation}/100</p>
        <p>Time Remaining: <span id="timeRemaining">${formatTime(gameState.timeRemaining)}</span></p>
      </div>
      <div id="rooms" class="rooms"></div>
      <button id="endShift">End Shift</button>
      <button id="toPhysicianLounge">Physician Lounge</button>
    `;
    container.appendChild(hospitalFloor);

    const roomsContainer = document.getElementById('rooms');
    const patients = gameState.patients;

    patients.forEach((patient, index) => {
      const room = document.createElement('div');
      room.className = 'room';
      room.innerHTML = `
        <p>Room ${index + 1}</p>
        <p>${patient.discharged ? 'Empty' : `Patient: ${patient.name}`}</p>
        <p>${patient.discharged ? '' : `Condition: ${patient.condition}`}</p>
        ${patient.discharged ? '' : `<button class="visitPatient" data-index="${index}">Visit</button>`}
      `;
      roomsContainer.appendChild(room);
    });

    document.querySelectorAll('.visitPatient').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        navigateTo('patientEncounter', { patient: patients[index], gameState });
      });
    });

    document.getElementById('endShift').addEventListener('click', () => {
      navigateTo('dailySummary', { gameState });
    });

    document.getElementById('toPhysicianLounge').addEventListener('click', () => {
      navigateTo('physicianLounge', { gameState });
    });
  }

  function generatePatients(previousPatients) {
    const conditions = ['Flu', 'Broken Leg', 'Pneumonia', 'Migraine', 'Appendicitis'];
    const personalities = ['Friendly', 'Anxious', 'Stoic', 'Irritable', 'Curious'];

    let patients = [];
    if (previousPatients) {
      // Half of the previous patients stay
      const stayingPatients = Math.ceil(previousPatients.length / 2);
      patients = previousPatients.slice(0, stayingPatients).map(patient => ({
        ...patient,
        discharged: false // Mark them as not discharged
      }));
    }

    // Add new patients (1 to 3)
    const newPatientsCount = Math.floor(Math.random() * 3) + 1; // Randomly 1 to 3 new patients
    for (let i = 0; i < newPatientsCount; i++) {
      const index = Math.floor(Math.random() * conditions.length);
      patients.push({
        name: `Patient ${patients.length + 1}`,
        condition: conditions[index],
        diagnosis: conditions[index],
        personality: personalities[index],
        discharged: false
      });
    }

    return patients;
  }
