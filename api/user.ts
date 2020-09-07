import jwt from 'jsonwebtoken'
import { allowCors } from '../utils/allow-cors'

const requestHandler = allowCors(async (req, res) => {
  const { token } = req.body as { token: string }

  res.status(200).json(jwt.decode(token))
})

export default requestHandler
