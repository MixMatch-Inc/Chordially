import { http, HttpResponse, delay } from 'msw'
import { faker } from '@faker-js/faker'
import type {
  UserProfile,
  SwipeResponse,
  LoginResponse,
} from '@/lib/api-schema'

type HandlerOptions = {
  direction: string
}

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

export const handlers = [
  http.post('/api/auth/login', async () => {
    await delay(300)

    const response: LoginResponse = {
      token: faker.string.uuid(),
      user: createFakeUser(),
    }
    return HttpResponse.json(response)
  }),

  http.get('/api/users/potential-matches', async () => {
    await delay(500)
    const users = Array.from({ length: 10 }, createFakeUser)
    return HttpResponse.json({ users })
  }),

  http.post('/api/swipes', async ({ request }) => {
    await delay(200)

    const swipeData = await request.json()
    console.log('Swipe Action Recorded (Mock):', swipeData)

    const isMatch = Math.random() < 0.2
    const direction = (swipeData as HandlerOptions)?.direction

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
