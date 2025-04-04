import { AprMonIcon, EtherIcon } from "../Icons";


export default function TokenIcon({ token, w = 20, h = 20 }: { token: string; w?: number; h?: number }) {
    const ICONS: Record<string, JSX.Element> = {
        mon: <EtherIcon width={w} height={h} />,
        aprmon: <AprMonIcon width={w} height={h} />,
    };

    return ICONS[token?.toLowerCase()] ?? (
        <div
            className="w-[20px] h-[20px] rounded-full bg-zinc-500 text-white flex items-center justify-center text-xs"
            style={{ width: w, height: h }}
        >
            ?
        </div>
    );
}
