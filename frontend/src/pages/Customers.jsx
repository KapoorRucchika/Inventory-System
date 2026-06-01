import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { customersApi } from '../lib/api'
import {
  PageHeader, Card, Button, Modal, FormField,
  Spinner, EmptyState
} from '../components/ui'
import { Plus, Users, Trash2, Mail, Phone } from 'lucide-react'

const EMPTY_FORM = { full_name: '', email: '', phone: '' }

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    customersApi.getAll().then(setCustomers).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await customersApi.create({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null
      })
      toast.success('Customer added')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer? This may affect their order history.')) return
    setDeletingId(id)
    try {
      await customersApi.delete(id)
      toast.success('Customer deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customer${customers.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openCreate}><Plus size={15} />New Customer</Button>}
      />

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : customers.length === 0 ? (
          <EmptyState icon={Users} title="No customers yet" description="Add your first customer to get started" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 32, height: 32,
                        background: 'var(--accent-glow)',
                        border: '1px solid var(--accent)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, color: 'var(--accent-light)',
                        flexShrink: 0
                      }}>
                        {getInitials(c.full_name)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{c.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <Mail size={13} />
                      {c.email}
                    </div>
                  </td>
                  <td>
                    {c.phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <Phone size={13} />
                        {c.phone}
                      </div>
                    ) : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="danger" size="sm" loading={deletingId === c.id} onClick={() => handleDelete(c.id)}>
                      <Trash2 size={13} />Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Customer">
        <FormField label="Full Name" error={errors.full_name} required>
          <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Jane Smith" />
        </FormField>
        <FormField label="Email Address" error={errors.email} required>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
        </FormField>
        <FormField label="Phone Number">
          <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
        </FormField>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button loading={saving} onClick={handleSubmit}>Add Customer</Button>
        </div>
      </Modal>
    </div>
  )
}
