const form = document.getElementById('form-criar');
const resposta = document.getElementById('resposta');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const imagens = document.getElementById('imagens').value.split(',').map(i => i.trim());

  const dados = {
    titulo,
    descricao,
    imagens
  };

  const res = await fetch('salvar.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });

  const texto = await res.text();
  resposta.textContent = texto;
  form.reset();
});
