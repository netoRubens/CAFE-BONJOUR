// =========================================================
// CARTÃO (abre ao clicar no ícone do livro) — sem Tailwind
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const botoesCartao = document.querySelectorAll(".btn-cartao");
  const blurFundo = document.getElementById("blurFundo");

  if (botoesCartao.length === 0 || !blurFundo) {
    console.error("Elemento(s) faltando: verifique .btn-cartao e #blurFundo");
    return;
  }

  let cartaoVisivel = false;

  function abrirCartao() {
    if (cartaoVisivel) return;
    cartaoVisivel = true;

    const wrapper = document.createElement("div");
    wrapper.id = "cartaoWrapper";
    wrapper.className = "cartao";

    const giro = document.createElement("div");
    giro.className = "cartao__giro";

    const frente = document.createElement("img");
    frente.src = "img/body/cartao frente.png";
    frente.alt = "Cartão Café Bonjour (frente)";
    frente.className = "cartao__face cartao__face--frente";

    const verso = document.createElement("img");
    verso.src = "img/body/cartao verso.png";
    verso.alt = "Cartão Café Bonjour (verso)";
    verso.className = "cartao__face cartao__face--verso";

    giro.append(frente, verso);
    wrapper.appendChild(giro);
    document.body.appendChild(wrapper);

    // Clique no cartão = vira
    giro.addEventListener("click", (e) => {
      e.stopPropagation();
      giro.classList.toggle("cartao__giro--virado");
    });

    // Força o navegador a calcular o estilo inicial para a animação rodar
    wrapper.offsetWidth;
    wrapper.classList.add("cartao--visivel");
    blurFundo.classList.add("fundo-blur--ativo");
  }

  function fecharCartao() {
    const wrapper = document.getElementById("cartaoWrapper");
    if (!wrapper) return;

    wrapper.classList.remove("cartao--visivel");
    blurFundo.classList.remove("fundo-blur--ativo");

    setTimeout(() => {
      wrapper.remove();
      cartaoVisivel = false;
    }, 300);
  }

  botoesCartao.forEach((botao) => botao.addEventListener("click", abrirCartao));
  blurFundo.addEventListener("click", fecharCartao);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharCartao();
  });
});
