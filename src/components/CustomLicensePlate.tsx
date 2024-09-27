import { FC, useState, useEffect } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { ColorPicker, IColor } from "react-color-palette";
import { v4 as uuidv4 } from "uuid";
import { getStoredLicensePlate, storeLicensePlate } from "@/utils/fileEdit";
import "react-color-palette/css";

//types
import { licensePlateSaved } from "@/types/fileEditTypes";

interface CustomLicensePlateProps {
	bgColor: IColor;
	txColor: IColor;
	plateText: string;
	isColorMargin: boolean;
	setColorMargin: (isRounded: boolean) => void;
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
	setColorMargin,
	setBGColor,
	setTxColor,
	setPlateText,
	setIsColorMargin,
	modalOpen,
}) => {
	const [ListLicensePlates, setListLicensePlates] = useState<
		licensePlateSaved[]
	>([]);
	const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);
	const [selectedLicensePlate, setSelectedLicensePlate] = useState<string>();

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

	const setStoredLicensePlate = async (data: licensePlateSaved) => {
		setIsLoadingStore(true);

		if (ListLicensePlates) {
			const licensePlate = [...ListLicensePlates, data];

			await storeLicensePlate({
				license_plates_ets2: licensePlate,
			});
			setListLicensePlates(licensePlate);
		} else {
			const licensePlate = [data];

			await storeLicensePlate({
				license_plates_ets2: licensePlate,
			});
			setListLicensePlates(licensePlate);
		}

		setIsLoadingStore(false);
	};

	const loadSelectedLicensePlate = () => {
		if (selectedLicensePlate && ListLicensePlates) {
			const selectedPlate = ListLicensePlates.find(
				(plate) => plate.id === selectedLicensePlate
			);

			if (selectedPlate) {
				setPlateText(selectedPlate.text);
				setTxColor(selectedPlate.text_color);
				setBGColor(selectedPlate.bg_color);
				setColorMargin(selectedPlate.color_margin);
			}
		}
	};

	const deleteSelectedLicensePlate = async () => {
		if (selectedLicensePlate && ListLicensePlates) {
			const licensePlate = ListLicensePlates.filter(
				(plate) => plate.id !== selectedLicensePlate
			);

			await storeLicensePlate({
				license_plates_ets2: licensePlate,
			});
			setListLicensePlates(licensePlate);
			setSelectedLicensePlate(undefined);
		}
	};

	useEffect(() => {
		if (modalOpen) {
			setIsLoadingStore(true);

			getStoredLicensePlate().then((data) => {
				setListLicensePlates(data ? data.license_plates_ets2 : []);
			});

			setIsLoadingStore(false);
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
					<div className="flex gap-3">
						<Checkbox
							isSelected={isColorMargin}
							onValueChange={(value) => setIsColorMargin(value)}
							size="sm"
						>
							Colored margin
						</Checkbox>
						<Button
							onPress={() =>
								setStoredLicensePlate({
									id: uuidv4(),
									text: plateText,
									color_margin: isColorMargin,
									text_color: txColor,
									bg_color: bgColor,
								})
							}
							isLoading={isLoadingStore}
							color="success"
							size="sm"
							variant="bordered"
						>
							Store
						</Button>
					</div>
				</div>
				<div className="flex w-full flex-col justify-center gap-3">
					<Select
						items={ListLicensePlates}
						isLoading={isLoadingStore}
						isDisabled={ListLicensePlates.length === 0}
						label="Select a stored plate"
						placeholder="Select license plate"
						selectedKeys={selectedLicensePlate ? [selectedLicensePlate] : []}
						onChange={(e) => setSelectedLicensePlate(e.target.value)}
						variant="bordered"
					>
						{(items) => <SelectItem key={items.id}>{items.text}</SelectItem>}
					</Select>
					<div className="flex justify-center gap-3">
						<Button
							isDisabled={selectedLicensePlate ? false : true}
							onPress={loadSelectedLicensePlate}
							color="primary"
							size="sm"
							variant="bordered"
						>
							Load
						</Button>
						<Button
							isDisabled={selectedLicensePlate ? false : true}
							onPress={deleteSelectedLicensePlate}
							color="danger"
							size="sm"
							variant="bordered"
						>
							Delete
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
