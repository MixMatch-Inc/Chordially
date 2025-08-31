'use client'

import { useAuthStore } from '@/stores/auth-store'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

export default function MatchModal() {
  const { isMatchModalOpen, matchedUser, closeMatchModal } = useAuthStore()

  return (
    <AnimatePresence>
      {isMatchModalOpen && matchedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
          onClick={closeMatchModal}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className='bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-2xl text-white text-center shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className='text-4xl font-bold mb-4'>It&apos;s a Chord!</h1>
            <p className='text-lg mb-6'>
              You and {matchedUser.name} have matched!
            </p>
            <div className='flex justify-center items-center space-x-4'>
              <Image
                src={
                  useAuthStore.getState().user?.avatarUrl ||
                  '/default-avatar.png'
                }
                alt='Your avatar'
                width={100}
                height={100}
                className='rounded-full border-4 border-white'
              />
              <Image
                src={matchedUser.avatarUrl}
                alt={matchedUser.name}
                width={100}
                height={100}
                className='rounded-full border-4 border-white'
              />
            </div>
            <button
              onClick={closeMatchModal}
              className='mt-8 bg-white text-purple-600 font-bold py-2 px-6 rounded-full'
            >
              Keep Swiping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
