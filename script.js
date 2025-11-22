// =========================
//  VARIÁVEIS
// =========================
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");
let like = 0;
let hideTimeout;
let processing = false;

// =========================
//  PEGAR / CRIAR USER ID (somente 1 vez!)
// =========================
let userId = localStorage.getItem("userId");
if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
}
console.log("ID do usuário:", userId);

// =========================
//  CONFIG JSONBIN
// =========================
const BIN_URL = "https://api.jsonbin.io/v3/b/6921cf36d0ea881f40f9063a";
const MASTER_KEY = "$2a$10$vkLFy60IQHKR4FlKNpECOu41II8kaBNIT4sSB2pA/tUdJARiZlQGq";

// =========================
//  FUNÇÕES DE FETCH
// =========================
async function getData() {
    const res = await fetch(BIN_URL, {
        headers: { "X-Master-Key": MASTER_KEY }
    });
    const json = await res.json();
    return json.record;
}

async function updateData(newData) {
    await fetch(BIN_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": MASTER_KEY
        },
        body: JSON.stringify(newData)
    });
}

// =========================
//  MOSTRAR TEMPORARIAMENTE
// =========================
function mostrarTemporariamente() {
    likeCount.textContent = like;
    likeCount.classList.remove("opacity-0");
    likeCount.classList.add("opacity-100");

    clearTimeout(hideTimeout);

    hideTimeout = setTimeout(() => {
        likeCount.classList.remove("opacity-100");
        likeCount.classList.add("opacity-0");
    }, 2000);
}

// =========================
//  ATUALIZAR CONTADOR NA TELA
// =========================
async function updateLikeCount() {
    const db = await getData();
    likeCount.textContent = db.likes;

    // Define estado local
    like = db.users.includes(userId) ? 1 : 0;

    // Atualiza visual do coração
    if (like === 1) {
        likeBtn.classList.add("active");
    } else {
        likeBtn.classList.remove("active");
    }
}

// =========================
//  LIDAR COM O LIKE
// =========================
async function handleLike() {
    if (processing) return;
    processing = true;

    const db = await getData();

    const index = db.users.indexOf(userId);

    if (index !== -1) {
        // Usuário já deu like → remover
        db.users.splice(index, 1); // remove do array
        db.likes--;
        like = 0;
    } else {
        // Usuário não deu like → adicionar
        db.users.push(userId);
        db.likes++;
        like = 1;
    }

    // Atualiza no JSONBin
    await updateData(db);

    // Atualiza contador e visual do botão
    likeCount.textContent = db.likes;
    if (like === 1) {
        likeBtn.classList.add("active");
    } else {
        likeBtn.classList.remove("active");
    }

    mostrarTemporariamente();

    processing = false;
}


// =========================
//  EVENTO DO BOTÃO
// =========================
likeBtn.addEventListener("click", async () => {
    if (processing) return;
    processing = true;

    const db = await getData(); // pega estado atual do banco
    const index = db.users.indexOf(userId);

    // Atualiza visual imediatamente
    if (index !== -1) {
        // Já deu like → remover
        db.users.splice(index, 1);
        db.likes--;
        like = 0;
        likeBtn.classList.remove("active");
    } else {
        // Não deu like → adicionar
        db.users.push(userId);
        db.likes++;
        like = 1;
        likeBtn.classList.add("active");
    }

    // Dispara animação do pop
    likeBtn.classList.remove("animate-pop");
    void likeBtn.offsetWidth;
    likeBtn.classList.add("animate-pop");

    // Atualiza contador imediatamente
    likeCount.textContent = db.likes;
    mostrarTemporariamente();

    // Envia atualização para o banco **de forma assíncrona**, sem bloquear
    updateData(db);

    processing = false;
});



// =========================
//  EVENTOS DE HOVER
// =========================
likeBtn.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    likeCount.textContent = like;
    likeCount.classList.remove("opacity-0");
    likeCount.classList.add("opacity-100");
});

likeBtn.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
        likeCount.classList.remove("opacity-100");
        likeCount.classList.add("opacity-0");
    }, 1000);
});

// =========================
//  INICIALIZAÇÃO
// =========================
updateLikeCount();
