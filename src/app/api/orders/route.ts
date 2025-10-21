// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  images: string[];
  rating: number;
  videos?: string[];
  category: string;
  quantity: number;
  selectedOptions?: {
    size?: string;
    color?: string;
  };
}

interface OrderCustomer {
  name: string;
  email?: string;
  contact: string;
  address: string;
  deliveryMethod: string;
}

interface OrderData {
  orderId: string;
  customer: OrderCustomer;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  date: string;
  items: OrderItem[];
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();
    
    console.log('Order received:', orderData);
    
    // Prepare data for Google Sheets
    const sheetData = [
      orderData.orderId,
      orderData.customer.name,
      orderData.customer.email || '', // Add email field (optional)
      orderData.customer.contact,
      orderData.customer.address,
      orderData.customer.deliveryMethod,
      orderData.subtotal,
      orderData.discountAmount,
      orderData.couponCode || '',
      orderData.total,
      orderData.date,
      orderData.items.map((item: OrderItem) => {
        let itemDetails = `${item.name} (x${item.quantity})`;
        if (item.selectedOptions) {
          if (item.selectedOptions.size) itemDetails += `, Size: ${item.selectedOptions.size}`;
          if (item.selectedOptions.color) itemDetails += `, Color: ${item.selectedOptions.color}`;
        }
        return itemDetails;
      }).join('; ')
    ];
    
    // Google Sheets API configuration
    const SPREADSHEET_ID = '1fkxq6X1dupmqovoxTYo4MPfwFVPrPJnajwaKHP_0Y40'; // Your sheet ID from the URL
    
    // Set up authentication with service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Append the data to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', // Starting from A1, Google Sheets will auto-append to next row
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [sheetData],
      },
    });
    
    console.log('Data successfully added to Google Sheet:', sheetData);
    
    return NextResponse.json({
      success: true, 
      orderId: orderData.orderId,
      message: 'Order saved successfully' 
    });
  } catch (error) {
    console.error('Error saving order to Google Sheets:', error);
    return NextResponse.json({
      success: false, 
      error: (error as Error).message || 'Failed to save order to Google Sheets'
    }, { status: 500 });
  }
}
