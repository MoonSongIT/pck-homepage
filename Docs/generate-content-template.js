const fs = require('fs')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
} = require('docx')

const border = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }
const borders = { top: border, bottom: border, left: border, right: border }
const headerShading = { fill: '1A3A5C', type: ShadingType.CLEAR }
const subHeaderShading = { fill: 'E8EEF4', type: ShadingType.CLEAR }
const lightShading = { fill: 'F8F4ED', type: ShadingType.CLEAR }
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 }

const headerRun = (text) => new TextRun({ text, bold: true, color: 'FFFFFF', font: 'Malgun Gothic', size: 20 })
const subHeaderRun = (text) => new TextRun({ text, bold: true, color: '1A3A5C', font: 'Malgun Gothic', size: 20 })
const normalRun = (text) => new TextRun({ text, font: 'Malgun Gothic', size: 20 })
const boldRun = (text) => new TextRun({ text, bold: true, font: 'Malgun Gothic', size: 20 })
const grayRun = (text) => new TextRun({ text, font: 'Malgun Gothic', size: 18, color: '888888', italics: true })
const smallRun = (text) => new TextRun({ text, font: 'Malgun Gothic', size: 18 })
const orangeRun = (text) => new TextRun({ text, bold: true, font: 'Malgun Gothic', size: 20, color: 'E8911A' })

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, shading: headerShading, margins: cellMargins,
    verticalAlign: 'center',
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [headerRun(text)] })],
  })
}

function subHeaderCell(text, width, colSpan) {
  const opts = {
    borders, width: { size: width, type: WidthType.DXA }, shading: subHeaderShading, margins: cellMargins,
    children: [new Paragraph({ children: [subHeaderRun(text)] })],
  }
  if (colSpan) opts.columnSpan = colSpan
  return new TableCell(opts)
}

function cell(children, width, colSpan) {
  const opts = {
    borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    children: Array.isArray(children) ? children : [new Paragraph({ children: [children] })],
  }
  if (colSpan) opts.columnSpan = colSpan
  return new TableCell(opts)
}

function mockCell(children, width, colSpan) {
  const opts = {
    borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins, shading: lightShading,
    children: Array.isArray(children) ? children : [new Paragraph({ children: [children] })],
  }
  if (colSpan) opts.columnSpan = colSpan
  return new TableCell(opts)
}

function emptyRow(cols, widths) {
  return new TableRow({
    children: widths.map((w) => cell([new Paragraph({ children: [normalRun('')] })], w)),
  })
}

function sectionTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, font: 'Malgun Gothic', size: 28, color: '1A3A5C' })],
  })
}

function subTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, font: 'Malgun Gothic', size: 24, color: '4A90D9' })],
  })
}

function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [grayRun(text)],
  })
}

function desc(text) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [smallRun(text)],
  })
}

function labelRow(label, currentVal, width1, width2, width3) {
  return new TableRow({ children: [
    cell(boldRun(label), width1),
    mockCell(grayRun(currentVal), width2),
    cell(normalRun(''), width3),
  ] })
}

