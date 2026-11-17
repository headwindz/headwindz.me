'use client'

import { useId, useState } from 'react'
import { ArrowRight, GitFork, Link2, RotateCcw, Unlink } from 'lucide-react'

type Kind = 'hashes' | 'fork' | 'gas'

function HashLinks() {
  const [tampered, setTampered] = useState(false)
  return (
    <>
      <div className="web3-blocks">
        {['A', 'B', 'C'].map((block, index) => (
          <div className="web3-block-unit" key={block}>
            {index > 0 &&
              (tampered && index === 1 ? (
                <Unlink aria-label="Hash mismatch" />
              ) : (
                <Link2 aria-label="Hash link" />
              ))}
            <div className="web3-block" data-invalid={tampered && index > 0}>
              <strong>Block {block}</strong>
              <span>
                {index === 0
                  ? tampered
                    ? 'Alice pays 9'
                    : 'Alice pays 1'
                  : `Previous: ${index === 1 ? 'a71' : 'b82'}`}
              </span>
              <code>
                Hash: {index === 0 ? (tampered ? 'f04' : 'a71') : index === 1 ? 'b82' : 'c93'}
              </code>
            </div>
          </div>
        ))}
      </div>
      <button className="web3-control" onClick={() => setTampered(!tampered)}>
        {tampered ? <RotateCcw size={16} /> : <Unlink size={16} />}
        {tampered ? 'Restore original entry' : 'Change the old payment'}
      </button>
      <p aria-live="polite">
        {tampered
          ? 'A now hashes to f04, but B still points to a71. The old links no longer authenticate this history. Rebuilding links alone would not satisfy consensus.'
          : 'B commits to A’s hash; C commits to B’s. Change an old entry to see why the links expose tampering.'}
      </p>
      <small>Short hashes are illustrative labels, not calculated cryptographic outputs.</small>
    </>
  )
}

function ForkHistory() {
  const [revealed, setRevealed] = useState(false)
  return (
    <>
      <div className="web3-fork-origin">
        <GitFork size={22} /> Shared history
      </div>
      <div className="web3-branches">
        <div data-selected={!revealed}>
          <strong>Public branch</strong>
          <div className="web3-chain-strip">
            <span>Payment</span>
            <ArrowRight size={18} />
            <span>Block</span>
          </div>
          <small>
            {revealed ? 'Loses to the competing valid history' : 'Merchant sees confirmations'}
          </small>
        </div>
        <div data-selected={revealed}>
          <strong>{revealed ? 'Revealed branch' : 'Private branch'}</strong>
          <div className="web3-chain-strip">
            <span>Conflicting spend</span>
            <ArrowRight size={18} />
            <span>More work</span>
          </div>
          <small>
            {revealed
              ? 'Selected: greater cumulative proof of work'
              : 'Attacker mines a competing valid history'}
          </small>
        </div>
      </div>
      <button className="web3-control" onClick={() => setRevealed(!revealed)}>
        {revealed ? <RotateCcw size={16} /> : <GitFork size={16} />}
        {revealed ? 'Reset the fork' : 'Reveal the heavier branch'}
      </button>
      <p aria-live="polite">
        {revealed
          ? 'The payment is absent from the selected branch. A conflicting spend prevents it from simply being included again. The attacker still cannot forge anyone else’s signature.'
          : 'Assume the attacker can produce a valid branch with more cumulative work. This illustrates the reorganization mechanism, not its cost or probability.'}
      </p>
    </>
  )
}

function GasFees() {
  const id = useId()
  const [base, setBase] = useState(10)
  const [tip, setTip] = useState(2)
  const [complex, setComplex] = useState(false)
  const gas = complex ? 100000 : 21000
  const total = gas * (base + tip)
  return (
    <>
      <div className="web3-options" aria-label="Illustrative transaction workload">
        {['Basic ETH transfer', 'Contract call'].map((name, i) => (
          <button
            key={name}
            aria-pressed={complex === Boolean(i)}
            onClick={() => setComplex(Boolean(i))}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="web3-gas-inputs">
        <label htmlFor={`${id}-base`}>
          Base fee: {base} gwei
          <input
            id={`${id}-base`}
            type="range"
            min="1"
            max="50"
            value={base}
            onChange={(event) => setBase(Number(event.target.value))}
          />
        </label>
        <label htmlFor={`${id}-tip`}>
          Priority tip: {tip} gwei
          <input
            id={`${id}-tip`}
            type="range"
            min="0"
            max="10"
            value={tip}
            onChange={(event) => setTip(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="web3-fee-split" aria-label="Fee allocation">
        <span style={{ flexGrow: base }}>Base fee · burned</span>
        {tip > 0 && <span style={{ flexGrow: tip }}>Tip · validator</span>}
      </div>
      <p className="web3-fee-result" aria-live="polite">
        <strong>
          {gas.toLocaleString('en-US')} gas × {base + tip} gwei = {(total / 1e9).toFixed(6)} ETH
        </strong>
      </p>
      <p>
        More work increases gas used. Demand changes the base fee. The tip changes what the
        validator receives.
      </p>
      <small>
        Illustrative Ethereum L1 execution fee. The contract call assumes 100,000 gas. Blob fees and
        L2 fee components are excluded.
      </small>
    </>
  )
}

const titles: Record<Kind, string> = {
  hashes: 'What changes when an old record changes?',
  fork: 'A valid history can still be reorganized',
  gas: 'Where does a transaction fee go?',
}

export default function Web3Explainer({ kind }: { kind: Kind }) {
  return (
    <figure className="not-prose web3-explainer" aria-label={titles[kind]}>
      <figcaption>{titles[kind]}</figcaption>
      {kind === 'hashes' ? <HashLinks /> : kind === 'fork' ? <ForkHistory /> : <GasFees />}
    </figure>
  )
}
