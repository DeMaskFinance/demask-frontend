import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountContext from "@/context/AccountContext";
import { useContext } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
interface VersionTradeProps {
  width?: string;
}
const VersionTrade: React.FC<VersionTradeProps> = ({ width = "w-45" }) => {
  const [version, setVersion] = useQueryParam(
    "version",
    withDefault(StringParam, "v2")
  );
  const { chainId } = useContext(AccountContext);

  const versionList = [
    {
      slug: "v1",
      title: "Version 1",
    },
    {
      slug: "v2",
      title: "Version 2",
    },
  ];
  const handleValueChange = (value: string) => {
    setVersion(value);
  };

  return chainId === "11155111" ? (
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
  ) : (
    <></>
  );
};

export default VersionTrade;
