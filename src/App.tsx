import React, { useState } from "react";
import { DatasetProvider } from "./app/providers";
import { useNavigation } from "./hooks/useNavigation";
import { useDataset } from "./hooks/useDataset";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { PatternsPage } from "./pages/PatternsPage";
import { ChaptersPage } from "./pages/ChaptersPage";
import { StoryPage } from "./pages/StoryPage";
import { ReceiptDetailModal } from "./components/common/ReceiptDetailModal";
import { EvidenceModal } from "./components/common/EvidenceModal";
import { ThreadDrawer } from "./components/common/ThreadDrawer";
import { ConnectionDetailModal } from "./components/common/ConnectionDetailModal";
import { DatasetUploadModal } from "./components/common/DatasetUploadModal";

function AppContent() {
  const { currentPath, navigate } = useNavigation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const {
    selectedReceipt,
    setSelectedReceipt,
    activeEvidenceChain,
    clearEvidenceChain,
    activeThread,
    clearThread,
    selectedConnection,
    setSelectedConnection,
  } = useDataset();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-neutral-950 focus:font-mono focus:text-xs focus:rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>

      {/* Primary Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentPath === "/" && (
          <HomePage onNavigate={navigate} onOpenUpload={() => setIsUploadOpen(true)} />
        )}
        {currentPath === "/explore" && <ExplorePage />}
        {currentPath === "/connections" && <ConnectionsPage />}
        {currentPath === "/patterns" && <PatternsPage />}
        {currentPath === "/chapters" && <ChaptersPage />}
        {currentPath === "/story" && <StoryPage />}
      </main>

      {/* Primary Footer */}
      <Footer currentPath={currentPath} onNavigate={navigate} />

      {/* Global Modals & Overlay Drawers */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <EvidenceModal
        chain={activeEvidenceChain}
        onClose={clearEvidenceChain}
      />

      <ThreadDrawer
        thread={activeThread}
        onClose={clearThread}
      />

      <ConnectionDetailModal
        connection={selectedConnection}
        onClose={() => setSelectedConnection(null)}
      />

      <DatasetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DatasetProvider>
      <AppContent />
    </DatasetProvider>
  );
}
