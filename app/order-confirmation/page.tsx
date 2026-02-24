'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/pricing';

interface OrderDetails {
  orderNumber: string;
  items: Array<{
    title: string;
    displayText: string;
    totalPrice: number;
  }>;
  headcount: number;
  eventType: string;
  subtotal: number;
  deliveryFee: number;
  orderTotal: number;
  perPerson: number;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
  };
  delivery: {
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
  event: {
    date: string;
    time: string;
    setupRequired: boolean;
    specialInstructions: string;
  };
}

const TIMELINE_STEPS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Order Received',
    description: 'Your order has been confirmed',
    status: 'complete' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Confirmation Email Sent',
    description: 'Check your inbox for order details',
    status: 'complete' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: '24 Hours Before',
    description: "We'll call to confirm final details",
    status: 'upcoming' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: '30 Minutes Before',
    description: 'Your driver will text when on the way',
    status: 'upcoming' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Delivery & Setup',
    description: 'Setup and presentation by our team',
    status: 'upcoming' as const,
  },
];

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('last-order-details');
      if (stored) {
        setOrderDetails(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-pepe-cream flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-oswald text-2xl font-bold text-pepe-dark mb-2">No Order Found</h2>
          <p className="text-pepe-charcoal/70 mb-6">It looks like you haven&apos;t placed an order yet.</p>
          <Link
            href="/#catering"
            className="inline-block bg-pepe-dark text-white font-oswald font-bold px-6 py-3 rounded-lg hover:bg-pepe-red hover:text-pepe-dark transition-colors"
          >
            Start Ordering
          </Link>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* Success Hero */}
      <div className="bg-pepe-dark py-12 sm:py-16 text-center">
        <div className="animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pepe-orange text-white mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-pepe-red tracking-wider mb-3">
            ORDER CONFIRMED!
          </h1>
          <p className="text-pepe-red text-lg sm:text-xl font-oswald font-bold">
            Order #{orderDetails.orderNumber}
          </p>
        </div>
      </div>

      {/* Delivery Guarantee Banner */}
      <div className="bg-pepe-red py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="font-oswald font-bold text-pepe-dark text-sm sm:text-base tracking-wide">
            ON TIME, AS ORDERED — GUARANTEED
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="grid gap-6">
          {/* Order Summary Card */}
          <Card>
            <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              {orderDetails.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-pepe-dark">{item.title}</p>
                    <p className="text-muted text-xs">{item.displayText}</p>
                  </div>
                  <p className="font-semibold text-pepe-dark">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-pepe-sand pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-pepe-charcoal/70">Subtotal</span>
                <span className="font-medium">{formatCurrency(orderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pepe-charcoal/70">Delivery</span>
                <span className="font-medium">{formatCurrency(orderDetails.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-oswald font-bold text-lg pt-2 border-t border-pepe-sand">
                <span className="text-pepe-dark">Total</span>
                <span className="text-pepe-red">{formatCurrency(orderDetails.orderTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Per Person ({orderDetails.headcount} guests)</span>
                <span>{formatCurrency(orderDetails.perPerson)}</span>
              </div>
            </div>
          </Card>

          {/* Delivery Details Card */}
          <Card>
            <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Contact</p>
                <p className="text-pepe-dark font-medium">{orderDetails.contact.firstName} {orderDetails.contact.lastName}</p>
                <p className="text-sm text-pepe-charcoal/70">{orderDetails.contact.email}</p>
                <p className="text-sm text-pepe-charcoal/70">{orderDetails.contact.phone}</p>
                {orderDetails.contact.company && (
                  <p className="text-sm text-pepe-charcoal/70">{orderDetails.contact.company}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Delivery Address</p>
                <p className="text-pepe-dark">{orderDetails.delivery.address}</p>
                {orderDetails.delivery.address2 && <p className="text-pepe-dark">{orderDetails.delivery.address2}</p>}
                <p className="text-pepe-dark">{orderDetails.delivery.city}, {orderDetails.delivery.state} {orderDetails.delivery.zip}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Date & Time</p>
                <p className="text-pepe-dark font-medium">
                  {orderDetails.event.date && new Date(orderDetails.event.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-pepe-charcoal/70">{orderDetails.event.time}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Details</p>
                <p className="text-sm text-pepe-dark">{orderDetails.headcount} guests</p>
                <p className="text-sm text-pepe-dark">{orderDetails.event.setupRequired ? 'Full setup included' : 'Drop-off only'}</p>
                {orderDetails.event.specialInstructions && (
                  <p className="text-sm text-muted italic mt-1">&ldquo;{orderDetails.event.specialInstructions}&rdquo;</p>
                )}
              </div>
            </div>
          </Card>

          {/* What Happens Next Timeline */}
          <Card>
            <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What Happens Next
            </h2>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line & Icon */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'complete' ? 'bg-pepe-orange text-pepe-dark' : 'bg-pepe-sand text-muted/70'
                    }`}>
                      {step.icon}
                    </div>
                    {index < TIMELINE_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 ${
                        step.status === 'complete' ? 'bg-pepe-orange' : 'bg-pepe-sand'
                      }`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6">
                    <p className={`font-oswald font-bold text-sm ${
                      step.status === 'complete' ? 'text-pepe-dark' : 'text-muted'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Support Section */}
          <Card className="bg-pepe-dark text-white border-none">
            <h2 className="font-oswald text-xl font-bold text-pepe-red mb-3">
              Need to Make Changes?
            </h2>
            <p className="text-white/70 text-sm mb-4">
              We&apos;re here to help. Modify your order up to 24 hours before delivery.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a href="tel:7087482400" className="flex items-center gap-2 text-pepe-red hover:text-white transition-colors text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (708) 748-2400
              </a>
              <a href="mailto:orders@souldelivered.com" className="flex items-center gap-2 text-pepe-red hover:text-white transition-colors text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a href="sms:7087482400" className="flex items-center gap-2 text-pepe-red hover:text-white transition-colors text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Text Us
              </a>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#catering">
              <Button className="w-full sm:w-auto px-8">
                Start New Order
              </Button>
            </Link>
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto px-8">
              Print Receipt
            </Button>
            <a href="tel:7087482400">
              <Button variant="secondary" className="w-full sm:w-auto px-8">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
