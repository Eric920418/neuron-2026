import { useState } from 'react'

type TabKey = 'general' | 'technical' | 'collaboration'

const tabs: { key: TabKey; label: string; desc: string }[] = [
  { key: 'general', label: '一般建議', desc: '展覽相關意見與回饋' },
  { key: 'technical', label: '網站問題', desc: '技術問題回報' },
  { key: 'collaboration', label: '合作邀約', desc: '媒體採訪與商業合作' },
]

const socialLinks = [
  {
    name: 'Instagram',
    handle: '@yzuic_29',
    url: 'https://www.instagram.com/yzuic_29/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Threads',
    handle: '@yzuic_29',
    url: 'https://www.threads.com/@yzuic_29',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.18.136h.014c2.746.018 5.1.818 6.998 2.378 1.798 1.476 2.994 3.552 3.556 6.17l-2.882.602c-.44-2.099-1.327-3.726-2.638-4.836-1.27-1.075-2.94-1.636-4.962-1.65-2.69.018-4.73.87-6.063 2.532C4.87 6.9 4.18 9.22 4.18 12.068c0 2.85.69 5.168 2.023 6.736 1.333 1.662 3.373 2.514 6.063 2.532 1.998-.014 3.618-.538 4.814-1.558 1.27-1.082 1.97-2.66 2.08-4.69H12.18v-2.68h9.32v1.34c0 3.516-.98 6.3-2.912 8.27C16.66 23.19 14.64 24 12.186 24z" />
      </svg>
    ),
  },
  {
    name: 'LINE 官方帳號',
    handle: 'NEURON 2026',
    url: 'https://lin.ee/sFMgbgw',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2C6.48 2 2 6.02 2 11c0 3.84 2.36 7.17 5.9 8.9.26.13.44.38.44.66v1.5c0 .41.47.64.8.4l2.1-1.57c.18-.13.4-.18.62-.15.37.05.75.07 1.14.07 5.52 0 10-4.02 10-9C22 6.02 17.52 2 12 2zm-4.5 11.5h-1.25c-.41 0-.75-.34-.75-.75v-3.5c0-.41.34-.75.75-.75s.75.34.75.75v2.75H7.5c.41 0 .75.34.75.75s-.34.75-.75.75zm2.75 0c-.41 0-.75-.34-.75-.75v-3.5c0-.41.34-.75.75-.75s.75.34.75.75v3.5c0 .41-.34.75-.75.75zm4.5 0c-.28 0-.54-.16-.67-.41l-1.58-2.89v2.55c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.5c0-.41.34-.75.75-.75.28 0 .54.16.67.41l1.58 2.89V9.75c0-.41.34-.75.75-.75s.75.34.75.75v3.5c0 .41-.34.75-.75.75zm3.25 0h-2c-.41 0-.75-.34-.75-.75v-3.5c0-.41.34-.75.75-.75h2c.41 0 .75.34.75.75s-.34.75-.75.75h-1.25v.5H18c.41 0 .75.34.75.75s-.34.75-.75.75h-1.25v.5H18c.41 0 .75.34.75.75s-.34.75-.75.75z" />
      </svg>
    ),
  },
]

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  organization: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = '請輸入姓名'
    if (!formData.email.trim()) {
      newErrors.email = '請輸入 Email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email 格式不正確'
    }
    if (!formData.subject.trim()) newErrors.subject = '請輸入主旨'
    if (!formData.message.trim()) newErrors.message = '請輸入訊息內容'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '4px',
    padding: '14px 16px',
    color: '#fff',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '14px',
    outline: 'none',
    letterSpacing: '0.02em',
    transition: 'border-color 0.2s ease',
  })

  return (
    <section
      style={{
        background: '#000',
        minHeight: '100vh',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        paddingTop: 'calc(64px + clamp(40px, 6vw, 80px))',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(102,140,141,0.5)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Contact Us
          </p>
          <h2 className="font-display" style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            聯絡我們
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'start',
        }}>
          {/* Left: Form */}
          <div>
            <div style={{
              display: 'flex',
              gap: '0',
              marginBottom: '40px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    setSubmitted(false)
                    setErrors({})
                  }}
                  style={{
                    padding: '12px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid #668C8D' : '2px solid transparent',
                    color: activeTab === tab.key ? '#668C8D' : 'rgba(255,255,255,0.35)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                    marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {submitted ? (
              <div style={{
                padding: '48px 32px',
                border: '1px solid rgba(102,140,141,0.2)',
                borderRadius: '8px',
                background: 'rgba(102,140,141,0.05)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(102,140,141,0.15)',
                  border: '1px solid rgba(102,140,141,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#668C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="font-display" style={{ fontSize: '24px', color: '#fff', marginBottom: '8px', fontWeight: 400 }}>
                  訊息已送出
                </p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  感謝您的來信，我們將盡快回覆。
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', subject: '', message: '', organization: '' })
                  }}
                  style={{
                    marginTop: '24px',
                    padding: '10px 24px',
                    background: 'none',
                    border: '1px solid rgba(102,140,141,0.3)',
                    borderRadius: '9999px',
                    color: 'rgba(102,140,141,0.8)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  再次送出
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      姓名 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="您的姓名"
                      style={inputStyle(errors.name)}
                      onFocus={e => { e.currentTarget.style.borderColor = '#668C8D' }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.name ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)' }}
                    />
                    {errors.name && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(239,68,68,0.8)', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle(errors.email)}
                      onFocus={e => { e.currentTarget.style.borderColor = '#668C8D' }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.email ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)' }}
                    />
                    {errors.email && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(239,68,68,0.8)', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                </div>

                {activeTab === 'collaboration' && (
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      單位 / 公司
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => handleChange('organization', e.target.value)}
                      placeholder="您的單位或公司名稱"
                      style={inputStyle()}
                      onFocus={e => { e.currentTarget.style.borderColor = '#668C8D' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    主旨 *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => handleChange('subject', e.target.value)}
                    placeholder={
                      activeTab === 'general' ? '展覽相關問題...' :
                      activeTab === 'technical' ? '請描述遇到的問題...' :
                      '合作邀約主旨...'
                    }
                    style={inputStyle(errors.subject)}
                    onFocus={e => { e.currentTarget.style.borderColor = '#668C8D' }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.subject ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)' }}
                  />
                  {errors.subject && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(239,68,68,0.8)', marginTop: '4px' }}>{errors.subject}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    訊息內容 *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => handleChange('message', e.target.value)}
                    placeholder={
                      activeTab === 'general' ? '請分享您的想法或建議...' :
                      activeTab === 'technical' ? '請詳細描述問題，包含使用的裝置與瀏覽器...' :
                      '請說明合作方式與目的...'
                    }
                    rows={5}
                    style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: '120px' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#668C8D' }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.message ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)' }}
                  />
                  {errors.message && <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(239,68,68,0.8)', marginTop: '4px' }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '16px 32px',
                    background: submitting ? 'rgba(102,140,141,0.3)' : 'rgba(102,140,141,0.15)',
                    border: '1px solid rgba(102,140,141,0.4)',
                    borderRadius: '9999px',
                    color: submitting ? 'rgba(102,140,141,0.5)' : '#668C8D',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    alignSelf: 'flex-start',
                  }}
                >
                  {submitting ? '送出中...' : '送出訊息'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                {activeTab === 'general' && '歡迎分享您對「神經元 NEURON 2026」展覽的任何想法、建議或回饋，我們非常重視每一位觀眾的聲音。'}
                {activeTab === 'technical' && '如果您在瀏覽本網站時遇到任何技術問題，請詳細描述問題情況，我們的技術團隊將盡快處理。'}
                {activeTab === 'collaboration' && '我們歡迎媒體採訪、品牌合作與各類邀約。請提供您的單位資訊與合作提案，我們將安排專人與您聯繫。'}
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '16px' }}>
                社群媒體
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {socialLinks.map((social, idx) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} ${social.handle}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 0',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: idx === socialLinks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      textDecoration: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'rgba(102,140,141,0.7)' }}>{social.icon}</span>
                      <div>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em' }}>
                          {social.name}
                        </p>
                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(102,140,141,0.5)', letterSpacing: '0.05em' }}>
                          {social.handle}
                        </p>
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '16px' }}>
                展覽資訊
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(102,140,141,0.5)', letterSpacing: '0.1em', marginBottom: '4px' }}>校外展</p>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>2026.05.08 — 05.11</p>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>松山文創園區 二號倉庫</p>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(102,140,141,0.5)', letterSpacing: '0.1em', marginBottom: '4px' }}>校內展</p>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>2026.04.24 — 04.26</p>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>元智大學 圖書館一樓大廳</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
