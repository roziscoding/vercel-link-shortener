import { NowRequest } from '@vercel/node'

export const extract = (paramName: string) => ({
  from: (req: NowRequest) => {
    const param = req.query[paramName]

    if (!param) return null
    if (Array.isArray(param)) return param[0]
    return param
  }
})
