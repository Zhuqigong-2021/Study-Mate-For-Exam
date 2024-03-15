import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

type LoadingButtonProps = {
  loading: boolean;
} & ButtonProps;
export default function LoadingButton({
  children,
  loading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      <span className="flex gap-x-2">
        {loading && <Loader2 className=" h-4 w-4 animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
