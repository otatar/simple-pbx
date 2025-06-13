import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function InputWithTwoButtons({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onShowPasswordClick = () => {
    setPasswordVisible((prev) => !prev);
  };

  const onGeneratePasswordClick = () => {
    props.onChange?.({
      target: {
        value: generatePassword(),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex justify-start">
      <input
        type={passwordVisible ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onShowPasswordClick}
            >
              {passwordVisible ? (
                <Eye className="text-blue-500" />
              ) : (
                <EyeOff className="text-blue-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {passwordVisible ? "Hide password" : "Show password"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onGeneratePasswordClick}
            >
              <RefreshCcw className="text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate password</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

const generatePassword = (length = 8): string => {
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = ".,_+=<>#?!@$%^&*-";

  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;

  const getRandomChar = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  password += getRandomChar(upperCaseChars);
  password += getRandomChar(lowerCaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  for (let i = password.length; i < length; i++) {
    password += getRandomChar(allChars);
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};
