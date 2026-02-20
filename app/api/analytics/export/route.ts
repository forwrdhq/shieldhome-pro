import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()

    const leads = await prisma.lead.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      orderBy: { createdAt: 'desc' },
      include: { assignedRep: { select: { name: true } } }
    })

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'ZIP', 'Property Type', 'Homeownership', 'Timeline', 'Source', 'Medium', 'Campaign', 'Score', 'Priority', 'Status', 'Submitted', 'Rep']
    const rows = leads.map(l => [
      l.id, l.firstName, l.lastName, l.email, l.phone, l.zipCode || '',
      l.propertyType || '', l.homeownership || '', l.timeline || '',
      l.source || '', l.medium || '', l.campaign || '',
      l.leadScore, l.priority, l.status,
      l.submittedAt.toISOString(),
      l.assignedRep?.name || ''
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv"`,
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
