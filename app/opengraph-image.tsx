import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ShieldHome Pro — Free Home Security Quote'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1f33 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '90px',
            marginBottom: '24px',
          }}
        >
          <svg
            width="80"
            height="90"
            viewBox="0 0 80 90"
            fill="none"
          >
            <path
              d="M40 5L8 20V45C8 67 22 82 40 88C58 82 72 67 72 45V20L40 5Z"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth="2"
            />
            <path
              d="M34 48L28 42L25 45L34 54L56 32L53 29L34 48Z"
              fill="white"
            />
          </svg>
        </div>

        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          ShieldHome Pro
        </div>

        <div
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Authorized Vivint Smart Home Dealer
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '8px',
          }}
        >
          {['$0 Down', 'Free Setup', 'Free Doorbell Cam'].map((text) => (
            <div
              key={text}
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '999px',
                padding: '10px 24px',
                color: '#4ade80',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          shieldhome.pro — Get Your Free Quote in 60 Seconds
        </div>
      </div>
    ),
    { ...size }
  )
}
