'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function StablecoinPreview() {
  const [minted, setMinted] = useState(false)
  return (
    <div
      className="post-cover reserve-cover"
      aria-label="Simplified stablecoin mint and redeem illustration"
    >
      <div className="reserve-ledger">
        <div>
          <span>Reserve</span>
          <strong>{minted ? '$100' : '$0'}</strong>
        </div>
        <span aria-hidden="true">⇄</span>
        <div>
          <span>Tokens issued</span>
          <strong>{minted ? '100' : '0'}</strong>
        </div>
      </div>
      <div className="reserve-action">
        <span>Illustrative 1:1 backing</span>
        <button onClick={() => setMinted(!minted)}>
          {minted ? 'Redeem 100' : 'Mint 100'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
