'use client'

import type { UserProfile } from '@/lib/api-schema'
import { profileFormSchema, type ProfileFormValues } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

// This is our API function for the mutation
const updateProfile = async (data: ProfileFormValues): Promise<UserProfile> => {
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Server error: Failed to update profile.')
  return res.json()
}

interface ProfileFormProps {
  profile: UserProfile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: profile.bio || '',
    },
  })

  const mutation = useMutation({
    mutationFn: updateProfile,
    // --- The Optimistic Update Logic ---
    onMutate: async (newProfileData) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      // 2. Snapshot the previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile'])

      // 3. Optimistically update to the new value
      queryClient.setQueryData<UserProfile>(['profile'], (old) =>
        old ? { ...old, ...newProfileData } : undefined
      )

      // 4. Return a context object with the snapshotted value
      return { previousProfile }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
        // You can also show a toast notification here
        alert('Update failed! Your changes have been reverted.')
      }
    },
    // Always refetch after error or success to ensure server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    mutation.mutate(data)
  }

  // We get the latest profile data directly from the query cache
  const currentProfile = queryClient.getQueryData<UserProfile>(['profile'])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <label
          htmlFor='bio'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Your Bio
        </label>
        <textarea
          id='bio'
          {...register('bio')}
          rows={4}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600'
          defaultValue={currentProfile?.bio}
        />
        {errors.bio && (
          <p className='mt-2 text-sm text-red-600'>{errors.bio.message}</p>
        )}
      </div>

      <div>
        <button
          type='submit'
          disabled={isSubmitting || mutation.isPending}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400'
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
