import React from 'react';
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import { cn } from '@/lib/utils';

export default function RatingComponent({ rating }) {
  const max_rating = 5;
  const colors_rating = ["text-red-500", "text-orange-500", "text-yellow-500", "text-blue-500", "text-green-500"];
  const star_colors_className = cn("", colors_rating[rating-1]);
  return (
    <div className='flex gap-x-2'>
      {Array.from({ length: rating}).map((_, index) => (
        <div key={index}>
          <StarFilledIcon className={star_colors_className} />
        </div>
      ))}
      {Array.from({ length: max_rating - rating}).map((_, index) => (
        <div key={index}>
          <StarIcon />
        </div>
      ))}
    </div>
  )
}
