export function renderDailySummary(container, navigateTo, gameState) {
    const dailySummary = document.createElement('div');
    dailySummary.innerHTML = `
      <h2>Daily Summary</h2>
      <p>Money: $${gameState.money}</p>
      <p>Reputation: ${gameState.reputation}/100</p>
      <h3>Unlock New Features</h3>
      <ul id="purchaseOptions">
        <li><button class="unlock" data-feature="interview" data-cost="50">Unlock Interview Questions ($50)</button></li>
        <li><button class="unlock" data-feature="exam" data-cost="75">Unlock Exam Maneuvers ($75)</button></li>
        <li><button class="unlock" data-feature="lab" data-cost="100">Unlock Lab Tests ($100)</button></li>
        <li><button class="unlock" data-feature="specialty" data-cost="150">Unlock Specialty Services ($150)</button></li>
      </ul>
      <button id="startNewDay">Start New Day</button>
    `;
    container.appendChild(dailySummary);

    document.querySelectorAll('.unlock').forEach(button => {
      button.addEventListener('click', (event) => {
        const feature = event.target.getAttribute('data-feature');
        const cost = parseInt(event.target.getAttribute('data-cost'));
        unlockFeature(feature, gameState, cost, event.target);
      });
    });

    document.getElementById('startNewDay').addEventListener('click', () => {
      gameState.patients = generatePatients(); // Generate new patients for the new day
      gameState.timeRemaining = 360; // Reset timer for the new day
      gameState.testResults = ''; // Clear previous test results
      navigateTo('hospitalFloor', { gameState }); // Navigate to the hospital floor
    });
  }

  function unlockFeature(feature, gameState, cost, button) {
    if (gameState.money >= cost) {
      gameState.money -= cost; // Deduct cost from money
      switch (feature) {
        case 'interview':
          alert('New interview questions unlocked!');
          gameState.interviewQuestions.push('What brings you here today?');
          break;
        case 'exam':
          alert('New exam maneuvers unlocked!');
          gameState.examManeuvers.push('Check temperature');
          break;
        case 'lab':
          alert('New lab tests unlocked!');
          gameState.labTests.push('Blood culture');
          break;
        case 'specialty':
          alert('New specialty services unlocked!');
          gameState.specialtyServices.push('Gastroenterology', 'Dermatology', 'Psychiatry');
          break;
        default:
          alert('Feature not recognized.');
      }
      button.parentElement.remove(); // Remove the button from the list
    } else {
      alert('Not enough money to purchase this feature.');
    }
  }
