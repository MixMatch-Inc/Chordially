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

export type SwipeResponse = {
  isMatch: boolean
  matchId?: string
}

export type LoginResponse = {
  token: string
  user: UserProfile
}
