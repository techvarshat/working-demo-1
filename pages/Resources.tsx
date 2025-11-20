import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { StarIcon, EyeIcon, CodeIcon, DesignIcon, DataIcon } from '../components/IconComponents';
import { searchYouTubeVideos, YouTubeVideo } from '../services/youtubeService';

const ResourceCard: React.FC<{ resource: YouTubeVideo }> = ({ resource }) => (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block w-64 flex-shrink-0">
        <Card className="flex flex-col overflow-hidden h-full">
            <img src={resource.thumbnail} alt={resource.title} className="w-full h-32 object-cover" />
            <div className="p-3 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-white/50 mb-1">{resource.provider.toUpperCase()}</span>
                <h3 className="font-bold text-base mb-2 text-white flex-grow">{resource.title}</h3>
                <div className="flex items-center justify-between text-xs text-white/70 mt-auto">
                    <div className="flex items-center gap-1">
                        <StarIcon className="text-yellow-400 w-4 h-4" />
                        <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4"/>
                        <span>{resource.views}</span>
                    </div>
                </div>
            </div>
        </Card>
    </a>
);

const CategorySection: React.FC<{ title: string; icon: React.ReactNode; resources: YouTubeVideo[] }> = ({ title, icon, resources }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="bg-glass-bg border border-glass-border p-2 rounded-lg">{icon}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    </div>
);

const Resources: React.FC = () => {
    const [resources, setResources] = useState<{ [key: string]: YouTubeVideo[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            const categories = [
                { name: 'Web Development', query: 'web development tutorial' },
                { name: 'UI/UX Design', query: 'ui ux design tutorial' },
                { name: 'Data Science', query: 'data science tutorial' }
            ];

            const fetchedResources: { [key: string]: YouTubeVideo[] } = {};

            for (const category of categories) {
                const videos = await searchYouTubeVideos(category.query);
                fetchedResources[category.name] = videos.slice(0, 5);
            }

            setResources(fetchedResources);
            setLoading(false);
        };

        fetchResources();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

  return (
    <div className="space-y-12">
        <h1 className="text-3xl md:text-4xl font-bold">Popular Resources</h1>
        <CategorySection title="Web Development" icon={<CodeIcon />} resources={resources['Web Development'] || []} />
        <CategorySection title="UI/UX Design" icon={<DesignIcon />} resources={resources['UI/UX Design'] || []} />
        <CategorySection title="Data Science" icon={<DataIcon />} resources={resources['Data Science'] || []} />
    </div>
  );
};

export default Resources;
