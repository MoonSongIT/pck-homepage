import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WaveDivider } from '../atoms/WaveDivider'

describe('WaveDivider', () => {
  it('기본 렌더링 시 aria-hidden="true"를 갖는다', () => {
    const { container } = render(<WaveDivider />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
    expect(wrapper).toHaveAttribute('role', 'presentation')
  })

  it('SVG 요소를 포함한다', () => {
    const { container } = render(<WaveDivider />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('flip 속성 적용 시 rotate-180 클래스를 갖는다', () => {
    const { container } = render(<WaveDivider flip />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rotate-180')
  })

  it('color 속성에 따라 fill 클래스가 달라진다', () => {
    const { container: c1 } = render(<WaveDivider color="cream" />)
    const svg1 = c1.querySelector('svg')!
    expect(svg1.className.baseVal).toContain('fill-peace-cream')

    const { container: c2 } = render(<WaveDivider color="sky" />)
    const svg2 = c2.querySelector('svg')!
    expect(svg2.className.baseVal).toContain('fill-peace-sky')
  })

  it('커스텀 className을 전달할 수 있다', () => {
    const { container } = render(<WaveDivider className="my-custom" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-custom')
  })
})
