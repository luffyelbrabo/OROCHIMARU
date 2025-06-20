module.exports = {
  comando: 'regras',
  descricao: 'Exibir regras do grupo',
  categoria: 'gerais',
  exec: async (m, { sock }) => {
    const regras = `*📜 Regras do Grupo*

*🚫 Respeite todos.*
*🚫 Sem spam.*
*🚫 Não enviar conteúdo proibido.*
*🚫 Nada de flood ou correntes.*
*🚫 Use os comandos com responsabilidade.*
*🚫 Não ir no PV de ninguém.*
*🚫 Não é permitido venda de cartas e de giros.*
*🚫 Não atacar a vila dos membros do grupo. Caso ataque, peça desculpas ou será removido.*

*✅ Sejam gentis: apareçam pra dar bom dia e não só pra pedir cartas.*
*✅ Ao pedir cartas, envie print do set que precisa e agradeça ao receber.*
*✅ Nas dinâmicas, ao ganhar uma carta, tem 2h pra pedir. Caso contrário, perderá a carta.*`;

    await sock.sendMessage(m.chat, { text: regras }, { quoted: m });
  }
};