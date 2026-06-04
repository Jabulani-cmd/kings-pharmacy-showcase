import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { ShoppingBag, Zap, Crown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kings Pharmacy — Fast Prescription Delivery" },
      {
        name: "description",
        content: "Order prescription and OTC medicines online. Fast delivery, real pharmacists, Kings Rewards points.",
      },
    ],
  }),
  component: Home,
});

// ─── Slide data with real Unsplash pharmacy images ────────────────────────────
const slides = [
  {
    id: 0,
    label: "Delivery",
    title: "Fast Prescription\nDelivery",
    sub: "Order before 5 pm — delivered to your door in 30 minutes across the city.",
    cta: "Order Now",
    ctaRoute: "/checkout",
    bg: "from-[#0D2249] via-[#1B3A6B] to-[#1E5BC6]",
    accent: "#60A5FA",
    Icon: Zap,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Pharmacist handing prescription bag to customer",
  },
  {
    id: 1,
    label: "Catalogue",
    title: "200+ OTC Medicines\nIn Stock Today",
    sub: "From pain relief to vitamins — browse our full catalogue and add to cart in seconds.",
    cta: "Browse Catalogue",
    ctaRoute: "/catalogue",
    bg: "from-[#1E5BC6] via-[#2563EB] to-[#0D2249]",
    accent: "#A5F3FC",
    Icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Pharmacy shelves stocked with medicines",
  },
  {
    id: 2,
    label: "Rewards",
    title: "Earn Kings Rewards\nPoints Every Order",
    sub: "Get 5% back in loyalty points on every purchase. Redeem for discounts anytime.",
    cta: "Join Free",
    ctaRoute: "/account",
    bg: "from-[#065F46] via-[#1A7A4A] to-[#0D2249]",
    accent: "#6EE7B7",
    Icon: Crown,
    image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Happy customer receiving pharmacy order",
  },
];

const categories = [
  { emoji: "💊", label: "Prescription", route: "/catalogue?cat=prescription" },
  { emoji: "🩺", label: "OTC Medicines", route: "/catalogue?cat=otc" },
  { emoji: "👶", label: "Baby Care", route: "/catalogue?cat=baby" },
  { emoji: "💆", label: "Vitamins", route: "/catalogue?cat=vitamins" },
  { emoji: "🩹", label: "First Aid", route: "/catalogue?cat=firstaid" },
  { emoji: "💄", label: "Cosmetics", route: "/catalogue?cat=cosmetics" },
];

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = useCallback((index: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setCurrent((index + slides.length) % slides.length);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }, []);

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1, 1);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((s) => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const s = slides[current];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl"
      style={{ minHeight: "clamp(280px, 38vw, 480px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image layer */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={`bg-${s.id}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={s.image} alt={s.imageAlt} className="w-full h-full object-cover" loading="eager" />
          {/* Gradient overlay — strong on left for text, fading right */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.bg} opacity-90 md:opacity-80`} />
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`text-${s.id}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.05 }}
          className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 py-8 md:py-12 max-w-xl"
          style={{ minHeight: "clamp(280px, 38vw, 480px)" }}
        >
          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 mb-3 md:mb-4"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest border"
              style={{ color: s.accent, borderColor: `${s.accent}55`, background: `${s.accent}18` }}
            >
              <s.Icon size={11} />
              Kings Pharmacy
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white font-black leading-[1.08] whitespace-pre-line"
            style={{ fontSize: "clamp(1.65rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            {s.title}
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
            className="mt-2 md:mt-3 text-white/80 leading-relaxed"
            style={{ fontSize: "clamp(0.82rem, 1.6vw, 1rem)" }}
          >
            {s.sub}
          </motion.p>

          {/* CTA Button — fully wired */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mt-5 md:mt-7 flex items-center gap-3"
          >
            <button
              onClick={() => navigate({ to: s.ctaRoute })}
              className="group inline-flex items-center gap-2 rounded-full font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/60"
              style={{ background: "white", color: "#1B3A6B" }}
            >
              {s.cta}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Right-side image peek on desktop */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.img
            key={`img-peek-${s.id}`}
            src={s.image}
            alt=""
            custom={direction}
            variants={{
              enter: (dir: number) => ({ opacity: 0, scale: 1.08, x: dir > 0 ? 40 : -40 }),
              center: { opacity: 1, scale: 1, x: 0 },
              exit: { opacity: 0, scale: 0.96 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((sl, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full focus:outline-none"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? "white" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-20 text-white/60 text-xs font-mono tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── Category Chip ────────────────────────────────────────────────────────────
function CategoryChip({ emoji, label, route }: { emoji: string; label: string; route: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate({ to: route })}
      className="shrink-0 flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-border min-w-[88px]
                 hover:border-[#1E5BC6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-[#1E5BC6]/40"
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span className="text-xs font-semibold text-[#1B3A6B] whitespace-nowrap">{label}</span>
    </button>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Category Pills ── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#6C7A89] mb-3 px-0.5">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2 scrollbar-none">
          {categories.map((c) => (
            <CategoryChip key={c.label} {...c} />
          ))}
        </div>
      </div>

      {/* ── Flash Sale Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-r from-[#1A7A4A] to-[#0F5C36] text-white px-5 py-4
                   flex items-center justify-between shadow-md"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">🎉 Flash Sale</div>
          <div className="font-black text-lg leading-tight">20% off all Vitamins this week</div>
          <div className="text-white/70 text-xs mt-0.5">Use code VITAMINS20 at checkout</div>
        </div>
        <button
          onClick={() => navigate({ to: "/catalogue?cat=vitamins&promo=VITAMINS20" })}
          className="bg-white text-[#1A7A4A] font-bold rounded-full px-5 py-2.5 text-sm
                     hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/60 whitespace-nowrap"
        >
          Shop Sale
        </button>
      </motion.div>

      {/* ── Featured Products ── */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-[#1B3A6B]">Featured Products</h2>
          <button
            onClick={() => navigate({ to: "/catalogue" })}
            className="text-sm font-semibold text-[#1E5BC6] hover:text-[#1B3A6B] transition-colors
                       inline-flex items-center gap-1 group focus:outline-none"
          >
            See all
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>

      {/* ── Trust Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {[
          { icon: "🚀", title: "30-Min Delivery", sub: "Across the city" },
          { icon: "👨‍⚕️", title: "Real Pharmacists", sub: "Verify every Rx" },
          { icon: "🔒", title: "Secure Payments", sub: "EcoCash & card" },
          { icon: "↩️", title: "Easy Returns", sub: "Hassle-free policy" },
        ].map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 bg-white rounded-2xl border border-border px-4 py-3
                       hover:border-[#1E5BC6] hover:shadow-sm transition-all duration-200"
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            <div>
              <div className="text-xs font-bold text-[#1B3A6B] leading-tight">{t.title}</div>
              <div className="text-[11px] text-[#6C7A89]">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* bottom padding for mobile tab bar */}
      <div className="h-4" />
    </div>
  );
}
