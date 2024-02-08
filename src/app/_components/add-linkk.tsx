"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function AddLinkk() {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState("");
  const [notes, setNotes] = useState("");

  const addToChain = api.linkk.addToChain.useMutation({
    onSuccess: () => {
      router.refresh();
      setInputUrl("");
      setNotes("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addToChain.mutate({ url: inputUrl, notes });
      }}
      className="flex flex-col items-center gap-2"
    >
      <input
        className="w-96 rounded-md p-2"
        type="text"
        placeholder="URL"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
      />
      <textarea
        className="h-44 w-96 rounded-md p-2"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        type="submit"
        className="h-12 w-28 rounded-md bg-blue-600 text-white"
        disabled={addToChain.isLoading}
      >
        {addToChain.isLoading ? "Adding..." : "Add Linkk"}
      </button>
    </form>
  );
}
