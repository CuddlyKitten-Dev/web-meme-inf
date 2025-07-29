const header = document.getElementById('meu-header');

// Função que gera cor RGB aleatória
function gerarCorRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Muda a cor do texto do header a cada 1 segundo
setInterval(() => {
  header.style.color = gerarCorRGB();
}, 90);
