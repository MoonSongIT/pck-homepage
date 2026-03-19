import { defineField, defineType } from 'sanity'

export const education = defineType({
  name: 'education',
  title: '평화학교 교육',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '교육명',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그 (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: '간략 소개',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: '상세 내용',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'startDate',
      title: '시작일',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: '종료일',
      type: 'date',
    }),
    defineField({
      name: 'isRecruiting',
      title: '모집 중',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'curriculum',
      title: '커리큘럼',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '제목',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: '설명',
              type: 'text',
            }),
            defineField({
              name: 'date',
              title: '일시',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: '대표 이미지',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '대체 텍스트',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', isRecruiting: 'isRecruiting' },
    prepare({ title, isRecruiting }) {
      return {
        title,
        subtitle: isRecruiting ? '🟢 모집 중' : '⚪ 마감',
      }
    },
  },
})
