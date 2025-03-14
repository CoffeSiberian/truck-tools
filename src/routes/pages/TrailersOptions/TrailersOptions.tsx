import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import OptionCard from "@/components/OptionCard";

// images
// ets2
import img2 from "@/static/img/ets2/OptionsImages/2.webp";
import img3 from "@/static/img/ets2/OptionsImages/3.webp";
import img4 from "@/static/img/ets2/OptionsImages/4.webp";
import img5 from "@/static/img/ets2/OptionsImages/5.webp";
import img17 from "@/static/img/ets2/OptionsImages/17.webp";
import img20 from "@/static/img/ets2/OptionsImages/20.webp";

// ats
import img3_ats from "@/static/img/ats/OptionsImages/3.webp";
import img4_ats from "@/static/img/ats/OptionsImages/4.webp";
import img5_ats from "@/static/img/ats/OptionsImages/5.webp";
import img17_ats from "@/static/img/ats/OptionsImages/17.webp";
import img20_ats from "@/static/img/ats/OptionsImages/20.webp";

// modals
import ModifyWeight from "@/routes/pages/TrailersOptions/Modals/ModifyWeight";
import UnlockTrailers from "@/routes/pages/TrailersOptions/Modals/UnlockTrailers";
import ModifyTrailerWeight from "@/routes/pages/TrailersOptions/Modals/ModifyTrailerWeight";
import EditLicensePlate from "@/routes/pages/TrailersOptions/Modals/EditLicensePlate";
import RepairTrailers from "@/routes/pages/TrailersOptions/Modals/RepairTrailer";
import RepairAllTrailers from "@/routes/pages/TrailersOptions/Modals/RepairAllTrailers";
import SetPlayerTrailer from "@/routes/pages/TrailersOptions/Modals/SetPlayerTrailer";

const TrailersOptions = () => {
	const { game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { trailers } = translations.menu_options;

	const items = [
		{
			id: "1",
			title: trailers.license_plate.label_card,
			description: trailers.license_plate.description_card,
			image: img2,
			modal: <EditLicensePlate />,
			disable: game === "ets2" ? false : true,
		},
		{
			id: "2",
			title: trailers.modify_job_weight.label_card,
			description: trailers.modify_job_weight.description_card,
			image: game === "ets2" ? img4 : img4_ats,
			modal: <ModifyWeight />,
			disable: false,
		},
		{
			id: "3",
			title: "Change Player Trailer",
			description:
				"Change the trailer you are currently carrying without going to the garage",
			image: game === "ets2" ? img20 : img20_ats,
			modal: <SetPlayerTrailer />,
			disable: false,
		},
		{
			id: "4",
			title: trailers.unlock_trailer_country.label_card,
			description: trailers.unlock_trailer_country.description_card,
			image: game === "ets2" ? img3 : img3_ats,
			modal: <UnlockTrailers />,
			disable: false,
		},
		{
			id: "5",
			title: trailers.modify_trailer_weight.label_card,
			description: trailers.modify_trailer_weight.description_card,
			image: game === "ets2" ? img5 : img5_ats,
			modal: <ModifyTrailerWeight />,
			disable: false,
		},
		{
			id: "6",
			title: trailers.repair_trailer.label_card,
			description: trailers.repair_trailer.description_card,
			image: game === "ets2" ? img17 : img17_ats,
			modal: <RepairTrailers />,
			disable: false,
		},
		{
			id: "7",
			title: trailers.repair_all_trailer.label_card,
			description: trailers.repair_all_trailer.description_card,
			image: game === "ets2" ? img17 : img17_ats,
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
