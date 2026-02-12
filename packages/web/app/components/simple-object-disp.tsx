import { Title } from "./title";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SimpleObjectDisplay({
  obj,
}: {
  obj: Record<string, string | number | boolean | bigint | Date | null>;
}) {
  return (
    <>
      <Title title="CDR details" text={`CDR details for entry: ${obj.id}`} />
      <div className="flex gap-1">
        <div className="flex flex-col gap-2">
          {Object.keys(obj).map((key) => (
            <div key={key} className="flex justify-end items-center">
              <Input disabled className="text-right font-bold" value={key + ":"} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {Object.values(obj).map((vl) => (
            <div className="flex justify-end items-center">
              {vl ? <Input readOnly value={vl.toString()} /> : <Input readOnly value="null" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