// ============================================================
const W = 9360

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Malgun Gothic', size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Malgun Gothic' },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Malgun Gothic' },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A3A5C', space: 4 } },
            children: [new TextRun({ text: 'PCK \uD648\uD398\uC774\uC9C0 \uCF58\uD150\uCE20 \uC785\uB825 \uC591\uC2DD', font: 'Malgun Gothic', size: 16, color: '888888' })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC', space: 4 } },
            children: [
              new TextRun({ text: '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544 | ', font: 'Malgun Gothic', size: 16, color: '888888' }),
              new TextRun({ text: '\uD398\uC774\uC9C0 ', font: 'Malgun Gothic', size: 16, color: '888888' }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Malgun Gothic', size: 16, color: '888888' }),
            ],
          })],
        }),
      },
      children: [
        // ========== COVER ==========
        new Paragraph({ spacing: { before: 2400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544', font: 'Malgun Gothic', size: 44, bold: true, color: '1A3A5C' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: 'Pax Christi Korea', font: 'Malgun Gothic', size: 28, color: '4A90D9' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 600 },
          children: [new TextRun({ text: '\uD648\uD398\uC774\uC9C0 \uCF58\uD150\uCE20 \uC785\uB825 \uC591\uC2DD', font: 'Malgun Gothic', size: 36, bold: true, color: '1A3A5C' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [normalRun('\uAD00\uB9AC\uC790\uAC00 \uD648\uD398\uC774\uC9C0\uC5D0 \uCD94\uAC00\uD574\uC57C \uD560 \uCF58\uD150\uCE20\uB97C \uC815\uB9AC\uD55C \uBB38\uC11C\uC785\uB2C8\uB2E4.')],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [grayRun('\uBCA0\uC774\uC9C0\uC0C9 \uC140\uC740 \uD604\uC7AC Mock \uB370\uC774\uD130 \uCC38\uACE0\uC6A9\uC785\uB2C8\uB2E4.')],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 800 },
          children: [normalRun('\uC791\uC131\uC77C: 2026\uB144 3\uC6D4 26\uC77C')],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== TOC ==========
        sectionTitle('\uBAA9\uCC28'),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '\u2500 Part A. \uC0C1\uC2DC \uD45C\uC2DC \uC694\uC18C (\uD5E4\uB354/\uD478\uD130/\uACF5\uD1B5)', font: 'Malgun Gothic', size: 22, bold: true, color: '1A3A5C' })] }),
        desc('  1. \uC0AC\uC774\uD2B8 \uAE30\uBCF8 \uC815\uBCF4 (SEO / \uBA54\uD0C0)'),
        desc('  2. \uB85C\uACE0 \uBC0F \uD30C\uBE44\uCF58'),
        desc('  3. \uD5E4\uB354 \uB0B4\uBE44\uAC8C\uC774\uC158 \uBA54\uB274'),
        desc('  4. \uD5E4\uB354 \uC0C1\uB2E8\uBC14 (\uC5F0\uB77D\uCC98 / SNS / \uB85C\uADF8\uC778)'),
        desc('  5. \uD478\uD130 \uC815\uBCF4 (\uB2E8\uCCB4\uC815\uBCF4 / \uC5F0\uB77D\uCC98 / \uBC95\uC801 \uC815\uBCF4)'),
        desc('  6. \uD478\uD130 SNS \uB9C1\uD06C'),
        desc('  7. \uD478\uD130 \uD558\uB2E8 \uBC95\uC801 \uB9C1\uD06C (\uAC1C\uC778\uC815\uBCF4/\uC774\uC6A9\uC57D\uAD00 \uB4F1)'),
        desc('  8. \uB274\uC2A4\uB808\uD130 \uC139\uC158'),
        new Paragraph({ spacing: { before: 120, after: 100 }, children: [new TextRun({ text: '\u2500 Part B. \uD398\uC774\uC9C0\uBCC4 \uCF58\uD150\uCE20', font: 'Malgun Gothic', size: 22, bold: true, color: '1A3A5C' })] }),
        desc('  9.  \uD648 \uD788\uC5B4\uB85C \uC2AC\uB77C\uC774\uB4DC \uC774\uBBF8\uC9C0 (\uCF54\uB4DC \uC218\uC815)'),
        desc('  10. \uC131\uACFC \uD1B5\uACC4 \uC22B\uC790 (\uCF54\uB4DC \uC218\uC815)'),
        desc('  11. \uD6C4\uC6D0 \uD50C\uB79C (\uCF54\uB4DC \uC218\uC815)'),
        desc('  12. \uB2E8\uCCB4\uC18C\uAC1C > \uBE44\uC804 / \uBAA9\uD45C / \uD65C\uB3D9 \uC601\uC5ED (\uCF54\uB4DC \uC218\uC815)'),
        desc('  13. \uB2E8\uCCB4\uC18C\uAC1C > \uC5F0\uD601 (Sanity CMS)'),
        desc('  14. \uB2E8\uCCB4\uC18C\uAC1C > \uC784\uC6D0\uC9C4 (Sanity CMS)'),
        desc('  15. \uB274\uC2A4 & \uD65C\uB3D9 \uAC8C\uC2DC\uAE00 (Sanity CMS)'),
        desc('  16. \uD3C9\uD654\uD559\uAD50 \uAD50\uC721 \uD504\uB85C\uADF8\uB7A8 (Sanity CMS)'),
        desc('  17. \uC7AC\uC815 \uBCF4\uACE0\uC11C (\uAD00\uB9AC\uC790 \uD398\uC774\uC9C0)'),

        new Paragraph({ children: [new PageBreak()] }),

        // ==========================================================================
        // PART A: 상시 표시 요소
        // ==========================================================================
        new Paragraph({
          spacing: { before: 200, after: 300 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A3A5C', space: 8 } },
          children: [new TextRun({ text: 'Part A. \uC0C1\uC2DC \uD45C\uC2DC \uC694\uC18C (Header / Footer / \uACF5\uD1B5)', font: 'Malgun Gothic', size: 30, bold: true, color: '1A3A5C' })],
        }),
        note('\uBAA8\uB4E0 \uD398\uC774\uC9C0\uC5D0 \uACF5\uD1B5\uC73C\uB85C \uD45C\uC2DC\uB418\uB294 \uC694\uC18C\uB4E4\uC785\uB2C8\uB2E4. \uBCC0\uACBD \uC2DC \uCF54\uB4DC \uC218\uC815\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.'),

        // ===================================================================
        // 1. 사이트 기본 정보
        // ===================================================================
        sectionTitle('1. \uC0AC\uC774\uD2B8 \uAE30\uBCF8 \uC815\uBCF4 (SEO / \uBA54\uD0C0)'),
        desc('\uAD00\uB9AC: \uCF54\uB4DC \uC218\uC815 \uD544\uC694 | \uD30C\uC77C: src/app/[locale]/layout.tsx'),
        note('\uAC80\uC0C9\uC5D4\uC9C4\uACFC \uBE0C\uB77C\uC6B0\uC800 \uD0ED\uC5D0 \uD45C\uC2DC\uB418\uB294 \uC815\uBCF4\uC785\uB2C8\uB2E4.'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2200, 3580, 3580],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2200),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 3580),
              headerCell('\uC218\uC815 \uAC12', 3580),
            ] }),
            labelRow('\uC0AC\uC774\uD2B8 \uC81C\uBAA9 \uD15C\uD50C\uB9BF', '{page} | \uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544', 2200, 3580, 3580),
            labelRow('\uC0AC\uC774\uD2B8 \uC124\uBA85 (Description)', '\uADF8\uB9AC\uC2A4\uB3C4\uC758 \uD3C9\uD654 \u2014 \uAC00\uD1A8\uB9AD \uAD6D\uC81C \uD3C9\uD654 \uC6B4\uB3D9 \uD55C\uAD6D \uC9C0\uBD80. \uBCF5\uC74C\uC801 \uBE44\uD3ED\uB825\uACFC \uC815\uC758\u00B7\uD3C9\uD654\u00B7\uCC3D\uC870\uC9C8\uC11C \uBCF4\uC804\uC744 \uC2E4\uCC9C\uD569\uB2C8\uB2E4.', 2200, 3580, 3580),
            labelRow('\uD30C\uBE44\uCF58 (Favicon)', '/favicon.ico', 2200, 3580, 3580),
            labelRow('OG \uC774\uBBF8\uC9C0', '/api/og (\uC790\uB3D9 \uC0DD\uC131)', 2200, 3580, 3580),
          ],
        }),

        // ===================================================================
        // 2. 로고
        // ===================================================================
        sectionTitle('2. \uB85C\uACE0 \uBC0F \uD30C\uBE44\uCF58'),
        desc('\uC704\uCE58: \uD5E4\uB354 + \uD478\uD130 + \uBAA8\uBC14\uC77C \uBA54\uB274 | \uD30C\uC77C: public/images/'),
        note('\uB85C\uACE0 \uBCC0\uACBD \uC2DC \uC544\uB798 3\uAC1C \uD30C\uC77C\uC744 \uBAA8\uB450 \uAD50\uCCB4\uD574\uC57C \uD569\uB2C8\uB2E4.'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2500, 2430, 2430, 2000],
          rows: [
            new TableRow({ children: [
              headerCell('\uC6A9\uB3C4', 2500),
              headerCell('\uD604\uC7AC \uD30C\uC77C\uBA85', 2430),
              headerCell('\uC0AC\uC6A9 \uC704\uCE58', 2430),
              headerCell('\uAD50\uCCB4 \uD30C\uC77C', 2000),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uAE30\uBCF8 \uB85C\uACE0 (\uBC00\uC0C9)'), 2500),
              mockCell(grayRun('/images/logo.svg'), 2430),
              mockCell(grayRun('\uD5E4\uB354, \uBAA8\uBC14\uC77C \uBA54\uB274'), 2430),
              cell(normalRun(''), 2000),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD770\uC0C9 \uB85C\uACE0 (\uC5B4\uB450\uC6B4 \uBC30\uACBD\uC6A9)'), 2500),
              mockCell(grayRun('/images/logo-white.svg'), 2430),
              mockCell(grayRun('\uD478\uD130'), 2430),
              cell(normalRun(''), 2000),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD30C\uBE44\uCF58'), 2500),
              mockCell(grayRun('/favicon.ico'), 2430),
              mockCell(grayRun('\uBE0C\uB77C\uC6B0\uC800 \uD0ED'), 2430),
              cell(normalRun(''), 2000),
            ] }),
          ],
        }),
        note('\uB85C\uACE0 \uB300\uCCB4 \uD14D\uC2A4\uD2B8(alt): "\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544 \uB85C\uACE0"'),

        // ===================================================================
        // 3. 헤더 네비게이션 메뉴
        // ===================================================================
        sectionTitle('3. \uD5E4\uB354 \uB0B4\uBE44\uAC8C\uC774\uC158 \uBA54\uB274'),
        desc('\uC704\uCE58: \uBAA8\uB4E0 \uD398\uC774\uC9C0 \uC0C1\uB2E8 | \uD30C\uC77C: src/lib/constants/navigation.ts, src/i18n/messages/'),
        note('\uBA54\uB274 \uD56D\uBAA9 \uCD94\uAC00/\uC0AD\uC81C/\uC21C\uC11C \uBCC0\uACBD \uC2DC \uCF54\uB4DC \uC218\uC815\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [800, 1800, 1800, 2480, 2480],
          rows: [
            new TableRow({ children: [
              headerCell('\uC21C\uC11C', 800),
              headerCell('\uD55C\uAD6D\uC5B4 \uBA54\uB274\uBA85', 1800),
              headerCell('\uC601\uC5B4 \uBA54\uB274\uBA85', 1800),
              headerCell('\uB9C1\uD06C \uACBD\uB85C', 2480),
              headerCell('\uBE44\uACE0', 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('1'), 800),
              mockCell(grayRun('\uB2E8\uCCB4\uC18C\uAC1C'), 1800),
              mockCell(grayRun('About'), 1800),
              mockCell(grayRun('/about'), 2480),
              mockCell(grayRun(''), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2'), 800),
              mockCell(grayRun('\uD65C\uB3D9'), 1800),
              mockCell(grayRun('Activities'), 1800),
              mockCell(grayRun('/activities'), 2480),
              mockCell(grayRun('/news?category=activity \uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8'), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('3'), 800),
              mockCell(grayRun('\uAD50\uC721'), 1800),
              mockCell(grayRun('Education'), 1800),
              mockCell(grayRun('/education'), 2480),
              mockCell(grayRun(''), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('4'), 800),
              mockCell(grayRun('\uB274\uC2A4'), 1800),
              mockCell(grayRun('News'), 1800),
              mockCell(grayRun('/news'), 2480),
              mockCell(grayRun(''), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('5'), 800),
              mockCell(grayRun('\uB124\uD2B8\uC6CC\uD06C'), 1800),
              mockCell(grayRun('Network'), 1800),
              mockCell(grayRun('/network'), 2480),
              mockCell(grayRun(''), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('6'), 800),
              mockCell(grayRun('\uC7AC\uC815\uACF5\uAC1C'), 1800),
              mockCell(grayRun('Finances'), 1800),
              mockCell(grayRun('/transparency'), 2480),
              mockCell(grayRun(''), 2480),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('-'), 800),
              mockCell(grayRun('\uCEE4\uBBA4\uB2C8\uD2F0'), 1800),
              mockCell(grayRun('Community'), 1800),
              mockCell(grayRun('/community'), 2480),
              mockCell(grayRun('\uB85C\uADF8\uC778 \uC0C1\uD0DC\uC5D0\uC11C\uB9CC \uD45C\uC2DC'), 2480),
            ] }),
            emptyRow(5, [800, 1800, 1800, 2480, 2480]),
            emptyRow(5, [800, 1800, 1800, 2480, 2480]),
          ],
        }),
        desc(''),
        note('\uD5E4\uB354 \uC6B0\uCE21 \uACE0\uC815 \uBC84\uD2BC: "\uD6C4\uC6D0\uD558\uAE30" (Donate) \u2192 /donate [\uC624\uB80C\uC9C0\uC0C9 \uAC15\uC870 \uBC84\uD2BC]'),

        // ===================================================================
        // 4. 헤더 상단바
        // ===================================================================
        sectionTitle('4. \uD5E4\uB354 \uC0C1\uB2E8\uBC14 (\uB370\uC2A4\uD06C\uD1B1 \uC804\uC6A9)'),
        desc('\uC704\uCE58: \uD5E4\uB354 \uCD5C\uC0C1\uB2E8 (PC\uC5D0\uC11C\uB9CC \uD45C\uC2DC) | \uD30C\uC77C: src/components/organisms/Header.tsx'),

        subTitle('4-1. \uC0C1\uB2E8\uBC14 \uC88C\uCE21 \u2014 \uC5F0\uB77D\uCC98'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2000, 3680, 3680],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2000),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 3680),
              headerCell('\uC218\uC815 \uAC12', 3680),
            ] }),
            labelRow('\uC804\uD654\uBC88\uD638', '010-9689-2027', 2000, 3680, 3680),
            labelRow('\uC774\uBA54\uC77C', 'paxchristikorea@gmail.com', 2000, 3680, 3680),
          ],
        }),

        subTitle('4-2. \uC0C1\uB2E8\uBC14 \uC6B0\uCE21 \u2014 SNS \uC544\uC774\uCF58 + \uAE30\uB2A5 \uBC84\uD2BC'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2500, 4360, 2500],
          rows: [
            new TableRow({ children: [
              headerCell('\uC694\uC18C', 2500),
              headerCell('\uD604\uC7AC \uC0C1\uD0DC', 4360),
              headerCell('\uBE44\uACE0', 2500),
            ] }),
            new TableRow({ children: [
              cell(normalRun('SNS \uC544\uC774\uCF58'), 2500),
              mockCell(grayRun('Instagram / YouTube / Facebook'), 4360),
              cell(normalRun('\u21925\uBC88 \uD478\uD130 SNS\uC640 \uB3D9\uC77C'), 2500),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD14C\uB9C8 \uD1A0\uAE00'), 2500),
              mockCell(grayRun('\uD574/\uB2EC \uC544\uC774\uCF58 (Light/Dark \uC804\uD658)'), 4360),
              cell(normalRun('\uAE30\uB2A5\uC801 \uC694\uC18C'), 2500),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uC5B8\uC5B4 \uC804\uD658'), 2500),
              mockCell(grayRun('KO | EN \uD1A0\uAE00'), 4360),
              cell(normalRun('\uAE30\uB2A5\uC801 \uC694\uC18C'), 2500),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uB85C\uADF8\uC778 \uBC84\uD2BC'), 2500),
              mockCell(grayRun('\uBE44\uB85C\uADF8\uC778: "\uB85C\uADF8\uC778" / \uB85C\uADF8\uC778: \uC0AC\uC6A9\uC790\uBA85 + "\uB85C\uADF8\uC544\uC6C3"'), 4360),
              cell(normalRun('\uAE30\uB2A5\uC801 \uC694\uC18C'), 2500),
            ] }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 5. 푸터 정보
        // ===================================================================
        sectionTitle('5. \uD478\uD130 \uC815\uBCF4'),
        desc('\uC704\uCE58: \uBAA8\uB4E0 \uD398\uC774\uC9C0 \uD558\uB2E8 | \uD30C\uC77C: src/components/organisms/Footer.tsx, src/lib/constants/navigation.ts'),
        note('\uD478\uD130 \uBC30\uACBD\uC0C9: peace-navy (#1A3A5C)'),

        subTitle('5-1. \uB2E8\uCCB4 \uC18C\uAC1C \uBB38\uAD6C (\uD478\uD130 \uC88C\uCE21)'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1500, 3930, 3930],
          rows: [
            new TableRow({ children: [
              headerCell('\uC5B8\uC5B4', 1500),
              headerCell('\uD604\uC7AC \uBB38\uAD6C (\uCC38\uACE0)', 3930),
              headerCell('\uC218\uC815 \uBB38\uAD6C', 3930),
            ] }),
            new TableRow({ children: [
              cell(boldRun('\uD55C\uAD6D\uC5B4'), 1500),
              mockCell([new Paragraph({ children: [grayRun('\uADF8\uB9AC\uC2A4\uB3C4\uC758 \uD3C9\uD654 \u2014 \uAC00\uD1A8\uB9AD \uAD6D\uC81C \uD3C9\uD654\uC6B4\uB3D9 \uD55C\uAD6D \uC9C0\uBD80. \uBE44\uD3ED\uB825\uACFC \uD3C9\uD654, \uD654\uD574\uC640 \uC5F0\uB300\uC758 \uAC00\uCE58\uB97C \uC2E4\uCC9C\uD569\uB2C8\uB2E4.')] })], 3930),
              cell(normalRun(''), 3930),
            ] }),
            new TableRow({ children: [
              cell(boldRun('\uC601\uC5B4'), 1500),
              mockCell([new Paragraph({ children: [grayRun('Peace of Christ \u2014 Korean branch of the Catholic international peace movement. Practicing the values of nonviolence, peace, reconciliation, and solidarity.')] })], 3930),
              cell(normalRun(''), 3930),
            ] }),
          ],
        }),

        subTitle('5-2. \uD478\uD130 \uC5F0\uB77D\uCC98 \uC815\uBCF4'),
        note('\uD478\uD130 "\uC5F0\uB77D\uCC98" \uCEEC\uB7FC\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uCEEC\uB7FC \uC81C\uBAA9: "\uC5F0\uB77D\uCC98" (gold \uC0C9\uC0C1)'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2000, 3680, 3680],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2000),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 3680),
              headerCell('\uC218\uC815 \uAC12', 3680),
            ] }),
            labelRow('\uC804\uD654\uBC88\uD638', '010-9689-2027', 2000, 3680, 3680),
            labelRow('\uC774\uBA54\uC77C', 'paxchristikorea@gmail.com', 2000, 3680, 3680),
            labelRow('\uC8FC\uC18C', '\uC11C\uC6B8 \uB9C8\uD3EC\uAD6C \uD1A0\uC815\uB85C2\uAE38 33 (\uAD6D\uC81C\uCE74\uD1A8\uB9AD\uD615\uC81C\uD68C\uD55C\uAD6D\uBCF8\uBD80) 210\uD638', 2000, 3680, 3680),
          ],
        }),

        subTitle('5-3. \uD478\uD130 \uD558\uB2E8 \uB2E8\uCCB4 \uC0C1\uC138 \uC815\uBCF4'),
        note('\uD478\uD130 \uCD5C\uD558\uB2E8 \uBC95\uC801 \uC815\uBCF4 \uC601\uC5ED\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2500, 3430, 3430],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2500),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 3430),
              headerCell('\uC218\uC815 \uAC12', 3430),
            ] }),
            labelRow('\uB2E8\uCCB4\uBA85 (\uD55C\uAD6D\uC5B4)', '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544', 2500, 3430, 3430),
            labelRow('\uB2E8\uCCB4\uBA85 (\uC601\uC5B4)', 'Pax Christi Korea', 2500, 3430, 3430),
            labelRow('\uB300\uD45C\uC790 (\uD55C\uAD6D\uC5B4)', '\uAC15\uC6B0\uC77C \uC8FC\uAD50, \uAE40\uBBF8\uB780, \uC774\uC131\uD6C8, \uC815\uBD09\uBBF8(\uC218\uB140)', 2500, 3430, 3430),
            labelRow('\uB300\uD45C\uC790 (\uC601\uC5B4)', 'Bishop Kang Woo-il, Kim Mi-ran, Lee Sung-hoon, Jeong Bong-mi (Sr.)', 2500, 3430, 3430),
            labelRow('\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638', '591-80-01356', 2500, 3430, 3430),
            labelRow('\uC800\uC791\uAD8C \uBB38\uAD6C', '\u00A9 {year} \uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544. All rights reserved.', 2500, 3430, 3430),
            labelRow('PCI \uBA64\uBC84\uC2ED \uBB38\uAD6C', 'Pax Christi Korea is a member of Pax Christi International', 2500, 3430, 3430),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 6. 푸터 SNS 링크
        // ===================================================================
        sectionTitle('6. \uD478\uD130 SNS \uB9C1\uD06C'),
        desc('\uC704\uCE58: \uD478\uD130 \uC5F0\uB77D\uCC98 \uC139\uC158 \uD558\uB2E8 + \uD5E4\uB354 \uC0C1\uB2E8\uBC14 | \uD30C\uC77C: src/lib/constants/navigation.ts'),
        note('\uD5E4\uB354 \uC0C1\uB2E8\uBC14\uC640 \uD478\uD130 \uBAA8\uB450\uC5D0 \uB3D9\uC77C\uD558\uAC8C \uD45C\uC2DC\uB429\uB2C8\uB2E4.'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2000, 3680, 3680],
          rows: [
            new TableRow({ children: [
              headerCell('\uD50C\uB7AB\uD3FC', 2000),
              headerCell('\uD604\uC7AC URL (\uCC38\uACE0)', 3680),
              headerCell('\uC218\uC815 URL', 3680),
            ] }),
            new TableRow({ children: [
              cell(normalRun('Instagram'), 2000),
              mockCell(grayRun('https://instagram.com/paxchristikorea'), 3680),
              cell(normalRun(''), 3680),
            ] }),
            new TableRow({ children: [
              cell(normalRun('YouTube'), 2000),
              mockCell(grayRun('https://youtube.com/@paxchristikorea'), 3680),
              cell(normalRun(''), 3680),
            ] }),
            new TableRow({ children: [
              cell(normalRun('Facebook'), 2000),
              mockCell(grayRun('https://facebook.com/paxchristikorea'), 3680),
              cell(normalRun(''), 3680),
            ] }),
            emptyRow(3, [2000, 3680, 3680]),
          ],
        }),

        // ===================================================================
        // 7. 푸터 법적 링크
        // ===================================================================
        sectionTitle('7. \uD478\uD130 \uD558\uB2E8 \uBC95\uC801 \uB9C1\uD06C'),
        desc('\uC704\uCE58: \uD478\uD130 "\uC815\uBCF4" \uCEEC\uB7FC | \uD30C\uC77C: src/lib/constants/navigation.ts'),
        note('\uD478\uD130 "\uC815\uBCF4" \uCEEC\uB7FC \uC81C\uBAA9 (gold \uC0C9\uC0C1)\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2500, 2200, 2200, 2460],
          rows: [
            new TableRow({ children: [
              headerCell('\uD55C\uAD6D\uC5B4 \uBA85\uCE6D', 2500),
              headerCell('\uC601\uC5B4 \uBA85\uCE6D', 2200),
              headerCell('\uB9C1\uD06C \uACBD\uB85C', 2200),
              headerCell('\uBE44\uACE0', 2460),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68'), 2500),
              mockCell(grayRun('Privacy Policy'), 2200),
              mockCell(grayRun('/privacy'), 2200),
              cell(normalRun('\uD398\uC774\uC9C0 \uC791\uC131 \uD544\uC694'), 2460),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uC774\uC6A9\uC57D\uAD00'), 2500),
              mockCell(grayRun('Terms of Use'), 2200),
              mockCell(grayRun('/terms'), 2200),
              cell(normalRun('\uD398\uC774\uC9C0 \uC791\uC131 \uD544\uC694'), 2460),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uC0AC\uC774\uD2B8\uB9F5'), 2500),
              mockCell(grayRun('Sitemap'), 2200),
              mockCell(grayRun('/sitemap'), 2200),
              cell(normalRun('\uC790\uB3D9 \uC0DD\uC131'), 2460),
            ] }),
          ],
        }),
        note('\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68\uACFC \uC774\uC6A9\uC57D\uAD00\uC740 \uBCC4\uB3C4 \uD398\uC774\uC9C0 \uCF58\uD150\uCE20 \uC791\uC131\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.'),

        // ===================================================================
        // 8. 뉴스레터 섹션
        // ===================================================================
        sectionTitle('8. \uB274\uC2A4\uB808\uD130 \uAD6C\uB3C5 \uC139\uC158'),
        desc('\uC704\uCE58: \uBAA8\uB4E0 \uD398\uC774\uC9C0 \uD478\uD130 \uC704 | \uD30C\uC77C: src/components/organisms/NewsletterSection.tsx, src/lib/constants/newsletter.ts'),
        note('\uBC30\uACBD\uC0C9: peace-navy (#1A3A5C) | \uAD6C\uB3C5 \uBC84\uD2BC: peace-orange (#E8911A)'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2500, 3430, 3430],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2500),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 3430),
              headerCell('\uC218\uC815 \uAC12', 3430),
            ] }),
            labelRow('\uC81C\uBAA9 (\uD55C\uAD6D\uC5B4)', '\uD3C9\uD654 \uC18C\uC2DD\uC744 \uBC1B\uC544\uBCF4\uC138\uC694', 2500, 3430, 3430),
            labelRow('\uC81C\uBAA9 (\uC601\uC5B4)', 'Get Peace Updates', 2500, 3430, 3430),
            labelRow('\uC124\uBA85 (\uD55C\uAD6D\uC5B4)', '\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544\uC758 \uD65C\uB3D9 \uC18C\uC2DD, \uD3C9\uD654 \uCE7C\uB7FC, \uAD50\uC721 \uC77C\uC815\uC744 \uC774\uBA54\uC77C\uB85C \uC804\uD574\uB4DC\uB9BD\uB2C8\uB2E4.', 2500, 3430, 3430),
            labelRow('\uC124\uBA85 (\uC601\uC5B4)', 'Receive activity news, peace columns, and education schedules by email.', 2500, 3430, 3430),
            labelRow('\uBC84\uD2BC \uD14D\uC2A4\uD2B8', '\uAD6C\uB3C5\uD558\uAE30 / Subscribe', 2500, 3430, 3430),
            labelRow('\uD558\uB2E8 \uC548\uB0B4', '\uAD6C\uB3C5\uC740 \uC5B8\uC81C\uB4E0\uC9C0 \uCDE8\uC18C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.', 2500, 3430, 3430),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ==========================================================================
        // PART B: 페이지별 콘텐츠
        // ==========================================================================
        new Paragraph({
          spacing: { before: 200, after: 300 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A3A5C', space: 8 } },
          children: [new TextRun({ text: 'Part B. \uD398\uC774\uC9C0\uBCC4 \uCF58\uD150\uCE20', font: 'Malgun Gothic', size: 30, bold: true, color: '1A3A5C' })],
        }),
        note('\uAC01 \uD398\uC774\uC9C0\uC5D0 \uD45C\uC2DC\uB418\uB294 \uACE0\uC720 \uCF58\uD150\uCE20\uC785\uB2C8\uB2E4.'),

        // ===================================================================
        // 9. Hero 슬라이드
        // ===================================================================
        sectionTitle('9. \uD648 \uD788\uC5B4\uB85C \uC2AC\uB77C\uC774\uB4DC \uC774\uBBF8\uC9C0'),
        desc('\uD398\uC774\uC9C0: / (\uD648) \uC0C1\uB2E8 \uC2AC\uB77C\uC774\uB4DC | \uAD00\uB9AC: \uCF54\uB4DC \uC218\uC815 \uD544\uC694'),
        note('\uD30C\uC77C \uACBD\uB85C: src/lib/constants/hero.ts'),
        note('\uC774\uBBF8\uC9C0 \uC704\uCE58: public/images/hero/'),
        note('\uAD8C\uC7A5: \uB370\uC2A4\uD06C\uD1B1 1920x800px, \uBAA8\uBC14\uC77C 768x600px (WebP \uD615\uC2DD)'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [800, 2400, 3080, 3080],
          rows: [
            new TableRow({ children: [
              headerCell('\uBC88\uD638', 800),
              headerCell('\uC124\uBA85 (alt)', 2400),
              headerCell('\uB370\uC2A4\uD06C\uD1B1 \uC774\uBBF8\uC9C0', 3080),
              headerCell('\uBAA8\uBC14\uC77C \uC774\uBBF8\uC9C0', 3080),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('1'), 800),
              mockCell(grayRun('\uD3C9\uD654\uC758 \uBE5B'), 2400),
              mockCell(grayRun('slide-1-desktop.webp'), 3080),
              mockCell(grayRun('slide-1-mobile.webp'), 3080),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2'), 800),
              mockCell(grayRun('\uC5F0\uB300\uC640 \uD654\uD574'), 2400),
              mockCell(grayRun('slide-2-desktop.webp'), 3080),
              mockCell(grayRun('slide-2-mobile.webp'), 3080),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('3'), 800),
              mockCell(grayRun('\uBE44\uD3ED\uB825 \uD3C9\uD654\uC6B4\uB3D9'), 2400),
              mockCell(grayRun('slide-3-desktop.webp'), 3080),
              mockCell(grayRun('slide-3-mobile.webp'), 3080),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('4'), 800),
              mockCell(grayRun('\uAD6D\uC81C \uD3C9\uD654 \uB124\uD2B8\uC6CC\uD06C'), 2400),
              mockCell(grayRun('slide-4-desktop.webp'), 3080),
              mockCell(grayRun('slide-4-mobile.webp'), 3080),
            ] }),
            emptyRow(4, [800, 2400, 3080, 3080]),
            emptyRow(4, [800, 2400, 3080, 3080]),
          ],
        }),

        desc(''),
        note('\uD0C0\uC774\uD551 \uD14D\uC2A4\uD2B8 (\uD788\uC5B4\uB85C \uC704\uC5D0 \uD45C\uC2DC\uB418\uB294 \uBB38\uAD6C)'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1500, 3930, 3930],
          rows: [
            new TableRow({ children: [
              headerCell('\uC5B8\uC5B4', 1500),
              headerCell('\uD604\uC7AC \uD14D\uC2A4\uD2B8 (\uCC38\uACE0)', 3930),
              headerCell('\uC218\uC815 \uD14D\uC2A4\uD2B8', 3930),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD55C\uAD6D\uC5B4'), 1500),
              mockCell(grayRun('\uADF8\uB9AC\uC2A4\uB3C4\uC758 \uD3C9\uD654'), 3930),
              cell(normalRun(''), 3930),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uC601\uC5B4'), 1500),
              mockCell(grayRun('Peace of Christ'), 3930),
              cell(normalRun(''), 3930),
            ] }),
            emptyRow(3, [1500, 3930, 3930]),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 10. 성과 통계
        // ===================================================================
        sectionTitle('10. \uC131\uACFC \uD1B5\uACC4 \uC22B\uC790'),
        desc('\uC704\uCE58: \uD648\uD398\uC774\uC9C0(/) \uC131\uACFC \uC139\uC158 | \uAD00\uB9AC: \uCF54\uB4DC \uC218\uC815 \uD544\uC694'),
        note('\uD30C\uC77C \uACBD\uB85C: src/lib/constants/impact.ts'),
        note('\uC815\uAE30\uC801\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8 \uD544\uC694 (\uC5F0 1\uD68C \uAD8C\uC7A5)'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 2340),
              headerCell('\uC22B\uC790', 2340),
              headerCell('\uB2E8\uC704/\uC811\uBBF8\uC0AC', 2340),
              headerCell('\uD604\uC7AC \uAC12 (\uCC38\uACE0)', 2340),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uCC3D\uB9BD'), 2340),
              cell(normalRun(''), 2340),
              cell(normalRun('\uB144'), 2340),
              mockCell(grayRun('2019\uB144'), 2340),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD68C\uC6D0'), 2340),
              cell(normalRun(''), 2340),
              cell(normalRun('+'), 2340),
              mockCell(grayRun('200+'), 2340),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uD65C\uB3D9 \uAD6D\uAC00'), 2340),
              cell(normalRun(''), 2340),
              cell(normalRun(''), 2340),
              mockCell(grayRun('50'), 2340),
            ] }),
            new TableRow({ children: [
              cell(normalRun('\uCEA0\uD398\uC778'), 2340),
              cell(normalRun(''), 2340),
              cell(normalRun('+'), 2340),
              mockCell(grayRun('15+'), 2340),
            ] }),
          ],
        }),

        // ===================================================================
        // 11. 후원 플랜
        // ===================================================================
        sectionTitle('11. \uD6C4\uC6D0 \uD50C\uB79C'),
        desc('\uC704\uCE58: \uD648\uD398\uC774\uC9C0(/) \uD6C4\uC6D0 CTA + /donate \uD398\uC774\uC9C0 | \uAD00\uB9AC: \uCF54\uB4DC \uC218\uC815 \uD544\uC694'),
        note('\uD30C\uC77C \uACBD\uB85C: src/lib/constants/donation.ts'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2000, 1500, 3860, 2000],
          rows: [
            new TableRow({ children: [
              headerCell('\uD50C\uB79C\uBA85', 2000),
              headerCell('\uAE08\uC561 (\uC6D4)', 1500),
              headerCell('\uC124\uBA85', 3860),
              headerCell('\uCD94\uCC9C \uC5EC\uBD80', 2000),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uD3C9\uD654\uC758 \uC528\uC557'), 2000),
              mockCell(grayRun('10,000\uC6D0'), 1500),
              mockCell(grayRun('\uB274\uC2A4\uB808\uD130\uC640 \uD3C9\uD654 \uAD50\uC721 \uC790\uB8CC\uB97C \uC81C\uC791\uD569\uB2C8\uB2E4'), 3860),
              mockCell(grayRun(''), 2000),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uD3C9\uD654\uC758 \uB3D9\uBC18\uC790'), 2000),
              mockCell(grayRun('30,000\uC6D0'), 1500),
              mockCell(grayRun('\uBE44\uD3ED\uB825 \uD3C9\uD654 \uC6CC\uD06C\uC0F5\uC744 \uC6B4\uC601\uD569\uB2C8\uB2E4'), 3860),
              mockCell(grayRun('\uCD94\uCC9C'), 2000),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uD3C9\uD654\uC758 \uC77C\uAFBC'), 2000),
              mockCell(grayRun('50,000\uC6D0'), 1500),
              mockCell(grayRun('\uAD6D\uC81C \uD3C9\uD654 \uC5F0\uB300 \uD65C\uB3D9\uC5D0 \uCC38\uC5EC\uD569\uB2C8\uB2E4'), 3860),
              mockCell(grayRun(''), 2000),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uD3C9\uD654\uC758 \uD6C4\uC6D0\uC790'), 2000),
              mockCell(grayRun('100,000\uC6D0'), 1500),
              mockCell(grayRun('\uD55C\uBC18\uB3C4 \uD3C9\uD654 \uCEA0\uD398\uC778\uC744 \uC774\uB044\uC5B4\uAC11\uB2C8\uB2E4'), 3860),
              mockCell(grayRun(''), 2000),
            ] }),
            emptyRow(4, [2000, 1500, 3860, 2000]),
            emptyRow(4, [2000, 1500, 3860, 2000]),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 12. 비전/목표/활동영역
        // ===================================================================
        sectionTitle('12. \uB2E8\uCCB4\uC18C\uAC1C > \uBE44\uC804 / \uBAA9\uD45C / \uD65C\uB3D9 \uC601\uC5ED'),
        desc('\uD398\uC774\uC9C0: /about | \uAD00\uB9AC: \uCF54\uB4DC \uC218\uC815 \uD544\uC694'),
        note('\uD30C\uC77C \uACBD\uB85C: src/lib/constants/about.ts'),

        subTitle('12-1. \uBE44\uC804 & \uBAA9\uD45C'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1500, 3930, 3930],
          rows: [
            new TableRow({ children: [
              headerCell('\uD56D\uBAA9', 1500),
              headerCell('\uD604\uC7AC \uB0B4\uC6A9 (\uCC38\uACE0)', 3930),
              headerCell('\uC218\uC815 \uB0B4\uC6A9', 3930),
            ] }),
            new TableRow({ children: [
              cell(boldRun('\uBE44\uC804'), 1500),
              mockCell([new Paragraph({ children: [grayRun('PCI\uC640 \uBCF4\uC870\uB97C \uB9DE\uCDB0 \uD55C\uAD6D \uD604\uC2E4\uC5D0 \uBD80\uD569\uD558\uB294 \uD3C9\uD654 \uC6B4\uB3D9\uC744 \uD65C\uBC1C\uD558\uAC8C \uC804\uAC1C\uD558\uACE0, \uBAA8\uB4E0 \uD3ED\uB825\uC5D0\uC11C \uC790\uC720\uB85C\uC6B4 \uC138\uACC4, \uD3C9\uD654\uB85C\uC6B4 \uC138\uACC4 \uAC74\uC124\uC774\uB77C\uB294 \uBE44\uC804\uC744 \uCD94\uAD6C\uD569\uB2C8\uB2E4.')] })], 3930),
              cell(normalRun(''), 3930),
            ] }),
            new TableRow({ children: [
              cell(boldRun('\uBAA9\uD45C'), 1500),
              mockCell([new Paragraph({ children: [grayRun('\uAC00\uD1A8\uB9AD\uAD50\uD68C\uC758 \uBAA8\uB4E0 \uC2E0\uC6D0\uC774 \uB3D9\uB4F1\uD558\uAC8C \uC218\uD3C9\uC801\uC73C\uB85C \uD3C9\uD654\uC640 \uD654\uD574\uB97C \uCD94\uAD6C\uD558\uB294 \uD65C\uB3D9\uC5D0 \uCC38\uC5EC\uD558\uB294 \uBE44\uACF5\uC778 \uAC00\uD1A8\uB9AD \uD3C9\uD654\uC6B4\uB3D9 \uB2E8\uCCB4\uB85C\uC11C, \uBCF5\uC74C\uACFC \uAC00\uD1A8\uB9AD \uC2E0\uC559\uC5D0 \uBC14\uD0D5\uC744 \uB450\uACE0 \uAE30\uB3C4\u00B7\uACF5\uBD80(\uC5F0\uAD6C)\u00B7\uC2E4\uCC9C\uC744 \uBC29\uBC95\uC801 \uC6D0\uB9AC\uB85C \uC0BC\uC544 \uD65C\uB3D9\uD569\uB2C8\uB2E4.')] })], 3930),
              cell(normalRun(''), 3930),
            ] }),
          ],
        }),

        subTitle('12-2. \uC8FC\uC694 \uD65C\uB3D9 \uC601\uC5ED (8\uAC1C)'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [800, 2200, 3180, 3180],
          rows: [
            new TableRow({ children: [
              headerCell('No', 800),
              headerCell('\uC601\uC5ED\uBA85', 2200),
              headerCell('\uD604\uC7AC \uC124\uBA85 (\uCC38\uACE0)', 3180),
              headerCell('\uC218\uC815 \uC124\uBA85', 3180),
            ] }),
            ...([
              ['1', '\uAC08\uB4F1 \uC804\uD658', '\uD3ED\uB825\uC801 \uAC08\uB4F1\uC744 \uC0AC\uC804\uC5D0 \uC608\uBC29\uD558\uAE30 \uC704\uD574 \uB178\uB825\uD558\uACE0, \uAC08\uB4F1\uC774 \uC9C4\uD589 \uC911\uC778 \uACBD\uC6B0 \uB300\uC548\uC801 \uD574\uACB0\uCC45\uC744 \uC81C\uC2DC\uD569\uB2C8\uB2E4.'],
              ['2', '\uD3C9\uD654 \uAD6C\uCD95', '\uC9C4\uB9AC\uC640 \uC815\uC758\uC5D0 \uC785\uAC01\uD558\uC5EC \uD654\uD574\uC640 \uD3C9\uD654\uB97C \uC2E4\uD604\uD558\uB3C4\uB85D \uB3D5\uB294 \uD3C9\uD654\uAD6C\uCD95\uC744 \uCD94\uAD6C\uD569\uB2C8\uB2E4.'],
              ['3', '\uD3C9\uD654 \uAD50\uC721/\uCCAD\uB144\uD65C\uB3D9', '\uC816\uC740\uC774\uB4E4\uC758 \uAD50\uB958, \uB300\uC548\uC801 \uD3C9\uD654 \uBD09\uC0AC, \uC790\uBC1C\uC801 \uD3C9\uD654 \uD65C\uB3D9\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4.'],
              ['4', '\uBE44\uD3ED\uB825 \uBAA8\uC784 \uC870\uC9C1', '\uBE44\uD3ED\uB825\uC801 \uBC29\uBC95\uC744 \uD1B5\uD55C \uC0AC\uD68C\uBCC0\uD654\uB97C \uCD94\uAD6C\uD558\uAE30 \uC704\uD574 \uB2E4\uC591\uD55C \uD68C\uC758\uC640 \uD1A0\uB860 \uBAA8\uC784\uC744 \uC870\uC9C1\uD569\uB2C8\uB2E4.'],
              ['5', '\uC885\uAD50\uAC04 \uB300\uD654/\uD611\uB825', '\uD3C9\uD654\uB97C \uC704\uD574 \uAD50\uD30C \uBD84\uC5F4\uC744 \uC911\uC7AC\uD558\uACE0 \uC885\uAD50\uAC04 \uB300\uD654\uC758 \uAE30\uD68C\uB97C \uB9C8\uB828\uD569\uB2C8\uB2E4.'],
              ['6', '\uC625\uD638(Advocacy) \uD65C\uB3D9', '\uAC01 \uB098\uB77C\uC758 \uC0AC\uD68C\uC815\uCE58\uC801 \uB9E5\uB77D\uC5D0 \uC5B4\uC6B8\uB9AC\uB294 \uC625\uD638 \uD65C\uB3D9\uC5D0 \uCC38\uC5EC\uD569\uB2C8\uB2E4.'],
              ['7', '\uD611\uB825\uB2E8\uCCB4 \uAD50\uB958', '\uD611\uB825\uB2E8\uCCB4\uB4E4\uACFC \uB2A5\uB825\uC744 \uC99D\uC9C4\uD558\uACE0, \uD65C\uB3D9\uC758 \uD6A8\uACFC\uB97C \uB192\uC774\uAE30 \uC704\uD574 \uAD50\uB958\uB97C \uC8FC\uC120\uD569\uB2C8\uB2E4.'],
              ['8', '\uD3C9\uD654\uC758 \uB0A0 \uB2F4\uD654 \uC2E4\uCC9C', '\uAD50\uD669\uB2D8\uC758 \uD3C9\uD654\uC758 \uB0A0 \uB2F4\uD654\uB97C \uC219\uACE0\uD558\uACE0 \uC2E4\uCC9C\uD558\uBA70 \uAD50\uD68C \uB0B4 \uC804\uD30C\uB97C \uC704\uD574 \uB178\uB825\uD569\uB2C8\uB2E4.'],
            ].map(([num, name, desc]) => new TableRow({ children: [
              cell(normalRun(num), 800),
              cell(normalRun(name), 2200),
              mockCell([new Paragraph({ children: [grayRun(desc)] })], 3180),
              cell(normalRun(''), 3180),
            ] }))),
          ],
        }),

        subTitle('12-3. \uC18C\uAC1C\uAE00 (\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0\uCF54\uB9AC\uC544\uB780?)'),
        note('\uD604\uC7AC 4\uAC1C \uB2E8\uB77D\uC73C\uB85C \uAD6C\uC131. \uC218\uC815\uC774 \uD544\uC694\uD55C \uB2E8\uB77D\uB9CC \uC791\uC131\uD574\uC8FC\uC138\uC694.'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1000, 8360],
          rows: [
            new TableRow({ children: [
              headerCell('\uB2E8\uB77D', 1000),
              headerCell('\uB0B4\uC6A9', 8360),
            ] }),
            ...[
              ['1', 'PCK\uB294 1945\uB144\uC5D0 \uCC3D\uB9BD\uB41C PCI\uC758 \uD55C\uAD6D \uC9C0\uBD80\uB85C 2019\uB144\uC5D0 \uC124\uB9BD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.'],
              ['2', 'PCI\uB294 \uAC00\uD1A8\uB9AD\uAD50\uD68C\uC758 \uBAA8\uB4E0 \uC2E0\uC6D0\uC774 \uB3D9\uB4F1\uD558\uAC8C... \uD604\uC7AC 50\uC5EC\uAC1C \uB098\uB77C\uC5D0\uC11C 120\uC5EC\uAC1C \uB2E8\uCCB4\uAC00 \uD568\uAED8 \uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'],
              ['3', 'PCI\uB294 \uC138\uACC4, \uB300\uB959, \uAD6D\uAC00 \uB2E8\uC704\uC5D0\uC11C... UN, UNESCO \uB4F1\uC5D0\uB3C4 \uCC38\uC5EC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.'],
              ['4', 'PCK\uB294 \uAC00\uD1A8\uB9AD \uC2E0\uC790 \uC5EC\uB7EC\uBD84\uC758 \uCC38\uC5EC\uB97C \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD68C\uC6D0 \uAC00\uC785\uC744 \uC2E0\uCCAD\uD574 \uC8FC\uC2ED\uC2DC\uC624.'],
            ].map(([n, t]) => new TableRow({ children: [
              cell(normalRun(n), 1000),
              mockCell([new Paragraph({ children: [grayRun(t)] })], 8360),
            ] })),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 13. 연혁
        // ===================================================================
        sectionTitle('13. \uB2E8\uCCB4\uC18C\uAC1C > \uC5F0\uD601'),
        desc('\uD398\uC774\uC9C0: /about/history | \uAD00\uB9AC: Sanity CMS > \uC5F0\uD601(timeline)'),
        note('\uC785\uB825 \uBC29\uBC95: Sanity Studio \uC811\uC18D > \uC5F0\uD601 > \uC0C8 \uBB38\uC11C \uCD94\uAC00'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1200, 2500, 5660],
          rows: [
            new TableRow({ children: [
              headerCell('\uC5F0\uB3C4', 1200),
              headerCell('\uC81C\uBAA9', 2500),
              headerCell('\uC124\uBA85', 5660),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2019'), 1200),
              mockCell(grayRun('PCK \uCC3D\uB9BD'), 2500),
              mockCell(grayRun('Pax Christi International \uD55C\uAD6D \uC9C0\uBD80 \uC124\uB9BD'), 5660),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2020'), 1200),
              mockCell(grayRun('\uCCAB \uD3C9\uD654\uD559\uAD50 \uAC1C\uCD5C'), 2500),
              mockCell(grayRun('\uC81C1\uAE30 \uD3C9\uD654\uD559\uAD50 \uD504\uB85C\uADF8\uB7A8 \uC6B4\uC601'), 5660),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2021'), 1200),
              mockCell(grayRun('PCI \uCD1D\uD68C \uCC38\uC11D'), 2500),
              mockCell(grayRun('\uAD6D\uC81C \uD3C9\uD654 \uCEE8\uD37C\uB7F0\uC2A4 \uCC38\uAC00 \uBC0F \uBC1C\uD45C'), 5660),
            ] }),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
            emptyRow(3, [1200, 2500, 5660]),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 14. 임원진
        // ===================================================================
        sectionTitle('14. \uB2E8\uCCB4\uC18C\uAC1C > \uC784\uC6D0\uC9C4'),
        desc('\uD398\uC774\uC9C0: /about/team | \uAD00\uB9AC: Sanity CMS > \uC784\uC6D0\uC9C4(teamMember)'),
        note('\uC785\uB825 \uBC29\uBC95: Sanity Studio \uC811\uC18D > \uC784\uC6D0\uC9C4 > \uC0C8 \uBB38\uC11C \uCD94\uAC00'),
        note('\uD504\uB85C\uD544 \uC0AC\uC9C4: \uAD8C\uC7A5 \uD06C\uAE30 400x400px \uC774\uC0C1, \uC815\uBC29\uD615 \uBE44\uC728'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [800, 1500, 1500, 3760, 1800],
          rows: [
            new TableRow({ children: [
              headerCell('\uC21C\uC11C', 800),
              headerCell('\uC774\uB984', 1500),
              headerCell('\uC9C1\uCC45', 1500),
              headerCell('\uC18C\uAC1C', 3760),
              headerCell('\uD504\uB85C\uD544\uC0AC\uC9C4', 1800),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('1'), 800),
              mockCell(grayRun('\uAC15\uC6B0\uC77C'), 1500),
              mockCell(grayRun('\uACF5\uB3D9\uB300\uD45C (\uC8FC\uAD50)'), 1500),
              mockCell(grayRun('\uC81C\uC8FC\uAD50\uAD6C \uC6D0\uB85C \uC8FC\uAD50, PCI \uD55C\uAD6D \uB300\uD45C'), 3760),
              mockCell(grayRun('\uD30C\uC77C\uCCA8\uBD80'), 1800),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2'), 800),
              mockCell(grayRun('\uAE40\uBBF8\uB780'), 1500),
              mockCell(grayRun('\uACF5\uB3D9\uB300\uD45C'), 1500),
              mockCell(grayRun(''), 3760),
              mockCell(grayRun('\uD30C\uC77C\uCCA8\uBD80'), 1800),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('3'), 800),
              mockCell(grayRun('\uC774\uC131\uD6C8'), 1500),
              mockCell(grayRun('\uACF5\uB3D9\uB300\uD45C'), 1500),
              mockCell(grayRun(''), 3760),
              mockCell(grayRun('\uD30C\uC77C\uCCA8\uBD80'), 1800),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('4'), 800),
              mockCell(grayRun('\uC815\uBD09\uBBF8'), 1500),
              mockCell(grayRun('\uACF5\uB3D9\uB300\uD45C (\uC218\uB140)'), 1500),
              mockCell(grayRun(''), 3760),
              mockCell(grayRun('\uD30C\uC77C\uCCA8\uBD80'), 1800),
            ] }),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
            emptyRow(5, [800, 1500, 1500, 3760, 1800]),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 15. 뉴스 & 활동
        // ===================================================================
        sectionTitle('15. \uB274\uC2A4 & \uD65C\uB3D9 \uAC8C\uC2DC\uAE00'),
        desc('\uD398\uC774\uC9C0: /news | \uAD00\uB9AC: Sanity CMS > \uB274\uC2A4/\uD65C\uB3D9(post)'),
        note('\uC785\uB825 \uBC29\uBC95: Sanity Studio \uC811\uC18D > \uB274\uC2A4/\uD65C\uB3D9 > \uC0C8 \uBB38\uC11C \uCD94\uAC00'),
        note('\uCE74\uD14C\uACE0\uB9AC: \uB274\uC2A4(news) / \uD65C\uB3D9(activity) / \uC131\uBA85\uC11C(statement) / \uBCF4\uB3C4\uC790\uB8CC(press)'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1300, 2200, 1300, 4560],
          rows: [
            new TableRow({ children: [
              headerCell('\uCE74\uD14C\uACE0\uB9AC', 1300),
              headerCell('\uC81C\uBAA9 (100\uC790 \uC774\uB0B4)', 2200),
              headerCell('\uBC1C\uD589\uC77C', 1300),
              headerCell('\uBC1C\uCDCC\uBB38 (\uC694\uC57D 2~3\uC904)', 4560),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uB274\uC2A4'), 1300),
              mockCell(grayRun('PCI 2025 \uCD1D\uD68C \uCC38\uAC00 \uBCF4\uACE0'), 2200),
              mockCell(grayRun('2025-06-15'), 1300),
              mockCell(grayRun('\uD329\uC2A4\uD06C\uB9AC\uC2A4\uD2F0 \uAD6D\uC81C \uCD1D\uD68C\uC5D0 \uD55C\uAD6D \uB300\uD45C\uB2E8\uC774 \uCC38\uAC00\uD558\uC5EC...'), 4560),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uD65C\uB3D9'), 1300),
              mockCell(grayRun('\uC81C5\uAE30 \uD3C9\uD654\uD559\uAD50 \uC218\uB8CC\uC2DD'), 2200),
              mockCell(grayRun('2025-05-20'), 1300),
              mockCell(grayRun('\uC81C5\uAE30 \uD3C9\uD654\uD559\uAD50 \uD504\uB85C\uADF8\uB7A8\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uB9C8\uBB34\uB9AC...'), 4560),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uC131\uBA85\uC11C'), 1300),
              mockCell(grayRun('\uD55C\uBC18\uB3C4 \uD3C9\uD654\uB97C \uC704\uD55C \uC131\uBA85'), 2200),
              mockCell(grayRun('2025-03-01'), 1300),
              mockCell(grayRun('\uC6B0\uB9AC\uB294 \uD55C\uBC18\uB3C4\uC758 \uD56D\uAD6C\uC801 \uD3C9\uD654\uB97C \uC704\uD574...'), 4560),
            ] }),
            emptyRow(4, [1300, 2200, 1300, 4560]),
            emptyRow(4, [1300, 2200, 1300, 4560]),
            emptyRow(4, [1300, 2200, 1300, 4560]),
            emptyRow(4, [1300, 2200, 1300, 4560]),
            emptyRow(4, [1300, 2200, 1300, 4560]),
          ],
        }),
        desc(''),
        note('\uBCF8\uBB38 \uB0B4\uC6A9\uACFC \uB300\uD45C \uC774\uBBF8\uC9C0\uB294 Sanity Studio\uC5D0\uC11C \uC9C1\uC811 \uC785\uB825\uD574\uC8FC\uC138\uC694.'),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 16. 교육 프로그램
        // ===================================================================
        sectionTitle('16. \uD3C9\uD654\uD559\uAD50 \uAD50\uC721 \uD504\uB85C\uADF8\uB7A8'),
        desc('\uD398\uC774\uC9C0: /education | \uAD00\uB9AC: Sanity CMS > \uD3C9\uD654\uD559\uAD50 \uAD50\uC721(education)'),
        note('\uC785\uB825 \uBC29\uBC95: Sanity Studio \uC811\uC18D > \uD3C9\uD654\uD559\uAD50 \uAD50\uC721 > \uC0C8 \uBB38\uC11C \uCD94\uAC00'),

        subTitle('16-1. \uAD50\uC721 \uAE30\uBCF8 \uC815\uBCF4'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [2000, 2000, 1500, 1500, 2360],
          rows: [
            new TableRow({ children: [
              headerCell('\uAD50\uC721\uBA85', 2000),
              headerCell('\uAC04\uB7B5 \uC18C\uAC1C', 2000),
              headerCell('\uC2DC\uC791\uC77C', 1500),
              headerCell('\uC885\uB8CC\uC77C', 1500),
              headerCell('\uBAA8\uC9D1 \uC5EC\uBD80', 2360),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('\uC81C6\uAE30 \uD3C9\uD654\uD559\uAD50'), 2000),
              mockCell(grayRun('\uBE44\uD3ED\uB825 \uD3C9\uD654\uC758 \uAE30\uCD08\uC640 \uC2E4\uCC9C'), 2000),
              mockCell(grayRun('2026-09-01'), 1500),
              mockCell(grayRun('2026-11-30'), 1500),
              mockCell(grayRun('\uBAA8\uC9D1 \uC911 / \uB9C8\uAC10'), 2360),
            ] }),
            emptyRow(5, [2000, 2000, 1500, 1500, 2360]),
            emptyRow(5, [2000, 2000, 1500, 1500, 2360]),
            emptyRow(5, [2000, 2000, 1500, 1500, 2360]),
          ],
        }),

        subTitle('16-2. \uCEE4\uB9AC\uD058\uB7FC (\uAD50\uC721\uBCC4 \uC791\uC131)'),
        note('\uAD50\uC721\uBA85: ___________________'),
        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [800, 2000, 2000, 4560],
          rows: [
            new TableRow({ children: [
              headerCell('\uCC28\uC2DC', 800),
              headerCell('\uC81C\uBAA9', 2000),
              headerCell('\uC77C\uC2DC', 2000),
              headerCell('\uC124\uBA85', 4560),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('1'), 800),
              mockCell(grayRun('\uD3C9\uD654\uC758 \uAC1C\uB150'), 2000),
              mockCell(grayRun('2026-09-07 14:00'), 2000),
              mockCell(grayRun('\uAC00\uD1A8\uB9AD \uD3C9\uD654\uC0AC\uC0C1\uC758 \uAE30\uCD08\uC640 \uC5ED\uC0AC'), 4560),
            ] }),
            new TableRow({ children: [
              mockCell(grayRun('2'), 800),
              mockCell(grayRun('\uBE44\uD3ED\uB825 \uC2E4\uCC9C'), 2000),
              mockCell(grayRun('2026-09-14 14:00'), 2000),
              mockCell(grayRun('\uC77C\uC0C1\uC5D0\uC11C\uC758 \uBE44\uD3ED\uB825 \uC2E4\uCC9C \uBC29\uBC95'), 4560),
            ] }),
            emptyRow(4, [800, 2000, 2000, 4560]),
            emptyRow(4, [800, 2000, 2000, 4560]),
            emptyRow(4, [800, 2000, 2000, 4560]),
            emptyRow(4, [800, 2000, 2000, 4560]),
            emptyRow(4, [800, 2000, 2000, 4560]),
            emptyRow(4, [800, 2000, 2000, 4560]),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===================================================================
        // 17. 재정 보고서
        // ===================================================================
        sectionTitle('17. \uC7AC\uC815 \uBCF4\uACE0\uC11C'),
        desc('\uD398\uC774\uC9C0: /transparency | \uAD00\uB9AC: \uAD00\uB9AC\uC790 \uD398\uC774\uC9C0(/admin/finance/reports)'),
        note('\uC785\uB825 \uBC29\uBC95: \uAD00\uB9AC\uC790 \uB85C\uADF8\uC778 > \uC7AC\uC815\uAD00\uB9AC > \uBCF4\uACE0\uC11C\uC5D0\uC11C \uC5F0\uB3C4\uBCC4 \uB4F1\uB85D'),

        new Table({
          width: { size: W, type: WidthType.DXA },
          columnWidths: [1200, 2080, 2080, 2000, 2000],
          rows: [
            new TableRow({ children: [
              headerCell('\uC5F0\uB3C4', 1200),
              headerCell('\uCD1D \uC218\uC785 (\uC6D0)', 2080),
              headerCell('\uCD1D \uC9C0\uCD9C (\uC6D0)', 2080),
              headerCell('PDF \uBCF4\uACE0\uC11C', 2000),
              headerCell('\uACF5\uAC1C \uC5EC\uBD80', 2000),
            ] }),
            emptyRow(5, [1200, 2080, 2080, 2000, 2000]),
            emptyRow(5, [1200, 2080, 2080, 2000, 2000]),
            emptyRow(5, [1200, 2080, 2080, 2000, 2000]),
          ],
        }),
      ],
    },
  ],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('Docs/PCK_\uCF58\uD150\uCE20_\uC785\uB825\uC591\uC2DD.docx', buffer)
  console.log('Created: Docs/PCK_\uCF58\uD150\uCE20_\uC785\uB825\uC591\uC2DD.docx')
})
