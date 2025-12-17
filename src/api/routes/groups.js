import { Router } from 'express'
import { listGroups } from '../../services/groups.js'

const router = Router()

router.get('/:id/groups', async (req, res) => {
  const groups = await listGroups(req.params.id)
  res.json(groups)
})

export default router
