// app/[id]/page.tsx

import Image from "next/image";
import Head from "next/head"; // ✅ Correct head usage
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
  const imageUrl = product.image_uri?.[0];

  return (
    <>
      <Head>
        <title>{product.product_name} | Xetivo</title>
      </Head>

      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* IMAGE */}
        {imageUrl ? (
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
        ) : (
          <div
            style={{
              height: 330,
              background: "#f3f3f3",
              borderRadius: "14px",
              marginBottom: "1.2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#888",
              fontSize: "1.2rem",
            }}
          >
            No image
          </div>
        )}

        {/* PRODUCT NAME — clean, visible, centered */}
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
