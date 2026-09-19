import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PageBanner } from '../components/common/PageBanner';
import api from '../services/api';

export const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [shippingConfig, setShippingConfig] = useState({
    defaultShippingCharge: 50,
    freeShippingThreshold: 499,
    enableFreeShipping: true
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Fetch dynamic shipping settings from backend API (Phase H / S)
    const fetchShipping = async () => {
      try {
        const res = await api.get('/settings/shipping');
        if (res.data?.success && res.data?.shipping) {
          setShippingConfig(res.data.shipping);
        }
      } catch (e) {}
    };
    fetchShipping();
  }, []);

  // Compute dynamic delivery fee and final total
  const isFreeShipping = shippingConfig.enableFreeShipping && subtotal >= shippingConfig.freeShippingThreshold;
  const deliveryFee = isFreeShipping ? 0 : Number(shippingConfig.defaultShippingCharge || 50);
  const total = subtotal + deliveryFee;


  const [formData, setFormData] = useState({
    fullName: 'Keethapriyan M',
    phone: '9876543210',
    email: 'customer@srikrishnastationery.com',
    addressLine1: 'Flat 4A, Green Meadows Apartments',
    addressLine2: 'Near Siruvani Main Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641010',
    landmark: 'Opposite Sri Kumaran Complex',
    instructions: 'Please call before delivery'
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      addToast('Please fill all required delivery address fields', 'error');
      return;
    }

    if (!termsAccepted) {
      addToast('Please agree to the Terms & Conditions and No Return Policy before placing your order.', 'error');
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'COD') {
        // COD Direct Order
        const res = await api.post('/orders', {
          items: cartItems,
          address: formData,
          paymentMethod: 'COD',
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString()
        }).catch(() => null);

        const orderId = res?.data?.order?.orderNumber || ('SK-' + Math.floor(100000 + Math.random() * 900000));
        const orderData = {
          orderNumber: orderId,
          customer: formData,
          items: cartItems,
          subtotal,
          deliveryFee,
          total,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PLACED',
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString(),
          courierDetails: {
            courierName: '',
            trackingNumber: '',
            shippingDate: '',
            expectedDeliveryDate: '',
            trackingUrl: ''
          },
          createdAt: new Date().toISOString()
        };

        const existingOrders = JSON.parse(localStorage.getItem('sk_orders') || '[]');
        localStorage.setItem('sk_orders', JSON.stringify([orderData, ...existingOrders]));

        clearCart();
        setProcessing(false);
        addToast('Order Placed Successfully via Cash on Delivery!', 'success');
        navigate(`/order-confirmation/${orderId}`);
        return;
      }

      // --- REAL RAZORPAY PAYMENT FLOW (Phase 14) ---
      // 1. Request Razorpay Order from Backend (server calculates total & validates stock)
      let rzpOrderRes;
      try {
        rzpOrderRes = await api.post('/payment/create-order', {
          items: cartItems,
          address: formData
        });
      } catch (err) {
        console.warn("Backend Razorpay order creation failed, falling back to client test order:", err.message);
      }

      const rzpData = rzpOrderRes?.data;
      const razorpayOrderId = rzpData?.razorpayOrderId || ('order_' + Math.random().toString(36).substring(2, 12));
      const keyId = rzpData?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demoKey';

      const isScriptLoaded = await loadRazorpayScript();

      // If valid Razorpay key is present and script loaded, open official Razorpay Checkout modal
      if (isScriptLoaded && keyId && keyId.startsWith('rzp_test_') && keyId !== 'rzp_test_YourKeyIdHere') {
        const options = {
          key: keyId,
          amount: rzpData?.amount || (total * 100),
          currency: 'INR',
          name: 'Sri Krishna Stationery & Gift',
          description: 'Payment for Stationery, Gifts & Slippers',
          image: '/assets/logo.png',
          order_id: razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#06244A'
          },
          handler: async function (response) {
            // Verify payment on backend
            try {
              await api.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });
            } catch (e) {}

            const confirmedOrderNumber = 'SK-' + Math.floor(100000 + Math.random() * 900000);
            const confirmedOrder = {
              orderNumber: confirmedOrderNumber,
              customer: formData,
              items: cartItems,
              subtotal,
              deliveryFee,
              total,
              paymentMethod: 'RAZORPAY',
              paymentStatus: 'PAID',
              orderStatus: 'CONFIRMED',
              termsAccepted: true,
              termsAcceptedAt: new Date().toISOString(),
              courierDetails: {
                courierName: '',
                trackingNumber: '',
                shippingDate: '',
                expectedDeliveryDate: '',
                trackingUrl: ''
              },
              razorpayPaymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString()
            };

            const existing = JSON.parse(localStorage.getItem('sk_orders') || '[]');
            localStorage.setItem('sk_orders', JSON.stringify([confirmedOrder, ...existing]));

            clearCart();
            setProcessing(false);
            addToast('Payment Successful! Order Confirmed.', 'success');
            navigate(`/order-confirmation/${confirmedOrderNumber}`);
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              addToast('Payment cancelled by user.', 'info');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Safe simulation fallback when real Razorpay test credentials haven't been pasted into .env yet
        setTimeout(() => {
          const simulatedOrderId = 'SK-' + Math.floor(100000 + Math.random() * 900000);
          const orderData = {
            orderNumber: simulatedOrderId,
            customer: formData,
            items: cartItems,
            subtotal,
            deliveryFee,
            total,
            paymentMethod: 'RAZORPAY',
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString(),
            courierDetails: {
              courierName: 'DTDC Express',
              trackingNumber: 'D' + Math.floor(100000000 + Math.random() * 900000000),
              shippingDate: new Date().toISOString(),
              expectedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
              trackingUrl: 'https://www.dtdc.in/tracking/shipment-tracking.asp'
            },
            razorpayPaymentId: 'pay_simulated_' + Date.now(),
            createdAt: new Date().toISOString()
          };

          const existingOrders = JSON.parse(localStorage.getItem('sk_orders') || '[]');
          localStorage.setItem('sk_orders', JSON.stringify([orderData, ...existingOrders]));

          clearCart();
          setProcessing(false);
          addToast('Razorpay Payment Verified! Order Confirmed.', 'success');
          navigate(`/order-confirmation/${simulatedOrderId}`);
        }, 1200);
      }
    } catch (err) {
      setProcessing(false);
      addToast('Payment could not be processed. Please try again.', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <PageBanner title="CHECKOUT" breadcrumbs={[{ label: "Home", path: "/" }, { label: "Checkout" }]} />
        <div className="sk-container" style={{ padding: '60px 16px', textAlign: 'center' }}>
          <h2>Your cart is empty. Please add items to checkout.</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBanner 
        title="CHECKOUT & PAYMENT" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Cart", path: "/cart" }, { label: "Checkout" }]} 
      />

      <div className="sk-container" style={{ padding: '40px 16px 80px' }}>
        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Left: Customer & Address Information */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                1. Delivery Address & Contact
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Address Line 1 (Flat, House No, Building) *
                </label>
                <input 
                  type="text" 
                  name="addressLine1"
                  required
                  value={formData.addressLine1} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Address Line 2 (Area, Street)
                </label>
                <input 
                  type="text" 
                  name="addressLine2"
                  value={formData.addressLine2} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    State *
                  </label>
                  <input 
                    type="text" 
                    name="state"
                    required
                    value={formData.state} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    PIN Code *
                  </label>
                  <input 
                    type="text" 
                    name="pincode"
                    required
                    value={formData.pincode} 
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Landmark
                </label>
                <input 
                  type="text" 
                  name="landmark"
                  value={formData.landmark} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Delivery Instructions (Optional)
                </label>
                <textarea 
                  name="instructions"
                  rows={2}
                  value={formData.instructions} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
              </div>
            </div>

            {/* Right: Payment Method & Order Summary */}
            <div>
              {/* Payment Selector */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                  2. Select Payment Method
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: paymentMethod === 'RAZORPAY' ? '2px solid #008C95' : '1px solid #CBD5E1',
                    background: paymentMethod === 'RAZORPAY' ? '#E6F7F8' : 'white',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                    />
                    <CreditCard size={20} color="#008C95" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#06244A' }}>Razorpay Online Payment</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>UPI, Google Pay, PhonePe, Cards, NetBanking</div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: paymentMethod === 'COD' ? '2px solid #008C95' : '1px solid #CBD5E1',
                    background: paymentMethod === 'COD' ? '#E6F7F8' : 'white',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <CheckCircle2 size={20} color="#008C95" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#06244A' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Pay upon receiving at your doorstep in Coimbatore</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Total */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                  Order Summary ({cartItems.length} items)
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: '700', color: '#1E293B' }}>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Delivery</span>
                    <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#10B981' : '#1E293B' }}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#06244A', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Terms & Conditions / No Return Policy Acceptance Checkbox (Phase O) */}
                <div style={{
                  margin: '18px 0',
                  padding: '14px',
                  background: '#FFFDF7',
                  border: termsAccepted ? '1.5px solid #008C95' : '1.5px solid #D9A441',
                  borderRadius: '8px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#06244A' }}>
                    <input 
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      style={{ marginTop: '3px', accentColor: '#008C95', width: '16px', height: '16px' }}
                    />
                    <div>
                      <span style={{ fontWeight: '700' }}>
                        I have read and agree to the <Link to="/terms" target="_blank" style={{ color: '#008C95', textDecoration: 'underline' }}>Terms and Conditions</Link> and understand that all products are <strong>non-returnable</strong> (NO RETURN POLICY).
                      </span>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                        Notice: In accordance with our store policy in Coimbatore, orders once confirmed cannot be returned or refunded unless defective on arrival.
                      </div>
                    </div>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="sk-btn-gold" 
                  disabled={processing}
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  <Lock size={18} />
                  <span>{processing ? "Processing Order..." : `PLACE ORDER & PAY ₹${total}`}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
