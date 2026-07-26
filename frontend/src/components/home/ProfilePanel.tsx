import { useRef, useState } from "react";
import { LogOut, Camera } from "lucide-react";
import type { Run } from "../../types/run";

interface Props {
  username: string;
  memberSince: string;
  myRuns: Run[];
  runsLoading: boolean;
  handleSignOut: () => void;
}

export default function ProfilePanel({
  username,
  memberSince,
  myRuns,
  runsLoading,
  handleSignOut,
}: Props) {
  const storageKey = `profile_picture_${username}`;
  const [profilePic, setProfilePic] = useState<string | null>(() =>
    localStorage.getItem(storageKey)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfilePic(dataUrl);
      localStorage.setItem(storageKey, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    setProfilePic(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="space-y-5">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-3 pt-4">
        {/* Avatar with camera overlay */}
        <div className="relative">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-semibold overflow-hidden"
            style={{
              background: profilePic ? "transparent" : "var(--muted)",
              border: "3px solid #C4A35A",
              color: "#C4A35A",
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>

          {/* Camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile picture"
            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background transition hover:opacity-80"
            style={{ background: "#C4A35A" }}
          >
            <Camera size={12} color="white" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-bold">{username}</p>

          {memberSince && (
            <p className="text-sm text-muted-foreground">
              Member since {memberSince}
            </p>
          )}
        </div>

        {/* Remove picture link — only shown when a custom pic is set */}
        {profilePic && (
          <button
            onClick={handleRemovePicture}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition"
          >
            Remove picture
          </button>
        )}

        <div
          className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold"
          style={{
            background: "var(--muted)",
            color: "#C4A35A",
            border: "1px solid #C4A35A40",
          }}
        >
          ⚡ Iter Runner
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* All-time stats */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          All-time stats
        </p>

        {runsLoading ? (
          <div className="grid grid-cols-3 gap-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-muted/20 px-2 py-3"
              >
                <div className="h-2.5 w-3/4 rounded bg-muted" />
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-2 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-muted/20 px-2 py-3">
              <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Total Miles
              </span>

              <span className="text-xl font-bold leading-tight">
                {myRuns
                  .reduce((sum, run) => sum + run.distanceMiles, 0)
                  .toFixed(1)}
              </span>

              <span className="text-[11px] text-muted-foreground">mi</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-muted/20 px-2 py-3">
              <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Total Runs
              </span>

              <span className="text-xl font-bold leading-tight">
                {myRuns.length}
              </span>

              <span className="text-[11px] text-muted-foreground">runs</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-muted/20 px-2 py-3">
              <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Longest
              </span>

              <span className="text-xl font-bold leading-tight">
                {myRuns.length > 0
                  ? Math.max(...myRuns.map((run) => run.distanceMiles)).toFixed(
                      1
                    )
                  : "0.0"}
              </span>

              <span className="text-[11px] text-muted-foreground">mi</span>
            </div>
          </div>
        )}
      </div>

      {/* Log out */}
      <button
        onClick={handleSignOut}
        type="button"
        aria-label="Log out"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
}
