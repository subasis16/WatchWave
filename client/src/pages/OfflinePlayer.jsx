import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OfflinePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoUrl, title } = location.state || {};

  useEffect(() => {
    if (!videoUrl) {
      navigate('/downloads');
    }
    return () => {
       if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl, navigate]);

  if (!videoUrl) return null;

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden w-[100vw] h-[100vh]">
      <div className="absolute top-0 left-0 w-full p-8 z-50 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
         <div className="flex items-center gap-6">
             <button onClick={() => navigate(-1)} className="w-12 h-12 glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors rounded-2xl border-white/10 shadow-2xl">
                 <ArrowLeft size={24} />
             </button>
             <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/80">{title || 'Offline Vault'}</h2>
         </div>
         <div className="glass-pill px-6 py-2 border-accent-gold/20 text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold shadow-[0_0_20px_rgba(255,215,0,0.1)]">
             Vault Storage Active
         </div>
      </div>
      
      <video 
         src={videoUrl} 
         controls 
         autoPlay 
         className="w-full h-full object-contain"
         controlsList="nodownload" 
      />
    </div>
  );
};

export default OfflinePlayer;
