import { prisma } from './db'

export async function getAnalyticsData(startDate: Date, endDate: Date) {
  const [leads, sales, commissions] = await Promise.all([
    prisma.lead.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: {
        id: true, status: true, source: true, leadScore: true,
        speedToContact: true, createdAt: true, submittedAt: true,
        firstContactAt: true, appointmentDate: true, appointmentSat: true,
        saleAmount: true, priority: true, timeline: true, homeownership: true,
      }
    }),
    prisma.lead.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'CLOSED_WON'
      },
      select: { id: true, saleAmount: true, source: true, createdAt: true }
    }),
    prisma.commission.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { ourShare: true, adSpend: true, netProfit: true, status: true }
    })
  ])

  const totalLeads = leads.length
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, s) => sum + (s.saleAmount || 0), 0)
  const totalCommission = commissions.reduce((sum, c) => sum + c.ourShare, 0)
  const totalAdSpend = commissions.reduce((sum, c) => sum + (c.adSpend || 0), 0)
  const netProfit = totalCommission - totalAdSpend

  const conversionRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0
  const avgCPL = totalLeads > 0 && totalAdSpend > 0 ? totalAdSpend / totalLeads : 0
  const avgCPA = totalSales > 0 && totalAdSpend > 0 ? totalAdSpend / totalSales : 0
  const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0

  const speedValues = leads.filter(l => l.speedToContact).map(l => l.speedToContact!)
  const avgSpeedToContact = speedValues.length > 0
    ? Math.round(speedValues.reduce((a, b) => a + b, 0) / speedValues.length)
    : 0

  const avgLeadScore = totalLeads > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / totalLeads)
    : 0

  const byStatus: Record<string, number> = {}
  leads.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1 })

  const sourceMap: Record<string, { leads: number; sales: number; revenue: number }> = {}
  leads.forEach(l => {
    const src = l.source || 'direct'
    if (!sourceMap[src]) sourceMap[src] = { leads: 0, sales: 0, revenue: 0 }
    sourceMap[src].leads++
    if (l.status === 'CLOSED_WON') {
      sourceMap[src].sales++
      sourceMap[src].revenue += l.saleAmount || 0
    }
  })

  const bySource: Record<string, { leads: number; sales: number; cpl: number; convRate: number }> = {}
  Object.entries(sourceMap).forEach(([src, data]) => {
    bySource[src] = {
      leads: data.leads,
      sales: data.sales,
      cpl: 0,
      convRate: data.leads > 0 ? (data.sales / data.leads) * 100 : 0,
    }
  })

  const contacted = leads.filter(l => l.firstContactAt).length
  const apptSet = leads.filter(l => ['APPOINTMENT_SET', 'APPOINTMENT_SAT', 'QUOTED', 'CLOSED_WON'].includes(l.status)).length
  const apptSat = leads.filter(l => l.appointmentSat).length
  const closed = totalSales

  const funnelMetrics = {
    leadToContact: totalLeads > 0 ? (contacted / totalLeads) * 100 : 0,
    contactToAppointment: contacted > 0 ? (apptSet / contacted) * 100 : 0,
    appointmentToSat: apptSet > 0 ? (apptSat / apptSet) * 100 : 0,
    satToClose: apptSat > 0 ? (closed / apptSat) * 100 : 0,
    leadToClose: conversionRate,
  }

  // Timeline data by day
  const timelineMap: Record<string, { date: string; leads: number; sales: number; spend: number }> = {}
  leads.forEach(l => {
    const d = l.createdAt.toISOString().split('T')[0]
    if (!timelineMap[d]) timelineMap[d] = { date: d, leads: 0, sales: 0, spend: 0 }
    timelineMap[d].leads++
    if (l.status === 'CLOSED_WON') timelineMap[d].sales++
  })
  const timeline = Object.values(timelineMap).sort((a, b) => a.date.localeCompare(b.date))

  return {
    overview: {
      totalLeads, totalSales, totalRevenue, totalCommission,
      totalAdSpend, netProfit, conversionRate, avgCPL, avgCPA, roas,
      avgSpeedToContact, avgLeadScore
    },
    bySource,
    byStatus,
    funnelMetrics,
    timeline
  }
}
