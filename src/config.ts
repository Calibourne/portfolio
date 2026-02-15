import type {
	AnnouncementConfig,
	CommentConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	FullscreenWallpaperConfig,
	LicenseConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PermalinkConfig,
	ProfileConfig,
	SakuraConfig,
	ShareConfig,
	SidebarLayoutConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// 移除i18n导入以避免循环依赖

// 定义站点语言
const SITE_LANG = "en"; // 语言代码，例如：'en', 'zh_CN', 'ja' 等。
const SITE_TIMEZONE = 2; //设置你的网站时区 from -12 to 12 default in UTC+8
export const siteConfig: SiteConfig = {
  title: "Eddie Kanevsky",
  subtitle: "Portfolio",
  siteURL: "https://your-domain.com/", // Replace with your site URL (end with a trailing slash)
  siteStartDate: "2025-01-01", // Used by site-stats widgets to calculate “days running”

  timeZone: SITE_TIMEZONE,
  lang: SITE_LANG,

  themeColor: {
    hue: 250, // Default theme hue, range 0..360 (red=0, cyan~200, blue-green~250, pink~345)
    fixed: true, // Hide theme color picker from visitors when true
  },

  /**
   * Feature page toggles
   * Disabling unused pages helps SEO, but remember to also remove their links from navBarConfig.
   */
  featurePages: {
	  diary: false, // Diary page (disabled)
	  friends: true, // Friends/links page (optional; keep if you want “people I work with / recommend”)
	  projects: true, // Projects page
	  skills: true, // Skills page
	  timeline: true, // Timeline page
	  albums: false, // Albums/gallery page (disabled)
	  devices: false, // Devices page (disabled)
	  anime: true, // Anime page
  },

  /**
   * Top navbar title settings
   * mode:
   *  - "text-icon" = icon + text
   *  - "logo"      = logo only
   */
  navbarTitle: {
    mode: "text-icon",
    text: "Eddie Kanevsky",
    icon: "assets/home/logo.png", // Uses icon set (recommended) instead of a local PNG
    // logo: "assets/home/logo.png", // If you switch mode to "logo", point this to your logo
  },

  anime: {
	mode: "local"
  },

  /**
   * Auto scaling for wide layouts
   * Good if the theme was designed around ultra-wide screens.
   */
  pageScaling: {
    enable: true,
    targetWidth: 1600, // 2000 is kinda “4K-or-bust”; 1600 feels nicer for laptops + big screens
  },

  /**
   * Post list layout
   * Note: If you enable dual sidebars ("both"), "grid" is usually not supported.
   */
  postListLayout: {
    defaultMode: "list", // "list" (single column) or "grid" (two columns)
    allowSwitch: true,
  },

  /**
   * Tag styling
   * New style = hover highlight; old style = outlined tags.
   */
  tagStyle: {
    useNewStyle: true,
  },

  /**
   * Wallpaper mode
   * defaultMode:
   *  - "banner"     = top banner
   *  - "fullscreen" = fullscreen wallpaper
   *  - "none"       = no wallpaper
   */
  wallpaperMode: {
    defaultMode: "banner",
    // Visibility of the layout/mode switch button:
    // "off" | "mobile" | "desktop" | "both"
    showModeSwitchOnMobile: "desktop",
  },

  /**
   * Banner configuration
   */
  banner: {
    src: {
      // Use a single strong banner for a portfolio. Carousels look “bloggy” and distract.
      desktop: ["/assets/desktop-banner/desktop.jpg"],
      mobile: [
		// "/assets/banner/hero-mobile.webp"
	],
    },

    position: "center", // same as CSS object-position: 'top' | 'center' | 'bottom'

    carousel: {
      enable: false, // If you later add multiple images, set true to cycle, false to randomize
      interval: 2.0, // seconds
    },

    waves: {
      enable: false, // Water ripple effect (cool but costly). Keep off for performance.
      performanceMode: true,
      mobileDisable: true,
    },

    // Optional “smart image API” support (disabled)
    imageApi: {
      enable: false,
      url: "", // API should return a text list: one image URL per line
    },

    homeText: {
      enable: true,
      title: "Eddie's Lab Notes", // Your main hero title

      subtitle: [
        "Computer Vision · Deep Learning · Applied Research",
        "From prototype → production (AWS, pipelines, deployment)",
      ],

      typewriter: {
        enable: true,
        speed: 70, // ms per character
        deleteSpeed: 40, // ms per character
        pauseTime: 2000, // ms pause after full line is shown
      },
    },

    credit: {
      enable: false, // Enable only if you use someone else’s artwork
      text: "",
      url: "",
    },

    navbar: {
      transparentMode: "semifull", // "semi" | "full" | "semifull"
    },
  },

  /**
   * Table of Contents settings
   */
  toc: {
    enable: true,
    mode: "sidebar", // "float" (floating button) | "sidebar"
    depth: 2, // 1..6 (h1 only -> h1+h2 -> ...)
    useJapaneseBadge: false, // Use normal numbering for a professional portfolio
  },

  showCoverInContent: true, // Show cover image inside the post page
  generateOgImages: false, // OG image generation is slow; keep off unless you really need it

  favicon: [
    // Leave empty to use default favicon, or add entries like:
    // { src: "/favicon/icon.png", theme: "light", sizes: "32x32" },
  ],

  /**
   * Fonts
   * - asciiFont is your primary font (Latin)
   * - cjkFont is fallback for Chinese/Japanese/Korean glyphs (optional)
   */
  font: {
    asciiFont: {
      fontFamily: "Inter",
      fontWeight: "400",
      localFonts: ["/assets/font/Inter-Regular.ttf"],
      enableCompress: true, // Font subsetting in production
    },
    // Keep a CJK fallback only if you *actually* publish CJK text sometimes.
    cjkFont: {
      fontFamily: "Noto Sans JP",
      fontWeight: "400",
      localFonts: ["/assets/font/NotoSansJP-Regular.ttf"],
      enableCompress: true,
    },
  },

  showLastModified: false, // Toggle “Last modified” card on posts
};
export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
  src: {
    desktop: [
      // "/assets/background/ai-bg-desktop.webp"
    ],
    mobile: [],
      //"/assets/background/ai-bg-mobile.webp"
  },

  // Same as CSS object-position
  position: "center",

  // Rotating backgrounds feel bloggy — keep it static
  carousel: {
    enable: false,
    interval: 5,
  },

  // Must remain behind all content
  zIndex: -1,

  // Lower opacity so text remains highly readable
  opacity: 0.65,

  // Slight blur improves contrast and readability
  blur: 2,
};

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,

    {
      name: "Work",
      url: "/projects/",
      icon: "material-symbols:work",
      children: [
        { name: "Projects", url: "/projects/", icon: "material-symbols:work" },
        { name: "Research", url: "/research/", icon: "material-symbols:science" },
		{ name: "Skills", url: "/skills/", icon: "material-symbols:psychology"},
        { name: "Timeline", url: "/timeline/", icon: "material-symbols:timeline" },
      ],
    },

    {
      name: "About",
      url: "/about/",
      icon: "material-symbols:person",
      children: [
        { name: "About Me", url: "/about/", icon: "material-symbols:person" },
		    { name: "Anime", url: "/anime/", icon: "material-symbols:movie" }
      ],
    },

    {
      name: "Contact",
      url: "#",
      icon: "material-symbols:alternate-email",
      children: [
        {
          name: "GitHub",
          url: "https://github.com/calibourne",
          external: true,
          icon: "fa7-brands:github",
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/your-link",
          external: true,
          icon: "fa7-brands:linkedin",
        },
        // Optional: add once you have it
        // { name: "Email", url: "mailto:you@domain.com", external: true, icon: "material-symbols:mail" },
      ],
    },
  ],
};

