const fs = require('fs')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TableOfContents,
} = require('docx')

// ─── 공통 설정 ───
const COLORS = {
  navy: '1A3A5C',
  sky: '4A90D9',
  cream: 'F8F4ED',
  gold: 'C9A84C',
  orange: 'E8911A',
  olive: '6B8F47',
  white: 'FFFFFF',
  lightGray: 'F2F2F2',
  gray: '666666',
  black: '000000',
  codeBg: 'F5F5F5',
  tableBorder: 'CCCCCC',
  tableHeader: 'D5E8F0',
}

const PAGE_WIDTH = 12240
const PAGE_MARGIN = 1440
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2 // 9360

const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.tableBorder }
const borders = { top: border, bottom: border, left: border, right: border }
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 }

// ─── 헬퍼 함수 ───
const emptyLine = () => new Paragraph({ spacing: { after: 120 } })

const title = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, bold: true, font: 'Arial', size: 32, color: COLORS.navy })],
  spacing: { before: 360, after: 200 },
})

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, bold: true, font: 'Arial', size: 28, color: COLORS.navy })],
  spacing: { before: 300, after: 160 },
})

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, bold: true, font: 'Arial', size: 24, color: COLORS.sky })],
  spacing: { before: 240, after: 120 },
})

const h4 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, font: 'Arial', size: 22, color: COLORS.navy })],
  spacing: { before: 200, after: 100 },
})

const para = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: 'Arial', size: 20, color: COLORS.black, ...opts })],
  spacing: { after: 100 },
})

const boldPara = (label, value) => new Paragraph({
  children: [
    new TextRun({ text: label, bold: true, font: 'Arial', size: 20, color: COLORS.navy }),
    new TextRun({ text: value, font: 'Arial', size: 20 }),
  ],
  spacing: { after: 80 },
})

const codeLine = (text) => new Paragraph({
  children: [new TextRun({ text, font: 'Consolas', size: 18, color: '333333' })],
  shading: { fill: COLORS.codeBg, type: ShadingType.CLEAR },
  spacing: { after: 40 },
  indent: { left: 360 },
})

const bulletItem = (text, level = 0) => new Paragraph({
  numbering: { reference: 'bullets', level },
  children: [new TextRun({ text, font: 'Arial', size: 20 })],
  spacing: { after: 60 },
})

const numberItem = (text, level = 0, ref = 'numbers') => new Paragraph({
  numbering: { reference: ref, level },
  children: [new TextRun({ text, font: 'Arial', size: 20 })],
  spacing: { after: 60 },
})

// 테이블 헬퍼
const headerCell = (text, width) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  shading: { fill: COLORS.navy, type: ShadingType.CLEAR },
  margins: cellMargins,
  verticalAlign: 'center',
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, font: 'Arial', size: 18, color: COLORS.white })],
  })],
})

const dataCell = (text, width, opts = {}) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
  margins: cellMargins,
  children: [new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({ text, font: opts.mono ? 'Consolas' : 'Arial', size: 18, color: COLORS.black })],
  })],
})

const makeTable = (headers, rows, colWidths) => {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0)
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headers.map((h, i) => headerCell(h, colWidths[i])) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => dataCell(
          cell, colWidths[ci],
          { shading: ri % 2 === 1 ? COLORS.lightGray : undefined }
        )),
      })),
    ],
  })
}

// ─── 구분선 ───
const divider = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.sky, space: 1 } },
  spacing: { before: 200, after: 200 },
})

