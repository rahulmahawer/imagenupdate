import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Expand, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { ClientWork } from "@/components/client-work";
import { ProjectFormDialog, openProjectForm } from "@/components/project-form";
const standardOriginal = "/images/RF-A1402.webp";
const standardFront = "/images/RF-A1402_1.webp";
const standardInconsistent = "/images/RF-A1402_2.webp";

const catalogImages = [
  "/images/ARH-131.webp",
  "/images/ARH-131_1.webp",
  "/images/ARH-131_2.webp",
  "/images/ARH-131_3.webp",
  "/images/ARH-131_4.webp",
  "/images/ARH-131_5.webp",
  "/images/ARH-131_6.webp",
];
const catalogNames = ["Client reference", "Hero", "Angle", "Detail", "Lifestyle 01", "Lifestyle 02", "Dimensions"];

const reference = "/images/RF-A1592.webp";
const hero = "/images/RF-A1592_1.webp";
const angle = "/images/RF-A1592_2.webp";
const detail = "/images/RF-A1592_3.webp";
const lifestyleDark = "/images/RF-A1592_4.webp";
const lifestyleLight = "/images/RF-A1592_5.webp";
const dimensions = "/images/RF-A1592_6.webp";

const images = [hero, angle, detail, lifestyleDark, lifestyleLight, dimensions];
const imageNames = ["Hero", "Angle", "Detail", "Lifestyle 01", "Lifestyle 02", "Dimensions"];
const oneToSixImages = [
  "/images/LT-3212-RW_1.webp",
  "/images/LT-3212-RW_2.webp",
  "/images/LT-3212-RW_3.webp",
  "/images/LT-3212-RW_4.webp",
  "/images/LT-3212-RW_5.webp",
  "/images/LT-3212-RW_6.webp",
];
const processSteps: [string, string, string][] = [
  ["Original photograph", "The photo exactly as the client supplied it — room lighting, wall, floor and all.", reference],
  ["Background cleanup", "The room is removed and replaced with a clean, even studio background.", hero],
  ["Product isolation", "The sideboard is cut out precisely, edge by edge, with nothing else left behind.", hero],
  ["Center & frame", "The product is centered on a square canvas with consistent breathing space.", hero],
  ["Controlled shadow", "A soft, believable contact shadow grounds the product on the surface.", hero],
  ["Professional final image", "The finished, ready-to-list product image — RF-A1592_1.", hero],
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Imagenmerce — Product Imaging Studio" },
    { name: "description", content: "Transform one product reference photo into a consistent six-image visual system for product pages and catalogs." },
    { property: "og:title", content: "Imagenmerce — Product Imaging Studio" },
    { property: "og:description", content: "One reference photo. Six professionally directed product visuals." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Compare({ left = reference, right = hero, leftLabel = "Original reference", rightLabel = "Refined product visual", className = "" }: { left?: string; right?: string; leftLabel?: string; rightLabel?: string; className?: string }) {
  const [position, setPosition] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const update = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (box) setPosition(Math.max(3, Math.min(97, ((event.clientX - box.left) / box.width) * 100)));
  };
  return <div ref={ref} className={`relative isolate overflow-hidden bg-muted touch-none select-none ${className}`} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); update(e); }} onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) update(e); }} role="slider" aria-label="Compare original and refined product image" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") setPosition((v) => Math.max(3, v - 3)); if (e.key === "ArrowRight") setPosition((v) => Math.min(97, v + 3)); }}>
    <img src={right} alt={rightLabel} className="absolute inset-0 size-full object-cover" width={1536} height={1536} />
    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }}><img src={left} alt={leftLabel} className="absolute inset-0 size-full object-cover" width={1536} height={1536} /></div>
    <div className="absolute inset-y-0 w-px bg-primary-foreground shadow-xl" style={{ left: `${position}%` }}><div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary-foreground/50 bg-primary text-primary-foreground"><ChevronLeft size={16}/><ChevronRight size={16}/></div></div>
    <span className="absolute left-4 top-4 bg-primary px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-primary-foreground">{leftLabel}</span>
    <span className="absolute right-4 top-4 bg-primary-foreground px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-primary">{rightLabel}</span>
  </div>;
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 80); onScroll(); addEventListener("scroll", onScroll); return () => removeEventListener("scroll", onScroll); }, []);
  const links = [["Work","work"],["Image System","system"],["Process","process"],["For Catalogs","catalogs"],["Examples","examples"],["Pricing","pricing"],["Contact","contact"]];
  return <header className={`fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-[88rem] -translate-x-1/2 border border-transparent transition-all duration-500 ${scrolled ? "nav-scrolled px-4 lg:w-[calc(100%-4rem)]" : "px-1"}`}>
    <div className="flex h-16 items-center justify-between"><a href="#top" className="text-lg font-bold uppercase tracking-[.08em]">IMAGENMERCE</a>
      <nav className="hidden items-center gap-6 xl:flex">{links.map(([label,id])=><a key={id} href={`#${id}`} className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}</nav>
      <Button size="sm" className="hidden sm:inline-flex" onClick={openProjectForm}>Start a Project</Button>
      <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button>
    </div>
    {open && <nav className="border-t py-4 sm:hidden">{links.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)} className="block py-3 text-sm uppercase">{label}</a>)}</nav>}
  </header>;
}

