import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FinCalc India — Free Financial Calculators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '56px',
              lineHeight: 1,
            }}
          >
            📊
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#ffffff' }}>
              FinCalc
            </span>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#60a5fa' }}>
              India
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '26px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '700px',
            lineHeight: 1.4,
          }}
        >
          Free SIP · EMI · FD · PPF · Lumpsum · Tax Calculators
        </div>

        {/* Calculator pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {['SIP', 'EMI', 'FD', 'PPF', 'Lumpsum', 'Tax FY 2025-26'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(96, 165, 250, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '18px',
                color: '#93c5fd',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ fontSize: '20px', color: '#475569', marginTop: '8px' }}>
          fincalc-india.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
