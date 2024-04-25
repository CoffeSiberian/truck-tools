import { Button } from "@nextui-org/react";
import OptionCard from "../../../components/OptionCard";

// icons
import { IconPencil } from "@tabler/icons-react";

// images
import testImage from "../../../static/img/testimg.webp";

const TrucksOptions = () => {
    const items = [
        {
            id: "1",
            title: "Repair all Trucks",
            description: "Repair all trucks in the garage",
            image: testImage,
        },
        {
            id: "2",
            title: "Infinite fuel in the current truck",
            description: "Infinite fuel in the current truck",
            image: testImage,
        },
        {
            id: "3",
            title: "Fill fuel of all trucks",
            description: "Fill fuel in current truck",
            image: testImage,
        },
    ];

    return (
        <div className="flex gap-4 flex-col">
            <div className="grid grid-cols-3 my-4 gap-4">
                {items.map((item) => {
                    return (
                        <OptionCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            footerJsx={
                                <Button
                                    endContent={<IconPencil stroke={2} />}
                                    color="primary"
                                    variant="shadow"
                                >
                                    Open
                                </Button>
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TrucksOptions;
