function ResponsiveText({ as: Component = "span", children, className = "", ...rest }) {
return (
    <Component
    className={`text-[clamp(22px,2.5vw,18px)] ${className}`}
    {...rest}
    >
    {children}
    </Component>
);
}

export default ResponsiveText;
