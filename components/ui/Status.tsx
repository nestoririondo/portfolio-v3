"use client";

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/shadcn-io/status";

const CurrentStatus = ({children}: {children: React.ReactNode}) => (
  <Status
    className="gap-4 rounded-full px-6 py-2 text-sm bg-gray-100 dark:bg-gray-800"
    status="online"
    variant="outline"
  >
    <StatusIndicator />
    <StatusLabel className="font-mono">{children}</StatusLabel>
  </Status>
);

export default CurrentStatus;
