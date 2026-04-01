"use client";

import EnrichmentSourceConfiguaration from "@/components/enrichment/configureSource";
import ExtractedListViewer from "@/components/enrichment/extractedListViewer";
import TasksTable from "@/components/enrichment/tasksTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Enrichment() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <h1 className="text-3xl font-bold text-purple-900 mb-8 tracking-tight">
        ✨ Enrichment Automation
      </h1>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="bg-white border border-purple-200 rounded-2xl shadow-md p-1 flex gap-2 justify-between mb-8">
          <TabsTrigger
            value="setup"
            className="flex-1 text-purple-800 font-medium data-[state=active]:bg-purple-100 data-[state=active]:shadow-inner rounded-xl py-3 transition-all"
          >
            🧩 Setup Source
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="flex-1 text-purple-800 font-medium data-[state=active]:bg-purple-100 data-[state=active]:shadow-inner rounded-xl py-3 transition-all"
          >
            🛠 Jobs
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="flex-1 text-purple-800 font-medium data-[state=active]:bg-purple-100 data-[state=active]:shadow-inner rounded-xl py-3 transition-all"
          >
            📄 List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all">
            <EnrichmentSourceConfiguaration />
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="p-6 rounded-2xl bg-white border border-purple-100 text-purple-700 shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-2">
              📋 Active & Scheduled Jobs
            </h2>
            <p className="text-sm text-purple-500 mb-4">
              Monitor jobs that are currently running or scheduled to enrich
              data.
            </p>
            <TasksTable />
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="p-6 rounded-2xl bg-white border border-purple-100 text-purple-700 shadow transition-all">
            <h2 className="text-xl font-semibold mb-2">
              🏢 Enriched Companies
            </h2>
            <p className="text-sm text-purple-500 mb-4">
              View and manage enriched companies from your configured sources.
            </p>
            <ExtractedListViewer />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
