const TrailersOptions = () => {
    return (
        <div
            key={id}
            className={`flex flex-col ${themeTatailwind.secundary.main} max-w-lg rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-3 m-4 p-4`}
        >
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
            >
                {icon}
            </Typography>
            <Typography
                className="flex justify-center"
                color={themeTatailwind.primary.color}
                variant="h6"
            >
                {atribute}
            </Typography>
            <Divider />
            <div className="flex text-justify gap-3">
                <Typography
                    color={themeTatailwind.primary.color}
                    variant="subtitle2"
                >
                    {description}
                </Typography>
            </div>
        </div>
    );
};

export default TrailersOptions;
