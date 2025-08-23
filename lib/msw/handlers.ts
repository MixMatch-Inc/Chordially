import { http, HttpResponse, delay } from 'msw'
import { faker } from '@faker-js/faker'
import type {
  UserProfile,
  SwipeResponse,
  LoginResponse,
} from '@/lib/api-schema'

const createFakeUser = (): UserProfile => {
  const topGenres = [
    faker.music.genre(),
    faker.music.genre(),
    faker.music.genre(),
  ]

  const uniqueTopGenres = [...new Set(topGenres)]

  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    age: faker.number.int({ min: 18, max: 40 }),
    bio: faker.lorem.paragraph(),
    avatarUrl: faker.image.avatar(),
    musicProfile: {
      anthem: {
        id: faker.string.uuid(),
        title: faker.music.songName(),
        artist: faker.person.fullName(),
        albumArtUrl: faker.image.urlLoremFlickr({ category: 'music' }),
        previewUrl: 'https://p.scdn.co/mp3-preview/1',
      },
      topArtists: Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        imageUrl: faker.image.urlLoremFlickr({ category: 'people' }),
      })),
      topGenres: uniqueTopGenres,
      obscurityScore: faker.number.int({ min: 0, max: 100 }),
    },
  }
}

// Define all the API handlers
export const handlers = [
  // 1. Handler for user login
  http.post('/api/auth/login', async () => {
    // Simulate network delay
    await delay(300)

    const response: LoginResponse = {
      token: faker.string.uuid(),
      user: createFakeUser(), // Return a fake user profile on login
    }
    return HttpResponse.json(response)
  }),

  // 2. Handler for getting potential matches (the swipe deck)
  http.get('/api/users/potential-matches', async () => {
    await delay(500)
    const users = Array.from({ length: 10 }, createFakeUser)
    return HttpResponse.json({ users })
  }),

  // 3. Handler for swipe actions
  http.post('/api/swipes', async ({ request }) => {
    await delay(200)

    const swipeData = await request.json()
    console.log('Swipe Action Recorded (Mock):', swipeData)

    // Let's simulate a match roughly 20% of the time on a right swipe
    const isMatch = Math.random() < 0.2
    const direction = (swipeData as any)?.direction

    let response: SwipeResponse

    if (direction === 'right' && isMatch) {
      response = {
        isMatch: true,
        matchId: faker.string.uuid(),
      }
    } else {
      response = {
        isMatch: false,
      }
    }

    return HttpResponse.json(response)
  }),
]
