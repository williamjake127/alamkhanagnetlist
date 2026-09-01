"use client";

import React, { useState, createContext, useContext } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SupportButton } from "../ui/SupportButton";
import { SearchModal } from "../modals/SearchModal";
import { ViewAgentModal } from "../modals/ViewAgentModal";
import { ReportModal } from "../modals/ReportModal";
import { SupportModal } from "../modals/SupportModal";
import { SwapModal } from "../modals/SwapModal";
import { Agent } from "@/lib/types";
import { INITIAL_AGENTS } from "@/lib/data/agents";
import { useSiteData } from "@/lib/site-context";

interface ModalContextType {
  openSearch: () => void;
  openView: (agent: Agent) => void;
  openReport: (agent: Agent) => void;
  openSupport: () => void;
  openSwap: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openSearch: () => {},
  openView: () => {},
  openReport: () => {},
  openSupport: () => {},
  openSwap: () => {},
});

export const useModals = () => useContext(ModalContext);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { agents } = useSiteData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewAgent, setViewAgent] = useState<Agent | null>(null);
  const [reportAgent, setReportAgent] = useState<Agent | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const openView = (agent: Agent) => setViewAgent(agent);
  const openReport = (agent: Agent) => setReportAgent(agent);
  const openSupport = () => setSupportOpen(true);
  const openSwap = () => setSwapOpen(true);

  return (
    <ModalContext.Provider
      value={{ openSearch, openView, openReport, openSupport, openSwap }}
    >
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        <div className="px-[10px] sm:max-w-[640px] md:max-w-[957px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto pb-12">
          {/* Header */}
          <Header onOpenSearch={openSearch} />

          {/* Main Content */}
          <main className="mt-2">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Floating Support Button */}
          <SupportButton onClick={openSupport} />
        </div>

        {/* Global Modals */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          allAgents={agents}
          onSelectAgent={(agent) => {
            setSearchOpen(false);
            setViewAgent(agent);
          }}
        />


        <ViewAgentModal
          agent={viewAgent}
          isOpen={!!viewAgent}
          onClose={() => setViewAgent(null)}
          onReport={(agent) => {
            setViewAgent(null);
            setReportAgent(agent);
          }}
        />

        <ReportModal
          agent={reportAgent}
          isOpen={!!reportAgent}
          onClose={() => setReportAgent(null)}
        />

        <SupportModal
          isOpen={supportOpen}
          onClose={() => setSupportOpen(false)}
        />

        <SwapModal
          isOpen={swapOpen}
          onClose={() => setSwapOpen(false)}
        />
      </div>
    </ModalContext.Provider>
  );
}
