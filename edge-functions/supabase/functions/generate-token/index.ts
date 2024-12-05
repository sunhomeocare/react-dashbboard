// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as jose from "https://deno.land/x/jose@v5.9.6/index.ts";

//const JWT_SECRET_KEY = Deno.env.get("JWT_SECRET");
const JWT_SECRET_KEY = "dksadkjnsadkjsad9389u328e89jskdnskjfn@djksdnjk893rur93jrfjksdnkj";

type reqDataType = {
  id: number;
  username: string;
  role: string;
};

const validateReqData = (data: reqDataType) => {
  if (!data) return false;

  const requiredKeys = ["id", "username", "role"];

  const value = Object.keys(data).every((dataKey) => requiredKeys.includes(dataKey));

  return value;
};

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    // Handle preflight requests
    return new Response(null, {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (req.method === "POST") {
    const reqdata: reqDataType = await req.json();

    if (!validateReqData(reqdata)) {
      return new Response("Invalid Request", { headers: corsHeaders, status: 400 });
    }

    try {
      const data: reqDataType = {
        id: reqdata.id,
        username: reqdata.username,
        role: reqdata.role,
      };

      const secret = new TextEncoder().encode(JWT_SECRET_KEY);
      const alg = "HS256";

      const jwt = await new jose.SignJWT(data)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:sunhomeocaredev:issuer")
        .setAudience("urn:sunhomeocaredev:audience")
        .setExpirationTime("8h")
        .sign(secret);

      return new Response(JSON.stringify({ token: jwt }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
    }
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: corsHeaders,
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-token' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
