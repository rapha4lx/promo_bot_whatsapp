/** @typedef {'creating' | 'waiting_qr' | 'authenticated' | 'connected' | 'logged_out' | 'error'} AccountStatus */

const states = new Map()

/**
 * @param {string} accountId
 * @param {AccountStatus} status
 * @param {{ qr?: string, error?: string }} [extra]
 */
export function setAccountState(accountId, status, extra = {}) {
  states.set(accountId, {
    status,
    qr: extra.qr ?? null,
    error: extra.error ?? null,
    updatedAt: Date.now()
  })
}

export function getAccountState(accountId) {
  return states.get(accountId) ?? null
}

export function listAccountStates() {
  return Array.from(states.entries()).map(([id, state]) => ({
    accountId: id,
    ...state
  }))
}
