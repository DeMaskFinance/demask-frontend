import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const VersionTrade = () => {
  const [version, setVersion] = useQueryParam(
    "version",
    withDefault(StringParam, "v2")
  );

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
  return (
    <Select value={version} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] border-shader_400 text-primary_400 font-semibold">
        <SelectValue placeholder="Select a fruit" />
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

export default VersionTrade;
