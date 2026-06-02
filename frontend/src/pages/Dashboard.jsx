import { useEffect, useState } from 'react'
import { dashboardApi } from '../lib/api'
import { StatCard, Card, Badge, Spinner, EmptyState } from '../components/ui'
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '32px',
          fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '6px'
        }}>
          Overview
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Your inventory at a glance</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <StatCard label="Products" value={stats?.total_products ?? 0} icon={Package} color="var(--accent)" />
        <StatCard label="Customers" value={stats?.total_customers ?? 0} icon={Users} color="var(--green)" />
        <StatCard label="Orders" value={stats?.total_orders ?? 0} icon={ShoppingCart} color="var(--amber)" />
        <StatCard label="Low Stock" value={stats?.low_stock_products?.length ?? 0} icon={AlertTriangle} color="var(--red)" />
      </div>

      {/* Low Stock Table */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <AlertTriangle size={18} color="var(--amber)" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>
            Low Stock Alerts
          </h2>
          <Badge variant="warning">{stats?.low_stock_products?.length ?? 0} items</Badge>
        </div>

        {!stats?.low_stock_products?.length ? (
          <EmptyState icon={Package} title="All stocked up" description="No products are running low on inventory" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.low_stock_products.map(product => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>{product.sku}</td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: product.quantity === 0 ? 'var(--red)' : 'var(--amber)' }}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <Badge variant={product.quantity === 0 ? 'danger' : 'warning'}>
                      {product.quantity === 0 ? 'Out of stock' : 'Low stock'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
