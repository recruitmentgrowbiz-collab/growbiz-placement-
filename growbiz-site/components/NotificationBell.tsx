"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { describeNotification } from "@/lib/notifications";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/supabase/notification-actions";

type NotificationRow = {
  id: string;
  template: string;
  payload: Record<string, any>;
  read_at: string | null;
  created_at: string;
};

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const linkFor: Record<string, (payload: any) => string> = {
  new_applicant: (p) => `/employer/dashboard/jobs/${p.job_id}`,
  application_stage_changed: () => `/candidate/dashboard`,
  verification_decision: () => `/employer/dashboard`,
  placement_recorded: () => `/candidate/dashboard`,
  placement_recorded_employer: () => `/recruiter/placements`,
};

export function NotificationBell({ notifications }: { notifications: NotificationRow[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-ink/70 hover:bg-plum-50 hover:text-plum-600"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-plum-600" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-card border border-line bg-white p-2 shadow-soft">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-[13px] font-medium text-ink">Notifications</p>
              {unreadCount > 0 && (
                <button
                  disabled={isPending}
                  onClick={() => startTransition(() => markAllNotificationsRead())}
                  className="text-[12px] font-medium text-plum-600 hover:text-plum-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="mt-1 flex max-h-80 flex-col overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={linkFor[n.template]?.(n.payload) ?? "/"}
                    onClick={() => {
                      setOpen(false);
                      if (!n.read_at) startTransition(() => markNotificationRead(n.id));
                    }}
                    className={`rounded-lg px-2.5 py-2.5 text-[13.5px] leading-snug hover:bg-plum-50 ${
                      n.read_at ? "text-ink/60" : "font-medium text-ink"
                    }`}
                  >
                    <p>{describeNotification(n.template, n.payload)}</p>
                    <p className="mt-0.5 text-[12px] text-mist">{timeAgo(n.created_at)}</p>
                  </Link>
                ))
              ) : (
                <p className="px-2.5 py-6 text-center text-[13px] text-mist">No notifications yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
