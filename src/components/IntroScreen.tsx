import { DeviceGlyph } from './DeviceGlyph'

interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <main className="intro-screen">
      <div className="intro-topbar">
        <div className="intro-brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <span className="brand-kicker">Network lab</span>
            <strong>NetForge</strong>
          </div>
        </div>
        <button className="intro-skip" onClick={onStart}>
          Lewati intro
        </button>
      </div>

      <section className="intro-stage">
        <div className="intro-heading">
          <span className="eyebrow">Shift pertama · 08:00</span>
          <h1>Jaringan belum siap.</h1>
          <p>
            Iga, teknisi baru di kantor ini. Kabel belum rapi, dan gangguan
            sudah menunggu. Susun topologi, atur perangkat, lalu selamatkan
            shift hari ini.
          </p>
        </div>

        <div className="intro-strip">
          <article className="intro-panel intro-panel-office">
            <span className="intro-panel-label">01 / KABEL</span>
            <div className="intro-scene">
              <DeviceGlyph type="pc" className="intro-device" />
              <div className="intro-cable" />
              <span className="intro-sfx">KRAK!</span>
            </div>
            <p>Kabel baru saja terlepas dari port.</p>
          </article>

          <article className="intro-panel intro-panel-cat">
            <span className="intro-panel-label">02 / KUCING</span>
            <div className="intro-scene">
              <div className="cat-face" aria-hidden="true">
                <span className="cat-ear cat-ear-left" />
                <span className="cat-ear cat-ear-right" />
                <span className="cat-eye cat-eye-left" />
                <span className="cat-eye cat-eye-right" />
                <span className="cat-nose" />
              </div>
              <span className="intro-sfx is-cat">MIAW!</span>
            </div>
            <p>Kucing menganggap kabel sebagai mainan.</p>
          </article>

          <article className="intro-panel intro-panel-dark">
            <span className="intro-panel-label">03 / LISTRIK</span>
            <div className="intro-scene">
              <span className="intro-token">TOKEN 0</span>
              <span className="intro-sfx is-dark">JLEG!</span>
            </div>
            <p>Token habis. Lab mendadak gelap.</p>
          </article>
        </div>

        <div className="intro-cta">
          <button className="primary-button intro-start" onClick={onStart}>
            Mulai Shift
            <span className="next-arrow">→</span>
          </button>
          <span className="intro-note">
            Pilih dua perlengkapan. Timer dimulai setelah briefing.
          </span>
        </div>

        <div className="intro-footer">
          <span>01 Bangun topologi</span>
          <span>02 Atur IP / VLAN</span>
          <span>03 Tangani gangguan</span>
          <span className="intro-version">NetForge v0.1</span>
        </div>
      </section>
    </main>
  )
}
