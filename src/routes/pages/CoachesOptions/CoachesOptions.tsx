import { useContext } from "react";
import OptionCard from "@/components/OptionCard";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { ProfileContex } from "@/hooks/useProfileContex";
import CoachModal, { CoachAction } from "./CoachModal";
import CoachJobModal from "./CoachJobModal";
import plateImage from "@/static/img/ets2/OptionsImages/25.webp";
import repairImage from "@/static/img/ets2/OptionsImages/28.webp";
import mileageImage from "@/static/img/ets2/OptionsImages/27.webp";
import coachImage from "@/static/img/ets2/OptionsImages/22.webp";
import engineImage from "@/static/img/ets2/OptionsImages/23.webp";
import transmissionImage from "@/static/img/ets2/OptionsImages/24.webp";
import paintImage from "@/static/img/ets2/OptionsImages/26.webp";

const CoachesOptions = () => {
	const { translations } = useContext(LocaleContext);
	const { selectedSave } = useContext(ProfileContex);
	const { coaches } = translations.menu_options;
	const items: { action: CoachAction; image: string }[] = [
		{ action: "change_engine", image: engineImage },
		{
			action: "change_transmission",
			image: transmissionImage,
		},
		{ action: "license_plate", image: plateImage },
		{ action: "paint_job", image: paintImage },
		{ action: "change_km", image: mileageImage },
		{ action: "repair_coach", image: repairImage },
		{ action: "repair_all_coaches", image: repairImage },
	];
	return (
		<div className="flex flex-col gap-4">
			<div className="my-4 grid grid-cols-3 gap-4">
				<OptionCard
					id="coach_job_generator"
					title={coaches.job_generator.label_card}
					description={coaches.job_generator.description_card}
					image={coachImage}
					footerJsx={<CoachJobModal key={selectedSave?.dir} />}
				/>
				{items.map(({ action, image }) => (
					<OptionCard
						key={action}
						id={action}
						title={coaches[action].label_card}
						description={coaches[action].description_card}
						image={image}
						footerJsx={<CoachModal key={selectedSave?.dir} action={action} />}
					/>
				))}
			</div>
		</div>
	);
};

export default CoachesOptions;
