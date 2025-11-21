import React from 'react';
import { UserProgress, ShopItem, Achievement } from '../types';
import { SHOP_ITEMS, ACHIEVEMENTS, ICONS, THEMES } from '../constants';
import { Lock, Unlock, Check, Coins, ArrowRight } from 'lucide-react';

interface GamificationHubProps {
  progress: UserProgress;
  onBuy: (item: ShopItem) => void;
  onEquipTheme: (themeId: string) => void;
  onEquipIcon: (iconId: string) => void;
  onBack: () => void;
}

const GamificationHub: React.FC<GamificationHubProps> = ({ progress, onBuy, onEquipTheme, onEquipIcon, onBack }) => {
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-blue-600 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
           <ArrowRight className="transform rotate-180" /> חזרה
        </button>
        <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2 shadow-sm border border-yellow-200">
          <Coins className="fill-yellow-500 text-yellow-600" />
          {progress.totalPoints} נקודות
        </div>
      </div>

      {/* Achievements Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ההישגים שלי</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = progress.achievements.includes(ach.id);
            return (
              <div key={ach.id} className={`p-4 rounded-xl border-2 flex items-center gap-4 ${isUnlocked ? 'bg-white border-yellow-400 shadow-md' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-300 text-gray-500'}`}>
                  {isUnlocked ? <Unlock size={24} /> : <Lock size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ach.title}</h3>
                  <p className="text-sm text-gray-600">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">חנות הנקודות</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SHOP_ITEMS.map(item => {
            const isUnlocked = item.type === 'theme' ? progress.unlockedThemes.includes(item.value) : progress.unlockedIcons.includes(item.value);
            const isEquipped = item.type === 'theme' ? progress.currentTheme === item.value : progress.currentIcon === item.value;
            const canAfford = progress.totalPoints >= item.cost;

            const ItemIcon = item.type === 'icon' ? ICONS[item.value] : null;

            return (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition hover:scale-105">
                <div className="mb-4">
                  {item.type === 'theme' ? (
                    <div className={`w-16 h-16 rounded-full border-4 border-gray-200 ${THEMES[item.value].split(' ')[0]}`}></div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                      {ItemIcon && <ItemIcon size={32} />}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                
                {isUnlocked ? (
                  <button 
                    onClick={() => item.type === 'theme' ? onEquipTheme(item.value) : onEquipIcon(item.value)}
                    disabled={isEquipped}
                    className={`mt-auto w-full py-2 rounded-lg font-bold transition ${isEquipped ? 'bg-gray-200 text-gray-500 cursor-default' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                    {isEquipped ? <span className="flex items-center justify-center gap-1"><Check size={18} /> בשימוש</span> : 'השתמש'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`mt-auto w-full py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${canAfford ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    <span>{item.cost}</span> <Coins size={16} /> קנה
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default GamificationHub;