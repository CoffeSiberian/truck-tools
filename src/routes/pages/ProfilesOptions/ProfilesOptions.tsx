import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import SetMoney from "./Modal/SetMoney";
import SetExperience from "./Modal/SetExperience";
import SetGarageStatus from "./Modal/SetGarageStatus";
import SetAllCitiesStatus from "./Modal/SetAllCitiesStatus";
import SetAllDealerStatus from "./Modal/SetAllDealerStatus";
import SetExperienceSkills from "./Modal/SetExperienceSkills";
import BackupProfile from "./Modal/BackupProfile";

const ProfilesOptions = () => {
	const items = [
		{
			id: "1",
			title: "Add money",
			description: "Add money to your profile",
			image: testImage,
			modal: <SetMoney />,
		},
		{
			id: "2",
			title: "Add experience",
			description: "Add experience to your profile",
			image: testImage,
			modal: <SetExperience />,
		},
		{
			id: "3",
			title: "Set any garages status",
			description: "Set any garages status to your profile",
			image: testImage,
			modal: <SetGarageStatus />,
		},
		{
			id: "4",
			title: "Set any city visited status",
			description: "Set any city visited status to your profile",
			image: testImage,
			modal: <SetAllCitiesStatus />,
		},
		{
			id: "5",
			title: "Set all dealer status",
			description: "Set all dealer status to your profile",
			image: testImage,
			modal: <SetAllDealerStatus />,
		},
		{
			id: "6",
			title: "Set experience skills",
			description: "Set experience skills to your profile",
			image: testImage,
			modal: <SetExperienceSkills />,
		},
		{
			id: "7",
			title: "Backup profile",
			description: "Backup your profile",
			image: testImage,
			modal: <BackupProfile />,
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
