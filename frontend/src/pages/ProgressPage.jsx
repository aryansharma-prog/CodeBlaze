import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function ProgressPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/progress/progress-stats');
        if (data && data.data) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch progress stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Build 52-week activity heatmap from real submission data
  const renderHeatmap = () => {
    const activityMap = stats?.activityMap || {};
    const today = new Date();
    const cells = [];

    // Last 26 weeks (182 days)
    for (let i = 181; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;

      let color = 'bg-[#131620]';
      if (count === 1) color = 'bg-emerald-900/60 border border-emerald-800';
      else if (count === 2) color = 'bg-emerald-700/80 border border-emerald-600';
      else if (count >= 3) color = 'bg-emerald-500 border border-emerald-400';

      cells.push(
        <div
          key={dateStr}
          className={`w-3 h-3 rounded-[3px] ${color} transition-all hover:scale-125 cursor-pointer`}
          title={`${dateStr}: ${count} submission${count === 1 ? '' : 's'}`}
        />
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5 justify-start">
        {cells}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Progress & Mastery Analytics
            </h1>
            <p className="text-xs text-[#9aa0b8] mt-1">
              Detailed tracking of your problem solving volume, submission accuracy, and topic strengths.
            </p>
          </div>

          <NavLink to="/recommendations" className="btn-primary text-xs py-2 px-4">
            <span>✨</span>
            <span>Assess Weaknesses</span>
          </NavLink>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#5e6480]">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin-custom mx-auto mb-2"></div>
            Loading analytics...
          </div>
        ) : stats ? (
          <div className="space-y-6 animate-fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-5">
                <div className="text-[10px] font-mono text-[#5e6480] uppercase">Problems Solved</div>
                <div className="text-2xl font-bold text-white font-mono mt-1">
                  {stats.solvedCount} <span className="text-xs font-normal text-[#5e6480]">/ {stats.totalProblems}</span>
                </div>
              </div>

              <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-5">
                <div className="text-[10px] font-mono text-[#5e6480] uppercase">Acceptance Rate</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                  {stats.acceptanceRate}%
                </div>
              </div>

              <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-5">
                <div className="text-[10px] font-mono text-[#5e6480] uppercase">Active Streak</div>
                <div className="text-2xl font-bold text-amber-400 font-mono mt-1 flex items-center gap-1">
                  <span>🔥</span>
                  <span>{stats.streak} days</span>
                </div>
              </div>

              <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-5">
                <div className="text-[10px] font-mono text-[#5e6480] uppercase">Total Submissions</div>
                <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                  {stats.totalSubmissions}
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown & Heatmap Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Difficulty Breakdown Card */}
              <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white">Difficulty Breakdown</h2>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[#9aa0b8] mb-1">
                      <span className="text-emerald-400 font-bold">Easy</span>
                      <span>{stats.easySolved} Solved</span>
                    </div>
                    <div className="w-full bg-[#131620] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, stats.easySolved * 15)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#9aa0b8] mb-1">
                      <span className="text-amber-400 font-bold">Medium</span>
                      <span>{stats.mediumSolved} Solved</span>
                    </div>
                    <div className="w-full bg-[#131620] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, stats.mediumSolved * 20)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#9aa0b8] mb-1">
                      <span className="text-red-400 font-bold">Hard</span>
                      <span>{stats.hardSolved} Solved</span>
                    </div>
                    <div className="w-full bg-[#131620] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, stats.hardSolved * 30)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Heatmap Card */}
              <div className="md:col-span-2 bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Submission Activity Heatmap</h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5e6480]">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#131620]"></div>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800"></div>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600"></div>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400"></div>
                    <span>More</span>
                  </div>
                </div>
                <div className="overflow-x-auto py-2">
                  {renderHeatmap()}
                </div>
              </div>
            </div>

            {/* Topic Mastery Grid */}
            <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Topic Performance Mastery</h2>
                <span className="text-xs text-[#5e6480] font-mono">Calculated from assessments & solved problems</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                {stats.topicStats?.map((t, idx) => (
                  <div key={idx} className="bg-[#131620] border border-[#1c202e] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{t.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                        t.score >= 80 ? 'text-emerald-400 bg-emerald-500/10' : t.score >= 60 ? 'text-indigo-400 bg-indigo-500/10' : t.score >= 40 ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'
                      }`}>
                        {t.score}%
                      </span>
                    </div>

                    <div className="w-full bg-[#1a1e2b] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          t.score >= 80 ? 'bg-emerald-500' : t.score >= 60 ? 'bg-indigo-500' : t.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(5, t.score)}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-[#5e6480] flex justify-between">
                      <span>{t.solvedCount} solved</span>
                      <span className="capitalize">{t.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-[#5e6480] font-mono">
            Please sign in to view your progress analytics.
          </div>
        )}
      </main>
    </div>
  );
}
