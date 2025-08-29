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
      log('Sending request to Retell API', { 
        from: callData.from_number,
        to: '***REDACTED***',
        agentId: callData.agent_id 
      });
      
      // Add timeout to the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      call = await retell.call.createPhoneCall(callData, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      log('Retell API response received', { 
        callId: call?.call_id,
        status: call?.status 
      });
      
      if (!call?.call_id) {
        throw new Error('Missing call_id in Retell API response');
      }
      
      // Immediately update lead status to show call is being connected
      await Customer.findByIdAndUpdate(
        leadId,
        { 
          $set: { 
            status: 'Call Connecting',
            lastCallAt: new Date() 
          },
          $push: {
            callLogs: {
              callId: call.call_id,
              timestamp: new Date(),
              event: 'call_connecting',
              notes: 'Call is being connected via Retell AI'
            }
          }
        },
        { new: true }
      );
      
    } catch (apiError) {
      const errorDetails = {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data,
        stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined
      };
      
      log('❌ Retell API error', errorDetails);
      
      // Update lead with error status
      try {
        await Customer.findByIdAndUpdate(
          leadId,
          {
            $push: {
              callLogs: {
                timestamp: new Date(),
                event: 'call_failed',
                notes: `Failed to initiate call: ${apiError.message}`,
                error: errorDetails
              }
            }
          }
        );
      } catch (updateError) {
        log('Failed to update lead with error status', { error: updateError.message });
      }
      
      return res.status(apiError.response?.status || 500).json({
        success: false,
        error: 'Failed to initiate call',
        details: apiError.response?.data?.error || apiError.message,
        code: 'CALL_INITIATION_FAILED'
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
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  const logEvent = (message, data = {}) => {
    console.log(`[${eventId}] ${message}`, Object.keys(data).length ? data : '');
  };
  
  try {
    logEvent('📩 Received webhook event', {
      type: req.body.event || req.body.eventType,
      callId: req.body.call_id || req.body.callId,
      timestamp: new Date().toISOString()
    });
    
    const { event, eventType, callId, call_id, metadata, error } = req.body;
    const effectiveEvent = event || eventType;
    const effectiveCallId = callId || call_id;
    
    if (!effectiveCallId) {
      throw new Error('Missing call_id in webhook payload');
    }

    if (!metadata || !metadata.leadId) {
      logEvent('Missing leadId in metadata', { body: req.body });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing leadId in metadata',
        eventId
      });
    }
    
    const leadId = metadata.leadId;
    logEvent('Processing event', { 
      event: effectiveEvent, 
      callId: effectiveCallId,
      leadId 
    });
    
    // Find and update the lead based on the call event
    const update = {
      $push: {
        callLogs: {
          callId: effectiveCallId,
          timestamp: new Date(),
          event: effectiveEvent,
          metadata: metadata || {}
        }
      },
      lastUpdated: new Date()
    };
    
    // Update status based on event type
    if (effectiveEvent === 'call_answered') {
      update.$set = { status: 'In Call' };
    } else if (effectiveEvent === 'call_ended') {
      update.$set = { 
        status: 'Call Completed',
        lastCallAt: new Date()
      };
    } else if (effectiveEvent === 'call_failed') {
      update.$set = { 
        status: 'Call Failed',
        lastCallAt: new Date()
      };
      update.$push.callLogs.error = error || 'Unknown error';
    }
    
    const updatedLead = await Customer.findByIdAndUpdate(
      leadId,
      update,
      { new: true }
    );
    
    if (!updatedLead) {
      logEvent('Lead not found', { leadId });
      return res.status(404).json({ 
        success: false, 
        error: 'Lead not found',
        eventId
      });
    }
    
    logEvent('Lead updated successfully', { 
      leadId,
      status: update.$set?.status || 'status_unchanged',
      event: effectiveEvent
    });
    
    return res.json({ 
      success: true,
      eventId,
      callId: effectiveCallId,
      leadId,
      status: update.$set?.status
    });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process webhook event',
      details: error.message,
      eventId
    });
  }
};

module.exports = {
  callLead,
  handleCallEvent
};
