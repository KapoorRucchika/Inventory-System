import { Loader2 } from 'lucide-react'

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      ...style
    }}>
      {children}
    </div>
  )
}

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, style = {}, type = 'button'
}) {
  const variants = {
    primary: {
      background: disabled || loading ? 'var(--border-bright)' : 'var(--accent)',
      color: '#fff',
      boxShadow: disabled || loading ? 'none' : '0 2px 12px var(--accent-glow)'
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text)',
      border: '1px solid var(--border)'
    },
    danger: {
      background: disabled ? 'var(--border-bright)' : 'var(--red-bg)',
      color: 'var(--red)',
      border: '1px solid var(--red)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
    }
  }
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '8px' },
    md: { padding: '10px 18px', fontSize: '14px', borderRadius: '10px' },
    lg: { padding: '13px 24px', fontSize: '15px', borderRadius: '12px' }
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        fontWeight: 500, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s',
        border: 'none',
        ...variants[variant],
        ...sizes[size],
        ...style
      }}
    >
      {loading && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
      {children}
    </button>
  )
}

export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: { background: 'var(--bg-elevated)', color: 'var(--text-muted)' },
    success: { background: 'var(--green-bg)', color: 'var(--green)' },
    warning: { background: 'var(--amber-bg)', color: 'var(--amber)' },
    danger: { background: 'var(--red-bg)', color: 'var(--red)' },
    accent: { background: 'var(--accent-glow)', color: 'var(--accent-light)' }
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: '6px',
      fontSize: '12px', fontWeight: 600,
      letterSpacing: '0.02em',
      ...styles[variant]
    }}>
      {children}
    </span>
  )
}

export function Spinner({ size = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <Loader2 size={size} color="var(--accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', gap: '12px',
      color: 'var(--text-muted)'
    }}>
      {Icon && <Icon size={40} style={{ opacity: 0.3 }} />}
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-dim)' }}>{title}</p>
      {description && <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: 320 }}>{description}</p>}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', width: 32, height: 32,
              borderRadius: '8px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontSize: '16px'
            }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FormField({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block', marginBottom: '6px',
        fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)'
      }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{error}</p>
      )}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color = 'var(--accent)', suffix }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: 44, height: 44,
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {value}{suffix}
        </p>
      </div>
    </div>
  )
}
