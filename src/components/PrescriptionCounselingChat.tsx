import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Upload,
  Image as ImageIcon,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Pill,
  Store,
  FileText,
  Clock,
  ShieldAlert,
  DollarSign,
  ChevronDown,
  X,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ESTOCK_PHARMACY_PRODUCTS, EStockProduct } from "../data/estockCatalog";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  image?: string;
  timestamp: string;
  modelUsed?: string;
}

interface PrescriptionCounselingChatProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const PrescriptionCounselingChat: React.FC<PrescriptionCounselingChatProps> = ({
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      text: `👋 **Welcome to the eStock Clinical Pharmacy & Prescription Assistant!**

I am your clinical specialist connected to the **eStock Multi-Branch Database** (*53,474 products, 3 branches*).

**How I can help you today:**
- 📸 **Prescription Reader**: Upload a photo or type a prescription to transcribe drug names, strengths, and regimens.
- 💊 **Medicine Substitution**: Find exact bioequivalent generics with identical active ingredients and calculate customer savings.
- 🏬 **Multi-Branch Stock**: Check live inventory across **Main Store**, **Branch 1 (Downtown)**, and **Branch 2 (North Plaza)** with FEFO expiry dates.
- 🧑‍⚕️ **Patient Counseling**: Detailed advice on indications, food/meal timing, common side effects, and missed-dose guidelines.
- ⚠️ **Interaction Checker**: Verify drug-drug safety and contraindications.

*Try uploading a prescription photo, or click one of the quick clinical prompts below!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-3.5-flash",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>("image/jpeg");
  const [modelPreference, setModelPreference] = useState<
    "gemini-3.5-flash" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-lite"
  >("gemini-3.5-flash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      setInputPrompt(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery, onClearInitialQuery]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError("Image size exceeds 12MB limit.");
      return;
    }

    setError(null);
    setSelectedImageMime(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Quick preset queries
  const handleSendPreset = (promptText: string) => {
    setInputPrompt(promptText);
    sendMessage(promptText, selectedImage);
  };

  // Send message
  const sendMessage = async (textToSend?: string, imageToSend?: string | null) => {
    const messageContent = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    const currentImage = imageToSend !== undefined ? imageToSend : selectedImage;

    if (!messageContent && !currentImage) return;

    setError(null);
    const userMsgId = "user-" + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: messageContent || "Analyze this attached prescription for medication substitution, counseling, and eStock branch availability.",
      image: currentImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInputPrompt("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);

    try {
      // Format history for backend
      const apiMessages = updatedHistory.map((msg) => ({
        role: msg.role,
        content: msg.text,
        image: msg.image
          ? {
              mimeType: selectedImageMime,
              data: msg.image,
            }
          : undefined,
      }));

      const res = await fetch("/api/pharmacy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          modelPreference,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reach pharmacy chatbot.");
      }

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.modelUsed || modelPreference,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat send error:", err);
      setError(err.message || "Error processing pharmacy consultation.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered eStock Products
  const filteredProducts = ESTOCK_PHARMACY_PRODUCTS.filter(
    (p) =>
      p.nameEn.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.nameAr.includes(catalogSearch) ||
      p.scientificName.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 8 Cols: Multi-turn Chat Thread */}
      <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden h-[750px]">
        {/* Chat Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Clinical Pharmacist & Prescription Assistant
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-semibold">
                  Live eStock DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prescription Reader • Generic Substitutions • Branch Inventory • Patient Counseling
              </p>
            </div>
          </div>

          {/* Model Selector Pill */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-slate-400 font-medium">Model:</label>
            <select
              value={modelPreference}
              onChange={(e) => setModelPreference(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (General & Vision)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Clinical)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Stock)</option>
            </select>
          </div>
        </div>

        {/* Scrollable Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 border border-slate-700 text-indigo-400"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 ${
                    isUser
                      ? "bg-indigo-900/60 border border-indigo-700/80 text-white rounded-tr-none"
                      : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none leading-relaxed"
                  }`}
                >
                  {/* Image Attachment if uploaded */}
                  {msg.image && (
                    <div className="mb-3 rounded-2xl overflow-hidden border border-indigo-500/40 max-w-sm">
                      <img
                        src={msg.image}
                        alt="Prescription scan"
                        className="w-full max-h-60 object-contain bg-slate-900"
                      />
                      <div className="px-3 py-1 bg-slate-900/90 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>📸 Uploaded Prescription / Document</span>
                      </div>
                    </div>
                  )}

                  {/* Message Text with Simple Markdown Line Handling */}
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Footer metadata */}
                  <div
                    className={`flex items-center justify-between pt-1 border-t ${
                      isUser ? "border-indigo-700/50 text-indigo-200" : "border-slate-800/80 text-slate-500"
                    } text-[10px] font-mono`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.modelUsed && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center shrink-0 mt-1 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Reading prescription & querying eStock multi-branch stock...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 font-semibold shrink-0 flex items-center mr-1">
            <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
            Quick Rx:
          </span>
          <button
            onClick={() =>
              handleSendPreset(
                "Read this prescription: Patient has acute sinusitis and was prescribed Augmentin 1g twice daily. Check if we have it in stock at any branch, suggest cheaper generic substitutes, and provide meal-timing counseling."
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition whitespace-nowrap"
          >
            💊 Augmentin 1g: Substitutes & Stock
          </button>
          <button
            onClick={() =>
              handleSendPreset(
                "Patient is taking Lipitor 20mg at night and Nexium 40mg in the morning. Check branch inventory for Atorvastatin generics, price savings, and provide patient counseling for both medications."
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition whitespace-nowrap"
          >
            🫀 Lipitor & Nexium: Counseling
          </button>
          <button
            onClick={() =>
              handleSendPreset(
                "Can you check all branch quantities for Glucophage 500mg and suggest alternatives? Also what is the missed-dose and food-timing advice for Metformin?"
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition whitespace-nowrap"
          >
            🩸 Glucophage 500mg: Multi-Branch Check
          </button>
          <button
            onClick={() =>
              handleSendPreset(
                "Verify drug-drug interaction between Cataflam 50mg (Diclofenac) and Concor 5mg (Bisoprolol). Can a hypertensive patient take Cataflam?"
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition whitespace-nowrap"
          >
            ⚠️ Cataflam & Concor Interaction
          </button>
        </div>

        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div className="px-5 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-indigo-500">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Prescription Image Ready</p>
                <p className="text-[10px] text-slate-400">Gemini Vision will transcribe and analyze this document</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="px-5 py-2 bg-rose-950/50 border-t border-rose-900/80 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          {/* Prescription Image Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="rx-image-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-600 transition"
            title="Upload handwritten prescription photo or medication box"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <textarea
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type prescription, drug name, or ask about substitutes and branch stock..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Send Button */}
          <button
            id="btn-send-rx"
            onClick={() => sendMessage()}
            disabled={loading || (!inputPrompt.trim() && !selectedImage)}
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30 transition flex items-center justify-center shrink-0"
            title="Send inquiry to Clinical Pharmacist AI"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right 4 Cols: Live eStock Multi-Branch Inventory Viewer */}
      <div className="lg:col-span-4 space-y-6">
        {/* Branch Stock Quick Lookup Bento Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">eStock Branch Inventory</h3>
                <p className="text-[11px] text-slate-400">Live stock across 3 locations</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300">
              FEFO Order
            </span>
          </div>

          {/* Search bar inside widget */}
          <div>
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Filter products (e.g., Augmentin, Lipitor)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Product List with Multi-branch indicators */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => (
              <div
                key={prod.productId}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{prod.nameEn}</h4>
                    <p className="text-[11px] text-slate-400">{prod.nameAr}</p>
                    <p className="text-[10px] font-mono text-indigo-400 mt-0.5">{prod.scientificName}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">${prod.sellPrice.toFixed(2)}</span>
                </div>

                {/* Stock across branches pills */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono pt-1">
                  {prod.batches.map((b, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-lg border text-center ${
                        b.amount > 0
                          ? "bg-slate-900 border-slate-800 text-slate-300"
                          : "bg-rose-950/30 border-rose-900/60 text-rose-400"
                      }`}
                    >
                      <p className="text-[9px] text-slate-500 truncate">{b.store.split(" ")[0]}</p>
                      <p className="font-bold">{b.amount} box</p>
                    </div>
                  ))}
                </div>

                {/* Substitutes Quick Pill */}
                {prod.substitutes.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                      In-Stock Alternatives:
                    </p>
                    <div className="space-y-1">
                      {prod.substitutes.slice(0, 2).map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() =>
                            handleSendPreset(
                              `Compare ${prod.nameEn} with its generic alternative ${sub.name}. Check branch availability, price difference ($${prod.sellPrice} vs $${sub.price}), and confirm bioequivalence.`
                            )
                          }
                          className="w-full text-left p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-900/60 transition flex items-center justify-between text-[11px]"
                        >
                          <span className="text-indigo-300 truncate">{sub.name}</span>
                          <span className="text-emerald-400 font-bold ml-1 shrink-0 font-mono">
                            ${sub.price.toFixed(2)} (-{sub.savingsPercent}%)
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Counseling Guide Bento Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Clinical Counseling Protocol
            </h4>
          </div>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
              <span>
                <strong>Food Administration</strong>: Antibiotics (meals), PPIs (30m pre-breakfast), NSAIDs (post-meal).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1" />
              <span>
                <strong>FEFO Batch Control</strong>: Always dispense oldest batches with valid expiry dates first.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
              <span>
                <strong>Generic Substitution</strong>: Ensure bioequivalent active salt and patient consent before switching.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
