import { APP_VERSION } from '../data/version'

const letters = [
  { id: 'n', char: 'N', x: 100 },
  { id: 'e1', char: 'E', x: 195 },
]

const lostLetters = [
  { id: 'v', char: 'V', x: 290 },
  { id: 'e2', char: 'E', x: 385 },
  { id: 'r1', char: 'R', x: 480 },
]

const forgeLetters = [
  { id: 'f', char: 'F', x: 620 },
  { id: 'o', char: 'O', x: 715 },
  { id: 'r2', char: 'R', x: 810 },
  { id: 'g', char: 'G', x: 905 },
  { id: 'e3', char: 'E', x: 1000 },
]

export function NetForgeWordmark() {
  return (
    <div className="intro-wordmark-wrap">
      <h1 className="intro-wordmark" aria-label="NetForge">
        <svg viewBox="0 0 1230 220" className="wordmark-svg" aria-hidden="true">
          <g className="wordmark-letters">
            {letters.map((letter) => (
              <text key={letter.id} x={letter.x} y="125" textAnchor="middle">
                {letter.char}
              </text>
            ))}
            <g className="wordmark-lost">
              {lostLetters.map((letter) => (
                <text key={letter.id} x={letter.x} y="125" textAnchor="middle">
                  {letter.char}
                </text>
              ))}
            </g>
            <g className="wordmark-t">
              <text x="1095" y="125" textAnchor="middle">
                T
              </text>
            </g>
            {forgeLetters.map((letter) => (
              <text key={letter.id} x={letter.x} y="125" textAnchor="middle">
                {letter.char}
              </text>
            ))}
            <text className="wordmark-dots" x="1165" y="125" textAnchor="middle">
              ..
            </text>
          </g>
        </svg>
      </h1>
      <span className="intro-version-balloon">v{APP_VERSION}</span>
    </div>
  )
}
