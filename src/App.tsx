import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from './webgl/heroCanvas';
import { initSpecsCanvas } from './webgl/specsCanvas';

import showcaseStudioImg from './assets/images/jordan_showcase_studio_1794672675679.jpg';
import showcaseCourtImg from './assets/images/jordan_showcase_court_1794672676886.jpg';
import showcaseStreetImg from './assets/images/jordan_showcase_street_1794672676534.jpg';
import showcaseTunnelImg from './assets/images/jordan_showcase_tunnel_1794672678030.jpg';
import compareHardwoodImg from './assets/images/jordan_compare_hardwood_1794672678001.jpg';
import compareAsphaltImg from './assets/images/jordan_compare_asphalt_1794672678864.jpg';
import bentoCollarImg from './assets/images/jordan_bento_collar_1794672678475.jpg';
import bentoOutsoleImg from './assets/images/jordan_bento_outsole_1794672679214.jpg';

gsap.registerPlugin(ScrollTrigger);

type ColorwayId = 'chicago' | 'panda' | 'unc';
type SizeLabel = 'US 8' | 'US 9' | 'US 10' | 'US 11' | 'US 12';
type LaceId = 'black' | 'sail' | 'crimson' | 'unc';
type SizeUnit = 'US Men' | 'US Women' | 'UK' | 'EU';
type FaqCategory = 'All' | 'Sizing & Fit' | 'Materials & Care' | 'Authenticity';

interface BagItem {
  colorway: ColorwayId;
  size: SizeLabel;
  lace: LaceId;
  price: number;
  qty: number;
}

const COLORWAY_META: Record<
  ColorwayId,
  { name: string; dot: string; src: string; alt: string; code: string }
> = {
  chicago: {
    name: 'Chicago Red',
    dot: '#C8102E',
    src: '/assets/aistudio/image_36302ff5.png',
    alt: 'Nike Air Jordan 1 High OG in Chicago Varsity Red, Summit White, and Black tumbled leather',
    code: 'DZ5485-612',
  },
  panda: {
    name: 'Black & White',
    dot: '#1B1A1C',
    src: '/assets/aistudio/image_dc5d339f.png',
    alt: 'Nike Air Jordan 1 High OG in classic Black and White full-grain leather',
    code: 'DZ5485-010',
  },
  unc: {
    name: 'University Blue',
    dot: '#5B9BD5',
    src: '/assets/aistudio/image_57204128.png',
    alt: 'Nike Air Jordan 1 High OG in University Blue, White, and Black tumbled leather',
    code: '555088-134',
  },
};

const SIZE_OPTIONS: { size: SizeLabel; cm: number; price: number; scale: number }[] = [
  { size: 'US 8', cm: 26.0, price: 180, scale: 0.96 },
  { size: 'US 9', cm: 27.0, price: 180, scale: 0.98 },
  { size: 'US 10', cm: 28.0, price: 180, scale: 1.0 },
  { size: 'US 11', cm: 29.0, price: 180, scale: 1.02 },
  { size: 'US 12', cm: 30.0, price: 185, scale: 1.04 },
];

const SHOWCASE_STAGES = [
  {
    src: showcaseStudioImg,
    alt: 'Air Jordan 1 High OG standing on honed dark basalt slate in an architectural studio',
    title: 'Chicago Heritage',
    sub: 'Full-grain tumbled leather sculpted around the original 1985 high-top last',
  },
  {
    src: showcaseCourtImg,
    alt: 'Air Jordan 1 High OG resting on a sunlit polished maple hardwood basketball court',
    title: 'Born on the Hardwood',
    sub: 'Encapsulated Air-Sole cushioning built for vertical takeoff and clean landings',
  },
  {
    src: showcaseStreetImg,
    alt: 'Air Jordan 1 High OG University Blue resting on sunlit poured concrete steps',
    title: 'Architectural Presence',
    sub: 'Crisp leather paneling and high-contrast color blocking from court to street',
  },
  {
    src: showcaseTunnelImg,
    alt: 'Air Jordan 1 High OG Black and White inside a dimly lit stadium player tunnel',
    title: 'Tunnel Ready',
    sub: 'Padded 9-eyelet collar support engineered for all-day ankle stability',
  },
];

