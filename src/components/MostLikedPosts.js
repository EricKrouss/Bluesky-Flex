import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css'; // Make sure to import your CSS

const MostLikedPosts = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Ref to check if the embed script has been added
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const apiBaseUrl = 'https://public.api.bsky.app';

        // Feed URI for "All-Time Bangers"
        const feedUri =
          'at://did:plc:q6gjnaw2blty4crticxkmujt/app.bsky.feed.generator/at-bangers';

        // Fetch the feed without authentication
        const response = await axios.get(
          `${apiBaseUrl}/xrpc/app.bsky.feed.getFeed`,
          {
            params: {
              feed: feedUri,
              limit: 20,
            },
          }
        );

        let posts = response.data.feed || [];

        // Extract likeCount directly from the post data
        posts = posts.map((item) => ({
          ...item,
          likeCount: item.post.likeCount || 0,
        }));

        // Sort posts based on likeCount in descending order
        posts.sort((a, b) => b.likeCount - a.likeCount);

        setTopPosts(posts);
      } catch (err) {
        console.error('Error fetching top posts:', err);
        setError('Failed to fetch top posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  useEffect(() => {
    // Add the Bluesky embed script if it's not already added
    if (!scriptAddedRef.current && topPosts.length > 0 && !loading) {
      const script = document.createElement('script');
      script.src = 'https://embed.bsky.app/static/embed.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
      scriptAddedRef.current = true;
    }
  }, [topPosts, loading]);

  return (
    <div className="mlp-container">
      <h1 className="mlp-title">Most Liked Posts</h1>
      {error && <p className="mlp-error">{error}</p>}

      {loading ? (
        <div className="mlp-liked-posts-list">
          {/* Loading State */}
          <div className="loading-card">
            <p>Loading posts...</p>
          </div>
        </div>
      ) : (
        <div className="mlp-liked-posts-list">
          {topPosts.map((item, index) => {
            const post = item.post;

            // Extract AT URI and CID
            const atUri = post.uri;
            const cid = post.cid;

            return (
              <div key={post.uri} className="mlp-liked-post-card">
<div className="mlp-liked-post-rank">
            #{index + 1} {index === 0 && '👑'}
          </div>
                {/* Embed the post */}
                <blockquote
                  className="mlp-bluesky-embed"
                  data-bluesky-uri={atUri}
                  data-bluesky-cid={cid}
                >
                  <p>Loading post...</p>
                </blockquote>

                {/* Likes Count */}
                <p className="mlp-posts">❤️ {item.likeCount !== null ? item.likeCount : 'N/A'}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MostLikedPosts;