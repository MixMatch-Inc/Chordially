import { http, HttpResponse, delay, Match, Message } from 'msw'
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

const FAKE_MATCHES: Match[] = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  user: createFakeUser(),
}))
let FAKE_LOGGED_IN_USER_PROFILE = createFakeUser()


const FAKE_MESSAGES: Record<string, Message[]> = FAKE_MATCHES.reduce(
  (acc, match) => {
    acc[match.id] = Array.from(
      { length: faker.number.int({ min: 5, max: 15 }) },
      (_, i) => {
        const isMe = i % 2 === 0
        return {
          id: faker.string.uuid(),
          matchId: match.id,
          senderId: isMe ? 'me' : match.user.id,
          text: faker.lorem.sentence(),
          timestamp: faker.date.past().toISOString(),
        }
      }
    )
    return acc
  },
  {} as Record<string, Message[]>
)

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

  http.get('/api/matches', async () => {
    await delay(300)
    return HttpResponse.json(FAKE_MATCHES)
  }),

  http.get('/api/matches/:matchId/messages', async ({ params }) => {
    const { matchId } = params
    await delay(400)
    const messages = FAKE_MESSAGES[matchId as string] || []
    return HttpResponse.json(messages)
  }),

  http.post('/api/matches/:matchId/messages', async ({ request, params }) => {
    const { matchId } = params
    const { text, tempId } = (await request.json()) as {
      text: string
      tempId: string
    }

    if (Math.random() < 0.25) {
      await delay(1000)
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Network Error',
      })
    }

     // 7. Handler for getting the current user's profile
  http.get('/api/profile', async () => {
    await delay(200)
    return HttpResponse.json(FAKE_LOGGED_IN_USER_PROFILE)
  }),

   // 8. Handler for updating the user's profile
  http.patch('/api/profile', async ({ request }) => {
    const { bio } = (await request.json()) as ProfileUpdateRequest

    // Simulate network failure 30% of the time to test rollbacks
    if (Math.random() < 0.3) {
      await delay(1500)
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' })
    }

    const newMessage: Message = {
      id: faker.string.uuid(),
      tempId,
      matchId: matchId as string,
      senderId: 'me',
      text,
      timestamp: new Date().toISOString(),
    }

    if (FAKE_MESSAGES[matchId as string]) {
      FAKE_MESSAGES[matchId as string].push(newMessage)
    }

    // Update our fake user and return the updated profile
    FAKE_LOGGED_IN_USER_PROFILE.bio = bio
    await delay(1000)
    return HttpResponse.json(FAKE_LOGGED_IN_USER_PROFILE)
  }),
  }),
]
