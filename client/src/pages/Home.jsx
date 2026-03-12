import React from 'react';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { trending, anime, movies, series } from '../data/content';

const Home = () => {
  return (
    <div>
      <Hero />
      <div className="relative z-20 -mt-32 space-y-2 bg-gradient-to-t from-deep-black via-deep-black to-transparent pt-12">
        <ContentRow title="Trending Now" data={trending} ranked={true} />
        <ContentRow title="Anime Series" data={anime.slice(0, 5)} />
        <ContentRow title="Blockbuster Movies" data={movies.slice(0, 5)} />
        <ContentRow title="Bingeworthy Series" data={series.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Home;