// ─── 문서 생성 ───
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 20 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: COLORS.navy },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: COLORS.navy },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: COLORS.sky },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '\u25E6', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.DECIMAL, text: '%2)', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ],
      },
      {
        reference: 'numbers2',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
      {
        reference: 'numbers3',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [
    // ═══ 표지 ═══
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'PCK \uC6F9\uC0AC\uC774\uD2B8 \uB9AC\uB274\uC5BC', font: 'Arial', size: 56, bold: true, color: COLORS.navy })],
        }),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.sky, space: 1 } },
          children: [new TextRun({ text: '\uC804\uCCB4 \uAD6C\uD604 \uACC4\uD68D\uC11C', font: 'Arial', size: 40, color: COLORS.sky })],
          spacing: { after: 400 },
        }),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544 (Pax Christi Korea)', font: 'Arial', size: 24, color: COLORS.gray })],
          spacing: { after: 120 },
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\uACF5\uC2DD \uC6F9\uC0AC\uC774\uD2B8 \uB9AC\uB274\uC5BC \uD504\uB85C\uC81D\uD2B8', font: 'Arial', size: 22, color: COLORS.gray })],
          spacing: { after: 400 },
        }),
        emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\uAE30\uC220 \uC2A4\uD0DD: Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase + Sanity.io', font: 'Arial', size: 20, color: COLORS.gray })],
          spacing: { after: 120 },
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\uCD5C\uC885 \uC218\uC815: 2026-03-20', font: 'Arial', size: 20, color: COLORS.gray })],
        }),
      ],
    },

    // ═══ 목차 ═══
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'PCK \uC6F9\uC0AC\uC774\uD2B8 \uB9AC\uB274\uC5BC \u2014 \uAD6C\uD604 \uACC4\uD68D\uC11C', font: 'Arial', size: 16, color: COLORS.gray, italics: true })],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.sky, space: 1 } },
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.tableBorder, space: 1 } },
            children: [
              new TextRun({ text: '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544  |  ', font: 'Arial', size: 16, color: COLORS.gray }),
              new TextRun({ text: 'Page ', font: 'Arial', size: 16, color: COLORS.gray }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: COLORS.gray }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '\uBAA9\uCC28', font: 'Arial', size: 36, bold: true, color: COLORS.navy })],
          spacing: { after: 400 },
        }),
        new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-3' }),
      ],
    },

    // ═══ 본문 ═══
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'PCK \uC6F9\uC0AC\uC774\uD2B8 \uB9AC\uB274\uC5BC \u2014 \uAD6C\uD604 \uACC4\uD68D\uC11C', font: 'Arial', size: 16, color: COLORS.gray, italics: true })],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.sky, space: 1 } },
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.tableBorder, space: 1 } },
            children: [
              new TextRun({ text: '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544  |  ', font: 'Arial', size: 16, color: COLORS.gray }),
              new TextRun({ text: 'Page ', font: 'Arial', size: 16, color: COLORS.gray }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: COLORS.gray }),
            ],
          })],
        }),
      },
      children: [
        // ──── 개요 ────
        title('\uAC1C\uC694'),
        para('\uD604\uC7AC \uC1FC\uD551\uBAB0 \uC194\uB8E8\uC158 \uAE30\uBC18\uC758 \uAD6C\uC2DD UI\uB97C \uD604\uB300\uC801 \uBE44\uC601\uB9AC NGO \uC0AC\uC774\uD2B8\uB85C \uC644\uC804 \uB9AC\uB274\uC5BC\uD55C\uB2E4.'),
        para('\uD3C9\uD654\xB7\uC5F0\uB300\xB7\uC601\uC131\uC758 \uC815\uCCB4\uC131\uC744 \uC2DC\uAC01\uC801\uC73C\uB85C \uD45C\uD604\uD558\uACE0, \uD6C4\uC6D0\xB7\uD68C\uC6D0\uAD00\uB9AC\xB7\uAD50\uC721\uC2E0\uCCAD\xB7\uB2E4\uAD6D\uC5B4\xB7\uC7AC\uC815 \uD22C\uBA85\uC131 \uAE30\uB2A5\uC744 \uAD6C\uD604\uD55C\uB2E4.'),
        divider(),

        // ══════════════════════════════════════
        // Phase 0
        // ══════════════════════════════════════
        title('Phase 0 \u2014 \uAC1C\uBC1C \uD658\uACBD \uBC0F \uD615\uC0C1 \uAD00\uB9AC \uC124\uC815'),

        // 0-1
        h2('0-1. Next.js 15 \uD504\uB85C\uC81D\uD2B8 \uCD08\uAE30\uD654'),
        boldPara('\uBAA9\uD45C: ', '\uD504\uB85C\uC81D\uD2B8 \uACE8\uACA9 \uC0DD\uC131 (TypeScript + App Router + Tailwind CSS + src/ \uB514\uB809\uD1A0\uB9AC)'),
        h4('\uBC29\uBC95'),
        codeLine('npx create-next-app@latest . --ts --eslint --tailwind --src-dir --app --turbopack --import-alias "@/*"'),
        h4('\uC124\uC815 \uD655\uC778'),
        bulletItem('tsconfig.json: "strict": true \uD655\uC778'),
        bulletItem('next.config.ts: \uAE30\uBCF8 \uC124\uC815 \uD655\uC778'),
        bulletItem('src/app/layout.tsx, src/app/page.tsx \uC0DD\uC131 \uD655\uC778'),
        h4('\uAC80\uC99D'),
        codeLine('npm run dev'),
        codeLine('# \u2192 localhost:3000 \uC811\uC18D \u2192 Next.js \uAE30\uBCF8 \uD398\uC774\uC9C0 \uD45C\uC2DC'),
        emptyLine(),

        // 0-2
        h2('0-2. Git \uCD08\uAE30\uD654 + .gitignore + LICENSE + .env.example'),
        boldPara('\uBAA9\uD45C: ', '\uD615\uC0C1 \uAD00\uB9AC \uAE30\uBC18 \uAD6C\uCD95'),
        h4('\uBC29\uBC95'),
        numberItem('git init', 0, 'numbers2'),
        numberItem('.gitignore \uD655\uC7A5 \u2014 \uD658\uACBD\uBCC0\uC218, Prisma, Vercel, IDE, OS \uD56D\uBAA9 \uCD94\uAC00', 0, 'numbers2'),
        numberItem('LICENSE \uD30C\uC77C \uC0DD\uC131 \u2014 MIT \uB77C\uC774\uC120\uC2A4', 0, 'numbers2'),
        numberItem('.env.example \uC791\uC131 (\uC778\uC99D, DB, Sanity, \uACB0\uC81C, \uC774\uBA54\uC77C, \uC18C\uC15C, Redis)', 0, 'numbers2'),
        numberItem('\uCD08\uAE30 \uCEE4\uBC0B', 0, 'numbers2'),
        emptyLine(),

        // 0-3
        h2('0-3. \uBE0C\uB79C\uCE58 \uC804\uB7B5 \uC218\uB9BD'),
        boldPara('\uBAA9\uD45C: ', '\uC548\uC815\uC801\uC778 \uBC30\uD3EC \uD750\uB984\uC744 \uC704\uD55C \uBE0C\uB79C\uCE58 \uADDC\uCE59 \uD655\uB9BD'),
        makeTable(
          ['\uBE0C\uB79C\uCE58', '\uC6A9\uB3C4', '\uBA38\uC9C0 \uB300\uC0C1', '\uBCF4\uD638 \uADDC\uCE59'],
          [
            ['main', '\uD504\uB85C\uB355\uC158 \uBC30\uD3EC', 'develop\uC5D0\uC11C\uB9CC \uBA38\uC9C0', 'PR \uD544\uC218, CI \uD1B5\uACFC \uD544\uC218'],
            ['develop', '\uAC1C\uBC1C \uD1B5\uD569', 'feature\uC5D0\uC11C \uBA38\uC9C0', 'PR \uD544\uC218'],
            ['feature/*', '\uAE30\uB2A5 \uAC1C\uBC1C', 'develop\uC73C\uB85C \uBA38\uC9C0', '\uC790\uC720'],
            ['hotfix/*', '\uAE34\uAE09 \uC218\uC815', 'main + develop \uB3D9\uC2DC \uBA38\uC9C0', 'PR \uD544\uC218'],
          ],
          [2000, 2200, 3000, 2160],
        ),
        emptyLine(),

        // 0-4
        h2('0-4. GitHub Actions CI \uD30C\uC774\uD504\uB77C\uC778 \uAD6C\uC131'),
        boldPara('\uBAA9\uD45C: ', 'PR \uC2DC \uC790\uB3D9 \uAC80\uC99D (lint + typecheck + build)'),
        boldPara('\uD30C\uC77C: ', '.github/workflows/ci.yml'),
        bulletItem('ubuntu-latest, Node 22'),
        bulletItem('npm ci \u2192 ESLint \u2192 TypeScript \uD0C0\uC785 \uCCB4\uD06C \u2192 Build'),
        emptyLine(),

        // 0-5
        h2('0-5. \uD504\uB85C\uC81D\uD2B8 \uAD00\uB9AC \uBB38\uC11C \uC0DD\uC131'),
        boldPara('\uBAA9\uD45C: ', '\uC9C4\uB3C4 \uAD00\uB9AC \uBC0F \uD14C\uC2A4\uD2B8 \uCD94\uC801 \uCCB4\uACC4 \uC218\uB9BD'),
        bulletItem('Docs/plan.md \u2014 \uC804\uCCB4 \uAD6C\uD604 \uACC4\uD68D'),
        bulletItem('Docs/check.md \u2014 \uC9C4\uB3C4 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8'),
        bulletItem('Docs/test.md \u2014 \uD14C\uC2A4\uD2B8 \uC804\uB7B5 \uBC0F \uAC80\uC99D \uC808\uCC28'),
        emptyLine(),

        // 0-6
        h2('0-6. CLAUDE.md \uD504\uB85C\uC81D\uD2B8 \uC9C0\uCE68'),
        boldPara('\uBAA9\uD45C: ', 'AI \uD398\uC5B4 \uD504\uB85C\uADF8\uB798\uBC0D \uC2DC \uC77C\uAD00\uB41C \uCF54\uB4DC \uC2A4\uD0C0\uC77C\uACFC \uD504\uB85C\uC81D\uD2B8 \uB9E5\uB77D \uC81C\uACF5'),
        bulletItem('\uD504\uB85C\uC81D\uD2B8 \uAC1C\uC694, \uAE30\uC220 \uC2A4\uD0DD \uC694\uC57D'),
        bulletItem('\uCF54\uB4DC \uC2A4\uD0C0\uC77C \uAC00\uC774\uB4DC (PascalCase, camelCase, SCREAMING_SNAKE_CASE)'),
        bulletItem('\uB514\uB809\uD1A0\uB9AC \uAD6C\uC870 \uBC0F \uC790\uC8FC \uC0AC\uC6A9 \uBA85\uB839\uC5B4'),
        emptyLine(),

        // 0-7
        h2('0-7. ESLint + Prettier \uD1B5\uD569'),
        boldPara('\uBAA9\uD45C: ', '\uCF54\uB4DC \uD3EC\uB9F7 \uC77C\uAD00\uC131 + \uB9B0\uD2B8 \uADDC\uCE59 \uC790\uB3D9 \uC801\uC6A9'),
        codeLine('npm install -D prettier eslint-config-prettier'),
        bulletItem('\uC138\uBBF8\uCF5C\uB860 \uC5C6\uC74C, \uC791\uC740 \uB530\uC634\uD45C, \uD0ED \uB108\uBE44 2, trailing comma: es5'),
        emptyLine(),

        // Phase 0 체크포인트
        h2('Phase 0 \uC644\uB8CC \uCCB4\uD06C\uD3EC\uC778\uD2B8'),
        makeTable(
          ['\uAC80\uC99D \uD56D\uBAA9', '\uBA85\uB839\uC5B4', '\uAE30\uB300 \uACB0\uACFC'],
          [
            ['ESLint \uD1B5\uACFC', 'npm run lint', '\uC5D0\uB7EC 0\uAC74'],
            ['TypeScript \uD0C0\uC785 \uCCB4\uD06C', 'npx tsc --noEmit', '\uC5D0\uB7EC 0\uAC74'],
            ['\uBE4C\uB4DC \uC131\uACF5', 'npm run build', 'exit code 0'],
            ['\uAC1C\uBC1C \uC11C\uBC84', 'npm run dev', 'localhost:3000 \uC815\uC0C1'],
            ['Prettier \uD3EC\uB9F7', 'npx prettier --check .', '\uD3EC\uB9F7 \uC77C\uCE58'],
            ['Git \uBE0C\uB79C\uCE58', 'git branch', 'main, develop \uC874\uC7AC'],
          ],
          [2500, 3860, 3000],
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════
        // Phase 1
        // ══════════════════════════════════════
        title('Phase 1 \u2014 \uAE30\uBC18 \uC124\uC815'),

        // 1-1
        h2('1-1. Tailwind CSS v4 \uB514\uC790\uC778 \uD1A0\uD070 \uC124\uC815'),
        boldPara('\uBAA9\uD45C: ', 'PCK \uBE0C\uB79C\uB4DC \uCEEC\uB7EC \uC2DC\uC2A4\uD15C\uC744 CSS Variables + Tailwind\uB85C \uAD6C\uCD95'),
        h4('\uB514\uC790\uC778 \uD1A0\uD070 (\uCEEC\uB7EC)'),
        makeTable(
          ['\uD1A0\uD070\uBA85', '\uCF54\uB4DC', '\uC6A9\uB3C4'],
          [
            ['peace-navy', '#1A3A5C', '\uC8FC\uC694 \uD14D\uC2A4\uD2B8, \uD5E4\uB354 \uBC30\uACBD'],
            ['peace-sky', '#4A90D9', '\uB9C1\uD06C, \uAC15\uC870'],
            ['peace-olive', '#6B8F47', '\uC131\uACF5, \uAE0D\uC815'],
            ['peace-cream', '#F8F4ED', '\uC139\uC158 \uBC30\uACBD'],
            ['peace-gold', '#C9A84C', '\uAC15\uC870 \uBC43\uC9C0'],
            ['peace-orange', '#E8911A', '\uD6C4\uC6D0 CTA \uBC84\uD2BC'],
          ],
          [2500, 2430, 4430],
        ),
        emptyLine(),
        bulletItem('\uAE30\uBCF8 \uD3F0\uD2B8: Noto Sans KR (\uD55C\uAE00) + Inter (\uC601\uBB38)'),
        bulletItem('\uCD5C\uC18C \uD3F0\uD2B8 \uD06C\uAE30: 16px (\uC811\uADFC\uC131)'),
        bulletItem('\uB2E4\uD06C\uBAA8\uB4DC CSS Variables \uB300\uC751'),
        emptyLine(),

        // 1-2
        h2('1-2. shadcn/ui \uC124\uCE58 + \uCD08\uAE30 \uCEF4\uD3EC\uB10C\uD2B8'),
        boldPara('\uBAA9\uD45C: ', '\uC7AC\uC0AC\uC6A9 \uAC00\uB2A5\uD55C UI \uCEF4\uD3EC\uB10C\uD2B8 \uAE30\uBC18 \uAD6C\uCD95'),
        codeLine('npx shadcn@latest init'),
        h4('\uCD08\uAE30 \uC124\uCE58 \uCEF4\uD3EC\uB10C\uD2B8'),
        para('Button, Card, Badge, Input, Dialog, Tabs, Sheet, Dropdown-menu, Separator, Avatar, Skeleton, Toast'),
        emptyLine(),

        // 1-3
        h2('1-3. Prisma + Supabase \uC5F0\uACB0 + \uC2A4\uD0A4\uB9C8'),
        boldPara('\uBAA9\uD45C: ', '\uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uBAA8\uB378\uB9C1 \uBC0F ORM \uC5F0\uACB0'),
        h4('\uBAA8\uB378 \uBAA9\uB85D'),
        makeTable(
          ['\uBAA8\uB378', '\uC6A9\uB3C4'],
          [
            ['User', '\uD68C\uC6D0 (\uC774\uBA54\uC77C, \uC774\uB984, \uC5ED\uD560, \uCE74\uCE74\uC624ID)'],
            ['Account / Session / VerificationToken', 'NextAuth \uACC4\uC815 \uC5F0\uB3D9 / \uC138\uC158 / \uC778\uC99D'],
            ['Donation', '\uD6C4\uC6D0 \uB0B4\uC5ED (\uAE08\uC561, \uC720\uD615, \uC0C1\uD0DC)'],
            ['Expense', '\uC81C\uACBD\uBE44 \uC0AC\uC6A9\uB0B4\uC5ED (\uB0A0\uC9DC, \uD56D\uBAA9, \uCE74\uD14C\uACE0\uB9AC, \uAE08\uC561)'],
            ['BudgetItem', '\uC608\uC0B0 \uD56D\uBAA9 (\uC5F0\uB3C4, \uCE74\uD14C\uACE0\uB9AC, \uD3B8\uC131\uC561)'],
            ['FinanceReport', '\uACB0\uC0B0 \uBCF4\uACE0\uC11C (\uC5F0\uB3C4, \uC218\uC785, \uC9C0\uCD9C, PDF)'],
            ['CommunityPost / Comment', '\uCEE4\uBBA4\uB2C8\uD2F0 \uAC8C\uC2DC\uAE00 / \uB313\uAE00'],
            ['EducationApplication', '\uAD50\uC721 \uC2E0\uCCAD'],
            ['NewsletterSubscriber', '\uB274\uC2A4\uB808\uD130 \uAD6C\uB3C5\uC790'],
          ],
          [3500, 5860],
        ),
        emptyLine(),
        h4('Enum'),
        bulletItem('Role: ADMIN, EDITOR, MEMBER'),
        bulletItem('DonationType: REGULAR, ONE_TIME'),
        bulletItem('ExpenseCategory: PERSONNEL, OFFICE, EVENT, TRANSPORT, OTHER'),
        bulletItem('BoardType: FREE, PEACE_SHARING'),
        emptyLine(),

        // 1-4
        h2('1-4. NextAuth.js v5 \uC124\uC815'),
        boldPara('\uBAA9\uD45C: ', '\uC774\uBA54\uC77C/\uBE44\uBC00\uBC88\uD638 + \uCE74\uCE74\uC624 \uC18C\uC15C \uB85C\uADF8\uC778 \uAD6C\uD604'),
        h4('Providers'),
        bulletItem('Credentials \u2014 \uC774\uBA54\uC77C/\uBE44\uBC00\uBC88\uD638 (bcryptjs \uD574\uC2F1)'),
        bulletItem('Kakao \u2014 \uCE74\uCE74\uC624 OAuth'),
        h4('\uBCF4\uD638 \uACBD\uB85C'),
        makeTable(
          ['\uACBD\uB85C', '\uAD8C\uD55C'],
          [
            ['/community/*', '\uB85C\uADF8\uC778 \uD544\uC218 (MEMBER \uC774\uC0C1)'],
            ['/admin/*', 'ADMIN \uC5ED\uD560\uB9CC'],
            ['/api/donate', '\uB85C\uADF8\uC778 \uD544\uC218'],
            ['/api/finance/*', 'ADMIN \uC5ED\uD560\uB9CC'],
          ],
          [4000, 5360],
        ),
        emptyLine(),

        // 1-5
        h2('1-5. Sanity.io v3 \uC5F0\uACB0 + \uC2A4\uD0A4\uB9C8'),
        boldPara('\uBAA9\uD45C: ', '\uB274\uC2A4/\uD65C\uB3D9 \uCF58\uD150\uCE20\uB97C \uBE44\uAC1C\uBC1C\uC790\uAC00 \uD3B8\uC9D1\uD560 \uC218 \uC788\uB294 CMS \uAD6C\uCD95'),
        h4('Sanity \uC2A4\uD0A4\uB9C8'),
        makeTable(
          ['\uC2A4\uD0A4\uB9C8', '\uC6A9\uB3C4'],
          [
            ['post', '\uB274\uC2A4/\uD65C\uB3D9 \uAC8C\uC2DC\uAE00 (\uC81C\uBAA9, \uC2AC\uB7EC\uADF8, \uCE74\uD14C\uACE0\uB9AC, \uBCF8\uBB38, \uC774\uBBF8\uC9C0)'],
            ['education', '\uD3C9\uD654\uD559\uAD50 \uAE30\uC218 \uC815\uBCF4 (\uAE30\uC218\uBA85, \uC77C\uC815, \uCEE4\uB9AC\uD050\uB7FC, \uBAA8\uC9D1 \uC0C1\uD0DC)'],
            ['teamMember', '\uC784\uC6D0\uC9C4 (\uC774\uB984, \uC5ED\uD560, \uC0AC\uC9C4, \uC18C\uAC1C)'],
            ['timeline', '\uC5F0\uD601 \uC774\uBCA4\uD2B8 (\uC5F0\uB3C4, \uC81C\uBAA9, \uC124\uBA85)'],
          ],
          [2500, 6860],
        ),
        emptyLine(),
        boldPara('ISR \uC124\uC815: ', 'revalidate: 3600 (1\uC2DC\uAC04)'),
        emptyLine(),

        // 1-6
        h2('1-6. \uCD94\uAC00 \uB77C\uC774\uBE0C\uB7EC\uB9AC \uC124\uCE58'),
        boldPara('\uBAA9\uD45C: ', 'Phase 2~3\uC5D0\uC11C \uC0AC\uC6A9\uD560 \uB77C\uC774\uBE0C\uB7EC\uB9AC \uC0AC\uC804 \uC124\uCE58'),
        makeTable(
          ['\uCE74\uD14C\uACE0\uB9AC', '\uD328\uD0A4\uC9C0'],
          [
            ['\uC0C1\uD0DC \uAD00\uB9AC', 'zustand, @tanstack/react-query'],
            ['\uD3FC + \uAC80\uC99D', 'react-hook-form, @hookform/resolvers, zod'],
            ['\uC560\uB2C8\uBA54\uC774\uC158', 'framer-motion'],
            ['\uB2E4\uAD6D\uC5B4', 'next-intl'],
            ['\uB2E4\uD06C\uBAA8\uB4DC', 'next-themes'],
            ['\uC774\uBA54\uC77C', 'resend'],
            ['Rate Limiting', '@upstash/ratelimit, @upstash/redis'],
            ['\uC9C0\uB3C4', 'react-simple-maps'],
            ['\uD14C\uC2A4\uD2B8', 'vitest, @testing-library/react, @testing-library/jest-dom, jsdom'],
          ],
          [2500, 6860],
        ),
        emptyLine(),

        // Phase 1 체크포인트
        h2('Phase 1 \uC644\uB8CC \uCCB4\uD06C\uD3EC\uC778\uD2B8'),
        makeTable(
          ['\uAC80\uC99D \uD56D\uBAA9', '\uBC29\uBC95', '\uAE30\uB300 \uACB0\uACFC'],
          [
            ['\uB514\uC790\uC778 \uD1A0\uD070', '\uBE0C\uB77C\uC6B0\uC800 DevTools CSS \uBCC0\uC218 \uD655\uC778', '6\uAC1C \uCEEC\uB7EC \uD1A0\uD070 \uC801\uC6A9'],
            ['shadcn/ui', 'Button \uCEF4\uD3EC\uB10C\uD2B8 \uB80C\uB354\uB9C1', '\uC815\uC0C1 \uD45C\uC2DC'],
            ['DB \uC5F0\uACB0', 'npx prisma db push', '\uC2A4\uD0A4\uB9C8 \uB3D9\uAE30\uD654'],
            ['\uC778\uC99D', '/api/auth/signin \uC811\uC18D', '\uB85C\uADF8\uC778 \uD3FC \uD45C\uC2DC'],
            ['Sanity', '\uD14C\uC2A4\uD2B8 GROQ \uCFFC\uB9AC', '\uB370\uC774\uD130 \uBC18\uD658'],
            ['\uBE4C\uB4DC', 'npm run build', '\uC5D0\uB7EC 0\uAC74'],
          ],
          [2500, 3860, 3000],
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════
        // Phase 2
        // ══════════════════════════════════════
        title('Phase 2 \u2014 \uD575\uC2EC \uD398\uC774\uC9C0 \uAD6C\uD604'),

        // 2-1
        h2('2-1. \uACF5\uD1B5 \uB808\uC774\uC544\uC6C3 (Header + Footer + WaveDivider)'),
        boldPara('\uBAA9\uD45C: ', '\uC804\uCCB4 \uC0AC\uC774\uD2B8\uC5D0 \uC801\uC6A9\uB418\uB294 \uACF5\uD1B5 UI \uD504\uB808\uC784 \uAD6C\uCD95'),
        makeTable(
          ['\uD30C\uC77C', '\uC124\uBA85'],
          [
            ['organisms/Header.tsx', '2\uB2E8 \uAD6C\uC870 \uD5E4\uB354 (TopBar + MainNav)'],
            ['organisms/MobileNav.tsx', '\uBAA8\uBC14\uC77C \uD584\uBC84\uAC70 \uBA54\uB274 (Sheet \uD65C\uC6A9)'],
            ['organisms/Footer.tsx', '4\uC5F4 \uD478\uD130'],
            ['atoms/WaveDivider.tsx', 'SVG \uC6E8\uC774\uBE0C \uAD6C\uBD84\uC120'],
            ['atoms/Logo.tsx', 'PCK \uB85C\uACE0 \uCEF4\uD3EC\uB10C\uD2B8'],
            ['templates/MainLayout.tsx', 'Header + children + Footer'],
          ],
          [3500, 5860],
        ),
        emptyLine(),
        h4('Header \uC0C1\uC138'),
        bulletItem('TopBar: \uC5F0\uB77D\uCC98 (\uC804\uD654, \uC774\uBA54\uC77C), SNS (\uC778\uC2A4\uD0C0, \uC720\uD29C\uBE0C, \uD398\uC774\uC2A4\uBD81), \uD55C/\uC601 \uD1A0\uAE00'),
        bulletItem('MainNav: \uB85C\uACE0 + \uBA54\uB274 + \uD6C4\uC6D0 CTA \uBC84\uD2BC'),
        bulletItem('\uBAA8\uBC14\uC77C(< 768px): \uD584\uBC84\uAC70 \uBA54\uB274, \uD6C4\uC6D0 \uBC84\uD2BC \uCD95\uC18C \uC5C6\uC774 \uB178\uCD9C'),
        bulletItem('\uC2A4\uD06C\uB864 \uC2DC: sticky, \uBC30\uACBD \uBD88\uD22C\uBA85\uB3C4 \uBCC0\uACBD'),
        emptyLine(),

        // 2-2
        h2('2-2. \uBA54\uC778 \uD648\uD398\uC774\uC9C0'),
        boldPara('\uBAA9\uD45C: ', '\uBC29\uBB38\uC790\uAC00 \uB2E8\uCCB4\uC758 \uC815\uCCB4\uC131\uACFC \uC8FC\uC694 \uD65C\uB3D9\uC744 \uD55C\uB208\uC5D0 \uD30C\uC545\uD560 \uC218 \uC788\uB294 \uB79C\uB529 \uD398\uC774\uC9C0'),
        h4('\uC139\uC158 \uAD6C\uC131'),
        makeTable(
          ['#', '\uC139\uC158', '\uCEF4\uD3EC\uB10C\uD2B8', '\uC124\uBA85'],
          [
            ['1', 'Hero', 'HeroSection.tsx', '\uD480\uC2A4\uD06C\uB9B0 \uC2AC\uB77C\uC774\uB354 + \uD0C0\uC774\uD551 \uC560\uB2C8\uBA54\uC774\uC158'],
            ['2', 'Impact', 'ImpactCounter.tsx', '4\uAC1C \uCE74\uC6B4\uD130 \uC560\uB2C8\uBA54\uC774\uC158 (useInView + rAF)'],
            ['3', '\uD6C4\uC6D0 CTA', 'DonationCTA.tsx', '\uD6C4\uC6D0 \uAE08\uC561 \uCE74\uB4DC + CTA \uBC84\uD2BC'],
            ['4', '\uCD5C\uC2E0 \uB274\uC2A4', 'LatestNews.tsx', 'Sanity \uC5F0\uB3D9 3\uAC74 \uCE74\uB4DC \uADF8\uB9AC\uB4DC'],
            ['5', '\uB274\uC2A4\uB808\uD130', 'NewsletterSection.tsx', '\uC774\uBA54\uC77C \uAD6C\uB3C5 \uD3FC \u2192 Resend API'],
          ],
          [600, 1300, 2800, 4660],
        ),
        emptyLine(),

        h4('HeroSection \uC0C1\uC138'),
        bulletItem('\uD480\uC2A4\uD06C\uB9B0(100svh) \uC2AC\uB77C\uC774\uB354 4\uC7A5 \uC790\uB3D9 \uC804\uD658 (5\uCD08 \uAC04\uACA9)'),
        bulletItem('Framer Motion AnimatePresence \uD06C\uB85C\uC2A4\uD398\uC774\uB4DC + \uC90C \uC804\uD658'),
        bulletItem('\uD0C0\uC774\uD551 \uD14D\uC2A4\uD2B8: "\uADF8\uB9AC\uC2A4\uB3C4\uC758 \uD3C9\uD654" \u2192 "Peace of Christ" \uC21C\uD658'),
        bulletItem('\uD0A4\uBCF4\uB4DC \uC88C\uC6B0 \uD654\uC0B4\uD45C + useReducedMotion \uC811\uADFC\uC131 \uB300\uC751'),
        emptyLine(),

        h4('ImpactCounter \uC0C1\uC138'),
        bulletItem('4\uAC1C \uD56D\uBAA9: \uCC3D\uB9BD 2019 / \uD68C\uC6D0 200+ / \uD65C\uB3D9 \uAD6D\uAC00 50 / \uCEA0\uD398\uC778 15+'),
        bulletItem('requestAnimationFrame \uAE30\uBC18 \uCE74\uC6B4\uD2B8\uC5C5 (2\uCD08, ease-out cubic)'),
        bulletItem('staggerChildren: 0.15 \uC21C\uCC28 \uB4F1\uC7A5'),
        emptyLine(),

        // 2-3
        h2('2-3. \uB2E8\uCCB4 \uC18C\uAC1C \uD398\uC774\uC9C0'),
        boldPara('\uBAA9\uD45C: ', '\uBE44\uC804\xB7\uBAA9\uD45C\xB7\uC8FC\uC694 \uD65C\uB3D9 \uC601\uC5ED, \uC5F0\uD601, \uC784\uC6D0\uC9C4 \uC815\uBCF4\uB97C \uC81C\uACF5\uD558\uB294 3\uAC1C \uC11C\uBE0C \uD398\uC774\uC9C0'),
        makeTable(
          ['\uD30C\uC77C', '\uC124\uBA85', '\uC11C\uBC84/\uD074\uB77C\uC774\uC5B8\uD2B8'],
          [
            ['about/layout.tsx', 'About \uC11C\uBE0C \uB124\uBE44\uAC8C\uC774\uC158 \uB808\uC774\uC544\uC6C3', '\uC11C\uBC84'],
            ['about/page.tsx', '\uBE44\uC804\xB7\uBAA9\uD45C\xB7\uC8FC\uC694 \uD65C\uB3D9 \uC601\uC5ED \uCE74\uB4DC', '\uC11C\uBC84'],
            ['about/history/page.tsx', '\uC218\uC9C1 \uD0C0\uC784\uB77C\uC778 (Sanity \uC5F0\uB3D9)', '\uC11C\uBC84 (async)'],
            ['about/team/page.tsx', '\uC784\uC6D0\uC9C4 \uD504\uB85C\uD544 \uCE74\uB4DC \uADF8\uB9AC\uB4DC (Sanity \uC5F0\uB3D9)', '\uC11C\uBC84 (async)'],
            ['molecules/TimelineItem.tsx', '\uD0C0\uC784\uB77C\uC778 \uAC1C\uBCC4 \uD56D\uBAA9', '\uC11C\uBC84'],
            ['molecules/MemberCard.tsx', '\uC784\uC6D0 \uD504\uB85C\uD544 \uCE74\uB4DC', '\uC11C\uBC84'],
          ],
          [3200, 4160, 2000],
        ),
        emptyLine(),

        // 2-4
        h2('2-4. \uB274\uC2A4/\uD65C\uB3D9 \uD398\uC774\uC9C0 (ISR)'),
        boldPara('\uBAA9\uD45C: ', 'Sanity CMS \uC5F0\uB3D9 \uB274\uC2A4 \uBAA9\uB85D/\uC0C1\uC138 \uD398\uC774\uC9C0'),
        bulletItem('ISR: revalidate: 3600 (1\uC2DC\uAC04)'),
        bulletItem('\uCE74\uD14C\uACE0\uB9AC \uD544\uD130: \uD55C\uBC18\uB3C4\uD3C9\uD654, \uAD6D\uC81C\uD65C\uB3D9, \uAD50\uC721, \uACF5\uC9C0'),
        bulletItem('\uD398\uC774\uC9C0\uB124\uC774\uC158: 12\uAC74\uC529'),
        bulletItem('\uAC80\uC0C9: \uD074\uB77C\uC774\uC5B8\uD2B8 \uC0AC\uC774\uB4DC \uD544\uD130\uB9C1'),
        bulletItem('\uB3D9\uC801 OG \uC774\uBBF8\uC9C0 \uC0DD\uC131 (@vercel/og)'),
        emptyLine(),

        // Phase 2 체크포인트
        h2('Phase 2 \uC644\uB8CC \uCCB4\uD06C\uD3EC\uC778\uD2B8'),
        makeTable(
          ['\uAC80\uC99D \uD56D\uBAA9', '\uBC29\uBC95', '\uAE30\uB300 \uACB0\uACFC'],
          [
            ['Header \uBC18\uC751\uD615', '360px~1440px \uB9AC\uC0AC\uC774\uC988', '\uBAA8\uBC14\uC77C \uD584\uBC84\uAC70, \uB370\uC2A4\uD06C\uD1B1 \uD480\uBA54\uB274'],
            ['Hero \uC2AC\uB77C\uC774\uB354', '\uBA54\uC778 \uD398\uC774\uC9C0 \uC811\uC18D', '\uC774\uBBF8\uC9C0 \uC804\uD658 + \uD0C0\uC774\uD551'],
            ['Impact Counter', '\uC2A4\uD06C\uB864 \u2192 \uCE74\uC6B4\uD130 \uC139\uC158', '\uCE74\uC6B4\uD2B8\uC5C5 \uC560\uB2C8\uBA54\uC774\uC158'],
            ['\uB274\uC2A4 \uCE74\uB4DC', 'Sanity \uB370\uC774\uD130 \uC5F0\uB3D9', '3\uAC74 \uCE74\uB4DC \uD45C\uC2DC'],
            ['\uB2E4\uD06C\uBAA8\uB4DC', '\uD14C\uB9C8 \uC804\uD658', '\uC804\uCCB4 \uCEEC\uB7EC \uC815\uC0C1 \uC804\uD658'],
            ['\uC811\uADFC\uC131', 'Lighthouse', '90+'],
          ],
          [2500, 3860, 3000],
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════
        // Phase 3
        // ══════════════════════════════════════
        title('Phase 3 \u2014 \uAE30\uB2A5 \uAD6C\uD604'),

        // 3-1
        h2('3-1. \uD6C4\uC6D0 \uC2DC\uC2A4\uD15C (\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uC5F0\uB3D9)'),
        boldPara('\uBAA9\uD45C: ', '\uC815\uAE30/\uC77C\uC2DC \uD6C4\uC6D0 \uACB0\uC81C \uC2DC\uC2A4\uD15C \uAD6C\uCD95'),
        h4('\uD6C4\uC6D0 \uD398\uC774\uC9C0 \uC0C1\uC138'),
        bulletItem('\uD0ED: \uC815\uAE30 \uD6C4\uC6D0 / \uC77C\uC2DC \uD6C4\uC6D0'),
        bulletItem('\uAE08\uC561 \uC120\uD0DD: 1\uB9CC\uC6D0, 3\uB9CC\uC6D0, 5\uB9CC\uC6D0, \uC9C1\uC811 \uC785\uB825'),
        bulletItem('\uAC1C\uC778\uC815\uBCF4 \uC785\uB825: \uC774\uB984, \uC774\uBA54\uC77C, \uC804\uD654\uBC88\uD638'),
        bulletItem('\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68 \uB3D9\uC758 \uCCB4\uD06C\uBC15\uC2A4 (\uD544\uC218)'),
        h4('API \uD50C\uB85C\uC6B0'),
        numberItem('\uD074\uB77C\uC774\uC5B8\uD2B8\uC5D0\uC11C \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 SDK\uB85C \uACB0\uC81C \uC694\uCCAD', 0, 'numbers3'),
        numberItem('\uACB0\uC81C \uC131\uACF5 \u2192 /api/donate/confirm\uC73C\uB85C paymentKey \uC804\uB2EC', 0, 'numbers3'),
        numberItem('\uC11C\uBC84\uC5D0\uC11C \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uACB0\uC81C \uC2B9\uC778 API \uD638\uCD9C', 0, 'numbers3'),
        numberItem('\uC2B9\uC778 \uC131\uACF5 \u2192 Donation \uB808\uCF54\uB4DC DB \uC800\uC7A5', 0, 'numbers3'),
        numberItem('Resend\uB85C \uAC10\uC0AC \uC774\uBA54\uC77C \uBC1C\uC1A1', 0, 'numbers3'),
        h4('\uBCF4\uC548'),
        bulletItem('TOSS_SECRET_KEY\uB294 \uC11C\uBC84 \uC0AC\uC774\uB4DC\uC5D0\uC11C\uB9CC \uC0AC\uC6A9'),
        bulletItem('Rate Limiting: 10\uD68C/\uBD84 (Upstash Redis)'),
        emptyLine(),

        // 3-2
        h2('3-2. \uC7AC\uC815 \uD22C\uBA85\uC131 \uC2DC\uC2A4\uD15C'),
        h4('\uAD00\uB9AC\uC790 \uD398\uC774\uC9C0 (ADMIN \uC804\uC6A9)'),
        makeTable(
          ['\uD398\uC774\uC9C0', '\uC124\uBA85'],
          [
            ['/admin/finance', '\uC7AC\uC815 \uAD00\uB9AC \uC885\uD569 \uD604\uD669 \uB300\uC2DC\uBCF4\uB4DC'],
            ['/admin/finance/expenses', '\uC81C\uACBD\uBE44 \uBAA9\uB85D/\uAC80\uC0C9/\uD544\uD130'],
            ['/admin/finance/expenses/new', '\uC81C\uACBD\uBE44 \uC785\uB825 \uD3FC'],
            ['/admin/finance/budget', '\uC608\uC0B0 \uD3B8\uC131/\uC9D1\uD589 \uD604\uD669'],
            ['/admin/finance/donations', '\uD6C4\uC6D0\uAE08 \uC785\uAE08 \uB0B4\uC5ED'],
            ['/admin/finance/reports', '\uACB0\uC0B0 \uBCF4\uACE0\uC11C \uC0DD\uC131/\uAD00\uB9AC'],
          ],
          [3500, 5860],
        ),
        emptyLine(),
        h4('\uACF5\uAC1C \uD398\uC774\uC9C0 (\uB85C\uADF8\uC778 \uBD88\uD544\uC694)'),
        bulletItem('/transparency \u2014 \uC5F0\uB3C4\uBCC4 \uC7AC\uC815 \uD604\uD669 \uC694\uC57D'),
        bulletItem('/transparency/[year] \u2014 \uC5F0\uB3C4\uBCC4 \uC0C1\uC138 \uBCF4\uACE0\uC11C'),
        bulletItem('\uCE74\uD14C\uACE0\uB9AC\uBCC4 \uC9C0\uCD9C \uBE44\uC728: \uB3C4\uB11B \uCC28\uD2B8 (Recharts)'),
        bulletItem('\uACB0\uC0B0 \uBCF4\uACE0\uC11C PDF \uB2E4\uC6B4\uB85C\uB4DC'),
        emptyLine(),

        // 3-3
        h2('3-3. \uD3C9\uD654\uD559\uAD50 \uAD50\uC721 \uC2E0\uCCAD'),
        boldPara('\uBAA9\uD45C: ', '\uD3C9\uD654\uD559\uAD50 \uAD50\uC721 \uC2E0\uCCAD \uD3FC + \uAD00\uB9AC \uC2DC\uC2A4\uD15C'),
        h4('\uC2E0\uCCAD \uD3FC \uD544\uB4DC'),
        bulletItem('\uC774\uB984 (\uD544\uC218, 2~50\uC790)'),
        bulletItem('\uC774\uBA54\uC77C (\uD544\uC218, \uC774\uBA54\uC77C \uD615\uC2DD)'),
        bulletItem('\uC804\uD654\uBC88\uD638 (\uD544\uC218, \uD55C\uAD6D \uC804\uD654\uBC88\uD638 \uD615\uC2DD)'),
        bulletItem('\uC18C\uC18D (\uC120\uD0DD)'),
        bulletItem('\uC9C0\uC6D0 \uB3D9\uAE30 (\uD544\uC218, 10~500\uC790)'),
        bulletItem('\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68 \uB3D9\uC758 (\uD544\uC218)'),
        h4('\uD50C\uB85C\uC6B0'),
        para('\uD3FC \uC81C\uCD9C \u2192 Zod \uD074\uB77C\uC774\uC5B8\uD2B8 \uAC80\uC99D \u2192 Server Action \uC11C\uBC84 \uC7AC\uAC80\uC99D \u2192 DB \uC800\uC7A5 \u2192 Resend \uC774\uBA54\uC77C \uBC1C\uC1A1'),
        emptyLine(),

        // 3-4
        h2('3-4. \uD68C\uC6D0 \uCEE4\uBBA4\uB2C8\uD2F0 (\uC778\uC99D + \uAC8C\uC2DC\uD310)'),
        boldPara('\uBAA9\uD45C: ', '\uD68C\uC6D0 \uC804\uC6A9 \uAC8C\uC2DC\uD310 (2\uAC1C \uBCF4\uB4DC) + \uB313\uAE00 \uC2DC\uC2A4\uD15C'),
        bulletItem('2\uAC1C \uAC8C\uC2DC\uD310: \uC790\uC720\uAC8C\uC2DC\uD310(FREE), \uD3C9\uD654 \uB098\uB214(PEACE_SHARING)'),
        bulletItem('\uBAA9\uB85D: \uC81C\uBAA9, \uC791\uC131\uC790, \uB0A0\uC9DC, \uB313\uAE00 \uC218 / \uD398\uC774\uC9C0\uB124\uC774\uC158 20\uAC74\uC529'),
        h4('\uAD8C\uD55C'),
        bulletItem('\uBE44\uB85C\uADF8\uC778 \u2192 /login\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8'),
        bulletItem('\uAE00\uC4F0\uAE30: MEMBER \uC774\uC0C1'),
        bulletItem('\uC218\uC815/\uC0AD\uC81C: \uBCF8\uC778 \uAE00\uB9CC (userId \uBE44\uAD50)'),
        emptyLine(),

        // 3-5
        h2('3-5. \uAD6D\uC81C \uB124\uD2B8\uC6CC\uD06C \uC9C0\uB3C4'),
        boldPara('\uBAA9\uD45C: ', 'react-simple-maps + TopoJSON \uC138\uACC4 \uC9C0\uB3C4\uC5D0 50\uAC1C\uAD6D \uD540 \uD45C\uC2DC'),
        bulletItem('\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0 \uAC00\uC785 50\uAC1C\uAD6D \uD540 \uD45C\uC2DC'),
        bulletItem('\uD55C\uAD6D \uD540: peace-gold \uAC15\uC870 + \uB9E5\uB3D9 \uC560\uB2C8\uBA54\uC774\uC158'),
        bulletItem('\uD540 \uD074\uB9AD \u2192 \uC9C0\uBD80 \uC815\uBCF4 \uD328\uB110'),
        bulletItem('\uBC18\uC751\uD615: \uB370\uC2A4\uD06C\uD1B1 \uD480 \uC9C0\uB3C4, \uBAA8\uBC14\uC77C \uC90C + \uC2A4\uC640\uC774\uD504'),
        emptyLine(),

        // 3-6
        h2('3-6. \uB2E4\uAD6D\uC5B4(\uD55C/\uC601) \uC801\uC6A9'),
        boldPara('\uBAA9\uD45C: ', 'next-intl \uAE30\uBC18 \uD55C\uAD6D\uC5B4/\uC601\uC5B4 \uB2E4\uAD6D\uC5B4 \uC9C0\uC6D0'),
        h4('\uB77C\uC6B0\uD305'),
        bulletItem('\uAE30\uBCF8 \uC5B8\uC5B4(ko): /about, /news (prefix \uC5C6\uC74C)'),
        bulletItem('\uC601\uC5B4: /en/about, /en/news'),
        bulletItem('\uC5B8\uC5B4 \uC804\uD658: Header \uC6B0\uCE21 \uD1A0\uAE00 \uBC84\uD2BC (KO | EN)'),
        emptyLine(),

        // Phase 3 체크포인트
        h2('Phase 3 \uC644\uB8CC \uCCB4\uD06C\uD3EC\uC778\uD2B8'),
        makeTable(
          ['\uAC80\uC99D \uD56D\uBAA9', '\uBC29\uBC95', '\uAE30\uB300 \uACB0\uACFC'],
          [
            ['\uD6C4\uC6D0 \uACB0\uC81C', '\uD1A0\uC2A4 \uD14C\uC2A4\uD2B8 \uD0A4\uB85C \uACB0\uC81C', '\uC131\uACF5 \u2192 DB \uC800\uC7A5'],
            ['\uAC10\uC0AC \uC774\uBA54\uC77C', '\uD6C4\uC6D0 \uC644\uB8CC \uD6C4', 'Resend \uBC1C\uC1A1 \uD655\uC778'],
            ['ADMIN \uAD8C\uD55C', '\uC77C\uBC18 \uD68C\uC6D0 \u2192 /admin', '\uC811\uADFC \uAC70\uBD80'],
            ['\uC7AC\uC815 CRUD', '\uC81C\uACBD\uBE44 \uC785\uB825/\uC218\uC815/\uC0AD\uC81C', 'DB \uBC18\uC601'],
            ['\uAD50\uC721 \uC2E0\uCCAD', '\uD3FC \uC81C\uCD9C', 'DB \uC800\uC7A5 + \uC774\uBA54\uC77C'],
            ['\uCEE4\uBBA4\uB2C8\uD2F0 \uC778\uC99D', '\uBE44\uB85C\uADF8\uC778 \u2192 /community', '\uB9AC\uB2E4\uC774\uB809\uD2B8'],
            ['\uB124\uD2B8\uC6CC\uD06C \uC9C0\uB3C4', '/network', '50\uAC1C\uAD6D \uD540 \uD45C\uC2DC'],
            ['\uB2E4\uAD6D\uC5B4', '\uD5E4\uB354 \uD1A0\uAE00', '\uD55C/\uC601 \uC804\uD658'],
            ['Rate Limiting', '\uB85C\uADF8\uC778 6\uD68C \uC2DC\uB3C4', '429 \uC751\uB2F5'],
          ],
          [2500, 3860, 3000],
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════
        // Phase 4
        // ══════════════════════════════════════
        title('Phase 4 \u2014 \uB9C8\uBB34\uB9AC \uBC0F \uBC30\uD3EC'),

        // 4-1
        h2('4-1. SEO \uCD5C\uC801\uD654'),
        bulletItem('\uB3D9\uC801 \uC0AC\uC774\uD2B8\uB9F5 (\uC815\uC801 + Sanity \uB3D9\uC801 URL)'),
        bulletItem('robots.txt (\uD06C\uB864\uB9C1 \uADDC\uCE59)'),
        bulletItem('\uB3D9\uC801 OG \uC774\uBBF8\uC9C0 (@vercel/og)'),
        bulletItem('\uBAA8\uB4E0 \uD398\uC774\uC9C0 generateMetadata \uD568\uC218'),
        bulletItem('\uAD6C\uC870\uD654 \uB370\uC774\uD130 (JSON-LD): Organization, WebSite'),
        emptyLine(),

        // 4-2
        h2('4-2. \uC131\uB2A5 \uCD5C\uC801\uD654'),
        bulletItem('next/image: \uBAA8\uB4E0 \uC774\uBBF8\uC9C0 lazy loading, sizes \uC18D\uC131'),
        bulletItem('dynamic import: PeaceMap, \uCC28\uD2B8 \uCF54\uB4DC \uC2A4\uD50C\uB9AC\uD305'),
        bulletItem('\uBC88\uB4E4 \uBD84\uC11D: @next/bundle-analyzer'),
        bulletItem('\uD3F0\uD2B8: next/font/google'),
        h4('Core Web Vitals \uBAA9\uD45C'),
        makeTable(
          ['\uC9C0\uD45C', '\uBAA9\uD45C\uAC12'],
          [
            ['LCP (Largest Contentful Paint)', '< 2.5\uCD08'],
            ['FID (First Input Delay)', '< 100ms'],
            ['CLS (Cumulative Layout Shift)', '< 0.1'],
          ],
          [5500, 3860],
        ),
        emptyLine(),

        // 4-3
        h2('4-3. \uC804\uCCB4 \uD14C\uC2A4\uD2B8 \uC2E4\uD589'),
        boldPara('\uCEE4\uBC84\uB9AC\uC9C0 \uBAA9\uD45C: ', '\uD575\uC2EC \uBE44\uC988\uB2C8\uC2A4 \uB85C\uC9C1 70%+'),
        h4('\uD575\uC2EC \uD14C\uC2A4\uD2B8 \uD56D\uBAA9'),
        bulletItem('Zod \uC2A4\uD0A4\uB9C8 \uC720\uD6A8\uC131 (\uD6C4\uC6D0, \uAD50\uC721 \uC2E0\uCCAD, \uAC8C\uC2DC\uAE00)'),
        bulletItem('Zustand \uC2A4\uD1A0\uC5B4 (\uC5B8\uC5B4, \uB2E4\uD06C\uBAA8\uB4DC, \uC778\uC99D)'),
        bulletItem('\uD6C4\uC6D0 \uD3FC \uC81C\uCD9C \uD50C\uB85C\uC6B0'),
        bulletItem('\uB85C\uADF8\uC778/\uD68C\uC6D0\uAC00\uC785 \uD50C\uB85C\uC6B0'),
        bulletItem('\uAD8C\uD55C \uCCB4\uD06C (ADMIN only \uACBD\uB85C)'),
        emptyLine(),

        // 4-4
        h2('4-4. CI/CD \uCD5C\uC885 \uAC80\uC99D'),
        numberItem('feature \uBE0C\uB79C\uCE58\uC5D0\uC11C develop\uC73C\uB85C PR \uC0DD\uC131'),
        numberItem('GitHub Actions CI \uC790\uB3D9 \uC2E4\uD589 \uD655\uC778 (lint + typecheck + build)'),
        numberItem('CI \uD1B5\uACFC \uD6C4 develop \uBA38\uC9C0'),
        numberItem('develop \u2192 main PR \uC0DD\uC131'),
        numberItem('CI \uD1B5\uACFC + Vercel Preview \uBC30\uD3EC \uD655\uC778'),
        numberItem('main \uBA38\uC9C0 \u2192 Vercel \uD504\uB85C\uB355\uC158 \uC790\uB3D9 \uBC30\uD3EC'),
        emptyLine(),

        // 4-5
        h2('4-5. \uD504\uB85C\uB355\uC158 \uBC30\uD3EC'),
        numberItem('Vercel \uD504\uB85C\uC81D\uD2B8 \uC124\uC815 (Framework: Next.js, \uD658\uACBD\uBCC0\uC218 \uC124\uC815)'),
        numberItem('\uCEE4\uC2A4\uD140 \uB3C4\uBA54\uC778 \uC5F0\uACB0'),
        numberItem('SSL \uC778\uC99D\uC11C \uC790\uB3D9 \uBC1C\uAE09 (Vercel \uC81C\uACF5)'),
        numberItem('\uCD5C\uC885 \uC810\uAC80: \uBAA8\uB4E0 \uD398\uC774\uC9C0 \uC811\uC18D + \uAE30\uB2A5 \uB3D9\uC791 \uD655\uC778'),
        emptyLine(),

        // Phase 4 체크포인트
        h2('Phase 4 \uC644\uB8CC \uCCB4\uD06C\uD3EC\uC778\uD2B8'),
        makeTable(
          ['\uAC80\uC99D \uD56D\uBAA9', '\uBC29\uBC95', '\uAE30\uB300 \uACB0\uACFC'],
          [
            ['sitemap.xml', '/sitemap.xml \uC811\uC18D', '\uC804\uCCB4 URL \uBAA9\uB85D'],
            ['robots.txt', '/robots.txt \uC811\uC18D', '\uD06C\uB864\uB9C1 \uADDC\uCE59'],
            ['OG \uC774\uBBF8\uC9C0', 'SNS \uACF5\uC720', '\uBBF8\uB9AC\uBCF4\uAE30 \uD45C\uC2DC'],
            ['Lighthouse \uC131\uB2A5', 'Lighthouse \uC2E4\uD589', 'Performance 90+'],
            ['Core Web Vitals', 'LCP, CLS \uCE21\uC815', '\uAE30\uC900 \uCDA9\uC871'],
            ['\uD14C\uC2A4\uD2B8 \uCEE4\uBC84\uB9AC\uC9C0', 'npm test -- --coverage', '70%+'],
            ['CI \uD30C\uC774\uD504\uB77C\uC778', 'PR \uC0DD\uC131 \u2192 CI \uC2E4\uD589', '\uC804\uCCB4 \uD1B5\uACFC'],
            ['\uD504\uB85C\uB355\uC158 \uBE4C\uB4DC', 'npm run build', '\uC5D0\uB7EC 0\uAC74'],
            ['SSL', 'HTTPS \uC811\uC18D', '\uC720\uD6A8\uD55C \uC778\uC99D\uC11C'],
          ],
          [2500, 3860, 3000],
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════
        // 외부 작업 목록
        // ══════════════════════════════════════
        title('\uC678\uBD80 \uC791\uC5C5 \uBAA9\uB85D (\uC218\uB3D9 \uCC98\uB9AC \uD544\uC694)'),

        makeTable(
          ['\uC791\uC5C5', '\uC2DC\uC810', '\uBE44\uACE0'],
          [
            ['GitHub \uB9AC\uD3EC\uC9C0\uD1A0\uB9AC \uC0DD\uC131', 'Phase 0 \uC774\uD6C4', '\uC218\uB3D9 \uC0DD\uC131, remote \uC5F0\uACB0'],
            ['Supabase \uD504\uB85C\uC81D\uD2B8 \uC0DD\uC131', 'Phase 1-3 \uC804', 'DATABASE_URL \uD655\uBCF4'],
            ['Sanity.io \uD504\uB85C\uC81D\uD2B8 \uC0DD\uC131', 'Phase 1-5 \uC804', 'PROJECT_ID \uD655\uBCF4'],
            ['\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uAC00\uB9F9\uC810 \uB4F1\uB85D', 'Phase 3-1 \uC804', '\uD14C\uC2A4\uD2B8\uD0A4/\uC2E4\uC81C\uD0A4 \uD655\uBCF4'],
            ['\uCE74\uCE74\uC624 \uAC1C\uBC1C\uC790 \uC571 \uB4F1\uB85D', 'Phase 1-4 \uC804', 'CLIENT_ID/SECRET \uD655\uBCF4'],
            ['Upstash Redis \uC0DD\uC131', 'Phase 3-1 \uC804', 'REST_URL/TOKEN \uD655\uBCF4'],
            ['Resend \uACC4\uC815 \uC0DD\uC131', 'Phase 3-1 \uC804', 'API_KEY \uD655\uBCF4'],
            ['Vercel \uD504\uB85C\uC81D\uD2B8 \uC5F0\uACB0', 'Phase 4-5 \uC804', 'GitHub \uC5F0\uB3D9'],
            ['\uB3C4\uBA54\uC778 \uAD6C\uB9E4/\uC5F0\uACB0', 'Phase 4-5 \uC804', 'DNS \uC124\uC815'],
          ],
          [3200, 2400, 3760],
        ),
      ],
    },
  ],
})

// ─── 파일 출력 ───
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('Docs/\uAD6C\uD604\uACC4\uD68D\uC11C.docx', buffer)
  console.log('OK: Docs/\uAD6C\uD604\uACC4\uD68D\uC11C.docx \uC0DD\uC131 \uC644\uB8CC')
})
