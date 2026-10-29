import type { PageBlock } from '../types.ts'
import { renderHeroBlock } from './hero.ts'
import { renderCategoryCardsBlock } from './categoryCards.ts'
import { renderModelViewerBlock } from './modelViewer.ts'
import { renderCtaBlock } from './cta.ts'
import { renderFeaturesBlock } from './features.ts'
import { renderTextBlock } from './text.ts'
import { renderBannerBlock } from './banner.ts'

export function renderBlocks(blocks: PageBlock[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  return blocks
    .filter((block) => block.isActive !== false && block.isPublished !== false)
    .map((block) => {
      const type = block.blockType || (block as any).type

      switch (type) {
        case 'hero':
          return renderHeroBlock(block)

        case 'features':
          return renderFeaturesBlock(block)

        case 'modelViewer':
          return renderModelViewerBlock(block)

        case 'categoryCards':
          return renderCategoryCardsBlock(block)

        case 'cta':
          return renderCtaBlock(block)

        case 'text':
          return renderTextBlock(block)

        case 'banner':
          return renderBannerBlock(block)

        default:
          console.warn(`Невідомий тип блоку: ${type}`)
          return ''
      }
    })
    .join('')
}
