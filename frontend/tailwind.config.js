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
        // ponytail: 2xs 这个档位没了。
        //
        // 它原来是 11px，全项目 76 处用到，其中大量是中文（「Running
        // 258」「1 未就绪」「最近 1h」）—— 11px 中文字笔画粘连，抬到了
        // 12px。抬完之后它和 xs 一模一样：两个名字，一个尺寸。
        //
        // 一个尺寸两个名字，代价是每个读到 `text-2xs` 的人都要查一次
        // tailwind.config.js 才知道它多大 —— 而答案总是「跟 xs 一样」。
        // 于是全项目 70 处改成 text-xs，配置里删掉这一档。改的是名字，
        // 不是像素：两档都是 12px/16px，渲染结果一个像素都不动。
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
        // ponytail: 新到的 ERROR 行闪一次。这条方向文档承诺过
        // （「动效只在数据到达时发生」），但一直没实现 —— SSE 推来一条新
        // 错误，它和历史行长得一模一样，读者不知道自己错过了什么。
        // 用 error 的背景色闪一下，400ms 后回到透明。
        'log-flash': {
          from: { backgroundColor: 'hsl(var(--error) / 0.25)' },
          to: { backgroundColor: 'transparent' },
        },
        // ponytail: 数字变了的时候，它自己动一下。
        //
        // 仪表盘每分钟刷新一次，刷新完 21,320 变成 3,200 —— 48px 的主位
        // 数字直接换掉，没有任何动静。凌晨三点盯着这块屏的人很可能根本
        // 没注意到数字变了，于是以为「还是 21,320」。
        //
        // 200ms 的淡入 + 2px 上移，不做滚动计数（夜里看数字滚很吵）。
        'value-in': {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'none' },
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
        'log-flash': 'log-flash 400ms var(--ease)',
        'value-in': 'value-in 200ms var(--ease)',
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
