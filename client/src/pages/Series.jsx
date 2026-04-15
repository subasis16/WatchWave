import React, { useState, useEffect } from 'react';
import ContentRow from '../components/ContentRow';
import { series, trendingSeries, newReleaseSeries, indianSeries, hollywoodActionSeries, hollywoodCrimeSeries, tvComedy } from '../data/content';
import { useTranslation } from '../utils/i18n';
import { getContentByType } from '../services/firebase-services';

const Series = () => {
  const { t } = useTranslation();
  const [dbSeries, setDbSeries] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getContentByType('series');
        setDbSeries(data);
      } catch (err) {
        console.error("Error fetching series from Firestore:", err);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden font-sans">
      {/* Cinematic Background Field */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 md:pt-40 pb-24 space-y-12 md:space-y-20">
        <div className="px-6 md:px-16 lg:px-24 mb-10 md:mb-16">
          <div className="max-w-4xl space-y-4 md:space-y-6">
            <h3 className="text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] text-gray-600 uppercase">{t('Archive / Episodic Screens')}</h3>
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-6 md:mb-10">
              {t('Playback')} <br/> {t('Series')}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-5">
              {[t('Classic Drama'), t('Cinematic Thriller'), t('Crime Docu'), t('Anthology')].map(tag => (
                <span key={tag} className="glass-pill px-4 md:px-6 py-2 md:py-2.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 hover:text-white hover:border-white/20 transition-all border-white/5 shadow-2xl">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12 pb-12">
          {dbSeries.length > 0 && <ContentRow title={t('Curated Originals')} data={dbSeries} />}
          <ContentRow title={t('New Releases')} data={newReleaseSeries} />
          <ContentRow title={t('Indian Originals')} data={indianSeries} />
          <ContentRow title={t('Hollywood Action')} data={hollywoodActionSeries} />
          <ContentRow title={t('Crime & Investigation')} data={hollywoodCrimeSeries} />
          <ContentRow title={t('Hit Comedies')} data={tvComedy} />
        </div>
      </div>
    </div>
  );
};

export default Series;
