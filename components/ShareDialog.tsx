"use client";
import React, { useState, createContext, useContext } from "react";
import { ShareSocial } from "react-share-social";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}

// Create a context to manage the dialog state globally
interface ShareDialogContextType {
  showShareDialog: (url: string) => void;
  hideShareDialog: () => void;
  isOpen: boolean;
  url: string;
}

const ShareDialogContext = createContext<ShareDialogContextType>({
  showShareDialog: () => {},
  hideShareDialog: () => {},
  isOpen: false,
  url: "",
});

// Hook to use the share dialog
export const useShareDialog = () => useContext(ShareDialogContext);

// Provider component
export const ShareDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const showShareDialog = (shareUrl: string) => {
    setUrl(shareUrl);
    setIsOpen(true);
  };

  const hideShareDialog = () => {
    setIsOpen(false);
  };

  return (
    <ShareDialogContext.Provider
      value={{ showShareDialog, hideShareDialog, isOpen, url }}
    >
      {children}
      <ShareDialog open={isOpen} onClose={hideShareDialog} shareUrl={url} />
    </ShareDialogContext.Provider>
  );
};

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // handle error if needed
      console.error("Failed to copy: ", err);
      setCopied(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 p-6 rounded-lg min-w-[320px] shadow-lg border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Share</h2>
        <p className="text-gray-300 mb-4">Share this link with your friends:</p>
        <div className="flex items-center mb-4">
          <button
            onClick={handleCopy}
            className="mr-2 px-4 py-2 bg-indigo-500 text-white rounded hover:opacity-90 transition"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
        <ShareSocial
          url={shareUrl}
          socialTypes={[
            "facebook",
            "twitter",
            "linkedin",
            "reddit",
            "whatsapp",
          ]}
          style={{
            root: {
              backgroundColor: "#1f2937",
              borderRadius: 3,
              border: 0,
              color: "white",
            },
            copyContainer: {
              border: "1px solid blue",
              background: "#1f2937",
            },
            title: {
              color: "aquamarine",
              fontStyle: "italic",
            },
            body: {
              margin: 0,
              padding: 0,
              display: "flex",
              justifyContent: "center",
              gap: "12px",
            },
          }}
        />
      </div>
    </div>
  );
};

export default ShareDialog;
