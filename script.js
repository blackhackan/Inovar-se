// ATENÇÃO: Substitua pelo link gerado no terminal do Google Colab
const API_URL = 'https://detective-instead-shell-dee.trycloudflare.com/api';

let usuarioAtual = null;
let aulasCarregadas = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
});

function inicializarEventos() {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', realizarLogin);
    }

    const selectMateria = document.getElementById('select-materia');
    const selectAno = document.getElementById('select-ano');

    if (selectMateria) selectMateria.addEventListener('change', carregarAulas);
    if (selectAno) selectAno.addEventListener('change', carregarAulas);
}

async function realizarLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const nome = document.getElementById('login-nome')?.value || 'Estudante';
    const ano = document.getElementById('login-ano')?.value || '6ef';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha, nome, ano_escolar: ano })
        });

        const data = await response.json();
        if (data.success) {
            usuarioAtual = data.user;
            document.getElementById('tela-login').classList.add('hidden');
            document.getElementById('tela-dashboard').classList.remove('hidden');
            document.getElementById('nome-usuario').textContent = usuarioAtual.nome;
            
            if (document.getElementById('select-ano')) {
                document.getElementById('select-ano').value = usuarioAtual.ano_escolar;
            }
            carregarAulas();
        } else {
            alert('Falha na autenticação.');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o servidor. Verifique a URL da API.');
    }
}

async function carregarAulas() {
    const ano = document.getElementById('select-ano')?.value || usuarioAtual?.ano_escolar || '6ef';
    const materia = document.getElementById('select-materia')?.value || '';

    const containerAulas = document.getElementById('container-aulas');
    if (!containerAulas) return;

    containerAulas.innerHTML = '<p class="carregando">Carregando conteúdos de estudo...</p>';

    try {
        let url = `${API_URL}/aulas?ano_escolar=${ano}`;
        if (materia) url += `&materia=${materia}`;

        const res = await fetch(url);
        aulasCarregadas = await res.json();

        containerAulas.innerHTML = '';

        if (!aulasCarregadas || aulasCarregadas.length === 0) {
            containerAulas.innerHTML = `
                <div class="sem-conteudo">
                    <h3>Nenhum conteúdo encontrado para este filtro</h3>
                    <p>Tente selecionar outro ano escolar ou outra disciplina.</p>
                </div>`;
            return;
        }

        aulasCarregadas.forEach((aula, index) => {
            const card = document.createElement('div');
            card.className = 'card-aula';
            card.innerHTML = `
                <div class="card-header">
                    <span class="badge-modulo">${aula.modulo || 'Módulo Único'}</span>
                    <span class="tempo-estimado">⏱️ ${aula.tempo}</span>
                </div>
                <h3>${aula.titulo}</h3>
                <p class="resumo-aula">${aula.resumo}</p>
                <button onclick="abrirAula(${index})" class="btn-estudar">Acessar Material & Exercícios</button>
            `;
            containerAulas.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        containerAulas.innerHTML = '<p class="erro">Erro ao carregar dados da API.</p>';
    }
}

function abrirAula(index) {
    const aula = aulasCarregadas[index];
    if (!aula) return;

    const modal = document.getElementById('modal-aula');
    const conteudoModal = document.getElementById('conteudo-modal');

    let htmlExercicios = '';
    if (aula.exercicios && aula.exercicios.length > 0) {
        htmlExercicios = `
            <div class="secao-exercicios">
                <h3>📝 Exercícios de Fixação</h3>
                ${aula.exercicios.map((ex, exIndex) => `
                    <div class="card-exercicio" id="ex-card-${exIndex}">
                        <p class="pergunta"><b>Questão ${exIndex + 1}:</b>${ex.pergunta}</p>
                        <div class="opcoes-lista">
                            ${ex.opcoes.map((opcao, opcIndex) => `
                                <button class="btn-opcao" onclick="validarResposta(${index}, ${exIndex}, ${opcIndex})">
                                    ${String.fromCharCode(65 + opcIndex)}) ${opcao}
                                </button>
                            `).join('')}
                        </div>
                        <div class="feedback-exercicio hidden" id="feedback-${exIndex}"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    conteudoModal.innerHTML = `
        <div class="cabecalho-aula">
            <span class="badge-modulo">${aula.modulo}</span>
            <h2>${aula.titulo}</h2>
        </div>
        <div class="teoria-container">
            ${aula.teoria}
        </div>
        ${htmlExercicios}
    `;

    modal.classList.remove('hidden');
}

function validarResposta(aulaIndex, exIndex, opcaoSelecionada) {
    const ex = aulasCarregadas[aulaIndex].exercicios[exIndex];
    const feedbackDiv = document.getElementById(`feedback-${exIndex}`);

    feedbackDiv.classList.remove('hidden');

    if (opcaoSelecionada === ex.correta) {
        feedbackDiv.className = 'feedback-exercicio correto';
        feedbackDiv.innerHTML = `<b>✨ Resposta Correta!</b><br>${ex.explicacao}`;
    } else {
        feedbackDiv.className = 'feedback-exercicio incorreto';
        feedbackDiv.innerHTML = `<b>❌ Resposta Incorreta.</b> Tente novamente!<br><i>Dica/Explicação:</i> ${ex.explicacao}`;
    }
}

function fecharModal() {
    document.getElementById('modal-aula').classList.add('hidden');
}