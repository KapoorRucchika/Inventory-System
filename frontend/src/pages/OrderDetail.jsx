import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ordersApi } from '../lib/api'
import { Card, Badge, Button, Spinner } from '../components/ui'
import { ArrowLeft, ShoppingCart, User, Calendar, Package } from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ordersApi.getOne(id)
      .then(setOrder)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--red)' }}>
      <p>{error}</p>
      <Link to="/orders"><Button variant="secondary" style={{ marginTop: '16px' }}>Back to Orders</Button></Link>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <Link to="/orders" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" style={{ marginBottom: '16px' }}>
            <ArrowLeft size={14} />Back to Orders
          </Button>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '28px',
              fontWeight: 800, letterSpacing: '-0.03em'
            }}>
              Order #{String(order.id).padStart(4, '0')}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
            </p>
          </div>
          <Badge variant="accent">{order.status}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Customer Info */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <User size={16} color="var(--accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>Customer</h3>
          </div>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>{order.customer?.full_name}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{order.customer?.email}</p>
          {order.customer?.phone && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{order.customer.phone}</p>}
        </Card>

        {/* Order Summary */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShoppingCart size={16} color="var(--green)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>Summary</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Items</span>
            <span style={{ fontWeight: 600 }}>{order.items?.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '20px', color: 'var(--green)'
            }}>
              ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={16} color="var(--amber)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>Order Items</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.product?.name || `Product #${item.product_id}`}</td>
                <td>
                  {item.product?.sku && (
                    <code style={{ fontSize: '13px', background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {item.product.sku}
                    </code>
                  )}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>${parseFloat(item.unit_price).toFixed(2)}</td>
                <td>× {item.quantity}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--green)' }}>
                  ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px'
        }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Order Total:</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '24px', color: 'var(--green)'
          }}>
            ${parseFloat(order.total_amount).toFixed(2)}
          </span>
        </div>
      </Card>
    </div>
  )
}
