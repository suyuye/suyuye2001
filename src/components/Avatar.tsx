'use client';

import Image from 'next/image';
import { userConfig } from '@/config/userConfig';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-24 w-24 sm:h-28 sm:w-28',
};

const imgSizes: Record<AvatarSize, number> = {
  sm: 48,
  md: 80,
  lg: 112,
};

interface AvatarProps {
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ size = 'md', className = '' }: AvatarProps) {
  const isUrl = userConfig.avatar.startsWith('http');

  return (
    <div className={className}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-primary-light p-0.5 shadow-lg shadow-primary/30`}>
        {isUrl ? (
          <Image
            src={userConfig.avatar}
            alt={userConfig.name}
            width={imgSizes[size]}
            height={imgSizes[size]}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-card text-2xl font-bold text-primary">
            {userConfig.avatar}
          </div>
        )}
      </div>
    </div>
  );
}
