import { LEVELS } from './levels'
import { totalStars, type Profile } from './profile'

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

export interface OfficeStoryBeat {
  id: string
  title: string
  line: string
  npcs: Record<'iga' | 'rani' | 'darma', string>
}

const START_BEAT: OfficeStoryBeat = {
  id: 'start',
  title: 'Hari pertama di NetForge',
  line:
    'Meja masih rapi, papan order masih kosong, dan pelanggan pertama sudah menunggu di depan.',
  npcs: {
    iga: 'Papan order ada di dinding. Kalau pelanggan sudah bicara, dengarkan dulu sebelum menyentuh kabel.',
    rani: 'Pelanggan sering bingung menjelaskan masalahnya. Tanya perlahan, jangan langsung menyimpulkan.',
    darma: 'Periksa rak dan kabel sebelum berangkat. Alat yang rapi menghemat satu perjalanan pulang.',
  },
}

export const OFFICE_STORY_BEATS: Record<string, OfficeStoryBeat> = {
  start: START_BEAT,
  'first-cable': {
    id: 'first-cable',
    title: 'Kabar dari kafe',
    line:
      'Kafe Bu Sari kembali ramai. Kabar tentang teknisi muda di ujung jalan mulai menyebar.',
    npcs: {
      iga: 'Order pertama beres. Papan order mulai terisi, tapi aku belum boleh santai.',
      rani: 'Bu Sari menelepon lagi. Katanya koneksi kafe stabil sejak kemarin.',
      darma: 'Satu kabel rapi tidak membuat jaringan sempurna. Tapi setidaknya kita mulai dari tempat yang benar.',
    },
  },
  'tiny-switch': {
    id: 'tiny-switch',
    title: 'Kantor yang lebih tenang',
    line:
      'Kantor Pak Hasan berhenti berteriak soal kabel. Rani menempel catatan baru di papan order.',
    npcs: {
      iga: 'Switch kecil, dampak besar. Sekarang aku penasaran dengan jaringan yang lebih rumit.',
      rani: 'Pak Hasan mengirim pesan terima kasih. Dia menyebut kabel kita lebih rapi dari kabel kantor sebelah.',
      darma: 'Satu titik temu yang benar bisa menyelamatkan satu ruangan. Ingat itu.',
    },
  },
  'two-subnets': {
    id: 'two-subnets',
    title: 'Dua ruang, satu percakapan',
    line:
      'Ruang depan dan ruang belakang kini terhubung. Darma menyebut ini awal dari jaringan yang serius.',
    npcs: {
      iga: 'Gateway-nya bekerja. Aku mulai bisa membaca alur paket tanpa menebak-nebak.',
      rani: 'Bu Rina memesan kopi untuk tim. Katanya dia tidak perlu lagi bolak-balik antar ruang.',
      darma: 'Routing bukan sulap. Kalau jalurnya jelas, siapa pun bisa memeriksanya.',
    },
  },
  'dhcp-office': {
    id: 'dhcp-office',
    title: 'Alamat yang datang sendiri',
    line:
      'Tiga PC baru langsung mendapat alamat tanpa diketik satu per satu. Rani menyimpan kopi ekstra untuk shift panjang.',
    npcs: {
      iga: 'DHCP menghemat banyak waktu. Tapi aku tetap mencatat alamat penting di buku.',
      rani: 'Bu Nia bilang timnya bisa langsung bekerja. Tidak ada lagi IP yang bentrok.',
      darma: 'Otomatis itu enak. Pastikan kamu tetap tahu apa yang terjadi saat otomatisnya berhenti.',
    },
  },
  'guest-vlan': {
    id: 'guest-vlan',
    title: 'Nama yang mulai dikenal',
    line:
      'Tamu hotel tidak lagi bisa menyentuh jaringan staf. Untuk pertama kalinya, NetForge terasa seperti tempat yang layak dipercaya.',
    npcs: {
      iga: 'VLAN tamu tertutup rapat. Ini bukan lagi latihan; ini jaringan yang dipakai orang banyak.',
      rani: 'Bu Maya merekomendasikan kita ke pemilik hotel lain. Papan order akan semakin ramai.',
      darma: 'Kerja rapi hari ini adalah iklan untuk besok. Jangan biarkan reputasi mengalahkan kebiasaan baik.',
    },
  },
  'cafe-expansion': {
    id: 'cafe-expansion',
    title: 'Pelanggan tetap pertama',
    line:
      'Kafe Bu Sari kini punya dua lantai dan satu jaringan. Pelanggan pertama itu kembali menjadi pelanggan tetap.',
    npcs: {
      iga: 'Bu Sari percaya pada kita untuk kafe yang lebih besar. Kali ini tidak boleh ada kabel yang menggantung.',
      rani: 'Bu Sari bilang kafe cabangnya akan dibuka bulan depan. Kita harus siap dengan order yang lebih sering.',
      darma: 'Pelanggan yang kembali adalah tanda kerja kita diingat. Jaga kebiasaan rapi itu.',
    },
  },
}

export function storyBeatFor(profile: Profile): OfficeStoryBeat {
  const cleared = LEVELS.filter(
    (level) => (profile.levels[level.id]?.completions ?? 0) > 0,
  )
  const latest = cleared[cleared.length - 1]
  return OFFICE_STORY_BEATS[latest?.id ?? 'start'] ?? START_BEAT
}

export function npcLineFor(
  npcId: string,
  profile: Profile,
): string {
  const beat = storyBeatFor(profile)
  if (npcId === 'iga' || npcId === 'rani' || npcId === 'darma') {
    return beat.npcs[npcId]
  }
  return START_BEAT.npcs.iga
}

export function officeTier(profile: Profile): 0 | 1 | 2 | 3 {
  const stars = totalStars(profile)
  if (stars >= 9) return 3
  if (stars >= 5) return 2
  if (stars >= 1) return 1
  return 0
}