"use client";

import ExtractionDestinationConfig from "@/components/dataSource/configureSource";
import ExtractedListViewer from "@/components/dataSource/extractedListViewer";
import TasksTable from "@/components/dataSource/tasksTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ExtractionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            DATA PIPELINE
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            extraction/
            <span className="text-[#FFC043]">configure</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            manage data sources, extraction jobs, and enriched company lists
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
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
              extraction_jobs()
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
              extracted_data()
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
                <ExtractionDestinationConfig />
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
                    autoflow/extraction_jobs — zsh
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-base font-mono font-semibold text-[#11181C] mb-1">
                    active_jobs()
                  </h2>
                  <p className="text-xs text-[#687076] font-mono">
                    monitor and manage scheduled or running data extraction jobs
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
                    autoflow/extracted_data — zsh
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-base font-mono font-semibold text-[#11181C] mb-1">
                    extracted_companies()
                  </h2>
                  <p className="text-xs text-[#687076] font-mono">
                    view and manage companies fetched from selected data sources
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
