import { FC, JSX } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Image,
	Divider,
} from "@nextui-org/react";

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
			<CardHeader className="flex-col items-start px-4 pb-0 pt-2">
				<h4 className="text-large font-bold">{title}</h4>
				<small className="text-default-500">{description}</small>
			</CardHeader>
			<CardBody className="flex aspect-[16/9] h-[220px] flex-row items-center py-2">
				<Image className="z-0" alt="Card background" src={image} />
			</CardBody>
			<Divider />
			<CardFooter className="flex justify-center">{footerJsx}</CardFooter>
		</Card>
	);
};

export default OptionCard;
