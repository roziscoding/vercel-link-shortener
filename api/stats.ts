import { getCountryList, getDailyVisits, getRefList } from '../services/statService'
import { allowCors } from '../utils/allow-cors'
import { extract } from '../utils/extract'

const shortcodeStats = allowCors(async (req, res) => {
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

export default shortcodeStats
