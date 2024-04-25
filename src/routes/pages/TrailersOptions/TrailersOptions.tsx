import { Button } from "@nextui-org/react";
import OptionCard from "../../../components/OptionCard";

import testImage from "../../../static/img/testimg.webp";
import { IconPencil } from "@tabler/icons-react";

const TrailersOptions = () => {
    const items = [
        {
            id: "1",
            title: "Modify Load",
            description: "Modify the load of the trailer",
            image: testImage,
        },
        {
            id: "2",
            title: "Unlock Current Trailer",
            description: "Unlock the current trailer",
            image: testImage,
        },
    ];

    return (
        <div className="flex gap-4 flex-col">
            <div className="flex my-4 gap-4">
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

export default TrailersOptions;