export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.webp", 
  // Path relative to /public if starting with "/"

  name: "Eddie Kanevsky",

  bio: "AI Engineer specializing in Computer Vision, Deep Learning, and production-grade ML systems.",

  typewriter: {
    enable: true,
    speed: 60,
  },

  links: [
    {
      name: "GitHub",
      icon: "fa7-brands:github",
      url: "https://github.com/calibourne",
    },
    {
      name: "LinkedIn",
      icon: "fa7-brands:linkedin",
      url: "https://linkedin.com/in/your-link",
    },
    // {
    //   name: "Google Scholar",
    //   icon: "academicons:google-scholar",
    //   url: "https://scholar.google.com/your-profile",
    // },
    {
      name: "Email",
      icon: "material-symbols:mail",
      url: "mailto:you@yourdomain.com",
    },
  ],
};


export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Permalink 固定链接配置
export const permalinkConfig: PermalinkConfig = {
	enable: false,
	format: "%postname%",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
//   theme: "one-dark-pro",
//   theme: "dracula",
  theme: "github-dark",
  hideDuringThemeTransition: true,
};

export const commentConfig: CommentConfig = {
  enable: false,
};

export const shareConfig: ShareConfig = {
  enable: false,
};

export const announcementConfig: AnnouncementConfig = {
	title: "", 
	content: "",
	closable: true,
	link: {
		enable: false,
		text: "Learn More",
		url: "/about/",
		external: false,
	},
};