const ANATOMY_LAYERS = [
  {
    id: 'collar',
    num: '01',
    name: 'Padded High Collar',
    tag: '9-Eyelet',
    x: 61,
    y: 34,
    material: '1.4 mm full-grain leather + closed-cell foam',
    metric: '155 mm collar height',
    desc: 'High-cut ankle wings lock the heel in place with internal foam pods and the embossed Air Jordan Wings insignia.',
  },
  {
    id: 'toebox',
    num: '02',
    name: 'Perforated Toe Box',
    tag: 'Breathable',
    x: 28,
    y: 66,
    material: 'Supple full-grain cowhide vamp',
    metric: '25 radial micro-vents',
    desc: 'Laser-clean radial perforations circulate air across the forefoot while breaking in cleanly along natural flex creases.',
  },
  {
    id: 'airsole',
    num: '03',
    name: 'Encapsulated Air-Sole',
    tag: 'Heel Cushion',
    x: 65,
    y: 72,
    material: 'Pressurized urethane Air chamber in PU wedge',
    metric: '14 mm heel stack',
    desc: 'Tucked quietly inside the rubber cupsole heel, pressurized gas absorbs hard heel strikes without losing low-to-the-floor court feel.',
  },
  {
    id: 'cupsole',
    num: '04',
    name: '360° Stitched Cupsole',
    tag: 'Lockstitch',
    x: 49,
    y: 74,
    material: 'Non-marking vulcanized-look solid rubber',
    metric: '360° sidewall channel stitch',
    desc: 'Every upper is stitched directly into the sidewall groove around the full perimeter for durable torsional stability.',
  },
  {
    id: 'outsole',
    num: '05',
    name: 'Concentric Pivot Tread',
    tag: '360° Grip',
    x: 34,
    y: 77,
    material: 'High-abrasion herringbone & pivot rubber',
    metric: '65A Shore durometer',
    desc: 'Dual forefoot pivot circles allow effortless rotational cuts on varnished hardwood and grip reliably on city concrete.',
  },
];

const LACE_OPTIONS: Record<
  LaceId,
  { name: string; hex: string; note: string }
> = {
  black: {
    name: 'Varsity Black',
    hex: '#19181A',
    note: 'Original on-court contrast that grounds bold overlays.',
  },
  sail: {
    name: 'Sail Cream',
    hex: '#EAE4D7',
    note: 'Warm vintage tint matching aged midsoles and nylon tongues.',
  },
  crimson: {
    name: 'Chicago Crimson',
    hex: '#C8102E',
    note: 'High-energy tonal red match for classic Chicago blocking.',
  },
  unc: {
    name: 'University Blue',
    hex: '#5B9BD5',
    note: 'Crisp collegiate blue flat weave for sharp summer styling.',
  },
};

const FAQ_ITEMS: {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  q: string;
  a: string;
}[] = [
  {
    id: 'faq-sizing',
    category: 'Sizing & Fit',
    q: 'How does the Air Jordan 1 High OG fit compared to standard sneakers?',
    a: 'The Air Jordan 1 High OG runs true to size for narrow and standard feet. Because the stitched rubber cupsole and full-grain leather toe box have minimal stretch out of the box, riders with wide forefeet often prefer going half a size up.',
  },
  {
    id: 'faq-laces',
    category: 'Sizing & Fit',
    q: 'What lace length and extra lace sets are included in the box?',
    a: 'Every pair ships with 72-inch (183 cm) flat cotton laces calibrated for all 9 eyelets, plus a secondary tonal lace set tucked in the signature OG shoebox.',
  },
  {
    id: 'faq-leather',
    category: 'Materials & Care',
    q: 'How should I clean and condition the tumbled leather panels?',
    a: 'Wipe dust off after wear with a dry microfiber cloth. For deeper scuffs, use a mild pH-neutral foam cleaner with a soft horsehair brush, air-dry away from direct heat, and insert cedar shoe trees to preserve the toe box shape.',
  },
  {
    id: 'faq-breakin',
    category: 'Materials & Care',
    q: 'How long does the full-grain leather collar take to break in?',
    a: 'Expect 3 to 5 wears for the padded 9-eyelet collar and leather vamp to mold naturally to your ankle and instep flex points.',
  },
  {
    id: 'faq-auth',
    category: 'Authenticity',
    q: 'How is every pair verified before dispatch?',
    a: 'Each pair undergoes a multi-point physical inspection covering box label typography, UV midsole stitch consistency, leather grain cut, and insole glue pattern prior to sealing.',
  },
  {
    id: 'faq-returns',
    category: 'Authenticity',
    q: 'What is the return and size-exchange window?',
    a: 'Unworn pairs with original box, tissue, and lace bags attached may be exchanged for another size or returned for a full refund within 14 days of delivery.',
  },
];

