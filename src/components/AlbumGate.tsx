'use client';

import { useState, useCallback } from 'react';
import { AlbumGrid } from './AlbumGrid';
import type { AlbumPhoto } from './AlbumGrid';

const PASSWORD = process.env.NEXT_PUBLIC_ALBUM_PASSWORD || '20010411';

export function AlbumGate({ photos }: { photos: AlbumPhoto[] }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(() => {
    if (input === PASSWORD) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  }, [input]);

  if (isAuthorized) {
    return <AlbumGrid photos={photos} />;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <div className="card p-8 text-center space-y-5">
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-text-primary">需要密码</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              此相册已设为私密，请输入密码查看
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              placeholder="请输入密码"
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-primary"
            />

            {error && (
              <p className="text-xs text-red-500">密码错误，请重试</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
