import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

// ponytail: 按钮加 active:scale-[0.98] + transition 让触摸/点击有触觉反馈 (Audit §1.4)
export const buttonVariants = cva(
  // ponytail: 时长走 --dur-fast (120ms)，曲线走 --ease。
  // 之前 transition-all 没有 duration，落回 Tailwind 默认的 150ms ——
  // 按压反馈比应该的慢，而且 transition-all 会连 box-shadow 一起过渡。
  // 只过渡真正会变的属性：颜色、边框、transform。
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,transform] ease-app dur-fast active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ponytail: 禁用态的主按钮之前是黑色降透明度 50% —— 那是一块中灰
        // 实心按钮，读者分不清它和普通按钮的区别。禁用改成中性表面色，
        // 「按不了」这件事用形状说，不靠亮度。
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // ponytail: 高度收成三档。之前是 24 / 28 / 36 / 40 / 44 五种，其中
      // 28 是 LogViewer 工具栏用 class="h-7 px-2" 硬改出来的，44 的 lg
      // 全站没有一处调用。最小的 24px 太靠近触摸下限，最常用的密集控件
      // 又已经在 28px 上调校过，所以档位定在 28 / 36 / 40。
      size: {
        "xs": "h-7 rounded px-2",
        "sm": "h-9 rounded-md px-3",
        "default": "h-10 rounded-md px-4 py-2",
        "icon": "h-10 w-10",
        "icon-sm": "size-9",
        "icon-xs": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
