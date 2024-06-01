import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import RepairTruck from "./Modals/RepairTruck";

const TrucksOptions = () => {
    const items = [
        {
            id: "1",
            title: "Repair truck",
            description: "Repair all trucks in the garage",
            image: testImage,
            modal: <RepairTruck />,
        },
        {
            id: "2",
            title: "Repair all trucks",
            description: "Infinite fuel in the current truck",
            image: testImage,
            modal: <></>,
        },
        {
            id: "3",
            title: "Fill fuel",
            description: "Fill fuel in current truck",
            image: testImage,
            modal: <></>,
        },
        {
            id: "4",
            title: "Infinite fuel on current truck",
            description: "Fill fuel in current truck",
            image: testImage,
            modal: <></>,
        },
        {
            id: "5",
            title: "Fill all trucks fuel",
            description: "Fill fuel in current truck",
            image: testImage,
            modal: <></>,
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
                            footerJsx={item.modal}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TrucksOptions;
