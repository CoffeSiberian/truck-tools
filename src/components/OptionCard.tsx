import { FC } from "react";
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
        <Card className="gap-1 max-w-md w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{title}</h4>
                <small className="text-default-500">{description}</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex-col items-center">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src={image}
                    width={350}
                />
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-center">{footerJsx}</CardFooter>
        </Card>
    );
};

export default OptionCard;
