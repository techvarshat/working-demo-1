import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  rating: number; // calculated rating out of 10
  provider: string;
  category: string;
  aiSummary: string;
  url: string;
}

export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 50,
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY,
      },
    });

    // Expanded educational keywords from provided JSON
    const educationalKeywords = [
      "how to", "tutorial", "step by step", "beginner guide", "for beginners", "training", "learn", "lesson", "basics", "intro", "introduction", "techniques", "tips and tricks", "practice", "walkthrough", "instruction", "demonstration", "guide", "masterclass", "beginner tutorial", "quick start", "improve skills", "essential skills", "fundamentals", "start here", "best way to learn", "easy method", "simple method", "explained", "in depth", "stepwise", "hands on", "real example", "example based", "detailed tutorial", "expert tips", "complete guide", "full course", "training session", "learning session", "how it works", "how to do", "practice drill", "technique drill", "beginner exercises", "advanced techniques", "problem solving", "common mistakes", "avoid mistakes", "skill development", "professional guide", "beginner friendly", "quicker learning"
    ];

    const exclusionKeywords = [
      'funny', 'prank', 'meme', 'music', 'song', 'dance', 'entertainment', 'comedy', 'reaction'
    ];

    const videos = detailsResponse.data.items
      .filter((item: any) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();

        // Match any educational keyword in title or description
        const isEducational = educationalKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        const isExcluded = exclusionKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));

        return isEducational && !isExcluded;
      })
      .map((item: any) => {
        const views = parseInt(item.statistics.viewCount) || 0;
        const likes = parseInt(item.statistics.likeCount) || 0;
        const dislikes = parseInt(item.statistics.dislikeCount) || 0;

        // Calculate rating based on engagement
        const viewScore = Math.min(views / 1000000, 1) * 4;
        const likeScore = Math.min(likes / 100000, 1) * 3;
        const engagementScore = (likes / (likes + dislikes + 1)) * 3;

        const rating = Math.round((viewScore + likeScore + engagementScore) * 10) / 10;

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          views: formatViews(views),
          rating: Math.min(rating, 10),
          provider: 'YouTube',
          category: 'Educational',
          aiSummary: `Watch ${item.snippet.title} on YouTube.`,
          url: `https://www.youtube.com/watch?v=${item.id}`,
        };
      });

    // Sort by rating descending
    videos.sort((a, b) => b.rating - a.rating);

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0') || 0;
  const minutes = parseInt(match[2] || '0') || 0;
  const seconds = parseInt(match[3] || '0') || 0;
  return hours * 60 + minutes + seconds / 60;
};
