import { useDialogA11y } from '../lib/useDialogA11y'

interface TutorialCardProps {
  onClose: () => void
}

const STEPS = [
  {
    title: 'Temui customer',
    text: 'Klik pelanggan di kantor dan dengarkan masalahnya sebelum berangkat.',
  },
  {
    title: 'Pilih order',
    text: 'Buka papan order, pilih pekerjaan, lalu terima order dari customer.',
  },
  {
    title: 'Siapkan alat',
    text: 'Pilih dua perlengkapan. Timer baru berjalan setelah kamu menekan Mulai misi.',
  },
  {
    title: 'Susun jaringan',
    text: 'Tarik kabel dari port kanan ke port kiri. Klik perangkat untuk mengisi IP, DHCP, atau VLAN.',
  },
  {
    title: 'Simulasikan',
    text: 'Tekan Simulasikan untuk memeriksa hasil. Setelah lulus, kembali ke kantor untuk order berikutnya.',
  },
]

export function TutorialCard({ onClose }: TutorialCardProps) {
  const dialogRef = useDialogA11y<HTMLElement>(true, onClose)

  return (
    <div
      className="tutorial-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="tutorial-card"
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div className="tutorial-head">
          <div>
            <span className="tutorial-eyebrow">Panduan shift pertama</span>
            <h2 id="tutorial-title">Selamat datang di NetForge</h2>
            <p>
              Satu shift terdiri dari brief customer, misi topologi, lalu
              laporan. Ikuti lima langkah ini.
            </p>
          </div>
          <span className="tutorial-stamp">01</span>
        </div>

        <ol className="tutorial-steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="tutorial-step-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="tutorial-footer">
          <span>Panduan bisa dibuka lagi lewat tombol Panduan di kantor.</span>
          <button className="tutorial-start" onClick={onClose}>
            Mengerti, mulai shift
          </button>
        </div>
      </section>
    </div>
  )
}
