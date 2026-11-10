import { useState } from 'react'
import { CUSTOMER_ORDERS } from '../data/customers'
import type { Profile } from '../data/profile'
import {
  OFFICE_BRIEFINGS,
  OFFICE_NPCS,
  briefingNote,
  npcLineFor,
  officeTier,
  storyBeatFor,
  type OfficeBriefing,
  type OfficeNpc,
} from '../data/officeStory'
import { useDialogA11y } from '../lib/useDialogA11y'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { OfficeRoomArt } from './OfficeRoomArt'
import { PixelSprite } from './PixelSprite'

interface OfficeRoomProps {
  onOpenOrder: () => void
}

type Dialogue =
  | {
      kind: 'npc'
      name: string
      role: string
      line: string
    }
  | {
      kind: 'customer'
    }

function npcDialogue(npc: OfficeNpc, profile: Profile): Dialogue {
  return {
    kind: 'npc',
    name: npc.name,
    role: npc.role,
    line: npcLineFor(npc.id, profile),
  }
}

function npcLook(name: string) {
  if (name === 'Iga') {
    return { variant: 'iga' as const, shirt: '#0f766e', hair: '#2b2f36', skin: '#f2c6a0' }
  }
  if (name === 'Mbak Rani') {
    return { variant: 'rani' as const, shirt: '#b7791f', hair: '#3c2a21', skin: '#e8b98c' }
  }
  if (name === 'Pak Darma') {
    return { variant: 'darma' as const, shirt: '#6b5b95', hair: '#252525', skin: '#d9a273' }
  }
  return { variant: 'customer' as const, shirt: '#2f7a57', hair: '#2b2f36', skin: '#e8b98c' }
}

