'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SPIKE_MARK = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="1" y1="12" x2="23" y2="12" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="round" />
    <line
      x1="4.1"
      y1="4.1"
      x2="19.9"
      y2="19.9"
      stroke="#1A1A1A"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="19.9"
      y1="4.1"
      x2="4.1"
      y2="19.9"
      stroke="#1A1A1A"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

const CHECKMARK = (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path
      d="M2 5.5l2.5 2.5 4.5-4.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const COLOR_DOTS = [
  { color: '#E8784A', label: 'Coral' },
  { color: '#1A6EA8', label: 'Blue' },
  { color: '#B7770D', label: 'Amber' },
  { color: '#9A9A9A', label: 'Gray' },
  { color: '#3B6D11', label: 'Green' },
]

const PIPELINE_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won']

export default function OnboardingPage() {
  const [stageName, setStageName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#E8784A')

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAFAF8', color: '#1A1A1A' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-12 py-5"
        style={{ borderBottom: '1px solid #E8E8E6' }}
      >
        <div className="flex items-center gap-2">
          {SPIKE_MARK}
          <span
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: '-0.3px',
            }}
          >
            DigiFNB CRM
          </span>
        </div>
        <Link href="/dashboard" style={{ color: '#6B6B6B', fontSize: 13 }}>
          Skip setup
        </Link>
      </nav>

      {/* Hero Band */}
      <section className="flex flex-col items-center px-12 pt-20 pb-14 text-center">
        <div className="mb-5">{SPIKE_MARK}</div>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 58,
            fontWeight: 400,
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            color: '#1A1A1A',
            marginBottom: 18,
          }}
        >
          Set up your CRM
        </h1>
        <p style={{ fontSize: 19, color: '#6B6B6B', marginBottom: 36, lineHeight: 1.5 }}>
          You&apos;re 4 steps away from your first closed deal.
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center"
            style={{ width: 26, height: 26, borderRadius: '50%', background: '#E8784A' }}
            aria-label="Step 1 completed"
          >
            {CHECKMARK}
          </div>
          <div
            className="animate-pulse"
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#E8784A',
              boxShadow: '0 0 0 4px rgba(232,120,74,0.2)',
            }}
            aria-label="Step 2 active"
          />
          <div
            style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #D0CCC8' }}
            aria-label="Step 3 upcoming"
          />
          <div
            style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #D0CCC8' }}
            aria-label="Step 4 upcoming"
          />
        </div>
      </section>

      {/* Checklist Card */}
      <section className="flex justify-center px-12 pb-7">
        <div
          className="w-full"
          style={{
            maxWidth: 680,
            background: '#EDE9E4',
            borderRadius: 12,
            padding: '40px 44px',
          }}
        >
          {/* Step 1: Completed */}
          <div
            className="flex items-center gap-3.5 pb-5"
            style={{ borderBottom: '1px solid #D0CCC8', marginBottom: 20 }}
          >
            <div
              className="flex flex-shrink-0 items-center justify-center"
              style={{ width: 26, height: 26, borderRadius: '50%', background: '#E8784A' }}
            >
              {CHECKMARK}
            </div>
            <span
              className="flex-1"
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: '#9A9A9A',
                textDecoration: 'line-through',
              }}
            >
              Add your first contact
            </span>
            <span
              style={{
                background: 'rgba(232,120,74,0.15)',
                color: '#D96B3C',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 100,
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}
            >
              Done
            </span>
          </div>

          {/* Step 2: Active */}
          <div
            className="flex items-center gap-3.5 pb-5"
            style={{ borderBottom: '1px solid #D0CCC8', marginBottom: 20 }}
          >
            <div
              className="flex-shrink-0 animate-pulse"
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '2px solid #E8784A',
                background: 'rgba(232,120,74,0.12)',
                boxShadow: '0 0 0 4px rgba(232,120,74,0.15)',
              }}
            />
            <span className="flex-1" style={{ fontSize: 17, fontWeight: 500, color: '#1A1A1A' }}>
              Create a pipeline stage
            </span>
            <Button
              style={{
                background: '#E8784A',
                color: 'white',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
              }}
              className="h-auto cursor-pointer border-0 px-4 py-1.5"
            >
              Start →
            </Button>
          </div>

          {/* Step 3: Upcoming */}
          <div
            className="flex items-center gap-3.5 pb-5"
            style={{ borderBottom: '1px solid #D0CCC8', marginBottom: 20 }}
          >
            <div
              className="flex-shrink-0"
              style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #D0CCC8' }}
            />
            <span className="flex-1" style={{ fontSize: 17, fontWeight: 400, color: '#6B6B6B' }}>
              Log your first activity
            </span>
          </div>

          {/* Step 4: Upcoming */}
          <div className="flex items-center gap-3.5">
            <div
              className="flex-shrink-0"
              style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #D0CCC8' }}
            />
            <span className="flex-1" style={{ fontSize: 17, fontWeight: 400, color: '#6B6B6B' }}>
              Invite a teammate
            </span>
          </div>
        </div>
      </section>

      {/* Active Step Expanded */}
      <section className="flex justify-center px-12 pb-16">
        <div
          className="w-full"
          style={{
            maxWidth: 680,
            border: '1px solid #E8E8E6',
            borderRadius: 12,
            padding: '36px 44px',
            background: '#FAFAF8',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 26,
              fontWeight: 400,
              color: '#1A1A1A',
              marginBottom: 10,
            }}
          >
            Create a pipeline stage
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.65, marginBottom: 24 }}>
            Stages define how a deal moves through your process. Most teams start with Lead,
            Qualified, and Won.
          </p>

          <div style={{ marginBottom: 18 }}>
            <Label
              htmlFor="stage-name"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: '#6B6B6B',
                marginBottom: 7,
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}
            >
              Stage Name
            </Label>
            <Input
              id="stage-name"
              type="text"
              placeholder="e.g. Qualified"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              className="focus-visible:border-[#E8784A] focus-visible:ring-0"
              style={{
                fontSize: 14,
                background: '#FFFFFF',
                color: '#1A1A1A',
                fontFamily: 'inherit',
                borderColor: '#E8E8E6',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#6B6B6B',
                marginBottom: 10,
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}
            >
              Stage Color
            </p>
            <div className="flex items-center gap-2.5">
              {COLOR_DOTS.map(({ color, label }) => (
                <Button
                  key={color}
                  type="button"
                  variant="ghost"
                  aria-label={label}
                  onClick={() => setSelectedColor(color)}
                  className="h-[26px] w-[26px] cursor-pointer rounded-full border-0 p-0"
                  style={{
                    background: color,
                    boxShadow:
                      selectedColor === color ? `0 0 0 2px #FAFAF8, 0 0 0 3.5px ${color}` : 'none',
                    transition: 'box-shadow 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            type="button"
            style={{
              background: '#E8784A',
              color: 'white',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 14,
            }}
            className="block h-auto cursor-pointer border-0 px-[22px] py-[11px]"
          >
            Add Stage
          </Button>
          <Link href="#" style={{ color: '#1A6EA8', fontSize: 13, textDecoration: 'none' }}>
            Or import from Salesforce
          </Link>
        </div>
      </section>

      {/* Empty Pipeline Preview */}
      <section className="px-12 pb-20">
        <div style={{ background: '#191919', borderRadius: 12, padding: '40px 44px' }}>
          <p
            style={{
              fontSize: 19,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.88)',
              marginBottom: 28,
            }}
          >
            Your pipeline will appear here
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 12,
              marginBottom: 32,
            }}
          >
            {PIPELINE_STAGES.map((stage) => (
              <div
                key={stage}
                style={{
                  background: '#252320',
                  borderRadius: 10,
                  border: '1.5px dashed rgba(255,255,255,0.12)',
                  padding: '20px 14px',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.3)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {stage}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                  Drop deals here
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button
              type="button"
              style={{
                background: '#E8784A',
                color: 'white',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
              }}
              className="h-auto cursor-pointer border-0 px-[26px] py-[11px]"
            >
              Add your first deal
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section
        className="mx-12 mb-12 text-center"
        style={{ background: '#E8784A', borderRadius: 12, padding: '56px 48px' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 34,
            fontWeight: 400,
            color: 'white',
            marginBottom: 10,
            letterSpacing: '-0.5px',
          }}
        >
          Bring your whole team.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 30,
            lineHeight: 1.5,
          }}
        >
          Invite teammates and close deals together.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            style={{
              background: '#FAFAF8',
              color: '#D96B3C',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
            }}
            className="h-10 cursor-pointer border-0 px-[22px]"
          >
            Invite Team
          </Button>
          <Link
            href="#"
            style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, textDecoration: 'none' }}
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-12 py-8"
        style={{ background: '#191919' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 17,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          DigiFNB CRM
        </span>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Contact'].map((link) => (
            <Link
              key={link}
              href="#"
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none' }}
            >
              {link}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 DigiFNB</span>
      </footer>
    </div>
  )
}
