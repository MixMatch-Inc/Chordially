/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  PotentialMatchesResponse,
  SwipeRequest,
  SwipeResponse,
  UserProfile,
} from '@/lib/api-schema'
import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import MusicCard from './MusicCard'
import { useAuthStore } from '@/stores/auth-store'

const fetchPotentialMatches = async (): Promise<UserProfile[]> => {
  const res = await fetch('/api/users/potential-matches')
  if (!res.ok) throw new Error('Network response was not ok')
  const data: PotentialMatchesResponse = await res.json()
  return data.users
}

const postSwipe = async (
  swipe: SwipeRequest
): Promise<{ res: SwipeResponse; swipedUser: UserProfile }> => {
  const swipedUser = (swipe as any).swipedUser
  const res = await fetch('/api/swipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: swipe.userId, direction: swipe.direction }),
  })
  if (!res.ok) throw new Error('Swipe failed')
  return { res: await res.json(), swipedUser }
}

export default function SwipeDeck() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const queryClient = useQueryClient()
  const openMatchModal = useAuthStore((state) => state.openMatchModal)

  const { isLoading, isError } = useQuery({
    queryKey: ['potentialMatches'],
    queryFn: fetchPotentialMatches,
    onSuccess: (data: UserProfile[]) => {
      setUsers(data)
    },
  })

  const swipeMutation = useMutation({
    mutationFn: postSwipe,
    onSuccess: ({ res, swipedUser }) => {
      if (res.isMatch) {
        openMatchModal(swipedUser)
      }

      queryClient.prefetchQuery({
        queryKey: ['potentialMatches'],
        queryFn: fetchPotentialMatches,
      })
    },
    onError: (error) => {
      console.error('Swipe mutation failed:', error)
    },
  })

  const onSwipe = (direction: 'left' | 'right') => {
    if (users.length === 0) return

    const swipedUser = users[0]
    swipeMutation.mutate({
      userId: swipedUser.id,
      direction,
      swipedUser: swipedUser as any,
    })

    setUsers((prevUsers) => prevUsers.slice(1))

    if (users.length <= 3) {
      queryClient.invalidateQueries({ queryKey: ['potentialMatches'] })
    }
  }

  if (isLoading)
    return <div className='text-center'>Finding potential matches...</div>
  if (isError)
    return <div className='text-center text-red-500'>Something went wrong.</div>

  return (
    <div className='relative w-full max-w-sm h-[500px] mx-auto'>
      <AnimatePresence>
        {users.length > 0 ? (
          users
            .map((user, index) => {
              if (index === 0) {
                return (
                  <DraggableCard key={user.id} user={user} onSwipe={onSwipe} />
                )
              }
              return (
                <motion.div
                  key={user.id}
                  className='absolute inset-0'
                  style={{
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                    zIndex: -index,
                  }}
                >
                  <MusicCard user={user} />
                </motion.div>
              )
            })
            .reverse()
        ) : (
          <div className='text-center'>
            No more users to show. Come back later!
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DraggableCard({
  user,
  onSwipe,
}: {
  user: UserProfile
  onSwipe: (direction: 'left' | 'right') => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  return (
    <motion.div
      className='absolute inset-0 cursor-grab'
      drag='x'
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          onSwipe('right')
        } else if (info.offset.x < -100) {
          onSwipe('left')
        }
      }}
    >
      <MusicCard user={user} />
    </motion.div>
  )
}
