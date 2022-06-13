import { getPublicLinks } from '../../lib/services/linkService'
import { allowCors } from '../../lib/utils/allow-cors'

export default allowCors((_, res) => {
  getPublicLinks().then(links => res.status(200).json(links))
})
