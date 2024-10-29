export function renderPhysicianLounge(container, navigateTo) {
    const physicianLounge = document.createElement('div');
    physicianLounge.innerHTML = `
      <h2>Physician Lounge</h2>
      <button id="toHospitalFloor">Back to Hospital Floor</button>
    `;
    container.appendChild(physicianLounge);

    document.getElementById('toHospitalFloor').addEventListener('click', () => {
      navigateTo('hospitalFloor');
    });
  }
