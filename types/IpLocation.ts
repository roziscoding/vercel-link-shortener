export type SuccessIpLocation = {
  status: 'success'
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

export type FailIpLocation = {
  status: 'fail'
  message: string
  query: string
}

export type IpLocation = SuccessIpLocation | FailIpLocation
