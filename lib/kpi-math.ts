// Vivint commission payout schedule (per Gunnar, Apr 2026):
//   upfront  = 37.8% of gross commission, paid Friday after install week
//   backend1 = 70% of remaining 62.2%, paid in October
//   backend2 = 30% of remaining 62.2%, paid in January
// Revenue is split 50/50 between us and the closer (Gunnar). Ad spend is also 50/50.

export const UPFRONT_PCT = 0.378
export const BACKEND_1_OF_REMAINING = 0.7
export const BACKEND_2_OF_REMAINING = 0.3
export const OUR_SPLIT = 0.5

export function projectGross(upfrontCommission: number) {
  return upfrontCommission / UPFRONT_PCT
}

export function projectBackends(upfrontCommission: number) {
  const gross = projectGross(upfrontCommission)
  const remaining = gross - upfrontCommission
  return {
    gross,
    remaining,
    backend1: remaining * BACKEND_1_OF_REMAINING,
    backend2: remaining * BACKEND_2_OF_REMAINING,
  }
}

export function ourProjection(upfrontCommission: number, adSpend: number) {
  const { gross, backend1, backend2 } = projectBackends(upfrontCommission)
  const ourUpfront = upfrontCommission * OUR_SPLIT
  const ourBackend1 = backend1 * OUR_SPLIT
  const ourBackend2 = backend2 * OUR_SPLIT
  const ourAdSpend = adSpend * OUR_SPLIT
  const ourTotal = ourUpfront + ourBackend1 + ourBackend2
  const ourNet = ourTotal - ourAdSpend
  return {
    gross,
    ourUpfront,
    ourBackend1,
    ourBackend2,
    ourTotal,
    ourAdSpend,
    ourNet,
    roas: adSpend > 0 ? gross / adSpend : 0,
  }
}

export function startOfWeek(d: Date): Date {
  // Monday 00:00:00 local
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  const day = out.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  out.setDate(out.getDate() + diff)
  return out
}

export function endOfWeek(d: Date): Date {
  const start = startOfWeek(d)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return end
}
