import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  createContext,
  useContext,
  Children,
} from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandProps,
} from "../ui/command";
import { FormControlAria } from "@/lib/types/types";

type Props = {
  enableMaxContent?: boolean;
  className?: string;
  children: ReactNode;
  selectedValue: string;
  placeholder?: string;
  modal?: boolean;
  emptyMsg?: string;
  id?: string;
  filter?: CommandProps["filter"];
} & FormControlAria;
type CommandContextValue = {
  onClose: () => void;
  selectedValue: string;
};

const CommandContext = createContext<CommandContextValue | null>(null);
export default function CustomCommandSearch({
  enableMaxContent = false,
  className,
  children,
  selectedValue,
  placeholder = "No Placeholder...",
  emptyMsg = "No Data Found...",
  modal = true,
  filter,
  ...props
}: Props) {
  const childrenArray = Children.toArray(children);
  const [open, setOpen] = useState(false);
  const selectedElement = childrenArray
    .filter(
      (
        element
      ): element is React.ReactElement<{
        value: string;
        children: ReactNode;
      }> =>
        React.isValidElement(element) && typeof element.props.value === "string"
    )
    .find((element) => element.props.value === selectedValue)?.props.children;

  const triggerRef = useRef<HTMLButtonElement>(null);

  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (!enableMaxContent || !open) return;

    const windowResizer = () => {
      if (!triggerRef.current) return;
      setTriggerWidth(triggerRef.current.offsetWidth);
      console.log("resized");
    };
    windowResizer();

    window.addEventListener("resize", windowResizer);
    return () => {
      window.removeEventListener("resize", windowResizer);
    };
  }, [open, enableMaxContent]);
  console.log({ selectedValue });
  return (
    <CommandContext.Provider
      value={{ onClose: () => setOpen(false), selectedValue }}
    >
      {/* TODO:FIXME */}
      <Popover modal={modal} open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="px-4 h-12 relative border-none focus:bg-gradient-to-r placeholder:text-neutral focus-visible:ring-[4px] focus-visible:ring-[#84DCF53D] bg-[#363A3D] from-[#82DBF7] to-[#B6F09C] after:absolute after:rounded-[8px] after:inset-[1px] after:bg-[#1A1D21] *:relative *:z-10"
          asChild
        >
          <Button
            {...props}
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start rounded-[8px] "
          >
            <Search className=" h-4 w-4 shrink-0  text-[#CDE9DF]" />
            <span>{selectedValue ? selectedElement : "Select Doctor..."}</span>
            <ChevronDown className="h-4 w-4 text-[#B6F09C] ms-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          style={{ width: triggerWidth }}
          className={cn("p-0 border-[#363A3D] bg-primary", className)}
        >
          <Command className="bg-primary " filter={filter}>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyMsg}</CommandEmpty>
              {children}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </CommandContext.Provider>
  );
}

export const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context)
    throw new Error("useCommandContext must be used within CommandContext");
  return context;
};
