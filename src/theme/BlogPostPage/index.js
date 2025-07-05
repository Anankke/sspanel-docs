import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import Comments from '@site/src/components/Comments';

export default function BlogPostPageWrapper(props) {
  return (
    <>
      <BlogPostPage {...props} />
      <Comments />
    </>
  );
}