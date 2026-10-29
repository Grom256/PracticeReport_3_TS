import type { PageBlock } from '../types.ts'

export function renderTextBlock(block: PageBlock): string {
  const anchor = block.anchor || ''
  const badge = block.badge || 'ІНФОРМАЦІЯ'
  const title = block.title || 'Інформаційна сторінка'
  const subtitle = block.subtitle || ''
  const content = block.content || ''
  const highlightBox = block.highlightBox || ''

  const paragraphs = content
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean)

  const contentHtml = paragraphs
    .map((para: string) => {
      if (para.startsWith('- ') || para.startsWith('• ')) {
        const items = para
          .split('\n')
          .map((line: string) => line.replace(/^[-•]\s*/, '').trim())
          .filter(Boolean)
          .map((item: string) => `<li class="content-list-item">${item}</li>`)
          .join('')
        return `<ul class="content-list">${items}</ul>`
      }
      return `<p class="content-paragraph">${para.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')

  const highlightHtml = highlightBox
    ? `
      <div class="content-highlight-box">
        <div class="content-highlight-text">
          ${highlightBox.replace(/\n/g, '<br/>')}
        </div>
      </div>
    `
    : ''

  return `
    <section class="content-page-section"${anchor ? ` id="${anchor}"` : ''}>
      <div class="content-page-container">
        <div class="content-page-header">
          <div class="section-label">${badge}</div>
          <h2 class="content-page-title">${title}</h2>
          ${subtitle ? `<p class="content-page-subtitle">${subtitle}</p>` : ''}
        </div>

        <div class="content-page-body">
          ${contentHtml}
          ${highlightHtml}
        </div>
      </div>
    </section>
  `
}
