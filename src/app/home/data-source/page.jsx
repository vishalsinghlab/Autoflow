"use client";

import ExtractionDestinationConfig from "@/components/dataSource/configureSource";
import ExtractedListViewer from "@/components/dataSource/extractedListViewer";
import TasksTable from "@/components/dataSource/tasksTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ExtractionPage() {
  const [activeTab, setActiveTab] = useState("setup");

  const tabs = [
    { id: "setup", label: "source_config()", icon: null },
    { id: "jobs", label: "extraction_jobs()", icon: null },
    { id: "list", label: "extracted_data()", icon: null },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const canGoPrev = currentTabIndex > 0;
  const canGoNext = currentTabIndex < tabs.length - 1;

  const goToPrevTab = () => {
    if (canGoPrev) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const goToNextTab = () => {
    if (canGoNext) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile optimized */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-[10px] sm:text-xs font-mono mb-3 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            DATA PIPELINE
          </div>
          <h1 className="text-xl sm:text-2xl font-mono font-semibold text-[#11181C] break-words">
            extraction/
            <span className="text-[#FFC043]">configure</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#687076] font-mono mt-1">
            manage data sources, extraction jobs, and enriched company lists
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Carousel-style tab navigation with arrows */}
          <div className="flex items-center gap-2 mb-4 sm:hidden">
            <button
              onClick={goToPrevTab}
              disabled={!canGoPrev}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#E6E8EA] bg-white text-[#687076] hover:text-[#11181C] hover:border-[#FFC043] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-[#E6E8EA]">
                <span className="w-1 h-1 rounded-full bg-[#FFC043]"></span>
                <span className="text-[11px] font-mono text-[#11181C]">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </span>
                <span className="text-[10px] font-mono text-[#687076]">
                  {currentTabIndex + 1}/{tabs.length}
                </span>
              </div>
            </div>

            <button
              onClick={goToNextTab}
              disabled={!canGoNext}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#E6E8EA] bg-white text-[#687076] hover:text-[#11181C] hover:border-[#FFC043] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop: Horizontal tabs */}
          <TabsList className="hidden sm:inline-flex h-auto gap-0 bg-transparent border-b border-[#E6E8EA] rounded-none w-full justify-start mb-6 md:mb-8 p-0 overflow-x-auto">
            <TabsTrigger
              value="setup"
              className="
                px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none whitespace-nowrap
                bg-transparent active:scale-95
              "
            >
              source_config()
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="
                px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none whitespace-nowrap
                bg-transparent active:scale-95
              "
            >
              extraction_jobs()
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="
                px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-mono text-[#687076] 
                data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
                hover:text-[#11181C] transition-all duration-150 rounded-none whitespace-nowrap
                bg-transparent active:scale-95
              "
            >
              extracted_data()
            </TabsTrigger>
          </TabsList>

          {/* Tab Content - Setup */}
          <TabsContent
            value="setup"
            className="mt-4 sm:mt-6 focus-visible:outline-none"
          >
            <div className="border border-[#E6E8EA] bg-white overflow-x-auto">
              <div className="border-b border-[#E6E8EA] px-4 sm:px-6 py-2.5 sm:py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs font-mono text-[#687076] truncate">
                    autoflow/source_config — zsh
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <ExtractionDestinationConfig />
              </div>
            </div>
          </TabsContent>

          {/* Tab Content - Jobs */}
          <TabsContent
            value="jobs"
            className="mt-4 sm:mt-6 focus-visible:outline-none"
          >
            <div className="border border-[#E6E8EA] bg-white overflow-x-auto">
              <div className="border-b border-[#E6E8EA] px-4 sm:px-6 py-2.5 sm:py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs font-mono text-[#687076] truncate">
                    autoflow/extraction_jobs — zsh
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-sm sm:text-base font-mono font-semibold text-[#11181C] mb-1">
                    active_jobs()
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#687076] font-mono">
                    monitor and manage scheduled or running data extraction jobs
                  </p>
                </div>
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <TasksTable />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab Content - List */}
          <TabsContent
            value="list"
            className="mt-4 sm:mt-6 focus-visible:outline-none"
          >
            <div className="border border-[#E6E8EA] bg-white overflow-x-auto">
              <div className="border-b border-[#E6E8EA] px-4 sm:px-6 py-2.5 sm:py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs font-mono text-[#687076] truncate">
                    autoflow/extracted_data — zsh
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-sm sm:text-base font-mono font-semibold text-[#11181C] mb-1">
                    extracted_companies()
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#687076] font-mono">
                    view and manage companies fetched from selected data sources
                  </p>
                </div>
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <ExtractedListViewer />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
