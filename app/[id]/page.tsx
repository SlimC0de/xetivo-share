// app/[id]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";

interface Product {
  product_name: string;
  image_uri: string[] | null;
  description: string;
}

async function fetchProduct(productId: string): Promise<Product> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?product_id=eq.${productId}&select=*`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }

  const data: Product[] = await res.json();
  if (data.length === 0) notFound();

  return data[0];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || id === "undefined") notFound();

  let product: Product | null = null;
  let errorMessage: string | null = null;

  try {
    product = await fetchProduct(id);
  } catch (error) {
    console.error("Fetch error:", error);
    errorMessage =
      error instanceof Error && error.message.includes("400")
        ? "Invalid product ID"
        : "Failed to load product";
  }

  if (!product) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "#dc2626",
          fontSize: "1.5rem",
        }}
      >
        {errorMessage || "Product not found"}
      </div>
    );
  }

  const imageUrl = product.image_uri?.[0];

  return (
    <>
      <head>
        <title>{product.product_name} | Xetivo</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </head>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Image – full width, no title above it */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.product_name}
            width={900}
            height={900}
            priority
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              marginBottom: "2.5rem",
            }}
          />
        ) : (
          <div
            style={{
              height: 500,
              backgroundColor: "#f3f4f6",
              borderRadius: 20,
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: "1.5rem",
            }}
          >
            No image available
          </div>
        )}

        {/* Title – now correctly placed BELOW the image */}
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 700,
            textAlign: "center",
            margin: "0 0 2.5rem 0",
            color: "#111827",
            lineHeight: "1.2",
          }}
        >
          {product.product_name}
        </h1>

        {/* Description Card */}
        <div
          style={{
            padding: "2.5rem",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            lineHeight: "1.9",
            fontSize: "1.15rem",
            color: "#374151",
            whiteSpace: "pre-wrap",
          }}
        >
          {product.description}
        </div>
      </main>
    </>
  );
}
