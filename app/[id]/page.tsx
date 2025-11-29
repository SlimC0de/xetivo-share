import Image from "next/image";
import Head from "next/head";
import { notFound } from "next/navigation";

interface Product {
  product_name: string;
  image_uri: string[] | null;
}

async function fetchProduct(productId: string): Promise<Product> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?product_id=eq.${productId}&select=product_name,image_uri`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  if (!data.length) notFound();

  return data[0];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const product = await fetchProduct(id);
  const imageUrl = product.image_uri?.[0] ?? "/fallback.jpg";

  const absoluteOGImage = imageUrl.startsWith("http")
    ? imageUrl
    : `https://xetivo-share.vercel.app${imageUrl}`;

  const pageUrl = `https://xetivo-share.vercel.app/${id}`;

  return (
    <>
      {/* ===========================
          OG + META TAGS
      ============================ */}
      <Head>
        <title>{product.product_name} | Xetivo</title>

        <meta property="og:title" content={product.product_name} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={absoluteOGImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Xetivo" />
        <meta
          property="og:description"
          content="Check out this product on Xetivo."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.product_name} />
        <meta
          name="twitter:description"
          content="Check out this product on Xetivo."
        />
        <meta name="twitter:image" content={absoluteOGImage} />
      </Head>

      {/* ===========================
          AUTO APP REDIRECT SCRIPT
      ============================ */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const productId = "${id}";
              
              // Try to open the app instantly
              window.location.href = "xetivo://product/" + productId;

              // If app does NOT open, redirect to website in 1.2s
              setTimeout(() => {
                window.location.href = "https://xetivo.app/product/" + productId;
              }, 1200);
            })();
          `,
        }}
      />

      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <Image
          src={imageUrl}
          alt={product.product_name}
          width={800}
          height={800}
          priority
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "14px",
            marginBottom: "1.2rem",
          }}
        />

        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            textAlign: "center",
            background: "#ffffff",
            padding: "0.8rem 1rem",
            borderRadius: "10px",
            color: "#111",
            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
          }}
        >
          {product.product_name}
        </h1>
      </main>
    </>
  );
}