function computeFit(cm: number, wide: boolean) {
  const adjustedCm = wide ? cm + 0.5 : cm;
  // Map 23.5cm..30.5cm -> US Men 5.5..12.5 in 0.5 increments
  const rawUsMen = Math.round(((adjustedCm - 23.5) * 2 + 5.5) * 2) / 2;
  const usMen = Math.max(5.5, Math.min(13, rawUsMen));
  const usWomen = usMen + 1.5;
  const uk = usMen - 1;
  const eu = Math.round((usMen + 33) * 2) / 2;

  // Snap to available order sizes US 8..12
  const closestOrderSize = SIZE_OPTIONS.reduce((prev, curr) =>
    Math.abs(curr.cm - adjustedCm) < Math.abs(prev.cm - adjustedCm) ? curr : prev
  );

  return {
    usMen: usMen % 1 === 0 ? `${usMen}` : `${usMen.toFixed(1)}`,
    usWomen: usWomen % 1 === 0 ? `${usWomen}` : `${usWomen.toFixed(1)}`,
    uk: uk % 1 === 0 ? `${uk}` : `${uk.toFixed(1)}`,
    eu: eu % 1 === 0 ? `${eu}` : `${eu.toFixed(1)}`,
    closestOrderSize,
  };
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [colorway, setColorway] = useState<ColorwayId>('chicago');
  const [size, setSize] = useState<SizeLabel>('US 10');
  const [price, setPrice] = useState<number>(180);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);

  // New interactive section states
  const [activeAnatomyId, setActiveAnatomyId] = useState<string>('collar');
  const [lace, setLace] = useState<LaceId>('black');
  const [laceStyle, setLaceStyle] = useState<'crossed' | 'relaxed'>('crossed');
  const [fitUnit, setFitUnit] = useState<SizeUnit>('US Men');
  const [footCm, setFootCm] = useState<number>(27.5);
  const [isWideFoot, setIsWideFoot] = useState<boolean>(false);
  const [fitAppliedToast, setFitAppliedToast] = useState<boolean>(false);
  const [faqFilter, setFaqFilter] = useState<FaqCategory>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-sizing');

  // Bag & Drawer state
  const [bag, setBag] = useState<BagItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [checkedOut, setCheckedOut] = useState<boolean>(false);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);
  const checkoutTimerRef = useRef<number | null>(null);
  const fitToastTimerRef = useRef<number | null>(null);
  const selectedConfigRef = useRef<{
    colorway: ColorwayId;
    size: SizeLabel;
    lace: LaceId;
    price: number;
  }>({ colorway: 'chicago', size: 'US 10', lace: 'black', price: 180 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(heroCanvasRef.current);
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 12;
      targetRotX = -ny * 9;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    });

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      if (checkoutTimerRef.current !== null) {
        window.clearTimeout(checkoutTimerRef.current);
        checkoutTimerRef.current = null;
      }
      if (fitToastTimerRef.current !== null) {
        window.clearTimeout(fitToastTimerRef.current);
        fitToastTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 110);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

  const selectColorway = (nextColorway: ColorwayId) => {
    selectedConfigRef.current.colorway = nextColorway;
    setColorway(nextColorway);
  };

  const selectSize = (nextSize: SizeLabel, nextPrice: number) => {
    selectedConfigRef.current.size = nextSize;
    selectedConfigRef.current.price = nextPrice;
    setSize(nextSize);
    setPrice(nextPrice);
  };

  const selectLace = (nextLace: LaceId) => {
    selectedConfigRef.current.lace = nextLace;
    setLace(nextLace);
  };

  const cancelPendingCheckout = () => {
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
      checkoutTimerRef.current = null;
      setCheckedOut(false);
    }
  };

  const addToBag = () => {
    cancelPendingCheckout();
    const activeCfg = selectedConfigRef.current;
    setBag((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.colorway === activeCfg.colorway &&
          item.size === activeCfg.size &&
          item.lace === activeCfg.lace
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          colorway: activeCfg.colorway,
          size: activeCfg.size,
          lace: activeCfg.lace,
          price: activeCfg.price,
          qty: 1,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateBagQty = (idx: number, delta: number) => {
    cancelPendingCheckout();
    setBag((prev) => {
      const next = [...prev];
      const updatedQty = next[idx].qty + delta;
      if (updatedQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty: updatedQty };
      }
      return next;
    });
  };

  const handleCheckout = () => {
    if (checkedOut) return;
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
    }
    setCheckedOut(true);
    checkoutTimerRef.current = window.setTimeout(() => {
      checkoutTimerRef.current = null;
      setBag([]);
      setCheckedOut(false);
      setDrawerOpen(false);
    }, 1200);
  };

  const fit = computeFit(footCm, isWideFoot);
  const applyRecommendedSize = () => {
    selectSize(fit.closestOrderSize.size, fit.closestOrderSize.price);
    setFitAppliedToast(true);
    if (fitToastTimerRef.current !== null) {
      window.clearTimeout(fitToastTimerRef.current);
    }
    fitToastTimerRef.current = window.setTimeout(() => {
      fitToastTimerRef.current = null;
      setFitAppliedToast(false);
    }, 2200);
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeAnatomy =
    ANATOMY_LAYERS.find((layer) => layer.id === activeAnatomyId) ??
    ANATOMY_LAYERS[0];

  const filteredFaqs =
    faqFilter === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === faqFilter);

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
  const activeScale =
    SIZE_OPTIONS.find((s) => s.size === size)?.scale ?? 1.0;
  const activeColorwayMeta = COLORWAY_META[colorway];

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a href="#hero" className="brand-lockup" aria-label="Jordan 1 Home">
            <svg
              className="brand-mark"
              width="24"
              height="16"
              viewBox="0 0 28 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 14.5L11.5 3L16 10.5L25 4.5L20 14.5H3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand-wordmark">Jordan 1</span>
          </a>

          <nav className="header-nav" aria-label="Primary">
            <a href="#showcase" className="nav-link">
              Showcase
            </a>
            <a href="#craft" className="nav-link">
              Specs
            </a>
            <a href="#anatomy" className="nav-link">
              Anatomy
            </a>
            <a href="#fit-lab" className="nav-link">
              Fit Lab
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn theme-toggle"
              id="theme-toggle"
              aria-label="Toggle color theme"
              title="Switch light or dark theme"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <svg
                id="theme-icon-sun"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="18" />
                <line x1="128" y1="24" x2="128" y2="44" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="212" x2="128" y2="232" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="24" y1="128" x2="44" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="212" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="54" x2="68" y2="68" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="188" x2="202" y2="202" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="202" x2="68" y2="188" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="68" x2="202" y2="54" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
              </svg>
              <svg
                id="theme-icon-moon"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M210.69 158.18A96.78 96.78 0 0 1 192 160 96.11 96.11 0 0 1 96 64a96.78 96.78 0 0 1 1.82-18.69A96.04 96.04 0 1 0 210.69 158.18Z"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn bag-trigger"
              id="bag-trigger"
              aria-label="Open order bag"
              onClick={() => setDrawerOpen(true)}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="32"
                  y="72"
                  width="192"
                  height="144"
                  rx="16"
                  stroke="currentColor"
                  strokeWidth="18"
                />
                <path
                  d="M88 72V64a40 40 0 0 1 80 0v8"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
              </svg>
              <span className="bag-count" id="bag-count">
                {totalQty}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 1: Asymmetric Split Hero */}
        <section id="hero" className="hero">
          <canvas
            ref={heroCanvasRef}
            id="hero-gl-canvas"
            className="hero-canvas"
            aria-hidden="true"
          />

          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">
                Air Jordan 1 High OG · {activeColorwayMeta.code}
              </p>
              <h1 className="hero-title">Born to fly.</h1>
              <p className="hero-sub">
                Full-grain tumbled leather, encapsulated Nike Air cushioning,
                and the unmistakable 1985 high-top profile engineered to command
                every hardwood court and city block.
              </p>

              <div className="hero-actions">
                <a href="#order" className="btn btn-primary magnetic-btn">
                  Shop AJ1 High
                </a>
                <a href="#showcase" className="btn btn-ghost">
                  Explore
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="64"
                      y1="64"
                      x2="192"
                      y2="192"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="88 192 192 192 192 88"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hero-stage" ref={heroStageRef} id="hero-stage">
              <div
                className="sneaker-tilt-wrap"
                ref={tiltWrapRef}
                id="sneaker-tilt-wrap"
              >
                <div className="sneaker-stage-frame">
                  <img
                    key={colorway}
                    src={activeColorwayMeta.src}
                    alt={activeColorwayMeta.alt}
                    className="sneaker-hero-img"
                    id="hero-sneaker-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="sneaker-shadow" ref={shadowRef} aria-hidden="true" />

              <div
                className="hero-swatches"
                role="radiogroup"
                aria-label="Select Air Jordan 1 colorway"
              >
                {(Object.keys(COLORWAY_META) as ColorwayId[]).map((key) => {
                  const meta = COLORWAY_META[key];
                  const isActive = colorway === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      className={`swatch-btn${isActive ? ' is-active' : ''}`}
                      data-colorway={key}
                      aria-checked={isActive}
                      aria-label={`${meta.name} colorway`}
                      onClick={() => selectColorway(key)}
                    >
                      <span
                        className="swatch-dot"
                        style={{ background: meta.dot }}
                      />
                      <span className="swatch-label">{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Pinned 4-Angle Environmental Showcase */}
        <section id="showcase" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.title}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                >
                  <img
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                    referrerPolicy="no-referrer"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="Showcase environments"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`Environment ${i + 1}: ${stage.title}`}
                    onClick={() => selectStage(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Hardwood vs. Asphalt Surface Comparison Slider */}
        <section id="performance" className="thermal-section">
          <div className="container thermal-grid">
            <div
              className="comparison-wrap"
              ref={compWrapRef}
              id="comparison-wrap"
              onPointerDown={handleCompPointerDown}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerCancel={handleCompPointerUp}
            >
              <div className="comparison-layer comparison-hot">
                <img
                  src={compareAsphaltImg}
                  alt="Air Jordan 1 High OG resting on dark outdoor street asphalt at sunset"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
                <span className="comparison-tag comparison-tag-right">
                  Street Asphalt
                </span>
              </div>

              <div
                className="comparison-layer comparison-cold"
                id="comparison-cold"
                style={{
                  clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  transition: splitAnimate
                    ? 'clip-path 380ms var(--ease-out)'
                    : 'none',
                }}
              >
                <img
                  src={compareHardwoodImg}
                  alt="Air Jordan 1 High OG on glossy indoor arena maple hardwood floor"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
                <span className="comparison-tag comparison-tag-left">
                  Indoor Hardwood
                </span>
              </div>

              <div
                className={`comparison-handle${
                  splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
                }`}
                id="comparison-handle"
                role="slider"
                tabIndex={0}
                aria-label="Compare hardwood court and outdoor street asphalt performance"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(splitPct)}
                style={{
                  left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                  transition: splitAnimate
                    ? 'left 380ms var(--ease-out)'
                    : 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                  if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
                }}
              >
                <div className="handle-line" />
                <div className="handle-knob">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points="176 144 208 176 176 208"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="48"
                      y1="176"
                      x2="208"
                      y2="176"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="80 112 48 80 80 48"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="208"
                      y1="80"
                      x2="48"
                      y2="80"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="thermal-copy">
              <h2 className="section-title">Hardwood grip. Street durability.</h2>
              <p className="section-sub">
                Concentric pivot circles anchor sharp cuts on polished arena
                maple while 65A high-abrasion rubber shrugs off rough blacktop
                miles.
              </p>

              <div
                className="segmented-control"
                role="tablist"
                aria-label="Surface performance focus"
              >
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct >= 98 ? ' is-active' : ''}`}
                  aria-selected={splitPct >= 98}
                  onClick={() => updateSplit(100, true)}
                >
                  Indoor Hardwood
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct <= 2 ? ' is-active' : ''}`}
                  aria-selected={splitPct <= 2}
                  onClick={() => updateSplit(0, true)}
                >
                  Street Asphalt
                </button>
              </div>

              <div className="thermal-metrics">
                <div className="metric-item">
                  <span className="metric-value">1985</span>
                  <span className="metric-label">Original silhouette</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">14 mm</span>
                  <span className="metric-label">Air-Sole heel stack</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">360°</span>
                  <span className="metric-label">Pivot tread traction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Asymmetric 3-Tile Editorial Bento */}
        <section id="craft" className="bento-section">
          <div className="container">
            <div className="section-header-stack">
              <h2 className="section-title">Crafted to outlast trends.</h2>
            </div>

            <div className="bento-grid" ref={bentoGridRef}>
              <article className="bento-tile bento-tall reveal-tile">
                <img
                  src={bentoCollarImg}
                  alt="Macro close-up of padded Air Jordan 1 leather ankle collar and Wings emblem"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Wings Padded Collar</h3>
                  <p className="bento-sub">
                    Full-grain tumbled leather flaps with debossed Air Jordan
                    Wings emblem
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-top reveal-tile">
                <img
                  src={bentoOutsoleImg}
                  alt="Close-up of stitched white rubber cupsole and crimson tread on concrete"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">Stitched Cupsole</h3>
                  <p className="bento-sub">
                    360-degree sidewall lockstitching with perforated leather vamp
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-bottom reveal-tile">
                <canvas
                  ref={specsCanvasRef}
                  id="specs-gl-canvas"
                  className="specs-canvas"
                  aria-hidden="true"
                />
                <div className="bento-footer bento-footer-specs">
                  <div>
                    <h3 className="bento-title tabular-nums">398 g</h3>
                    <p className="bento-sub">US 10 single-shoe weight</p>
                  </div>
                  <span className="spec-badge">Air-Sole</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5 (NEW): Interactive Sneaker Anatomy & Layer Explorer */}
        <section id="anatomy" className="anatomy-section">
          <div className="container">
            <div className="section-header-stack">
              <h2 className="section-title">Five layers of 1985 engineering.</h2>
              <p className="section-sub">
                Select any structural pin on the silhouette or layer below to
                inspect the materials, tolerances, and court architecture inside
                every pair.
              </p>
            </div>

            <div className="anatomy-grid">
              <div className="anatomy-stage">
                <img
                  src={showcaseStudioImg}
                  alt="Air Jordan 1 High OG architectural profile with interactive anatomy pins"
                  className="anatomy-img"
                  referrerPolicy="no-referrer"
                />
                {ANATOMY_LAYERS.map((layer) => {
                  const isActive = layer.id === activeAnatomy.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      className={`anatomy-pin${isActive ? ' is-active' : ''}`}
                      style={{ left: `${layer.x}%`, top: `${layer.y}%` }}
                      aria-label={`Inspect ${layer.name}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveAnatomyId(layer.id)}
                    >
                      {layer.num}
                    </button>
                  );
                })}
                <span className="anatomy-stage-caption">
                  {activeAnatomy.num} · {activeAnatomy.name}
                </span>
              </div>

              <div className="anatomy-panel">
                <div
                  className="anatomy-list"
                  role="tablist"
                  aria-label="Sneaker anatomy layers"
                >
                  {ANATOMY_LAYERS.map((layer) => {
                    const isActive = layer.id === activeAnatomy.id;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`anatomy-tab${isActive ? ' is-active' : ''}`}
                        onClick={() => setActiveAnatomyId(layer.id)}
                      >
                        <span className="anatomy-tab-left">
                          <span className="anatomy-tab-num">{layer.num}</span>
                          <span className="anatomy-tab-name">{layer.name}</span>
                        </span>
                        <span className="anatomy-tab-tag">{layer.tag}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="anatomy-detail-card" aria-live="polite">
                  <h3 className="anatomy-detail-title">
                    {activeAnatomy.num}. {activeAnatomy.name}
                  </h3>
                  <p className="anatomy-detail-desc">{activeAnatomy.desc}</p>
                  <div className="anatomy-spec-grid">
                    <div>
                      <span className="anatomy-spec-label">Material</span>
                      <span className="anatomy-spec-val">
                        {activeAnatomy.material}
                      </span>
                    </div>
                    <div>
                      <span className="anatomy-spec-label">Specification</span>
                      <span className="anatomy-spec-val">
                        {activeAnatomy.metric}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 (NEW): Interactive Lace Lab & Precision Fit Finder */}
        <section id="fit-lab" className="lab-section">
          <div className="container">
            <div className="section-header-stack">
              <h2 className="section-title">Dial in your lace & fit.</h2>
              <p className="section-sub">
                Preview factory lace pairings on your chosen colorway and
                calculate your exact US, UK, and EU size from foot length.
              </p>
            </div>

            <div className="lab-grid">
              {/* Interactive Lace Lab */}
              <div className="lab-card">
                <div>
                  <h3 className="lab-card-title">Lace Colorway Lab</h3>
                  <p className="lab-card-sub">
                    Every High OG includes 72-inch flat woven cotton laces. Test
                    how secondary lace swaps shift the shoe&apos;s balance.
                  </p>
                </div>

                <div className="lace-preview-box">
                  <img
                    key={`lab-${colorway}`}
                    src={activeColorwayMeta.src}
                    alt={`${activeColorwayMeta.name} styled with ${LACE_OPTIONS[lace].name} laces`}
                    className="lace-preview-img"
                    referrerPolicy="no-referrer"
                  />
                  <div className="lace-overlay-ribbon">
                    <div className="lace-weave-strip">
                      <span
                        className="lace-bar"
                        style={{ backgroundColor: LACE_OPTIONS[lace].hex }}
                      />
                      <span className="lace-meta-text">
                        {LACE_OPTIONS[lace].name} ·{' '}
                        {laceStyle === 'crossed'
                          ? '9-Eyelet Crossed'
                          : 'Loose 7-Eyelet'}
                      </span>
                    </div>
                    <span className="lace-meta-text tabular-nums">72 in</span>
                  </div>
                </div>

                <div className="lab-controls-stack">
                  <div>
                    <span className="config-label">Lace Color</span>
                    <div className="option-row">
                      {(Object.keys(LACE_OPTIONS) as LaceId[]).map((id) => (
                        <button
                          key={id}
                          type="button"
                          className={`pill-option${lace === id ? ' is-active' : ''}`}
                          onClick={() => selectLace(id)}
                        >
                          <span
                            className="dot"
                            style={{ background: LACE_OPTIONS[id].hex }}
                          />
                          {LACE_OPTIONS[id].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="config-label">Lacing Silhouette</span>
                    <div className="option-row">
                      <button
                        type="button"
                        className={`pill-option${
                          laceStyle === 'crossed' ? ' is-active' : ''
                        }`}
                        onClick={() => setLaceStyle('crossed')}
                      >
                        Factory Cross (All 9 Eyelets)
                      </button>
                      <button
                        type="button"
                        className={`pill-option${
                          laceStyle === 'relaxed' ? ' is-active' : ''
                        }`}
                        onClick={() => setLaceStyle('relaxed')}
                      >
                        Relaxed Collar (7 Eyelets)
                      </button>
                    </div>
                    <p className="lab-card-sub">{LACE_OPTIONS[lace].note}</p>
                  </div>
                </div>
              </div>

              {/* Interactive Precision Fit Calculator */}
              <div className="lab-card">
                <div>
                  <h3 className="lab-card-title">Precision Fit Finder</h3>
                  <p className="lab-card-sub">
                    Slide to your heel-to-toe measurement and select forefoot
                    width for an exact Jordan 1 High OG recommendation.
                  </p>
                </div>

                <div className="lab-controls-stack">
                  <div>
                    <span className="config-label">Primary Size Standard</span>
                    <div className="option-row">
                      {(['US Men', 'US Women', 'UK', 'EU'] as SizeUnit[]).map(
                        (unit) => (
                          <button
                            key={unit}
                            type="button"
                            className={`pill-option${
                              fitUnit === unit ? ' is-active' : ''
                            }`}
                            onClick={() => setFitUnit(unit)}
                          >
                            {unit}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="fit-slider-wrap">
                    <div className="fit-slider-header">
                      <label htmlFor="foot-cm-slider" className="config-label">
                        Measured Foot Length
                      </label>
                      <span className="fit-cm-readout">
                        {footCm.toFixed(1)} cm
                      </span>
                    </div>
                    <input
                      id="foot-cm-slider"
                      type="range"
                      min={23.5}
                      max={30.5}
                      step={0.5}
                      value={footCm}
                      onChange={(e) => setFootCm(parseFloat(e.target.value))}
                      className="fit-range-input"
                    />
                  </div>

                  <div>
                    <span className="config-label">Forefoot Profile</span>
                    <div className="option-row">
                      <button
                        type="button"
                        className={`pill-option${!isWideFoot ? ' is-active' : ''}`}
                        onClick={() => setIsWideFoot(false)}
                      >
                        Standard / Narrow
                      </button>
                      <button
                        type="button"
                        className={`pill-option${isWideFoot ? ' is-active' : ''}`}
                        onClick={() => setIsWideFoot(true)}
                      >
                        Wide Forefoot (+0.5)
                      </button>
                    </div>
                  </div>

                  <div className="fit-conversion-grid">
                    <div
                      className={`fit-cell${
                        fitUnit === 'US Men' ? ' is-highlighted' : ''
                      }`}
                    >
                      <span className="fit-cell-unit">US Men</span>
                      <span className="fit-cell-val">{fit.usMen}</span>
                    </div>
                    <div
                      className={`fit-cell${
                        fitUnit === 'US Women' ? ' is-highlighted' : ''
                      }`}
                    >
                      <span className="fit-cell-unit">US Women</span>
                      <span className="fit-cell-val">{fit.usWomen}</span>
                    </div>
                    <div
                      className={`fit-cell${
                        fitUnit === 'UK' ? ' is-highlighted' : ''
                      }`}
                    >
                      <span className="fit-cell-unit">UK</span>
                      <span className="fit-cell-val">{fit.uk}</span>
                    </div>
                    <div
                      className={`fit-cell${
                        fitUnit === 'EU' ? ' is-highlighted' : ''
                      }`}
                    >
                      <span className="fit-cell-unit">EU</span>
                      <span className="fit-cell-val">{fit.eu}</span>
                    </div>
                  </div>
                </div>

                <div className="fit-verdict-box">
                  <p className="fit-verdict-copy">
                    Recommended order size:{' '}
                    <strong>{fit.closestOrderSize.size}</strong> (
                    {isWideFoot
                      ? 'half size up for leather toe-box comfort'
                      : 'true to size for locked-in court fit'}
                    ).
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={applyRecommendedSize}
                  >
                    {fitAppliedToast
                      ? `Applied ${fit.closestOrderSize.size}`
                      : `Apply ${fit.closestOrderSize.size}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Interactive Colorway & Size Configurator + Order */}
        <section id="order" className="order-section">
          <div className="container order-grid">
            <div className="order-preview" id="order-preview">
              <div className="order-plinth" aria-hidden="true" />
              <img
                key={`order-${colorway}`}
                src={activeColorwayMeta.src}
                alt={`Configured ${activeColorwayMeta.name} Air Jordan 1 High OG preview`}
                className="order-sneaker-img"
                id="order-sneaker-img"
                style={{ transform: `scale(${activeScale})` }}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="order-panel">
              <h2 className="section-title">Air Jordan 1 High OG</h2>
              <p className="order-price" id="order-price">
                ${price}
              </p>

              <div className="config-group">
                <span className="config-label">Colorway</span>
                <div className="option-row" id="order-colorway-row">
                  {(Object.keys(COLORWAY_META) as ColorwayId[]).map((key) => {
                    const meta = COLORWAY_META[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`pill-option${
                          colorway === key ? ' is-active' : ''
                        }`}
                        onClick={() => selectColorway(key)}
                      >
                        <span
                          className="dot"
                          style={{ background: meta.dot }}
                        />
                        {meta.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">Size (Men&apos;s US)</span>
                <div className="option-row" id="order-size-row">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      className={`pill-option tabular-nums${
                        size === opt.size ? ' is-active' : ''
                      }`}
                      onClick={() => selectSize(opt.size, opt.price)}
                    >
                      {opt.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="spec-list">
                <div className="spec-row">
                  <span className="spec-key">Upper</span>
                  <span className="spec-val">Full-grain tumbled leather</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Laces</span>
                  <span className="spec-val">
                    {LACE_OPTIONS[lace].name} (72 in flat cotton)
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Cushioning</span>
                  <span className="spec-val">Encapsulated Air-Sole unit</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Outsole</span>
                  <span className="spec-val">360° stitched pivot cupsole</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full magnetic-btn"
                id="add-to-bag-btn"
                onClick={addToBag}
              >
                <span className="btn-label tabular-nums" id="add-to-bag-label">
                  Add to Bag - ${price}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 8 (NEW): Frequently Asked Questions */}
        <section id="faq" className="faq-section">
          <div className="container faq-layout">
            <div className="faq-intro">
              <h2 className="section-title">Questions, answered.</h2>
              <p className="section-sub">
                Everything you need to know about High OG sizing, leather care,
                included lace sets, and authentication.
              </p>

              <div
                className="faq-filters"
                role="tablist"
                aria-label="Filter questions by topic"
              >
                {(
                  [
                    'All',
                    'Sizing & Fit',
                    'Materials & Care',
                    'Authenticity',
                  ] as FaqCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={faqFilter === cat}
                    className={`pill-option${
                      faqFilter === cat ? ' is-active' : ''
                    }`}
                    onClick={() => {
                      setFaqFilter(cat);
                      const firstMatch =
                        cat === 'All'
                          ? FAQ_ITEMS[0]
                          : FAQ_ITEMS.find((f) => f.category === cat);
                      if (firstMatch) setOpenFaqId(firstMatch.id);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="faq-list">
              {filteredFaqs.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`faq-item${isOpen ? ' is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-panel`}
                      onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                    >
                      <span className="faq-question">{item.q}</span>
                      <span className="faq-icon" aria-hidden="true">
                        +
                      </span>
                    </button>
                    <div
                      id={`${item.id}-panel`}
                      className="faq-answer-wrap"
                      hidden={!isOpen}
                    >
                      <p className="faq-answer">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">Jordan 1</span>
          <span className="footer-tag">Engineered for flight since 1985.</span>
          <span className="footer-copy">© 2026 Jordan Studio</span>
        </div>
      </footer>

      {/* Slide-Over Order Bag Drawer */}
      <div
        className="drawer-backdrop"
        id="drawer-backdrop"
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className="bag-drawer"
        id="bag-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!drawerOpen}
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            Bag
          </h2>
          <button
            type="button"
            className="icon-btn"
            id="drawer-close"
            aria-label="Close bag"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 256 256"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="200"
                y1="56"
                x2="56"
                y2="200"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <line
                x1="200"
                y1="200"
                x2="56"
                y2="56"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="drawer-body" id="drawer-body">
          <div className="drawer-empty" id="drawer-empty" hidden={bag.length > 0}>
            <p>Your bag is empty.</p>
            <a
              href="#order"
              className="btn btn-primary btn-sm"
              id="drawer-empty-cta"
              onClick={() => setDrawerOpen(false)}
            >
              Select Pair
            </a>
          </div>

          <div className="drawer-items" id="drawer-items" hidden={bag.length === 0}>
            {bag.map((item, idx) => {
              const meta = COLORWAY_META[item.colorway];
              return (
                <div
                  key={`${item.colorway}-${item.size}-${item.lace}`}
                  className="bag-item"
                >
                  <img
                    src={meta.src}
                    alt={meta.name}
                    className="bag-item-thumb"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bag-item-info">
                    <div className="bag-item-name">Air Jordan 1 High OG</div>
                    <div className="bag-item-meta tabular-nums">
                      {meta.name} · {item.size} · {LACE_OPTIONS[item.lace].name}{' '}
                      Laces (${item.price})
                    </div>
                    <div className="bag-qty-row">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Decrease quantity"
                        onClick={() => updateBagQty(idx, -1)}
                      >
                        -
                      </button>
                      <span className="bag-qty">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Increase quantity"
                        onClick={() => updateBagQty(idx, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="drawer-footer" id="drawer-footer" hidden={bag.length === 0}>
          <div className="drawer-total-row">
            <span>Total</span>
            <span className="drawer-total" id="drawer-total">
              ${totalPrice}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            id="checkout-btn"
            disabled={checkedOut}
            onClick={handleCheckout}
          >
            {checkedOut ? 'Order #AJ1-8523 Confirmed' : 'Checkout'}
          </button>
        </div>
      </aside>
    </>
  );
}
