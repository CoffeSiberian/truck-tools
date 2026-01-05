import { FC } from "react";

// UI
import { cn } from "@heroui/theme";
import { Image } from "@heroui/image";
import { Radio, RadioProps } from "@heroui/radio";

interface CustomRadioProps extends RadioProps {
	text: string;
	image?: string | undefined;
	selectedGarage: string;
}

const CustomRadio: FC<CustomRadioProps> = ({
	text,
	image,
	selectedGarage,
	...props
}) => {
	return (
		<Radio
			{...props}
			classNames={{
				base: cn(
					"m-0 bg-content1 hover:bg-content2 max-w-full w-full",
					"flex-row-reverse cursor-pointer justify-between rounded-lg gap-2 p-2 border-2 border-transparent",
					"data-[selected=true]:border-primary"
				),
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem",
					textAlign: "center",
				}}
			>
				{text}
				{selectedGarage === props.value && image && (
					<Image alt="Card background" src={image} />
				)}
			</div>
		</Radio>
	);
};

export default CustomRadio;
