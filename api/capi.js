module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = req.body;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = {};
      }
    }

    if (!data || !data.event_name || !data.event_id) {
      return res.status(400).json({ status: 'error', message: 'Invalid payload' });
    }

    const pixel_id = '2274453276738646
'; // Guru Bhai Satta King Pixel ID
    const access_token = 'EAAQOIrZCrH80BSxNMdlG5iq81EIF4cA8xSzEAZBQUtZBzqZBitEW93o7zQe2JX4QtWalJZBSGRLvJH9Ce3we82BCPnsQjTp1BekKwuIaMgnjZCwJNebWgyJ1xbhFYMyDyL1lYEus6m5w4vdrOMhuiFPCmtTuJe5djKsSaG2qJnVZBhhz491QZAvfSnspcSGnUwZDZD'; // Aapka Naya Access Token
    const test_event_code = ''; // Testing ke liye yahan '' daal sakte hain, live hone par khali chhod dein

    const clientIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : (req.socket.remoteAddress || '');
    const userAgent = req.headers['user-agent'] || '';

    const userData = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (data.fbp) userData.fbp = data.fbp;
    if (data.fbc) userData.fbc = data.fbc;

    const eventPayload = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          event_source_url: data.event_source_url || '',
          action_source: 'website',
          user_data: userData,
        }
      ]
    };

    if (test_event_code) {
      eventPayload.test_event_code = test_event_code;
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${pixel_id}/events?access_token=${access_token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
