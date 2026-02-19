/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Info, Scale, Ruler, AlertCircle, CheckCircle2, AlertTriangle, Zap, Clock, Activity, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type IMTCategory = 'Kurus' | 'Normal' | 'Overweight' | 'Obesitas' | 'Unknown';
type WorkloadCategory = 'Ringan' | 'Sedang' | 'Berat' | 'None';

interface WorkloadInfo {
  id: WorkloadCategory;
  label: string;
  min: number;
  max: number;
  examples: string[];
  color: string;
  bgColor: string;
}

const WORKLOADS: Record<WorkloadCategory, WorkloadInfo> = {
  Ringan: {
    id: 'Ringan',
    label: 'Beban Kerja Ringan (I)',
    min: 100,
    max: 200,
    examples: ['Menulis', 'Merajut', 'Menyetrika', 'Mengetik', 'Menyapu lantai', 'Menggergaji (duduk)'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  Sedang: {
    id: 'Sedang',
    label: 'Beban Kerja Sedang (II)',
    min: 200,
    max: 350,
    examples: ['Menggergaji (berdiri)', 'Memukul paku', 'Menambal logam', 'Mengemas barang', 'Memompa', 'Menempa besi'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  Berat: {
    id: 'Berat',
    label: 'Beban Kerja Berat (III)',
    min: 350,
    max: 500,
    examples: ['Mengepel (2 tangan)', 'Membersihkan karpet', 'Menggali lubang', 'Menebang pohon', 'Mendorong kereta muatan'],
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  None: {
    id: 'None',
    label: 'Pilih Beban Kerja',
    min: 0,
    max: 0,
    examples: [],
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
  }
};

interface MenuRecommendation {
  calories: number;
  items: { name: string; cal: number }[];
}

const MENU_RECOMMENDATIONS: MenuRecommendation[] = [
  {
    calories: 400,
    items: [
      { name: '1 roti gandum isi telur & selada', cal: 250 },
      { name: '1 pisang ukuran sedang', cal: 100 },
      { name: 'Teh manis hangat', cal: 50 },
    ],
  },
  {
    calories: 800,
    items: [
      { name: 'Nasi putih 150 gr', cal: 250 },
      { name: 'Ayam goreng 1 potong sedang', cal: 250 },
      { name: 'Tumis sayur', cal: 100 },
      { name: 'Tahu goreng', cal: 100 },
      { name: 'Jus jeruk', cal: 100 },
    ],
  },
  {
    calories: 1200,
    items: [
      { name: 'Nasi putih 200 gr', cal: 330 },
      { name: 'Daging sapi semur 100 gr', cal: 250 },
      { name: 'Tempe goreng', cal: 150 },
      { name: 'Sayur sop', cal: 150 },
      { name: 'Susu full cream', cal: 200 },
      { name: 'Buah', cal: 120 },
    ],
  },
  {
    calories: 1800,
    items: [
      { name: 'Nasi putih 300 gr', cal: 500 },
      { name: 'Ayam bakar 1 potong besar', cal: 350 },
      { name: 'Telur dadar', cal: 200 },
      { name: 'Tumis kangkung', cal: 150 },
      { name: 'Tempe goreng', cal: 200 },
      { name: 'Jus alpukat', cal: 400 },
    ],
  },
  {
    calories: 2500,
    items: [
      { name: 'Nasi putih 400 gr', cal: 660 },
      { name: 'Daging rendang 150 gr', cal: 450 },
      { name: 'Ayam goreng', cal: 300 },
      { name: 'Tempe & tahu', cal: 300 },
      { name: 'Sayur lodeh', cal: 250 },
      { name: 'Susu + roti', cal: 540 },
    ],
  },
  {
    calories: 3500,
    items: [
      { name: 'Nasi putih 600 gr', cal: 1000 },
      { name: 'Rendang 200 gr', cal: 600 },
      { name: 'Ayam goreng besar', cal: 400 },
      { name: 'Telur 2 butir', cal: 300 },
      { name: 'Tempe goreng', cal: 300 },
      { name: 'Sayur', cal: 200 },
      { name: 'Jus alpukat + susu', cal: 500 },
      { name: 'Snack kacang', cal: 200 },
    ],
  },
  {
    calories: 4500,
    items: [
      { name: 'Nasi putih 800 gr', cal: 1300 },
      { name: 'Rendang 250 gr', cal: 750 },
      { name: 'Ayam goreng besar', cal: 400 },
      { name: 'Telur 3 butir', cal: 450 },
      { name: 'Tempe + tahu', cal: 400 },
      { name: 'Sayur bersantan', cal: 300 },
      { name: 'Susu 2 gelas', cal: 400 },
      { name: 'Roti + selai kacang', cal: 300 },
      { name: 'Jus alpukat + madu', cal: 500 },
    ],
  },
];

interface CategoryInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  icon: React.ReactNode;
}

const CATEGORIES: Record<IMTCategory, CategoryInfo> = {
  Kurus: {
    label: 'Kurus',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Berat badan Anda di bawah rentang normal. Disarankan untuk meningkatkan asupan nutrisi seimbang.',
    icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
  },
  Normal: {
    label: 'Normal',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Selamat! Berat badan Anda berada dalam rentang ideal. Pertahankan pola makan dan olahraga rutin.',
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  },
  Overweight: {
    label: 'Overweight',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Berat badan Anda sedikit melebihi batas normal. Perhatikan porsi makan dan tingkatkan aktivitas fisik.',
    icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
  },
  Obesitas: {
    label: 'Obesitas',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Berat badan Anda masuk kategori obesitas. Sebaiknya konsultasikan dengan ahli gizi atau dokter.',
    icon: <AlertCircle className="w-6 h-6 text-red-600" />,
  },
  Unknown: {
    label: '-',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    description: 'Masukkan data untuk melihat hasil.',
    icon: <Info className="w-6 h-6 text-gray-400" />,
  },
};

export default function App() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [workload, setWorkload] = useState<WorkloadCategory>('None');
  const [duration, setDuration] = useState<string>('4');

  const bmiResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m

    if (isNaN(w) || isNaN(h) || h === 0) return null;

    const bmi = w / (h * h);
    return parseFloat(bmi.toFixed(1));
  }, [weight, height]);

  const calorieResult = useMemo(() => {
    const d = parseFloat(duration);
    if (workload === 'None' || isNaN(d) || d < 4) return null;

    const info = WORKLOADS[workload];
    return {
      min: info.min * d,
      max: info.max * d
    };
  }, [workload, duration]);

  const recommendedMenu = useMemo(() => {
    if (!calorieResult) return null;
    const target = calorieResult.min;
    
    // Find the closest menu threshold that is <= target, or the smallest one
    let bestMatch = MENU_RECOMMENDATIONS[0];
    for (const menu of MENU_RECOMMENDATIONS) {
      if (menu.calories <= target) {
        bestMatch = menu;
      } else {
        break;
      }
    }
    return bestMatch;
  }, [calorieResult]);

  const category = useMemo((): IMTCategory => {
    if (bmiResult === null) return 'Unknown';
    
    // Based on user's requested ranges:
    // Kurus (<17,0)
    // Normal (18,5 - 25,0)
    // Overweight (25,1 - 27,0)
    // Obesitas (>27,0)
    
    if (bmiResult < 18.5) return 'Kurus';
    if (bmiResult >= 18.5 && bmiResult <= 25.0) return 'Normal';
    if (bmiResult > 25.0 && bmiResult <= 27.0) return 'Overweight';
    return 'Obesitas';
  }, [bmiResult]);

  const currentCategory = CATEGORIES[category];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Calculator className="w-3 h-3" />
            Standar Kemenkes RI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Kalkulator <span className="text-emerald-600">IMT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 max-w-md mx-auto"
          >
            Hitung Indeks Massa Tubuh Anda untuk mengetahui status gizi berdasarkan standar populasi Indonesia.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" /> Status Gizi (IMT)
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Tinggi Badan (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Klasifikasi IMT Indonesia</h3>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-medium uppercase tracking-wider">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">Kurus: &lt; 18.5</div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">Normal: 18.5 - 25.0</div>
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-100">Overweight: 25.1 - 27.0</div>
                  <div className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-100">Obesitas: &gt; 27.0</div>
                </div>
              </div>
            </div>

            {/* Calorie Needs Input */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" /> Kebutuhan Tambahan Kalori Kerja
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Jenis Beban Kerja
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['Ringan', 'Sedang', 'Berat'] as WorkloadCategory[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setWorkload(type)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          workload === type 
                            ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-bold text-sm">{WORKLOADS[type].label}</div>
                        <div className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                          {WORKLOADS[type].examples.join(', ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Durasi Kerja (Jam/Hari)
                  </label>
                  <input
                    type="number"
                    min="4"
                    placeholder="Minimal 4 jam"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
                  />
                  {parseFloat(duration) < 4 && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Minimal 4 jam sesuai standar SNI
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6 sticky top-8"
          >
            {/* BMI Result */}
            <div className={`p-8 rounded-3xl shadow-sm border transition-colors duration-500 ${bmiResult ? 'bg-white border-stone-200' : 'bg-stone-100 border-transparent'}`}>
              <div className="text-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Skor IMT Anda</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bmiResult ?? 'none'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-7xl font-light tracking-tighter mb-4"
                  >
                    {bmiResult ?? '--.-'}
                  </motion.div>
                </AnimatePresence>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-500 ${currentCategory.bgColor} ${currentCategory.color}`}>
                  {currentCategory.icon}
                  {currentCategory.label}
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <p className="text-sm text-stone-600 leading-relaxed italic">
                  "{currentCategory.description}"
                </p>
              </div>
            </div>

            {/* Calorie Result */}
            <div className={`p-8 rounded-3xl shadow-sm border transition-colors duration-500 ${calorieResult ? 'bg-white border-stone-200' : 'bg-stone-100 border-transparent'}`}>
              <div className="text-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Estimasi Kalori Kerja</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={calorieResult ? `${calorieResult.min}-${calorieResult.max}` : 'none'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-4xl font-light tracking-tighter mb-4"
                  >
                    {calorieResult ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>{calorieResult.min}</span>
                        <span className="text-stone-300 text-2xl">-</span>
                        <span>{calorieResult.max}</span>
                      </div>
                    ) : '-- - --'}
                    <span className="text-sm font-bold text-stone-400 uppercase tracking-widest block mt-1">kkal / hari</span>
                  </motion.div>
                </AnimatePresence>
                
                {workload !== 'None' && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all duration-500 ${WORKLOADS[workload].bgColor} ${WORKLOADS[workload].color}`}>
                    {WORKLOADS[workload].label}
                  </div>
                )}
              </div>

              {workload !== 'None' && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Contoh Aktivitas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {WORKLOADS[workload].examples.map(ex => (
                      <span key={ex} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-[10px] border border-stone-200">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Recommendation */}
            <AnimatePresence>
              {recommendedMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-emerald-600" /> Rekomendasi Menu Asupan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <span className="text-sm font-bold text-emerald-700">Target Menu</span>
                      <span className="text-lg font-bold text-emerald-700">{recommendedMenu.calories} kkal</span>
                    </div>
                    <div className="space-y-2">
                      {recommendedMenu.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 text-sm border-b border-stone-50 last:border-0">
                          <span className="text-stone-600">{item.name}</span>
                          <span className="font-mono text-xs text-stone-400">{item.cal} kkal</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-400 italic mt-4">
                      * Menu ini adalah rekomendasi asupan tambahan untuk menyeimbangkan energi yang dikeluarkan selama bekerja.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Mengapa IMT Penting?
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Indeks Massa Tubuh (IMT) yang tidak ideal sangat berkaitan erat dengan risiko <span className="text-white font-bold underline decoration-emerald-400 underline-offset-2">Hipertensi</span>. Menjaga IMT dalam rentang normal adalah langkah kunci dalam mengontrol tekanan darah dan mencegah komplikasi kardiovaskular.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-800 rounded-full opacity-50 blur-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-stone-200 text-center text-stone-400 text-xs">
          <p>© {new Date().getFullYear()} Kalkulator IMT Indonesia. Dibuat sesuai standar kesehatan masyarakat Indonesia.</p>
        </footer>
      </main>
    </div>
  );
}
