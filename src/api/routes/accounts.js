import { Router } from 'express'
import { createAccount } from '../../services/accountManager.js'
import { getAccountStatus } from '../../services/accountStatus.js'
import { listAccountStates } from '../../config/accountState.js'
import { waitForSocket } from '../../config/socketRegistry.js'
import { sendText } from '../../services/sender.js'

const router = Router()

router.post('/', async (req, res) => {
  const result = await createAccount()
  res.status(201).json(result)
})

// router.get('/', (req, res) => {
//   res.json(listAccountStates())
// })

router.get('/:id', (req, res) => {
  const state = getAccountStatus(req.params.id)
  res.json(state)
})

router.post('/:id/send', async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ error: 'body is null' })
  }

  const { to, text } = req.body

  if (!to || !text) {
    return res.status(400).json({ error: 'to e text são obrigatórios' })
  }

  await sendText({accountId: req.params.id, to, text})

  res.json({ success: true })
})

export default router
