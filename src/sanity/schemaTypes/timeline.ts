import { defineField, defineType } from 'sanity'

export const timeline = defineType({
  name: 'timeline',
  title: '연혁',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: '연도',
      type: 'number',
      validation: (rule) => rule.required().min(1945).max(2100),
    }),
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', year: 'year' },
    prepare({ title, year }) {
      return {
        title,
        subtitle: `${year}년`,
      }
    },
  },
  orderings: [
    {
      title: '연도 (최신순)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
