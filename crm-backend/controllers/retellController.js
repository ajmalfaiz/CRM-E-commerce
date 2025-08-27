const { Retell } = require('retell-sdk');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

// Verify environment variables
if (!process.env.RETELL_API_KEY) {
  console.error('ERROR: RETELL_API_KEY is not set in environment variables');
}
if (!process.env.RETELL_AGENT_ID) {
  console.error('ERROR: RETELL_AGENT_ID is not set in environment variables');
}
if (!process.env.COMPANY_PHONE_NUMBER) {
  console.error('ERROR: COMPANY_PHONE_NUMBER is not set in environment variables');
}

// Initialize Retell client
let retell;
try {
  retell = new Retell({
    apiKey: process.env.RETELL_API_KEY
  });
  console.log('✅ Retell client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Retell client:', error);
  process.exit(1);
}

// Initiate call to a lead
const callLead = async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 10);
  
  const log = (message, data = {}) => {
    console.log(`[${requestId}] ${message}`, Object.keys(data).length ? data : '');
  };
  
  try {
    log('=== CALL LEAD REQUEST ===', {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: { ...req.body, phoneNumber: req.body.phoneNumber ? '***REDACTED***' : undefined },
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? '***REDACTED***' : 'Not provided',
        'user-agent': req.headers['user-agent']
      }
    });

    // 1. Validate required fields
    if (!req.body.phoneNumber) {
      const error = 'phoneNumber is required';
      log('Validation failed', { error });
      return res.status(400).json({ success: false, error });
    }

    const phoneNumber = req.body.phoneNumber.trim();
    let leadId = req.params.id || req.body.leadId;
    
    if (!leadId) {
      const error = 'No lead ID provided';
      log('Validation failed', { error });
      return res.status(400).json({ success: false, error });
    }

    // 2. Validate and normalize lead ID
    if (typeof leadId === 'object') {
      leadId = leadId.toString();
    }

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      const error = 'Invalid lead ID format';
      log('Validation failed', { error, leadId });
      return res.status(400).json({ success: false, error });
    }

    // 3. Fetch lead
    const lead = await Customer.findById(leadId).lean();
    if (!lead) {
      const error = 'Lead not found';
      log('Lead not found', { leadId });
      return res.status(404).json({ success: false, error });
    }

    log('Lead found', { leadId: lead._id });

    // 4. Validate phone number format (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      const error = 'Invalid phone number format. Use E.164 format (e.g., +1234567890)';
      log('Validation failed', { error, phoneNumber: '***REDACTED***' });
      return res.status(400).json({ success: false, error });
    }

    // 5. Prepare call data
    const callData = {
      from_number: process.env.COMPANY_PHONE_NUMBER,
      to_number: phoneNumber,
      agent_id: process.env.RETELL_AGENT_ID,
      retell_llm_dynamic_variables: {
        leadId: lead._id.toString(),
        leadName: lead.name || 'Customer'
      },
      custom_sip_headers: {
        'X-Lead-ID': lead._id.toString()
      }
    };

    log('Initiating call with Retell API', {
      from: callData.from_number,
      to: '***REDACTED***',
      agentId: callData.agent_id
    });

    // 6. Make the Retell API call
    let call;
    try {
      call = await retell.call.createPhoneCall(callData);
      log('Retell API response', { callId: call?.call_id });
    } catch (apiError) {
      log('Retell API error', { 
        error: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      });
      
      return res.status(apiError.response?.status || 500).json({
        success: false,
        error: 'Failed to initiate call with Retell API',
        details: apiError.response?.data || apiError.message
      });
    }

    if (!call?.call_id) {
      const error = 'Invalid response from Retell API - Missing call_id';
      log('Validation failed', { error, response: call });
      return res.status(500).json({ success: false, error });
    }

    // 7. Update lead in the background (don't wait for this to complete)
    Customer.findByIdAndUpdate(
      leadId,
      {
        $set: { status: 'In Call', lastCallAt: new Date() },
        $push: {
          callLogs: {
            callId: call.call_id,
            timestamp: new Date(),
            event: 'call_initiated',
            notes: 'Call initiated via Retell AI'
          }
        }
      },
      { new: true }
    ).catch(updateError => {
      log('Failed to update lead', { 
        error: updateError.message,
        leadId,
        callId: call.call_id 
      });
      // Continue even if update fails
    });

    // 8. Return success response
    const response = {
      success: true,
      call: {
        id: call.call_id,
        status: 'initiated',
        timestamp: new Date().toISOString()
      }
    };

    log('Call initiated successfully', { callId: call.call_id });
    return res.json(response);

  } catch (error) {
    log('Unexpected error', { 
      error: error.message, 
      stack: error.stack 
    });
    
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
};

// Webhook handler for call events
const handleCallEvent = async (req, res) => {
  console.log('📩 Received webhook event:', {
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  const { event, eventType, callId, call_id, metadata, error } = req.body;

  try {
    const effectiveEvent = event || eventType;
    const effectiveCallId = callId || call_id;

    if (!metadata || !metadata.leadId) {
      return res.status(400).json({ error: 'Missing leadId in metadata' });
    }

    const lead = await Customer.findById(metadata.leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found', leadId: metadata.leadId });
    }

    console.log(`🔄 Processing ${effectiveEvent} for lead:`, {
      leadId: lead._id,
      callId: effectiveCallId
    });

    // Update call log
    const logEntry = {
      callId: effectiveCallId,
      timestamp: new Date(),
      event: effectiveEvent,
      notes: `Call ${effectiveEvent} at ${new Date().toISOString()}`,
      details: {}
    };

    if (error) {
      logEntry.details.error = error;
      logEntry.notes += ` - Error: ${error.message || JSON.stringify(error)}`;
    }

    lead.callLogs = lead.callLogs || [];
    lead.callLogs.push(logEntry);

    // Update status when call ends
    if (['call.ended', 'call.failed', 'call.completed'].includes(effectiveEvent)) {
      lead.status = 'HPL';
      lead.lastCallAt = new Date();
    }

    await lead.save();
    res.status(200).end();
  } catch (err) {
    console.error('❌ Error handling call event:', err);
    res.status(500).end();
  }
};

module.exports = {
  callLead,
  handleCallEvent
};
