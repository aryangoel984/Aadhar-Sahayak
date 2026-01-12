"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line, ComposedChart
} from "recharts";
import { Users, Activity, AlertOctagon, TrendingUp, Map, Filter, RefreshCw, Zap } from "lucide-react";

const API_URL = 'http://127.0.0.1:8000/api';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/cc/stats`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin text-blue-600"><RefreshCw/></div></div>;
  if (!data || data.error) return <div className="p-10 text-center text-red-500">Failed to load Command Center Data. Run the database upgrade script.</div>;

  return (
    <div className="p-4 bg-slate-100 min-h-screen space-y-4">
      
      {/* 1️⃣ TOP ROW: KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Enrollments" value={data.kpi.total?.toLocaleString()} sub="Lifetime Data" icon={<Users className="text-blue-600"/>} />
        <KpiCard title="Avg Daily Enrol" value={data.kpi.daily_avg?.toLocaleString()} sub="Est. last 30 days" icon={<Activity className="text-green-600"/>} />
        <KpiCard title="Child/Adult Ratio" value={data.kpi.child_adult_ratio} sub="Demographic Skew" icon={<TrendingUp className="text-orange-600"/>} />
        <KpiCard title="Anomalies Detected" value={data.kpi.anomalies} sub="Districts with High Gaps" icon={<AlertOctagon className="text-red-600"/>} />
      </div>

      {/* 2️⃣ MIDDLE ROW: GEOGRAPHIC + AGE + CORRELATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[400px]">
        
        {/* Geographic Intelligence (Map Proxy) - Span 5 */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2"><Map size={18}/> Geographic Intelligence</h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Top 10 States</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.geo_data} margin={{left: 40}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                <XAxis type="number" hide/>
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}}/>
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px'}}/>
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution - Span 3 */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-2 text-sm">Age Group Structure</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.age_dist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.age_dist.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <span className="text-2xl font-bold text-slate-800">Age</span>
            </div>
          </div>
        </div>

        {/* Correlation Chart - Span 4 */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-2 text-sm">Enrollment vs Biometric Gap</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.corr_data}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" tick={{fontSize: 10}} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" hide/>
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" hide/>
                <Tooltip />
                <Bar yAxisId="left" dataKey="enrollment" barSize={20} fill="#3b82f6" />
                <Line yAxisId="right" type="monotone" dataKey="updates" stroke="#f59e0b" strokeWidth={2}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3️⃣ BOTTOM ROW: ANOMALIES + INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[300px]">
        
        {/* Anomaly Scatter Plot - Span 2 */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><AlertOctagon size={18} className="text-red-500"/> Anomaly Detection (Outliers)</h3>
          <p className="text-xs text-slate-500 mb-2">High Enrollment Districts with Low Biometric Updates (Bubble Size = Standard)</p>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Enrollment" unit="" tick={{fontSize: 10}} />
                <YAxis type="number" dataKey="y" name="Gap" unit="" tick={{fontSize: 10}} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Districts" data={data.scatter_data} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel - Span 1 */}
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <Zap className="text-yellow-400" />
             <h3 className="font-bold text-lg">AI Generated Insights</h3>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.insights.map((insight: string, i: number) => (
              <div key={i} className="bg-slate-700/50 p-3 rounded-lg border-l-4 border-blue-500 text-sm leading-relaxed">
                {insight}
              </div>
            ))}
            <div className="bg-slate-700/50 p-3 rounded-lg border-l-4 border-green-500 text-sm leading-relaxed">
              Recommendation: Deploy mobile biometric update units to the top 3 outlier districts identified in the Scatter Plot.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase">{title}</p>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{value}</h2>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
    </div>
  );
}