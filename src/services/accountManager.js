import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { createSocket } from '../socket/createSocket.js'
import { registerSocket } from '../config/socketRegistry.js'
import { getAccountState } from '../config/accountState.js'

const SESSIONS_DIR = path.resolve('sessions')

export async function createAccount(accountId) {
  const sessionPath = path.join(SESSIONS_DIR, accountId)

  fs.mkdirSync(sessionPath, { recursive: true })

  createSocket({ id: accountId, sessionPath })
    .then(socket => {
      registerSocket(accountId, socket)
    })
    .catch(() => {
      // estado já tratado no createSocket
    })

  return {
    accountId,
    state: getAccountState(accountId)
  }
}
