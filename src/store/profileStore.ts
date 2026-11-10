import { create } from 'zustand'
import {
  loadProfile,
  recordMission as applyMissionResult,
  saveProfile,
  type MissionResult,
  type Profile,
  type UpgradeId,
} from '../data/profile'
import { buyUpgrade } from '../data/shop'

interface ProfileStore {
  profile: Profile
  recordMission: (levelId: string, score: number) => MissionResult
  buyUpgrade: (upgradeId: UpgradeId) => boolean
}

const initialProfile = loadProfile()

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: initialProfile,

  recordMission: (levelId, score) => {
    const result = applyMissionResult(get().profile, levelId, score)
    if (result.profile !== get().profile) {
      set({ profile: result.profile })
      saveProfile(result.profile)
    }
    return result
  },

  buyUpgrade: (upgradeId) => {
    const result = buyUpgrade(get().profile, upgradeId)
    if (!result.ok) return false
    set({ profile: result.profile })
    saveProfile(result.profile)
    return true
  },
}))
