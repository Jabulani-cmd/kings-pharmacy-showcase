import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Camera as CameraIcon, RefreshCw, Check, AlertTriangle } from "lucide-react";

type Props = {
  onCapture: (dataUrl: string, fileName: string) => void;
  onClose: () => void;
};

export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  async function start(mode: "environment" | "user") {
    setError(null);
    setReady(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera not supported on this device/browser.");
        return;
      }
      // stop any existing stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
      } catch {
        // fallback: any camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setReady(true);
      }
    } catch (e: any) {
      const name = e?.name ?? "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setError("No camera was found on this device.");
      } else {
        setError("Could not start the camera. Please try uploading a file instead.");
      }
    }
  }

  useEffect(() => {
    start(facing);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function snap() {
    const v = videoRef.current;
    if (!v) return;
    const w = v.videoWidth || 1280;
    const h = v.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    setShot(canvas.toDataURL("image/jpeg", 0.92));
  }

  function flip() {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    start(next);
  }

  function confirm() {
    if (!shot) return;
    onCapture(shot, `prescription-${Date.now()}.jpg`);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 text-white">
        <div className="font-bold">Capture Prescription</div>
        <button onClick={onClose} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Close">
          <X />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {error ? (
          <div className="max-w-sm text-center text-white space-y-3">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-400" />
            <div className="font-bold">{error}</div>
            <button onClick={onClose} className="mt-2 inline-flex items-center justify-center h-11 px-5 rounded-full bg-white text-slate-900 font-bold">
              Close
            </button>
          </div>
        ) : shot ? (
          <img src={shot} alt="Captured" className="max-h-full max-w-full rounded-xl object-contain" />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="max-h-full max-w-full rounded-xl bg-black object-contain"
          />
        )}
      </div>

      {!error && (
        <div className="p-5 pb-8 flex items-center justify-center gap-6">
          {shot ? (
            <>
              <button onClick={() => setShot(null)} className="h-12 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Retake
              </button>
              <button onClick={confirm} className="h-12 px-6 rounded-full bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white font-bold inline-flex items-center gap-2">
                <Check className="h-4 w-4" /> Use Photo
              </button>
            </>
          ) : (
            <>
              <button onClick={flip} className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" aria-label="Switch camera">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={snap}
                disabled={!ready}
                aria-label="Take photo"
                className="h-16 w-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl disabled:opacity-50"
              >
                <CameraIcon className="h-7 w-7" />
              </button>
              <div className="h-12 w-12" />
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
