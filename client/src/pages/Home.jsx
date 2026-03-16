import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { trending, anime, movies, series, bollywood } from '../data/content';

const Home = () => {
  return (
    <div className="min-h-screen bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden relative">
      {/* Cinematic Background Field */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 pb-20">
        <Hero />
        <div className="mt-12 space-y-2">
          <ContentRow title="Now Trending" data={trending.slice(0, 5)} ranked={true} />
          <ContentRow title="Absolute Classics" data={movies.slice(0, 5)} />
          <ContentRow title="Anime World" data={anime.slice(0, 5)} />
          <ContentRow title="Bingeworthy Series" data={series.slice(0, 5)} />
          <ContentRow title="Bollywood Hits" data={bollywood.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

export default Home;
