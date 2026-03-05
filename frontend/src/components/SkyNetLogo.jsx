const SkyNetLogo = ({ className = "w-10 h-10" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 24C12 24 10 24 10 20C10 16 14 16 14 16C15 12 21 12 23 15.5C25 15 29 15.5 29 20C29 24 27 24 27 24"
                stroke="#0EA5E9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle cx="20" cy="24" r="3" fill="#10B981" />
            <circle cx="14" cy="29" r="2" fill="#10B981" />
            <circle cx="26" cy="29" r="2" fill="#10B981" />

            <path
                d="M20 24L14 29M20 24L26 29"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default SkyNetLogo;
