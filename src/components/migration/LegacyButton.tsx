/**
 * Legacy Button Migration Helper
 * 
 * Helper untuk migrasi dari custom Button component ke shadcn/ui Button
 * Gunakan ini sebagai bridge sementara selama proses migrasi
 */

import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Type untuk backward compatibility
interface LegacyButtonProps {
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "outline" | "secondary" | "destructive";
    color?: "brand" | "red" | "green" | "blue" | "yellow" | "gray";
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

// Mapping helper function
const mapLegacyToShadcn = (
    size?: "sm" | "md" | "lg",
    variant?: "primary" | "outline" | "secondary" | "destructive",
    color?: string
) => {
    // Size mapping
    const sizeMap = {
        sm: "sm" as const,
        md: "default" as const,
        lg: "lg" as const,
    };

    // Variant + Color mapping
    let mappedVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";

    if (variant === "primary") {
        if (color === "red") mappedVariant = "destructive";
        else mappedVariant = "default";
    } else if (variant === "outline") {
        mappedVariant = "outline";
    } else if (variant === "secondary") {
        mappedVariant = "secondary";
    } else if (variant === "destructive") {
        mappedVariant = "destructive";
    }

    return {
        size: sizeMap[size || "md"],
        variant: mappedVariant,
    };
};

/**
 * Legacy Button Wrapper
 * Gunakan ini untuk migrasi bertahap dari custom Button ke shadcn/ui
 */
export const LegacyButton: React.FC<LegacyButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    color = "brand",
    startIcon,
    endIcon,
    onClick,
    disabled = false,
    className = "",
}) => {
    const { size: mappedSize, variant: mappedVariant } = mapLegacyToShadcn(size, variant, color);

    return (
        <ShadcnButton
            size={mappedSize}
            variant={mappedVariant}
            onClick={onClick}
            disabled={disabled}
            className={cn("gap-2", className)}
        >
            {startIcon && <span className="flex items-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </ShadcnButton>
    );
};

/**
 * Quick Migration Guide:
 * 
 * 1. Import LegacyButton instead of Button:
 *    import { LegacyButton as Button } from "@/components/migration/LegacyButton";
 * 
 * 2. Gradually replace with direct shadcn/ui imports:
 *    import { Button } from "@/components/ui/button";
 *    import { Plus } from "lucide-react";
 * 
 *    <Button>
 *      <Plus className="w-4 h-4" />
 *      Tambah User
 *    </Button>
 */

export default LegacyButton;
