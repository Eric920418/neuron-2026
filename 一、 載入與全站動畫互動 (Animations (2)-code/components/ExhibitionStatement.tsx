'use client'

import { motion } from 'motion/react'

export default function ExhibitionStatement() {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        background: '#000',
        paddingTop: '160px',
        paddingBottom: '120px',
        paddingLeft: '80px',
        paddingRight: '80px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Hero title */}
      <div style={{ marginBottom: '80px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.4em',
            color: 'rgba(129,140,248,0.7)',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          元智大學資訊傳播學系 — 第 29 屆畢業展
        </motion.p>
        <motion.h1
          className="font-display"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          style={{
            fontSize: '96px',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '8px',
          }}
        >
          神經元
        </motion.h1>
        <motion.h1
          className="font-display"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          style={{
            fontSize: '96px',
            fontWeight: 400,
            color: 'transparent',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
            marginBottom: '48px',
          }}
        >
          NEURON 2026
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
          style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}
        >
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '4px',
            padding: '16px 24px',
          }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: 'rgba(129,140,248,0.6)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              校外展
            </p>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
            }}>
              2026.05.08 — 05.11
            </p>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '4px',
            }}>
              松山文創園區二號倉庫
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            padding: '16px 24px',
          }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              校內展
            </p>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
            }}>
              2026.04.24 — 04.26
            </p>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '4px',
            }}>
              元智大學圖書館一樓
            </p>
          </div>
        </motion.div>
      </div>

      {/* Two-column statement */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '64px',
        }}
      >
        <div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(129,140,248,0.5)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            展覽理念
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginBottom: '24px',
            }}
          >
            跨域，是我們<br />共同的神經語言
          </h2>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.45)',
          }}>
            神經元，是大腦中傳遞訊號的基本單位。每一個神經元獨立存在，卻透過突觸與無數個體相連，形成龐大而複雜的網絡。我們相信，創意也是如此——每一位創作者都是一顆獨特的神經元，而跨域的連結，正是讓思想真正發光的突觸。
          </p>
        </div>
        <div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(129,140,248,0.5)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            關於本展
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginBottom: '24px',
            }}
          >
            29 屆，四大領域<br />一次完整呈現
          </h2>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.45)',
          }}>
            本屆畢業展集結互動、遊戲、行銷、影視四大專業領域的畢業作品，呈現資訊傳播學系四年來的跨域探索。從互動裝置到多人遊戲，從品牌行銷到影像創作，每一件作品都是一次突破邊界的神經連結。
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '32px' }}>
            {[
              { num: '29', label: '屆' },
              { num: '4', label: '大領域' },
              { num: '100+', label: '位創作者' },
              { num: '60+', label: '件作品' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
              >
                <p
                  className="font-display"
                  style={{
                    fontSize: '32px',
                    color: 'rgba(129,140,248,0.9)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {stat.num}
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}