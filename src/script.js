let dados = [];
let encontrados = new Set(JSON.parse(localStorage.getItem('encontrados')) || []);

const contador = document.getElementById("contador");
const resultado = document.getElementById("resultado");
const modal = document.getElementById("imagem-modal");
const modalImg = modal.querySelector("img");
const fecharBtn = document.getElementById("fechar-modal");
const indice = document.getElementById("imagem-indice");

let imagensAtuais = [];
let imagemAtualIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("source/objects.json");
    dados = await response.json();
    contador.textContent = `${encontrados.size}/${dados.length}`;
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
    contador.textContent = "Erro!";
  }
});

document.getElementById("busc").addEventListener("submit", (event) => {
  event.preventDefault();

  const termo = document.getElementById("campo-busca").value.trim().toLowerCase();
  const h2 = resultado.querySelector("h2");
  const p = resultado.querySelector("p");
  const gallery = resultado.querySelector(".gallery");

  h2.textContent = "";
  p.textContent = "";
  gallery.innerHTML = "";
  resultado.style.display = "none";

  if (termo === "") {
    h2.textContent = "Digite algo primeiro!";
    resultado.style.display = "block";
    return;
  }

  const item = dados.find(obj =>
    obj.titulo.toLowerCase().includes(termo)
  );

  if (item) {
    h2.textContent = item.titulo;
    p.textContent = `${item.descricao}\n\nAutor: ${item.autor || "Desconhecido"}`;
    resultado.style.display = "block";

    if (!encontrados.has(item.titulo)) {
      encontrados.add(item.titulo);
      moedas += item.valor || 0;
      atualizarMoedas();

      // Salva os encontrados no localStorage
      localStorage.setItem('encontrados', JSON.stringify([...encontrados]));

  contador.textContent = `${encontrados.size}/${dados.length}`;
}


    imagensAtuais = [...new Set(item.imagens)];
    imagensAtuais.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = item.titulo;
      img.addEventListener("click", () => abrirModalImagem(index));
      gallery.appendChild(img);
    });
  } else {
    h2.textContent = "Nada encontrado!";
    resultado.style.display = "block";
  }
});

// Modal funções
function abrirModalImagem(index) {
  imagemAtualIndex = index;
  atualizarModal();
  modal.style.display = "flex";
}

function atualizarModal() {
  modalImg.src = imagensAtuais[imagemAtualIndex];
  indice.textContent = `${imagemAtualIndex + 1}/${imagensAtuais.length}`;
}

function fecharModal() {
  modal.style.display = "none";
  modalImg.src = "";
}

fecharBtn.addEventListener("click", fecharModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "ArrowRight") {
      imagemAtualIndex = (imagemAtualIndex + 1) % imagensAtuais.length;
      atualizarModal();
    } else if (e.key === "ArrowLeft") {
      imagemAtualIndex = (imagemAtualIndex - 1 + imagensAtuais.length) % imagensAtuais.length;
      atualizarModal();
    } else if (e.key === "Escape") {
      fecharModal();
    }
  }
});

// --- Loja e Inventário ---
let moedas = parseInt(localStorage.getItem('moedas')) || 0;
let inventario = JSON.parse(localStorage.getItem('inventario')) || [];

const moedasDisplay = document.getElementById("moedas-display");
const btnLoja = document.getElementById("btn-loja");
const btnInventario = document.getElementById("btn-inventario");
const secaoLoja = document.getElementById("secao-loja");
const secaoInventario = document.getElementById("secao-inventario");

function atualizarMoedas() {
  moedasDisplay.textContent = `💰 ${moedas} moedas`;
  localStorage.setItem("moedas", moedas);
}

function salvarInventario() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

function carregarGadgets() {
  fetch("source/gadgets.json")
    .then(resp => resp.json())
    .then(gadgets => {
      const lista = document.getElementById("lista-gadgets");
      lista.innerHTML = "";

      gadgets.forEach(gadget => {
        if (inventario.includes(gadget.titulo)) return; // já comprado

        const item = document.createElement("div");
        item.className = "gadget-item";
        item.innerHTML = `
          <img src="${gadget.imagem}" alt="${gadget.titulo}" class="imag">
          <h3>${gadget.titulo}</h3>
          
          <p><strong>Preço:</strong> ${gadget.valor} moedas</p>
        `;

        const botao = document.createElement("button");
        botao.textContent = "Comprar";
        botao.disabled = moedas < gadget.valor;

        botao.addEventListener("click", () => {
          if (moedas >= gadget.valor) {
            moedas -= gadget.valor;
            inventario.push(gadget.titulo);
            atualizarMoedas();
            salvarInventario();
            carregarGadgets();
            carregarInventario();
            alert(`Você comprou: ${gadget.titulo}!`);
          }
        });

        item.appendChild(botao);
        lista.appendChild(item);
      });

      if (lista.innerHTML === "") {
        lista.innerHTML = "<p>Você já comprou tudo!</p>";
      }
    });
}

function carregarInventario() {
  fetch("source/gadgets.json")
    .then(resp => resp.json())
    .then(gadgets => {
      const lista = document.getElementById("lista-inventario");
      lista.innerHTML = "";

      const itens = gadgets.filter(g => inventario.includes(g.titulo));

      if (itens.length === 0) {
        lista.innerHTML = "<p>Você ainda não comprou nada.</p>";
        return;
      }

      itens.forEach(gadget => {
        const item = document.createElement("div");
        item.className = "gadget-item";
        item.innerHTML = `
          <img src="${gadget.imagem}" alt="${gadget.titulo}" class="imag">
          <h3>${gadget.titulo}</h3>
          <p>${gadget.descricao}</p>
        `;
        lista.appendChild(item);
      });
    });
}

// Botões toggle
btnLoja.addEventListener("click", () => {
  secaoLoja.style.display = secaoLoja.style.display === "none" ? "block" : "none";
  if (secaoLoja.style.display === "block") carregarGadgets();
});

btnInventario.addEventListener("click", () => {
  secaoInventario.style.display = secaoInventario.style.display === "none" ? "block" : "none";
  if (secaoInventario.style.display === "block") carregarInventario();
});

atualizarMoedas();

document.getElementById('resetar-jogo').addEventListener('click', () => {
  if (confirm("Tem certeza que quer resetar tudo?")) {
    localStorage.removeItem('encontrados');
    localStorage.removeItem('contador')
    localStorage.removeItem('inventario');
    localStorage.removeItem('moedas');
    location.reload();
  }
});
