import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ordersApi, customersApi, productsApi } from '../lib/api'
import {
  PageHeader, Card, Button, Modal, FormField,
  Badge, Spinner, EmptyState
} from '../components/ui'
import { Plus, ShoppingCart, Trash2, Eye, X, PlusCircle } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([ordersApi.getAll(), customersApi.getAll(), productsApi.getAll()])
      .then(([o, c, p]) => { setOrders(o); setCustomers(c); setProducts(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setCustomerId('')
    setItems([{ product_id: '', quantity: 1 }])
    setErrors({})
    setModalOpen(true)
  }

  const addItem = () => setItems(i => [...i, { product_id: '', quantity: 1 }])
  const removeItem = (idx) => setItems(i => i.filter((_, j) => j !== idx))
  const updateItem = (idx, field, val) =>
    setItems(i => i.map((item, j) => j === idx ? { ...item, [field]: val } : item))

  const validate = () => {
    const e = {}
    if (!customerId) e.customer = 'Select a customer'
    items.forEach((item, i) => {
      if (!item.product_id) e[`item_${i}_product`] = 'Select a product'
      if (!item.quantity || item.quantity < 1) e[`item_${i}_qty`] = 'Min 1'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const calcTotal = () =>
    items.reduce((sum, item) => {
      const p = products.find(p => p.id === Number(item.product_id))
      return sum + (p ? parseFloat(p.price) * (item.quantity || 0) : 0)
    }, 0)

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await ordersApi.create({
        customer_id: Number(customerId),
        items: items.map(i => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) }))
      })
      toast.success('Order created')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Cancel this order? Stock will be restored.')) return
    setDeletingId(id)
    try {
      await ordersApi.delete(id)
      toast.success('Order cancelled')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openCreate}><Plus size={15} />New Order</Button>}
      />

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : orders.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders yet" description="Create your first order to get started" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-light)' }}>
                    #{String(o.id).padStart(4, '0')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{o.customer?.full_name || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.items?.length ?? 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>₹{parseFloat(o.total_amount).toFixed(2)}</td>
                  <td><Badge variant="accent">{o.status}</Badge></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/orders/${o.id}`}>
                        <Button variant="ghost" size="sm"><Eye size={13} />View</Button>
                      </Link>
                      <Button variant="danger" size="sm" loading={deletingId === o.id} onClick={() => handleDelete(o.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <FormField label="Customer" error={errors.customer} required>
          <select value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">Select customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
          </select>
        </FormField>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
              Order Items <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <Button variant="ghost" size="sm" onClick={addItem}>
              <PlusCircle size={13} />Add Item
            </Button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 32px',
              gap: '8px', marginBottom: '8px', alignItems: 'start'
            }}>
              <div>
                <select
                  value={item.product_id}
                  onChange={e => updateItem(idx, 'product_id', e.target.value)}
                  style={{ borderColor: errors[`item_${idx}_product`] ? 'var(--red)' : undefined }}
                >
                  <option value="">Select product…</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{parseFloat(p.price).toFixed(2)} (stock: {p.quantity})
                    </option>
                  ))}
                </select>
                {errors[`item_${idx}_product`] && (
                  <p style={{ fontSize: '11px', color: 'var(--red)', marginTop: 2 }}>{errors[`item_${idx}_product`]}</p>
                )}
              </div>
              <input
                type="number" min="1" value={item.quantity}
                onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                style={{ borderColor: errors[`item_${idx}_qty`] ? 'var(--red)' : undefined }}
              />
              <button
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                style={{
                  background: 'var(--red-bg)', border: '1px solid var(--red)',
                  color: 'var(--red)', borderRadius: '8px',
                  width: 32, height: 38, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                  opacity: items.length === 1 ? 0.4 : 1
                }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Total preview */}
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Estimated Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--green)' }}>
            ₹{calcTotal().toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button loading={saving} onClick={handleSubmit}>Place Order</Button>
        </div>
      </Modal>
    </div>
  )
}
