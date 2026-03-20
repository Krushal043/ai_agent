import Image from 'next/image';
interface Props {
    title: string;
    description?: string;
    image?: string;
}

export default function EmptyState({ title, description, image = "/empty.svg" }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-y-2">
            <Image src={image} alt='logo' width={240} height={240} />
            <div className='flex flex-col gap-y-6 max-w-md mx-auto text-center'>
                <h3 className="text-lg font-medium">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </div>
    )
}