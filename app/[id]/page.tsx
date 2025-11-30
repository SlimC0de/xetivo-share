import { notFound } from "next/navigation";
import Image from "next/image";

interface Product {
  product_name: string;
  image_uri: string[] | null;
}

async function fetchProduct(productId: string): Promise<Product> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?product_id=eq.${productId}&select=product_name,image_uri`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  if (!data.length) notFound();
  return data[0];
}

// =======================================
// 1) OG META — SERVER SIDE — IMPORTANT
// =======================================
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await fetchProduct(id);

  const imageUrl = product.image_uri?.[0] ?? "/fallback.jpg";
  const absoluteImage = imageUrl.startsWith("http")
    ? imageUrl
    : `https://xetivo-share.vercel.app${imageUrl}`;

  return {
    title: product.product_name,
    description: "Check out this product on Xetivo.",

    openGraph: {
      title: product.product_name,
      description: "Check out this product on Xetivo.",
      type: "website",
      url: `https://xetivo-share.vercel.app/product/${id}`,
      images: [{ url: absoluteImage }],
      siteName: "Xetivo",
    },

    twitter: {
      card: "summary_large_image",
      title: product.product_name,
      description: "Check out this product on Xetivo.",
      images: [absoluteImage],
    },
  };
}

// =======================================
// 2) PAGE CONTENT
// =======================================
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const product = await fetchProduct(id);

  const imageUrl = product.image_uri?.[0] ?? "/fallback.jpg";

  return (
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
  );
}
