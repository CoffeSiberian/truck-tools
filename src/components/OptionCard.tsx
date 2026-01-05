import { FC, JSX } from "react";

// UI
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

interface OptionCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	footerJsx: JSX.Element;
}

const OptionCard: FC<OptionCardProps> = ({
	title,
	description,
	image,
	footerJsx,
}) => {
	return (
		<Card className="w-full max-w-sm gap-1">
			<CardHeader className="flex-col items-start px-4 pt-2 pb-0">
				<h4 className="text-large font-bold">{title}</h4>
				<small className="text-default-500">{description}</small>
			</CardHeader>
			<CardBody className="flex aspect-video h-55 flex-row items-center py-2">
				<Image className="z-0" alt="Card background" src={image} />
			</CardBody>
			<Divider />
			<CardFooter className="flex justify-center">{footerJsx}</CardFooter>
		</Card>
	);
};

export default OptionCard;
