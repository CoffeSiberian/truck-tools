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
    return (
        <div className="flex w-full justify-center flex-col gap-2">
            <div className="flex justify-center">
                <div
                    className="flex h-12 min-w-40 max-w-40 p-2 rounded-lg"
                    style={{
                        backgroundColor: `${bgColor.hex}`,
                    }}
                >
                    <p
                        className="text-2xl truncate whitespace-break-spaces"
                        style={{
                            color: `${txColor.hex}`,
                        }}
                    >
                        <b>{plateText}</b>
                    </p>
                </div>
            </div>

            <div className="flex justify-center w-full">
                <Input
                    className="w-fit"
                    label="License plate text"
                    placeholder="Enter license plate text"
                    value={plateText}
                    onValueChange={setPlateText}
                />
            </div>
            <div className="flex justify-center h-auto gap-6">
                <div className="text-center space-y-2">
                    <p className="font-bold text-large">Background color</p>
                    <ColorPicker
                        height={100}
                        hideInput={["hsv", "rgb"]}
                        hideAlpha={true}
                        color={bgColor}
                        onChange={setBGColor}
                    />
                </div>
                <div className="text-center space-y-2">
                    <p className="font-bold text-large">Text color</p>
                    <ColorPicker
                        height={100}
                        hideInput={["hsv", "rgb"]}
                        hideAlpha={true}
                        color={txColor}
                        onChange={setTxColor}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomLicensePlate;
