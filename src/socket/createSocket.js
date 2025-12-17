import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from '@whiskeysockets/baileys'
import P from 'pino'
import { setAccountState } from '../config/accountState.js'

/** @typedef {import('@whiskeysockets/baileys').WASocket} WASocket */

/**
 * @param {{ id: string, sessionPath: string }} params
 * @returns {Promise<WASocket>}
 */
export async function createSocket({ id, sessionPath }) {
  setAccountState(id, 'creating')

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

  return new Promise((resolve, reject) => {
    const socket = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' })
    })

    socket.ev.on('creds.update', saveCreds)

    socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        setAccountState(id, 'waiting_qr', { qr })
      }

      if (connection === 'open') {
        setAccountState(id, 'connected')
        resolve(socket)
      }

      if (connection === 'close') {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode

        if (statusCode === DisconnectReason.loggedOut) {
          setAccountState(id, 'logged_out')
        } else {
          setAccountState(id, 'error', {
            error: 'connection_closed'
          })
          reject(new Error('Connection closed'))
        }
      }
    })
  })
}
