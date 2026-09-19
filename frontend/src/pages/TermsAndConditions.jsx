import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText, Phone, MapPin } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';

export const TermsAndConditions = () => {
  return (
    <div>
      <PageBanner 
        title="TERMS & CONDITIONS" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Terms & Conditions" }]} 
      />

      <div className="sk-container" style={{ padding: '50px 16px 90px', maxWidth: '900px', margin: '0 auto' }}>
        {/* NO RETURN POLICY NOTICE BANNER */}
        <div style={{
          background: '#FEF2F2',
          border: '2px solid #EF4444',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
              flexShrink: 0
            }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 style={{ color: '#991B1B', fontSize: '20px', fontWeight: '900', margin: 0 }}>
                IMPORTANT STORE POLICY: NO RETURN POLICY
              </h2>
              <p style={{ color: '#B91C1C', fontSize: '13.5px', margin: '4px 0 0', fontWeight: '700' }}>
                All products sold by Sri Krishna Stationery and Gift are strictly non-returnable.
              </p>
            </div>
          </div>
          <p style={{ color: '#7F1D1D', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
            Due to the hygienic nature of slippers, the delicate craftsmanship of fancy jewelry, and the retail packaging of school/office stationery and gift items, we do not accept returns once an order is placed and delivered. Please inspect product details, dimensions, and sizes carefully before placing your order.
          </p>
        </div>

        {/* Detailed Terms Content */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
            <FileText size={22} color="#008C95" />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', margin: 0 }}>
              Store Terms of Service & Purchase Agreement
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', color: '#334155', lineHeight: '1.7' }}>
            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                1. Acceptance of Terms
              </h4>
              <p>
                By accessing our website, purchasing products online, or ordering via WhatsApp through Sri Krishna Stationery and Gift, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                2. Product Availability & Pricing
              </h4>
              <p>
                All products displayed on our storefront are subject to real-time store availability. While we make every effort to maintain accurate inventory levels and prices, errors may rarely occur. Sri Krishna Stationery and Gift reserves the right to cancel or amend any order containing pricing inaccuracies or out-of-stock items, with prompt customer notification.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                3. Non-Returnable Products Policy
              </h4>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li><strong>No Returns:</strong> Products purchased cannot be returned for a cash refund or replacement under standard circumstances.</li>
                <li><strong>Pre-order Verification:</strong> Customers must verify item specifications, colors, sizes, and quantities prior to payment.</li>
                <li><strong>Transit Damage / Wrong Item Exceptions:</strong> In the rare event that an item arrives physically broken during transit or an incorrect product was packed, you must notify our Coimbatore store within <strong>24 hours of delivery</strong> with unboxing photographs or video proof. Any resolution is strictly subject to store manager review and approval.</li>
                <li><strong>No Automated Online Refunds:</strong> Automatic refunds are disabled on the website. Approved resolutions are handled directly by store management via store credit or replacement.</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                4. Shipping and Doorstep Delivery
              </h4>
              <p>
                We deliver throughout Coimbatore and surrounding regions. Orders above the store's Free Shipping threshold (default ₹499) qualify for free delivery. For orders below this threshold, a flat delivery fee (default ₹50) applies. Tracking details and estimated arrival times are provided once handed over to local courier or store dispatch.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                5. WhatsApp Ordering
              </h4>
              <p>
                "Order on WhatsApp" is a direct communication service connecting you with our store staff for custom inquiries, gift hamper packing, and neighborhood delivery. WhatsApp conversations represent direct store agreements and follow all standard store policies.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#06244A', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                6. Store Location & Contact Information
              </h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginTop: '8px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: '0 0 6px' }}><strong>Sri Krishna Stationery and Gift</strong></p>
                <p style={{ margin: '0 0 6px' }}>2/363 Sri Kumaran Complex, Siruvani Main Road, Kalampalayam, Coimbatore - 641010</p>
                <p style={{ margin: '0 0 6px' }}>Phone / WhatsApp: +91 98765 43210</p>
                <p style={{ margin: 0 }}>Hours: 9:00 AM - 9:00 PM Everyday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
