import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Clock, MapPin, MessageCircle, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';

export const OrderConfirmation = () => {
  const { orderId } = useParams();

  const orders = JSON.parse(localStorage.getItem('sk_orders') || '[]');
  const currentOrder = orders.find(o => o.orderNumber === orderId) || {
    orderNumber: orderId || 'SK-782910',
    customer: {
      fullName: 'Keethapriyan M',
      phone: '9876543210',
      addressLine1: 'Flat 4A, Green Meadows Apartments, Siruvani Road',
      city: 'Coimbatore',
      pincode: '641010'
    },
    items: [{ name: 'Teddy Bear Soft Toy', quantity: 1, discountPrice: 299, price: 399 }],
    total: 299,
    subtotal: 299,
    deliveryFee: 0,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    termsAccepted: true,
    courierDetails: {
      courierName: 'DTDC Express',
      trackingNumber: 'D948123891',
      shippingDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      trackingUrl: 'https://www.dtdc.in/tracking/shipment-tracking.asp'
    },
    createdAt: new Date().toISOString()
  };

  const hasCourier = currentOrder.courierDetails && currentOrder.courierDetails.trackingNumber;

  const timeline = [
    { label: "Order Placed", status: "completed", date: new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    { label: "Payment Confirmed", status: currentOrder.paymentStatus === 'PAID' ? "completed" : "pending", date: `${currentOrder.paymentMethod} Payment Verified` },
    { label: "Packed at Store", status: ["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(currentOrder.orderStatus) ? "completed" : "current", date: "Sri Krishna Store, Kalampalayam" },
    { label: "Shipped via Courier", status: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(currentOrder.orderStatus) ? "completed" : hasCourier ? "current" : "upcoming", date: hasCourier ? `${currentOrder.courierDetails.courierName} (AWB: ${currentOrder.courierDetails.trackingNumber})` : "Awaiting dispatch" },
    { label: "Out for Delivery", status: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(currentOrder.orderStatus) ? "completed" : "upcoming", date: "Local Delivery Partner" },
    { label: "Delivered", status: currentOrder.orderStatus === 'DELIVERED' ? "completed" : "upcoming", date: "Destination: Coimbatore" }
  ];

  return (
    <div>
      <PageBanner 
        title="ORDER CONFIRMATION" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Order Confirmation" }]} 
      />

      <div className="sk-container" style={{ padding: '40px 16px 80px', maxWidth: '840px', margin: '0 auto' }}>
        {/* Success Header Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '26px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <span style={{ color: '#008C95', fontWeight: '800', fontSize: '12.5px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            ✓ ORDER PLACED SUCCESSFULLY
          </span>

          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '26px', fontWeight: '800', marginTop: '6px', marginBottom: '8px' }}>
            Order #{currentOrder.orderNumber}
          </h1>

          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '520px', margin: '0 auto 20px' }}>
            Thank you for choosing <strong>Sri Krishna Stationery & Gift</strong>, Coimbatore. Your order has been registered and is being prepared with care.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '8px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#334155'
          }}>
            <span>Total Paid: <strong style={{ color: '#06244A' }}>₹{currentOrder.total}</strong></span>
            <span>•</span>
            <span>Payment: <strong style={{ color: '#16A34A' }}>{currentOrder.paymentStatus} ({currentOrder.paymentMethod})</strong></span>
          </div>

          {/* Store Policy Notice */}
          <div style={{
            marginTop: '22px',
            padding: '12px 18px',
            background: '#FFFDF7',
            border: '1.5px solid #D9A441',
            borderRadius: '8px',
            fontSize: '12.5px',
            color: '#06244A',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: '800', color: '#92400E', marginBottom: '2px' }}>
              STORE POLICY ACKNOWLEDGMENT: NO RETURN POLICY
            </div>
            <div>
              All products sold by Sri Krishna Stationery & Gift are non-returnable. Please inspect all items upon arrival. For any verified transit damage, contact the store immediately via WhatsApp.
            </div>
          </div>
        </div>

        {/* Courier Tracking Card (Phase K) */}
        {hasCourier && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1.5px solid #008C95',
            padding: '24px',
            marginBottom: '26px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#008C95', fontWeight: '800', fontSize: '13px' }}>
                  <Truck size={18} />
                  <span>COURIER DISPATCH INFORMATION</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', marginTop: '4px' }}>
                  {currentOrder.courierDetails.courierName}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                  Tracking / AWB Number: <strong style={{ color: '#06244A' }}>{currentOrder.courierDetails.trackingNumber}</strong>
                </div>
                {currentOrder.courierDetails.expectedDeliveryDate && (
                  <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700', marginTop: '4px' }}>
                    Expected Delivery: {new Date(currentOrder.courierDetails.expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>

              {currentOrder.courierDetails.trackingUrl && (
                <a 
                  href={currentOrder.courierDetails.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sk-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', textDecoration: 'none' }}
                >
                  <ExternalLink size={15} />
                  <span>TRACK SHIPMENT</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Order Details: Items & Address */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '28px',
          marginBottom: '26px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#06244A', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1.5px solid #F1F5F9' }}>
            Purchased Products & Delivery Address
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Items */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '10px' }}>ITEMS ORDERED</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(currentOrder.items || []).map((itm, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1E293B' }}>{itm.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>Qty: {itm.quantity} {itm.selectedSize ? `• Size: ${itm.selectedSize}` : ''}</div>
                    </div>
                    <div style={{ fontWeight: '800', color: '#06244A' }}>
                      ₹{(itm.discountPrice || itm.price) * itm.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', fontSize: '13px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>DELIVERY DESTINATION</div>
              <div style={{ fontWeight: '700', color: '#06244A', marginBottom: '4px' }}>
                {currentOrder.customer?.fullName}
              </div>
              <div style={{ color: '#475569', lineHeight: '1.5' }}>
                {currentOrder.customer?.addressLine1}
                {currentOrder.customer?.addressLine2 && `, ${currentOrder.customer.addressLine2}`}<br />
                {currentOrder.customer?.city} - {currentOrder.customer?.pincode}, Tamil Nadu
              </div>
              <div style={{ color: '#64748B', marginTop: '6px' }}>
                Contact: {currentOrder.customer?.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Live Timeline */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '30px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#06244A', marginBottom: '22px', paddingBottom: '10px', borderBottom: '1.5px solid #F1F5F9' }}>
            Live Shipment Timeline
          </h2>

          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            <div style={{
              position: 'absolute',
              left: '11px',
              top: '8px',
              bottom: '24px',
              width: '2px',
              backgroundColor: '#E2E8F0'
            }} />

            {timeline.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isCurrent = step.status === 'current';

              return (
                <div key={idx} style={{ position: 'relative', marginBottom: '24px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#10B981' : isCurrent ? '#D9A441' : '#F1F5F9',
                    border: isCurrent ? '3px solid #FFF8E8' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(217, 164, 65, 0.2)' : 'none'
                  }}>
                    {isDone ? '✓' : isCurrent ? '●' : '○'}
                  </div>

                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: isCurrent || isDone ? '700' : '500',
                    color: isCurrent ? '#D9A441' : isDone ? '#06244A' : '#94A3B8',
                    marginBottom: '2px'
                  }}>
                    {step.label}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>
                    {step.date}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '26px', paddingTop: '18px', borderTop: '1px solid #F1F5F9' }}>
            <Link to="/account" className="sk-btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: '160px' }}>
              <Package size={16} />
              <span>View in My Orders</span>
            </Link>

            <Link to="/shop" className="sk-btn-gold" style={{ flex: 1, justifyContent: 'center', minWidth: '160px' }}>
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>

            <a 
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Sri Krishna Stationery & Gift,\n\nI am inquiring about my Order #${currentOrder.orderNumber}.\nPlease share status update.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sk-btn-whatsapp"
              style={{ flex: 1, justifyContent: 'center', minWidth: '160px' }}
            >
              <MessageCircle size={16} />
              <span>Order WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
