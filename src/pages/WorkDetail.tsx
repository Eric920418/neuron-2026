import { useParams, useNavigate } from 'react-router-dom'
import { getWorkById } from '../data/works'
import WorkDetailClient from '../components/WorkDetailClient'

export default function WorkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const work = getWorkById(Number(id))

  if (!work) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          paddingTop: '64px',
        }}
      >
        <p
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          找不到此作品
        </p>
        <button
          onClick={() => navigate('/works')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          返回作品列表
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <WorkDetailClient work={work} />
    </div>
  )
}
