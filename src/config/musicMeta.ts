// ============================================================
// 音乐元数据映射字典
// 键 = GitHub 仓库中去除 .mp3 后缀的文件名
// 值 = { title, artist, cover }
// 未在此配置的文件将使用自动生成的 fallback
// ============================================================

export interface MusicMetaEntry {
  title: string;
  artist: string;
  cover: string;
}

export const musicMeta: Record<string, MusicMetaEntry> = {
  // 左边带引号的是你传到 GitHub 里的全名（不带 .mp3），右边是你希望在网页上显示的真实信息
  "zhou_jie_lun_0_1_yi_fu_zhi_ming": {
    title: "以父之名",
    artist: "周杰伦",
    cover: "https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/jay_chou_cover.jpg", // 这是一个临时的高级感黑色唱片封面，你可以换成自己的
  },
  
  "zhou_jie_lun_0_3_an_hao": {
    title: "暗号",
    artist: "周杰伦",
    cover: "https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/jay_chou_cover.jpg",
  },
  
  "zhou_jie_lun_0_9_long_juan_feng": {
    title: "龙卷风",
    artist: "周杰伦",
    cover: "https://cdn.jsdelivr.net/gh/suyuye/blog-images@main/img/jay_chou_cover.jpg",
  }
};