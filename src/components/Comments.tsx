'use client';

import { useSyncExternalStore } from 'react';
import Giscus from '@giscus/react';

/**
 * Giscus 评论。
 *
 * 之前这里写死 `theme="preferred_color_scheme"`，用户切到深色模式时评论区仍是浅色。
 * 现在直接跟随站点主题。
 *
 * 主题源直接读 `<html class="dark">`，而不是 ThemeProvider 的 state：
 * ThemeProvider 的首帧内联脚本在 hydration 前就把 class 打好了，
 * 读 DOM 能拿到真实值，且不引入 setState-in-effect（项目约定：这类需求
 * 不要塞进 useEffect，会触发级联渲染）。
 *
 * 踩坑记录：@giscus/react 用 Lit 实现，@property 默认 reflect: false，
 * 所以宿主的 theme 属性永远停在初始值，别拿它判断有没有联动。
 * 判断是否生效看两件事：giscus.app/themes/{light,dark}.css 的加载 + iframe 像素变暗。
 */

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// SSR 阶段读不到 DOM。ThemeProvider 的内联脚本保证首帧前 class 已就位，
// 客户端 hydration 时 useSyncExternalStore 会自动用真实值重渲染。
function getServerSnapshot(): 'light' | 'dark' {
  return 'light';
}

export function Comments() {
  const giscusTheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Giscus
      // 注意：这些值必须与 giscus 后台配置一致。
      // userConfig.giscus 里是占位符（YOUR_REPO_ID），不要从那里读。
      repo="suyuye/suyuye2001"
      repoId="R_kgDOSNFjtQ"
      category="Announcements"
      categoryId="DIC_kwDOSNFjtc4C79kz"
      mapping="pathname"
      theme={giscusTheme}
      lang="zh-CN"
      loading="lazy"
      // 不把页面 URL 回传给 GitHub：mapping 用 pathname 已经够定位评论了
      // 注意 BooleanString 的类型是字符串 '0'/'1'，不是布尔值也不是数字
      emitMetadata="0"
      // 关闭严格模式，同一篇文章的评论不按 issue 标题再分叉
      strict="0"
    />
  );
}
