import Image from "next/image";
import Head from "next/head";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // SERVER-SIDE FETCH
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

  const data = await res.json();
  const product = data?.[0];

  if (!product) {
    return <div style={{ padding: 40 }}>Product not found.</div>;
  }

  // use first image in the array
  const imageUrl = product.image_uri?.[0] ?? "";

  return (
    <>
      {/* SOCIAL META TAGS */}
      <Head>
        <title>{product.product_name}</title>

        <meta property="og:title" content={product.product_name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.product_name} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>

      <div style={{ textAlign: "center", padding: 20 }}>
        <h2>{product.product_name}</h2>

        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.product_name}
            width={900}
            height={900}
            style={{ width: "90%", height: "auto", borderRadius: 10 }}
            priority
          />
        )}

        <p style={{ marginTop: 20 }}>{product.description}</p>

        <a
          href={`xetivo://product/${productId}`}
          style={{
            display: "inline-block",
            padding: "14px",
            width: "80%",
            background: "black",
            color: "white",
            borderRadius: "10px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Open in Xetivo
        </a>

        {/* AUTO OPEN APP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                window.location.href = "xetivo://product/${productId}";
              }, 600);
            `,
          }}
        />
      </div>
    </>
  );
}
