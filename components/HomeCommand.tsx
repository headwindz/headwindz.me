import Link from './Link'

export default function HomeCommand() {
  return (
    <Link href="/" aria-label="cd .. — Back to home" className="notebook-text-link mt-4 font-mono">
      cd ..
    </Link>
  )
}
