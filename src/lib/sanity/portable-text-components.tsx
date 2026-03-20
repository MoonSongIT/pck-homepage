import Image from 'next/image'
import type { PortableTextComponents } from '@portabletext/react'

import { urlFor } from '@/lib/sanity/image'

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold text-peace-navy dark:text-peace-cream">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-peace-navy dark:text-peace-cream">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-peace-navy dark:text-peace-cream">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-peace-sky pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http')
      return (
        <a
          href={value?.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-peace-sky underline decoration-peace-sky/30 underline-offset-2 transition-colors hover:text-peace-sky/80 hover:decoration-peace-sky/60"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).auto('format').quality(85).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed text-foreground/90">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed text-foreground/90">{children}</li>
    ),
  },
}
