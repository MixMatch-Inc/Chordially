import type { Message } from '@/lib/api-schema'

export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === 'me'
  const alignment = isMe ? 'justify-end' : 'justify-start'
  const colors = isMe
    ? 'bg-blue-500 text-white'
    : 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white'

  return (
    <div className={`flex ${alignment} mb-4`}>
      <div className={`rounded-lg px-4 py-2 max-w-sm ${colors}`}>
        <p>{message.text}</p>
        {message.status && (
          <p className='text-xs text-right opacity-75 mt-1'>
            {message.status}...
          </p>
        )}
      </div>
    </div>
  )
}
