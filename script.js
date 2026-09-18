let isLoginMode = true;

// Exibe mensagem na tela de feedback (erro ou sucesso)
function showFeedback(message, type = 'error') {
  const msgBox = document.getElementById('feedback-message');
  if (!msgBox) return;

  msgBox.innerText = message;
  msgBox.className = `feedback-message ${type}`;
}

// Oculta a mensagem de feedback
function hideFeedback() {
  const msgBox = document.getElementById('feedback-message');
  if (msgBox) {
    msgBox.className = 'feedback-message hidden';
  }
}

// Alterna entre os modos Login e Cadastro
function toggleMode() {
  isLoginMode = !isLoginMode;
  hideFeedback();

  const groupName = document.getElementById('group-name');
  const subtitle = document.getElementById('auth-subtitle');
  const btnText = document.getElementById('btn-submit-text');
  const toggleLabel = document.getElementById('toggle-label');
  const toggleBtn = document.getElementById('toggle-btn');
  const inputName = document.getElementById('input-name');

  if (isLoginMode) {
    groupName.classList.add('hidden');
    if (inputName) inputName.removeAttribute('required');
    subtitle.innerText = 'Acesse sua conta para continuar';
    btnText.innerText = 'Entrar';
    toggleLabel.innerText = 'Ainda não tem uma conta?';
    toggleBtn.innerText = 'Cadastre-se';
  } else {
    groupName.classList.remove('hidden');
    if (inputName) inputName.setAttribute('required', 'true');
    subtitle.innerText = 'Crie sua conta na plataforma';
    btnText.innerText = 'Cadastrar';
    toggleLabel.innerText = 'Já possui uma conta?';
    toggleBtn.innerText = 'Faça login';
  }
}

// Processa o envio do formulário de Login / Cadastro
function handleAuthSubmit(e) {
  e.preventDefault();
  hideFeedback();

  const inputName = document.getElementById('input-name') ? document.getElementById('input-name').value.trim() : '';
  const inputEmail = document.getElementById('input-email') ? document.getElementById('input-email').value.trim() : '';
  const inputPassword = document.getElementById('input-password') ? document.getElementById('input-password').value : '';

  // Validação simples de senha
  if (inputPassword.length < 6) {
    showFeedback('A senha deve conter no mínimo 6 caracteres.', 'error');
    return;
  }

  // Determina o nome para exibição na Navbar e Dashboard
  let displayName = 'Estudante EduAdapt';
  if (!isLoginMode && inputName !== '') {
    displayName = inputName;
  } else if (inputEmail !== '') {
    displayName = inputEmail.split('@')[0];
  }

  // Atualiza os elementos na tela
  const userNameElem = document.getElementById('user-display-name');
  const welcomeElem = document.getElementById('welcome-heading');
  
  if (userNameElem) userNameElem.innerText = displayName;
  if (welcomeElem) welcomeElem.innerText = `Bem-vindo(a), ${displayName}!`;

  // Transiciona para a tela do Dashboard
  const dashboard = document.getElementById('dashboard-screen');
  if (dashboard) {
    dashboard.classList.remove('hidden');
  }
}

// Seleciona a matéria ativa no menu lateral
function selectSubject(subjectName) {
  // Atualiza o estado visual dos botões
  const buttons = document.querySelectorAll('.subject-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.includes(subjectName)) {
      btn.classList.add('active');
    }
  });

  // Atualiza os títulos no conteúdo central
  const subjectTitleElem = document.getElementById('selected-subject-title');
  const welcomeMsgElem = document.getElementById('welcome-message');

  if (subjectTitleElem) {
    subjectTitleElem.innerText = `Matéria Selecionada: ${subjectName}`;
  }
  if (welcomeMsgElem) {
    welcomeMsgElem.innerText = `Você está visualizando os conteúdos e seu progresso da matéria de ${subjectName}.`;
  }
}

// Realiza o logout retornando à tela inicial
function logout() {
  const dashboard = document.getElementById('dashboard-screen');
  if (dashboard) {
    dashboard.classList.add('hidden');
  }
}