🤖 BOT OROCHIMARU — RESUMO COMPLETO

O BOT OROCHIMARU é um bot multifuncional desenvolvido para WhatsApp, com foco em:

🎮 Coin Master / Pet Master

🎧 Áudio, música e mídia

📊 Rankings e cadastros personalizados

👮 Administração de grupos

🔄 Comandos extras e entretenimento


A estrutura foi organizada em pastas e comandos padronizados, todos acionados com prefixo * (asterisco).

📁 ESTRUTURA DO PROJETO

OROCHIMARU/
├── comandos/
│   ├── cadastro/
│   │   ├── setranking.js
│   │   ├── setestrela.js
│   │   ├── setaniversario.js
│   │   ├── ranking.js
│   │   ├── aniversario.js
│   │   └── iranking.js
│   ├── coinmaster/
│   │   ├── calendario.js
│   │   ├── giros.js
│   │   ├── cartasraras.js
│   │   ├── melhoresmanias.js
│   │   ├── vila.js
│   │   ├── tier.js
│   │   ├── raposa.js, tigre.js, rino.js
│   │   └── media.js
│   ├── gerais/
│   │   ├── audiobot.js
│   │   ├── letra.js
│   │   ├── emoji.js
│   │   ├── sorteio.js
│   │   └── ping.js
│   ├── menu/
│   │   └── menu.js
│   ├── admin/
│   │   ├── ban.js, unban.js, welcome.js, regras.js
│   │   ├── setregras.js, abrir.js, fechar.js, chamar.js, etc.
│   └── outros/
│       ├── sorteio.js, gbingo.js, top5.js, etc.
├── lib/
│   ├── db.js                 ← Banco SQLite
│   ├── scraping/
│   │   ├── giros.js
│   │   ├── calendario.js
│   │   └── eventos.js
│   ├── cache/
│   │   ├── calendario_cache.json
│   │   └── cartasraras.json
├── media/
│   └── vídeos e imagens de apoio



🧩 FUNCIONALIDADES PRINCIPAIS

📋 Comandos Especiais

*manual – Manual do bot para usuários

*manualadm – Manual exclusivo para administradores

*sair – Remover-se das notificações


📋 Comandos de Menu

*menu, *menuadmin, *menucartas, *menutier, *sp, etc.


📝 Cadastro de Dados

*setranking – Cadastra a vila do usuário (ex: "setranking Jefferson:150")

*setestrela – Cadastra estrelas

*setaniversario – Cadastra data de aniversário (ex: "setaniversario 20/12")

*ranking, *estrelas, *aniversario, *iranking – Exibição dos dados


🐷 Coin Master & Pet Master

*giros – Mostra links atualizados de giros (via scraping)

*calendario – Exibe calendário de eventos com horários por dia

*cartasraras – Lista por raridade e sets das cartas raras

*melhoresmanias, *sequencia, *rase, *tier, *vila, etc.


🎶 Áudio, Música e Vídeo

*play, *tts, *ppt, *audiobot, *ig, *tiktok, etc.


👮 Comandos Admin

*ban, *unban, *setregras, *zerarmsg, *abrir, *fechar, etc.

*mododinamica – Bloqueia comandos para membros

*avisoevento, *chamar, *inativos, etc.


🔄 Outros Comandos

*sorteio, *megasena, *gbingo, *statusbingo, *perfil, *ping, etc.



---

🧠 INTELIGÊNCIA GPT INTEGRADA

*bot – Interface direta com o ChatGPT em texto

*audiobot – Conversa com o ChatGPT e responde com áudio



---

🧩 DETALHES TÉCNICOS

🧠 Scraping via axios + cheerio

🧮 Banco de dados em SQLite (lib/db.js)

📦 Cache local para dados dinâmicos

📽️ Vídeos de ajuda são enviados automaticamente quando comandos são usados incorretamente (/media/)



---

🚀 EXEMPLOS DE USO

*setranking Jefferson:321
*setestrela 98500
*setaniversario 20/06
*giros
*cartasraras
*ranking