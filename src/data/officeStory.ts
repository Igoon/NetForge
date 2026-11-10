export type OfficeBriefing = 'listen' | 'inspect'

export interface OfficeChoice {
  id: OfficeBriefing
  label: string
  reply: string
  note: string
}

export interface OfficeNpc {
  id: string
  name: string
  role: string
  line: string
  shirt: string
  hair: string
  skin: string
  position: 'left' | 'center' | 'right'
}

export const OFFICE_BRIEFINGS: Record<OfficeBriefing, OfficeChoice> = {
  listen: {
    id: 'listen',
    label: 'Dengarkan keluhan',
    reply:
      'Pelanggan jadi lebih tenang. Iga mencatat bahwa yang paling penting bukan hanya koneksi, tapi layanan yang tidak mengulang masalah.',
    note:
      'Briefing: dengarkan keluhan pelanggan. Iga tahu masalah mana yang paling mengganggu mereka.',
  },
  inspect: {
    id: 'inspect',
    label: 'Periksa perlengkapan',
    reply:
      'Iga memeriksa kabel, konektor, dan alat di tas. Tidak ada yang mau mengulang perjalanan karena alat kurang.',
    note:
      'Briefing: periksa perlengkapan lebih dulu. Iga lebih siap menghadapi gangguan teknis.',
  },
}

export const OFFICE_NPCS: OfficeNpc[] = [
  {
    id: 'iga',
    name: 'Iga',
    role: 'Teknisi jaringan',
    line:
      'Papan order ada di dinding. Kalau pelanggan sudah bicara, dengarkan dulu sebelum menyentuh kabel.',
    shirt: '#0f766e',
    hair: '#2b2f36',
    skin: '#f2c6a0',
    position: 'center',
  },
  {
    id: 'rani',
    name: 'Mbak Rani',
    role: 'Admin kantor',
    line:
      'Pelanggan sering bingung menjelaskan masalahnya. Tanya perlahan, jangan langsung menyimpulkan.',
    shirt: '#b7791f',
    hair: '#3c2a21',
    skin: '#e8b98c',
    position: 'left',
  },
  {
    id: 'darma',
    name: 'Pak Darma',
    role: 'Teknisi senior',
    line:
      'Periksa rak dan kabel sebelum berangkat. Alat yang rapi menghemat satu perjalanan pulang.',
    shirt: '#6b5b95',
    hair: '#252525',
    skin: '#d9a273',
    position: 'right',
  },
]

export function briefingNote(briefing: OfficeBriefing | null): string | null {
  return briefing ? OFFICE_BRIEFINGS[briefing].note : null
}
