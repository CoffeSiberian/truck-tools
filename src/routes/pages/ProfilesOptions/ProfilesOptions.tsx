import { useContext } from "react";

// UI
import OptionCard from "@/components/OptionCard";

// Modals
import SetMoney from "@/routes/pages/ProfilesOptions/Modal/SetMoney";
import SetExperience from "@/routes/pages/ProfilesOptions/Modal/SetExperience";
import SetGarageStatus from "@/routes/pages/ProfilesOptions/Modal/SetGarageStatus";
import SetAllCitiesStatus from "@/routes/pages/ProfilesOptions/Modal/SetAllCitiesStatus";
import SetAllDealerStatus from "@/routes/pages/ProfilesOptions/Modal/SetAllDealerStatus";
import SetExperienceSkills from "@/routes/pages/ProfilesOptions/Modal/SetExperienceSkills";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Images
// ets2
import img11 from "@/static/img/ets2/OptionsImages/11.webp";
import img12 from "@/static/img/ets2/OptionsImages/12.webp";
import img13 from "@/static/img/ets2/OptionsImages/13.webp";
import img14 from "@/static/img/ets2/OptionsImages/14.webp";
import img15 from "@/static/img/ets2/OptionsImages/15.webp";
import img16 from "@/static/img/ets2/OptionsImages/16.webp";

// ats
import img14_ats from "@/static/img/ats/OptionsImages/14.webp";
import img15_ats from "@/static/img/ats/OptionsImages/15.webp";

const ProfilesOptions = () => {
	const { game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { profile } = translations.menu_options;

	const items = [
		{
			id: "1",
			title: profile.add_money.label_card,
			description: profile.add_money.description_card,
			image: img11,
			modal: <SetMoney />,
		},
		{
			id: "2",
			title: profile.add_experience.label_card,
			description: profile.add_experience.description_card,
			image: img12,
			modal: <SetExperience />,
		},
		{
			id: "3",
			title: profile.garage_status.label_card,
			description: profile.garage_status.description_card,
			image: img13,
			modal: <SetGarageStatus />,
		},
		{
			id: "4",
			title: profile.visited_cities.label_card,
			description: profile.visited_cities.description_card,
			image: game === "ets2" ? img14 : img14_ats,
			modal: <SetAllCitiesStatus />,
		},
		{
			id: "5",
			title: profile.dealer_visited.label_card,
			description: profile.dealer_visited.description_card,
			image: game === "ets2" ? img15 : img15_ats,
			modal: <SetAllDealerStatus />,
		},
		{
			id: "6",
			title: profile.skills_points.label_card,
			description: profile.skills_points.description_card,
			image: img16,
			modal: <SetExperienceSkills />,
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

export default ProfilesOptions;
