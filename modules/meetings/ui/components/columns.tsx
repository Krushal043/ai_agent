"use client"
import { format } from "date-fns"
import humanizeDuration from 'humanize-duration'
import { CheckCircleIcon, ClockArrowUpIcon, ClockFadingIcon, CornerDownRightIcon, LoaderIcon, XCircleIcon } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import GeneratedAvatar from "@/components/generated-avatar"
import { MeetingGetMany } from "@/modules/meetings/types"
import { cn } from "@/lib/utils"

function formateDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        units: ["h", "m", "s"],
        round: true,
        largest: 1,
    })
}

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CheckCircleIcon,
    processing: LoaderIcon,
    cancelled: XCircleIcon,
}

const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">
                <span className="text-md font-semibold capitalize">{row.original.name}</span>
                <div className="flex items-center gap-x-1.5">
                    <CornerDownRightIcon className="size-3 text-muted-foreground" />
                    <span className="text-md text-muted-foreground max-w-[200px] truncate capitalize">{row.original.agent.name}</span>
                    <GeneratedAvatar
                        variant="botttsNeutral"
                        seed={row.original.agent.name}
                        className="size-7"
                    />
                    <span className="text-sm text-muted-foreground truncate">
                        {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]
            const color = statusColorMap[row.original.status as keyof typeof statusColorMap]
            return (
                <Badge className={cn("capitalize [&>svg]:size-4! text-muted-foreground p-4", color)}>
                    <Icon className={cn(row.original.status === "processing" && "animate-spin")} />
                    {row.original.status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <Badge className="capitalize [&>svg]:size-4! flex items-center gap-x-2 p-4" variant="outline">
                <ClockFadingIcon className="text-blue-700" />
                {row.original.duration ? formateDuration(row.original.duration) : "Not Started"}
            </Badge>
        )
    }
]