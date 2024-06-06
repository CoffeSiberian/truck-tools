import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import RepairTruck from "./Modals/RepairTruck";
import RepairAllTrucks from "./Modals/RepairAllTrucks";
import FillTruckFuel from "./Modals/FillTruckFuel";
import SetInfiniteFuel from "./Modals/SetInfiniteFuel";
import FillAllTrucksFuel from "./Modals/FillAllTrucksFuel";

const TrucksOptions = () => {
    const items = [
        {
            id: "1",
            title: "Repair truck",
            description: "Repair your current truck",
            image: testImage,
            modal: <RepairTruck />,
        },
        {
            id: "2",
            title: "Repair all trucks",
            description: "Repairs all fleet trucks",
            image: testImage,
            modal: <RepairAllTrucks />,
        },
        {
            id: "3",
            title: "Fill fuel",
            description: "Fill fuel in current truck",
            image: testImage,
            modal: <FillTruckFuel />,
        },
        {
            id: "4",
            title: "Fill all trucks fuel",
            description: "Refueling all fleet trucks",
            image: testImage,
            modal: <FillAllTrucksFuel />,
        },
        {
            id: "5",
            title: "Infinite fuel on current truck",
            description: "Infinite fuel on current truck",
            image: testImage,
            modal: <SetInfiniteFuel />,
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
