"use client";

import EnrichmentSourceConfiguaration from "@/components/enrichment/configureSource";
import ExtractedListViewer from "@/components/enrichment/extractedListViewer";
import TasksTable from "@/components/enrichment/tasksTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Enrichment() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            DATA_ENRICHMENT
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            enrichment/<span className="text-[#FFC043]">automation</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            configure and manage data enrichment pipelines
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="inline-flex h-auto gap-0 bg-transparent border-b border-[#E6E8EA] rounded-none w-full justify-start mb-8 p-0">
            <TabsTrigger
              value="setup"
              className="
                px-6 py-3 text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none
                bg-transparent
              "
            >
              source_config()
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="
                px-6 py-3 text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none
                bg-transparent
              "
            >
              enrichment_jobs()
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="
                px-6 py-3 text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none
                bg-transparent
              "
            >
              enriched_data()
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="setup"
            className="mt-0 focus-visible:outline-none"
          >
            <div className="border border-[#E6E8EA] bg-white">
              <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-2 text-xs font-mono text-[#687076]">
                    autoflow/source_config — zsh
                  </span>
                </div>
              </div>
              <div className="p-6">
                <EnrichmentSourceConfiguaration />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-0 focus-visible:outline-none">
            <div className="border border-[#E6E8EA] bg-white">
              <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-2 text-xs font-mono text-[#687076]">
                    autoflow/enrichment_jobs — zsh
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></div>
                    <h2 className="text-sm font-mono font-semibold text-[#11181C] uppercase tracking-wider">
                      active_jobs()
                    </h2>
                  </div>
                  <p className="text-xs text-[#687076] font-mono">
                    monitor jobs that are currently running or scheduled to
                    enrich data
                  </p>
                </div>
                <TasksTable />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0 focus-visible:outline-none">
            <div className="border border-[#E6E8EA] bg-white">
              <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-2 text-xs font-mono text-[#687076]">
                    autoflow/enriched_data — zsh
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></div>
                    <h2 className="text-sm font-mono font-semibold text-[#11181C] uppercase tracking-wider">
                      enriched_companies()
                    </h2>
                  </div>
                  <p className="text-xs text-[#687076] font-mono">
                    view and manage enriched companies from configured sources
                  </p>
                </div>
                <ExtractedListViewer />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
