export function renderOrderResults(container, navigateTo) {
    const orderResults = document.createElement('div');
    orderResults.innerHTML = `
      <h2>Order Results</h2>
      <button id="toDailySummary">Daily Summary</button>
      <button id="toPatientEncounter">Back to Patient Encounter</button>
    `;
    container.appendChild(orderResults);

    document.getElementById('toDailySummary').addEventListener('click', () => {
      navigateTo('dailySummary');
    });

    document.getElementById('toPatientEncounter').addEventListener('click', () => {
      navigateTo('patientEncounter');
    });
  }
