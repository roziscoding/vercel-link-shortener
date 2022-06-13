import { getCountryList, getDailyVisits, getRefList } from '../lib/services/statService'
import { allowCors } from '../lib/utils/allow-cors'
import { extract } from '../lib/utils/extract'
import { requireAuth } from '../lib/utils/require-auth'

const shortcodeStats = allowCors(
  requireAuth(async (req, res) => {
    const shortcode = extract('shortcode').from(req)

    if (!shortcode) return res.end()

    const [countries, refs, days] = await Promise.all([
      getCountryList(shortcode),
      getRefList(shortcode),
      getDailyVisits(shortcode)
    ])

    res.status(200).json({
      countries,
      refs,
      days
    })
  })
)

export default shortcodeStats
