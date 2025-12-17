import { waitForSocket } from '../config/socketRegistry.js'

export async function sendText({
  accountId,
  to,
  text
}) {
  const socket = await waitForSocket(accountId)

  if (!socket) {
    throw new Error(`Socket da conta ${accountId} não encontrado`)
  }

  const jid = to.includes('@')
    ? to
    : `${to}@s.whatsapp.net`

  await socket.sendMessage(jid, { text })
}
