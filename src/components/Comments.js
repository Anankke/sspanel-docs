import React from 'react';
import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <Giscus
      repo="Anankke/sspanel-docs"
      repoId="R_kgDOPGeMMw"
      category="Announcements"
      categoryId="DIC_kwDOPGeMM84CscsL"
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
      loading="lazy"
    />
  );
}