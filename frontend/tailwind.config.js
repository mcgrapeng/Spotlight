/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          bg: 'hsl(var(--success-bg))',
          border: 'hsl(var(--success-border))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          bg: 'hsl(var(--warning-bg))',
          border: 'hsl(var(--warning-border))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
          bg: 'hsl(var(--error-bg))',
          border: 'hsl(var(--error-border))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          bg: 'hsl(var(--info-bg))',
          border: 'hsl(var(--info-border))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          border: 'hsl(var(--sidebar-border))',
          accent: 'hsl(var(--sidebar-accent))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        // ponytail: 圆角收成三档。
        //   sm   6px  微元素（徽章 / kbd / chip）
        //   md   8px  控件（按钮 / 输入 / 下拉 / tab）—— DEFAULT 是别名
        //   card 12px 承载面（卡片 / 面板 / 浮层）
        // 之前是四个名字三个值：rounded 和 rounded-md 同为 8px，rounded-lg
        // 是 10px，rounded-card 是 12px。代码里 26 处写 rounded、36 处写
        // rounded-md —— 写的人以为这两个值不同。现在只留 rounded-md 一个
        // 名字代表 8px。
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'var(--radius-card)',
        xl: 'var(--radius-card)',
        '2xl': 'var(--radius-card)',
        card: 'var(--radius-card)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // ponytail: 2xs 原来是 11px。全项目 76 处用到，其中大量是中文
        // （「Running 258」「1 未就绪」「最近 1h」），11px 中文字笔画粘连，
        // 且中文字面框比拉丁字母窄，视觉上比 11px 数字更糊。抬到 12px。
        '2xs': ['12px', '16px'],
        xs: ['12px', '16px'],
        sm: ['13px', '18px'],
        base: ['14px', '20px'],
        lg: ['16px', '24px'],
        xl: ['20px', '28px'],
        '2xl': ['26px', '32px'],
        '3xl': ['34px', '40px'],
        '4xl': ['44px', '48px'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        DEFAULT: '0 2px 6px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        md: '0 6px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        lg: '0 12px 24px -4px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        'gradient-rotate': {
          from: { '--gradient-angle': '0deg' },
          to: { '--gradient-angle': '360deg' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 4s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // ponytail: tailwindcss-animate 之前没装，但 DialogContent / PopoverContent /
  // SheetContent 全在用 `animate-in` / `fade-in-0` / `zoom-in-95` —— 那些类
  // 在构建产物里命中数为 0，所有浮层都是硬切。插件装上后这些类才真正存在。
  plugins: [require('tailwindcss-animate')],
}
