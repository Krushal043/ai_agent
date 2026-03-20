import { CheckCircleIcon, ClockArrowUpIcon, LoaderIcon, XCircleIcon } from "lucide-react";
import CommandSelect from "@/components/command-select";
import { MeetingStatus } from "@/modules/meetings/types";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";

const options = [
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon />
                {MeetingStatus.Upcoming}
            </div>
        )
    },
    {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CheckCircleIcon />
                {MeetingStatus.Completed}
            </div>
        )
    },
    {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />
                {MeetingStatus.Active}
            </div>
        )
    },
    {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <XCircleIcon />
                {MeetingStatus.Cancelled}
            </div>
        )
    },
    {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />
                {MeetingStatus.Processing}
            </div>
        )
    }
]

export default function StatusFilter() {
    const [filters, setFilters] = useMeetingsFilters()
    return (
        <CommandSelect
            className="h-9"
            placeholder="Status"
            options={options}
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={filters.status ?? ""}
            onSearch={() => { "" }}
        />
    )
}