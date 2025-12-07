export default {
  async fetch(request, env) {
    // 1. CORS Headers (Allow your site to talk to this)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");
        const email = formData.get("email");

        // SCENARIO A: Lead Opt-In (Email Only)
        // This runs when someone clicks "Notify Me" at the bottom
        if (email && !file) {
           if (env.tare_db) {
             await env.tare_db.prepare("INSERT INTO leads (email, created_at, source) VALUES (?, ?, 'opt_in')")
               .bind(email, new Date().toISOString())
               .run();
             return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
           } else {
             return new Response(JSON.stringify({ error: "DB not configured" }), { status: 500, headers: corsHeaders });
           }
        }

        // SCENARIO B: File Scan (File Only)
        // This runs when they upload a PDF
        if (file) {
            // We use the REST API directly to keep the worker lightweight (no heavy Python SDKs)
            const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
            
            const arrayBuffer = await file.arrayBuffer();
            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64String = btoa(binary);

            const payload = {
              contents: [{
                parts: [
                  { text: "Extract packaging items (boxes, mailers) from this invoice. Return clean JSON list: [{name, dims, qty, category}]. Ignore products." },
                  { inline_data: { mime_type: file.type, data: base64String } }
                ]
              }]
            };

            const aiReq = await fetch(GEMINI_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const aiRes = await aiReq.json();
            
            // Safe parsing of the AI response
            const text = aiRes.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
            
            return new Response(jsonStr, { headers: { "Content-Type": "application/json", ...corsHeaders } });
        }

        return new Response("Invalid Request", { status: 400, headers: corsHeaders });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
};