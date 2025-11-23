import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import { StarIcon, EyeIcon, SparklesIcon, TrophyIcon } from '../components/IconComponents';
import { searchYouTubeVideos, YouTubeVideo } from '../services/youtubeService';
import BookSidebar from '../components/BookSidebar';

// Helper function to parse views string to number
const parseViews = (views: string): number => {
  const match = views.match(/(\d+(?:\.\d+)?)([KM]?)/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'K') return num * 1000;
  if (unit === 'M') return num * 1000000;
  return num;
};

const ResourceCard: React.FC<{ resource: YouTubeVideo }> = ({ resource }) => (
  <Card className="flex flex-col overflow-hidden h-full group">
    <div className="overflow-hidden">
        <img src={resource.thumbnail} alt={resource.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-white/50 mb-1">{resource.provider.toUpperCase()}</span>
      <h3 className="font-bold text-lg mb-3 text-white">{resource.title}</h3>
      
      <div className="my-3 border-l-2 border-purple-400/50 pl-3 space-y-1">
        <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-white/90">AI Insight</p>
        </div>
        <p className="text-sm text-white/70 italic">
          "{resource.aiSummary}"
        </p>
      </div>

      <div className="flex items-center justify-around text-white/90 mt-auto pt-4 border-t border-glass-border">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <TrophyIcon className="text-yellow-400 w-5 h-5" />
            <span className="font-bold text-lg">{resource.rating}</span>
          </div>
          <span className="text-xs text-white/60">RATING</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <EyeIcon className="w-5 h-5"/>
            <span className="font-bold text-lg">{resource.views}</span>
          </div>
          <span className="text-xs text-white/60">VIEWS</span>
        </div>
      </div>
    </div>
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block text-center bg-white/10 font-semibold py-2.5 hover:bg-white/20 transition-colors text-sm">
      Visit Resource
    </a>
  </Card>
);


const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  // Gutendex and EbookModal state removed

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchYouTubeVideos(query).then((fetchedVideos) => {
        setVideos(fetchedVideos);
        setLoading(false);
      });
    }
  }, [query]);

  // Sort videos by rating descending, then by views descending
  const sortedVideos = [...videos].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }
    const viewsA = parseViews(a.views);
    const viewsB = parseViews(b.views);
    return viewsB - viewsA;
  });

  // Top 10 videos
  const topVideos = sortedVideos.slice(0, 10);

  const filteredResults = sortedVideos;

  return (
    <>
      <div className="space-y-8 mr-[300px]">
        <div className="flex-1 min-w-0">
          <Link to="/search" className="text-sm text-white/60 hover:text-white">&larr; Back to Search</Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Results for "{query}"</h1>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">No Results Found</h2>
                <p className="text-white/70">Try searching for another topic or skill.</p>
            </Card>
          )}

          {/* Top Videos Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Top Videos</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {topVideos.map(resource => (
                  <div key={resource.id} className="flex-shrink-0 w-64">
                    <ResourceCard resource={resource} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {query && <BookSidebar query={query} />}
    </>
  );
};

export default Results;