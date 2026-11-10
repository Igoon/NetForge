import { useEffect, useState } from 'react'
import { useDialogA11y } from '../lib/useDialogA11y'
import {
  APP_VERSION,
  LATEST_UPDATE,
  VERSION_SEEN_KEY,
} from '../data/version'

export function UpdateNotice() {
  const [notesUnread, setNotesUnread] = useState(() => {
    try {
      return localStorage.getItem(VERSION_SEEN_KEY) !== APP_VERSION
    } catch {
      return true
    }
  })
  const [showNotes, setShowNotes] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
    let cancelled = false
    const hadController = Boolean(navigator.serviceWorker.controller)

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (!registration || cancelled) return
        if (registration.waiting) setUpdateReady(true)
        registration.update().catch(() => undefined)
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && hadController) {
              setUpdateReady(true)
            }
          })
        })
      })
      .catch(() => undefined)

    const onControllerChange = () => {
      if (hadController) setUpdateReady(true)
    }
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange,
    )

    return () => {
      cancelled = true
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      )
    }
  }, [])

  const closeNotes = () => {
    setShowNotes(false)
    setNotesUnread(false)
    try {
      localStorage.setItem(VERSION_SEEN_KEY, APP_VERSION)
    } catch {
      // abaikan
    }
  }
  const dialogRef = useDialogA11y<HTMLElement>(showNotes, closeNotes)

  return (
    <>
      <div className="update-inline">
        {updateReady ? (
          <button
            className="update-ready-button"
            onClick={() => window.location.reload()}
          >
            Update siap · Muat ulang
          </button>
        ) : null}
        <button
          className={`version-badge${notesUnread ? ' is-new' : ''}`}
          onClick={() => setShowNotes(true)}
          title="Lihat catatan pembaruan"
        >
          v{APP_VERSION}
          {notesUnread ? <span className="update-dot" /> : null}
        </button>
      </div>

      {showNotes ? (
        <div
          className="update-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeNotes()
          }}
        >
          <section
            className="update-modal"
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-title"
          >
            <div className="update-head">
              <span className="eyebrow">Catatan pembaruan</span>
              <button className="update-close" onClick={closeNotes}>
                Tutup
              </button>
            </div>
            <strong id="update-title">{LATEST_UPDATE.title}</strong>
            <ul>
              {LATEST_UPDATE.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button className="update-primary" onClick={closeNotes}>
              Mengerti
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

