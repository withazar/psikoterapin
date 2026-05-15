import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-calm-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Brain className="h-8 w-8 text-primary-600" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="mt-4 text-sm text-calm-500">Yükleniyor...</p>
      </div>
    </div>
  );
}
