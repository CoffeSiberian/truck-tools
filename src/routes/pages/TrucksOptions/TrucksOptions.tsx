import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import OptionCard from "@/components/OptionCard";

// images
// ets2
import img1 from "@/static/img/ets2/OptionsImages/1.webp";
import img6 from "@/static/img/ets2/OptionsImages/6.webp";
import img7 from "@/static/img/ets2/OptionsImages/7.webp";
import img8 from "@/static/img/ets2/OptionsImages/8.webp";
import img9 from "@/static/img/ets2/OptionsImages/9.webp";
import img10 from "@/static/img/ets2/OptionsImages/10.webp";

// ats
import img6_ats from "@/static/img/ats/OptionsImages/6.webp";
import img7_ats from "@/static/img/ats/OptionsImages/7.webp";
import img8_ats from "@/static/img/ats/OptionsImages/8.webp";
import img9_ats from "@/static/img/ats/OptionsImages/9.webp";
import img10_ats from "@/static/img/ats/OptionsImages/10.webp";

// modals
import RepairTruck from "@/routes/pages/TrucksOptions/Modals/RepairTruck";
import RepairAllTrucks from "@/routes/pages/TrucksOptions/Modals/RepairAllTrucks";
import FillTruckFuel from "@/routes/pages/TrucksOptions/Modals/FillTruckFuel";
import SetInfiniteFuel from "@/routes/pages/TrucksOptions/Modals/SetInfiniteFuel";
import FillAllTrucksFuel from "@/routes/pages/TrucksOptions/Modals/FillAllTrucksFuel";
import EditLicensePlate from "@/routes/pages/TrucksOptions/Modals/EditLicensePlate";
import SetTruckEngine from "@/routes/pages/TrucksOptions/Modals/SetTruckEngine";
import ModifyKm from "@/routes/pages/TrucksOptions/Modals/ModifyKm";
import SetTruckTransmission from "@/routes/pages/TrucksOptions/Modals/SetTruckTransmission";

const TrucksOptions = () => {
	const { game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { trucks } = translations.menu_options;

	const items = [
		{
			id: "1",
			title: trucks.change_truck_engine.label_card,
			description: trucks.change_truck_engine.description_card,
			image: game === "ets2" ? img6 : img6_ats,
			modal: <SetTruckEngine />,
			disable: false,
		},
		{
			id: "2",
			title: trucks.change_truck_transmission.label_card,
			description: trucks.change_truck_transmission.description_card,
			image: game === "ets2" ? img7 : img7_ats,
			modal: <SetTruckTransmission />,
			disable: false,
		},
		{
			id: "3",
			title: trucks.license_plate.label_card,
			description: trucks.license_plate.description_card,
			image: img1,
			modal: <EditLicensePlate />,
			disable: game === "ets2" ? false : true,
		},
		{
			id: "4",
			title: trucks.repair_truck.label_card,
			description: trucks.repair_truck.description_card,
			image: game === "ets2" ? img8 : img8_ats,
			modal: <RepairTruck />,
			disable: false,
		},
		{
			id: "5",
			title: trucks.repair_all_trucks.label_card,
			description: trucks.repair_all_trucks.description_card,
			image: game === "ets2" ? img8 : img8_ats,
			modal: <RepairAllTrucks />,
			disable: false,
		},
		{
			id: "6",
			title: trucks.fill_fuel.label_card,
			description: trucks.fill_fuel.description_card,
			image: game === "ets2" ? img9 : img9_ats,
			modal: <FillTruckFuel />,
			disable: false,
		},
		{
			id: "7",
			title: trucks.fill_all_trucks_fuel.label_card,
			description: trucks.fill_all_trucks_fuel.description_card,
			image: game === "ets2" ? img9 : img9_ats,
			modal: <FillAllTrucksFuel />,
			disable: false,
		},
		{
			id: "8",
			title: "Change Km driven",
			description: "Change the mileage on your truck",
			image: game === "ets2" ? img9 : img9_ats,
			modal: <ModifyKm />,
			disable: false,
		},
		{
			id: "9",
			title: trucks.infinite_fuel.label_card,
			description: trucks.infinite_fuel.description_card,
			image: game === "ets2" ? img10 : img10_ats,
			modal: <SetInfiniteFuel />,
			disable: false,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="my-4 grid grid-cols-3 gap-4">
				{items.map((item) => {
					if (item.disable) return;

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
