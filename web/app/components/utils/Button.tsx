import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "active" | "menu-item" | "menu-item-active";
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export default function Button({ children, variant = "secondary", size = "xs", className = "", icon, iconPosition = "right", ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-md border disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-lg shadow-blue-900/20",

        active: "text-slate-200 border-slate-700 bg-slate-800/50 shadow-sm",

        ghost: "text-slate-500 border-transparent bg-transparent hover:text-slate-300 hover:bg-slate-800/30",

        outline: "text-slate-400 border-slate-800 bg-transparent hover:border-slate-700 hover:text-slate-200 hover:bg-slate-800/30",

        secondary: "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700",

        "menu-item": "w-full justify-between text-slate-300 border-transparent bg-transparent hover:bg-slate-800 hover:text-white font-normal text-left",

        "menu-item-active": "w-full justify-between bg-blue-600/10 text-blue-400 border-transparent font-medium text-left",
    };

    const sizes = {
        xs: "text-xs px-2 py-0.5 gap-1.5",
        sm: "text-sm px-3 py-1 gap-2",
        md: "text-sm px-4 py-1.5 gap-2",
        lg: "text-xl px-5 py-1.5 gap-2.5",
    };

    const classes = `
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
    `;

    return (
        <button className={classes} {...props}>
            {icon && iconPosition == "right" && <span className="shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition == "left" && <span className="shrink-0">{icon}</span>}
        </button>
    );
}