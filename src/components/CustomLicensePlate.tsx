import { FC, useState, useEffect } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { ColorPicker, IColor } from "react-color-palette";
import { getStoredLicensePlate, storeLicensePlate } from "@/utils/fileEdit";
import "react-color-palette/css";

//types
import { listLicensePlateSaved } from "@/types/fileEditTypes";

interface CustomLicensePlateProps {
	bgColor: IColor;
	txColor: IColor;
	plateText: string;
	isColorMargin: boolean;
	setBGColor: (color: IColor) => void;
	setTxColor: (color: IColor) => void;
	setPlateText: (text: string) => void;
	setIsColorMargin: (isRounded: boolean) => void;
	modalOpen: boolean;
}

const CustomLicensePlate: FC<CustomLicensePlateProps> = ({
	bgColor,
	txColor,
	plateText,
	isColorMargin,
	setBGColor,
	setTxColor,
	setPlateText,
	setIsColorMargin,
	modalOpen,
}) => {
	const [licensePlates, setLicensePlates] =
		useState<listLicensePlateSaved | null>(null);

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

	useEffect(() => {
		if (modalOpen) {
			getStoredLicensePlate().then((data) => {
				setLicensePlates(data);
			});
		}
	}, [modalOpen]);

	return (
		<div className="flex w-full flex-col justify-center gap-2">
			<div className="flex">
				<div className="flex w-full flex-col items-center gap-3">
					<div
						className="flex h-12 items-center rounded-lg p-2"
						style={{
							minWidth: "165px",
							maxWidth: "165px",
							backgroundColor: `${bgColor.hex}`,
							borderStyle: "solid",
							borderColor: `${isColorMargin ? txColor.hex : "transparent"}`,
							borderWidth: `${isColorMargin ? "3px" : "0px"}`,
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
					<Input
						className="w-fit"
						size="sm"
						label="License plate text"
						placeholder="Enter license plate text"
						value={plateText}
						onValueChange={setUpperCase}
					/>
					<Checkbox
						isSelected={isColorMargin}
						onValueChange={(value) => setIsColorMargin(value)}
						size="md"
					>
						Colored margin
					</Checkbox>
				</div>
				<div className="flex w-full flex-col items-center gap-3">
					<Select
						items={licensePlates ? licensePlates.license_plates_ets2 : []}
						isDisabled={licensePlates ? false : true}
						label="Select a stored plate"
						placeholder="Select license plate"
					>
						{(items) => <SelectItem key={items.text}>{items.text}</SelectItem>}
					</Select>
					<div className="flex justify-center gap-3">
						<Button color="default" size="sm">
							Load
						</Button>
						<Button color="success" size="sm">
							Save
						</Button>
					</div>
				</div>
			</div>
			<div className="flex h-auto justify-center gap-6">
				<div className="space-y-2 text-center">
					<p className="text-large font-bold">Background color</p>
					<div className="drop-shadow-lg">
						<ColorPicker
							height={100}
							hideInput={["hsv", "hex"]}
							hideAlpha={true}
							color={bgColor}
							onChange={BgColor}
						/>
					</div>
				</div>
				<div className="space-y-2 text-center">
					<p className="text-large font-bold">Text color</p>
					<div className="drop-shadow-lg">
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
		</div>
	);
};

export default CustomLicensePlate;
