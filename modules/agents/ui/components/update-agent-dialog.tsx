import { AgentGetOne } from '@/modules/agents/types';
import ResponsiveDialog from '@/components/responsive-dialog';
import AgentForm from '@/modules/agents/ui/components/agent-form';

interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentGetOne;
}

export default function UpdateAgentDialog({ open, onOpenChange, initialValues }: UpdateAgentDialogProps) {
    return (
        <ResponsiveDialog title='Edit Agent' description='Edit the agent' open={open} onOpenChange={onOpenChange}>
            <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} initialValues={initialValues} />
        </ResponsiveDialog>
    )
}