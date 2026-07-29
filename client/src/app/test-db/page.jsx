"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Database,
  XCircle,
  RefreshCw,
  Globe,
  Server,
  ShieldAlert,
  Users,
  Car,
  Fuel,
  ArrowLeft,
  Code,
  Copy,
  Check,
  Zap,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { env } from "@/env";

export default function TestDbPage() {
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState("/test-db");

  const runTest = useCallback(async (endpoint = activeEndpoint) => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || env?.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const baseUrl = rawApiUrl.replace(/\/$/, "");
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const fullUrl = `${baseUrl}${cleanEndpoint}`;

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));

      const responseJson = await res.json().catch(() => ({}));

      if (res.ok) {
        setTestResult(responseJson);
      } else {
        setError(responseJson.message || responseJson.error || `HTTP ${res.status}: Failed to load backend endpoint`);
        setTestResult(responseJson);
      }
    } catch (err) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setError(err instanceof Error ? err.message : "Network error - Unable to reach API server");
      setTestResult(null);
    } finally {
      setLoading(false);
    }
  }, [activeEndpoint]);

  useEffect(() => {
    runTest("/test-db");
  }, [runTest]);

  const handleCopyJson = () => {
    if (!testResult) return;
    navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndpointChange = (endpoint) => {
    setActiveEndpoint(endpoint);
    runTest(endpoint);
  };

  const isDbConnected = testResult?.dbStatus?.isConnected ?? testResult?.dbConnected ?? false;
  const dbName = testResult?.dbStatus?.dbName || "my_finance";
  const usersList = testResult?.data?.users || [];
  const vehiclesList = testResult?.data?.vehicles || [];
  const fuelList = testResult?.data?.fuelExpenses || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  Public API & DB Diagnostics
                </h1>
                <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 bg-indigo-500/10 text-xs px-2 py-0.5">
                  No Login Required
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify CORS headers, MongoDB Atlas connectivity, and backend API queries after deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => runTest()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20 border border-indigo-500/30 gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Re-test Connection
            </Button>
          </div>
        </header>

        {/* Hero Connection Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      testResult && !error ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                      testResult && !error ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  ></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Backend API Connection Status
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {loading
                  ? "Connecting to Backend API..."
                  : testResult && !error
                  ? "Frontend ↔ Backend Connectivity Verified"
                  : "API Connection Issue Detected"}
              </h2>
              <p className="text-sm text-slate-300">
                {testResult?.message || error || "Fetching system status..."}
              </p>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-initial px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                <span className="text-xs text-slate-400 font-mono">Latency</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">
                  {latency !== null ? `${latency} ms` : "—"}
                </span>
              </div>
              <div className="flex-1 md:flex-initial px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                <span className="text-xs text-slate-400 font-mono">MongoDB</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    isDbConnected ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isDbConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Endpoint Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Select Route To Test:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "/api/test-db", value: "/test-db" },
              { label: "/api/public/test-data", value: "/public/test-data" },
              { label: "/api/health", value: "/health" },
            ].map((ep) => (
              <button
                key={ep.value}
                onClick={() => handleEndpointChange(ep.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeEndpoint === ep.value
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30"
                    : "bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {ep.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: API Target */}
          <Card className="bg-slate-900/80 border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>API Endpoint URL</span>
                <Globe className="w-4 h-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xs font-mono font-semibold text-slate-200 truncate">
                {env?.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}
              </div>
              <p className="text-[11px] text-slate-400">
                Target configured in NEXT_PUBLIC_API_URL
              </p>
            </CardContent>
          </Card>

          {/* Card 2: CORS Header */}
          <Card className="bg-slate-900/80 border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>CORS Origin Echo</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-400 truncate">
                {testResult?.requestInfo?.origin || "No Origin Restriction Error"}
              </div>
              <p className="text-[11px] text-slate-400">
                Environment: {testResult?.environment || "development"}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Mongo DB Name */}
          <Card className="bg-slate-900/80 border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Database Name</span>
                <Server className="w-4 h-4 text-purple-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xs font-mono font-semibold text-slate-200">
                {dbName}
              </div>
              <p className="text-[11px] text-slate-400">
                Status: {isDbConnected ? "Active & Queryable" : "Disconnected"}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Total Record Counts */}
          <Card className="bg-slate-900/80 border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>DB Collection Counts</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-indigo-400 font-semibold">Users: {testResult?.counts?.users ?? 0}</span>
                <span className="text-emerald-400 font-semibold">Vehicles: {testResult?.counts?.vehicles ?? 0}</span>
                <span className="text-amber-400 font-semibold">Fuel: {testResult?.counts?.fuelExpenses ?? 0}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Records fetched directly from DB
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert Box if any */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h3 className="font-semibold text-rose-200">API Connection Failed</h3>
              <p className="text-xs text-rose-300/90">{error}</p>
              <p className="text-[11px] text-rose-400/80 pt-1">
                Tip: Check if your server is running and your Vercel/CORS environment variables match <code className="bg-rose-950/80 px-1 py-0.5 rounded">{env?.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}</code>.
              </p>
            </div>
          </div>
        )}

        {/* Data Inspection Section */}
        <Tabs defaultValue="users" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <TabsTrigger value="users" className="gap-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Users className="w-3.5 h-3.5" />
                Users ({usersList.length})
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="gap-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Car className="w-3.5 h-3.5" />
                Vehicles ({vehiclesList.length})
              </TabsTrigger>
              <TabsTrigger value="fuel" className="gap-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Fuel className="w-3.5 h-3.5" />
                Fuel Logs ({fuelList.length})
              </TabsTrigger>
              <TabsTrigger value="json" className="gap-2 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Code className="w-3.5 h-3.5" />
                Raw JSON
              </TabsTrigger>
            </TabsList>

            {testResult?.data?.isUsingFallback && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-xs px-2.5 py-1">
                Note: DB is currently empty; displaying sample structure.
              </Badge>
            )}
          </div>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersList.length > 0 ? (
                usersList.map((user, idx) => (
                  <Card key={user.id || user._id || idx} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="overflow-hidden">
                          <CardTitle className="text-sm font-semibold text-slate-100 truncate">
                            {user.name || "Anonymous User"}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-400 truncate">
                            {user.email}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-400 space-y-1.5 pt-0">
                      <div className="flex justify-between border-t border-slate-800/80 pt-2">
                        <span>User ID:</span>
                        <span className="font-mono text-slate-300">{String(user.id || user._id || "N/A").slice(0, 12)}...</span>
                      </div>
                      {user.createdAt && (
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No user records returned from DB yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehiclesList.length > 0 ? (
                vehiclesList.map((v, idx) => (
                  <Card key={v.id || v._id || idx} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-emerald-400" />
                          <CardTitle className="text-sm font-semibold text-slate-100">
                            {v.make} {v.model}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-500/10 text-xs">
                          {v.year || "N/A"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-400 space-y-1.5 pt-0">
                      <div className="flex justify-between border-t border-slate-800/80 pt-2">
                        <span>License Plate:</span>
                        <span className="font-mono font-semibold text-slate-200">{v.licensePlate || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicle ID:</span>
                        <span className="font-mono text-slate-300">{String(v.id || v._id || "N/A").slice(0, 12)}...</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No vehicle records found in database.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Fuel Tab */}
          <TabsContent value="fuel">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fuelList.length > 0 ? (
                fuelList.map((f, idx) => (
                  <Card key={f.id || f._id || idx} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-5 h-5 text-amber-400" />
                          <CardTitle className="text-sm font-semibold text-slate-100">
                            Fuel Log #{idx + 1}
                          </CardTitle>
                        </div>
                        <span className="font-bold text-amber-400 text-sm">
                          Rs. {f.totalCost?.toLocaleString() || 0}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-400 space-y-1.5 pt-0">
                      <div className="flex justify-between border-t border-slate-800/80 pt-2">
                        <span>Liters Fueled:</span>
                        <span className="font-semibold text-slate-200">{f.quantity || f.liters} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price / Liter:</span>
                        <span className="text-slate-300">Rs. {f.unitPrice || f.pricePerLiter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Odometer Reading:</span>
                        <span className="font-mono text-slate-300">{f.odometer} km</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No fuel logs available in DB.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Raw JSON Tab */}
          <TabsContent value="json">
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-slate-200">Raw API Diagnostic Response</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Complete JSON response from backend endpoint</CardDescription>
                </div>
                <Button
                  onClick={handleCopyJson}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy JSON"}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800 max-h-96">
                  {testResult ? JSON.stringify(testResult, null, 2) : error || "No response data available"}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