export function OfficeRoom({ onOpenOrder }: OfficeRoomProps) {
  const levelId = useGameStore((state) => state.levelId)
  const orderAccepted = useGameStore((state) => state.orderAccepted)
  const briefing = useGameStore((state) => state.officeBriefing)
  const setOfficeBriefing = useGameStore((state) => state.setOfficeBriefing)
  const profile = useProfileStore((state) => state.profile)
  const [dialogue, setDialogue] = useState<Dialogue | null>(null)
  const [customerReply, setCustomerReply] = useState<string | null>(null)
  const order = CUSTOMER_ORDERS[levelId]
  const customer = order?.customer
  const npc = dialogue?.kind === 'npc' ? dialogue : null
  const note = briefingNote(briefing)
  const story = storyBeatFor(profile)
  const tier = officeTier(profile)

  const closeDialogue = () => {
    setDialogue(null)
    setCustomerReply(null)
  }

  const openCustomer = () => {
    if (!customer) return
    setCustomerReply(null)
    setDialogue({ kind: 'customer' })
  }

  const chooseBriefing = (choice: OfficeBriefing) => {
    const selected = OFFICE_BRIEFINGS[choice]
    setOfficeBriefing(choice)
    setCustomerReply(selected.reply)
  }

  const openOrder = () => {
    closeDialogue()
    onOpenOrder()
  }

  const dialogueRef = useDialogA11y<HTMLElement>(
    Boolean(dialogue),
    closeDialogue,
  )

  return (
    <div className="office-room" data-tier={tier}>
      <OfficeRoomArt
        cableTray={profile.upgrades.cableTray}
        ups={profile.upgrades.ups}
        tier={tier}
      />

      <div className="office-room-top">
        <div>
          <span className="office-room-kicker">
            Kantor NetForge / shift {profile.day}
          </span>
          <strong>Ruang kerja Iga</strong>
          <small>{story.title}</small>
        </div>
        <button className="office-room-board-button" onClick={onOpenOrder}>
          Papan order
        </button>
      </div>

      {OFFICE_NPCS.map((npc) => (
        <button
          className={`office-actor office-actor-${npc.position}`}
          key={npc.id}
          onClick={() => setDialogue(npcDialogue(npc, profile))}
          aria-label={`Sapa ${npc.name}`}
        >
          <PixelSprite
            variant={
              npc.id === 'iga' ? 'iga' : npc.id === 'rani' ? 'rani' : 'darma'
            }
            shirt={npc.shirt}
            hair={npc.hair}
            skin={npc.skin}
          />
          <span className="office-actor-tag">{npc.name}</span>
        </button>
      ))}

      {customer && !orderAccepted ? (
        <button
          className="office-actor office-actor-customer is-arriving"
          onClick={openCustomer}
          aria-label={`Temui ${customer.name}, ${customer.role}`}
        >
          <span className="office-actor-alert" aria-hidden="true">
            !
          </span>
          <PixelSprite
            variant="customer"
            shirt={customer.shirt}
            hair={customer.hair}
            skin={customer.skin}
          />
          <span className="office-actor-tag">{customer.name}</span>
        </button>
      ) : null}

      <button
        className="office-board-hotspot"
        onClick={onOpenOrder}
        aria-label="Buka papan order dari dinding"
      >
        <span>ORDER</span>
      </button>

      {!dialogue ? (
        <div className="office-room-footer">
          <div className="office-room-briefing">
            <span className="office-room-briefing-label">
              {note ? 'Catatan briefing' : 'Jurnal shift'}
            </span>
            <p>{note ?? story.line}</p>
          </div>
          <div className="office-room-footer-actions">
            <button
              className="office-room-secondary"
              onClick={() =>
                setDialogue({
                  kind: 'npc',
                  name: 'Rak server',
                  role: 'Perlengkapan kantor',
                  line:
                    'Kabel cadangan, tester, dan label ada di sini. Iga mengecek perlengkapan sebelum berangkat.',
                })
              }
            >
              Inspeksi rak
            </button>
            <button className="office-room-cta" onClick={onOpenOrder}>
              Buka papan order
            </button>
          </div>
        </div>
      ) : null}

      {dialogue ? (
        <section
          className="office-dialogue"
          ref={dialogueRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="office-dialogue-name"
        >
          <div className="office-dialogue-portrait">
            {dialogue.kind === 'customer' && customer ? (
              <PixelSprite
                variant="customer"
                shirt={customer.shirt}
                hair={customer.hair}
                skin={customer.skin}
              />
            ) : npc ? (
              <PixelSprite {...npcLook(npc.name)} />
            ) : null}
          </div>

          <div className="office-dialogue-body">
            <div className="office-dialogue-head">
              <div>
                <span className="office-dialogue-role">
                  {dialogue.kind === 'customer'
                    ? (customer?.role ?? 'Pelanggan')
                    : dialogue.role}
                </span>
                <strong id="office-dialogue-name">
                  {dialogue.kind === 'customer'
                    ? (customer?.name ?? 'Pelanggan')
                    : dialogue.name}
                </strong>
              </div>
              <button className="office-dialogue-close" onClick={closeDialogue}>
                Tutup
              </button>
            </div>

            <p className="office-dialogue-line">
              {dialogue.kind === 'customer'
                ? (customerReply ?? customer?.line ?? 'Ada yang bisa dibantu?')
                : dialogue.line}
            </p>

            {dialogue.kind === 'customer' ? (
              <>
                <div className="office-dialogue-choices">
                  {(Object.keys(OFFICE_BRIEFINGS) as OfficeBriefing[]).map(
                    (choice) => {
                      const item = OFFICE_BRIEFINGS[choice]
                      return (
                        <button
                          className={`office-dialogue-choice${
                            briefing === choice ? ' is-selected' : ''
                          }`}
                          key={choice}
                          onClick={() => chooseBriefing(choice)}
                          aria-pressed={briefing === choice}
                        >
                          {item.label}
                        </button>
                      )
                    },
                  )}
                </div>

                {note ? (
                  <p className="office-briefing-note">{note}</p>
                ) : (
                  <p className="office-dialogue-prompt">
                    Pilih satu pendekatan sebelum berangkat.
                  </p>
                )}
              </>
            ) : null}

            <div className="office-dialogue-actions">
              {dialogue.kind === 'customer' ? (
                <button className="office-dialogue-primary" onClick={openOrder}>
                  Buka papan order
                </button>
              ) : (
                <button className="office-dialogue-primary" onClick={closeDialogue}>
                  Mengerti
                </button>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
