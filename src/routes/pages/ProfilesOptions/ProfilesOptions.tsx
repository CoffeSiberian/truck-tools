import { useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";

import OptionCard from "@/components/OptionCard";

// images
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

// modals
import SetMoney from "@/routes/pages/ProfilesOptions/Modal/SetMoney";
import SetExperience from "@/routes/pages/ProfilesOptions/Modal/SetExperience";
import SetGarageStatus from "@/routes/pages/ProfilesOptions/Modal/SetGarageStatus";
import SetAllCitiesStatus from "@/routes/pages/ProfilesOptions/Modal/SetAllCitiesStatus";
import SetAllDealerStatus from "@/routes/pages/ProfilesOptions/Modal/SetAllDealerStatus";
import SetExperienceSkills from "@/routes/pages/ProfilesOptions/Modal/SetExperienceSkills";

const ProfilesOptions = () => {
	const { game } = useContext(ProfileContex);

	const items = [
		{
			id: "1",
			title: "Add money",
			description: "Add money to your profile",
			image: img11,
			modal: <SetMoney />,
		},
		{
			id: "2",
			title: "Add experience",
			description: "Add experience to your profile",
			image: img12,
			modal: <SetExperience />,
		},
		{
			id: "3",
			title: "Set any garages status",
			description: "Set any garages status to your profile",
			image: img13,
			modal: <SetGarageStatus />,
		},
		{
			id: "4",
			title: "Set any city visited status",
			description: "Set any city visited status to your profile",
			image: game === "ets2" ? img14 : img14_ats,
			modal: <SetAllCitiesStatus />,
		},
		{
			id: "5",
			title: "Set all dealer status",
			description: "Set all dealer status to your profile",
			image: game === "ets2" ? img15 : img15_ats,
			modal: <SetAllDealerStatus />,
		},
		{
			id: "6",
			title: "Set experience skills",
			description: "Set experience skills to your profile",
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
