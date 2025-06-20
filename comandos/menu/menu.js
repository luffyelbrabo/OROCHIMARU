// 📄 OROCHIMARU/comandos/menu/menu.js

module.exports = {
  comando: 'menu',
  descricao: 'Exibir menu de comandos do bot',
  categoria: 'menu',
  exec: async (m, { sock }) => {
    const texto = `
🧾 *MENU DE COMANDOS – BOT OROCHIMARU*

📋 *Comandos Especiais*
- *manual*: Manual do Masterbot  
- *manualadm*: Manual do Masterbot para administradores  
- *sair*: Não receber notificações  

📋 *Comandos de Menu*
- *sp*: Comandos de Aceleradores  
- *signo*: Menu de signos  
- *menutier*: Exibir Menu Tier  
- *menucartas*: Exibir Menu Cartas  
- *castelo*: Menu Castelo  
- *menuadmin*: Menu de recursos dos admins  

🎶 *Comandos de Áudio*
- *play*: Baixar música  
- *play4*: Baixar música (alternativo)  
- *ig*: Baixar vídeo do Instagram  
- *tiktok*: Baixar vídeo do TikTok  
- *tts*: Reproduzir texto em áudio  
- *audiobot*: Usar o ChatGPT com resposta em áudio  
- *ppt*: Transcrever áudio em texto  
- *sound*: Reproduzir som com palavra-chave  

📝 *Cadastro de Dados*
- *setranking*: Cadastrar vila no ranking  
- *setestrela*: Cadastrar estrelas  
- *setaniversario*: Cadastrar aniversário  
- *ranking*: Exibir ranking de vila  
- *iranking*: Exibir ranking com menção @  
- *estrelas*: Exibir ranking de estrelas  
- *aniversario*: Mostrar aniversariantes cadastrados  
- *pp*: Mostrar quem ainda não cadastrou a vila  
- *ppd*: Mostrar quem não atualizou a vila recentemente  

🐷 *Comandos Coin Master / Pet Master*
- *tier*: Exibir tier atualizado  
- *vila*: Mostrar vila atual ou calcular próxima  
- *vilapet*: Mostrar vila pet  
- *cartasraras*: Mostrar cartas raras  
- *corte*: Exibir corte de tabela  
- *melhoresmanias*: Exibir melhores manias  
- *sequencia*: Exibir sequência de evento  
- *rase*: Exibir sequência RASE  
- *giros*: Mostrar giros Coin Master  
- *girospet*: Mostrar giros Pet Master  
- *media*: Calcular média de vilas  
- *calendario*: Mostrar calendário de eventos  
- *castelo*: Mostrar castelo principal  
- *castelogelo*: Mostrar castelo de gelo  
- *menucartas*: Exibir menu de coleções  
- *set*: Mostrar conjuntos de cartas  
- *raposa*: Tabela da raposa  
- *rino*: Tabela do rinoceronte  
- *tigre*: Tabela do tigre  

👮 *Comandos para Admins*
- *ban @*: Banir membro  
- *unban*: Desbanir número  
- *setregras*: Cadastrar regras personalizadas  
- *zerarmsg*: Zerar contagem de mensagens  
- *atenção*: Enviar alerta com @  
- *abrir*: Abrir grupo  
- *fechar*: Fechar grupo  
- *linkgrupo*: Mostrar link do grupo  
- *welcome*: Ativar/desativar boas-vindas  
- *chamar*: Mencionar todos do grupo  
- *inativos*: Mostrar inativos  
- *transcrever*: Transcrever áudio automático  
- *mododinamica*: Bloquear comandos para membros  
- *listabanidos*: Exibir lista de banidos  
- *avisoevento*: Avisar sobre eventos em tempo real  

🔄 *Outros Comandos*
- *regras*: Mostrar regras do grupo  
- *gbingo*: Gerar números de bingo  
- *iniciarbingo*: Iniciar bingo  
- *sortearbingo*: Sortear número do bingo  
- *statusbingo*: Mostrar resultado parcial do bingo  
- *perfil*: Gerar imagem com seu perfil  
- *ping*: Verificar status do bot  
- *bot*: Usar o ChatGPT via texto  
- *letra*: Mostrar letra de música  
- *letrat*: Mostrar letra traduzida  
- *emoji*: Procurar emoji  
- *sticker*: Criar figurinha  
- *sbg*: Criar figurinha sem fundo  
- *areia*: Criar arte com areia  
- *sorteio*: Sortear membro do grupo  
- *sortear*: Sortear itens, nomes ou números  
- *top5*: Mostrar top 5 aleatório  

📌 _Use todos os comandos com o prefixo **asterisco (\*)**!_
    `;

    await sock.sendMessage(m.chat, {
      text: texto.trim()
    }, { quoted: m });
  }
};