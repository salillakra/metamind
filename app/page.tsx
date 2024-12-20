// pages/index.js
import React from 'react';
import PostCard from './components/PostCard';

const HomePage = () => {
  const posts = [
    {
      title: 'Luci: A Captivating Cinematic Gem',
      author: 'Salil Lakra',
      category: 'Technology',
      imageURL: 'https://res.cloudinary.com/dyu2yky4h/image/upload/v1734690866/MetaMind/zowgynkbts5hfnaoswps.jpg',
      tags: ['dog', 'cat'],
      content: 'A deep dive into the movie Luci, exploring its plot, direction, performances, and themes...',
      createdAt: '2024-12-20T10:38:40.658Z',
    },
    {
      title: 'Exploring the Future of AI',
      author: 'John Doe',
      category: 'AI & Machine Learning',
      imageURL: 'https://res.cloudinary.com/dyu2yky4h/image/upload/v1734690866/MetaMind/sample-image.jpg',
      tags: ['AI', 'future'],
      content: 'This article discusses the advancements in AI, its impact on various industries, and future possibilities...',
      createdAt: '2024-12-18T10:30:40.658Z',
    },
    // Add more posts here...
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-screen-lg mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8">Latest Posts</h1>
        {posts.map((post, index) => (
          <PostCard
            key={index}
            title={post.title}
            author={post.author}
            category={post.category}
            imageURL={post.imageURL}
            tags={post.tags}
            content={post.content}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