function SectionHead({ number, label, title, copy }: { number: string; label: string; title: string; copy?: string }) {
  return <div className="reveal mb-12 grid gap-5 border-t pt-5 lg:grid-cols-[1fr_3fr]"><div className="eyebrow text-muted-foreground">{number} — {label}</div><div><h2 className="display-title max-w-4xl text-5xl sm:text-6xl lg:text-8xl">{title}</h2>{copy&&<p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">{copy}</p>}</div></div>;
}

function Standards() {
  const [camera, setCamera] = useState(1);
  const cameraImages = [
    "/images/A1-Oil-123_1.webp",
    "/images/A1-Oil-123_2.webp",
    "/images/A1-Oil-123_3.webp",
    "/images/A1-Oil-123_4.webp",
  ];
  const cameraNames = ["Front", "Three-quarter", "Detail", "In context"];
  return <section id="system" className="section-pad page-shell">
    <SectionHead number="03" label="Our standard" title="Consistency Is What Makes a Catalog Feel Designed." copy="A strong image is useful. A repeatable image system makes the entire catalog work together."/>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="fine-grid relative aspect-square overflow-hidden border bg-card p-[12%]"><div className="absolute inset-x-[15%] top-1/2 border-t border-signal/70"/><div className="absolute inset-y-[12%] left-1/2 border-l border-signal/70"/><img src={standardFront} alt="Product centered within square composition guides" loading="lazy" width={1254} height={1254} className="size-full object-contain"/><span className="eyebrow absolute left-4 top-4">1:1 canvas / product requirement wise product scale</span><span className="eyebrow absolute bottom-4 right-4 text-signal">10–15% breathing space</span></div>
      <div className="grid grid-cols-3 gap-3 self-end">{[[standardOriginal,"Too tight","p-0 scale-125"],[standardInconsistent,"Inconsistent","p-[22%]"],[standardFront,"Balanced","p-[10%]"]].map(([src,label,fit],i)=><figure key={label} className={i===2?"border border-signal p-2":"border p-2 opacity-55"}><div className="aspect-square overflow-hidden bg-card"><img src={src} alt={`${label} framing example`} loading="lazy" width={1254} height={1254} className={`size-full object-contain ${fit}`}/></div><figcaption className="eyebrow mt-3">{label}</figcaption></figure>)}<p className="col-span-3 mt-3 text-2xl">Same scale. Same breathing room. One visual rhythm.</p></div>
    </div>
    <div className="mt-24 grid gap-8 border-t pt-8 lg:grid-cols-[1fr_2fr]"><div><p className="eyebrow text-muted-foreground">Camera standard</p><h3 className="display-title mt-4 text-5xl">Angles should explain the product.</h3><div className="mt-8 flex flex-wrap gap-2">{["Front","30–35°","Detail","In context"].map((name,i)=><Button key={name} size="sm" variant={camera===i?"primary":"outline"} onClick={()=>setCamera(i)}>{name}</Button>)}</div></div><div className="relative aspect-square overflow-hidden bg-card"><img src={cameraImages[camera]} alt={`A1-Oil-123 ${cameraNames[camera]} product view`} loading="lazy" width={1254} height={1254} className="size-full object-cover transition-all duration-500"/><span className="absolute bottom-4 left-4 bg-primary px-3 py-2 text-[10px] uppercase text-primary-foreground">{camera===1?"Preferred when depth matters":"Controlled camera view"}</span></div></div>
  </section>;
}

function Explosion() {
  return <section className="section-pad overflow-hidden bg-secondary"><div className="page-shell text-center"><p className="eyebrow">05 — One to six</p><h2 className="display-title mx-auto mt-5 max-w-4xl text-6xl lg:text-8xl">One Reference.<br/>Six Ways to Understand the Product.</h2><p className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground">Build a complete product story instead of relying on a single photograph.</p>
    <div className="reveal mt-16 grid grid-cols-2 gap-2 md:grid-cols-6">{oneToSixImages.map((src,i)=><figure key={src} className={`${i%2?"md:translate-y-10":""}`}><div className="aspect-square overflow-hidden bg-card"><img src={src} alt={imageNames[i]} loading="lazy" width={1254} height={1254} className="size-full object-contain transition-transform duration-700 hover:scale-105"/></div><figcaption className="eyebrow mt-3 text-left">0{i+1} {imageNames[i]}</figcaption></figure>)}</div></div></section>;
}

function CatalogCompare() {
  const [selected, setSelected] = useState(0);
  return <section className="section-pad page-shell"><SectionHead number="06" label="Catalog rhythm" title="One Client Image. A Complete Product Story." copy="Start with the reference supplied by the client, then explore each carefully built view. Every frame is planned, checked and refined to keep the product recognizable and the full set consistent."/><div className="border-y py-6 md:py-10"><div className="grid items-start gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,22rem)] lg:justify-center"><figure><div className="relative aspect-square overflow-hidden rounded-md border bg-card"><img src={catalogImages[selected]} alt={`ARH-131 — ${catalogNames[selected]}`} width={1000} height={1000} className="size-full object-contain"/><span className={`absolute left-4 top-4 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] ${selected===0?"bg-secondary text-secondary-foreground":"bg-signal text-primary-foreground"}`}>{selected===0?"Provided by client":"Finished by Imagenmerce"}</span></div><figcaption className="mt-4 flex items-center justify-between gap-4 border-b pb-4"><span className="font-semibold">{selected===0?"ARH-131":`ARH-131_${selected}`}</span><span className="text-xs text-muted-foreground">{catalogNames[selected]}</span></figcaption><div className="mt-6 border-l-2 border-signal pl-5"><p className="display-title text-3xl">Reference → directed image series</p><p className="mt-3 text-xs leading-6 text-muted-foreground">A technology-assisted studio workflow, shaped by careful art direction, product checks and finishing—not one-click output.</p></div></figure><div><p className="eyebrow text-muted-foreground">Click to explore the series</p><div className="mt-5 grid grid-cols-3 gap-3 lg:grid-cols-2">{catalogImages.map((src,i)=><button key={src} type="button" onClick={()=>setSelected(i)} aria-label={`View ${catalogNames[i]}`} aria-pressed={selected===i} className={`group border p-2 text-left transition-colors ${selected===i?"border-signal bg-signal/5":"border-border hover:border-foreground"}`}><div className="aspect-square overflow-hidden bg-card"><img src={src} alt="" loading={i===0?"eager":"lazy"} width={240} height={240} className="size-full object-contain"/></div><span className="mt-2 block text-[9px] font-semibold uppercase tracking-[.1em] text-muted-foreground">{i===0?"Original":`View 0${i}`}</span></button>)}</div></div></div></div></section>;
}

function ProductPage() {
  const [selected,setSelected]=useState(0);
  return <section className="section-pad bg-primary text-primary-foreground"><div className="page-shell"><SectionHead number="10" label="Listing experience" title="See the Difference Where It Matters."/>
    <div className="grid gap-8 bg-background p-4 text-foreground md:p-8 lg:grid-cols-[1.4fr_.6fr]"><div><div className="aspect-square overflow-hidden bg-card"><img src={images[selected]} alt={`RF-A1592 ${imageNames[selected]} view`} loading="lazy" width={512} height={768} className="size-full object-contain"/></div><div className="mt-3 grid grid-cols-6 gap-2">{images.map((src,i)=><button key={src} onClick={()=>setSelected(i)} aria-label={`View ${imageNames[i]}`} className={`aspect-square overflow-hidden border-2 ${selected===i?"border-signal":"border-transparent"}`}><img src={src} alt="" width={100} height={100} className="size-full object-contain"/></button>)}</div></div>
      <div className="flex flex-col justify-between py-2"><div><p className="eyebrow text-muted-foreground">Client product / SKU RF-A1592</p><h3 className="display-title mt-4 text-6xl">RF-A1592</h3><p className="mt-2 text-sm text-muted-foreground">Mid-century sideboard / Solid walnut</p><div className="mt-10 border-t py-5 text-sm leading-7">A four-door sideboard in warm walnut with tapered legs and slim recessed handles. 150 × 35 × 90 cm.</div></div><Button onClick={openProjectForm}>Enquire about this product <ArrowRight size={15}/></Button></div></div>
  </div></section>;
}

function CatalogScale() {
  const [count,setCount]=useState(50); const output=useMemo(()=>count*6,[count]);
  return <section id="catalogs" className="section-pad page-shell"><SectionHead number="12" label="Built for catalogs" title="From One Product to an Entire Catalog." copy="The same visual rules can be applied across small collections and large catalogs."/>
    <div className="grid gap-10 lg:grid-cols-2"><div className="rounded-lg border bg-card p-4"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{images.map((src,i)=><div key={src} className="aspect-square overflow-hidden rounded-md border bg-background"><img src={src} alt={`RF-A1592 ${imageNames[i]} view in catalog grid`} loading="lazy" width={512} height={512} className="size-full object-contain"/></div>)}</div></div><div className="flex flex-col justify-between border-y py-8"><div><p className="eyebrow text-muted-foreground">Illustrative image-count calculator</p><label htmlFor="products" className="mt-10 block text-sm">Number of products</label><input id="products" type="range" min="1" max="500" value={count} onChange={e=>setCount(Number(e.target.value))} className="mt-5 w-full accent-signal"/><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>1</span><span>500</span></div></div><div className="mt-14"><p className="display-title text-7xl">{count} × 6</p><p className="mt-3 text-2xl">{output.toLocaleString()} potential image assets</p><p className="mt-4 max-w-sm text-xs leading-6 text-muted-foreground">Illustrative image-count calculation only. Final scope depends on the selected views and supplied references.</p></div></div></div>
  </section>;
}

function ProjectGallery() {
  const [project,setProject]=useState<number|null>(null);
  return <section id="examples" className="section-pad page-shell"><SectionHead number="15" label="Before / after work" title="Reference to Result."/>
    <div className="grid gap-5 md:grid-cols-3">{[0,1,2].map(i=><button key={i} onClick={()=>setProject(i)} className="group text-left"><div className="relative aspect-[4/5] overflow-hidden bg-muted"><img src={i===0?hero:i===1?angle:lifestyleDark} alt={`Project 0${i+1} result`} loading="lazy" width={512} height={768} className="size-full bg-card object-contain transition-transform duration-700 group-hover:scale-105"/><Expand className="absolute right-4 top-4 bg-background p-2" size={38}/></div><p className="eyebrow mt-4">Project 0{i+1} <span className="text-muted-foreground">— Reference → Result</span></p></button>)}</div>
    {project!==null&&<div className="fixed inset-0 z-[70] overflow-y-auto bg-primary text-primary-foreground" role="dialog" aria-modal="true" aria-label={`Project 0${project+1} case study`}><div className="page-shell py-6"><div className="flex items-center justify-between"><p className="eyebrow">Project 0{project+1} / RF-A1592 study</p><Button variant="inverse" size="icon" onClick={()=>setProject(null)} aria-label="Close case study"><X/></Button></div><div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">{[reference,...images].map((src,i)=><figure key={src} className={i===0?"col-span-2 row-span-2":""}><div className="aspect-square overflow-hidden bg-card"><img src={src} alt={i===0?"Original reference":imageNames[i-1]} width={512} height={768} className="size-full object-contain"/></div><figcaption className="eyebrow mt-2">{i===0?"Original":imageNames[i-1]}</figcaption></figure>)}</div></div></div>}
  </section>;
}

function ReferenceDrop() {
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);
  const [over, setOver] = useState(false);
  const accept = (list: FileList | null) => {
    const picked = list?.[0];
    if (picked && picked.type.startsWith("image/")) setFile({ name: picked.name, url: URL.createObjectURL(picked) });
  };
  return <div className="flex flex-col gap-4">
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); accept(e.dataTransfer.files); }}
      className={`flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed bg-card p-4 text-center transition-colors ${over ? "border-signal bg-signal/5" : ""}`}
    >
      <input type="file" accept="image/*" className="sr-only" onChange={(e) => accept(e.target.files)} />
      {file ? <>
        <img src={file.url} alt={file.name} className="max-h-64 w-auto rounded-md object-contain" />
        <span className="mt-4 text-xs text-muted-foreground">{file.name} — click to choose another image</span>
      </> : <>
        <span className="display-title text-4xl">Drop your reference image</span>
        <span className="mt-3 text-xs text-muted-foreground">or click to select from your device</span>
      </>}
    </label>
    {file && <div className="flex flex-wrap items-center gap-3"><Button onClick={openProjectForm}>Send this reference with my request <ArrowRight size={15}/></Button><Button variant="outline" onClick={() => setFile(null)}>Remove</Button></div>}
  </div>;
}

