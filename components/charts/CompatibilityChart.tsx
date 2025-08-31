'use client'

import type { CompatibilityDetails } from '@/lib/api-schema'
import { Group } from '@visx/group'
import { scaleLinear, scalePoint } from '@visx/scale'
import { Line, Polygon } from '@visx/shape'
import { Text } from '@visx/text'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface CompatibilityChartProps {
  details: CompatibilityDetails
  width: number
  height: number
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(angle: number, radius: number) {
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
}

export default function CompatibilityChart({
  details,
  width,
  height,
}: CompatibilityChartProps) {
  const data = useMemo(
    () => [
      { label: 'Genre', score: details.genre.score },
      { label: 'Era', score: details.era.score },
      { label: 'Artist', score: details.artist.score },
      { label: 'Obscurity', score: details.obscurity.score },
    ],
    [details]
  )

  const margin = { top: 60, right: 60, bottom: 60, left: 60 }
  const centerX = width / 2
  const centerY = height / 2
  const radius =
    Math.min(width, height) / 2 - Math.max(...Object.values(margin))

  // Define scales
  const angleScale = scalePoint({
    domain: data.map((d) => d.label),
    range: [0, 2 * Math.PI],
  })

  const radiusScale = scaleLinear({
    domain: [0, 100],
    range: [0, radius],
  })

  // Generate points for the polygon
  const polygonPoints = data.map((d) => {
    const angle = angleScale(d.label)! - Math.PI / 2
    const r = radiusScale(d.score)
    const { x, y } = polarToCartesian(angle, r)
    return { x: centerX + x, y: centerY + y }
  })

  const pointsString = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ')

  // Levels for the radar grid
  const levels = [25, 50, 75, 100]

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        {/* Radar grid lines */}
        {levels.map((level, i) => (
          <circle
            key={i}
            r={radiusScale(level)}
            fill='none'
            stroke='white'
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        ))}
        {/* Axis lines and labels */}
        {data.map((d, i) => {
          const angle = angleScale(d.label)! - Math.PI / 2
          const point = polarToCartesian(angle, radius + 10)
          return (
            <Group key={i}>
              <Line
                from={{ x: 0, y: 0 }}
                to={point}
                stroke='white'
                strokeOpacity={0.3}
              />
              <Text
                x={point.x}
                y={point.y}
                verticalAnchor='middle'
                textAnchor='middle'
                fill='white'
                fontSize={12}
                fontWeight='bold'
              >
                {d.label}
              </Text>
            </Group>
          )
        })}
        {/* Data polygon with animation */}
        <motion.polygon
          points={pointsString}
          fill='rgba(255, 255, 255, 0.4)'
          stroke='white'
          strokeWidth={2}
          initial={{
            points: data.map(() => `${centerX},${centerY}`).join(' '),
          }}
          animate={{
            points: pointsString,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        />
      </Group>
    </svg>
  )
}
