'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import { formatCurrency } from '@/lib/pricing';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/lib/site-config';

interface FormData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;

  // Delivery Address
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;

  // Event Details
  eventDate: string;
  deliveryTime: string;
  setupRequired: boolean;

  // Additional
  specialInstructions: string;
}

const PROCESS_STEPS = [
  {
    id: 'order',
    label: 'Order',
    description: 'Build your menu',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'details',
    label: 'Details',
    description: 'Delivery info',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'confirmation',
    label: 'Confirm',
    description: 'Review order',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'call',
    label: 'We Call',
    description: 'Confirm & pay',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'We deliver!',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

const DELIVERY_TIMES = siteConfig.delivery.deliveryTimes;

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, calculatedItems, totalCost, hydrated } = useCatering();
  const [currentStep, setCurrentStep] = useState(1); // 1 = details, 2 = confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    eventDate: '',
    deliveryTime: '',
    setupRequired: true,
    specialInstructions: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Calculate delivery fee from config
  const getDeliveryFee = (headcount: number): number => {
    const tier = siteConfig.delivery.fees.find(f => headcount <= f.maxHeadcount);
    return tier?.fee ?? siteConfig.delivery.fees[siteConfig.delivery.fees.length - 1].fee;
  };

  const deliveryFee = getDeliveryFee(state.headcount);
  const tax = (totalCost + deliveryFee) * 0.10;
  const orderTotal = totalCost + deliveryFee + tax;

  // Wait for hydration before checking cart
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-pepe-cream flex items-center justify-center">
        <p className="text-pepe-charcoal/50 font-oswald tracking-wide">Loading order...</p>
      </div>
    );
  }

  // Redirect if cart is empty
  if (calculatedItems.length === 0) {
    return (
      <div className="min-h-screen bg-pepe-cream flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="font-oswald text-2xl font-bold text-pepe-dark mb-2">Your Cart is Empty</h2>
          <p className="text-pepe-charcoal/70 mb-6">Add some items to your order before checking out.</p>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save order details to sessionStorage for confirmation page
      const orderNumber = `SD-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const orderDetails = {
        orderNumber,
        items: calculatedItems.map(item => ({
          title: item.product.title,
          displayText: item.displayText,
          totalPrice: item.totalPrice,
          selectedVariant: item.selectedVariant,
          variantSplit: item.variantSplit,
        })),
        headcount: state.headcount,
        eventType: state.eventType,
        subtotal: totalCost,
        deliveryFee,
        orderTotal,
        perPerson: orderTotal / state.headcount,
        contact: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
        },
        delivery: {
          address: formData.address,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        event: {
          date: formData.eventDate,
          time: formData.deliveryTime,
          setupRequired: formData.setupRequired,
          specialInstructions: formData.specialInstructions,
        },
      };

      sessionStorage.setItem('last-order-details', JSON.stringify(orderDetails));

      // Call the API endpoint (includes email sending)
      const deliveryAddr = `${formData.address}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city}, ${formData.state} ${formData.zip}`;
      const response = await fetch('/api/create-catering-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: calculatedItems.map(item => ({
            variantId: item.product.variantId || item.product.id,
            quantity: item.quantity,
          })),
          headcount: state.headcount,
          eventType: state.eventType,
          buyerInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            eventDate: formData.eventDate,
            notes: formData.specialInstructions,
          },
          orderDetails: {
            orderNumber,
            items: calculatedItems.map(item => ({
              title: item.product.title,
              displayText: item.displayText,
              totalPrice: item.totalPrice,
            })),
            subtotal: totalCost,
            deliveryFee,
            orderTotal,
            perPerson: orderTotal / state.headcount,
            deliveryAddress: deliveryAddr,
            eventTime: formData.deliveryTime,
            specialInstructions: formData.specialInstructions,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit order');
      }

      // Reset the catering state and redirect
      dispatch({ type: 'RESET' });
      router.push('/order-confirmation');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (2 days out per siteConfig.delivery.minimumNotice)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    return minDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* Header */}
      <div className="bg-pepe-dark py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/#catering"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Order
          </Link>
          <h1 className="font-oswald text-3xl sm:text-4xl font-bold text-pepe-red tracking-wider">
            CHECKOUT
          </h1>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-pepe-warm-white border-b border-pepe-sand">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {PROCESS_STEPS.map((step, index) => {
              const isCompleted = index === 0 || (index === 1 && currentStep >= 1);
              const isCurrent = (index === 1 && currentStep === 1) || (index === 2 && currentStep === 2);

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Connector Line */}
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 top-5 w-full h-0.5 -translate-y-1/2 ${
                        isCompleted || isCurrent ? 'bg-pepe-red' : 'bg-pepe-warm-white'
                      }`}
                      style={{ width: 'calc(100% + 2rem)', right: '50%', zIndex: 0 }}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
                      isCurrent
                        ? 'bg-pepe-red text-pepe-dark'
                        : isCompleted
                        ? 'bg-pepe-dark text-white'
                        : 'bg-pepe-warm-white text-muted/70'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-2 text-xs sm:text-sm font-oswald font-semibold ${
                      isCurrent ? 'text-pepe-dark' : isCompleted ? 'text-pepe-dark' : 'text-muted/70'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted/70 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        First Name <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.firstName ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.firstName && <p className="text-error-red text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Last Name <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.lastName ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.lastName && <p className="text-error-red text-xs mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Email <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.email ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.email && <p className="text-error-red text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Phone <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.phone ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.phone && <p className="text-error-red text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-pepe-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40"
                      />
                    </div>
                  </div>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Street Address <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.address ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.address && <p className="text-error-red text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Suite/Floor/Building (Optional)
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        placeholder="Suite 100, Floor 2, etc."
                        className="w-full px-3 py-2 border border-pepe-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                          City <span className="text-pepe-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                            errors.city ? 'border-error-red' : 'border-pepe-sand'
                          }`}
                        />
                        {errors.city && <p className="text-error-red text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                          State <span className="text-pepe-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="IL"
                          maxLength={2}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                            errors.state ? 'border-error-red' : 'border-pepe-sand'
                          }`}
                        />
                        {errors.state && <p className="text-error-red text-xs mt-1">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                          ZIP Code <span className="text-pepe-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder="60601"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                            errors.zip ? 'border-error-red' : 'border-pepe-sand'
                          }`}
                        />
                        {errors.zip && <p className="text-error-red text-xs mt-1">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Event Details */}
                <Card>
                  <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Details
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Event Date <span className="text-pepe-red">*</span>
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.eventDate ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      />
                      {errors.eventDate && <p className="text-error-red text-xs mt-1">{errors.eventDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Delivery Time <span className="text-pepe-red">*</span>
                      </label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 ${
                          errors.deliveryTime ? 'border-error-red' : 'border-pepe-sand'
                        }`}
                      >
                        <option value="">Select a time...</option>
                        {DELIVERY_TIMES.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.deliveryTime && <p className="text-error-red text-xs mt-1">{errors.deliveryTime}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="setupRequired"
                          checked={formData.setupRequired}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded border-pepe-sand text-pepe-red focus:ring-pepe-orange"
                        />
                        <span className="text-sm text-pepe-charcoal">
                          <strong>Full Setup Service</strong> — Our team will set up your catering spread
                        </span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-pepe-charcoal mb-1">
                        Special Instructions / Dietary Notes
                      </label>
                      <textarea
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Loading dock access, dietary restrictions, allergies, etc."
                        className="w-full px-3 py-2 border border-pepe-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 resize-none"
                      />
                    </div>
                  </div>
                </Card>

                <Button onClick={handleContinue} className="w-full">
                  Continue to Review Order
                </Button>
              </div>
            ) : (
              /* Confirmation Step */
              <div className="space-y-6">
                <Card>
                  <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4">
                    Review Your Order
                  </h2>

                  {/* Contact Summary */}
                  <div className="mb-6 pb-6 border-b border-pepe-sand">
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">Contact</h3>
                    <p className="text-pepe-dark font-medium">{formData.firstName} {formData.lastName}</p>
                    <p className="text-pepe-charcoal/70 text-sm">{formData.email}</p>
                    <p className="text-pepe-charcoal/70 text-sm">{formData.phone}</p>
                    {formData.company && <p className="text-pepe-charcoal/70 text-sm">{formData.company}</p>}
                  </div>

                  {/* Delivery Summary */}
                  <div className="mb-6 pb-6 border-b border-pepe-sand">
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">Delivery</h3>
                    <p className="text-pepe-dark">{formData.address}</p>
                    {formData.address2 && <p className="text-pepe-dark">{formData.address2}</p>}
                    <p className="text-pepe-dark">{formData.city}, {formData.state} {formData.zip}</p>
                  </div>

                  {/* Event Summary */}
                  <div className="mb-6 pb-6 border-b border-pepe-sand">
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">Event</h3>
                    <div className="flex items-center gap-4 text-pepe-dark">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(formData.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-pepe-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formData.deliveryTime}</span>
                      </div>
                    </div>
                    <p className="text-sm text-pepe-charcoal/70 mt-2">
                      {state.headcount} guests • {formData.setupRequired ? 'Full setup included' : 'Drop-off only'}
                    </p>
                    {formData.specialInstructions && (
                      <p className="text-sm text-muted mt-2 italic">"{formData.specialInstructions}"</p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {calculatedItems.map(item => {
                        const variantLabel = item.selectedVariant
                          ? item.product.variants?.options.find(o => o.id === item.selectedVariant)?.label
                          : null;
                        const splitLabel = item.variantSplit
                          ? Object.entries(item.variantSplit)
                              .filter(([, v]) => v > 0)
                              .map(([k, v]) => {
                                const opt = item.product.variants?.options.find(o => o.id === k);
                                return `${v} ${opt?.label ?? k}`;
                              })
                              .join(', ')
                          : null;

                        return (
                          <div key={item.cartKey || item.product.id} className="flex justify-between text-sm">
                            <div>
                              <p className="font-medium text-pepe-dark">
                                {item.product.title}
                                {variantLabel ? ` (${variantLabel})` : ''}
                              </p>
                              {splitLabel && (
                                <p className="text-pepe-red text-xs font-medium">{splitLabel}</p>
                              )}
                              <p className="text-muted text-xs">{item.displayText}</p>
                            </div>
                            <p className="font-semibold text-pepe-dark">{formatCurrency(item.totalPrice)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {submitError && (
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-pepe-red/5 border-pepe-red/30 text-pepe-maroon mb-4">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">{submitError}</div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border-2 border-pepe-dark text-pepe-dark font-oswald font-bold rounded-lg hover:bg-pepe-dark hover:text-white transition-colors disabled:opacity-50"
                  >
                    Edit Details
                  </button>
                  <Button onClick={handleSubmitOrder} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Order Request'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-pepe-sand">
              <h2 className="font-oswald text-xl font-bold text-pepe-dark mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-pepe-sand">
                <div className="flex justify-between text-sm">
                  <span className="text-pepe-charcoal/70">{calculatedItems.length} item{calculatedItems.length !== 1 ? 's' : ''}</span>
                  <span className="font-medium text-pepe-dark">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pepe-charcoal/70">Guests</span>
                  <span className="font-medium text-pepe-dark">{state.headcount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pepe-charcoal/70">Delivery</span>
                  <span className="font-medium text-pepe-dark">{formatCurrency(deliveryFee)}</span>
                </div>
              </div>

              <div className="flex justify-between font-oswald font-bold text-lg mb-2">
                <span className="text-pepe-dark">Total</span>
                <span className="text-pepe-red">{formatCurrency(orderTotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-muted">
                <span>Per Person</span>
                <span>{formatCurrency(orderTotal / state.headcount)}</span>
              </div>

              {/* Items Preview */}
              <div className="mt-6 pt-4 border-t border-pepe-sand">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Items</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {calculatedItems.map(item => {
                    const variantLabel = item.selectedVariant
                      ? item.product.variants?.options.find(o => o.id === item.selectedVariant)?.label
                      : null;
                    return (
                      <div key={item.cartKey || item.product.id} className="text-sm">
                        <p className="text-pepe-dark truncate">
                          {item.product.title}
                          {variantLabel ? ` (${variantLabel})` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 pt-4 border-t border-pepe-sand space-y-3">
                <div className="flex items-center gap-2 text-sm text-pepe-charcoal/70">
                  <svg className="w-4 h-4 text-pepe-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  On-time delivery guaranteed
                </div>
                <div className="flex items-center gap-2 text-sm text-pepe-charcoal/70">
                  <svg className="w-4 h-4 text-pepe-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full setup included
                </div>
                <div className="flex items-center gap-2 text-sm text-pepe-charcoal/70">
                  <svg className="w-4 h-4 text-pepe-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Satisfaction guaranteed
                </div>
              </div>

              {/* Support */}
              <div className="mt-4 pt-4 border-t border-pepe-sand">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Need Help?</p>
                <a href={`tel:${siteConfig.contact.phoneRaw}`} className="text-sm text-pepe-red hover:text-pepe-dark transition-colors font-semibold">
                  {siteConfig.contact.phone}
                </a>
                <p className="text-xs text-muted/70 mt-1">Call, email, or text us anytime</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
