// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('Order received:', orderData);
    
    // Prepare data for Google Sheets
    const sheetData = [
      orderData.orderId,
      orderData.customer.name,
      orderData.customer.contact,
      orderData.customer.address,
      orderData.customer.deliveryMethod,
      orderData.total,
      orderData.date,
      orderData.items.map((item: any) => `${item.name} (x${item.quantity})`).join('; ')
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
      resource: {
        values: [sheetData],
      },
    });
    
    console.log('Data successfully added to Google Sheet:', sheetData);
    
    return NextResponse.json({ 
      success: true, 
      orderId: orderData.orderId,
      message: 'Order saved successfully' 
    });
  } catch (error: any) {
    console.error('Error saving order to Google Sheets:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to save order to Google Sheets' 
    }, { status: 500 });
  }
}