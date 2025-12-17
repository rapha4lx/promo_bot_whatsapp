import { getAccountState } from '../config/accountState.js'

export function getAccountStatus(accountId) {
  const state = getAccountState(accountId)

  if (!state) {
    return {
      status: 'not_found'
    }
  }

  return state
}