export const musicPlayerConfig: MusicPlayerConfig = {
	enable: false,
	mode: "meting",
	meting_api: "",
	id: "",
	server: "",
	type: "",
};

export const footerConfig: FooterConfig = {
  enable: false,
};

/**
 * Sidebar layout configuration
 * Controls which sidebar widgets are shown, their order, animations, and responsive behavior.
 *
 * Notes:
 * - "left" and "right" refer to the desktop sidebars.
 * - Mobile typically does not show the right sidebar; use "drawer" for mobile navigation.
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  // Per-component settings (ordering, animation, responsive collapsing, etc.)
  properties: [
    {
      // Profile card (your identity anchor)
      type: "profile",
      // Fixed at top
      position: "top",
      // CSS class used for entry animation
      class: "onload-animation",
      // Animation delay (ms)
      animationDelay: 0,
    },

    {
      // Categories (high-signal navigation for a portfolio)
      type: "categories",
      // Sticky so it stays visible while scrolling
      position: "sticky",
      class: "onload-animation",
      animationDelay: 100,
      responsive: {
        // Auto-collapse if categories become too many
        collapseThreshold: 6,
      },
    },

    {
      // Tags (secondary navigation)
      type: "tags",
      position: "sticky",
      class: "onload-animation",
      animationDelay: 150,
      responsive: {
        collapseThreshold: 18,
      },
    },

    {
      // Site stats (optional: leave on right sidebar only)
      type: "site-stats",
      position: "top",
      class: "onload-animation",
      animationDelay: 200,
    },

    // Calendar removed: not useful for a portfolio
    // Announcement removed: you disabled it globally; don't waste space
  ],

  // Which components appear in each sidebar region
  components: {
    left: ["profile", "categories", "tags"],
    right: ["site-stats"],
    drawer: ["profile", "categories", "tags"],
  },

  // Default animation behavior
  defaultAnimation: {
    enable: true,
    baseDelay: 0,
    increment: 50,
  },

  // Responsive breakpoints (px)
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1280,
      desktop: 1280,
    },
  },
};

export const sakuraConfig: SakuraConfig = {
  enable: false, // Off by default (visual effects should not distract in a portfolio)
  sakuraNum: 14, // Keep it subtle if enabled
  limitTimes: -1, // -1 = infinite loop
  size: {
    min: 0.5, // Minimum petal size multiplier
    max: 1.0, // Maximum petal size multiplier
  },
  opacity: {
    min: 0.25, // Minimum opacity
    max: 0.7,  // Maximum opacity
  },
  speed: {
    horizontal: {
      min: -1.2, // Min horizontal drift speed
      max: -0.8, // Max horizontal drift speed
    },
    vertical: {
      min: 1.2, // Min fall speed
      max: 1.8, // Max fall speed
    },
    rotation: 0.02, // Rotation speed
    fadeSpeed: 0.02, // Fade speed (should not exceed min opacity)
  },
  zIndex: 100, // Keep it above background, below important UI if needed
};


export const pioConfig: import("./types/config").PioConfig = {
  enable: true, // Enable the assistant mascot
  models: ["/pio/models/pio/model.json"], // Default model path
  position: "left", // "left" | "right"
  width: 280,
  height: 250,
  mode: "draggable", // Allow dragging
  hiddenOnMobile: true, // Hide on mobile to avoid clutter
  dialog: {
    welcome: "Hey. Want to see Projects or Research?",

    touch: [
      "Boop detected.",
      "Careful — I'm UI, not a stress ball 😄",
      "If you break the layout, you own the bug.",
      "Click less. Read more.",
    ],

    home: "Back to home base.",

    skin: [
      "Theme switch engaged.",
      "Fresh coat of pixels applied.",
    ],

    close: "Later. Go build something cool.",

    // Point to YOUR site / repo, not the template author's repo
    link: "https://github.com/calibourne",
  },
};

// Unified export of widget configs (only active / relevant widgets)
export const widgetConfigs = {
  profile: profileConfig,
  layout: sidebarLayoutConfig,
  sakura: sakuraConfig,
  fullscreenWallpaper: fullscreenWallpaperConfig,
  pio: pioConfig,
} as const;

export const umamiConfig = {
	enabled: false, // 是否显示Umami统计
	apiKey: import.meta.env.UMAMI_API_KEY || "api_xxxxxxxx", // API密钥优先从环境变量读取，否则使用配置文件中的值
	baseUrl: "https://api.umami.is", // Umami Cloud API地址
	scripts: `
<script defer src="XXXX.XXX" data-website-id="ABCD1234"></script>
  `.trim(), // 上面填你要插入的Script,不用再去Layout中插入
} as const;
