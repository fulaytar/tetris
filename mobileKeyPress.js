const buttons = document.querySelectorAll('.arrow');

// Визначаємо функцію simulateKeyPress
function simulateKeyPress(key) {
  const event = new KeyboardEvent('keydown', {
    key,
  });
  document.dispatchEvent(event);
}

// Проходимо по кожній кнопці і додаємо обробник події click
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Визначаємо напрямок клавіші в залежності від класу кнопки
    const direction = button.classList.contains('up')
      ? 'ArrowUp'
      : button.classList.contains('left')
      ? 'ArrowLeft'
      : button.classList.contains('down')
      ? 'ArrowDown'
      : button.classList.contains('right')
      ? 'ArrowRight'
      : '';

    // Якщо напрямок визначений, викликаємо simulateKeyPress з відповідним напрямком
    if (direction) {
      simulateKeyPress(direction);
    }
  });
});
