export type UserProfile = {
  id: string
  name: string
  age: number
  bio: string
  avatarUrl: string
  musicProfile: MusicProfile
}

export type MusicProfile = {
  anthem: Track
  topArtists: Artist[]
  topGenres: string[]
  obscurityScore: number
}

export type Track = {
  id: string
  title: string
  artist: string
  albumArtUrl: string
  previewUrl: string
}

export type Artist = {
  id: string
  name: string
  imageUrl: string
}

export type PotentialMatchesResponse = {
  users: UserProfile[]
}

export type SwipeRequest = {
  userId: string
  direction: 'left' | 'right'
}

export type LoginResponse = {
  token: string
  user: UserProfile
}

export type Match = {
  id: string
  user: UserProfile
}

export type Message = {
  id: string
  tempId?: string
  matchId: string
  senderId: string
  text: string
  timestamp: string
  status?: 'sending' | 'failed'
}

export type ProfileUpdateRequest = {
  bio: string
}
export type CompatibilityDetails = {
  genre: { score: number; overlap: string[] }
  era: { score: number }
  artist: { score: number; overlap: string[] }
  obscurity: { score: number }
}

export type SwipeResponse = {
  isMatch: boolean
  matchId?: string
  // Add the new compatibility details
  compatibilityDetails?: CompatibilityDetails
}
