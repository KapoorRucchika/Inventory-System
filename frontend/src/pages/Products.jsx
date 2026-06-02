import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { productsApi } from '../lib/api'
import {
  PageHeader, Card, Button, Modal, FormField,
  Badge, Spinner, EmptyState
} from '../components/ui'
import { Plus, Package, Pencil, Trash2 } from 'lucide-react'

const EMPTY_FORM = { name: '', sku: '', price: '', quantity: '', description: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    productsApi.getAll().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ name: p.name, sku: p.sku, price: String(p.price), quantity: String(p.quantity), description: p.description || '' })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required'
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = 'Quantity must be ≥ 0'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      description: form.description.trim() || null
    }
    try {
      if (editProduct) {
        await productsApi.update(editProduct.id, payload)
        toast.success('Product updated')
      } else {
        await productsApi.create(payload)
        toast.success('Product created')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      await productsApi.delete(id)
      toast.success('Product deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const stockBadge = (qty) => {
    if (qty === 0) return <Badge variant="danger">Out of stock</Badge>
    if (qty <= 10) return <Badge variant="warning">Low: {qty}</Badge>
    return <Badge variant="success">{qty} in stock</Badge>
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openCreate}><Plus size={15} />New Product</Button>}
      />

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : products.length === 0 ? (
          <EmptyState icon={Package} title="No products yet" description="Add your first product to get started" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><code style={{ fontSize: '13px', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>{p.sku}</code></td>
                  <td style={{ fontWeight: 600, color: 'var(--green)' }}>₹{parseFloat(p.price).toFixed(2)}</td>
                  <td>{stockBadge(p.quantity)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.description || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Pencil size={13} />Edit
                      </Button>
                      <Button variant="danger" size="sm" loading={deletingId === p.id} onClick={() => handleDelete(p.id)}>
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

      {/* Modal with fixed positioning */}
      {modalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '40px 24px',
            overflowY: 'auto'
          }}
        >
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            width: '100%', maxWidth: '520px',
            margin: 'auto',
            animation: 'fadeIn 0.2s ease',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>
                {editProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', width: 32, height: 32,
                  borderRadius: '8px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', fontSize: '16px'
                }}
              >×</button>
            </div>

            <FormField label="Product Name" error={errors.name} required>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Wireless Keyboard" />
            </FormField>
            <FormField label="SKU / Code" error={errors.sku} required>
              <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. WK-001" />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Price (₹)" error={errors.price} required>
                <input type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
              </FormField>
              <FormField label="Quantity" error={errors.quantity} required>
                <input type="number" min="0" step="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description..." rows={3} />
            </FormField>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSubmit}>{editProduct ? 'Save Changes' : 'Create Product'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
