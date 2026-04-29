'use client';

import Giscus from '@giscus/react';

export function Comments() {
  return (
    <Giscus
      repo="suyuye/suyuye2001"
      repoId="R_kgDOSNFjtQ"
      category="Announcements"
      categoryId="DIC_kwDOSNFjtc4C79kz"
      mapping="pathname"
      theme="preferred_color_scheme"
      lang="zh-CN"
      loading="lazy"
    />
  );
}
