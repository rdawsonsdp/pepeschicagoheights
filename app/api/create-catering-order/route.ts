import { NextRequest, NextResponse } from 'next/server';
import { createCateringDraftOrder } from '@/lib/shopify';
import { sendOrderEmails } from '@/lib/email';

interface CreateOrderRequest {
  lineItems: Array<{ variantId: string; quantity: number }>;
  headcount: number;
  eventType: string;
  buyerInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    eventDate: string;
    notes?: string;
  };
  // Order details for email
  orderDetails?: {
    orderNumber: string;
    items: Array<{ title: string; displayText: string; totalPrice: number }>;
    subtotal: number;
    deliveryFee: number;
    orderTotal: number;
    perPerson: number;
    deliveryAddress: string;
    eventTime: string;
    specialInstructions?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.lineItems || body.lineItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    if (!body.headcount || body.headcount < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid headcount' },
        { status: 400 }
      );
    }

    if (!body.buyerInfo?.email) {
      return NextResponse.json(
        { success: false, error: 'Buyer email is required' },
        { status: 400 }
      );
    }

    // Check if Shopify is configured
    const shopifyConfigured =
      process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    let result;
    if (!shopifyConfigured) {
      // Return mock response for development
      console.log('Mock order created (Shopify not configured):', body.buyerInfo.name);
      result = {
        draftOrderId: 'mock-order-123',
        draftOrderNumber: '#MOCK-1001',
        invoiceUrl: 'https://example.com/mock-invoice',
      };
    } else {
      // Create the draft order in Shopify
      result = await createCateringDraftOrder(
        body.lineItems,
        body.headcount,
        body.eventType,
        body.buyerInfo
      );
    }

    // Send confirmation emails (non-blocking)
    if (body.orderDetails) {
      sendOrderEmails({
        orderNumber: body.orderDetails.orderNumber,
        customerName: body.buyerInfo.name,
        customerEmail: body.buyerInfo.email,
        customerPhone: body.buyerInfo.phone,
        company: body.buyerInfo.company,
        items: body.orderDetails.items,
        headcount: body.headcount,
        subtotal: body.orderDetails.subtotal,
        deliveryFee: body.orderDetails.deliveryFee,
        orderTotal: body.orderDetails.orderTotal,
        perPerson: body.orderDetails.perPerson,
        deliveryAddress: body.orderDetails.deliveryAddress,
        eventDate: body.buyerInfo.eventDate,
        eventTime: body.orderDetails.eventTime,
        specialInstructions: body.orderDetails.specialInstructions,
      }).catch(err => console.error('Email send failed:', err));
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error creating catering order:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
