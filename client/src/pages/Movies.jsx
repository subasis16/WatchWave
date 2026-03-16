import ContentRow from '../components/ContentRow';
import { movies, bollywood } from '../data/content';

const Movies = () => {
  return (
    <div className="min-h-screen bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden">
      {/* Cinematic Background Field */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 pt-40 pb-24 space-y-20">
        <div className="px-8 md:px-16 lg:px-24 mb-16">
          <div className="max-w-4xl space-y-6">
            <h3 className="text-[10px] font-black tracking-[0.6em] text-gray-600 uppercase">Classic Movies</h3>
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-10">
              Motion <br/> Pictures
            </h1>
            <div className="flex flex-wrap gap-5">
              {['Action Thriller', 'Deep Noir', 'Avant Garde', 'Classic Sci-Fi'].map(tag => (
                <span key={tag} className="glass-pill px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:border-white/20 transition-all border-white/5 shadow-2xl">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-24">
          <ContentRow title="Hollywood Hits" data={movies} />
          <ContentRow title="Bollywood Blockbusters" data={bollywood} />
        </div>
      </div>
    </div>
  );
};

export default Movies;
