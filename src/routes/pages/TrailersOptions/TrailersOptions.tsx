import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import OptionCard from "@/components/OptionCard";

// images
import img2 from "@/static/img/ets2/OptionsImages/2.webp";
import img3 from "@/static/img/ets2/OptionsImages/3.webp";
import img4 from "@/static/img/ets2/OptionsImages/4.webp";
import img5 from "@/static/img/ets2/OptionsImages/5.webp";
import img17 from "@/static/img/ets2/OptionsImages/17.webp";

// modals
import ModifyWeight from "@/routes/pages/TrailersOptions/Modals/ModifyWeight";
import UnlockTrailers from "@/routes/pages/TrailersOptions/Modals/UnlockTrailers";
import ModifyTrailerWeight from "@/routes/pages/TrailersOptions/Modals/ModifyTrailerWeight";
import EditLicensePlate from "@/routes/pages/TrailersOptions/Modals/EditLicensePlate";
import RepairTrailers from "@/routes/pages/TrailersOptions/Modals/RepairTrailer";
import RepairAllTrailers from "@/routes/pages/TrailersOptions/Modals/RepairAllTrailers";

const TrailersOptions = () => {
	const { game } = useContext(ProfileContex);

	const items = [
		{
			id: "1",
			title: "Change trailer license plate",
			description: "Change the license plate of the trailer",
			image: img2,
			modal: <EditLicensePlate />,
			disable: game === "ets2" ? false : true,
		},
		{
			id: "2",
			title: "Modify job weight",
			description: "Modify the weight of your current job",
			image: img4,
			modal: <ModifyWeight />,
			disable: false,
		},
		{
			id: "3",
			title: "Trailer unblocking by country",
			description: "Unlock regional blocking of trailers",
			image: img3,
			modal: <UnlockTrailers />,
			disable: false,
		},
		{
			id: "4",
			title: "Change trailer weight",
			description: "Modifies the trailer weight, applying it only once.",
			image: img5,
			modal: <ModifyTrailerWeight />,
			disable: false,
		},
		{
			id: "5",
			title: "Repair trailer",
			description: "Repair current trailer",
			image: img17,
			modal: <RepairTrailers />,
			disable: false,
		},
		{
			id: "6",
			title: "Repair all trailers",
			description: "Repair all the trailers you have",
			image: img17,
			modal: <RepairAllTrailers />,
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

export default TrailersOptions;
