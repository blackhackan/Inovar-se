const { useState, useEffect } = React;

function EduAdaptApp() {
  // Estado de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  
  // Perfil do Usuário
  const [userProfile, setUserProfile] = useState({
    nome: 'Alex Silva',
    email: 'alex@eduadapt.com',
    role: 'estudante', // 'estudante', 'professor', 'responsavel'
    estiloAprendizagem: 'visual',
    neurodivergencia: 'tdah',
    isGestante: false,
    metaDiariaMinutos: 45
  });

  // Acessibilidade
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [sensoryMode, setSensoryMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Navegação Interna
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mood, setMood] = useState(null);

  // Assistente de IA Chat
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ia', 
      text: 'Olá! Sou o seu Tutor IA Adaptativo. Em que posso te ajudar hoje na sua rotina de estudos?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Síntese de Voz Nativa
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speaking) {
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta leitura em voz alta.");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: inputMessage }];
    setChatMessages(newMsgs);
    const query = inputMessage;
    setInputMessage('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'ia', 
          text: `Entendi sua dúvida sobre "${query}". Adaptei a resposta para o estilo visual em 3 tópicos curtos:\n\n1. Conceito Principal simplificado\n2. Exemplo Prático\n3. Resumo para revisão` 
        }
      ]);
    }, 1000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  // RENDERIZAÇÃO: TELA DE LOGIN / CADASTRO
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-greenLight via-brand-blueSoft to-brand-orangeSoft ${dyslexicFont ? 'font-dyslexic' : ''}`}>
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 max-w-xl w-full p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green text-white font-extrabold text-2xl rounded-2xl shadow-md mb-2">
              EA
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Educação Adaptável</h1>
            <p className="text-sm text-slate-600 font-medium">Plataforma Inteligente, Inclusiva e Acessível</p>
          </div>

          {/* Abas Alternadoras de Login e Cadastro */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-brand-green shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Entrar na Conta
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-brand-green shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Criar Perfil Adaptativo
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={userProfile.nome} 
                  onChange={(e) => setUserProfile({...userProfile, nome: e.target.value})}
                  required 
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail</label>
              <input 
                type="email" 
                value={userProfile.email} 
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                required 
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Senha</label>
              <input 
                type="password" 
                defaultValue="123456" 
                required 
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {authMode === 'register' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Perfil de Acesso</label>
                    <select 
                      value={userProfile.role} 
                      onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="estudante">Estudante</option>
                      <option value="professor">Professor / Pedagogo</option>
                      <option value="responsavel">Responsável / Família</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estilo de Aprendizagem</label>
                    <select 
                      value={userProfile.estiloAprendizagem} 
                      onChange={(e) => setUserProfile({...userProfile, estiloAprendizagem: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="visual">Visual (Mapas e Vídeos)</option>
                      <option value="auditivo">Auditivo (Áudios e Podcasts)</option>
                      <option value="leitura">Leitura & Escrita</option>
                      <option value="pratico">Prático / Interativo</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-brand-orangeSoft rounded-2xl border border-amber-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase">Recursos Personalizados de Suporte</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userProfile.neurodivergencia === 'tdah'}
                        onChange={(e) => setUserProfile({...userProfile, neurodivergencia: e.target.checked ? 'tdah' : 'nenhum'})}
                        className="rounded text-brand-green focus:ring-emerald-500"
                      />
                      Suporte TDAH
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userProfile.neurodivergencia === 'tea'}
                        onChange={(e) => setUserProfile({...userProfile, neurodivergencia: e.target.checked ? 'tea' : 'nenhum'})}
                        className="rounded text-brand-green focus:ring-emerald-500"
                      />
                      Suporte Espectro Autista (TEA)
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userProfile.neurodivergencia === 'dislexia'}
                        onChange={(e) => setUserProfile({...userProfile, neurodivergencia: e.target.checked ? 'dislexia' : 'nenhum'})}
                        className="rounded text-brand-green focus:ring-emerald-500"
                      />
                      Suporte Dislexia
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userProfile.isGestante}
                        onChange={(e) => setUserProfile({...userProfile, isGestante: e.target.checked})}
                        className="rounded text-brand-green focus:ring-emerald-500"
                      />
                      Apoio Flexível para Gestantes
                    </label>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="w-full bg-brand-green hover:bg-brand-greenDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md"
            >
              {authMode === 'login' ? 'Acessar Plataforma' : 'Concluir e Iniciar Aprendizagem'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className="text-xs text-slate-500 hover:text-brand-green font-medium underline"
            >
              {dyslexicFont ? 'Desativar Fonte Dislexia' : 'Ativar Fonte para Dislexia (OpenDyslexic)'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO: APLICAÇÃO PRINCIPAL LOGADA
  return (
    <div className={`min-h-screen ${highContrast ? 'high-contrast-mode' : 'bg-brand-surface text-slate-800'} ${dyslexicFont ? 'font-dyslexic' : ''} ${sensoryMode ? 'sensory-mode' : ''}`}>
      
      {/* Barra de Navegação e Acessibilidade Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-brand-green text-white font-extrabold text-xl px-3.5 py-1.5 rounded-xl shadow-sm">
              EA
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">Educação Adaptável</h1>
              <span className="text-xs text-brand-greenDark font-semibold bg-brand-greenLight px-2 py-0.5 rounded-md">
                Perfil: {userProfile.role.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Barra de Ferramentas de Acessibilidade */}
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${dyslexicFont ? 'bg-brand-green text-white border-brand-green' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
            >
              Fonte Dislexia {dyslexicFont ? '✓' : ''}
            </button>

            <button 
              onClick={() => setSensoryMode(!sensoryMode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${sensoryMode ? 'bg-brand-green text-white border-brand-green' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
            >
              Calma Visual {sensoryMode ? '✓' : ''}
            </button>

            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${highContrast ? 'bg-amber-300 text-black border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
            >
              Alto Contraste
            </button>

            <button 
              onClick={() => speakText("Sua sessão ativa no Educação Adaptável está pronta. Conteúdos adaptados ao seu ritmo.")}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-blueSoft text-brand-blueAccent border border-sky-200 hover:bg-sky-100"
            >
              {speaking ? 'Parar Áudio 🔇' : 'Ouvir Tela 🔊'}
            </button>

            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 ml-2"
            >
              Sair
            </button>
          </div>

        </div>
      </header>

      {/* Grid Principal do Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Painel Lateral ESQUERDO: Navegação & Estímulos */}
        <aside className="lg:col-span-1 space-y-4">
          
          {/* Seletor Rápido de Perfil */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Visão do Sistema</label>
            <select 
              value={userProfile.role} 
              onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="estudante">Estudante (Visão Completa)</option>
              <option value="professor">Educador / Professor</option>
              <option value="responsavel">Responsável / Família</option>
            </select>
          </div>

          {/* Navegação de Módulos */}
          <nav className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'dashboard' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              📊 Painel Principal
            </button>

            <button 
              onClick={() => setActiveTab('biblioteca')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'biblioteca' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              📚 Biblioteca Acessível
            </button>

            <button 
              onClick={() => setActiveTab('gestantes')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'gestantes' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              🤰 Apoio a Gestantes & Mães
            </button>

            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'chat' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              🤖 Assistente IA de Aprendizagem
            </button>
          </nav>

          {/* Check-in Emocional Diário */}
          <div className="bg-brand-orangeSoft p-4 rounded-2xl border border-amber-100 space-y-2">
            <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider">Check-in Emocional</h3>
            <p className="text-xs text-amber-800 font-medium">Como está sua energia para os estudos hoje?</p>
            
            <div className="flex justify-between text-2xl pt-1">
              <button onClick={() => setMood('ótimo')} className={`p-2 rounded-xl transition-transform hover:scale-110 ${mood === 'ótimo' ? 'bg-white shadow' : ''}`} title="Ótimo">😁</button>
              <button onClick={() => setMood('focado')} className={`p-2 rounded-xl transition-transform hover:scale-110 ${mood === 'focado' ? 'bg-white shadow' : ''}`} title="Focado">🎯</button>
              <button onClick={() => setMood('cansado')} className={`p-2 rounded-xl transition-transform hover:scale-110 ${mood === 'cansado' ? 'bg-white shadow' : ''}`} title="Cansado">😴</button>
              <button onClick={() => setMood('ansioso')} className={`p-2 rounded-xl transition-transform hover:scale-110 ${mood === 'ansioso' ? 'bg-white shadow' : ''}`} title="Ansioso">😟</button>
            </div>

            {mood === 'cansado' && (
              <p className="text-xs text-amber-900 font-semibold bg-white/80 p-2.5 rounded-xl border border-amber-200 mt-2">
                💡 A IA sugere ajustar o cronograma para blocos curtos de 15 min com intervalos longos.
              </p>
            )}
          </div>

        </aside>

        {/* ÁREA CENTRAL PRINCIPAL */}
        <main className="lg:col-span-3 space-y-6">

          {/* VISÃO: DASHBOARD DO ESTUDANTE */}
          {userProfile.role === 'estudante' && activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Card Banner da IA com Paleta Verde e Azul Suave */}
              <div className="bg-gradient-to-r from-brand-green to-emerald-700 text-white p-6 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wide">
                    Recomendação Inteligente da IA
                  </span>
                  <span className="text-xs text-emerald-100 font-medium">Adaptação em Tempo Real</span>
                </div>
                <h2 className="text-2xl font-extrabold">Olá, {userProfile.nome}! Seu pico de foco foi identificado.</h2>
                <p className="text-sm text-emerald-100 max-w-xl">
                  A IA configurou uma sessão de 20 minutos de **História Geral** no formato **Visual Interativo**, reduzindo a carga de leitura conforme suas preferências.
                </p>
                <div className="pt-2">
                  <button className="bg-white text-brand-green hover:bg-emerald-50 font-extrabold px-6 py-3 rounded-xl text-xs shadow transition-all">
                    Iniciar Atividade Adaptada (20 min)
                  </button>
                </div>
              </div>

              {/* Métrica de Gamificação & Conquistas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Progresso Pessoal</span>
                  <p className="text-2xl font-extrabold text-brand-green">Nível 4 - Aprendiz Ativo</p>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-green h-full w-3/4 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-brand-blueSoft p-5 rounded-2xl border border-sky-100 shadow-sm space-y-1">
                  <span className="text-xs font-extrabold text-brand-blueAccent uppercase">Medalhas & Conquistas</span>
                  <p className="text-2xl font-extrabold text-sky-900">12 Emblemas</p>
                  <p className="text-xs text-sky-700 font-medium">Conquista recente: Foco Contínuo Sem Distrações</p>
                </div>

                <div className="bg-brand-orangeSoft p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
                  <span className="text-xs font-extrabold text-amber-900 uppercase">Ritmo de Aprendizado</span>
                  <p className="text-2xl font-extrabold text-amber-900">85% Concluído</p>
                  <p className="text-xs text-amber-800 font-medium">Pausas recomendadas cumpridas: 100%</p>
                </div>

              </div>

              {/* Cronograma Inteligente Diário */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Plano de Estudos Adaptativo de Hoje</h3>
                
                <div className="space-y-3">
                  
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-greenLight text-brand-green font-extrabold px-3 py-1.5 rounded-lg text-xs">
                        09:00
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">História: Resumo Estruturado com Leitura em Voz Alta</h4>
                        <p className="text-xs text-slate-500">Conteúdo com síntese de áudio disponível</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Concluído</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-sky-200 bg-brand-blueSoft flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-blueAccent text-white font-extrabold px-3 py-1.5 rounded-lg text-xs">
                        10:30
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Matemática: Exercícios Fracionados (Adaptado para Discalculia)</h4>
                        <p className="text-xs text-slate-600">Bloco fracionado de 15 minutos com suporte visual</p>
                      </div>
                    </div>
                    <button className="text-xs font-extrabold bg-brand-blueAccent hover:bg-sky-700 text-white px-4 py-2 rounded-xl transition-all">
                      Em Andamento
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* VISÃO: PROFESSOR / EDUCADOR */}
          {userProfile.role === 'professor' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">Painel Pedagógico do Educador</h2>
              <p className="text-xs text-slate-600">Acompanhamento centralizado e recomendações automáticas fornecidas pela IA para adaptação curricular.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-emerald-100 bg-brand-greenLight rounded-2xl space-y-2">
                  <h3 className="font-bold text-xs text-brand-greenDark uppercase">Adaptações Pendentes</h3>
                  <p className="text-xs text-slate-700">3 Alunos necessitam de mapas mentais simplificados para a avaliação da próxima semana.</p>
                </div>

                <div className="p-4 border border-sky-100 bg-brand-blueSoft rounded-2xl space-y-2">
                  <h3 className="font-bold text-xs text-brand-blueAccent uppercase">Relatórios Semanais de IA</h3>
                  <p className="text-xs text-slate-700">85% da turma cumpriu as metas sem sinais de sobrecarga cognitiva.</p>
                </div>
              </div>
            </div>
          )}

          {/* VISÃO: RESPONSÁVEIS */}
          {userProfile.role === 'responsavel' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Portal da Família & Responsáveis</h2>
              <p className="text-xs text-slate-600">Monitore a evolução acadêmica e a saúde emocional do estudante com métricas não-competitivas.</p>
            </div>
          )}

          {/* TAB: BIBLIOTECA ACESSÍVEL */}
          {activeTab === 'biblioteca' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Biblioteca de Conteúdos Multiformato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-2xl hover:border-brand-green transition-all space-y-2">
                  <span className="text-xs bg-brand-greenLight text-brand-green font-bold px-2.5 py-1 rounded-md">Texto Simplificado</span>
                  <h3 className="font-bold text-sm text-slate-800">Biologia: Ecossistemas e Preservação</h3>
                  <p className="text-xs text-slate-500">Disponível em: Áudio em tempo real, Mapa Mental Interativo e Quiz Adaptativo.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APOIO PARA GESTANTES */}
          {activeTab === 'gestantes' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Central de Apoio & Flexibilidade para Gestantes</h2>
              <p className="text-xs text-slate-600">Módulo configurado para flexibilidade de cronogramas, extensão de prazos e resumos áudio-guiados.</p>
            </div>
          )}

          {/* TAB: CHATBOT TUTOR IA */}
          {activeTab === 'chat' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Assistente Pedagógico IA</h2>
              
              <div className="h-80 overflow-y-auto border border-slate-200 p-4 rounded-2xl space-y-3 bg-slate-50">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs font-medium whitespace-pre-line ${msg.sender === 'user' ? 'bg-brand-green text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escreva sua dúvida ou peça um resumo simplificado..." 
                  className="flex-1 p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="bg-brand-green hover:bg-brand-greenDark text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-sm">
                  Enviar
                </button>
              </form>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

// Renderização Principal do React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EduAdaptApp />);