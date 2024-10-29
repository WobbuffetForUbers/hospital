export function renderStartMenu(container, navigateTo) {
    const startMenu = document.createElement('div');
    startMenu.innerHTML = `
      <h1>Hospital Tycoon</h1>
      <button id="startGame">Start Game</button>
    `;
    container.appendChild(startMenu);

    document.getElementById('startGame').addEventListener('click', () => {
      navigateTo('hospitalFloor');
    });
  }
