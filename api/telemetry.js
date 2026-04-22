export default async function handler(req, res) {
  // Stub for Component 8
  // Will implement telemetry endpoint after Component 1-7 are working

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For now, accept but don't store
  const { sessionId, eventType, eventData, timestamp, deviceType } = req.body;

  // Validation will happen in Component 8
  console.log(`[TELEMETRY STUB] Event: ${eventType} from session ${sessionId}`);

  res.status(200).json({ ok: true });
}
