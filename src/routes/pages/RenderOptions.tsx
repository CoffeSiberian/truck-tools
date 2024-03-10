import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkModeContex";
import testImg from "../../static/img/testimg.webp";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Button,
} from "@nextui-org/react";

import TrailersOptions from "./TrailersOptions";

const RenderOptions = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { themeTatailwind } = useDarkMode();

    const styleBox = `flex flex-col ${themeTatailwind.secondary.main} place-self-center max-w-xs w-full rounded-lg border-2 border-transparent ${themeTatailwind.primary.border_color} shadow-2xl gap-1 mt-4 p-4`;

    const nexTime = <div className={styleBox}>Available soon</div>;

    const items = [
        { label: "Trailers", image: testImg },
        { label: "Truck", image: testImg },
        { label: "Profile", image: testImg },
        { label: "Settings", image: testImg },
    ];

    const renderCart = (
        key: number,
        name: string,
        img: string
    ): JSX.Element => {
        return (
            <Card key={key} className="py-4">
                <CardHeader className="overflow-visible py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={img}
                        width={300}
                    />
                </CardHeader>
                <CardBody className="pb-0 pt-2 px-4 flex-col items-center">
                    <h4 className="font-bold text-large">{name}</h4>
                </CardBody>
                <CardFooter className="flex-col items-center">
                    <Button onClick={() => setActiveIndex(key)}>Select</Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="flex row justify-center p-3">
            <div className="grid grid-cols-2 gap-5">
                {items.map((item, index) => {
                    return renderCart(index, item.label, item.image);
                })}
            </div>
            {activeIndex === 0 && <TrailersOptions />}
            {activeIndex === 1 && nexTime}
            {activeIndex === 2 && nexTime}
            {activeIndex === 3 && nexTime}
        </div>
    );
};

export default RenderOptions;
