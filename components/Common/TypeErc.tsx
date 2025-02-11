import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
interface VersionTradeProps {
    width?: string;
}
const TypeErc: React.FC<VersionTradeProps> = ({ width = "w-45" }) => {
    const [version, setVersion] = useQueryParam(
        "typeErc",
        withDefault(StringParam, "erc721")
    );

    const versionList = [
        {
            slug: "erc721",
            title: "ERC 721",
        },
        {
            slug: "erc1155",
            title: "ERC 1155",
        },
    ];
    const handleValueChange = (value: string) => {
        setVersion(value);
    };
    return (
        <Select value={version} onValueChange={handleValueChange}>
            <SelectTrigger
                className={`border-shader_400 text-primary_400 font-semibold ${width}`}
            >
                <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent className="text-white bg_main">
                <SelectGroup>
                    {versionList.map((version, index) => (
                        <SelectItem key={index} value={version.slug}>
                            {version.title}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default TypeErc;
