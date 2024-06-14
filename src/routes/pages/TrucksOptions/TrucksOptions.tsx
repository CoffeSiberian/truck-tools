import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import RepairTruck from "./Modals/RepairTruck";
import RepairAllTrucks from "./Modals/RepairAllTrucks";
import FillTruckFuel from "./Modals/FillTruckFuel";
import SetInfiniteFuel from "./Modals/SetInfiniteFuel";
import FillAllTrucksFuel from "./Modals/FillAllTrucksFuel";
import EditLicensePlate from "./Modals/EditLicensePlate";
import SetTruckEngine from "./Modals/SetTruckEngine";
import SetTruckTransmission from "./Modals/SetTruckTransmission";

const TrucksOptions = () => {
	const items = [
		{
			id: "1",
			title: "Change truck engine",
			description: "Change the engine of the truck",
			image: testImage,
			modal: <SetTruckEngine />,
		},
		{
			id: "2",
			title: "Change truck transmission",
			description: "Change the transmission of the truck",
			image: testImage,
			modal: <SetTruckTransmission />,
		},
		{
			id: "3",
			title: "Change truck license plate",
			description: "Change the license plate of the truck",
			image: testImage,
			modal: <EditLicensePlate />,
		},
		{
			id: "4",
			title: "Repair truck",
			description: "Repair your current truck",
			image: testImage,
			modal: <RepairTruck />,
		},
		{
			id: "5",
			title: "Repair all trucks",
			description: "Repairs all fleet trucks",
			image: testImage,
			modal: <RepairAllTrucks />,
		},
		{
			id: "6",
			title: "Fill fuel",
			description: "Fill fuel in current truck",
			image: testImage,
			modal: <FillTruckFuel />,
		},
		{
			id: "7",
			title: "Fill all trucks fuel",
			description: "Refueling all fleet trucks",
			image: testImage,
			modal: <FillAllTrucksFuel />,
		},
		{
			id: "8",
			title: "Infinite fuel on current truck",
			description: "Infinite fuel on current truck",
			image: testImage,
			modal: <SetInfiniteFuel />,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="my-4 grid grid-cols-3 gap-4">
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
