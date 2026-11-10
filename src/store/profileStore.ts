import { create } from 'zustand'
import {
  loadProfile,
  recordMission as applyMissionResult,
  saveProfile,
  type MissionResult,
  type Profile,
} from '../data/profile'

interface ProfileStore {
  profile: Profile
  recordMission: (
    levelId: string,
    score: number,
    stars: number,
  ) => MissionResult
}

const initialProfile = loadProfile()

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: initialProfile,

  recordMission: (levelId, score, stars) => {
    const result = applyMissionResult(get().profile, levelId, score, stars)
    if (result.profile !== get().profile) {
      set({ profile: result.profile })
      saveProfile(result.profile)
    }
    return result
  },
}))
