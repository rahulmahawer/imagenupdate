import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Product = {
  sku: string;
  title: string;
  original: string;
  generated: { suffix: string; label: string; url: string }[];
};

export const products: Product[] = [
  {
    sku: "ARH-119",
    title: "Client product",
    original: "/images/ARH-119.webp",
    generated: [
      { suffix: "_1", label: "Hero — front view", url: "/images/ARH-119_1.webp" },
      { suffix: "_2", label: "Angled view", url: "/images/ARH-119_2.webp" },
      { suffix: "_3", label: "Detail — material & edge", url: "/images/ARH-119_3.webp" },
      { suffix: "_4", label: "Lifestyle 01", url: "/images/ARH-119_4.webp" },
      { suffix: "_5", label: "Lifestyle 02", url: "/images/ARH-119_5.webp" },
      { suffix: "_6", label: "Dimension drawing", url: "/images/ARH-119_6.webp" },
    ],
  },
];

export function ClientWork() {
  const [productIndex, setProductIndex] = useState(0);
  const product = products[productIndex]!;
  const [selected, setSelected] = useState(0);
  const active = product.generated[selected]!;

  return (
    <section id="work" className="section-pad page-shell">
      <div className="reveal mb-12 grid gap-5 border-t pt-5 lg:grid-cols-[1fr_3fr]">
        <div className="eyebrow text-muted-foreground">01 — Client work</div>
        <div>
          <h2 className="display-title max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            One Client Image. Six Ready-to-Sell Product Images.
          </h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">
            Every product is organised by its SKU. The image supplied by the client keeps the plain SKU. Each image we
            create from it carries the same SKU with a numbered suffix, so the full set stays grouped.
          </p>
        </div>
      </div>

      {products.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {products.map((item, index) => (
            <button
              key={item.sku}
              onClick={() => {
                setProductIndex(index);
                setSelected(0);
              }}
              className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-[.12em] transition-colors ${
                index === productIndex ? "border-foreground bg-primary text-primary-foreground" : "hover:border-foreground"
              }`}
            >
              {item.sku}
            </button>
          ))}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <figure className="rounded-lg border bg-card p-4">
          <span className="eyebrow rounded-md bg-secondary px-3 py-2 text-muted-foreground">
            Provided by client
          </span>
          <div className="mt-4 aspect-square overflow-hidden rounded-md bg-background">
            <img
              src={product.original}
              alt={`${product.sku} original client-provided product photo`}
              loading="lazy"
              width={1000}
              height={1000}
              className="size-full object-contain"
            />
          </div>
          <figcaption className="mt-4 flex items-baseline justify-end">
            <span className="text-xs text-muted-foreground">Original reference</span>
          </figcaption>
        </figure>

        <div className="flex items-center justify-center lg:h-full">
          <span className="flex size-12 items-center justify-center rounded-full bg-signal text-primary-foreground">
            <ArrowRight size={18} />
          </span>
        </div>

        <figure className="rounded-lg border bg-card p-4">
          <span className="eyebrow rounded-md bg-signal/12 px-3 py-2 text-signal">Created by Imagenmerce</span>
          <div className="mt-4 aspect-square overflow-hidden rounded-md bg-background">
            <img
              src={active.url}
              alt={`${product.sku}${active.suffix} — ${active.label}`}
              loading="lazy"
              width={1000}
              height={1000}
              className="size-full object-contain"
            />
          </div>
          <figcaption className="mt-4 flex items-baseline justify-end">
            <span className="text-xs text-muted-foreground">{active.label}</span>
          </figcaption>
        </figure>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
        {product.generated.map((image, index) => (
          <button
            key={image.suffix}
            onClick={() => setSelected(index)}
            aria-label={`View ${product.sku}${image.suffix} — ${image.label}`}
            className={`rounded-md border-2 bg-card p-2 text-left transition-colors ${
              index === selected ? "border-signal" : "border-transparent hover:border-input"
            }`}
          >
            <div className="aspect-square overflow-hidden rounded-sm bg-background">
              <img src={image.url} alt="" loading="lazy" width={300} height={300} className="size-full object-contain" />
            </div>
            <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[.1em]">{image.label}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-6 text-muted-foreground">
        {product.title} — {product.sku}. The silhouette, colour, wood tone and hardware are kept exactly as supplied.
        Only the background, framing, camera angle and setting change.
      </p>
    </section>
  );
}
