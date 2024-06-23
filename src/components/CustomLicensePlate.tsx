import { FC } from "react";
import { Input } from "@nextui-org/input";
import { ColorPicker, IColor } from "react-color-palette";
import "react-color-palette/css";

interface CustomLicensePlateProps {
	bgColor: IColor;
	txColor: IColor;
	plateText: string;
	setBGColor: (color: IColor) => void;
	setTxColor: (color: IColor) => void;
	setPlateText: (text: string) => void;
}

const CustomLicensePlate: FC<CustomLicensePlateProps> = ({
	bgColor,
	txColor,
	plateText,
	setBGColor,
	setTxColor,
	setPlateText,
}) => {
	const setUpperCase = (text: string) => {
		setPlateText(text.toUpperCase());
	};

	const BgColor = (color: IColor): void => {
		setBGColor({
			...color,
			rgb: {
				...color.rgb,
				r: color.rgb.r < 0 ? 0 : color.rgb.r,
				g: color.rgb.g < 0 ? 0 : color.rgb.g,
				b: color.rgb.b < 0 ? 0 : color.rgb.b,
			},
		});
	};

	const TxColor = (color: IColor): void => {
		setTxColor({
			...color,
			rgb: {
				...color.rgb,
				r: color.rgb.r < 0 ? 0 : color.rgb.r,
				g: color.rgb.g < 0 ? 0 : color.rgb.g,
				b: color.rgb.b < 0 ? 0 : color.rgb.b,
			},
		});
	};

	return (
		<div className="flex w-full flex-col justify-center gap-2">
			<div className="flex justify-center">
				<div
					className="flex h-12 rounded-lg p-2"
					style={{
						minWidth: "165px",
						maxWidth: "165px",
						backgroundColor: `${bgColor.hex}`,
					}}
				>
					<p
						className="truncate whitespace-break-spaces text-2xl"
						style={{
							color: `${txColor.hex}`,
						}}
					>
						<b>{plateText}</b>
					</p>
				</div>
			</div>

			<div className="flex w-full justify-center">
				<Input
					className="w-fit"
					label="License plate text"
					placeholder="Enter license plate text"
					value={plateText}
					onValueChange={setUpperCase}
				/>
			</div>
			<div className="flex h-auto justify-center gap-6">
				<div className="space-y-2 text-center">
					<p className="text-large font-bold">Background color</p>
					<ColorPicker
						height={100}
						hideInput={["hsv", "hex"]}
						hideAlpha={true}
						color={bgColor}
						onChange={BgColor}
					/>
				</div>
				<div className="space-y-2 text-center">
					<p className="text-large font-bold">Text color</p>
					<ColorPicker
						height={100}
						hideInput={["hsv", "hex"]}
						hideAlpha={true}
						color={txColor}
						onChange={TxColor}
					/>
				</div>
			</div>
		</div>
	);
};

export default CustomLicensePlate;
