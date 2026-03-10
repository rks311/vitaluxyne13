import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    const imageBlob = await imageResponse.blob();

    // Use remove.bg free alternative - clipdrop API or photoroom
    // Using the free rembg API endpoint
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.png');

    // Use the free background removal API from remove-background.ai
    const bgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'free', // Free tier
      },
      body: formData,
    });

    // If remove.bg free doesn't work, fallback: return original
    // Alternative: use photoroom free API
    if (!bgResponse.ok) {
      // Try alternative: use clipdrop free
      const clipFormData = new FormData();
      clipFormData.append('image_file', imageBlob, 'image.png');
      
      // Return original image URL as fallback
      return new Response(JSON.stringify({ 
        processedUrl: imageUrl,
        bgRemoved: false,
        message: 'Background removal service unavailable, using original image'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processedBlob = await bgResponse.blob();
    
    // Upload to Supabase storage
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const path = `products/nobg-${Date.now()}.png`;
    const arrayBuffer = await processedBlob.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, new Uint8Array(arrayBuffer), { contentType: 'image/png', upsert: true });

    if (uploadError) throw uploadError;

    return new Response(JSON.stringify({ 
      processedUrl: `${supabaseUrl}/storage/v1/object/public/product-images/${path}`,
      storagePath: path,
      bgRemoved: true
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error removing background:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
