// =========================================================
// MENU DO CELULAR (abre/fecha) + ajuste de links entre páginas
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("menu");
  const menu = document.getElementById("menu-mobile");

  if (botao && menu) {
    const alternar = (abrir) => {
      menu.classList.toggle("m-menu--aberto", abrir);
      botao.setAttribute("aria-expanded", String(abrir));
    };

    botao.addEventListener("click", () => {
      alternar(!menu.classList.contains("m-menu--aberto"));
    });

    // Fecha o menu depois de tocar em um link
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => alternar(false));
    });
  }

  // No celular as seções têm id "m-..." (para não repetir os ids do desktop).
  // Se alguém chegar com #historia (ex.: vindo do cardápio), levamos à seção certa.
  const hash = location.hash.slice(1);
  const secoes = ["inicio", "historia", "localizacao"];
  if (secoes.includes(hash) && window.matchMedia("(max-width: 74.99rem)").matches) {
    const alvo = document.getElementById("m-" + hash);
    if (alvo) alvo.scrollIntoView();
  }
});