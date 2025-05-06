import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Process the banking-related prompt
    // This is a simple example - in a real app you would have more complex logic
    let optimized = prompt;
    let features = [];

    // Add banking-specific features based on content
    if (prompt.includes('transaction')) {
      features.push('Transaction Analysis');
    }
    if (prompt.includes('account')) {
      features.push('Account Management');
    }
    if (prompt.includes('transfer')) {
      features.push('Money Transfer');
    }
    if (prompt.includes('balance')) {
      features.push('Balance Inquiry');
    }
    if (prompt.includes('loan')) {
      features.push('Loan Processing');
    }

    // If no specific features detected, add a default one
    if (features.length === 0) {
      features.push('General Banking');
    }

    return NextResponse.json({
      optimized,
      features,
    });
  } catch (error) {
    console.error('Error processing optimization request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 