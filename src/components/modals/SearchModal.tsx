"use client";

import React, { useState } from "react";
import { SearchIcon, CloseIcon } from "../ui/Icons";
import { Agent } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAgents?: Agent[];
  onSelectAgent?: (agent: any) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  allAgents = [],
  onSelectAgent,
}: SearchModalProps) {
  const [type, setType] = useState<string>("default");
  const [agentId, setAgentId] = useState<string>("");
  const [wpNumber, setWpNumber] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);

    try {
      let url = "/api/agents?status=active";
      if (type !== "default" && type !== "all") {
        url += `&category=${type}`;
      }
      const searchTerms = [agentId.trim(), wpNumber.trim()].filter(Boolean).join(" ");
      if (searchTerms) {
        url += `&search=${encodeURIComponent(searchTerms)}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setSearchResults(json.data);
      } else {
        // Fallback local filter
        const filtered = allAgents.filter((agent) => {
          const matchType =
            type === "default" || type === "all" || agent.category === type;
          const matchId =
            !agentId.trim() ||
            agent.id.toLowerCase().includes(agentId.trim().toLowerCase());
          const matchWp =
            !wpNumber.trim() ||
            agent.phone.includes(wpNumber.trim()) ||
            agent.whatsapp.includes(wpNumber.trim());

          return matchType && matchId && matchWp;
        });
        setSearchResults(filtered);
      }
    } catch (err) {
      console.error("Search error:", err);
      // Fallback
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setType("default");
    setAgentId("");
    setWpNumber("");
    setSearchResults(null);
  };

  return (
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-light_black w-full max-w-md p-6 sm:p-8 rounded-[10px] relative border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            handleReset();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center bg-deep_black py-2.5 rounded-[8px] text-[18px] mb-4">
          <SearchIcon className="text-primary text-xl" />
          <span className="text-white font-hind ml-2 font-medium">এজেন্ট খুজুন</span>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <div>
            <label htmlFor="search-type" className="text-primary text-xs md:text-sm font-hind block mb-1">
              Type
            </label>
            <select
              id="search-type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full py-2 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/5 focus:border-primary transition-colors font-hind"
            >
              <option value="default">All</option>
              <option value="admin">Admin</option>
              <option value="sub_admin">Sub Admin</option>
              <option value="super">Super</option>
              <option value="master">Master</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-agent-id" className="text-primary text-xs md:text-sm font-hind block mb-1">
              Search By Agent ID
            </label>
            <input
              id="search-agent-id"
              type="text"
              name="agent_id"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Agent ID Number"
              className="w-full py-2 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/5 focus:border-primary transition-colors font-sans"
            />
          </div>

          <div>
            <label htmlFor="search-wp-number" className="text-primary text-xs md:text-sm font-hind block mb-1">
              Search by Whatsapp
            </label>
            <input
              id="search-wp-number"
              type="text"
              name="wp_number"
              value={wpNumber}
              onChange={(e) => setWpNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full py-2 px-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/5 focus:border-primary transition-colors font-sans"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-white/5">
            {searchResults !== null && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-[4px] text-xs font-hind text-gray hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={searching}
              className="bg-primary text-deep_black px-5 py-1.5 rounded-[4px] text-sm font-semibold font-hind hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Results List */}
        {searchResults !== null && (
          <div className="mt-4 pt-3 border-t border-white/10 max-h-48 overflow-y-auto">
            <h4 className="text-primary text-xs font-hind mb-2">
              Results found ({searchResults.length}):
            </h4>
            {searchResults.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {searchResults.map((agent) => (
                  <div
                    key={agent._id || agent.id}
                    onClick={() => onSelectAgent?.(agent)}
                    className="flex items-center justify-between p-2 rounded bg-deep_black hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <span className="bg-primary text-deep_black text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                        ID: {agent.agentId || agent.id}
                      </span>
                      <span className="text-white text-xs font-hind font-medium truncate">
                        {agent.name}
                      </span>
                      <span className="text-gray text-[10px] uppercase font-hind flex-shrink-0">
                        ({agent.type || agent.category})
                      </span>
                    </div>
                    <a
                      href={agent.whatsapp || `https://wa.me/${agent.phone?.replace(/[^0-9+]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white bg-success text-[10px] px-2 py-0.5 rounded font-hind flex-shrink-0"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray text-xs font-hind text-center py-2">
                কোন এজেন্ট খুঁজে পাওয়া যায়নি
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