function Index() {
  useReveal();
  const [processStep,setProcessStep]=useState(0);
  const checks=["Square composition","Balanced product scale","Controlled neutral background","Consistent baseline","Consistent camera language","Natural ground shadow","Product-only hero presentation","Detail image included","Dimension visual where required","Consistent treatment across the set"];
  return <main id="top" className="overflow-clip"><Navigation/><ProjectFormDialog/>
    <section className="page-shell flex min-h-[86vh] flex-col justify-center pb-10 pt-32"><div className="grid items-end gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="pb-4"><p className="eyebrow text-signal">Product imaging studio / Art-directed systems</p><h1 className="display-title mt-6 text-5xl sm:text-6xl lg:text-[5.4rem]">Turn One Product Photo Into a Complete Visual System.</h1><p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground">Professional product imagery built from your reference photo, then directed, checked and refined for product pages, catalogs, campaigns and online stores.</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={openProjectForm}>Transform My Product <ArrowRight size={15}/></Button><Button asChild variant="outline"><a href="#process">See the Process <ArrowDown size={15}/></a></Button></div></div><Compare className="aspect-square min-h-[25rem]"/></div></section>

    <ClientWork/>

    <section id="process" className="section-pad bg-primary text-primary-foreground"><div className="page-shell"><SectionHead number="02" label="Reference to ready-to-use" title="You send the product. We build the visual system around it."/>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><div className="relative aspect-square overflow-hidden bg-card"><img src={processSteps[processStep]![2]} alt={`RF-A1592 sideboard — ${processSteps[processStep]![0]}`} width={1536} height={1536} className={`size-full transition-all duration-700 ${processStep===0?"object-cover":"object-contain p-[6%]"}`}/>
        {processStep===2&&<div className="pointer-events-none absolute inset-[16%] rounded-sm border-2 border-dashed border-accent"/>}
        {processStep===3&&<><div className="pointer-events-none absolute inset-x-[10%] top-1/2 border-t border-accent/70"/><div className="pointer-events-none absolute inset-y-[10%] left-1/2 border-l border-accent/70"/></>}
        {processStep===4&&<div className="pointer-events-none absolute inset-x-[18%] bottom-[14%] h-6 rounded-[50%] bg-foreground/25 blur-md"/>}
        <span className="absolute left-4 top-4 bg-primary px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-primary-foreground">{processStep===0?"RF-A1592 — client photo":`RF-A1592_1 — step 0${processStep+1}`}</span>
        <p className="absolute inset-x-0 bottom-0 bg-primary/90 px-4 py-3 text-xs leading-6 text-primary-foreground">{processSteps[processStep]![1]}</p></div><div className="flex flex-col justify-center">{processSteps.map((step,i)=><button key={step[0]} onMouseEnter={()=>setProcessStep(i)} onClick={()=>setProcessStep(i)} className={`flex items-center gap-4 border-t py-5 text-left transition-all ${processStep===i?"text-accent":"text-primary-foreground/35"}`}><span className="text-xs">0{i+1}</span><span className="text-xl">{step[0]}</span></button>)}</div></div>

    </div></section>

    <Standards/><Explosion/><CatalogCompare/>

    <section className="section-pad bg-secondary"><div className="page-shell"><SectionHead number="07" label="Product accuracy" title="Presentation Changes. The Product Shouldn't."/><div className="grid gap-10 lg:grid-cols-[1.4fr_.6fr]"><Compare className="aspect-square"/><div className="flex flex-col justify-between"><div>{["Silhouette","Proportions","Visible materials","Construction details","Recognizable textures","Product color","Important markings","Cross-image consistency"].map(x=><div key={x} className="flex items-center gap-3 border-t py-4 text-sm"><Check size={15} className="text-signal"/>{x}</div>)}</div><p className="display-title mt-8 border-l-2 border-signal pl-5 text-4xl">The reference image is the source of truth.</p></div></div></div></section>

    <section className="section-pad page-shell"><SectionHead number="08" label="What we fix" title="From Ordinary Photo to Product-Ready Presentation."/><div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">{[["Busy background","Clean background"],["Poor framing","Balanced framing"],["Off-center product","Correct positioning"],["Inconsistent scale","Standardized scale"],["Harsh lighting","Controlled presentation"],["Missing views","Complete image set"],["Disconnected catalog","Unified visual system"]].map((x,i)=><div key={x[0]} className="bg-background p-6"><span className="eyebrow text-muted-foreground">0{i+1}</span><p className="mt-12 text-sm text-muted-foreground line-through">{x[0]}</p><p className="mt-2 flex items-center gap-2 text-xl"><ArrowRight size={16} className="text-signal"/>{x[1]}</p></div>)}</div></section>

    <section className="section-pad bg-secondary"><div className="page-shell"><SectionHead number="09" label="Image quality checklist" title="Every Image Follows a System."/><div className="grid gap-10 lg:grid-cols-2"><div>{checks.map((x,i)=><div key={x} className="reveal flex items-center gap-4 border-t py-4"><span className="flex size-6 items-center justify-center border border-signal text-signal"><Check size={14}/></span><span>{x}</span></div>)}</div><div className="fine-grid grid grid-cols-2 content-center gap-px border bg-border p-px">{["1600 × 1600\nreference output","1:1\ncomposition","sRGB\ncolor profile","Web-optimized\nformats","Daylight-style\nwhite balance","Optimized\nfile weight"].map(x=><div key={x} className="whitespace-pre-line bg-card p-6 text-lg">{x}</div>)}</div></div></div></section>

    <ProductPage/>

    <section className="section-pad page-shell"><SectionHead number="11" label="Business value" title="Product Imaging Without Rebuilding a Photoshoot for Every Visual." copy="Our technology-assisted studio process combines efficient production with deliberate art direction, visual checks and hands-on refinement."/><div className="grid gap-12 lg:grid-cols-2"><div><p className="eyebrow text-muted-foreground">Traditional workflow</p>{["Product preparation","Shipping","Studio","Photographer","Multiple setups","Additional environments","Reshoots","Post-production"].map((x,i)=><div key={x} className="border-t py-4 text-lg"><span className="mr-4 text-xs text-muted-foreground">0{i+1}</span>{x}</div>)}</div><div><p className="eyebrow text-signal">Imagenmerce workflow</p>{["Study the reference","Define required views","Direct the visual system","Build each variation","Check product accuracy","Refine every frame","Deliver the complete set"].map((x,i)=><div key={x} className="border-t py-4 text-lg"><span className="mr-4 text-xs text-signal">0{i+1}</span>{x}</div>)}</div></div><p className="display-title mt-20 text-center text-6xl">One product <ArrowRight className="inline"/> multiple visual assets.</p></section>

    <CatalogScale/>

    <section className="section-pad bg-primary text-primary-foreground"><div className="page-shell"><SectionHead number="13" label="How it works" title="Five Clear Steps."/><div className="grid gap-px bg-primary-foreground/20 md:grid-cols-5">{[["01","Send","Reference image and information"],["02","Define","Choose required views"],["03","Create","Build the visual set"],["04","Review","Check appearance and views"],["05","Deliver","Receive finalized assets"]].map(x=><div key={x[0]} className="bg-primary p-6"><span className="eyebrow text-accent">{x[0]}</span><h3 className="display-title mt-16 text-4xl">{x[1]}</h3><p className="mt-4 text-xs leading-5 text-primary-foreground/55">{x[2]}</p></div>)}</div></div></section>

    <section className="section-pad page-shell"><SectionHead number="14" label="What we need" title="Start With What You Already Have."/><div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><ReferenceDrop/><div>{["Product dimensions, if required","Correct product color","Important material information","Details that must not change","Desired image count","Required environments","Existing visual guidelines"].map(x=><div key={x} className="flex gap-3 border-t py-4 text-sm"><Check size={15} className="text-signal"/>{x}</div>)}<p className="mt-6 text-sm text-muted-foreground">Better references help us preserve more product detail.</p></div></div></section>

    <ProjectGallery/>

    <section className="section-pad overflow-hidden bg-secondary"><div className="page-shell"><p className="eyebrow">16 — Who it is for</p><div className="mt-10 flex w-max gap-5">{["E-Commerce Teams","Furniture & Home Businesses","Manufacturers","Wholesalers","Retailers","Direct-to-Consumer Businesses","Product Catalog Teams","Creative Teams"].map((x,i)=><div key={x} className="flex h-64 w-72 shrink-0 flex-col justify-between border bg-background p-6"><span className="text-xs text-muted-foreground">0{i+1}</span><h3 className="display-title text-4xl">{x}</h3></div>)}</div></div></section>

    <section id="pricing" className="section-pad page-shell"><SectionHead number="17" label="Service options" title="Built Around the Size of Your Catalog."/><div className="grid gap-px bg-border lg:grid-cols-3">{[["Starter","For smaller product sets.","Request a Quote"],["Catalog","For growing product collections.","Request a Quote"],["Bulk","For large catalogs and recurring production.","Custom Quote"]].map((x,i)=><div key={x[0]} className={`flex min-h-80 flex-col justify-between p-7 ${i===1?"bg-primary text-primary-foreground":"bg-card"}`}><div><span className="eyebrow">0{i+1}</span><h3 className="display-title mt-5 text-5xl">{x[0]}</h3><p className={`mt-4 text-sm ${i===1?"text-primary-foreground/60":"text-muted-foreground"}`}>{x[1]}</p></div><Button variant={i===1?"inverse":"outline"} onClick={openProjectForm}>{x[2]}</Button></div>)}</div></section>

    <footer id="contact" className="relative min-h-screen overflow-hidden bg-primary text-primary-foreground"><div className="absolute inset-0 grid grid-cols-3 opacity-25 md:grid-cols-6">{images.map(x=><img key={x} src={x} alt="" loading="lazy" width={512} height={768} className="size-full object-cover"/>)}</div><div className="absolute inset-0 bg-primary/75"/><div className="page-shell relative flex min-h-screen flex-col justify-between py-8"><div className="flex justify-between"><span className="font-bold uppercase tracking-[.08em]">IMAGENMERCE</span><span className="eyebrow">Product imaging studio</span></div><div className="max-w-5xl"><p className="eyebrow text-accent">One reference. A complete visual system.</p><h2 className="display-title mt-6 text-7xl sm:text-8xl lg:text-[8.5rem]">Your Product Is Already There. Let's Present It Better.</h2><p className="mt-7 max-w-lg text-sm leading-7 text-primary-foreground/65">Send a reference image and build a complete product visual set around it.</p><div className="mt-8 flex flex-wrap gap-3"><Button variant="inverse" onClick={openProjectForm}>Start a Project</Button><Button variant="outline" onClick={openProjectForm} className="border-primary-foreground/35 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10">Discuss a Catalog</Button></div></div><div className="flex justify-between border-t border-primary-foreground/20 pt-5 text-[10px] uppercase text-primary-foreground/45"><span>© 2026 Imagenmerce</span><a href="#top">Back to top ↑</a></div></div></footer>
  </main>;
}
