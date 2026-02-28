interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Awesome web3',
    description:
      'A comprehensive web3 educational platform featuring a full timeline of cryptocurrency and blockchain history, an extensive glossary of web3 terms, and curated learning resources.',
    href: 'https://awesome-web3.headwindz.me/',
    imgSrc: '/static/projects/awesome-web3.png',
  },
  {
    title: 'Figx',
    description:
      'A TypeScript-first Figma utilities library with native type support. Offers intuitive APIs for color conversion, plugin development, and more, backed by thorough documentation.',
    href: 'https://github.com/headwindz/figx',
    imgSrc: '/static/projects/figx.jpeg',
  },
  {
    title: 'Toolhub',
    description:
      'A curated collection of essential tools and utilities designed to boost productivity. Features a wide range of tools including JSON formatter and viewer for data visualization, intelligent image compressor for web optimization, OCR for text extraction from images, customizable QR code generator, cryptographic hash generators (MD5, SHA1, SHA256), advanced color picker with palette generation, WCAG-compliant color contrast checker, Base64 encoder/decoder, multi-base number converter (binary, octal, decimal, hex), JWT token decoder and analyzer, and many more utilities to streamline your workflow.',
    href: 'https://toolhub.run',
    imgSrc: '/static/projects/toolhub.jpeg',
  },
  {
    title: 'Public Holidays API',
    description:
      'Free and open-source API providing complete public holiday information for about 60 countries/regions worldwide. Perfect for scheduling, calendar apps, and HR systems.',
    href: 'https://public-holidays.toolhub.run',
    imgSrc: '/static/projects/public-holiday.jpg',
  },
]

export default projectsData
