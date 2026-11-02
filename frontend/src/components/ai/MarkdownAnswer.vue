<script setup lang="ts">
/**
 * Renders the model's answer.
 *
 * The answer is untrusted text, so it is never handed to the HTML parser:
 * this component walks the tree that @/utils/markdown produced and builds
 * elements out of it. No v-html, no sanitiser, no HTML string anywhere in
 * the path — injection is structurally impossible rather than "probably
 * fine".
 *
 * The old render was `{{ result }}` inside a `whitespace-pre-wrap` div:
 * the model's markdown came out as literal characters — `**粗体**`,
 * `- 列表`, `# 标题`. This is the product's flagship surface, and the
 * answer was the one place on it that looked like a terminal dump.
 */
import { computed, defineComponent, h, type PropType, type VNode } from 'vue'
import { parseMarkdown, type Block, type InlineNode } from '@/utils/markdown'

const props = defineProps<{ text: string }>()

const blocks = computed(() => parseMarkdown(props.text))

function renderInline(nodes: InlineNode[]): VNode[] {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return h('span', node.value)
      case 'strong':
        return h('strong', { class: 'font-semibold text-foreground' }, renderInline(node.children))
      case 'em':
        return h('em', { class: 'italic' }, renderInline(node.children))
      case 'code':
        return h('code', {
          class: 'font-mono text-[0.92em] bg-muted border border-border rounded-sm px-1 py-0.5 text-foreground',
        }, node.value)
      case 'link':
        return h('a', {
          class: 'text-info underline underline-offset-2 hover:opacity-80',
          href: node.href,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, renderInline(node.children))
    }
  })
}

/** Inline nodes, as a component so both block levels can use it. */
const Inline = defineComponent({
  name: 'MarkdownInline',
  props: { nodes: { type: Array as PropType<InlineNode[]>, required: true } },
  setup(p) {
    return () => h('span', renderInline(p.nodes))
  },
})

function renderBlock(block: Block): VNode {
  switch (block.type) {
    case 'p':
      return h('p', { class: 'mb-2 last:mb-0 whitespace-pre-line' }, [h(Inline, { nodes: block.children })])
    case 'heading':
      return h(
        block.level <= 2 ? 'h3' : 'h4',
        { class: 'font-semibold text-foreground mt-3 mb-1.5 first:mt-0' },
        [h(Inline, { nodes: block.children })],
      )
    case 'list':
      return h(
        block.ordered ? 'ol' : 'ul',
        { class: block.ordered ? 'list-decimal pl-5 space-y-1 mb-2' : 'list-disc pl-5 space-y-1 mb-2' },
        block.items.map((item) => h('li', [h(Inline, { nodes: item })])),
      )
    case 'code':
      return h('pre', {
        class: 'my-2 bg-muted border border-border rounded-md p-3 overflow-x-auto text-xs font-mono text-foreground whitespace-pre',
      }, [h('code', block.code)])
    case 'quote':
      return h('blockquote', {
        class: 'my-2 border-l-2 border-border pl-3 text-muted-foreground',
      }, [h(Inline, { nodes: block.children })])
    case 'rule':
      return h('hr', { class: 'my-3 border-border' })
  }
}

/** The whole answer. */
const Body = defineComponent({
  name: 'MarkdownBody',
  props: { blocks: { type: Array as PropType<Block[]>, required: true } },
  setup(p) {
    return () => h('div', { class: 'text-sm text-foreground' }, p.blocks.map(renderBlock))
  },
})
</script>

<template>
  <Body :blocks="blocks" />
</template>
