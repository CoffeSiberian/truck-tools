import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import SetMoney from "./Modal/SetMoney";
import SetExperience from "./Modal/SetExperience";

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
