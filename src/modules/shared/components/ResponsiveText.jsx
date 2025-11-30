function ResponsiveText({ as: Component = "span", children, className = "", ...rest }) {
const isTextTag = ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(Component);

return (
    <Component
    className={`${isTextTag ? "text-[clamp(16px,2vw,20px)] leading-normal" : ""} ${className}`}
        {...rest}
    >
        {children}
    </Component>
    );
}

export default ResponsiveText;
